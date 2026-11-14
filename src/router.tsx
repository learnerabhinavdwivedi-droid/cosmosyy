import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const MissionSelectPage = lazy(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const GameShell = lazy(() => import("@/features/game/GameShell"));
const CreditsPage = lazy(() => import("@/features/credits/CreditsPage"));
const AboutPage = lazy(() => import("@/features/about/AboutPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(LandingPage) },
  { path: "/missions", element: withSuspense(MissionSelectPage) },
  { path: "/select", element: withSuspense(MissionSelectPage) },
  { path: "/play/:missionId", element: withSuspense(GameShell) },
  { path: "/credits", element: withSuspense(CreditsPage) },
  { path: "/about", element: withSuspense(AboutPage) },
  { path: "/settings", element: withSuspense(SettingsPage) },
]);
