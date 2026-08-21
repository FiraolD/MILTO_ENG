import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, UserCircle } from "@phosphor-icons/react";
import { teamApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
import { MediaUrlField } from "./MediaPicker";
const EMPTY_FORM = {
    name: "",
    role: "",
    bio: "",
    avatar_url: "",
    sort_order: 0,
    is_active: true,
};
const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";
export default function TeamPanel() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await teamApi.list();
            setMembers(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load team");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };
    const openEdit = (m) => {
        setEditingId(m.id);
        setForm({
            name: m.name,
            role: m.role,
            bio: m.bio,
            avatar_url: m.avatar_url,
            sort_order: m.sort_order,
            is_active: m.is_active,
        });
        setShowForm(true);
    };
    const save = async () => {
        if (!form.name || !form.role) {
            toast.error("Name and role are required");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                const updated = await teamApi.update(editingId, form);
                setMembers((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...updated } : m)));
                toast.success("Team member updated");
            }
            else {
                const created = await teamApi.create(form);
                setMembers((prev) => [...prev, created]);
                toast.success("Team member added");
            }
            setShowForm(false);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save team member");
        }
        setSaving(false);
    };
    const remove = async (id) => {
        if (!window.confirm("Remove this team member?"))
            return;
        try {
            await teamApi.remove(id);
            setMembers((prev) => prev.filter((m) => m.id !== id));
            toast.success("Team member removed");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to remove team member");
        }
    };
    const toggleActive = async (m) => {
        try {
            await teamApi.update(m.id, { ...m, is_active: !m.is_active });
            setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_active: !m.is_active } : x)));
            toast.success(m.is_active ? "Member hidden" : "Member activated");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update member");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 4 });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Team" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage team members shown under About Us" })] }), !showForm && (_jsxs("button", { onClick: openCreate, className: "flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Plus, { size: 16 }), " Add Member"] }))] }), showForm && (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: editingId ? "Edit Team Member" : "New Team Member" }), _jsx("button", { onClick: () => setShowForm(false), className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "flex items-start gap-5", children: [_jsxs("div", { className: "shrink-0", children: [_jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center", children: form.avatar_url ? (_jsx("img", { src: form.avatar_url, alt: "Avatar preview", className: "w-full h-full object-cover" })) : (_jsx(UserCircle, { size: 48, className: "text-slate-300" })) }), _jsx("p", { className: "text-[10px] text-gray-400 text-center mt-1.5 w-24", children: "Photo preview" })] }), _jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Name *" }), _jsx("input", { value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: inputCls, placeholder: "Eng. Name" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Role *" }), _jsx("input", { value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), className: inputCls, placeholder: "Senior Engineer" })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: labelCls, children: "Photo URL" }), _jsx(MediaUrlField, { value: form.avatar_url, onChange: (url) => setForm({ ...form, avatar_url: url }), mediaType: "image" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Sort Order" }), _jsx("input", { type: "number", value: form.sort_order, onChange: (e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 }), className: inputCls })] }), _jsx("div", { className: "flex items-end pb-1", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => setForm({ ...form, is_active: e.target.checked }), className: "w-4 h-4 accent-blue-900" }), "Active (visible on site)"] }) }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: labelCls, children: "Bio" }), _jsx("textarea", { value: form.bio, onChange: (e) => setForm({ ...form, bio: e.target.value }), rows: 3, className: inputCls })] })] })] }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsxs("button", { onClick: save, disabled: saving, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [_jsx(Check, { size: 16 }), " ", saving ? "Saving..." : editingId ? "Update Member" : "Add Member"] }), _jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [members.length === 0 && (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500 md:col-span-2", children: "No team members yet. Add your first member." })), members.map((m) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0", children: m.avatar_url ? (_jsx("img", { src: m.avatar_url, alt: m.name, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-sm font-bold text-slate-400", children: m.name.split(" ").map((n) => n[0]).slice(0, 2).join("") })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [_jsx("p", { className: "font-semibold text-gray-900 truncate", children: m.name }), _jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded shrink-0 ${m.is_active ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`, children: m.is_active ? "Active" : "Hidden" })] }), _jsx("p", { className: "text-xs text-blue-600 font-medium mb-1", children: m.role }), _jsx("p", { className: "text-xs text-gray-500 line-clamp-2", children: m.bio })] }), _jsxs("div", { className: "flex flex-col items-center gap-1 shrink-0", children: [_jsx("button", { onClick: () => toggleActive(m), className: `px-2 py-1 text-xs font-medium rounded-md ${m.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`, children: m.is_active ? "Hide" : "Show" }), _jsxs("div", { className: "flex items-center gap-0.5", children: [_jsx("button", { onClick: () => openEdit(m), className: "p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md", children: _jsx(PencilSimple, { size: 14 }) }), _jsx("button", { onClick: () => remove(m.id), className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md", children: _jsx(Trash, { size: 14 }) })] })] })] }) }, m.id)))] })] }));
}
