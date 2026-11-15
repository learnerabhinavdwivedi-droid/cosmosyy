import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Rocket, BookOpen, Compass, Sparkles } from "lucide-react";
import { playQuindar, playBeep } from "../../../lib/gameAudio";

export function LandingLaunchBanner() {
  const handleLaunchClick = () => {
    playQuindar();
  };

  const scrollToGuide = () => {
    const el = document.getElementById("how-to-play");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    playBeep(650, 0.08);
  };

  return (
    <section className="relative py-12 md:py-20 bg-transparent overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-full max-w-4xl rounded-full bg-gradient-to-r from-signal-500/10 via-warn-500/15 to-amber-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-space-700/80 bg-gradient-to-b from-space-900/90 via-space-950 to-space-950 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl"
        >
          {/* Subtle cosmic header badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-signal-500/40 bg-signal-500/15 px-4 py-1 text-xs font-bold text-signal-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Mission Control Launchpad</span>
          </div>

          <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Ready to Make{" "}
            <span className="bg-gradient-to-r from-signal-500 via-warn-500 to-amber-300 bg-clip-text text-transparent">
              Cosmic History?
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-regolith-300 leading-relaxed">
            Choose from all 12 authentic Moon and Mars expeditions. Walk in real low gravity, scan
            historical relics left on the surface, and record your discoveries in your permanent
            Explorer Passport.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/missions"
                onClick={handleLaunchClick}
                className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-signal-500 via-warn-500 to-amber-400 px-8 py-3.5 font-display text-base sm:text-lg font-bold text-space-950 shadow-xl shadow-signal-500/30 transition-all hover:shadow-2xl hover:shadow-signal-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Rocket className="h-5 w-5 shrink-0" />
                <span>LAUNCH EXPEDITION</span>
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToGuide}
              className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2.5 rounded-2xl border border-space-700/80 bg-space-900/80 px-6 py-3.5 font-display text-base font-semibold text-regolith-200 backdrop-blur-md transition-colors hover:border-space-500 hover:bg-space-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <BookOpen className="h-5 w-5 text-signal-500 shrink-0" />
              <span>Review How to Play</span>
            </motion.button>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-8 pt-6 border-t border-space-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-regolith-400">
            <span className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-warn-500" />
              <span>100% Free & Open NASA Data</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-signal-500" />
              <span>No Login Required · Local Passport</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
