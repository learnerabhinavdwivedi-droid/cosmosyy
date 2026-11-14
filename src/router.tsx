import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    factory().catch((err) => {
      // If a dynamic chunk failed to load (e.g. fresh deployment or intermittent mobile signal),
      // reload once to fetch new manifest/chunks.
      const key = "cosmosyy_chunk_reload";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
      throw err;
    }),
  );
}

const LandingPage = lazyWithRetry(() => import("@/features/landing/LandingPage"));
const MissionSelectPage = lazyWithRetry(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const GameShell = lazyWithRetry(() => import("@/features/game/GameShell"));
const CreditsPage = lazyWithRetry(() => import("@/features/credits/CreditsPage"));
const AboutPage = lazyWithRetry(() => import("@/features/about/AboutPage"));
const SettingsPage = lazyWithRetry(() => import("@/features/settings/SettingsPage"));

function withSuspense(Component: React.ComponentType) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(LandingPage) },
  { path: "/missions", element: withSuspense(MissionSelectPage) },
  { path: "/select", element: withSuspense(MissionSelectPage) },
  { path: "/play/:missionId", element: withSuspense(GameShell) },
  { path: "/site/:missionId", element: withSuspense(GameShell) },
  { path: "/flight/:missionId", element: withSuspense(GameShell) },
  { path: "/credits", element: withSuspense(CreditsPage) },
  { path: "/about", element: withSuspense(AboutPage) },
  { path: "/settings", element: withSuspense(SettingsPage) },
  { path: "*", element: withSuspense(MissionSelectPage) },
]);
