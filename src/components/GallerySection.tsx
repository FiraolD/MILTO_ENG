import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, X, CaretLeft, CaretRight, FilmSlate, ImageSquare,
} from "@phosphor-icons/react";
import { galleryApi } from "@/lib/api";

interface GalleryItemData {
  id: string;
  title: string;
  description: string;
  media_type: string;
  url: string;
  thumbnail_url: string;
  category: string;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AUTO_SLIDE_MS = 5000;

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await galleryApi.list();
      setItems(data ?? []);
    } catch {
      // silently fail – gallery is non-critical
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const categories = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  // Keep index in range when the filter changes
  useEffect(() => {
    setIndex(0);
  }, [activeCategory]);

  // Auto-slide
  useEffect(() => {
    if (paused || filtered.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % filtered.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, filtered.length]);

  const goTo = (i: number) => {
    if (filtered.length === 0) return;
    setIndex(((i % filtered.length) + filtered.length) % filtered.length);
  };

  if (!loading && items.length === 0) return null;

  const current = filtered[index];

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="max-w-2xl mb-12"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
            Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6">
            Capturing Our Work in Action
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            A visual showcase of our field work, projects, and team activities across Ethiopia.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-900 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
        ) : current ? (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Main slider */}
            <div className="relative rounded-2xl overflow-hidden bg-blue-950 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="relative aspect-[16/9] sm:aspect-[21/9] cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={current.thumbnail_url || current.url}
                    alt={current.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {current.media_type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={26} weight="fill" className="text-white ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        {current.media_type === "video" ? <FilmSlate size={11} /> : <ImageSquare size={11} />}
                        {current.media_type}
                      </span>
                      {current.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-600/80 text-white px-2 py-0.5 rounded-full">
                          {current.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl">{current.title}</h3>
                    {current.description && (
                      <p className="text-white/70 text-sm mt-1 line-clamp-1">{current.description}</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={() => goTo(index - 1)}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                  >
                    <CaretLeft size={22} weight="bold" />
                  </button>
                  <button
                    onClick={() => goTo(index + 1)}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                  >
                    <CaretRight size={22} weight="bold" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute top-4 right-4 text-xs font-medium text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {index + 1} / {filtered.length}
              </div>
            </div>

            {/* Dots + thumbnails */}
            {filtered.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
                {filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-8 bg-blue-900" : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Lightbox – wider format with prev/next */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X size={20} />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
                }}
                aria-label="Previous"
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              >
                <CaretLeft size={26} weight="bold" />
              </button>
            )}

            <motion.div
              key={filtered[lightboxIndex].id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl"
            >
              {filtered[lightboxIndex].media_type === "video" ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                  <iframe
                    src={filtered[lightboxIndex].url}
                    title={filtered[lightboxIndex].title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={filtered[lightboxIndex].url}
                  alt={filtered[lightboxIndex].title}
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              )}
              <div className="mt-4 text-center">
                <h3 className="font-bold text-white text-lg">{filtered[lightboxIndex].title}</h3>
                {filtered[lightboxIndex].description && (
                  <p className="text-white/70 text-sm mt-1">{filtered[lightboxIndex].description}</p>
                )}
                <p className="text-white/40 text-xs mt-2">
                  {lightboxIndex + 1} of {filtered.length}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % filtered.length);
                }}
                aria-label="Next"
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              >
                <CaretRight size={26} weight="bold" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
