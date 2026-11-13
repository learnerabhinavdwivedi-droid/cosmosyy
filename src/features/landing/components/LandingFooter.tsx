import { Link } from "react-router-dom";
import { Rocket, Coffee } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-space-800 bg-space-950 py-12 text-regolith-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand & Made By */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-500/20 text-signal-500">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="font-display text-xl font-bold text-regolith-200">
                Cosmosyy
              </span>
            </div>
            <p className="mt-2 text-xs text-regolith-400">
              Made with ❤️ by <span className="font-semibold text-regolith-200">Abhinav Dwivedi</span>
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-regolith-300">
            <Link to="/missions" className="hover:text-signal-500 transition-colors">
              Missions
            </Link>
            <a href="#how-to-play" className="hover:text-signal-500 transition-colors">
              How to Play
            </a>
            <Link to="/credits" className="hover:text-signal-500 transition-colors">
              Credits & Licences
            </Link>
            <Link to="/settings" className="hover:text-signal-500 transition-colors">
              Settings
            </Link>
          </div>

          {/* Socials & Support */}
          <div className="flex items-center gap-3">
            <a
              href="https://buymeacoffee.com/learnerabhinav"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-colors"
            >
              <Coffee className="h-3.5 w-3.5 text-amber-400" />
              <span>Buy Me a Coffee</span>
            </a>

            <a
              href="https://www.linkedin.com/in/abhinav-dwivedi-584742269"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>

        </div>

        <div className="mt-8 border-t border-space-850 pt-6 text-center text-[11px] text-regolith-400/80">
          <p>
            Historical landing site data, coordinates, and telemetry derived from NASA Open Data, Apollo Lunar Surface Journal (ALSJ), and LROC imagery.
          </p>
          <p className="mt-1">
            © 2026 Cosmosyy · Built for space exploration enthusiasts & curious young minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
