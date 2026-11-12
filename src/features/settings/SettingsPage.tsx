import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore, type Quality } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const settings = useAppStore((s) => s.settings);
  const setSetting = useAppStore((s) => s.setSetting);

  const handleVolumeChange = (values: number[]) => {
    const val = values[0];
    if (val !== undefined) {
      setSetting("volume", val / 100);
    }
  };

  const handleQualityChange = (q: Quality) => {
    setSetting("quality", q);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-space-950 px-4 py-12 text-fg">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--space-900)_0%,_var(--space-950)_75%)]" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-space-700/60 bg-space-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between border-b border-space-700/50 pb-4">
          <h1 className="font-display text-2xl font-bold text-regolith-100">
            {t("settings.title", { defaultValue: "Settings" })}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="border-space-700 bg-space-800/80 text-regolith-200 hover:bg-space-700 hover:text-signal"
          >
            ← {t("common.back", { defaultValue: "Back" })}
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Master Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-regolith-200">
                {t("settings.volume", { defaultValue: "Master Volume" })}
              </Label>
              <span className="font-mono text-xs text-signal">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <Slider
              value={[Math.round(settings.volume * 100)]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="py-2"
            />
          </div>

          {/* Captions */}
          <div className="flex items-center justify-between rounded-lg border border-space-700/30 bg-space-800/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-regolith-200">
                {t("settings.captions", { defaultValue: "Captions & Subtitles" })}
              </Label>
              <p className="text-xs text-regolith-400">
                {t("settings.captionsDesc", { defaultValue: "Show on-screen voice transcriptions and EVA commentary" })}
              </p>
            </div>
            <Switch
              checked={settings.captions}
              onCheckedChange={(checked) => setSetting("captions", checked)}
            />
          </div>

          {/* Graphics Quality */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-regolith-200">
              {t("settings.quality", { defaultValue: "Visual Quality" })}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as Quality[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQualityChange(q)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
                    settings.quality === q
                      ? "border-signal bg-signal/20 text-signal shadow-sm"
                      : "border-space-700 bg-space-800/60 text-regolith-400 hover:border-space-600 hover:text-regolith-200"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between rounded-lg border border-space-700/30 bg-space-800/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-regolith-200">
                {t("settings.reducedMotion", { defaultValue: "Reduced Motion" })}
              </Label>
              <p className="text-xs text-regolith-400">
                {t("settings.reducedMotionDesc", { defaultValue: "Disable HUD blinks and camera head bobbing" })}
              </p>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => setSetting("reducedMotion", checked)}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-space-700/40 pt-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-signal font-semibold text-space-950 hover:bg-signal/90"
          >
            {t("settings.saveAndReturn", { defaultValue: "Done" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
