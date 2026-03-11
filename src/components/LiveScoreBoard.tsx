"use client";

import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import type { Match, Team, MatchEvent, Player } from "@prisma/client";

type LiveMatch = Match & {
  homeTeam: Team;
  awayTeam: Team;
  events: (MatchEvent & { player: Player })[];
};

export default function LiveScoreBoard() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLive = async () => {
    try {
      const res = await fetch("/api/live", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Failed to fetch live scores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 7000); // Poll every 7 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto" />
        <p className="text-gray-400 mt-2">Loading live matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-4xl mb-2">📺</p>
        <p className="text-gray-400 text-lg">No live matches right now</p>
        <p className="text-gray-500 text-sm mt-1">
          Check the fixtures page for upcoming matches
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
