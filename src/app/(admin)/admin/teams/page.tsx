import { getTeams, createTeam, deleteTeam } from "@/lib/actions/teamActions";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const shortName = formData.get("shortName") as string;
    if (!name || !shortName) return;
    await createTeam({ name, shortName });
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteTeam(id);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Teams</h1>

      {/* Create Team Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Team</h2>
        <form action={handleCreate} className="flex flex-wrap gap-3">
          <input
            name="name"
            placeholder="Team Name"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 flex-1 min-w-[200px]"
          />
          <input
            name="shortName"
            placeholder="Short Name (e.g. MCI)"
            required
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-40"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Add Team
          </button>
        </form>
      </div>

      {/* Teams List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-3 px-4">Team</th>
              <th className="text-left py-3 px-4">Short Name</th>
              <th className="text-center py-3 px-4">Players</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="border-b border-gray-700/50 hover:bg-gray-750"
              >
                <td className="py-3 px-4 text-white font-medium">
                  {team.name}
                </td>
                <td className="py-3 px-4 text-gray-400">{team.shortName}</td>
                <td className="py-3 px-4 text-center text-gray-400">
                  {team._count.players}
                </td>
                <td className="py-3 px-4 text-right">
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="id" value={team.id} />
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
            {teams.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-400"
                >
                  No teams yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
