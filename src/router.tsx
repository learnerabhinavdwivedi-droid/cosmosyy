import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const MissionSelectPage = lazy(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const GameShell = lazy(() => import("@/features/game/GameShell"));
const CreditsPage = lazy(() => import("@/features/credits/CreditsPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
      <p className="text-fg-muted">Loading…</p>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(MissionSelectPage) },
  { path: "/play/:missionId", element: withSuspense(GameShell) },
  { path: "/credits", element: withSuspense(CreditsPage) },
  { path: "/settings", element: withSuspense(SettingsPage) },
]);
