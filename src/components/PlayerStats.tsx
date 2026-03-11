import type { Player, Team } from "@prisma/client";

type PlayerWithTeam = Player & { team: Team };

type TopScorer = { player: PlayerWithTeam; goals: number };
type TopAssist = { player: PlayerWithTeam; assists: number };
type TopCard = {
  player: PlayerWithTeam;
  yellows: number;
  reds: number;
  total: number;
};

function StatCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-750 px-4 py-3 border-b border-gray-700">
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function TopScorersTable({ scorers }: { scorers: TopScorer[] }) {
  if (scorers.length === 0) {
    return (
      <StatCard title="⚽ Top Scorers">
        <p className="text-gray-400 text-sm">No goals scored yet</p>
      </StatCard>
    );
  }

  return (
    <StatCard title="⚽ Top Scorers">
      <div className="space-y-3">
        {scorers.map((s, i) => (
          <div key={s.player.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-6 text-sm">{i + 1}.</span>
              <div>
                <p className="font-medium text-white">{s.player.name}</p>
                <p className="text-xs text-gray-400">{s.player.team.name}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-green-400">{s.goals}</span>
          </div>
        ))}
      </div>
    </StatCard>
  );
}

export function TopAssistsTable({ assists }: { assists: TopAssist[] }) {
  if (assists.length === 0) {
    return (
      <StatCard title="🎯 Top Assists">
        <p className="text-gray-400 text-sm">No assists recorded yet</p>
      </StatCard>
    );
  }

  return (
    <StatCard title="🎯 Top Assists">
      <div className="space-y-3">
        {assists.map((a, i) => (
          <div key={a.player.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-6 text-sm">{i + 1}.</span>
              <div>
                <p className="font-medium text-white">{a.player.name}</p>
                <p className="text-xs text-gray-400">{a.player.team.name}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-400">
              {a.assists}
            </span>
          </div>
        ))}
      </div>
    </StatCard>
  );
}

export function TopCardsTable({ cards }: { cards: TopCard[] }) {
  if (cards.length === 0) {
    return (
      <StatCard title="🟨 Disciplinary">
        <p className="text-gray-400 text-sm">No cards issued yet</p>
      </StatCard>
    );
  }

  return (
    <StatCard title="🟨 Disciplinary">
      <div className="space-y-3">
        {cards.map((c, i) => (
          <div key={c.player.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-6 text-sm">{i + 1}.</span>
              <div>
                <p className="font-medium text-white">{c.player.name}</p>
                <p className="text-xs text-gray-400">{c.player.team.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {c.yellows > 0 && (
                <span className="text-sm">
                  🟨 <span className="text-yellow-400">{c.yellows}</span>
                </span>
              )}
              {c.reds > 0 && (
                <span className="text-sm">
                  🟥 <span className="text-red-400">{c.reds}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </StatCard>
  );
}
