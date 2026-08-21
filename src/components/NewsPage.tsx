import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, X, ArrowLeft, ArrowRight, Newspaper, Play, Tag,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { articlesApi } from "@/lib/api";
import { isDirectVideoFile } from "@/lib/mediaUtils";
import type { NewsArticle } from "@/types";

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const navigate = useNavigate();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articlesApi.list();
      setArticles((data as NewsArticle[]) ?? []);
    } catch {
      // silently fail – show empty state
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch();
  }, [fetch]);

  const featured = articles[0];
  const rest = articles.slice(1);

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
              <Newspaper size={28} weight="duotone" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Newsroom
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            News &amp; Updates
          </h1>
          <p className="text-base sm:text-lg text-blue-200/90 leading-relaxed max-w-2xl">
            Stay informed about our latest projects, achievements, and company developments across Ethiopia.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 animate-pulse h-80" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Newspaper size={24} />
              </div>
              <h3 className="font-bold text-blue-950 mb-2">No news yet</h3>
              <p className="text-sm text-gray-500">Check back soon for updates from MILTO ENGINEERING.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured article */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setSelected(featured)}
                  className="group grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="relative h-64 lg:h-auto min-h-[280px] bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                    {featured.video_url ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-950">
                        {featured.image_url && (
                          <img
                            src={featured.image_url}
                            alt={featured.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                        )}
                        <div className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={26} weight="fill" className="text-blue-900 ml-1" />
                        </div>
                      </div>
                    ) : featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper size={56} className="text-blue-300/40" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-blue-900 text-white px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      {featured.category && (
                        <span className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                          <Tag size={12} /> {featured.category}
                        </span>
                      )}
                      {featured.published_at && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar size={12} /> {formatDate(featured.published_at)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-blue-950 leading-tight mb-4 group-hover:text-blue-700 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                      {featured.excerpt || featured.content}
                    </p>
                    <div className="flex items-center justify-between">
                      {featured.author && <span className="text-sm text-gray-500">{featured.author}</span>}
                      <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Read more <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Remaining articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.08 }}
                    onClick={() => setSelected(article)}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Newspaper size={40} className="text-blue-300/40" />
                        </div>
                      )}
                      {article.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play size={18} weight="fill" className="text-blue-900 ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3 text-xs">
                        {article.category && (
                          <span className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <Tag size={11} /> {article.category}
                          </span>
                        )}
                        {article.published_at && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <Calendar size={11} /> {formatDate(article.published_at)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-blue-950 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                        {article.excerpt || article.content}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-4 text-blue-600 font-medium text-sm group-hover:gap-2.5 transition-all">
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article detail modal */}
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
              className="relative max-w-3xl w-full max-h-[88vh] overflow-y-auto bg-white rounded-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
              {/* Media */}
              {selected.video_url ? (
                <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
                  {isDirectVideoFile(selected.video_url) ? (
                    <video
                      src={selected.video_url}
                      className="w-full h-full"
                      controls
                      autoPlay
                    />
                  ) : (
                    <iframe
                      src={selected.video_url}
                      title={selected.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="w-full max-h-[45vh] object-cover rounded-t-2xl"
                />
              ) : null}
              <div className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                  {selected.category && (
                    <span className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      <Tag size={12} /> {selected.category}
                    </span>
                  )}
                  {selected.published_at && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar size={12} /> {formatDate(selected.published_at)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-blue-950 mb-4">{selected.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
                {selected.author && (
                  <p className="mt-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                    By {selected.author}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
