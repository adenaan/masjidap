import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { apiClient } from '../api/client';
import type { SiteConfigRow, ContactRow } from '../types';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export const AboutScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfigRow | null>(null);
  const [contacts, setContacts] = useState<ContactRow[]>([]);

  const loadData = async () => {
    try {
      const [config, contactsData] = await Promise.all([
        apiClient.getSiteConfig(),
        apiClient.getContacts(),
      ]);

      setSiteConfig(config);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading about data:', error);
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

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleDirections = () => {
    if (siteConfig?.brand_address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        siteConfig.brand_address
      )}`;
      Linking.openURL(url);
    }
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
      {/* About Section */}
      {siteConfig?.about_text && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Card>
            <Text style={styles.aboutText}>{siteConfig.about_text}</Text>
          </Card>
        </View>
      )}

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Card>
          {siteConfig?.brand_address && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={handleDirections}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📍</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>{siteConfig.brand_address}</Text>
                <Text style={styles.linkText}>Get Directions →</Text>
              </View>
            </TouchableOpacity>
          )}

          {siteConfig?.brand_phone && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handleCall(siteConfig.brand_phone)}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📞</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{siteConfig.brand_phone}</Text>
                <Text style={styles.linkText}>Call Now →</Text>
              </View>
            </TouchableOpacity>
          )}

          {siteConfig?.brand_email && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handleEmail(siteConfig.brand_email)}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>✉️</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{siteConfig.brand_email}</Text>
                <Text style={styles.linkText}>Send Email →</Text>
              </View>
            </TouchableOpacity>
          )}
        </Card>
      </View>

      {/* Team Contacts */}
      {contacts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.role && (
                <Text style={styles.contactRole}>{contact.role}</Text>
              )}
              {contact.phone && (
                <TouchableOpacity
                  style={styles.contactDetail}
                  onPress={() => handleCall(contact.phone)}>
                  <Text style={styles.icon}>📞</Text>
                  <Text style={styles.contactDetailText}>{contact.phone}</Text>
                </TouchableOpacity>
              )}
              {contact.email && (
                <TouchableOpacity
                  style={styles.contactDetail}
                  onPress={() => handleEmail(contact.email)}>
                  <Text style={styles.icon}>✉️</Text>
                  <Text style={styles.contactDetailText}>{contact.email}</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Donations Section */}
      {siteConfig?.donations_title && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{siteConfig.donations_title}</Text>
          <Card style={styles.donationsCard}>
            {siteConfig.donations_body && (
              <Text style={styles.donationsBody}>{siteConfig.donations_body}</Text>
            )}
            {siteConfig.donations_details && (
              <View style={styles.donationsDetails}>
                <Text style={styles.donationsDetailsText}>
                  {siteConfig.donations_details}
                </Text>
              </View>
            )}
          </Card>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  aboutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    lineHeight: 24,
  },
  contactRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  contactValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    marginBottom: SPACING.xs,
  },
  linkText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    fontWeight: '600',
  },
  contactName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.xs,
  },
  contactRole: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gold,
    marginBottom: SPACING.md,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  contactDetailText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    marginLeft: SPACING.sm,
  },
  donationsCard: {
    backgroundColor: COLORS.ink,
  },
  donationsBody: {
    fontSize: FONT_SIZES.md,
    color: COLORS.sand,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  donationsDetails: {
    backgroundColor: COLORS.gold,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  donationsDetailsText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    fontWeight: '600',
  },
});
