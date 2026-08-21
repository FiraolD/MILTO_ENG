import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Check, X, PencilSimple } from "@phosphor-icons/react";
import { contentApi, seoApi } from "@/lib/api";
import { toast } from "sonner";
export function SkeletonRows({ count }) {
    return (_jsx("div", { className: "space-y-3", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-4 animate-pulse", children: [_jsx("div", { className: "h-3 bg-slate-200 rounded w-1/4 mb-3" }), _jsx("div", { className: "h-4 bg-slate-200 rounded w-3/4" })] }, i))) }));
}
export function SiteContentPanel() {
    const [blocks, setBlocks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [loading, setLoading] = useState(true);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await contentApi.list();
            setBlocks(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load content");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const save = async (id) => {
        try {
            await contentApi.update(id, { value: editValue });
            setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value: editValue } : b)));
            setEditingId(null);
            toast.success("Content updated!");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update content");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 6 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Site Content" }), _jsx("p", { className: "text-sm text-gray-500", children: "Edit text blocks across all sections" })] }), _jsx("div", { className: "space-y-3", children: blocks.map((block) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md", children: block.section }), _jsx("span", { className: "text-xs text-gray-400 font-mono", children: block.key })] }), editingId === block.id ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: editValue, onChange: (e) => setEditValue(e.target.value), rows: 3, className: "w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => save(block.id), className: "flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800", children: [_jsx(Check, { size: 14 }), " Save"] }), _jsxs("button", { onClick: () => setEditingId(null), className: "flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200", children: [_jsx(X, { size: 14 }), " Cancel"] })] })] })) : (_jsx("p", { className: "text-sm text-gray-700", children: block.value }))] }), editingId !== block.id && (_jsx("button", { onClick: () => { setEditingId(block.id); setEditValue(block.value); }, className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-shrink-0", children: _jsx(PencilSimple, { size: 16 }) }))] }) }, block.id))) })] }));
}
export function SeoPanel() {
    const [meta, setMeta] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", keywords: "", og_image: "" });
    const [loading, setLoading] = useState(true);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await seoApi.list();
            setMeta(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load SEO metadata");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const save = async (id) => {
        try {
            await seoApi.update(id, form);
            setMeta((prev) => prev.map((m) => (m.id === id ? { ...m, ...form } : m)));
            setEditingId(null);
            toast.success("SEO updated!");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update SEO metadata");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 2 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "SEO Metadata" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage page titles, meta descriptions, and OG images" })] }), _jsx("div", { className: "space-y-4", children: meta.map((m) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("span", { className: "text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded", children: m.route }) }), editingId === m.id ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "Title" }), _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "Keywords" }), _jsx("input", { value: form.keywords, onChange: (e) => setForm({ ...form, keywords: e.target.value }), className: "w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "OG Image URL" }), _jsx("input", { value: form.og_image, onChange: (e) => setForm({ ...form, og_image: e.target.value }), className: "w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => save(m.id), className: "flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800", children: [_jsx(Check, { size: 14 }), " Save"] }), _jsxs("button", { onClick: () => setEditingId(null), className: "flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200", children: [_jsx(X, { size: 14 }), " Cancel"] })] })] })) : (_jsxs("div", { className: "space-y-1.5", children: [_jsx("p", { className: "text-sm font-semibold text-gray-900", children: m.title }), _jsx("p", { className: "text-xs text-gray-500", children: m.description }), m.keywords && _jsxs("p", { className: "text-xs text-gray-400", children: [_jsx("span", { className: "font-medium", children: "Keywords:" }), " ", m.keywords] }), m.og_image && _jsxs("p", { className: "text-xs text-gray-400", children: [_jsx("span", { className: "font-medium", children: "OG Image:" }), " ", m.og_image] }), _jsxs("button", { onClick: () => { setEditingId(m.id); setForm({ title: m.title, description: m.description, keywords: m.keywords, og_image: m.og_image }); }, className: "mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800", children: [_jsx(PencilSimple, { size: 14 }), " Edit SEO"] })] }))] }, m.id))) })] }));
}
