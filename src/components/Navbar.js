import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { List, X, Phone, ShieldCheck, CaretDown, Megaphone } from "@phosphor-icons/react";
import { BRAND, NAV_LINKS } from "../constants";
const ANNOUNCEMENT_LINKS = [
    { label: "Vacancy", path: "/vacancy" },
    { label: "Bid", path: "/bid" },
];
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("#home");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileAnnouncementsOpen, setMobileAnnouncementsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 20);
            // Track active section
            const sections = NAV_LINKS.map((l) => l.href);
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.querySelector(sections[i]);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const handleNav = (href) => {
        setOpen(false);
        // If we're on a separate route (e.g. /vacancy, /bid), go home first
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            }, 300);
            return;
        }
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
    };
    const handleAnnouncementNav = (path) => {
        setOpen(false);
        setDropdownOpen(false);
        setMobileAnnouncementsOpen(false);
        navigate(path);
    };
    const onAnnouncementRoute = location.pathname === "/vacancy" || location.pathname === "/bid";
    const renderAnnouncementDropdown = () => (_jsxs("div", { className: "relative", onMouseEnter: () => setDropdownOpen(true), onMouseLeave: () => setDropdownOpen(false), children: [_jsxs("button", { onClick: () => setDropdownOpen(!dropdownOpen), className: `flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${onAnnouncementRoute
                    ? "text-blue-900 bg-blue-50"
                    : "text-gray-700 hover:text-blue-900 hover:bg-blue-50/50"}`, children: ["Announcements", _jsx(motion.span, { animate: { rotate: dropdownOpen ? 180 : 0 }, transition: { duration: 0.15 }, children: _jsx(CaretDown, { size: 12, weight: "bold" }) })] }), _jsx(AnimatePresence, { children: dropdownOpen && (_jsx(motion.div, { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 6 }, transition: { duration: 0.15 }, className: "absolute left-0 top-full pt-2 w-44", children: _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-lg p-2", children: ANNOUNCEMENT_LINKS.map((a) => (_jsxs("button", { onClick: () => handleAnnouncementNav(a.path), className: `flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === a.path
                                ? "text-blue-900 bg-blue-50"
                                : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"}`, children: [_jsx(Megaphone, { size: 14, className: "text-blue-500" }), a.label] }, a.path))) }) })) })] }, "announcements"));
    return (_jsxs("header", { className: `sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"}`, children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16 lg:h-20", children: [_jsxs("button", { onClick: () => handleNav("#home"), className: "flex items-center gap-2 group", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, className: "w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-sm leading-tight", children: "ME" }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("p", { className: "text-sm font-bold text-blue-900 leading-tight", children: BRAND.shortName }), _jsx("p", { className: "text-[10px] text-blue-600/70 leading-tight tracking-wider uppercase", children: "Engineering PLC" })] })] }), _jsx("nav", { className: "hidden lg:flex items-center gap-1", children: NAV_LINKS.map((link) => (_jsxs("span", { className: "contents", children: [link.label === "Contact" ? (_jsxs("button", { onClick: () => handleNav(link.href), className: "ml-2 flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all shadow-sm", children: [_jsx(Phone, { size: 16, weight: "fill" }), link.label] })) : (_jsx("button", { onClick: () => handleNav(link.href), className: `px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeSection === link.href && !onAnnouncementRoute
                                            ? "text-blue-900 bg-blue-50"
                                            : "text-gray-700 hover:text-blue-900 hover:bg-blue-50/50"}`, children: link.label })), link.label === "Projects" && renderAnnouncementDropdown()] }, link.href))) }), _jsx("button", { onClick: () => setOpen(!open), className: "lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors", "aria-label": open ? "Close menu" : "Open menu", children: open ? _jsx(X, { size: 24 }) : _jsx(List, { size: 24 }) })] }) }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.25, ease: "easeInOut" }, className: "lg:hidden overflow-hidden", children: _jsxs("div", { className: "bg-white border-t border-gray-100 px-4 py-4 space-y-1", children: [NAV_LINKS.map((link) => (_jsxs("div", { children: [_jsxs("button", { onClick: () => handleNav(link.href), className: link.label === "Contact"
                                            ? "flex items-center justify-center gap-2 w-full mt-2 px-5 py-3 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                                            : `block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === link.href && !onAnnouncementRoute
                                                ? "text-blue-900 bg-blue-50"
                                                : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"}`, children: [link.label === "Contact" && _jsx(Phone, { size: 16, weight: "fill" }), link.label] }), link.label === "Projects" && (_jsxs("div", { children: [_jsxs("button", { onClick: () => setMobileAnnouncementsOpen(!mobileAnnouncementsOpen), className: `flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${onAnnouncementRoute
                                                    ? "text-blue-900 bg-blue-50"
                                                    : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"}`, children: ["Announcements", _jsx(motion.span, { animate: { rotate: mobileAnnouncementsOpen ? 180 : 0 }, transition: { duration: 0.15 }, children: _jsx(CaretDown, { size: 14, weight: "bold" }) })] }), _jsx(AnimatePresence, { children: mobileAnnouncementsOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden pl-4", children: ANNOUNCEMENT_LINKS.map((a) => (_jsxs("button", { onClick: () => handleAnnouncementNav(a.path), className: `flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === a.path
                                                            ? "text-blue-900 bg-blue-50"
                                                            : "text-gray-600 hover:text-blue-900 hover:bg-blue-50"}`, children: [_jsx(Megaphone, { size: 14, className: "text-blue-500" }), a.label] }, a.path))) })) })] }))] }, link.href))), _jsxs("button", { onClick: () => { setOpen(false); navigate("/admin"); }, className: "flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-900 hover:bg-blue-50 transition-colors", children: [_jsx(ShieldCheck, { size: 16 }), " Admin Panel"] })] }) })) })] }));
}
