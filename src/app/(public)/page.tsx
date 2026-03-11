import LiveScoreBoard from "@/components/LiveScoreBoard";
import MatchCard from "@/components/MatchCard";
import { getMatches } from "@/lib/actions/matchActions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allMatches = await getMatches();

  const recentResults = allMatches
    .filter((m) => m.status === "FINISHED")
    .slice(-5)
    .reverse();

  const upcomingMatches = allMatches
    .filter((m) => m.status === "UPCOMING")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Live Matches */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          Live Matches
        </h2>
        <LiveScoreBoard />
      </section>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Upcoming Matches
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Recent Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recentResults.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
