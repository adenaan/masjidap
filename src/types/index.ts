export type Role = 'super_admin' | 'admin';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type SiteConfigRow = {
  id: number;
  brand_name: string;
  brand_subtitle: string;
  brand_est: string;
  brand_address: string;
  brand_email: string;
  brand_phone: string;
  logo_url: string;
  hero_headline: string;
  hero_body: string;
  hero_image_url: string;
  hero_image_fallback_url: string;
  live_video_url: string;
  fallback_video_url: string;
  broadcast_name: string;
  broadcast_date: string;
  broadcast_time: string;
  about_text: string;
  donations_title: string;
  donations_body: string;
  donations_details: string;
};

export type EventRow = {
  id: string;
  title: string;
  kind: 'oneoff' | 'recurring';
  event_date: string;
  event_time: string;
  when_text: string;
  note: string;
  created_at: string;
};

export type ProgramRow = {
  id: string;
  title: string;
  grades: string;
  description: string;
  days: string;
  time: string;
  note: string;
  created_at: string;
};

export type ContactRow = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type GalleryRow = {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
};

export type FooterLinkRow = {
  id: string;
  label: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type AnnouncementStatus = 'draft' | 'published';

export type AnnouncementCategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  excerpt: string;
  status: AnnouncementStatus;
  pinned: number | boolean;
  publish_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  categories?: AnnouncementCategoryRow[];
  featured_image_url?: string | null;
};

export type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: number | boolean;
  created_at: string;
  updated_at: string;
};
