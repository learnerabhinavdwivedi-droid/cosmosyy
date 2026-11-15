import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export interface KeyAction {
  key: string;
  label: string;
  onPress: () => void;
  visible?: boolean;
  blink?: boolean;
}

interface KeyPromptProps {
  actions: KeyAction[];
  className?: string;
}

export function KeyPrompt({ actions, className }: KeyPromptProps) {
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const blinkTimers = useRef(new Map<string, number>());
  const [blinkPhase, setBlinkPhase] = useState(new Map<string, number>());

  const visibleActions = actions.filter((a) => a.visible !== false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const action = visibleActions.find((a) => a.key.toLowerCase() === e.key.toLowerCase());
      if (!action) return;

      setFlashKey(action.key);
      setTimeout(() => setFlashKey(null), 150);
      action.onPress();
    },
    [visibleActions],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (reducedMotion) return;

    for (const action of visibleActions) {
      if (action.blink && !blinkTimers.current.has(action.key)) {
        let count = 0;
        const id = window.setInterval(() => {
          count++;
          setBlinkPhase((prev) => {
            const next = new Map(prev);
            next.set(action.key, count);
            return next;
          });
          if (count >= 6) {
            window.clearInterval(id);
            blinkTimers.current.delete(action.key);
          }
        }, 500);
        blinkTimers.current.set(action.key, id);
      }
    }

    return () => {
      for (const id of blinkTimers.current.values()) {
        window.clearInterval(id);
      }
      blinkTimers.current.clear();
    };
  }, [visibleActions, reducedMotion]);

  if (visibleActions.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg px-4 py-2",
        "bg-space-900/80 backdrop-blur-sm border border-space-700/50",
        className,
      )}
    >
      {visibleActions.map((action) => {
        const phase = blinkPhase.get(action.key) ?? 0;
        const isBlinking = action.blink && phase > 0 && phase < 6 && phase % 2 === 1;
        const isFlashing = flashKey === action.key;

        return (
          <button
            key={action.key}
            onClick={action.onPress}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-all duration-150",
              "text-regolith-200 hover:text-paper-50",
              isFlashing && "scale-95",
            )}
          >
            <kbd
              className={cn(
                "inline-flex h-6 min-w-6 items-center justify-center rounded px-1.5",
                "bg-space-700 text-xs font-mono font-semibold uppercase",
                "border border-space-700/80",
                "transition-all duration-150",
                isFlashing && "bg-signal text-space-950 border-signal",
                isBlinking && !reducedMotion && "bg-signal/80 text-space-950 border-signal",
                !isBlinking && action.blink && reducedMotion && "ring-1 ring-signal",
              )}
            >
              {action.key.length === 1 ? action.key.toUpperCase() : action.key}
            </kbd>
            <span className="whitespace-nowrap">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
