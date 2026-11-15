import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore, ACHIEVEMENT_DEFS } from "@/store/useAppStore";

interface ToastItem {
  id: string;
  type: "achievement" | "rankUp" | "combo";
  title: string;
  subtitle: string;
  icon: string;
}

let toastIdCounter = 0;

export function GameToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const popAchievements = useAppStore((s) => s.popPendingAchievements);
  const popRankUp = useAppStore((s) => s.popPendingRankUp);
  const comboCount = useAppStore((s) => s.session.comboCount);

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const achievements = popAchievements();
      for (const achId of achievements) {
        const def = ACHIEVEMENT_DEFS.find((a) => a.id === achId);
        if (def) {
          addToast({
            type: "achievement",
            title: "Achievement Unlocked!",
            subtitle: def.title,
            icon: def.icon,
          });
        }
      }
      const rankUp = popRankUp();
      if (rankUp) {
        addToast({
          type: "rankUp",
          title: "Rank Up!",
          subtitle: rankUp,
          icon: "🎖",
        });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [popAchievements, popRankUp, addToast]);

  useEffect(() => {
    if (comboCount >= 2) {
      addToast({
        type: "combo",
        title: `${comboCount}x Combo!`,
        subtitle: "Scan streak bonus",
        icon: "🔥",
      });
    }
  }, [comboCount, addToast]);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[200] flex flex-col items-end gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              toast.type === "achievement"
                ? "border-amber-400/50 bg-gradient-to-r from-amber-950/90 to-amber-900/80 shadow-amber-500/20"
                : toast.type === "rankUp"
                  ? "border-signal/50 bg-gradient-to-r from-signal/20 to-signal/10 shadow-signal/20"
                  : "border-orange-500/50 bg-gradient-to-r from-orange-950/90 to-orange-900/70 shadow-orange-500/20"
            }`}
          >
            <span className="text-2xl">{toast.icon}</span>
            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  toast.type === "achievement"
                    ? "text-amber-300"
                    : toast.type === "rankUp"
                      ? "text-signal"
                      : "text-orange-300"
                }`}
              >
                {toast.title}
              </p>
              <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                {toast.subtitle}
              </p>
            </div>
            {toast.type === "achievement" && (
              <div className="ml-1 h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
