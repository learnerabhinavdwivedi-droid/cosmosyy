import { useParams } from "react-router-dom";

export default function FlightPage() {
  const { missionId } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
      <h1 className="font-display text-3xl font-bold">
        Flight — {missionId}
      </h1>
    </div>
  );
}
