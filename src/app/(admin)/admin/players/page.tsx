import {
  getPlayers,
  createPlayer,
  deletePlayer,
} from "@/lib/actions/playerActions";
import { getTeams } from "@/lib/actions/teamActions";
// import { Position } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const [players, teams] = await Promise.all([getPlayers(), getTeams()]);

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const number = parseInt(formData.get("number") as string);
    // const position = formData.get("position") as Position;
    const teamId = formData.get("teamId") as string;
    // if (!name || !number || !position || !teamId) return;
    if (!name || !number || !teamId) return;
    // await createPlayer({ name,number,position,teamId });
    await createPlayer({ name, number, teamId });
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deletePlayer(id);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Players</h1>

      {/* Create Player Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Add New Player
        </h2>
        <form action={handleCreate} className="flex flex-wrap gap-3">
          <input
            name="name"
            placeholder="Player Name"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 flex-1 min-w-[200px]"
          />
          <input
            name="number"
            type="number"
            placeholder="#"
            required
            min={1}
            max={99}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-20"
          />
          {/* <select
            name="position"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-40"
          >
            <option value="">Position</option>
            <option value="GOALKEEPER">Goalkeeper</option>
            <option value="DEFENDER">Defender</option>
            <option value="MIDFIELDER">Midfielder</option>
            <option value="FORWARD">Forward</option>
          </select> */}
          <select
            name="teamId"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1 min-w-[150px]"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Add Player
          </button>
        </form>
      </div>

      {/* Players List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">Name</th>
              {/* <th className="text-left py-3 px-4">Position</th> */}
              <th className="text-left py-3 px-4">Team</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                className="border-b border-gray-700/50 hover:bg-gray-750"
              >
                <td className="py-3 px-4 text-gray-400">{player.number}</td>
                <td className="py-3 px-4 text-white font-medium">
                  {player.name}
                </td>
                {/* <td className="py-3 px-4 text-gray-400">{player.position}</td> */}
                <td className="py-3 px-4 text-gray-400">{player.team.name}</td>
                <td className="py-3 px-4 text-right">
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="id" value={player.id} />
                    <button
                      type="submit"
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No players yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
