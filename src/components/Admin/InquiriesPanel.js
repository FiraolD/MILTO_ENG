import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Trash } from "@phosphor-icons/react";
import { inquiriesApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
export default function InquiriesPanel() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await inquiriesApi.list();
            setInquiries(data ?? []);
        }
        catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const updateStatus = async (id, status) => {
        try {
            await inquiriesApi.updateStatus(id, status);
            setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
            toast.success(`Marked as ${status}`);
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const removeInquiry = async (id) => {
        try {
            await inquiriesApi.remove(id);
            setInquiries((prev) => prev.filter((i) => i.id !== id));
            setSelectedId(null);
            toast.success("Inquiry removed");
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 3 });
    const statusColor = (s) => {
        switch (s) {
            case "new": return "bg-blue-50 text-blue-700";
            case "read": return "bg-amber-50 text-amber-700";
            case "replied": return "bg-green-50 text-green-700";
            default: return "bg-gray-100 text-gray-500";
        }
    };
    const selected = inquiries.find((i) => i.id === selectedId);
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Contact Inquiries" }), _jsx("p", { className: "text-sm text-gray-500", children: "Review and manage messages from the contact form" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [inquiries.length === 0 && _jsx("p", { className: "text-sm text-gray-400 text-center py-6", children: "No inquiries yet." }), inquiries.map((inq) => (_jsxs("button", { onClick: () => setSelectedId(inq.id), className: `w-full text-left bg-white rounded-xl border p-4 transition-all ${selectedId === inq.id ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900 truncate", children: inq.name }), _jsx("span", { className: `text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusColor(inq.status)}`, children: inq.status })] }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: inq.subject }), _jsx("p", { className: "text-[10px] text-gray-400 mt-1", children: new Date(inq.created_at).toLocaleDateString() })] }, inq.id)))] }), _jsx("div", { children: selected ? (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: selected.name }), _jsx("p", { className: "text-sm text-gray-500", children: selected.subject })] }), _jsx("span", { className: `text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${statusColor(selected.status)}`, children: selected.status })] }), _jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Email:" }), " ", selected.email] }), selected.phone && _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Phone:" }), " ", selected.phone] }), selected.organization && _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Organization:" }), " ", selected.organization] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Date:" }), " ", new Date(selected.created_at).toLocaleString()] })] }), _jsx("div", { className: "bg-slate-50 rounded-lg p-3", children: _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", children: selected.message }) }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [selected.status !== "read" && _jsx("button", { onClick: () => updateStatus(selected.id, "read"), className: "flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100", children: "Mark as Read" }), selected.status !== "replied" && _jsx("button", { onClick: () => updateStatus(selected.id, "replied"), className: "flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100", children: "Mark as Replied" }), _jsxs("button", { onClick: () => removeInquiry(selected.id), className: "flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100", children: [_jsx(Trash, { size: 14 }), " Delete"] })] })] })) : (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center", children: _jsx("p", { className: "text-sm text-gray-400", children: "Select an inquiry to view details" }) })) })] })] }));
}
