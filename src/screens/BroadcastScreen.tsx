import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { apiClient } from '../api/client';
import type { SiteConfigRow } from '../types';
import { Loading } from '../components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

export const BroadcastScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfigRow | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const config = await apiClient.getSiteConfig();
      setSiteConfig(config);
    } catch (error) {
      console.error('Error loading broadcast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbedUrl = (url: string): string => {
    const cleanUrl = url.trim();
    
    // YouTube
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      const videoId = cleanUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`;
      }
    }
    
    // Facebook - try to extract video embed
    if (cleanUrl.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        cleanUrl
      )}&show_text=false&autoplay=false`;
    }
    
    // Return original URL if no special handling needed
    return cleanUrl;
  };

  if (loading) {
    return <Loading />;
  }

  const videoUrl =
    siteConfig?.live_video_url || siteConfig?.fallback_video_url || '';

  if (!videoUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.noVideo}>
          <Text style={styles.noVideoText}>No broadcast available</Text>
        </View>
      </View>
    );
  }

  const embedUrl = getVideoEmbedUrl(videoUrl);

  return (
    <ScrollView style={styles.container}>
      {/* Broadcast Info */}
      <View style={styles.header}>
        {siteConfig?.broadcast_name && (
          <Text style={styles.broadcastName}>{siteConfig.broadcast_name}</Text>
        )}
        {siteConfig?.broadcast_date && siteConfig?.broadcast_time && (
          <Text style={styles.broadcastTime}>
            {siteConfig.broadcast_date} at {siteConfig.broadcast_time}
          </Text>
        )}
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {videoLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.gold} />
          </View>
        )}
        <WebView
          source={{ uri: embedUrl }}
          style={styles.video}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadStart={() => setVideoLoading(true)}
          onLoadEnd={() => setVideoLoading(false)}
        />
      </View>

      {/* Additional Info */}
      <View style={styles.info}>
        <Text style={styles.infoTitle}>Live Broadcast</Text>
        <Text style={styles.infoText}>
          Join us for our live broadcasts and stay connected with your community.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.ink,
  },
  broadcastName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: SPACING.xs,
  },
  broadcastTime: {
    fontSize: FONT_SIZES.md,
    color: COLORS.sand,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    zIndex: 1,
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  noVideoText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray,
    textAlign: 'center',
  },
  info: {
    padding: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    lineHeight: 24,
  },
});
