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
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}
async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        ...options.headers,
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
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
}
// ---------------------------------------------------------------------------
// Convenience methods
// ---------------------------------------------------------------------------
export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" }),
};
export async function login(email, password) {
    const data = await api.post("/auth/login", {
        email,
        password,
    });
    setToken(data.token);
    return data;
}
export async function verifyToken() {
    return api.get("/auth/verify");
}
export async function signOut() {
    clearToken();
}
// ---------------------------------------------------------------------------
// Resource helpers (generic CRUD)
// ---------------------------------------------------------------------------
export function resource(name) {
    return {
        list: () => api.get(`/${name}`),
        get: (id) => api.get(`/${name}/${id}`),
        create: (data) => api.post(`/${name}`, data),
        update: (id, data) => api.put(`/${name}/${id}`, data),
        remove: (id) => api.delete(`/${name}/${id}`),
    };
}
// Pre-built resource accessors
export const contentApi = resource("content");
export const seoApi = resource("seo");
export const navigationApi = resource("navigation");
export const mediaApi = {
    ...resource("media"),
    upload: (file, alt, section) => {
        const body = new FormData();
        body.append("file", file);
        if (alt)
            body.append("alt", alt);
        if (section)
            body.append("section", section);
        return request("/media/upload", { method: "POST", body });
    },
};
export const inquiriesApi = {
    ...resource("inquiries"),
    updateStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status }),
};
export const articlesApi = resource("articles");
export const projectsApi = resource("projects");
export const servicesApi = resource("services");
export const settingsApi = resource("settings");
export const teamApi = resource("team");
export const galleryApi = resource("gallery");
export const announcementsApi = {
    ...resource("announcements"),
    listByType: (type) => api.get(`/announcements?type=${type}`),
};
export default api;
