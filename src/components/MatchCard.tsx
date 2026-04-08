import Link from "next/link";
import type { Match, Team, MatchEvent, Player } from "@prisma/client";

type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
  events?: (MatchEvent & { player: Player })[];
};

function StatusBadge({ status }: { status: string }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
        <span className="w-2 h-2 bg-white rounded-full" />
        LIVE
      </span>
    );
  }
  if (status === "FINISHED") {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-600 text-gray-200">
        FT
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-blue-100">
      Upcoming
    </span>
  );
}

export default function MatchCard({ match }: { match: MatchWithTeams }) {
  const dateStr = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/match/${match.id}`} className="mb-2">
      <div
        className={`bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all border ${
          match.status === "LIVE"
            ? "border-red-500/50 shadow-lg shadow-red-500/10"
            : "border-gray-700 hover:border-gray-600"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">{dateStr}</span>
          <StatusBadge status={match.status} />
        </div>
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
              ⚽
            </div>
            <div>
              <p className="font-semibold text-white">
                {match.homeTeam.shortName}
              </p>
              <p className="text-xs text-gray-400">{match.homeTeam.name}</p>
            </div>
          </div>
          {/* Score */}
          <div className="px-4 text-center">
            {match.status === "UPCOMING" ? (
              <p className="text-lg text-gray-500">vs</p>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {match.homeScore}
                </span>
                <span className="text-gray-500">-</span>
                <span className="text-2xl font-bold text-white">
                  {match.awayScore}
                </span>
              </div>
            )}
          </div>
          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-end text-right">
            <div>
              <p className="font-semibold text-white">
                {match.awayTeam.shortName}
              </p>
              <p className="text-xs text-gray-400">{match.awayTeam.name}</p>
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
              ⚽
            </div>
          </div>
        </div>
        {/* Goal Scorers */}
        {match.events &&
          match.events.filter((e) => e.type === "GOAL").length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs text-gray-400">
                <div className="space-y-0.5">
                  {match.events
                    .filter(
                      (e) =>
                        e.type === "GOAL" &&
                        match.homeTeam.id ===
                          (e.player as Player & { teamId: string }).teamId,
                    )
                    .map((e) => (
                      <p key={e.id}>
                        ⚽ {e.player.name} {e.minute}&apos;
                      </p>
                    ))}
                </div>
                <div className="space-y-0.5 text-right">
                  {match.events
                    .filter(
                      (e) =>
                        e.type === "GOAL" &&
                        match.awayTeam.id ===
                          (e.player as Player & { teamId: string }).teamId,
                    )
                    .map((e) => (
                      <p key={e.id}>
                        {e.minute}&apos; {e.player.name} ⚽
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}
        <p className="text-xs text-gray-500 mt-2">Venue: {match.venue}</p>
      </div>
    </Link>
  );
}
