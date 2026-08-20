import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Globe, Image, Envelope, SignOut, List,
  Briefcase, ImagesSquare, Megaphone, Newspaper,
} from "@phosphor-icons/react";
import type { TabId } from "./AdminPanels";
import { SiteContentPanel, SeoPanel } from "./AdminPanels";
import NavPanel from "./NavPanel";
import MediaPanel from "./MediaPanel";
import InquiriesPanel from "./InquiriesPanel";
import ProjectsPanel from "./ProjectsPanel";
import GalleryPanel from "./GalleryPanel";
import AnnouncementsPanel from "./AnnouncementsPanel";
import NewsPanel from "./NewsPanel";

interface AdminDashboardProps {
  user: { id: string; email: string };
  onSignOut: () => void;
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "content", label: "Site Content", icon: <FileText size={18} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
  { id: "gallery", label: "Gallery", icon: <ImagesSquare size={18} /> },
  { id: "news", label: "News", icon: <Newspaper size={18} /> },
  { id: "announcements", label: "Announcements", icon: <Megaphone size={18} /> },
  { id: "seo", label: "SEO Metadata", icon: <Globe size={18} /> },
  { id: "nav", label: "Navigation", icon: <List size={18} /> },
  { id: "media", label: "Media Assets", icon: <Image size={18} /> },
  { id: "inquiries", label: "Inquiries", icon: <Envelope size={18} /> },
];

export default function AdminDashboard({ user, onSignOut }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("content");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden lg:block">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-xs">ME</div>
            <div>
              <p className="text-sm font-bold text-blue-900 leading-tight">MILTO</p>
              <p className="text-[10px] text-blue-600/70 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id ? "bg-blue-50 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <hr className="my-3 border-slate-100" />
          <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <SignOut size={18} /> Sign Out
          </button>
          <div className="px-3 pt-4"><p className="text-xs text-gray-400">{user.email}</p></div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-xs">ME</div>
            <span className="text-sm font-bold text-blue-900">Admin Panel</span>
          </div>
          <button onClick={onSignOut} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><SignOut size={18} /></button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-2 overflow-x-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id ? "border-blue-900 text-blue-900" : "border-transparent text-gray-500"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "content" && <SiteContentPanel />}
              {activeTab === "projects" && <ProjectsPanel />}
              {activeTab === "gallery" && <GalleryPanel />}
              {activeTab === "news" && <NewsPanel />}
              {activeTab === "announcements" && <AnnouncementsPanel />}
              {activeTab === "seo" && <SeoPanel />}
              {activeTab === "nav" && <NavPanel />}
              {activeTab === "media" && <MediaPanel />}
              {activeTab === "inquiries" && <InquiriesPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}