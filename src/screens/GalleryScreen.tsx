import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { apiClient, toAbsoluteUrl } from '../api/client';
import type { GalleryRow } from '../types';
import { Loading } from '../components/Loading';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');
const imageSize = (width - SPACING.md * 3) / 2;

export const GalleryScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryRow | null>(null);

  const loadData = async () => {
    try {
      const galleryData = await apiClient.getGallery();
      setGallery(galleryData);
    } catch (error) {
      console.error('Error loading gallery:', error);
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
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
          />
        }>
        <View style={styles.grid}>
          {gallery.length === 0 ? (
            <Text style={styles.emptyText}>No images in gallery</Text>
          ) : (
            gallery.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.imageContainer}
                onPress={() => setSelectedImage(item)}>
                <Image
                  source={{ uri: toAbsoluteUrl(item.image_url) }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {item.title && (
                  <View style={styles.overlay}>
                    <Text style={styles.imageTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}>
            {selectedImage && (
              <>
                <Image
                  source={{ uri: toAbsoluteUrl(selectedImage.image_url) }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                {selectedImage.title && (
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedImage(null)}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    margin: SPACING.xs,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 20, 48, 0.8)',
    padding: SPACING.sm,
  },
  imageTitle: {
    color: COLORS.sand,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SPACING.xl,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  modalTitleContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 20, 48, 0.9)',
    padding: SPACING.md,
  },
  modalTitle: {
    color: COLORS.sand,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '300',
  },
});
