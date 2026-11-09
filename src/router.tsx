import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const MissionSelectPage = lazy(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const FlightPage = lazy(() => import("@/features/flight/FlightPage"));
const SitePage = lazy(() => import("@/features/site/SitePage"));
const ReportPage = lazy(() => import("@/features/report/ReportPage"));
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
  { path: "/flight/:missionId", element: withSuspense(FlightPage) },
  { path: "/site/:missionId", element: withSuspense(SitePage) },
  { path: "/report/:missionId", element: withSuspense(ReportPage) },
  { path: "/credits", element: withSuspense(CreditsPage) },
  { path: "/settings", element: withSuspense(SettingsPage) },
]);
