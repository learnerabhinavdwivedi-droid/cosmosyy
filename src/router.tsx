import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const MissionSelectPage = lazy(
  () => import("@/features/mission-select/MissionSelectPage"),
);
const FlightPage = lazy(() => import("@/features/flight/FlightPage"));
const SitePage = lazy(() => import("@/features/site/SitePage"));
const ReportPage = lazy(() => import("@/features/report/ReportPage"));
const CreditsPage = lazy(() => import("@/features/credits/CreditsPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

export const router = createBrowserRouter([
  { path: "/", element: <MissionSelectPage /> },
  { path: "/flight/:missionId", element: <FlightPage /> },
  { path: "/site/:missionId", element: <SitePage /> },
  { path: "/report/:missionId", element: <ReportPage /> },
  { path: "/credits", element: <CreditsPage /> },
  { path: "/settings", element: <SettingsPage /> },
]);
