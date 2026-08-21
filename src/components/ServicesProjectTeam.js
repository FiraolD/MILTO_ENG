import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Calendar, Drop, WaveTriangle, Compass, Leaf, GlobeHemisphereWest, GearSix, Crosshair, Play, X } from "@phosphor-icons/react";
import { SERVICES, PROJECTS } from "../constants";
import { projectsApi } from "@/lib/api";
const iconMap = {
    Drop: _jsx(Drop, { size: 24 }),
    WaveTriangle: _jsx(WaveTriangle, { size: 24 }),
    CompassTool: _jsx(Compass, { size: 24 }),
    Leaf: _jsx(Leaf, { size: 24 }),
    GlobeHemisphereWest: _jsx(GlobeHemisphereWest, { size: 24 }),
    GearSix: _jsx(GearSix, { size: 24 }),
};
const sectionVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
export function ServicesSection() {
    const [activeService, setActiveService] = useState(0);
    return (_jsx("section", { id: "services", className: "py-20 lg:py-28 bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-100px" }, variants: sectionVariant, className: "max-w-2xl mb-16", children: [_jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4", children: "Our Services" }), _jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6", children: "Comprehensive Engineering Expertise" }), _jsx("p", { className: "text-base sm:text-lg text-gray-600 leading-relaxed", children: "From water resources and groundwater to environmental services and GIS, we deliver end-to-end consulting solutions for projects of all scales." })] }), _jsxs("div", { className: "hidden lg:grid grid-cols-5 gap-8", children: [_jsx("div", { className: "col-span-2 space-y-2", children: SERVICES.map((service, i) => (_jsx(motion.button, { onClick: () => setActiveService(i), whileHover: { x: 4 }, whileTap: { scale: 0.98 }, className: `w-full text-left p-4 rounded-xl border transition-all ${activeService === i
                                    ? "border-blue-200 bg-white shadow-sm ring-1 ring-blue-100"
                                    : "border-transparent hover:bg-white/80"}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeService === i ? "bg-blue-900 text-white" : "bg-blue-100 text-blue-600"}`, children: iconMap[service.icon] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-950 text-sm", children: service.title }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5 line-clamp-1", children: service.description })] })] }) }, service.id))) }), _jsx("div", { className: "col-span-3", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.25, ease: "easeInOut" }, className: "bg-white rounded-2xl border border-gray-200 p-8 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-white", children: iconMap[SERVICES[activeService].icon] }), _jsx("h3", { className: "text-xl font-bold text-blue-950", children: SERVICES[activeService].title })] }), _jsx("p", { className: "text-gray-600 leading-relaxed mb-6", children: SERVICES[activeService].description }), _jsx("ul", { className: "space-y-3", children: SERVICES[activeService].details.map((detail) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(Check, { size: 16, className: "text-blue-500 mt-1 shrink-0", weight: "bold" }), _jsx("span", { className: "text-sm text-gray-700", children: detail })] }, detail))) })] }, activeService) }) })] }), _jsx("div", { className: "lg:hidden space-y-3", children: SERVICES.map((service, i) => (_jsxs(motion.div, { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("button", { onClick: () => setActiveService(activeService === i ? -1 : i), className: "w-full flex items-center gap-3 p-4 text-left", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0", children: iconMap[service.icon] }), _jsx("span", { className: "font-semibold text-blue-950 text-sm flex-1", children: service.title }), _jsx(motion.div, { animate: { rotate: activeService === i ? 90 : 0 }, transition: { duration: 0.2, ease: "easeInOut" }, children: _jsx(ArrowRight, { size: 16, className: "text-blue-500" }) })] }), _jsx(AnimatePresence, { children: activeService === i && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.25, ease: "easeInOut" }, className: "px-4 pb-5 pt-1 border-t border-gray-100 overflow-hidden", children: [_jsx("p", { className: "text-sm text-gray-600 leading-relaxed mb-4", children: service.description }), _jsx("ul", { className: "space-y-2", children: service.details.map((detail) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Check, { size: 14, className: "text-blue-500 mt-1 shrink-0", weight: "bold" }), _jsx("span", { className: "text-xs text-gray-700", children: detail })] }, detail))) })] })) })] }, service.id))) })] }) }));
}
export function ProjectsSection() {
    const [projects, setProjects] = useState(PROJECTS);
    const [activeCategory, setActiveCategory] = useState("All");
    const [videoProject, setVideoProject] = useState(null);
    const fetch = useCallback(async () => {
        try {
            const data = await projectsApi.list();
            if (data && data.length > 0) {
                setProjects(data.map((p) => ({
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
                })));
            }
        }
        catch {
            // keep static PROJECTS fallback
        }
    }, []);
    useEffect(() => {
        fetch();
    }, [fetch]);
    const categories = ["All", ...new Set(projects.map((p) => p.category))];
    const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);
    return (_jsxs("section", { id: "projects", className: "py-20 lg:py-28 bg-white", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-100px" }, variants: sectionVariant, className: "max-w-2xl mb-12", children: [_jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4", children: "Our Projects" }), _jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6", children: "Delivering Impact Across Ethiopia" }), _jsx("p", { className: "text-base sm:text-lg text-gray-600 leading-relaxed", children: "A portfolio of successful projects demonstrating our technical capability and commitment to quality." })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-10", children: categories.map((cat) => (_jsx(motion.button, { onClick: () => setActiveCategory(cat), whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, className: `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeCategory === cat
                                ? "bg-blue-900 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: cat }, cat))) }), _jsx(motion.div, { layout: true, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: _jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((project) => (_jsxs(motion.div, { layout: true, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.3, ease: "easeInOut" }, whileHover: { y: -6 }, onClick: () => project.video_url && setVideoProject(project), className: `group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all ${project.video_url ? "cursor-pointer" : ""}`, children: [_jsxs("div", { className: "h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden relative", children: [project.images && project.images.length > 0 ? (_jsx("img", { src: project.images[0], alt: project.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300", onError: (e) => {
                                                    e.target.style.display = "none";
                                                } })) : (_jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [_jsx(Crosshair, { size: 48, className: "text-blue-300/30" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent" })] })), project.video_url && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors", children: _jsx("div", { className: "w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform", children: _jsx(Play, { size: 20, weight: "fill", className: "text-blue-900 ml-0.5" }) }) }))] }), _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 mb-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium", children: project.category }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " ", project.year] })] }), _jsx("h3", { className: "font-bold text-blue-950 mb-1.5 line-clamp-2", children: project.title }), _jsxs("p", { className: "text-xs text-gray-500 mb-3 line-clamp-1", children: [project.client, " \u00B7 ", project.location] }), _jsx("p", { className: "text-sm text-gray-600 leading-relaxed line-clamp-3", children: project.brief_description || project.description })] })] }, project.id))) }) })] }), _jsx(AnimatePresence, { children: videoProject && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setVideoProject(null), className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, transition: { duration: 0.2 }, onClick: (e) => e.stopPropagation(), className: "relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden", children: [_jsx("button", { onClick: () => setVideoProject(null), className: "absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white", children: _jsx(X, { size: 18 }) }), _jsx("div", { className: "aspect-video", children: _jsx("iframe", { src: videoProject.video_url, title: videoProject.title, className: "w-full h-full", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }), _jsxs("div", { className: "p-5", children: [_jsx("h3", { className: "font-bold text-blue-950", children: videoProject.title }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [videoProject.client, " \u00B7 ", videoProject.location] })] })] }) })) })] }));
}
