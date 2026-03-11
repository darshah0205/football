import Link from "next/link";
import { getTeams } from "@/lib/actions/teamActions";
import { getMatches } from "@/lib/actions/matchActions";
import { getPlayers } from "@/lib/actions/playerActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [teams, matches, players] = await Promise.all([
    getTeams(),
    getMatches(),
    getPlayers(),
  ]);

  const liveCount = matches.filter((m) => m.status === "LIVE").length;
  const upcomingCount = matches.filter((m) => m.status === "UPCOMING").length;
  const finishedCount = matches.filter((m) => m.status === "FINISHED").length;

  const stats = [
    { label: "Teams", value: teams.length, href: "/admin/teams", color: "bg-blue-600" },
    { label: "Players", value: players.length, href: "/admin/players", color: "bg-green-600" },
    { label: "Matches", value: matches.length, href: "/admin/matches", color: "bg-purple-600" },
    { label: "Live Now", value: liveCount, href: "/admin/matches", color: "bg-red-600" },
    { label: "Upcoming", value: upcomingCount, href: "/admin/matches", color: "bg-yellow-600" },
    { label: "Finished", value: finishedCount, href: "/admin/matches", color: "bg-gray-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
              <div
                className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white text-lg font-bold mb-3`}
              >
                {stat.value}
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/teams"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + Add Team
          </Link>
          <Link
            href="/admin/players"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            + Add Player
          </Link>
          <Link
            href="/admin/matches"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            + Create Match
          </Link>
        </div>
      </div>
    </div>
  );
}
