import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Coffee, Volume2, VolumeX } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-space-800/80 bg-space-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="font-display text-2xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,140,0,0.3)]">
            Cosmosyy
          </span>
        </Link>

        {/* Action Buttons: Sound, Buy Me a Coffee, LinkedIn */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Audio Preview Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            title={soundPlaying ? "Mute ambient sound" : "Play space ambient sound preview"}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors ${
              soundPlaying
                ? "border-ok-500/60 bg-ok-500/20 text-ok-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                : "border-space-700/80 bg-space-900/80 text-regolith-300 hover:text-white hover:border-space-500"
            }`}
          >
            {soundPlaying ? (
              <>
                <Volume2 className="h-3.5 w-3.5 animate-pulse text-ok-400" />
                <span>Sound</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-regolith-400" />
                <span>Sound</span>
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
            className="flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-warn-500/25 to-yellow-500/20 px-4 py-1.5 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all hover:border-amber-400 hover:bg-amber-400/30 hover:shadow-amber-500/35 hover:shadow-md"
          >
            <Coffee className="h-3.5 w-3.5 text-amber-300" />
            <span>Buy Me a Coffee</span>
          </motion.a>

          {/* LinkedIn Profile */}
          <motion.a
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.linkedin.com/in/abhinav-dwivedi-b074a136a/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-sky-500/50 bg-sky-600/30 px-3.5 py-1.5 text-xs font-bold text-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.25)] transition-all hover:border-sky-400 hover:bg-sky-500/40 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </motion.a>
        </div>
      </div>
    </header>
  );
}
