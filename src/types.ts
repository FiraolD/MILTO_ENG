export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  location: string;
  year: string;
  category: string;
  description: string;
  brief_description?: string;
  video_url?: string;
  images: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
}

export interface StatCounter {
  label: string;
  value: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

// --- CMS Types ---

export type UserRole = 'admin' | 'editor' | null;

export interface CmsTextBlock {
  id: string;
  section: string;
  key: string;
  value: string;
}

export interface SeoMeta {
  id: string;
  route: string;
  title: string;
  description: string;
  og_image: string;
  keywords: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface MediaAsset {
  id: string;
  alt: string;
  url: string;
  section: string;
  sort_order: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AdminSession {
  user: { id: string; email: string } | null;
  role: UserRole;
  loading: boolean;
}

// --- Gallery ---

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video";
  url: string;
  thumbnail_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// --- Announcements ---

export type AnnouncementType = "vacancy" | "bid";

export interface Announcement {
  id: string;
  slug: string;
  type: AnnouncementType;
  title: string;
  description: string;
  content: string;
  deadline_date: string | null;
  attachment_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- News Article ---

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  type: string;
  image_url: string;
  video_url: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}