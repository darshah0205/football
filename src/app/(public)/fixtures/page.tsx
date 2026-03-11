import MatchCard from "@/components/MatchCard";
import { getMatches } from "@/lib/actions/matchActions";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const matches = await getMatches("UPCOMING");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Upcoming Fixtures</h1>
      {matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-4xl mb-2">📅</p>
          <p className="text-gray-400">No upcoming fixtures</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
