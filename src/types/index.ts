export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}