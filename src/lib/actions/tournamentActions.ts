"use server";

import { prisma } from "@/lib/prisma";

export async function createTournament(data: {
  name: string;
  season: string;
}) {
  const tournament = await prisma.tournament.create({ data });
  return tournament;
}

export async function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matches: true } } },
  });
}

export async function getTournamentById(id: string) {
  return prisma.tournament.findUnique({
    where: { id },
    include: {
      matches: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { date: "asc" },
      },
      standings: {
        include: { team: true },
        orderBy: { points: "desc" },
      },
    },
  });
}
