import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, MapPin, Eye, ArrowRight, Sparkles } from "lucide-react";
import { playBeep } from "../../../lib/gameAudio";

interface MissionSpotlight {
  id: string;
  name: string;
  badge: string;
  year: string;
  planet: "moon" | "mars";
  destination: string;
  craft: string;
  highlight: string;
  relicsCount: number;
  tags: string[];
}

const SPOTLIGHT_MISSIONS: MissionSpotlight[] = [
  // Moon missions
  {
    id: "apollo-11",
    name: "Apollo 11",
    badge: "First Human Landing",
    year: "1969",
    planet: "moon",
    destination: "Sea of Tranquility",
    craft: "Saturn V + LM Eagle",
    highlight: "One small step for man. Inspect Neil Armstrong's descent stage and plant the first flag.",
    relicsCount: 5,
    tags: ["Lunar Module Eagle", "EASEP Seismometer", "Historic Flag", "Laser Retroreflector"],
  },
  {
    id: "apollo-15",
    name: "Apollo 15",
    badge: "First Lunar Rover",
    year: "1971",
    planet: "moon",
    destination: "Hadley Rille",
    craft: "Saturn V + Lunar Roving Vehicle",
    highlight: "First mission with the Lunar Roving Vehicle (LRV). Explore the deep volcanic canyon of Hadley Rille.",
    relicsCount: 6,
    tags: ["Lunar Rover (LRV)", "Hadley Rille Canyon", "Genesis Rock", "ALSEP Central Station"],
  },
  {
    id: "apollo-17",
    name: "Apollo 17",
    badge: "Final Apollo Expedition",
    year: "1972",
    planet: "moon",
    destination: "Taurus-Littrow",
    craft: "Saturn V + LM Challenger",
    highlight: "Geologist Harrison Schmitt discovered orange volcanic soil. Longest rover drives across towering massifs.",
    relicsCount: 7,
    tags: ["Orange Soil Site", "Rover Tracks", "Taurus Massifs", "Cosmic Ray Detector"],
  },
  // Mars missions
  {
    id: "mars-viking1",
    name: "Viking 1",
    badge: "First Mars Touchdown",
    year: "1976",
    planet: "mars",
    destination: "Chryse Planitia",
    craft: "Titan IIIE + Aeroshell Lander",
    highlight: "The historic first successful robot to touch down on Mars. Transmitted the first panoramic color photo of the red planet.",
    relicsCount: 6,
    tags: ["Viking 1 Lander", "Sampling Arm", "Weather Boom", "First Mars Panorama"],
  },
  {
    id: "mars-curiosity",
    name: "Curiosity Rover",
    badge: "Nuclear Lab on Wheels",
    year: "2012",
    planet: "mars",
    destination: "Gale Crater",
    craft: "Sky Crane Descent Stage",
    highlight: "Daring Sky Crane landing into Gale Crater. Discover ancient lakebeds that once held drinkable fresh water.",
    relicsCount: 6,
    tags: ["Curiosity Rover", "Mount Sharp", "Sky Crane Impact", "ChemCam Laser"],
  },
  {
    id: "mars-perseverance",
    name: "Perseverance & Ingenuity",
    badge: "Biosignature Seeker",
    year: "2021",
    planet: "mars",
    destination: "Jezero Crater",
    craft: "Sky Crane + Ingenuity Drone",
    highlight: "Exploring an ancient river delta in search of fossilized Martian microbial life with the Ingenuity helicopter.",
    relicsCount: 6,
    tags: ["Perseverance Rover", "Ingenuity Helicopter", "Delta Scarp", "Sample Return Tubes"],
  },
];

export function LandingMissionShowcase() {
  const [activeTab, setActiveTab] = useState<"moon" | "mars">("moon");

  const filteredMissions = SPOTLIGHT_MISSIONS.filter((m) => m.planet === activeTab);

  const handleTabChange = (tab: "moon" | "mars") => {
    setActiveTab(tab);
    playBeep(tab === "moon" ? 850 : 700, 0.08);
  };

  return (
    <section className="relative py-16 md:py-24 border-t border-space-800/80 bg-space-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-warn-500/30 bg-warn-500/10 px-3.5 py-1 text-xs font-semibold text-warn-500 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Historical Missions Directory</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-regolith-100 sm:text-4xl md:text-5xl">
              12 Authentic Missions to{" "}
              <span className="bg-gradient-to-r from-signal-500 via-warn-500 to-amber-300 bg-clip-text text-transparent">
                Command & Explore
              </span>
            </h2>
            <p className="mt-2 text-sm text-regolith-300 sm:text-base">
              Accurate NASA landing sites with authentic equipment coordinates, real audio archives, and topography.
            </p>
          </div>

          {/* Planet Filter Tabs */}
          <div className="flex rounded-2xl border border-space-700 bg-space-900/90 p-1.5 shadow-md backdrop-blur">
            <button
              onClick={() => handleTabChange("moon")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm font-bold transition-all ${
                activeTab === "moon"
                  ? "bg-signal-500 text-space-950 shadow-md"
                  : "text-regolith-300 hover:text-regolith-100"
              }`}
            >
              <span>🌕 Moon Missions (6)</span>
            </button>
            <button
              onClick={() => handleTabChange("mars")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm font-bold transition-all ${
                activeTab === "mars"
                  ? "bg-warn-500 text-space-950 shadow-md"
                  : "text-regolith-300 hover:text-regolith-100"
              }`}
            >
              <span>🪐 Mars Missions (6)</span>
            </button>
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {filteredMissions.map((m) => (
                <div
                  key={m.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-space-700/80 bg-gradient-to-b from-space-900/90 to-space-950 p-6 shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-signal-500/50 hover:shadow-2xl hover:shadow-signal-500/10"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-space-800/90 px-3 py-1 font-mono text-xs font-semibold text-regolith-300">
                        {m.year}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          m.planet === "moon"
                            ? "bg-signal-500/15 text-signal-500"
                            : "bg-warn-500/15 text-warn-500"
                        }`}
                      >
                        {m.badge}
                      </span>
                    </div>

                    {/* Mission Name & Destination */}
                    <h3 className="mt-4 font-display text-2xl font-bold text-regolith-100 group-hover:text-signal-500 transition-colors">
                      {m.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-warn-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{m.destination}</span>
                    </div>

                    {/* Highlight Description */}
                    <p className="mt-3 text-xs leading-relaxed text-regolith-300 sm:text-sm">
                      {m.highlight}
                    </p>

                    {/* Relics / Features Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-space-800 bg-space-900/60 px-2 py-0.5 font-mono text-[11px] text-regolith-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-space-800/80 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-regolith-400">
                      <Eye className="h-3.5 w-3.5 text-signal-500" />
                      <span>{m.relicsCount} Scannable Relics</span>
                    </span>

                    <Link
                      to="/missions"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-space-800 px-3.5 py-1.5 font-display text-xs font-bold text-regolith-100 transition-all group-hover:bg-signal-500 group-hover:text-space-950"
                    >
                      <span>Fly Mission</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Hub CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/missions"
            className="inline-flex items-center gap-2 rounded-2xl border border-signal-500/40 bg-space-900/80 px-8 py-3.5 font-display text-lg font-bold text-regolith-100 backdrop-blur transition-all hover:bg-space-800 hover:border-signal-500 hover:text-signal-500"
          >
            <Rocket className="h-5 w-5 text-signal-500" />
            <span>Open All 12 Missions in Mission Select Hub</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
