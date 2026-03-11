import MatchCard from "@/components/MatchCard";
import { getMatches } from "@/lib/actions/matchActions";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const matches = await getMatches("FINISHED");
  const reversed = [...matches].reverse();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Match Results</h1>
      {reversed.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-gray-400">No results yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reversed.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
