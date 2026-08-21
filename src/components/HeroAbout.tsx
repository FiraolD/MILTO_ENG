import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Target, Star, Handshake, Ruler, Users, ShieldCheck } from "@phosphor-icons/react";
import { STATS, VALUES, BRAND, TEAM } from "../constants";
import { teamApi } from "@/lib/api";

interface TeamMemberData {
  id?: string;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

/**
 * Hero image shown in the right-hand column.
 * Swap this path (or replace with a URL) to use a different image.
 */
const HERO_IMAGE = "/gilles-rolland-monnet-Lf4XJSWQoRg-unsplash.jpg";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden"
    >
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25px 25px, white 1px, transparent 0)", backgroundSize: "50px 50px" }} />
      </div>
      <div className="absolute top-20 right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-20 left-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative self-stretch w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 h-200">
          {/* Left: current hero content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-3xl flex flex-col items-start justify-center h-full px-4 py-16 sm:px-8 lg:py-24 lg:pr-12 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-xs font-medium mb-8 backdrop-blur-sm"
            >
              <ShieldCheck size={14} weight="fill" />
              <span>Ethiopian Grade One Consultant</span>
            </motion.div>
        
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Engineering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Water Resources
              </span>
              <br />
              <span className="text-xl sm:text-2xl lg:text-3xl font-normal text-blue-200/90 block mt-3">
                Understanding the Earth. Building a Sustainable Future.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-blue-200/80 leading-relaxed max-w-2xl mb-10"
            >
              {BRAND.shortName} provides comprehensive water resources and environmental consulting
              services across Ethiopia — from groundwater exploration and geotechnical investigation
              to GIS mapping and engineering design.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
              >
                Explore Services{" "}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#about"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                Learn More
              </a>
              <a
                href="/news"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                News
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                Contact Us
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-blue-300/70 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: hero image with gradient fading into the content side */}
          <motion.div
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="relative hidden lg:block self-stretch h-full w-full rounded-3xl overflow-hidden"
          >
            <img
              src={HERO_IMAGE}
              alt="MILTO Engineering field work"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Vector gradient overlay: solid hero color on the content side fading to transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/40 to-transparent" />
            {/* Blurred edge where the image meets the content column */}
            <div className="absolute inset-y-0 left-0 w-44 backdrop-blur-md [mask-image:linear-gradient(to_right,black,transparent)]" />
            {/* Soft bottom blend */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue-950/70 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const [activeValue, setActiveValue] = useState(0);
  const [team, setTeam] = useState<TeamMemberData[]>(TEAM);

  const fetchTeam = useCallback(async () => {
    try {
      const data = await teamApi.list();
      if (data && data.length > 0) {
        setTeam(
          data.map((m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            bio: m.bio,
            avatar_url: m.avatar_url,
          }))
        );
      }
    } catch {
      // keep static TEAM fallback
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const valueIcons = [Handshake, Target, Star, Ruler];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">About Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6">
            Ethiopia&apos;s Trusted{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
              Engineering Partner
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Established in {BRAND.year}, {BRAND.name} has grown into a leading
            Grade One consulting firm, delivering high-quality engineering and
            environmental services to government institutions, development
            organizations, and private sector clients across Ethiopia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white">
                  <Target size={20} />
                </div>
                <h3 className="text-lg font-bold text-blue-950">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide innovative, sustainable, and technically excellent
                engineering solutions that address Ethiopia&apos;s water resources
                challenges, enhance environmental resilience, and contribute to
                the nation&apos;s socio-economic development.
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white">
                  <Star size={20} />
                </div>
                <h3 className="text-lg font-bold text-blue-950">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be Ethiopia&apos;s premier water resources and environmental
                consulting firm, recognized for technical excellence, integrity,
                and transformative impact on communities and ecosystems.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-blue-950">Core Values</h3>
            </div>
            <div className="space-y-3">
              {VALUES.map((value, i) => {
                const IconComp = valueIcons[i];
                return (
                  <motion.button
                    key={value.title}
                    onClick={() => setActiveValue(i)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all ${
                      activeValue === i
                        ? "border-blue-200 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          activeValue === i
                            ? "bg-blue-900 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <IconComp size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-950">{value.title}</p>
                        {activeValue === i && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-sm text-gray-600 mt-1.5 leading-relaxed"
                          >
                            {value.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Team – administered from the admin panel */}
        {team.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-blue-950">Our Team</h3>
            </div>
            <p className="text-sm text-gray-500 mb-8 max-w-2xl">
              A multidisciplinary team of engineers, hydrogeologists, and specialists behind every project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-5 mx-auto bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center ring-4 ring-blue-50">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // fall back to initials if the image fails
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const initials = img.parentElement?.querySelector(".team-initials");
                          if (initials) (initials as HTMLElement).style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      className={`team-initials text-2xl font-bold text-blue-600 ${member.avatar_url ? "hidden" : "flex"} w-full h-full items-center justify-center`}
                    >
                      {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <h4 className="text-center font-bold text-blue-950 mb-1">{member.name}</h4>
                  <p className="text-center text-xs text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}