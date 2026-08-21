import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Globe, Image, Envelope, SignOut, List, Briefcase, ImagesSquare, Megaphone, Newspaper, Users, } from "@phosphor-icons/react";
import { SiteContentPanel, SeoPanel } from "./AdminPanels";
import NavPanel from "./NavPanel";
import MediaPanel from "./MediaPanel";
import InquiriesPanel from "./InquiriesPanel";
import ProjectsPanel from "./ProjectsPanel";
import GalleryPanel from "./GalleryPanel";
import AnnouncementsPanel from "./AnnouncementsPanel";
import NewsPanel from "./NewsPanel";
import TeamPanel from "./TeamPanel";
const TABS = [
    { id: "content", label: "Site Content", icon: _jsx(FileText, { size: 18 }) },
    { id: "projects", label: "Projects", icon: _jsx(Briefcase, { size: 18 }) },
    { id: "gallery", label: "Gallery", icon: _jsx(ImagesSquare, { size: 18 }) },
    { id: "news", label: "News", icon: _jsx(Newspaper, { size: 18 }) },
    { id: "announcements", label: "Announcements", icon: _jsx(Megaphone, { size: 18 }) },
    { id: "team", label: "Team", icon: _jsx(Users, { size: 18 }) },
    { id: "seo", label: "SEO Metadata", icon: _jsx(Globe, { size: 18 }) },
    { id: "nav", label: "Navigation", icon: _jsx(List, { size: 18 }) },
    { id: "media", label: "Media Assets", icon: _jsx(Image, { size: 18 }) },
    { id: "inquiries", label: "Inquiries", icon: _jsx(Envelope, { size: 18 }) },
];
export default function AdminDashboard({ user, onSignOut }) {
    const [activeTab, setActiveTab] = useState("content");
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex", children: [_jsxs("aside", { className: "w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden lg:block", children: [_jsx("div", { className: "p-5 border-b border-slate-100", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-xs", children: "ME" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-blue-900 leading-tight", children: "MILTO" }), _jsx("p", { className: "text-[10px] text-blue-600/70 leading-tight", children: "Admin Panel" })] })] }) }), _jsxs("nav", { className: "p-3 space-y-1", children: [TABS.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id ? "bg-blue-50 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`, children: [tab.icon, " ", tab.label] }, tab.id))), _jsx("hr", { className: "my-3 border-slate-100" }), _jsxs("button", { onClick: onSignOut, className: "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 transition-all", children: [_jsx(SignOut, { size: 18 }), " Sign Out"] }), _jsx("div", { className: "px-3 pt-4", children: _jsx("p", { className: "text-xs text-gray-400", children: user.email }) })] })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-xs", children: "ME" }), _jsx("span", { className: "text-sm font-bold text-blue-900", children: "Admin Panel" })] }), _jsx("button", { onClick: onSignOut, className: "p-2 text-red-500 hover:bg-red-50 rounded-lg", children: _jsx(SignOut, { size: 18 }) })] }), _jsx("div", { className: "lg:hidden bg-white border-b border-slate-200 px-2 overflow-x-auto flex gap-1", children: TABS.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? "border-blue-900 text-blue-900" : "border-transparent text-gray-500"}`, children: [tab.icon, " ", tab.label] }, tab.id))) }), _jsx("div", { className: "p-4 sm:p-6 lg:p-8", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2, ease: "easeOut" }, children: [activeTab === "content" && _jsx(SiteContentPanel, {}), activeTab === "projects" && _jsx(ProjectsPanel, {}), activeTab === "gallery" && _jsx(GalleryPanel, {}), activeTab === "news" && _jsx(NewsPanel, {}), activeTab === "announcements" && _jsx(AnnouncementsPanel, {}), activeTab === "team" && _jsx(TeamPanel, {}), activeTab === "seo" && _jsx(SeoPanel, {}), activeTab === "nav" && _jsx(NavPanel, {}), activeTab === "media" && _jsx(MediaPanel, {}), activeTab === "inquiries" && _jsx(InquiriesPanel, {})] }, activeTab) }) })] })] }));
}
