import { notFound } from "next/navigation";
import { getMatchById } from "@/lib/actions/matchActions";
import MatchTimeline from "@/components/MatchTimeline";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) return notFound();

  const dateStr = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tournament & Date */}
      <div className="text-center">
        <p className="text-sm text-gray-400">{match.tournament.name}</p>
        <p className="text-xs text-gray-500">
          {dateStr} · {match.venue}
        </p>
      </div>

      {/* Scoreboard */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
              ⚽
            </div>
            <p className="font-bold text-white text-lg">
              {match.homeTeam.name}
            </p>
            <p className="text-xs text-gray-400">{match.homeTeam.shortName}</p>
          </div>

          {/* Score */}
          <div className="text-center px-8">
            {match.status === "UPCOMING" ? (
              <p className="text-2xl text-gray-500">vs</p>
            ) : (
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-white">
                    {match.homeScore}
                  </span>
                  <span className="text-2xl text-gray-500">-</span>
                  <span className="text-5xl font-bold text-white">
                    {match.awayScore}
                  </span>
                </div>
                {match.status === "LIVE" && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    LIVE
                  </span>
                )}
                {match.status === "FINISHED" && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-600 text-gray-200">
                    Full Time
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
              ⚽
            </div>
            <p className="font-bold text-white text-lg">
              {match.awayTeam.name}
            </p>
            <p className="text-xs text-gray-400">{match.awayTeam.shortName}</p>
          </div>
        </div>
      </div>

      {/* Match Events */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Match Events</h2>
        <MatchTimeline events={match.events} homeTeamId={match.homeTeamId} />
      </div>

      {/* Lineups */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-semibold text-white mb-3">
            {match.homeTeam.name}
          </h3>
          <div className="space-y-1">
            {match.homeTeam.players.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-6 text-right">{p.number}</span>
                <span className="text-gray-300">{p.name}</span>
                {/* <span className="text-xs text-gray-500">{p.position}</span> */}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-semibold text-white mb-3">
            {match.awayTeam.name}
          </h3>
          <div className="space-y-1">
            {match.awayTeam.players.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-6 text-right">{p.number}</span>
                <span className="text-gray-300">{p.name}</span>
                {/* <span className="text-xs text-gray-500">{p.position}</span> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
