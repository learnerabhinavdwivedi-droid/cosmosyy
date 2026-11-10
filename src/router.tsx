import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

const MissionSelectPage = lazy(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const GameShell = lazy(() => import("@/features/game/GameShell"));
const CreditsPage = lazy(() => import("@/features/credits/CreditsPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
