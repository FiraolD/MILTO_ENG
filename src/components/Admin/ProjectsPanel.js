import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, ImageSquare, FilmSlate, } from "@phosphor-icons/react";
import { projectsApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
import { MediaUrlField } from "./MediaPicker";
const EMPTY_FORM = {
    slug: "",
    title: "",
    client: "",
    location: "",
    year: "",
    category: "",
    description: "",
    brief_description: "",
    video_url: "",
    images: [],
    is_featured: false,
    is_active: true,
};
const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";
export default function ProjectsPanel() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await projectsApi.list();
            setProjects(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load projects");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };
    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            slug: p.slug,
            title: p.title,
            client: p.client,
            location: p.location,
            year: p.year,
            category: p.category,
            description: p.description,
            brief_description: p.brief_description ?? "",
            video_url: p.video_url ?? "",
            images: p.images ?? [],
            is_featured: p.is_featured,
            is_active: p.is_active,
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
            const images = form.images.filter((u) => u.trim() !== "");
            if (editingId) {
                const updated = await projectsApi.update(editingId, { ...form, images });
                setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)));
                toast.success("Project updated");
            }
            else {
                const created = await projectsApi.create({ ...form, images });
                setProjects((prev) => [created, ...prev]);
                toast.success("Project created");
            }
            setShowForm(false);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save project");
        }
        setSaving(false);
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this project?"))
            return;
        try {
            await projectsApi.remove(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success("Project deleted");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete project");
        }
    };
    const toggleActive = async (p) => {
        try {
            const updated = await projectsApi.update(p.id, { is_active: !p.is_active });
            setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !p.is_active } : x)));
            toast.success(updated.is_active ? "Project activated" : "Project hidden");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update project");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 4 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Projects" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage portfolio projects, images, and videos" })] }), !showForm && (_jsxs("button", { onClick: openCreate, className: "flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Plus, { size: 16 }), " Add Project"] }))] }), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: editingId ? "Edit Project" : "New Project" }), _jsx("button", { onClick: () => setShowForm(false), className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Slug *" }), _jsx("input", { value: form.slug, onChange: (e) => setForm({ ...form, slug: e.target.value }), className: inputCls, placeholder: "project-slug" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Title *" }), _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Client" }), _jsx("input", { value: form.client, onChange: (e) => setForm({ ...form, client: e.target.value }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Location" }), _jsx("input", { value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }), className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Year" }), _jsx("input", { value: form.year, onChange: (e) => setForm({ ...form, year: e.target.value }), className: inputCls, placeholder: "2024" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Category" }), _jsx("input", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: inputCls, placeholder: "Groundwater, GIS, ..." })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Brief Description (shown on card)" }), _jsx("textarea", { value: form.brief_description, onChange: (e) => setForm({ ...form, brief_description: e.target.value }), rows: 2, className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Full Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 4, className: inputCls })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Video URL (YouTube embed link or uploaded video)" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FilmSlate, { size: 16, className: "text-gray-400 shrink-0" }), _jsx(MediaUrlField, { value: form.video_url, onChange: (url) => setForm({ ...form, video_url: url }), mediaType: "video", placeholder: "https://www.youtube.com/embed/..." })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: labelCls, children: "Image URLs" }), _jsxs("div", { className: "space-y-2", children: [form.images.map((url, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ImageSquare, { size: 16, className: "text-gray-400 shrink-0" }), _jsx(MediaUrlField, { value: url, onChange: (v) => setForm({ ...form, images: form.images.map((u, j) => (j === i ? v : u)) }), mediaType: "image" }), _jsx("button", { onClick: () => setForm({ ...form, images: form.images.filter((_, j) => j !== i) }), className: "p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0", children: _jsx(Trash, { size: 14 }) })] }, i))), _jsxs("button", { onClick: () => setForm({ ...form, images: [...form.images, ""] }), className: "flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800", children: [_jsx(Plus, { size: 14 }), " Add image URL"] })] })] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-6", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_featured, onChange: (e) => setForm({ ...form, is_featured: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Featured"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => setForm({ ...form, is_active: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Active (visible on site)"] })] }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsxs("button", { onClick: save, disabled: saving, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [_jsx(Check, { size: 16 }), " ", saving ? "Saving..." : editingId ? "Update Project" : "Create Project"] }), _jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] })), _jsxs("div", { className: "space-y-3", children: [projects.length === 0 && (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500", children: "No projects yet. Add your first project." })), projects.map((p) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsx("span", { className: "text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded", children: p.category || "Uncategorized" }), _jsx("span", { className: "text-xs text-gray-400", children: p.year }), p.is_featured && _jsx("span", { className: "text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded", children: "Featured" }), _jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${p.is_active ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`, children: p.is_active ? "Active" : "Hidden" }), p.video_url && (_jsxs("span", { className: "text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1", children: [_jsx(FilmSlate, { size: 12 }), " Video"] }))] }), _jsx("p", { className: "font-semibold text-gray-900 truncate", children: p.title }), _jsxs("p", { className: "text-xs text-gray-500 truncate mt-0.5", children: [p.client, " \u00B7 ", p.location, " \u00B7 ", (p.images ?? []).length, " image(s)"] })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx("button", { onClick: () => toggleActive(p), className: `px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${p.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`, children: p.is_active ? "Hide" : "Show" }), _jsx("button", { onClick: () => openEdit(p), className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg", children: _jsx(PencilSimple, { size: 16 }) }), _jsx("button", { onClick: () => remove(p.id), className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg", children: _jsx(Trash, { size: 16 }) })] })] }) }, p.id)))] })] }));
}
