"use server";

import { prisma } from "@/lib/prisma";
import { EventType, MatchStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { recalculateStandings } from "./standingActions";

export async function createMatch(data: {
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue?: string;
}) {
  const match = await prisma.match.create({ data });
  revalidatePath("/admin/matches");
  return match;
}

export async function getMatches(status?: MatchStatus) {
  return prisma.match.findMany({
    where: status ? { status } : undefined,
    include: {
      homeTeam: true,
      awayTeam: true,
      events: { include: { player: true }, orderBy: { minute: "asc" } },
      tournament: true,
    },
    orderBy: { date: "asc" },
  });
}

export async function getLiveMatches() {
  return prisma.match.findMany({
    where: { status: "LIVE" },
    include: {
      homeTeam: true,
      awayTeam: true,
      events: { include: { player: true }, orderBy: { minute: "asc" } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      events: {
        include: { player: { include: { team: true } } },
        orderBy: { minute: "asc" },
      },
      tournament: true,
    },
  });
}

export async function updateMatchStatus(id: string, status: MatchStatus) {
  const match = await prisma.match.update({
    where: { id },
    data: { status },
  });

  if (status === "FINISHED") {
    await recalculateStandings(match.tournamentId);
  }

  revalidatePath("/");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/standings");
  revalidatePath(`/match/${id}`);
  revalidatePath("/admin/matches");
  return match;
}

export async function updateMatchScore(
  id: string,
  homeScore: number,
  awayScore: number
) {
  const match = await prisma.match.update({
    where: { id },
    data: { homeScore, awayScore },
  });
  revalidatePath(`/match/${id}`);
  revalidatePath("/");
  return match;
}

export async function addMatchEvent(data: {
  matchId: string;
  playerId: string;
  type: EventType;
  minute: number;
}) {
  const event = await prisma.matchEvent.create({ data });

  // Auto-update score for goals
  if (data.type === "GOAL") {
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: { homeTeam: { include: { players: true } } },
    });

    if (match) {
      const isHomeGoal = match.homeTeam.players.some(
        (p) => p.id === data.playerId
      );
      await prisma.match.update({
        where: { id: data.matchId },
        data: isHomeGoal
          ? { homeScore: { increment: 1 } }
          : { awayScore: { increment: 1 } },
      });
    }
  }

  revalidatePath(`/match/${data.matchId}`);
  revalidatePath("/");
  revalidatePath("/admin/matches");
  return event;
}

export async function deleteMatchEvent(eventId: string) {
  const event = await prisma.matchEvent.findUnique({
    where: { id: eventId },
    include: {
      match: { include: { homeTeam: { include: { players: true } } } },
    },
  });

  if (!event) return;

  // Auto-update score if deleting a goal
  if (event.type === "GOAL") {
    const isHomeGoal = event.match.homeTeam.players.some(
      (p) => p.id === event.playerId
    );
    await prisma.match.update({
      where: { id: event.matchId },
      data: isHomeGoal
        ? { homeScore: { decrement: 1 } }
        : { awayScore: { decrement: 1 } },
    });
  }

  await prisma.matchEvent.delete({ where: { id: eventId } });
  revalidatePath(`/match/${event.matchId}`);
  revalidatePath("/");
  revalidatePath("/admin/matches");
}

export async function deleteMatch(id: string) {
  const match = await prisma.match.findUnique({ where: { id } });
  await prisma.match.delete({ where: { id } });
  if (match?.status === "FINISHED") {
    await recalculateStandings(match.tournamentId);
  }
  revalidatePath("/admin/matches");
}
