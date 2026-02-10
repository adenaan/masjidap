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

// Helper function for fetch requests
async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

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
    return await fetchApi<SiteConfigRow>('/content/site');
  },

  // Events
  getEvents: async (): Promise<EventRow[]> => {
    const data = await fetchApi<EventRow[]>('/events');
    return data || [];
  },

  // Programs
  getPrograms: async (): Promise<ProgramRow[]> => {
    const data = await fetchApi<ProgramRow[]>('/programs');
    return data || [];
  },

  // Contacts
  getContacts: async (): Promise<ContactRow[]> => {
    const data = await fetchApi<ContactRow[]>('/contacts');
    return data || [];
  },

  // Gallery
  getGallery: async (): Promise<GalleryRow[]> => {
    const data = await fetchApi<GalleryRow[]>('/gallery');
    return data || [];
  },

  // Footer links
  getFooterLinks: async (): Promise<FooterLinkRow[]> => {
    const data = await fetchApi<FooterLinkRow[]>('/footer-links');
    return data || [];
  },

  // Announcements - public endpoint
  getAnnouncements: async (): Promise<AnnouncementRow[]> => {
    const data = await fetchApi<AnnouncementRow[]>('/announcements');
    return data || [];
  },

  // Single announcement by slug
  getAnnouncementBySlug: async (slug: string): Promise<AnnouncementRow | null> => {
    return await fetchApi<AnnouncementRow>(`/announcements/${slug}`);
  },

  // Announcement categories
  getAnnouncementCategories: async (): Promise<AnnouncementCategoryRow[]> => {
    const data = await fetchApi<AnnouncementCategoryRow[]>('/announcement-categories');
    return data || [];
  },
};