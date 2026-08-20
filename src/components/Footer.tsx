import { useState, useEffect } from "react";
import {
  Phone,
  Envelope,
  MapPin,
  LinkedinLogo,
  YoutubeLogo,
  TelegramLogo,
  FacebookLogo,
  X,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { BRAND, SOCIAL } from "../constants";

const TELEGRAM_AVATAR =
  "https://miltoengineering.com/wp-content/uploads/2023/07/photo_2023-07-30_04-43-59-e1690717691292.jpg";

function TelegramWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () =>
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-3">
      {/* Chat popup */}
      {isOpen && (
        <div className="w-[330px] max-w-[calc(100vw-40px)] rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#0088cc] to-[#229ED9] p-4 text-white">
            <img
              src={TELEGRAM_AVATAR}
              alt="Milto Engineering"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight truncate">
                Milto Engineering
              </h4>
              <p className="text-xs text-blue-100/90 leading-tight">
                Typically replies within a day
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gradient-to-b from-blue-50/60 to-white">
            {/* Timestamp */}
            <p className="text-center text-[10px] text-gray-400 mb-3">
              {currentTime}
            </p>

            {/* Incoming message */}
            <div className="flex items-start gap-2 mb-3">
              <img
                src={TELEGRAM_AVATAR}
                alt="Milto Engineering"
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
              />
              <div className="bg-white rounded-2xl rounded-tl-md px-3 py-2 shadow-sm max-w-[240px]">
                <p className="text-sm text-gray-700 leading-snug">
                  Hello, Welcome to the site. Please click the button below to
                  chat with us through Telegram.
                </p>
              </div>
            </div>

            {/* Send button */}
            <a
              href={SOCIAL.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#0088cc] to-[#229ED9] px-4 py-2.5 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PaperPlaneTilt size={16} weight="fill" />
              Send a message
            </a>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-700"
            : "bg-gradient-to-br from-[#0088cc] to-[#229ED9] animate-pulse"
        }`}
        aria-label={isOpen ? "Close Telegram chat" : "Open Telegram chat"}
      >
        {isOpen ? (
          <X size={24} weight="bold" />
        ) : (
          <TelegramLogo size={26} weight="fill" />
        )}
      </button>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                ME
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">{BRAND.shortName}</p>
                <p className="text-xs text-blue-300/70 leading-tight tracking-wider uppercase">
                  Engineering PLC
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-200/80 leading-relaxed mb-6">
              Ethiopia's trusted Grade One Water Resources consulting and engineering firm, delivering professional services since 2021.
            </p>
            <div className="flex gap-3">
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="LinkedIn">
                <LinkedinLogo size={18} weight="fill" />
              </a>
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                <YoutubeLogo size={18} weight="fill" />
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Telegram">
                <TelegramLogo size={18} weight="fill" />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <FacebookLogo size={18} weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Projects", "Team", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-blue-200/80 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-5">Services</h3>
            <ul className="space-y-3">
              {[
                "Water Resources Engineering",
                "Groundwater & Hydrogeology",
                "Geophysics & Geotechnical",
                "Environmental Services",
                "GIS & Remote Sensing",
                "Engineering Consulting",
              ].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-blue-200/80 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-blue-200/80">{BRAND.headquarters}</span>
              </li>
              <li>
                <a href="tel:+251901000960" className="flex items-start gap-3 text-sm text-blue-200/80 hover:text-white transition-colors">
                  <Phone size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <span>+251-901-000960</span>
                </a>
              </li>
              <li className="space-y-2">
                <a href="mailto:admin@miltoengineering.com" className="flex items-start gap-3 text-sm text-blue-200/80 hover:text-white transition-colors">
                  <Envelope size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <span>admin@miltoengineering.com</span>
                </a>
                <a href="mailto:miltoengineeringplc@gmail.com" className="flex items-start gap-3 text-sm text-blue-200/80 hover:text-white transition-colors">
                  <Envelope size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <span>miltoengineeringplc@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-300/70">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-blue-300/50">
            Grade One Water Resources Consulting & Engineering
          </p>
        </div>
      </div>

      {/* Floating Telegram Chat Widget */}
      <TelegramWidget />
    </footer>
  );
}
