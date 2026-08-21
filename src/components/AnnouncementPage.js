import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Paperclip, X, Briefcase, Gavel, MapPinLine, ArrowLeft, } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { announcementsApi } from "@/lib/api";
const PAGE_META = {
    vacancy: {
        eyebrow: "Careers",
        title: "Job Vacancies",
        subtitle: "Join our team of engineers and specialists. Explore current openings and submit your application before the deadline.",
        icon: _jsx(Briefcase, { size: 28, weight: "duotone" }),
    },
    bid: {
        eyebrow: "Procurement",
        title: "Bids & Tenders",
        subtitle: "Open bid announcements and tender documents. Review requirements and submit your proposal before the closing date.",
        icon: _jsx(Gavel, { size: 28, weight: "duotone" }),
    },
};
function formatDate(date) {
    if (!date)
        return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
export default function AnnouncementPage({ type }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const meta = PAGE_META[type];
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await announcementsApi.listByType(type);
            setItems(data ?? []);
        }
        catch {
            // silently fail – show empty state
        }
        setLoading(false);
    }, [type]);
    useEffect(() => {
        window.scrollTo({ top: 0 });
        fetch();
    }, [fetch]);
    return (_jsxs("main", { className: "min-h-screen bg-gray-50", children: [_jsx("section", { className: "bg-gradient-to-br from-blue-950 to-blue-800 text-white", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20", children: [_jsxs("button", { onClick: () => navigate("/"), className: "inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white mb-6 transition-colors", children: [_jsx(ArrowLeft, { size: 16 }), " Back to Home"] }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-200", children: meta.icon }), _jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-blue-300", children: meta.eyebrow })] }), _jsx("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4", children: meta.title }), _jsx("p", { className: "text-base sm:text-lg text-blue-200/90 leading-relaxed max-w-2xl", children: meta.subtitle })] }) }), _jsx("section", { className: "py-16 lg:py-20", children: _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: loading ? (_jsx("div", { className: "space-y-4", children: Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: "bg-white rounded-2xl border border-gray-200 p-6 animate-pulse h-32" }, i))) })) : items.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-white rounded-2xl border border-gray-200", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400", children: meta.icon }), _jsx("h3", { className: "font-bold text-blue-950 mb-2", children: "No announcements yet" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["There are currently no active ", type === "vacancy" ? "vacancies" : "bids", ". Please check back soon."] })] })) : (_jsx("div", { className: "space-y-4", children: items.map((item, i) => (_jsxs(motion.article, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.08 }, onClick: () => setSelected(item), className: "group bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [_jsx("span", { className: `text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${type === "vacancy"
                                                ? "bg-blue-50 text-blue-700"
                                                : "bg-amber-50 text-amber-700"}`, children: type === "vacancy" ? "Vacancy" : "Bid" }), _jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " Posted ", formatDate(item.created_at)] }), item.deadline_date && (_jsxs("span", { className: "text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full", children: ["Deadline: ", formatDate(item.deadline_date)] }))] }), _jsx("h2", { className: "text-lg lg:text-xl font-bold text-blue-950 mb-2 group-hover:text-blue-700 transition-colors", children: item.title }), item.description && (_jsx("p", { className: "text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4", children: item.description })), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 text-blue-600 font-medium group-hover:gap-2.5 transition-all", children: ["View details ", _jsx(ArrowLeft, { size: 14, className: "rotate-180" })] }), item.attachment_url && (_jsxs("a", { href: item.attachment_url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors", children: [_jsx(Paperclip, { size: 14 }), " Attachment"] }))] })] }, item.id))) })) }) }), _jsx(AnimatePresence, { children: selected && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setSelected(null), className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, transition: { duration: 0.2 }, onClick: (e) => e.stopPropagation(), className: "relative max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white rounded-2xl", children: [_jsx("button", { onClick: () => setSelected(null), className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center", children: _jsx(X, { size: 18 }) }), _jsxs("div", { className: "p-6 lg:p-8", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [_jsx("span", { className: `text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${selected.type === "vacancy"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "bg-amber-50 text-amber-700"}`, children: selected.type === "vacancy" ? "Vacancy" : "Bid" }), selected.deadline_date && (_jsxs("span", { className: "text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " Deadline: ", formatDate(selected.deadline_date)] }))] }), _jsx("h2", { className: "text-2xl font-bold text-blue-950 mb-4", children: selected.title }), selected.description && (_jsx("p", { className: "text-gray-600 leading-relaxed mb-6", children: selected.description })), selected.content && (_jsx("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-6", children: selected.content })), selected.attachment_url && (_jsxs("a", { href: selected.attachment_url, target: "_blank", rel: "noopener noreferrer", className: "mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors", children: [_jsx(Paperclip, { size: 16 }), " Download Attachment"] })), _jsxs("div", { className: "mt-6 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4", children: [_jsx(MapPinLine, { size: 14 }), " MILTO ENGINEERING PLC \u00B7 Addis Ababa, Ethiopia"] })] })] }) })) })] }));
}
