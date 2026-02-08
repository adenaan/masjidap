import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { apiClient, toAbsoluteUrl } from '../api/client';
import type { AnnouncementRow, AnnouncementCategoryRow } from '../types';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { formatDate, stripHtml, truncate } from '../utils/helpers';

interface AnnouncementsScreenProps {
  navigation: any;
}

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [categories, setCategories] = useState<AnnouncementCategoryRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [announcementsData, categoriesData] = await Promise.all([
        apiClient.getAnnouncements(),
        apiClient.getAnnouncementCategories(),
      ]);

      setAnnouncements(announcementsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredAnnouncements = selectedCategory
    ? announcements.filter((a) =>
        a.categories?.some((c) => c.id === selectedCategory)
      )
    : announcements;

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}>
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.categoryTextActive,
              ]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Announcements List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
          />
        }>
        <View style={styles.listContainer}>
          {filteredAnnouncements.length === 0 ? (
            <Text style={styles.emptyText}>No announcements found</Text>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                onPress={() =>
                  navigation.navigate('AnnouncementDetail', { announcement })
                }>
                {announcement.featured_image_url && (
                  <Image
                    source={{
                      uri: toAbsoluteUrl(announcement.featured_image_url),
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.content}>
                  {announcement.pinned && (
                    <View style={styles.pinnedBadge}>
                      <Text style={styles.pinnedText}>PINNED</Text>
                    </View>
                  )}
                  <Text style={styles.title}>{announcement.title}</Text>
                  <Text style={styles.excerpt}>
                    {truncate(
                      stripHtml(announcement.excerpt || announcement.content_html),
                      150
                    )}
                  </Text>
                  <View style={styles.footer}>
                    <Text style={styles.date}>
                      {formatDate(announcement.publish_at || announcement.created_at)}
                    </Text>
                    {announcement.categories && announcement.categories.length > 0 && (
                      <View style={styles.categories}>
                        {announcement.categories.slice(0, 2).map((cat) => (
                          <View key={cat.id} style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>{cat.name}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  categoryContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryContent: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.gold,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray,
  },
  categoryTextActive: {
    color: COLORS.ink,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: SPACING.md,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  content: {
    gap: SPACING.xs,
  },
  pinnedBadge: {
    backgroundColor: COLORS.gold,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  pinnedText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.ink,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.ink,
  },
  excerpt: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  categories: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  categoryTag: {
    backgroundColor: COLORS.ink2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryTagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
