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

  const handleNav = (href: string) => {
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

  const handleAnnouncementNav = (path: string) => {
    setOpen(false);
    setDropdownOpen(false);
    setMobileAnnouncementsOpen(false);
    navigate(path);
  };

  const onAnnouncementRoute =
    location.pathname === "/vacancy" || location.pathname === "/bid";

  const renderAnnouncementDropdown = () => (
    <div
      key="announcements"
      className="relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
          onAnnouncementRoute
            ? "text-blue-900 bg-blue-50"
            : "text-gray-700 hover:text-blue-900 hover:bg-blue-50/50"
        }`}
      >
        Announcements
        <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <CaretDown size={12} weight="bold" />
        </motion.span>
      </button>
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2 w-44"
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-2">
              {ANNOUNCEMENT_LINKS.map((a) => (
                <button
                  key={a.path}
                  onClick={() => handleAnnouncementNav(a.path)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === a.path
                      ? "text-blue-900 bg-blue-50"
                      : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  <Megaphone size={14} className="text-blue-500" />
                  {a.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("#home")}
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-sm leading-tight"
            >
              ME
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-blue-900 leading-tight">
                {BRAND.shortName}
              </p>
              <p className="text-[10px] text-blue-600/70 leading-tight tracking-wider uppercase">
                Engineering PLC
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <span key={link.href} className="contents">
                <button
                  onClick={() => handleNav(link.href)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeSection === link.href && !onAnnouncementRoute
                      ? "text-blue-900 bg-blue-50"
                      : "text-gray-700 hover:text-blue-900 hover:bg-blue-50/50"
                  }`}
                >
                  {link.label}
                </button>
                {link.label === "Projects" && renderAnnouncementDropdown()}
              </span>
            ))}
           
            <a
              href="tel:+251-901-000960"
              className="ml-3 flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all shadow-sm"
            >
              <Phone size={16} weight="fill" />
              <span className="hidden xl:inline">Get in Touch</span>
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === link.href && !onAnnouncementRoute
                        ? "text-blue-900 bg-blue-50"
                        : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {link.label}
                  </button>
                  {link.label === "Projects" && (
                    <div>
                      <button
                        onClick={() => setMobileAnnouncementsOpen(!mobileAnnouncementsOpen)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          onAnnouncementRoute
                            ? "text-blue-900 bg-blue-50"
                            : "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                        }`}
                      >
                        Announcements
                        <motion.span
                          animate={{ rotate: mobileAnnouncementsOpen ? 180 : 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <CaretDown size={14} weight="bold" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {mobileAnnouncementsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {ANNOUNCEMENT_LINKS.map((a) => (
                              <button
                                key={a.path}
                                onClick={() => handleAnnouncementNav(a.path)}
                                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                  location.pathname === a.path
                                    ? "text-blue-900 bg-blue-50"
                                    : "text-gray-600 hover:text-blue-900 hover:bg-blue-50"
                                }`}
                              >
                                <Megaphone size={14} className="text-blue-500" />
                                {a.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => { setOpen(false); navigate("/admin"); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
              >
                <ShieldCheck size={16} /> Admin Panel
              </button>
              <a
                href="tel:+251-11-XXX-XXXX"
                className="flex items-center gap-2 w-full mt-2 px-5 py-3 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Phone size={16} weight="fill" />
                Call Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}