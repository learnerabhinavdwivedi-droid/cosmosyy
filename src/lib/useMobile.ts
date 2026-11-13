import { useSyncExternalStore } from "react";

export function isTouchDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 || "ontouchstart" in window)
  );
}

function subscribe(cb: () => void) {
  const mql = window.matchMedia("(orientation: portrait)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function getIsPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}

export function useIsPortrait(): boolean {
  return useSyncExternalStore(subscribe, getIsPortrait, () => false);
}
