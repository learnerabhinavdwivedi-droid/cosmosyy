import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";
import { router } from "@/router";
import { isTouchDevice } from "@/lib/useMobile";
import { isFullscreen, requestFullscreen } from "@/lib/fullscreen";

function GlobalMobileFullscreenFocus() {
  useEffect(() => {
    if (!isTouchDevice()) return;

    const handleFirstTouch = () => {
      if (!isFullscreen()) {
        requestFullscreen().catch(() => {});
      }
    };

    window.addEventListener("touchend", handleFirstTouch, { passive: true });
    window.addEventListener("pointerup", handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener("touchend", handleFirstTouch);
      window.removeEventListener("pointerup", handleFirstTouch);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalMobileFullscreenFocus />
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
