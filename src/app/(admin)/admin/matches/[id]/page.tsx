import { notFound } from "next/navigation";
import {
  getMatchById,
  addMatchEvent,
  deleteMatchEvent,
  updateMatchScore,
} from "@/lib/actions/matchActions";
import { EventType } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) return notFound();

  const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];

  async function handleAddEvent(formData: FormData) {
    "use server";
    const playerId = formData.get("playerId") as string;
    const type = formData.get("type") as EventType;
    const minute = parseInt(formData.get("minute") as string);
    if (!playerId || !type || isNaN(minute)) return;
    await addMatchEvent({ matchId: id, playerId, type, minute });
  }

  async function handleDeleteEvent(formData: FormData) {
    "use server";
    const eventId = formData.get("eventId") as string;
    await deleteMatchEvent(eventId);
  }

  async function handleUpdateScore(formData: FormData) {
    "use server";
    const homeScore = parseInt(formData.get("homeScore") as string);
    const awayScore = parseInt(formData.get("awayScore") as string);
    if (isNaN(homeScore) || isNaN(awayScore)) return;
    await updateMatchScore(id, homeScore, awayScore);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/matches"
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {match.homeTeam.shortName} vs {match.awayTeam.shortName}
        </h1>
        {match.status === "LIVE" && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
            LIVE
          </span>
        )}
      </div>

      {/* Current Score & Manual Override */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Score</h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-white">
            {match.homeScore}
          </span>
          <span className="text-gray-500">-</span>
          <span className="text-3xl font-bold text-white">
            {match.awayScore}
          </span>
        </div>
        <form action={handleUpdateScore} className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Manual Override:</label>
          <input
            name="homeScore"
            type="number"
            min={0}
            defaultValue={match.homeScore}
            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white w-16 text-center"
          />
          <span className="text-gray-500">-</span>
          <input
            name="awayScore"
            type="number"
            min={0}
            defaultValue={match.awayScore}
            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white w-16 text-center"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            Update Score
          </button>
        </form>
      </div>

      {/* Add Event Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Add Event</h2>
        <form action={handleAddEvent} className="flex flex-wrap gap-3">
          <select
            name="playerId"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1 min-w-[200px]"
          >
            <option value="">Select Player</option>
            <optgroup label={match.homeTeam.name}>
              {match.homeTeam.players.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name}
                </option>
              ))}
            </optgroup>
            <optgroup label={match.awayTeam.name}>
              {match.awayTeam.players.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name}
                </option>
              ))}
            </optgroup>
          </select>
          <select
            name="type"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-40"
          >
            <option value="">Event Type</option>
            <option value="GOAL">⚽ Goal</option>
            <option value="ASSIST">🎯 Assist</option>
            <option value="YELLOW_CARD">🟨 Yellow Card</option>
            <option value="RED_CARD">🟥 Red Card</option>
          </select>
          <input
            name="minute"
            type="number"
            min={1}
            max={120}
            placeholder="Min"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Add Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-white mb-3">
          Match Events ({match.events.length})
        </h2>
        {match.events.length === 0 ? (
          <p className="text-gray-400 text-sm">No events yet</p>
        ) : (
          <div className="space-y-2">
            {match.events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-750 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-10">
                    {event.minute}&apos;
                  </span>
                  <span className="text-lg">
                    {event.type === "GOAL"
                      ? "⚽"
                      : event.type === "ASSIST"
                      ? "🎯"
                      : event.type === "YELLOW_CARD"
                      ? "🟨"
                      : "🟥"}
                  </span>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {event.player.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {event.player.team.shortName} ·{" "}
                      {event.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <form action={handleDeleteEvent}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
