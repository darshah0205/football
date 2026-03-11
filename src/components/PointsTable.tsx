import type { Standing, Team } from "@prisma/client";

type StandingWithTeam = Standing & { team: Team };

export default function PointsTable({
  standings,
}: {
  standings: StandingWithTeam[];
}) {
  if (standings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-gray-400">No standings available yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left py-3 px-4">#</th>
            <th className="text-left py-3 px-4">Team</th>
            <th className="text-center py-3 px-2">P</th>
            <th className="text-center py-3 px-2">W</th>
            <th className="text-center py-3 px-2">D</th>
            <th className="text-center py-3 px-2">L</th>
            <th className="text-center py-3 px-2">GF</th>
            <th className="text-center py-3 px-2">GA</th>
            <th className="text-center py-3 px-2">GD</th>
            <th className="text-center py-3 px-2 font-bold text-white">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr
              key={s.id}
              className={`border-b border-gray-700/50 transition-colors hover:bg-gray-800/50 ${
                i < 2 ? "bg-green-900/10" : ""
              }`}
            >
              <td className="py-3 px-4 text-gray-400">{i + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    ⚽
                  </span>
                  <span className="font-medium text-white">
                    {s.team.name}
                  </span>
                </div>
              </td>
              <td className="text-center py-3 px-2 text-gray-300">
                {s.played}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">{s.won}</td>
              <td className="text-center py-3 px-2 text-gray-300">
                {s.drawn}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">{s.lost}</td>
              <td className="text-center py-3 px-2 text-gray-300">
                {s.goalsFor}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">
                {s.goalsAgainst}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">
                {s.goalDifference > 0
                  ? `+${s.goalDifference}`
                  : s.goalDifference}
              </td>
              <td className="text-center py-3 px-2 font-bold text-white">
                {s.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
