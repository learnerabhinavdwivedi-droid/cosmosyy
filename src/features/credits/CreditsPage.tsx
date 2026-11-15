import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Globe, Database, Sparkles, Award } from "lucide-react";

export default function CreditsPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-space-950 text-regolith-100 flex flex-col">
      {/* Background stars / ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-800/25 via-space-950 to-space-950" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-space-800/80 bg-space-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-regolith-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return</span>
          </button>
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase font-bold">
              ARCHIVE // 09.3
            </span>
            <h1 className="font-display text-lg font-bold tracking-wider text-white">
              Credits & Acknowledgements
            </h1>
          </div>
          <Link
            to="/mission-select"
            className="text-xs font-mono text-amber-400/90 hover:text-amber-300 transition-colors uppercase tracking-wider"
          >
            Launch Bay
          </Link>
        </div>
      </header>

      {/* Main Credits Content */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-12 w-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">
              NASA International Space Apps Challenge 2026
            </h2>
            <p className="text-xs text-regolith-300 mt-1 leading-relaxed">
              Cosmosyy is an interactive web simulation built for the challenge:{" "}
              <span className="text-amber-300 font-semibold">
                &ldquo;NASA&apos;s Discarded Equipment Storytelling&rdquo;
              </span>
              . Dedicated to celebrating human exploration, preserving extraterrestrial cultural
              heritage, and teaching the scientific legacy of artifacts on the Moon and Mars.
            </p>
          </div>
        </div>

        {/* Section 1: NASA Scientific Data & Archives */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3">
            <Database className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              NASA Planetary Data & Historical Archives
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border border-space-800 bg-space-950/60 p-4">
              <h4 className="font-bold text-white flex items-center justify-between">
                <span>Apollo Lunar Surface Journal (ALSJ)</span>
                <a
                  href="https://www.nasa.gov/history/alsj/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </h4>
              <p className="text-regolith-400 mt-1.5 leading-relaxed">
                Transcripts, mission audio, Houston CAPCOM communications, and ground telemetry
                curated by Eric M. Jones and Ken Glover.
              </p>
            </div>

            <div className="rounded-lg border border-space-800 bg-space-950/60 p-4">
              <h4 className="font-bold text-white flex items-center justify-between">
                <span>NASA Planetary Data System (PDS)</span>
                <a
                  href="https://pds.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </h4>
              <p className="text-regolith-400 mt-1.5 leading-relaxed">
                Orbital photographic mosaics and elevation digital elevation models from the Lunar
                Reconnaissance Orbiter (LRO) Narrow Angle Camera.
              </p>
            </div>

            <div className="rounded-lg border border-space-800 bg-space-950/60 p-4">
              <h4 className="font-bold text-white flex items-center justify-between">
                <span>Mars Exploration Program (JPL/NASA)</span>
                <a
                  href="https://mars.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </h4>
              <p className="text-regolith-400 mt-1.5 leading-relaxed">
                Landing coordinates, scientific discoveries, and panoramic observations from Viking
                1, Mars Pathfinder, Spirit, Opportunity, Curiosity, and Perseverance.
              </p>
            </div>

            <div className="rounded-lg border border-space-800 bg-space-950/60 p-4">
              <h4 className="font-bold text-white flex items-center justify-between">
                <span>NASA Images and Media Archive</span>
                <a
                  href="https://images.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </h4>
              <p className="text-regolith-400 mt-1.5 leading-relaxed">
                High-resolution Hasselblad EVA photographs and rover hazard camera imagery archived
                for public domain educational use.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 3D Models & Heritage Assets */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              3D Models & Scientific Reconstructions
            </h3>
          </div>

          <div className="space-y-3 text-xs text-regolith-300 leading-relaxed">
            <p>
              • <strong className="text-white">NASA 3D Resources:</strong> Reconstructed spacecraft
              models, including the Apollo Lunar Module Descent Stage, Apollo Ascent Stage, Mars
              Aeroshell, and Descent Stages.
            </p>
            <p>
              • <strong className="text-white">Heritage Equipment Models:</strong> ALSEP Central
              Station, Laser Ranging Retroreflector (LRRR), Solar Wind Composition Experiment, Lunar
              Roving Vehicle (LRV), and Mars Rovers provided via NASA/JPL open access 3D
              repositories.
            </p>
            <p>
              • <strong className="text-white">Interactive Exploded View Engine:</strong>{" "}
              Procedurally animates and decomposes 3D GLB subsystems along exact vectors based on
              NASA engineering schematics.
            </p>
          </div>
        </section>

        {/* Section 3: Open Source Software Stack */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3">
            <Globe className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              Open-Source Technology Architecture
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { name: "React 19", desc: "Core UI Engine" },
              { name: "Three.js & R3F", desc: "3D WebGL Rendering" },
              { name: "@react-three/drei", desc: "3D Shader & GLTF Helpers" },
              { name: "Tailwind CSS v4", desc: "Design System & Tokens" },
              { name: "Zustand", desc: "State Management" },
              { name: "Howler.js", desc: "Spatial Audio Engine" },
              { name: "Lucide React", desc: "Interface Iconography" },
              { name: "Vite", desc: "Build & Module Bundler" },
              { name: "TypeScript", desc: "Strict Type Safety" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="rounded-lg border border-space-800/80 bg-space-950/40 p-3"
              >
                <span className="text-white font-bold block">{tech.name}</span>
                <span className="text-[10px] text-regolith-400 block mt-0.5">{tech.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-space-800/80 bg-space-900/40 py-4 text-center text-xs font-mono text-regolith-500">
        Cosmosyy Engine v2.4 · NASA Space Apps Challenge 2026 · Made for explorers worldwide
      </footer>
    </div>
  );
}
