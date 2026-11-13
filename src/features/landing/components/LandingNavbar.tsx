import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Rocket, Coffee, Volume2, VolumeX, Sparkles } from "lucide-react";
import { gameAudio } from "@/lib/gameAudio";

export function LandingNavbar() {
  const [soundPlaying, setSoundPlaying] = useState(false);

  const toggleSound = () => {
    gameAudio.unlock();
    if (soundPlaying) {
      gameAudio.stopLunarHum();
      gameAudio.stopSpaceDrone();
      setSoundPlaying(false);
    } else {
      gameAudio.startSpaceDrone();
      gameAudio.playQuindar();
      setSoundPlaying(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-space-700/60 bg-space-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-signal-500 to-warn-500 shadow-lg shadow-signal-500/25">
            <Rocket className="h-5 w-5 text-space-950 transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-regolith-100">
                Cosmosyy
              </span>
              <span className="rounded-full bg-signal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal-500">
                3D
              </span>
            </div>
            <p className="hidden text-[10px] font-medium tracking-wide text-regolith-400 sm:block">
              Apollo & Mars Space Explorer
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Preview Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            title={soundPlaying ? "Mute ambient sound" : "Play space ambient sound preview"}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              soundPlaying
                ? "border-ok-500/60 bg-ok-500/15 text-ok-500"
                : "border-space-700 bg-space-900/80 text-regolith-400 hover:text-regolith-200 hover:border-space-600"
            }`}
          >
            {soundPlaying ? (
              <>
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                <span className="hidden sm:inline">Sound</span>
              </>
            )}
          </motion.button>

          {/* Buy Me a Coffee */}
          <motion.a
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href="https://buymeacoffee.com/learnerabhinav"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 shadow-sm transition-all hover:border-amber-400 hover:bg-amber-400/25 hover:shadow-amber-500/20 hover:shadow-md"
          >
            <Coffee className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Buy Me a Coffee</span>
            <span className="sm:hidden">Coffee</span>
          </motion.a>

          {/* LinkedIn Profile */}
          <motion.a
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.linkedin.com/in/abhinav-dwivedi-b074a136a/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-all hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200"
          >
            <svg
              className="h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="hidden sm:inline">LinkedIn</span>
          </motion.a>

          {/* Start Mission Quick Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/missions"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-signal-500 to-warn-500 px-3.5 py-1.5 text-xs font-bold text-space-950 shadow-md shadow-signal-500/30 transition-all hover:brightness-110"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
