import type { MatchEvent, Player, Team } from "@prisma/client";

type EventWithPlayer = MatchEvent & {
  player: Player & { team: Team };
};

function eventIcon(type: string) {
  switch (type) {
    case "GOAL":
      return "⚽";
    case "ASSIST":
      return "🎯";
    case "YELLOW_CARD":
      return "🟨";
    case "RED_CARD":
      return "🟥";
    default:
      return "📋";
  }
}

function eventLabel(type: string) {
  switch (type) {
    case "GOAL":
      return "Goal";
    case "ASSIST":
      return "Assist";
    case "YELLOW_CARD":
      return "Yellow Card";
    case "RED_CARD":
      return "Red Card";
    default:
      return type;
  }
}

export default function MatchTimeline({
  events,
  homeTeamId,
}: {
  events: EventWithPlayer[];
  homeTeamId: string;
}) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No events recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const isHome = event.player.team.id === homeTeamId;
        return (
          <div
            key={event.id}
            className={`flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-800/50 ${
              isHome ? "" : "flex-row-reverse text-right"
            }`}
          >
            <span className="text-xs font-mono text-gray-500 w-10 shrink-0 text-center">
              {event.minute}&apos;
            </span>
            <span className="text-lg">{eventIcon(event.type)}</span>
            <div className={isHome ? "" : "text-right"}>
              <p className="font-medium text-white text-sm">
                {event.player.name}
              </p>
              <p className="text-xs text-gray-400">
                {eventLabel(event.type)} · {event.player.team.shortName}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
