import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { router } from "@/router";

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
      <p className="text-fg-muted">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
