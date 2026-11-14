import { useRef, useCallback, useEffect, useState } from "react";
import { isTouchDevice } from "@/lib/useMobile";
import { useTouchStore } from "@/store/useTouchStore";
import { useGameStore } from "@/store/useGameStore";

const LOOK_SENSITIVITY = 0.004;
const JOYSTICK_RADIUS = 50;

interface JoystickState {
  active: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
}

export function TouchControls({
  nearObjectId,
  canScan,
  onScan,
  onFlag,
  onLaunch,
  onOpenStory,
}: {
  nearObjectId: string | null;
  canScan: boolean;
  onScan: () => void;
  onFlag: () => void;
  onLaunch: () => void;
  onOpenStory?: () => void;
}) {
  const phase = useGameStore((s) => s.phase);
  const lookFingerId = useRef<number | null>(null);
  const lookLastX = useRef(0);
  const lookLastY = useRef(0);

  const [joystick, setJoystick] = useState<JoystickState>({
    active: false,
    originX: 0,
    originY: 0,
    currentX: 0,
    currentY: 0,
  });
  const joystickFingerId = useRef<number | null>(null);

  const scanTimerRef = useRef<number>(0);
  const scanStartRef = useRef<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // --- Look zone (right side) ---
  const handleLookStart = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (!touch) continue;
      if (touch.clientX > window.innerWidth * 0.4 && lookFingerId.current === null) {
        lookFingerId.current = touch.identifier;
        lookLastX.current = touch.clientX;
        lookLastY.current = touch.clientY;
      }
    }
  }, []);

  const handleLookMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (!touch) continue;
      if (touch.identifier === lookFingerId.current) {
        const dx = touch.clientX - lookLastX.current;
        const dy = touch.clientY - lookLastY.current;
        lookLastX.current = touch.clientX;
        lookLastY.current = touch.clientY;
        useTouchStore.getState().addLookDelta(dx * LOOK_SENSITIVITY, dy * LOOK_SENSITIVITY);
      }
    }
  }, []);

  const handleLookEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch && touch.identifier === lookFingerId.current) {
        lookFingerId.current = null;
      }
    }
  }, []);

  // --- Joystick (left side) ---
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (!touch) continue;
      if (touch.clientX <= window.innerWidth * 0.4 && joystickFingerId.current === null) {
        joystickFingerId.current = touch.identifier;
        setJoystick({
          active: true,
          originX: touch.clientX,
          originY: touch.clientY,
          currentX: touch.clientX,
          currentY: touch.clientY,
        });
      }
    }
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (!touch) continue;
      if (touch.identifier === joystickFingerId.current) {
        setJoystick((prev) => {
          const dx = touch.clientX - prev.originX;
          const dy = touch.clientY - prev.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const clamped = Math.min(dist, JOYSTICK_RADIUS);
          const angle = Math.atan2(dy, dx);
          const cx = prev.originX + Math.cos(angle) * clamped;
          const cy = prev.originY + Math.sin(angle) * clamped;

          const normX = (clamped / JOYSTICK_RADIUS) * Math.cos(angle);
          const normY = (clamped / JOYSTICK_RADIUS) * Math.sin(angle);
          useTouchStore.getState().setMove(normX, normY);

          return { ...prev, currentX: cx, currentY: cy };
        });
      }
    }
  }, []);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch && touch.identifier === joystickFingerId.current) {
        joystickFingerId.current = null;
        setJoystick({ active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 });
        useTouchStore.getState().setMove(0, 0);
      }
    }
  }, []);

  // Combined touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleJoystickStart(e);
      handleLookStart(e);
    },
    [handleJoystickStart, handleLookStart],
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleJoystickMove(e);
      handleLookMove(e);
    },
    [handleJoystickMove, handleLookMove],
  );
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      handleJoystickEnd(e);
      handleLookEnd(e);
    },
    [handleJoystickEnd, handleLookEnd],
  );

  // --- Scan hold button ---
  const startScan = useCallback(() => {
    if (!canScan || !nearObjectId) return;
    scanStartRef.current = Date.now();
    const animate = () => {
      if (scanStartRef.current === null) return;
      const elapsed = (Date.now() - scanStartRef.current) / 1000;
      const p = Math.min(elapsed / 1.5, 1);
      setScanProgress(p);
      if (p >= 1) {
        scanStartRef.current = null;
        setScanProgress(0);
        onScan();
        return;
      }
      scanTimerRef.current = requestAnimationFrame(animate);
    };
    scanTimerRef.current = requestAnimationFrame(animate);
  }, [canScan, nearObjectId, onScan]);

  const cancelScan = useCallback(() => {
    scanStartRef.current = null;
    cancelAnimationFrame(scanTimerRef.current);
    setScanProgress(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(scanTimerRef.current);
      useTouchStore.getState().reset();
    };
  }, []);

  if (!isTouchDevice()) return null;

  const showScan = nearObjectId && canScan && phase !== "inspect";
  const showFlag = phase === "flagReady";
  const showLaunch = phase === "flagPlanted";
  const showActions = phase !== "inspect";

  return (
    <>
      {/* Full-screen touch surface for joystick + look */}
      <div
        className="absolute inset-0 z-[5]"
        style={{ touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />

      {/* Joystick visual */}
      {joystick.active && (
        <div className="pointer-events-none absolute z-[15]">
          {/* Base circle */}
          <div
            className="rounded-full border-2 border-regolith-200/20 bg-space-950/30"
            style={{
              position: "fixed",
              left: joystick.originX - JOYSTICK_RADIUS,
              top: joystick.originY - JOYSTICK_RADIUS,
              width: JOYSTICK_RADIUS * 2,
              height: JOYSTICK_RADIUS * 2,
            }}
          />
          {/* Thumb */}
          <div
            className="rounded-full bg-regolith-200/50 shadow-lg"
            style={{
              position: "fixed",
              left: joystick.currentX - 20,
              top: joystick.currentY - 20,
              width: 40,
              height: 40,
            }}
          />
        </div>
      )}

      {/* Action buttons — bottom right */}
      {showActions && (
        <div className="absolute bottom-4 right-4 z-[15] flex flex-col-reverse items-end gap-3">
          {/* Jump */}
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full border border-regolith-200/30 bg-space-950/60 text-xs font-bold text-regolith-200 backdrop-blur active:bg-signal/30"
            style={{ touchAction: "none" }}
            onTouchStart={(e) => {
              e.stopPropagation();
              useTouchStore.getState().setJump(true);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              useTouchStore.getState().setJump(false);
            }}
          >
            JUMP
          </button>

          {/* Sprint toggle */}
          <SprintToggle />

          {/* Scan */}
          {showScan && (
            <button
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-signal/50 bg-signal/15 text-xs font-bold text-signal backdrop-blur active:bg-signal/30"
              style={{ touchAction: "none" }}
              onTouchStart={(e) => {
                e.stopPropagation();
                startScan();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                cancelScan();
              }}
              onTouchCancel={cancelScan}
            >
              SCAN
              {scanProgress > 0 && (
                <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 56 56">
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none" stroke="#00d4ff" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - scanProgress)}
                    transform="rotate(-90 28 28)"
                  />
                </svg>
              )}
            </button>
          )}

          {/* 3D Story Card */}
          {canScan && onOpenStory && (
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/80 bg-sky-500/25 text-[10px] font-black uppercase text-sky-200 backdrop-blur active:bg-sky-500/50 shadow-lg shadow-sky-500/30 font-mono animate-pulse"
              style={{ touchAction: "none" }}
              onTouchStart={(e) => {
                e.stopPropagation();
                onOpenStory();
              }}
            >
              STORY
            </button>
          )}

          {/* Flag */}
          {showFlag && (
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-signal/50 bg-signal/15 text-xs font-bold text-signal backdrop-blur animate-pulse active:bg-signal/30"
              style={{ touchAction: "none" }}
              onTouchStart={(e) => {
                e.stopPropagation();
                onFlag();
              }}
            >
              FLAG
            </button>
          )}

          {/* Launch */}
          {showLaunch && (
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-ok/50 bg-ok/15 text-xs font-bold text-ok backdrop-blur animate-pulse active:bg-ok/30"
              style={{ touchAction: "none" }}
              onTouchStart={(e) => {
                e.stopPropagation();
                onLaunch();
              }}
            >
              GO
            </button>
          )}
        </div>
      )}
    </>
  );
}

function SprintToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-full border text-[10px] font-bold backdrop-blur ${
        on
          ? "border-warn/60 bg-warn/25 text-warn"
          : "border-regolith-200/20 bg-space-950/40 text-regolith-400"
      }`}
      style={{ touchAction: "none" }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const next = !on;
        setOn(next);
        useTouchStore.getState().setSprint(next);
      }}
    >
      RUN
    </button>
  );
}
