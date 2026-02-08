import axios from 'axios';
import type {
  SiteConfigRow,
  EventRow,
  ProgramRow,
  ContactRow,
  GalleryRow,
  FooterLinkRow,
  AnnouncementRow,
  AnnouncementCategoryRow,
} from '../types';

export const API_BASE = 'https://masjidaltaubah.co.za/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Helper function to convert relative URLs to absolute
export function toAbsoluteUrl(url: string): string {
  const u = String(url || '').trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) {
    const origin = API_BASE.replace(/\/api\/?$/i, '');
    return origin + u;
  }
  return u;
}

// Public API calls (no auth required)
export const apiClient = {
  // Site configuration
  getSiteConfig: async (): Promise<SiteConfigRow | null> => {
    try {
      const response = await api.get<ApiResponse<SiteConfigRow>>('/content/site');
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching site config:', error);
      return null;
    }
  },

  // Events
  getEvents: async (): Promise<EventRow[]> => {
    try {
      const response = await api.get<ApiResponse<EventRow[]>>('/events');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Programs
  getPrograms: async (): Promise<ProgramRow[]> => {
    try {
      const response = await api.get<ApiResponse<ProgramRow[]>>('/programs');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  },

  // Contacts
  getContacts: async (): Promise<ContactRow[]> => {
    try {
      const response = await api.get<ApiResponse<ContactRow[]>>('/contacts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  },

  // Gallery
  getGallery: async (): Promise<GalleryRow[]> => {
    try {
      const response = await api.get<ApiResponse<GalleryRow[]>>('/gallery');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
  },

  // Footer links
  getFooterLinks: async (): Promise<FooterLinkRow[]> => {
    try {
      const response = await api.get<ApiResponse<FooterLinkRow[]>>('/footer-links');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching footer links:', error);
      return [];
    }
  },

  // Announcements - public endpoint
  getAnnouncements: async (): Promise<AnnouncementRow[]> => {
    try {
      const response = await api.get<ApiResponse<AnnouncementRow[]>>('/announcements');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  // Single announcement by slug
  getAnnouncementBySlug: async (slug: string): Promise<AnnouncementRow | null> => {
    try {
      const response = await api.get<ApiResponse<AnnouncementRow>>(`/announcements/${slug}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      return null;
    }
  },

  // Announcement categories
  getAnnouncementCategories: async (): Promise<AnnouncementCategoryRow[]> => {
    try {
      const response = await api.get<ApiResponse<AnnouncementCategoryRow[]>>('/announcement-categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching announcement categories:', error);
      return [];
    }
  },
};
