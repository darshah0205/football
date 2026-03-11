import {
  TopScorersTable,
  TopAssistsTable,
  TopCardsTable,
} from "@/components/PlayerStats";
import {
  getTopScorers,
  getTopAssists,
  getTopCards,
} from "@/lib/actions/playerActions";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const [scorers, assists, cards] = await Promise.all([
    getTopScorers(),
    getTopAssists(),
    getTopCards(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Player Statistics</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TopScorersTable scorers={scorers} />
        <TopAssistsTable assists={assists} />
        <TopCardsTable cards={cards} />
      </div>
    </div>
  );
}
