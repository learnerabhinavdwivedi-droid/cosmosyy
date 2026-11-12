import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Keyboard, Eye, Rocket, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ControlsModal({ isOpen, onClose }: ControlsModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "h" || e.key === "H") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const controlGroups = [
    {
      icon: Keyboard,
      category: "Movement & Locomotion",
      items: [
        { keys: ["W", "A", "S", "D"], label: t("controls.move") + " (Walk across lunar regolith)" },
        { keys: ["Shift"], label: t("controls.run") + " (Lunar lope / sprint)" },
        { keys: ["Space"], label: t("controls.jump") + " (1/6th Earth gravity jump)" },
        { keys: ["Mouse / Drag"], label: "Look & turn camera" },
      ],
    },
    {
      icon: Eye,
      category: "Mission Exploration",
      items: [
        { keys: ["E"], label: t("controls.inspect") + " (Hold to scan nearby artifact)" },
        { keys: ["P"], label: t("controls.photo") + " (Toggle clean HUD-free screenshot view)" },
      ],
    },
    {
      icon: Rocket,
      category: "Mission Objectives",
      items: [
        { keys: ["F"], label: t("controls.flag") + " (Available once all artifacts found)" },
        { keys: ["L"], label: t("controls.launch") + " (Fire ascent engine & head home)" },
        { keys: ["H"], label: t("controls.help") + " (Toggle this controls overlay)" },
        { keys: ["Esc"], label: t("controls.back") + " (Pause / exit inspect / unlock cursor)" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-space-700/80 bg-space-900/95 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-space-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-500/10 text-signal-500">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold tracking-wider text-paper-50 uppercase">
                {t("controls.heading")}
              </h2>
              <p className="text-xs text-regolith-400">
                Apollo Astronaut Flight & Surface Keybindings
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 rounded-full p-0 text-regolith-400 hover:text-paper-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Control List */}
        <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {controlGroups.map((group, gIdx) => {
            const Icon = group.icon;
            return (
              <div key={gIdx} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-regolith-400 uppercase">
                  <Icon className="h-3.5 w-3.5 text-signal-500" />
                  {group.category}
                </div>
                <div className="space-y-1.5 rounded-xl border border-space-800/80 bg-space-950/60 p-3">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <span className="text-regolith-200">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="rounded-md border border-space-700 bg-space-800/80 px-2 py-0.5 font-mono text-[11px] font-medium text-paper-50 shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-5 flex items-center justify-between border-t border-space-800 pt-3 text-xs text-regolith-400">
          <span>Press <kbd className="rounded border border-space-700 bg-space-800 px-1 py-0.5 font-mono text-[10px] text-paper-50">H</kbd> anytime during EVA</span>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-space-800 hover:bg-space-700 text-paper-50 text-xs"
          >
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
