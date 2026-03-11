"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStandings(tournamentId?: string) {
  const where = tournamentId ? { tournamentId } : {};
  return prisma.standing.findMany({
    where,
    include: { team: true, tournament: true },
    orderBy: [
      { points: "desc" },
      { goalDifference: "desc" },
      { goalsFor: "desc" },
    ],
  });
}

export async function recalculateStandings(tournamentId: string) {
  // Get all finished matches in this tournament
  const matches = await prisma.match.findMany({
    where: { tournamentId, status: "FINISHED" },
  });

  // Get all teams that participate in this tournament
  const teamIds = new Set<string>();
  matches.forEach((m) => {
    teamIds.add(m.homeTeamId);
    teamIds.add(m.awayTeamId);
  });

  // Also include teams from upcoming/live matches
  const allMatches = await prisma.match.findMany({
    where: { tournamentId },
  });
  allMatches.forEach((m) => {
    teamIds.add(m.homeTeamId);
    teamIds.add(m.awayTeamId);
  });

  // Calculate standings for each team
  for (const teamId of teamIds) {
    let played = 0,
      won = 0,
      drawn = 0,
      lost = 0,
      goalsFor = 0,
      goalsAgainst = 0;

    matches.forEach((m) => {
      if (m.homeTeamId === teamId) {
        played++;
        goalsFor += m.homeScore;
        goalsAgainst += m.awayScore;
        if (m.homeScore > m.awayScore) won++;
        else if (m.homeScore === m.awayScore) drawn++;
        else lost++;
      } else if (m.awayTeamId === teamId) {
        played++;
        goalsFor += m.awayScore;
        goalsAgainst += m.homeScore;
        if (m.awayScore > m.homeScore) won++;
        else if (m.awayScore === m.homeScore) drawn++;
        else lost++;
      }
    });

    const points = won * 3 + drawn * 1;
    const goalDifference = goalsFor - goalsAgainst;

    await prisma.standing.upsert({
      where: {
        tournamentId_teamId: { tournamentId, teamId },
      },
      update: {
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      },
      create: {
        tournamentId,
        teamId,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      },
    });
  }

  revalidatePath("/standings");
}

export async function initializeStandings(tournamentId: string) {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
  });

  const teamIds = new Set<string>();
  matches.forEach((m) => {
    teamIds.add(m.homeTeamId);
    teamIds.add(m.awayTeamId);
  });

  for (const teamId of teamIds) {
    await prisma.standing.upsert({
      where: {
        tournamentId_teamId: { tournamentId, teamId },
      },
      update: {},
      create: { tournamentId, teamId },
    });
  }
}
