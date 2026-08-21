import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Paperclip, X, Briefcase, Gavel, MapPinLine, ArrowLeft,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { announcementsApi } from "@/lib/api";
import type { Announcement, AnnouncementType } from "@/types";

interface AnnouncementPageProps {
  type: AnnouncementType;
}

const PAGE_META: Record<
  AnnouncementType,
  { eyebrow: string; title: string; subtitle: string; icon: React.ReactNode }
> = {
  vacancy: {
    eyebrow: "Careers",
    title: "Job Vacancies",
    subtitle:
      "Join our team of engineers and specialists. Explore current openings and submit your application before the deadline.",
    icon: <Briefcase size={28} weight="duotone" />,
  },
  bid: {
    eyebrow: "Procurement",
    title: "Bids & Tenders",
    subtitle:
      "Open bid announcements and tender documents. Review requirements and submit your proposal before the closing date.",
    icon: <Gavel size={28} weight="duotone" />,
  },
};

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnnouncementPage({ type }: AnnouncementPageProps) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const navigate = useNavigate();
  const meta = PAGE_META[type];

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await announcementsApi.listByType(type);
      setItems((data as Announcement[]) ?? []);
    } catch {
      // silently fail – show empty state
    }
    setLoading(false);
  }, [type]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch();
  }, [fetch]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-200">
              {meta.icon}
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              {meta.eyebrow}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {meta.title}
          </h1>
          <p className="text-base sm:text-lg text-blue-200/90 leading-relaxed max-w-2xl">
            {meta.subtitle}
          </p>
        </div>
      </section>

      {/* Announcement list */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse h-32" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                {meta.icon}
              </div>
              <h3 className="font-bold text-blue-950 mb-2">No announcements yet</h3>
              <p className="text-sm text-gray-500">
                There are currently no active {type === "vacancy" ? "vacancies" : "bids"}. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => setSelected(item)}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                        type === "vacancy"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {type === "vacancy" ? "Vacancy" : "Bid"}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> Posted {formatDate(item.created_at)}
                    </span>
                    {item.deadline_date && (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                        Deadline: {formatDate(item.deadline_date)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg lg:text-xl font-bold text-blue-950 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium group-hover:gap-2.5 transition-all">
                      View details <ArrowLeft size={14} className="rotate-180" />
                    </span>
                    {item.attachment_url && (
                      <a
                        href={item.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Paperclip size={14} /> Attachment
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white rounded-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>
              <div className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                      selected.type === "vacancy"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {selected.type === "vacancy" ? "Vacancy" : "Bid"}
                  </span>
                  {selected.deadline_date && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Calendar size={12} /> Deadline: {formatDate(selected.deadline_date)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-blue-950 mb-4">{selected.title}</h2>
                {selected.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>
                )}
                {selected.content && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-6">
                    {selected.content}
                  </p>
                )}
                {selected.attachment_url && (
                  <a
                    href={selected.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Paperclip size={16} /> Download Attachment
                  </a>
                )}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <MapPinLine size={14} /> MILTO ENGINEERING PLC · Addis Ababa, Ethiopia
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
