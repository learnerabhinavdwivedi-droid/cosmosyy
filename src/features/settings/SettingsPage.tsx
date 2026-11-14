import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore, type Quality } from "@/store/useAppStore";
import { gameAudio } from "@/lib/gameAudio";
import { setNarrationVolume } from "@/lib/narration";
import { Howler } from "howler";
import { Volume2, VolumeX, Monitor, Shield, ArrowLeft, RefreshCw, Check, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const settings = useAppStore((s) => s.settings);
  const setSetting = useAppStore((s) => s.setSetting);
  const player = useAppStore((s) => s.player);
  const setPlayerName = useAppStore((s) => s.setPlayerName);
  const rank = useAppStore((s) => s.getRank());
  const totalXp = useAppStore((s) => s.progress.totalXp);
  const resetProgress = useAppStore((s) => s.resetProgress);

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tempName, setTempName] = useState(player.name || "");
  const [nameSaved, setNameSaved] = useState(false);

  const handleVolumeChange = (vol: number) => {
    setSetting("volume", vol);
    gameAudio.setVolume(vol);
    setNarrationVolume(vol);
    Howler.volume(vol);
  };

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerName(tempName.trim());
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleResetData = () => {
    resetProgress();
    setConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-space-950 text-regolith-100 flex flex-col">
      {/* Background stars / ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-800/25 via-space-950 to-space-950" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
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
              SYS-CFG // 04.9
            </span>
            <h1 className="font-display text-lg font-bold tracking-wider text-white">
              Mission Control Settings
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

      {/* Main Settings Container */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Section 1: Astronaut Identity */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3 mb-6">
            <Shield className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Astronaut Identity & Telemetry
              </h2>
              <p className="text-xs text-regolith-400">
                Callsign, flight status, and mission achievements
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <form onSubmit={handleNameSave} className="space-y-3">
              <label htmlFor="callsign" className="block text-xs font-mono uppercase tracking-wider text-regolith-300">
                Commander Callsign
              </label>
              <div className="flex gap-2">
                <input
                  id="callsign"
                  type="text"
                  maxLength={24}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Neil / Aldrin"
                  className="flex-1 rounded-lg border border-space-700 bg-space-800/80 px-3 py-2 text-sm text-white placeholder-regolith-500 focus:border-amber-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                >
                  {nameSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : null}
                  {nameSaved ? "Saved" : "Save"}
                </button>
              </div>
            </form>

            <div className="rounded-lg border border-space-800 bg-space-950/60 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-regolith-400">
                  Current Rank
                </span>
                <p className="font-display text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {rank}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-regolith-400">
                  Accumulated XP
                </span>
                <p className="font-mono text-base font-bold text-emerald-400">
                  {totalXp} XP
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Audio Configuration */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3 mb-6">
            <Volume2 className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Audio & Communications
              </h2>
              <p className="text-xs text-regolith-400">
                Telemetry beeps, thruster rumble, and mission control narration
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="uppercase tracking-wider text-regolith-300">
                  Master Communication Volume
                </span>
                <span className="text-amber-400 font-bold">{Math.round(settings.volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleVolumeChange(settings.volume > 0 ? 0 : 0.8)}
                  className="p-2 rounded-lg border border-space-700 bg-space-800/80 hover:bg-space-700 text-regolith-300 transition-colors"
                  title={settings.volume > 0 ? "Mute" : "Unmute"}
                >
                  {settings.volume === 0 ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Radio Captions Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-space-800/60">
              <div>
                <span className="text-sm font-medium text-white block">
                  Radio Transmission Captions
                </span>
                <span className="text-xs text-regolith-400">
                  Display real-time Quindar tone transcripts and mission briefings
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSetting("captions", !settings.captions)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.captions ? "bg-amber-500" : "bg-space-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.captions ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Visual & Performance */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3 mb-6">
            <Monitor className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                Display & Graphics Pipeline
              </h2>
              <p className="text-xs text-regolith-400">
                Viewport rendering fidelity, 3D post-processing, and performance options
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quality Preset */}
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-regolith-300 mb-3">
                3D Rendering Quality
              </span>
              <div className="grid grid-cols-3 gap-3">
                {(["low", "medium", "high"] as Quality[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSetting("quality", q)}
                    className={`rounded-lg border px-4 py-3 text-center transition-all ${
                      settings.quality === q
                        ? "border-amber-400 bg-amber-500/15 text-white shadow-sm shadow-amber-500/20"
                        : "border-space-700 bg-space-800/40 text-regolith-300 hover:border-space-600 hover:bg-space-800"
                    }`}
                  >
                    <span className="block text-xs font-mono uppercase font-bold tracking-wider">
                      {q}
                    </span>
                    <span className="text-[10px] text-regolith-400 mt-1 block">
                      {q === "low" ? "Performance / 30 FPS" : q === "medium" ? "Balanced / 60 FPS" : "Max Fidelity & Bloom"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-space-800/60">
              <div>
                <span className="text-sm font-medium text-white block">
                  Reduced Motion Mode
                </span>
                <span className="text-xs text-regolith-400">
                  Minimize camera bobbing, high-frequency camera shake, and rapid visual transitions
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSetting("reducedMotion", !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.reducedMotion ? "bg-amber-500" : "bg-space-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.reducedMotion ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Data Reset & System Info */}
        <section className="rounded-xl border border-red-950/60 bg-red-950/15 backdrop-blur-md p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-red-300">
                Mission Flight Recorder Reset
              </h2>
              <p className="text-xs text-red-200/70 mt-1">
                Erase local explorer progress, discovered artifacts, and flight log data
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded-lg border border-red-800/60 bg-red-900/30 px-4 py-2 text-xs font-bold font-mono tracking-wider text-red-300 hover:bg-red-900/50 transition-colors"
              >
                Reset Progress
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold font-mono tracking-wider text-white hover:bg-red-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-lg border border-space-700 bg-space-800 px-3 py-2 text-xs font-bold text-regolith-300 hover:bg-space-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {resetSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Flight log data has been successfully reset to default baseline.</span>
            </div>
          )}
        </section>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-space-800/80 bg-space-900/40 py-4 text-center text-xs font-mono text-regolith-500">
        Cosmosyy Engine v2.4 · NASA Space Apps Challenge 2026 · Built with React 19, Three.js & Tailwind CSS
      </footer>
    </div>
  );
}
