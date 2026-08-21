/**
 * MILTO ENGINEERING – Frontend API Client
 *
 * Replaces the Supabase JS SDK with a lightweight fetch wrapper
 * that talks to the Express backend. Handles JWT token storage,
 * automatic Authorization headers, and JSON parsing.
 */

const API_BASE = "/api";
const TOKEN_KEY = "milto_auth_token";

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------
interface ApiError {
  error: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set JSON content-type for non-FormData bodies (multipart uploads
  // need the browser to set its own boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Convenience methods
// ---------------------------------------------------------------------------
export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  setToken(data.token);
  return data;
}

export async function verifyToken(): Promise<{ user: AuthUser }> {
  return api.get<{ user: AuthUser }>("/auth/verify");
}

export async function signOut(): Promise<void> {
  clearToken();
}

// ---------------------------------------------------------------------------
// Resource helpers (generic CRUD)
// ---------------------------------------------------------------------------
export function resource<T>(name: string) {
  return {
    list: () => api.get<T[]>(`/${name}`),
    get: (id: string) => api.get<T>(`/${name}/${id}`),
    create: (data: Partial<T>) => api.post<T>(`/${name}`, data),
    update: (id: string, data: Partial<T>) =>
      api.put<T>(`/${name}/${id}`, data),
    remove: (id: string) => api.delete<{ message: string }>(`/${name}/${id}`),
  };
}

// Pre-built resource accessors
export const contentApi = resource<{
  id: string;
  section: string;
  key: string;
  value: string;
  updated_at: string;
}>("content");

export const seoApi = resource<{
  id: string;
  route: string;
  title: string;
  description: string;
  og_image: string;
  keywords: string;
  updated_at: string;
}>("seo");

export const navigationApi = resource<{
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}>("navigation");

export const mediaApi = {
  ...resource<{
    id: string;
    alt: string;
    url: string;
    section: string;
    sort_order: number;
    updated_at: string;
  }>("media"),
  upload: (file: File, alt?: string, section?: string) => {
    const body = new FormData();
    body.append("file", file);
    if (alt) body.append("alt", alt);
    if (section) body.append("section", section);
    return request<{
      id: string;
      alt: string;
      url: string;
      section: string;
      sort_order: number;
      updated_at: string;
    }>("/media/upload", { method: "POST", body });
  },
};

export const inquiriesApi = {
  ...resource<{
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }>("inquiries"),
  updateStatus: (id: string, status: string) =>
    api.patch<{ id: string; status: string }>(
      `/inquiries/${id}/status`,
      { status }
    ),
};

export const articlesApi = resource<{
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
}>("articles");

export const projectsApi = resource<{
  id: string;
  slug: string;
  title: string;
  client: string;
  location: string;
  year: string;
  category: string;
  description: string;
  brief_description: string;
  video_url: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}>("projects");

export const servicesApi = resource<{
  id: string;
  slug: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}>("services");

export const settingsApi = resource<{
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}>("settings");

export const teamApi = resource<{
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}>("team");

export const galleryApi = resource<{
  id: string;
  title: string;
  description: string;
  media_type: string;
  url: string;
  thumbnail_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}>("gallery");

export const announcementsApi = {
  ...resource<{
    id: string;
    slug: string;
    type: string;
    title: string;
    description: string;
    content: string;
    deadline_date: string | null;
    attachment_url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>("announcements"),
  listByType: (type: string) => api.get(`/announcements?type=${type}`),
};

export default api;
