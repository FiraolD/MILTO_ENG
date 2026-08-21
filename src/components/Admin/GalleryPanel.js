import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, Play } from "@phosphor-icons/react";
import { galleryApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
import { MediaUrlField } from "./MediaPicker";
const EMPTY_FORM = {
    title: "",
    description: "",
    media_type: "image",
    url: "",
    thumbnail_url: "",
    category: "",
    sort_order: 0,
    is_active: true,
};
const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";
export default function GalleryPanel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await galleryApi.list();
            setItems(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load gallery");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };
    const openEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            description: item.description,
            media_type: item.media_type,
            url: item.url,
            thumbnail_url: item.thumbnail_url,
            category: item.category,
            sort_order: item.sort_order,
            is_active: item.is_active,
        });
        setShowForm(true);
    };
    const save = async () => {
        if (!form.url) {
            toast.error("Media URL is required");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                const updated = await galleryApi.update(editingId, form);
                setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...updated } : i)));
                toast.success("Gallery item updated");
            }
            else {
                const created = await galleryApi.create(form);
                setItems((prev) => [...prev, created]);
                toast.success("Gallery item created");
            }
            setShowForm(false);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save gallery item");
        }
        setSaving(false);
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this gallery item?"))
            return;
        try {
            await galleryApi.remove(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            toast.success("Gallery item deleted");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete gallery item");
        }
    };
    const toggleActive = async (item) => {
        try {
            await galleryApi.update(item.id, { is_active: !item.is_active });
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !item.is_active } : i)));
            toast.success(item.is_active ? "Item hidden" : "Item activated");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update item");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 4 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Gallery" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage photos and videos shown in the gallery section" })] }), !showForm && (_jsxs("button", { onClick: openCreate, className: "flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Plus, { size: 16 }), " Add Item"] }))] }), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: editingId ? "Edit Gallery Item" : "New Gallery Item" }), _jsx("button", { onClick: () => setShowForm(false), className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Title" }), _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Category" }), _jsx("input", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: inputCls, placeholder: "Field Work, Events, ..." })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Media Type" }), _jsxs("select", { value: form.media_type, onChange: (e) => setForm({ ...form, media_type: e.target.value }), className: inputCls, children: [_jsx("option", { value: "image", children: "Image" }), _jsx("option", { value: "video", children: "Video" })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Sort Order" }), _jsx("input", { type: "number", value: form.sort_order, onChange: (e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 }), className: inputCls })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("label", { className: labelCls, children: [form.media_type === "video" ? "Video URL (YouTube embed link or uploaded video)" : "Image URL", " *"] }), _jsx(MediaUrlField, { value: form.url, onChange: (url) => setForm({ ...form, url }), mediaType: form.media_type === "video" ? "video" : "image" })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Thumbnail URL (optional \u2013 used as card preview)" }), _jsx(MediaUrlField, { value: form.thumbnail_url, onChange: (url) => setForm({ ...form, thumbnail_url: url }), mediaType: "image" })] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => setForm({ ...form, is_active: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Active (visible on site)"] }) }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsxs("button", { onClick: save, disabled: saving, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [_jsx(Check, { size: 16 }), " ", saving ? "Saving..." : editingId ? "Update Item" : "Create Item"] }), _jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] })), items.length === 0 ? (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500", children: "No gallery items yet. Add your first item." })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: items.map((item) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden group", children: [_jsxs("div", { className: "relative aspect-square bg-gray-100", children: [_jsx("img", { src: item.thumbnail_url || item.url, alt: item.title, className: "w-full h-full object-cover", onError: (e) => {
                                        e.target.style.display = "none";
                                    } }), item.media_type === "video" && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-white/80 flex items-center justify-center", children: _jsx(Play, { size: 16, weight: "fill", className: "text-blue-900 ml-0.5" }) }) })), _jsx("span", { className: `absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-50 text-green-700" : "bg-gray-200 text-gray-600"}`, children: item.is_active ? "Active" : "Hidden" })] }), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: item.title || "Untitled" }), _jsxs("p", { className: "text-xs text-gray-400 truncate", children: [item.category || "No category", " \u00B7 order ", item.sort_order] }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx("button", { onClick: () => toggleActive(item), className: `px-2 py-1 text-xs font-medium rounded-md ${item.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`, children: item.is_active ? "Hide" : "Show" }), _jsx("button", { onClick: () => openEdit(item), className: "p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md ml-auto", children: _jsx(PencilSimple, { size: 14 }) }), _jsx("button", { onClick: () => remove(item.id), className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md", children: _jsx(Trash, { size: 14 }) })] })] })] }, item.id))) }))] }));
}
