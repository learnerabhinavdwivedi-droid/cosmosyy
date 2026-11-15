import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const NASA_SOURCES = [
  { label: "Apollo Lunar Surface Journal (ALSJ)", url: "https://www.hq.nasa.gov/alsj/" },
  { label: "Lunar Reconnaissance Orbiter Camera (LROC)", url: "https://www.lroc.asu.edu/" },
  { label: "NASA Apollo Mission Archives", url: "https://www.nasa.gov/mission/apollo-program/" },
  { label: "Planetary Data System (PDS)", url: "https://pds.nasa.gov/" },
  { label: "JPL Mars Exploration Program", url: "https://mars.nasa.gov/" },
  {
    label: "HiRISE — High Resolution Imaging Science Experiment",
    url: "https://www.uahirise.org/",
  },
  {
    label: "NASA Apollo Preliminary Science Reports",
    url: "https://www.hq.nasa.gov/alsj/alsj-PSRs.html",
  },
  {
    label: "ALSEP — Apollo Lunar Surface Experiments Package",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_alsep.html",
  },
];

const TECH_STACK = [
  "React 19",
  "Three.js + React Three Fiber",
  "Rapier Physics",
  "ecctrl",
  "TypeScript",
  "Vite",
  "Tailwind CSS v4",
  "shadcn/ui",
  "zustand",
  "Howler.js",
  "i18next",
  "Vercel",
];

export default function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--space-900)_0%,_var(--space-950)_70%)]" />
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-regolith-200"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 37.7) % 100}%`,
              left: `${(i * 61.3) % 100}%`,
              opacity: 0.08 + (i % 5) * 0.05,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-signal">
            {t("about.challenge")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-regolith-200">
            {t("about.heading")}
          </h1>
          <p className="mt-2 text-lg text-regolith-400 italic">{t("about.tagline")}</p>
        </motion.div>

        {/* Challenge context */}
        <motion.section
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm leading-relaxed text-regolith-300">{t("about.challengeDesc")}</p>
        </motion.section>

        {/* What we built */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-signal/80">
            {t("about.whatWeBuilt")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-regolith-300">
            {t("about.whatWeBuiltDesc")}
          </p>
        </motion.section>

        {/* NASA Data Sources */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-signal/80">
            {t("about.nasaData")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-regolith-300">
            {t("about.nasaDataDesc")}
          </p>
          <div className="mt-4 space-y-2">
            {NASA_SOURCES.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-space-700/40 bg-space-900/60 px-4 py-2.5 text-sm text-regolith-300 transition hover:border-signal/30 hover:text-regolith-200"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-signal/60"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {src.label}
              </a>
            ))}
          </div>
        </motion.section>

        {/* Heritage Preservation */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-signal/80">
            {t("about.heritagePreservation")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-regolith-300">
            {t("about.heritagePreservationDesc")}
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-signal/80">
            {t("about.techStack")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-space-700/50 bg-space-800/50 px-3 py-1 text-xs text-regolith-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Back button */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-space-700 text-regolith-200 hover:bg-space-600"
          >
            {t("about.backToGame")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
