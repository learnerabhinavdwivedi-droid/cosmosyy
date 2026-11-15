import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore, type Quality, type AudioLanguage } from "@/store/useAppStore";
import { gameAudio } from "@/lib/gameAudio";
import { setNarrationVolume } from "@/lib/narration";
import { setBus } from "@/lib/audio";
import { playTutorPreview } from "@/lib/tutorVoice";
import { Howler } from "howler";
import {
  Volume2,
  VolumeX,
  Monitor,
  Shield,
  ArrowLeft,
  RefreshCw,
  Check,
  Sparkles,
  Radio,
  Mic,
  Headphones,
  Languages,
  Sliders,
  Gauge,
  Play,
  Square,
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
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

  const [previewingLang, setPreviewingLang] = useState<AudioLanguage | null>(null);
  const previewCancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (previewCancelRef.current) {
        previewCancelRef.current();
      }
    };
  }, []);

  const masterVol = settings.volume ?? 0.8;
  const narrationVol = settings.narrationVolume ?? 0.9;
  const sfxVol = settings.sfxVolume ?? 0.8;
  const musicVol = settings.musicVolume ?? 0.6;
  const tutorRate = settings.tutorRate ?? 0.95;
  const audioLang = settings.audioLanguage ?? "english";

  const handleMasterVolumeChange = (vol: number) => {
    setSetting("volume", vol);
    gameAudio.setVolume(vol * sfxVol);
    setNarrationVolume(vol * narrationVol);
    setBus("master", vol);
    Howler.volume(vol);
  };

  const handleNarrationVolumeChange = (vol: number) => {
    setSetting("narrationVolume", vol);
    setBus("narration", vol);
    setNarrationVolume(masterVol * vol);
  };

  const handleSfxVolumeChange = (vol: number) => {
    setSetting("sfxVolume", vol);
    setBus("sfx", vol);
    gameAudio.setVolume(masterVol * vol);
  };

  const handleMusicVolumeChange = (vol: number) => {
    setSetting("musicVolume", vol);
    setBus("music", vol);
  };

  const handleTutorRateChange = (rate: number) => {
    setSetting("tutorRate", rate);
  };

  const handleLanguageChange = (lang: AudioLanguage) => {
    setSetting("audioLanguage", lang);
    if (lang === "hinglish") {
      void i18n.changeLanguage("hi");
    } else {
      void i18n.changeLanguage("en");
    }
  };

  const handleTogglePreview = (lang: AudioLanguage) => {
    if (previewingLang === lang) {
      if (previewCancelRef.current) {
        previewCancelRef.current();
        previewCancelRef.current = null;
      }
      setPreviewingLang(null);
    } else {
      if (previewCancelRef.current) {
        previewCancelRef.current();
      }
      setPreviewingLang(lang);
      previewCancelRef.current = playTutorPreview(lang, () => {
        setPreviewingLang(null);
        previewCancelRef.current = null;
      });
    }
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
              <label
                htmlFor="callsign"
                className="block text-xs font-mono uppercase tracking-wider text-regolith-300"
              >
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
                <p className="font-mono text-base font-bold text-emerald-400">{totalXp} XP</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Audio & Voice Communications (Full Audio Control) */}
        <section className="rounded-xl border border-space-800 bg-space-900/40 backdrop-blur-md p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-space-800 pb-3">
            <Volume2 className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
                <span>Audio & Voice Communications</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase">
                  Full Control
                </span>
              </h2>
              <p className="text-xs text-regolith-400">
                Voice tutor language, individual volume channels, and transmission controls
              </p>
            </div>
          </div>

          {/* Subsection A: Language Selection (English vs Hinglish) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-regolith-300 flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5 text-amber-400" />
                <span>Tutor Voice & Narration Language</span>
              </label>
              <span className="text-[10px] font-mono text-regolith-400">
                Active: {audioLang === "hinglish" ? "🇮🇳 Hinglish" : "🇬🇧 English"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: English */}
              <div
                onClick={() => handleLanguageChange("english")}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between gap-3 ${
                  audioLang === "english"
                    ? "border-amber-400/80 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "border-space-800 bg-space-950/40 hover:border-space-700 hover:bg-space-800/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🇬🇧</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">English</h3>
                      <p className="text-[11px] text-regolith-400">Clear Global Space Tutor</p>
                    </div>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      audioLang === "english"
                        ? "border-amber-400 bg-amber-400"
                        : "border-space-600 bg-transparent"
                    }`}
                  >
                    {audioLang === "english" && <Check className="h-2.5 w-2.5 text-space-950 stroke-[3]" />}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePreview("english");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-space-800/80 hover:bg-space-700/80 border border-space-700 text-xs font-mono text-amber-300 transition-colors"
                >
                  {previewingLang === "english" ? (
                    <>
                      <Square className="h-3 w-3 fill-amber-300" />
                      <span>Stop Sample</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-amber-300" />
                      <span>Test English Voice</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Hinglish */}
              <div
                onClick={() => handleLanguageChange("hinglish")}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between gap-3 ${
                  audioLang === "hinglish"
                    ? "border-amber-400/80 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "border-space-800 bg-space-950/40 hover:border-space-700 hover:bg-space-800/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🇮🇳</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Hinglish</h3>
                      <p className="text-[11px] text-regolith-400">Warm Desi Space Guide</p>
                    </div>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      audioLang === "hinglish"
                        ? "border-amber-400 bg-amber-400"
                        : "border-space-600 bg-transparent"
                    }`}
                  >
                    {audioLang === "hinglish" && <Check className="h-2.5 w-2.5 text-space-950 stroke-[3]" />}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePreview("hinglish");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-space-800/80 hover:bg-space-700/80 border border-space-700 text-xs font-mono text-amber-300 transition-colors"
                >
                  {previewingLang === "hinglish" ? (
                    <>
                      <Square className="h-3 w-3 fill-amber-300" />
                      <span>Stop Sample</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-amber-300" />
                      <span>Test Hinglish Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Subsection B: Channel Volume Sliders */}
          <div className="pt-4 border-t border-space-800/60 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-regolith-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              <span>Independent Channel Mixers</span>
            </h3>

            {/* 1. Master Volume */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-white flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5 text-amber-400" />
                  <span>Master Volume</span>
                </span>
                <span className="text-amber-400 font-bold">{Math.round(masterVol * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleMasterVolumeChange(masterVol > 0 ? 0 : 0.8)}
                  className="p-1.5 rounded-lg border border-space-700 bg-space-800/80 hover:bg-space-700 text-regolith-300 transition-colors"
                  title={masterVol > 0 ? "Mute All" : "Unmute All"}
                >
                  {masterVol === 0 ? (
                    <VolumeX className="h-4 w-4 text-red-400" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVol}
                  onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* 2. Tutor Voice & Narration */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-regolith-300 flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Tutor Voice & Story Narration</span>
                </span>
                <span className="text-cyan-400 font-bold">{Math.round(narrationVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={narrationVol}
                onChange={(e) => handleNarrationVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* 3. Sound Effects (SFX) */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-regolith-300 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Telemetry & Rover Sound Effects (SFX)</span>
                </span>
                <span className="text-emerald-400 font-bold">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* 4. Atmospheric Music / Drone */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-regolith-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Atmospheric Space Ambient / Music</span>
                </span>
                <span className="text-purple-400 font-bold">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* Subsection C: Tutor Speech Speed / Cadence */}
          <div className="pt-4 border-t border-space-800/60">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-regolith-300 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-amber-400" />
                <span>Tutor Speech Speed (Cadence)</span>
              </span>
              <span className="text-amber-400 font-bold">{tutorRate.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-regolith-500">0.80x (Calm)</span>
              <input
                type="range"
                min="0.80"
                max="1.20"
                step="0.05"
                value={tutorRate}
                onChange={(e) => handleTutorRateChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] font-mono text-regolith-500">1.20x (Brisk)</span>
            </div>
          </div>

          {/* Subsection D: Subtitles / Captions Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-space-800/60">
            <div>
              <span className="text-sm font-medium text-white block">
                Radio Transmission Subtitles & Captions
              </span>
              <span className="text-xs text-regolith-400">
                Display synchronized on-screen text during voice explanations and flight phases
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
                      {q === "low"
                        ? "Performance / 30 FPS"
                        : q === "medium"
                          ? "Balanced / 60 FPS"
                          : "Max Fidelity & Bloom"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-space-800/60">
              <div>
                <span className="text-sm font-medium text-white block">Reduced Motion Mode</span>
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
        Cosmosyy Engine v2.4 · NASA Space Apps Challenge 2026 · Built with React 19, Three.js &
        Tailwind CSS
      </footer>
    </div>
  );
}
