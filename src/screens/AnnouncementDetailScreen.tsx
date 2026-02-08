import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { toAbsoluteUrl } from '../api/client';
import type { AnnouncementRow } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { formatDate } from '../utils/helpers';

interface AnnouncementDetailScreenProps {
  route: {
    params: {
      announcement: AnnouncementRow;
    };
  };
}

export const AnnouncementDetailScreen: React.FC<AnnouncementDetailScreenProps> = ({
  route,
}) => {
  const { announcement } = route.params;
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.container}>
      {announcement.featured_image_url && (
        <Image
          source={{ uri: toAbsoluteUrl(announcement.featured_image_url) }}
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

        <View style={styles.meta}>
          <Text style={styles.date}>
            {formatDate(announcement.publish_at || announcement.created_at)}
          </Text>
          {announcement.categories && announcement.categories.length > 0 && (
            <View style={styles.categories}>
              {announcement.categories.map((cat) => (
                <View key={cat.id} style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{cat.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <RenderHTML
          contentWidth={width - SPACING.md * 2}
          source={{ html: announcement.content_html }}
          tagsStyles={{
            body: {
              fontSize: FONT_SIZES.md,
              color: COLORS.ink,
              lineHeight: 24,
            },
            p: {
              marginBottom: SPACING.md,
            },
            h1: {
              fontSize: FONT_SIZES.xxl,
              fontWeight: '700',
              color: COLORS.ink,
              marginTop: SPACING.lg,
              marginBottom: SPACING.md,
            },
            h2: {
              fontSize: FONT_SIZES.xl,
              fontWeight: '700',
              color: COLORS.ink,
              marginTop: SPACING.md,
              marginBottom: SPACING.sm,
            },
            h3: {
              fontSize: FONT_SIZES.lg,
              fontWeight: '600',
              color: COLORS.ink,
              marginTop: SPACING.md,
              marginBottom: SPACING.sm,
            },
            a: {
              color: COLORS.gold,
              textDecorationLine: 'underline',
            },
            ul: {
              marginBottom: SPACING.md,
            },
            ol: {
              marginBottom: SPACING.md,
            },
            li: {
              marginBottom: SPACING.xs,
            },
            blockquote: {
              borderLeftWidth: 4,
              borderLeftColor: COLORS.gold,
              paddingLeft: SPACING.md,
              marginLeft: SPACING.sm,
              fontStyle: 'italic',
              color: COLORS.gray,
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: SPACING.md,
  },
  pinnedBadge: {
    backgroundColor: COLORS.gold,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  pinnedText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.ink,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginBottom: SPACING.lg,
  },
});
