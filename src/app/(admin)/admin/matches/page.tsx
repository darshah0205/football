import {
  getMatches,
  createMatch,
  updateMatchStatus,
  deleteMatch,
} from "@/lib/actions/matchActions";
import { getTeams } from "@/lib/actions/teamActions";
import { getTournaments, createTournament } from "@/lib/actions/tournamentActions";
import { MatchStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMatchesPage() {
  const [matches, teams, tournaments] = await Promise.all([
    getMatches(),
    getTeams(),
    getTournaments(),
  ]);

  async function handleCreateTournament(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const season = formData.get("season") as string;
    if (!name || !season) return;
    await createTournament({ name, season });
  }

  async function handleCreateMatch(formData: FormData) {
    "use server";
    const tournamentId = formData.get("tournamentId") as string;
    const homeTeamId = formData.get("homeTeamId") as string;
    const awayTeamId = formData.get("awayTeamId") as string;
    const dateStr = formData.get("date") as string;
    const venue = formData.get("venue") as string;
    if (!tournamentId || !homeTeamId || !awayTeamId || !dateStr) return;
    await createMatch({
      tournamentId,
      homeTeamId,
      awayTeamId,
      date: new Date(dateStr),
      venue: venue || undefined,
    });
  }

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as MatchStatus;
    await updateMatchStatus(id, status);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteMatch(id);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Matches</h1>

      {/* Create Tournament */}
      {tournaments.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Create Tournament First
          </h2>
          <form action={handleCreateTournament} className="flex flex-wrap gap-3">
            <input
              name="name"
              placeholder="Tournament Name"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 flex-1 min-w-[200px]"
            />
            <input
              name="season"
              placeholder="Season (e.g. 2025)"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-40"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Create Tournament
            </button>
          </form>
        </div>
      )}

      {/* Create Tournament (when exists) */}
      {tournaments.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Add Another Tournament
          </h3>
          <form action={handleCreateTournament} className="flex flex-wrap gap-3">
            <input
              name="name"
              placeholder="Tournament Name"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 flex-1 min-w-[200px]"
            />
            <input
              name="season"
              placeholder="Season"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-40"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Create
            </button>
          </form>
        </div>
      )}

      {/* Create Match Form */}
      {tournaments.length > 0 && teams.length >= 2 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Create New Match
          </h2>
          <form action={handleCreateMatch} className="flex flex-wrap gap-3">
            <select
              name="tournamentId"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1 min-w-[150px]"
            >
              <option value="">Tournament</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.season})
                </option>
              ))}
            </select>
            <select
              name="homeTeamId"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1 min-w-[150px]"
            >
              <option value="">Home Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              name="awayTeamId"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1 min-w-[150px]"
            >
              <option value="">Away Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <input
              name="date"
              type="datetime-local"
              required
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <input
              name="venue"
              placeholder="Venue (optional)"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-40"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Create Match
            </button>
          </form>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-gray-800 rounded-xl border border-gray-700 p-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {match.homeTeam.shortName}
                  </span>
                  <span className="text-gray-400">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <span className="font-semibold text-white">
                    {match.awayTeam.shortName}
                  </span>
                  {match.status === "LIVE" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                      LIVE
                    </span>
                  )}
                  {match.status === "FINISHED" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-600 text-gray-200">
                      FT
                    </span>
                  )}
                  {match.status === "UPCOMING" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-blue-100">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(match.date).toLocaleString()} · {match.venue}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Status buttons */}
                {match.status === "UPCOMING" && (
                  <form action={handleUpdateStatus}>
                    <input type="hidden" name="id" value={match.id} />
                    <input type="hidden" name="status" value="LIVE" />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Start Match
                    </button>
                  </form>
                )}
                {match.status === "LIVE" && (
                  <form action={handleUpdateStatus}>
                    <input type="hidden" name="id" value={match.id} />
                    <input type="hidden" name="status" value="FINISHED" />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                    >
                      End Match
                    </button>
                  </form>
                )}

                {/* Manage events link */}
                {(match.status === "LIVE" || match.status === "FINISHED") && (
                  <Link
                    href={`/admin/matches/${match.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Manage Events
                  </Link>
                )}

                {/* Delete */}
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={match.id} />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400">
              No matches yet. Create a tournament and add teams first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
