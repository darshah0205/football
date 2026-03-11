import PointsTable from "@/components/PointsTable";
import { getStandings } from "@/lib/actions/standingActions";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const standings = await getStandings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Points Table</h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <PointsTable standings={standings} />
      </div>
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>Win = 3 points · Draw = 1 point · Loss = 0 points</p>
        <p>Teams are ranked by points, then goal difference, then goals scored.</p>
      </div>
    </div>
  );
}
