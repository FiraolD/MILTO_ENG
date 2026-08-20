import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Calendar,
  Drop, WaveTriangle, Compass, Leaf, GlobeHemisphereWest, GearSix, Crosshair,
  Play, X
} from "@phosphor-icons/react";
import { SERVICES, PROJECTS } from "../constants";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Drop: <Drop size={24} />,
  WaveTriangle: <WaveTriangle size={24} />,
  CompassTool: <Compass size={24} />,
  Leaf: <Leaf size={24} />,
  GlobeHemisphereWest: <GlobeHemisphereWest size={24} />,
  GearSix: <GearSix size={24} />,
};

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section id="services" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="max-w-2xl mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">Our Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6">
            Comprehensive Engineering Expertise
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            From water resources and groundwater to environmental services and GIS, we deliver end-to-end consulting solutions for projects of all scales.
          </p>
        </motion.div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:grid grid-cols-5 gap-8">
          <div className="col-span-2 space-y-2">
            {SERVICES.map((service, i) => (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(i)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeService === i
                    ? "border-blue-200 bg-white shadow-sm ring-1 ring-blue-100"
                    : "border-transparent hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      activeService === i ? "bg-blue-900 text-white" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {iconMap[service.icon]}
                  </div>
                  <div>
                    <p className="font-semibold text-blue-950 text-sm">{service.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{service.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-white">
                    {iconMap[SERVICES[activeService].icon]}
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">{SERVICES[activeService].title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{SERVICES[activeService].description}</p>
                <ul className="space-y-3">
                  {SERVICES[activeService].details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <Check size={16} className="text-blue-500 mt-1 shrink-0" weight="bold" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: Accordion */}
        <div className="lg:hidden space-y-3">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setActiveService(activeService === i ? -1 : i)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  {iconMap[service.icon]}
                </div>
                <span className="font-semibold text-blue-950 text-sm flex-1">{service.title}</span>
                <motion.div
                  animate={{ rotate: activeService === i ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ArrowRight size={16} className="text-blue-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeService === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="px-4 pb-5 pt-1 border-t border-gray-100 overflow-hidden"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <Check size={14} className="text-blue-500 mt-1 shrink-0" weight="bold" />
                          <span className="text-xs text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS as unknown as Project[]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [videoProject, setVideoProject] = useState<Project | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await projectsApi.list();
      if (data && data.length > 0) {
        setProjects(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            client: p.client,
            location: p.location,
            year: p.year,
            category: p.category,
            description: p.description,
            brief_description: p.brief_description,
            video_url: p.video_url,
            images: p.images ?? [],
          }))
        );
      }
    } catch {
      // keep static PROJECTS fallback
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="max-w-2xl mb-12"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">Our Projects</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6">
            Delivering Impact Across Ethiopia
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            A portfolio of successful projects demonstrating our technical capability and commitment to quality.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeCategory === cat
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                whileHover={{ y: -6 }}
                onClick={() => project.video_url && setVideoProject(project)}
                className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all ${
                  project.video_url ? "cursor-pointer" : ""
                }`}
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden relative">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Crosshair size={48} className="text-blue-300/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent" />
                    </div>
                  )}
                  {project.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play size={20} weight="fill" className="text-blue-900 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {project.year}
                    </span>
                  </div>
                  <h3 className="font-bold text-blue-950 mb-1.5 line-clamp-2">{project.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                    {project.client} &middot; {project.location}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {project.brief_description || project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {videoProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoProject(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setVideoProject(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
              <div className="aspect-video">
                <iframe
                  src={videoProject.video_url}
                  title={videoProject.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-blue-950">{videoProject.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {videoProject.client} &middot; {videoProject.location}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
