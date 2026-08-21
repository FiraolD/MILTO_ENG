import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, FilmSlate, ImageSquare } from "@phosphor-icons/react";
import { articlesApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
import { MediaUrlField } from "./MediaPicker";
const EMPTY_FORM = {
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    image_url: "",
    video_url: "",
    is_published: false,
    published_at: null,
};
const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";
export default function NewsPanel() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await articlesApi.list();
            // Only manage news articles here (blog comes later)
            setArticles((data ?? []).filter((a) => a.type === "news"));
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load news articles");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };
    const openEdit = (a) => {
        setEditingId(a.id);
        setForm({
            slug: a.slug,
            title: a.title,
            content: a.content,
            excerpt: a.excerpt,
            author: a.author,
            category: a.category,
            image_url: a.image_url ?? "",
            video_url: a.video_url ?? "",
            is_published: a.is_published,
            published_at: a.published_at,
        });
        setShowForm(true);
    };
    const save = async () => {
        if (!form.slug || !form.title) {
            toast.error("Slug and title are required");
            return;
        }
        setSaving(true);
        try {
            // Auto-stamp publish date on first publish
            const payload = {
                ...form,
                type: "news",
                published_at: form.published_at ?? (form.is_published ? new Date().toISOString() : null),
            };
            if (editingId) {
                const updated = await articlesApi.update(editingId, payload);
                setArticles((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...updated } : a)));
                toast.success("Article updated");
            }
            else {
                const created = await articlesApi.create(payload);
                setArticles((prev) => [created, ...prev]);
                toast.success("Article created");
            }
            setShowForm(false);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save article");
        }
        setSaving(false);
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this article?"))
            return;
        try {
            await articlesApi.remove(id);
            setArticles((prev) => prev.filter((a) => a.id !== id));
            toast.success("Article deleted");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete article");
        }
    };
    const togglePublish = async (a) => {
        try {
            const payload = {
                slug: a.slug,
                title: a.title,
                content: a.content,
                excerpt: a.excerpt,
                author: a.author,
                category: a.category,
                type: "news",
                image_url: a.image_url ?? "",
                video_url: a.video_url ?? "",
                is_published: !a.is_published,
                published_at: a.published_at ?? (!a.is_published ? new Date().toISOString() : null),
            };
            const updated = await articlesApi.update(a.id, payload);
            setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, ...updated } : x)));
            toast.success(!a.is_published ? "Article published" : "Article unpublished");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update article");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 4 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "News" }), _jsx("p", { className: "text-sm text-gray-500", children: "Publish news articles shown in the News section" })] }), !showForm && (_jsxs("button", { onClick: openCreate, className: "flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Plus, { size: 16 }), " Add Article"] }))] }), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: editingId ? "Edit Article" : "New Article" }), _jsx("button", { onClick: () => setShowForm(false), className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Slug *" }), _jsx("input", { value: form.slug, onChange: (e) => setForm({ ...form, slug: e.target.value }), className: inputCls, placeholder: "article-slug" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Category" }), _jsx("input", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: inputCls, placeholder: "Company, Projects, ..." })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Title *" }), _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Excerpt (short summary)" }), _jsx("textarea", { value: form.excerpt, onChange: (e) => setForm({ ...form, excerpt: e.target.value }), rows: 2, className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Content" }), _jsx("textarea", { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), rows: 6, className: inputCls })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Image URL" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ImageSquare, { size: 16, className: "text-gray-400 shrink-0" }), _jsx(MediaUrlField, { value: form.image_url, onChange: (url) => setForm({ ...form, image_url: url }), mediaType: "image" })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Video URL (YouTube embed link or uploaded video)" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FilmSlate, { size: 16, className: "text-gray-400 shrink-0" }), _jsx(MediaUrlField, { value: form.video_url, onChange: (url) => setForm({ ...form, video_url: url }), mediaType: "video", placeholder: "https://www.youtube.com/embed/..." })] })] })] }), form.image_url && (_jsx("div", { className: "mt-3", children: _jsx("img", { src: form.image_url, alt: "Preview", className: "h-24 rounded-lg object-cover border border-slate-200", onError: (e) => (e.target.style.display = "none") }) })), _jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Author" }), _jsx("input", { value: form.author, onChange: (e) => setForm({ ...form, author: e.target.value }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Publish Date (optional \u2013 auto-set on publish)" }), _jsx("input", { type: "date", value: form.published_at ? form.published_at.slice(0, 10) : "", onChange: (e) => setForm({
                                            ...form,
                                            published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                                        }), className: inputCls })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_published, onChange: (e) => setForm({ ...form, is_published: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Published (visible on site)"] }) }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsxs("button", { onClick: save, disabled: saving, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [_jsx(Check, { size: 16 }), " ", saving ? "Saving..." : editingId ? "Update Article" : "Create Article"] }), _jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] })), _jsxs("div", { className: "space-y-3", children: [articles.length === 0 && (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500", children: "No news articles yet. Publish your first article." })), articles.map((a) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${a.is_published ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`, children: a.is_published ? "Published" : "Draft" }), a.category && (_jsx("span", { className: "text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded", children: a.category })), a.image_url && (_jsxs("span", { className: "text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1", children: [_jsx(ImageSquare, { size: 11 }), " Image"] })), a.video_url && (_jsxs("span", { className: "text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1", children: [_jsx(FilmSlate, { size: 11 }), " Video"] })), a.published_at && (_jsx("span", { className: "text-xs text-gray-400", children: new Date(a.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }))] }), _jsx("p", { className: "font-semibold text-gray-900 truncate", children: a.title }), _jsx("p", { className: "text-xs text-gray-500 line-clamp-2 mt-1", children: a.excerpt || a.content })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx("button", { onClick: () => togglePublish(a), className: `px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${a.is_published ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`, children: a.is_published ? "Unpublish" : "Publish" }), _jsx("button", { onClick: () => openEdit(a), className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg", children: _jsx(PencilSimple, { size: 16 }) }), _jsx("button", { onClick: () => remove(a.id), className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg", children: _jsx(Trash, { size: 16 }) })] })] }) }, a.id)))] })] }));
}
