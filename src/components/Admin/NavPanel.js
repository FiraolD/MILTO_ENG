import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Link } from "@phosphor-icons/react";
import { navigationApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
export default function NavPanel() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLabel, setNewLabel] = useState("");
    const [newHref, setNewHref] = useState("");
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await navigationApi.list();
            setLinks(data ?? []);
        }
        catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const addLink = async () => {
        if (!newLabel.trim() || !newHref.trim())
            return;
        const maxOrder = links.reduce((m, l) => Math.max(m, l.sort_order), 0);
        try {
            const created = await navigationApi.create({
                label: newLabel.trim(),
                href: newHref.trim(),
                sort_order: maxOrder + 1,
                is_active: true,
            });
            setLinks((prev) => [...prev, created]);
            setNewLabel("");
            setNewHref("");
            toast.success("Link added!");
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const removeLink = async (id) => {
        try {
            await navigationApi.remove(id);
            setLinks((prev) => prev.filter((l) => l.id !== id));
            toast.success("Link removed");
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const toggleActive = async (id, current) => {
        try {
            await navigationApi.update(id, { is_active: !current });
            setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !current } : l)));
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const moveUp = async (idx) => {
        if (idx <= 0)
            return;
        const a = links[idx];
        const b = links[idx - 1];
        try {
            await navigationApi.update(a.id, { sort_order: b.sort_order });
            await navigationApi.update(b.id, { sort_order: a.sort_order });
            const next = [...links];
            next[idx] = b;
            next[idx - 1] = a;
            setLinks(next);
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const moveDown = async (idx) => {
        if (idx >= links.length - 1)
            return;
        const a = links[idx];
        const b = links[idx + 1];
        try {
            await navigationApi.update(a.id, { sort_order: b.sort_order });
            await navigationApi.update(b.id, { sort_order: a.sort_order });
            const next = [...links];
            next[idx] = b;
            next[idx + 1] = a;
            setLinks(next);
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 3 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Navigation Links" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage nav bar links, order, and visibility" })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("input", { value: newLabel, onChange: (e) => setNewLabel(e.target.value), placeholder: "Label", className: "flex-1 min-w-[140px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsx("input", { value: newHref, onChange: (e) => setNewHref(e.target.value), placeholder: "e.g. #services", className: "flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsxs("button", { onClick: addLink, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all", children: [_jsx(Plus, { size: 16 }), " Add"] })] }), _jsxs("div", { className: "space-y-2", children: [links.map((link, idx) => (_jsxs("div", { className: "flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3", children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("button", { onClick: () => moveUp(idx), disabled: idx === 0, className: "p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30", children: _jsx(ArrowUp, { size: 12 }) }), _jsx("button", { onClick: () => moveDown(idx), disabled: idx === links.length - 1, className: "p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30", children: _jsx(ArrowDown, { size: 12 }) })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: link.label }), _jsxs("p", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(Link, { size: 12 }), " ", link.href] })] }), _jsx("button", { onClick: () => toggleActive(link.id, link.is_active), className: `px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${link.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`, children: link.is_active ? "Active" : "Hidden" }), _jsx("button", { onClick: () => removeLink(link.id), className: "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all", children: _jsx(Trash, { size: 16 }) })] }, link.id))), links.length === 0 && _jsx("p", { className: "text-sm text-gray-400 text-center py-6", children: "No navigation links yet." })] })] }));
}
