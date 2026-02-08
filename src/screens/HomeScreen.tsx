import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { apiClient, toAbsoluteUrl } from '../api/client';
import type { SiteConfigRow, AnnouncementRow, EventRow } from '../types';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { formatDate, stripHtml, truncate } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfigRow | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);

  const loadData = async () => {
    try {
      const [config, announcementsData, eventsData] = await Promise.all([
        apiClient.getSiteConfig(),
        apiClient.getAnnouncements(),
        apiClient.getEvents(),
      ]);

      setSiteConfig(config);
      setAnnouncements(announcementsData.slice(0, 5)); // Show latest 5
      setEvents(eventsData.slice(0, 3)); // Show next 3 events
    } catch (error) {
      console.error('Error loading home data:', error);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.gold}
        />
      }>
      {/* Hero Section */}
      <View style={styles.hero}>
        {siteConfig?.hero_image_url && (
          <Image
            source={{ uri: toAbsoluteUrl(siteConfig.hero_image_url) }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.heroOverlay}>
          <View style={styles.logoContainer}>
            {siteConfig?.logo_url && (
              <Image
                source={{ uri: toAbsoluteUrl(siteConfig.logo_url) }}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.heroTitle}>{siteConfig?.brand_name || 'Masjid Al Taubah'}</Text>
          <Text style={styles.heroSubtitle}>{siteConfig?.brand_subtitle || ''}</Text>
          <Text style={styles.heroEst}>Est. {siteConfig?.brand_est || ''}</Text>
        </View>
      </View>

      {/* Welcome Message */}
      {siteConfig?.hero_headline && (
        <View style={styles.section}>
          <Text style={styles.welcomeTitle}>{siteConfig.hero_headline}</Text>
          {siteConfig?.hero_body && (
            <Text style={styles.welcomeText}>{siteConfig.hero_body}</Text>
          )}
        </View>
      )}

      {/* Live Broadcast Button */}
      {siteConfig?.live_video_url && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.liveButton}
            onPress={() => navigation.navigate('Broadcast')}>
            <View style={styles.liveDot} />
            <Text style={styles.liveButtonText}>WATCH LIVE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Latest Announcements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {announcements.length === 0 ? (
          <Text style={styles.emptyText}>No announcements yet</Text>
        ) : (
          announcements.map((announcement) => (
            <Card
              key={announcement.id}
              onPress={() =>
                navigation.navigate('AnnouncementDetail', { announcement })
              }>
              {announcement.featured_image_url && (
                <Image
                  source={{ uri: toAbsoluteUrl(announcement.featured_image_url) }}
                  style={styles.announcementImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.announcementContent}>
                {announcement.pinned && (
                  <View style={styles.pinnedBadge}>
                    <Text style={styles.pinnedText}>PINNED</Text>
                  </View>
                )}
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementExcerpt}>
                  {truncate(stripHtml(announcement.excerpt || announcement.content_html), 120)}
                </Text>
                <Text style={styles.announcementDate}>
                  {formatDate(announcement.publish_at || announcement.created_at)}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {events.map((event) => (
            <Card key={event.id}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>
                {event.when_text || `${formatDate(event.event_date)} at ${event.event_time}`}
              </Text>
              {event.note && <Text style={styles.eventNote}>{event.note}</Text>}
            </Card>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {siteConfig?.brand_name || 'Masjid Al Taubah'}
        </Text>
        <Text style={styles.footerText}>{siteConfig?.brand_address || ''}</Text>
        {siteConfig?.brand_phone && (
          <Text style={styles.footerText}>{siteConfig.brand_phone}</Text>
        )}
        {siteConfig?.brand_email && (
          <Text style={styles.footerText}>{siteConfig.brand_email}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  hero: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 20, 48, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: SPACING.md,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.sand,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroEst: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.sand,
    textAlign: 'center',
  },
  section: {
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.ink,
  },
  seeAllText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gold,
    fontWeight: '600',
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    lineHeight: 24,
  },
  liveButton: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.lg,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginRight: SPACING.sm,
  },
  liveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  announcementImage: {
    width: '100%',
    height: 180,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  announcementContent: {
    gap: SPACING.xs,
  },
  pinnedBadge: {
    backgroundColor: COLORS.gold,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  pinnedText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.ink,
  },
  announcementTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.ink,
  },
  announcementExcerpt: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    lineHeight: 22,
  },
  announcementDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  eventTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: SPACING.xs,
  },
  eventDate: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gold,
    marginBottom: SPACING.xs,
  },
  eventNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SPACING.xl,
  },
  footer: {
    backgroundColor: COLORS.ink,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.sand,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
});
