import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, Paperclip, Calendar } from "@phosphor-icons/react";
import { announcementsApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
const EMPTY_FORM = {
    slug: "",
    type: "vacancy",
    title: "",
    description: "",
    content: "",
    deadline_date: null,
    attachment_url: "",
    is_active: true,
};
const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";
export default function AnnouncementsPanel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("vacancy");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await announcementsApi.list();
            setItems(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load announcements");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const openCreate = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM, type: activeTab });
        setShowForm(true);
    };
    const openEdit = (item) => {
        setEditingId(item.id);
        setForm({
            slug: item.slug,
            type: item.type,
            title: item.title,
            description: item.description,
            content: item.content,
            deadline_date: item.deadline_date,
            attachment_url: item.attachment_url,
            is_active: item.is_active,
        });
        setShowForm(true);
    };
    const save = async () => {
        if (!form.slug || !form.title || !form.type) {
            toast.error("Slug, type, and title are required");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                const updated = await announcementsApi.update(editingId, form);
                setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...updated } : i)));
                toast.success("Announcement updated");
            }
            else {
                const created = await announcementsApi.create(form);
                setItems((prev) => [created, ...prev]);
                toast.success("Announcement created");
            }
            setShowForm(false);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save announcement");
        }
        setSaving(false);
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this announcement?"))
            return;
        try {
            await announcementsApi.remove(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            toast.success("Announcement deleted");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete announcement");
        }
    };
    const toggleActive = async (item) => {
        try {
            await announcementsApi.update(item.id, { ...item, is_active: !item.is_active });
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !item.is_active } : i)));
            toast.success(item.is_active ? "Announcement hidden" : "Announcement activated");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update announcement");
        }
    };
    const filtered = items.filter((i) => i.type === activeTab);
    if (loading)
        return _jsx(SkeletonRows, { count: 4 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Announcements" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage vacancies and bid announcements" })] }), !showForm && (_jsxs("button", { onClick: openCreate, className: "flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Plus, { size: 16 }), " Add ", activeTab === "vacancy" ? "Vacancy" : "Bid"] }))] }), _jsx("div", { className: "flex gap-2 mb-6", children: ["vacancy", "bid"].map((t) => (_jsxs("button", { onClick: () => { setActiveTab(t); setShowForm(false); }, className: `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === t
                        ? "bg-blue-900 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-slate-200 hover:bg-gray-50"}`, children: [t === "vacancy" ? "Vacancies" : "Bids", " (", items.filter((i) => i.type === t).length, ")"] }, t))) }), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: editingId ? "Edit Announcement" : "New Announcement" }), _jsx("button", { onClick: () => setShowForm(false), className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Slug *" }), _jsx("input", { value: form.slug, onChange: (e) => setForm({ ...form, slug: e.target.value }), className: inputCls, placeholder: "unique-slug" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Type *" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: inputCls, children: [_jsx("option", { value: "vacancy", children: "Vacancy" }), _jsx("option", { value: "bid", children: "Bid" })] })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Title *" }), _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Short Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Full Content" }), _jsx("textarea", { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), rows: 5, className: inputCls })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Deadline Date" }), _jsx("input", { type: "date", value: form.deadline_date ? form.deadline_date.slice(0, 10) : "", onChange: (e) => setForm({ ...form, deadline_date: e.target.value || null }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Attachment URL" }), _jsx("input", { value: form.attachment_url, onChange: (e) => setForm({ ...form, attachment_url: e.target.value }), className: inputCls, placeholder: "https://..." })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => setForm({ ...form, is_active: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Active (visible on site)"] }) }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsxs("button", { onClick: save, disabled: saving, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [_jsx(Check, { size: 16 }), " ", saving ? "Saving..." : editingId ? "Update" : "Create"] }), _jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] })), _jsxs("div", { className: "space-y-3", children: [filtered.length === 0 && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500", children: ["No ", activeTab === "vacancy" ? "vacancies" : "bids", " yet."] })), filtered.map((item) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${item.is_active ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`, children: item.is_active ? "Active" : "Hidden" }), item.deadline_date && (_jsxs("span", { className: "text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " ", new Date(item.deadline_date).toLocaleDateString()] })), item.attachment_url && (_jsxs("span", { className: "text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1", children: [_jsx(Paperclip, { size: 12 }), " Attachment"] }))] }), _jsx("p", { className: "font-semibold text-gray-900 truncate", children: item.title }), _jsx("p", { className: "text-xs text-gray-500 line-clamp-2 mt-1", children: item.description })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx("button", { onClick: () => toggleActive(item), className: `px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${item.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`, children: item.is_active ? "Hide" : "Show" }), _jsx("button", { onClick: () => openEdit(item), className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg", children: _jsx(PencilSimple, { size: 16 }) }), _jsx("button", { onClick: () => remove(item.id), className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg", children: _jsx(Trash, { size: 16 }) })] })] }) }, item.id)))] })] }));
}
