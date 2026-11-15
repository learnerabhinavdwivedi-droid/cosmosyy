import { useSyncExternalStore, useCallback } from "react";

export function isFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  const doc = document as Document & {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
  };
  return Boolean(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement,
  );
}

export async function requestFullscreen(
  element: Element = document.documentElement,
): Promise<boolean> {
  try {
    const el = element as HTMLElement & {
      webkitRequestFullscreen?: (options?: unknown) => Promise<void>;
      mozRequestFullScreen?: (options?: unknown) => Promise<void>;
      msRequestFullscreen?: (options?: unknown) => Promise<void>;
    };

    const options = { navigationUI: "hide" } as FullscreenOptions;

    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen(options);
      } catch {
        await el.requestFullscreen();
      }
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen(options);
    } else if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen(options);
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
    }

    // Lock orientation to landscape on mobile after entering fullscreen
    const so = screen.orientation as
      | (ScreenOrientation & {
          lock?: (o: string) => Promise<void>;
        })
      | undefined;
    if (so?.lock) {
      await so.lock("landscape").catch(() => {});
    }

    return true;
  } catch {
    return false;
  }
}

export async function exitFullscreen(): Promise<boolean> {
  try {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
    }

    const so = screen.orientation as
      | (ScreenOrientation & {
          unlock?: () => void;
        })
      | undefined;
    so?.unlock?.();

    return true;
  } catch {
    return false;
  }
}

export async function toggleFullscreen(element?: Element): Promise<boolean> {
  if (isFullscreen()) {
    await exitFullscreen();
    return false;
  }
  return await requestFullscreen(element);
}

function subscribe(callback: () => void) {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  document.addEventListener("mozfullscreenchange", callback);
  document.addEventListener("MSFullscreenChange", callback);
  return () => {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
    document.removeEventListener("mozfullscreenchange", callback);
    document.removeEventListener("MSFullscreenChange", callback);
  };
}

export function useFullscreen() {
  const active = useSyncExternalStore(subscribe, isFullscreen, () => false);

  const toggle = useCallback(() => toggleFullscreen(), []);
  const enter = useCallback(() => requestFullscreen(), []);
  const exit = useCallback(() => exitFullscreen(), []);

  return { isFullscreen: active, toggle, enter, exit };
}
