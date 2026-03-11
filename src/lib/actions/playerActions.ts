"use server";

import { prisma } from "@/lib/prisma";
// import { Position } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPlayer(data: {
  name: string;
  number: number;
  // position: Position;
  teamId: string;
}) {
  const player = await prisma.player.create({ data });
  revalidatePath("/admin/players");
  return player;
}

export async function getPlayers() {
  return prisma.player.findMany({
    orderBy: { name: "asc" },
    include: { team: true },
  });
}

export async function getPlayersByTeam(teamId: string) {
  return prisma.player.findMany({
    where: { teamId },
    orderBy: { number: "asc" },
    include: { team: true },
  });
}

export async function getPlayerById(id: string) {
  return prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      events: {
        include: { match: { include: { homeTeam: true, awayTeam: true } } },
      },
    },
  });
}

export async function getTopScorers(limit = 10) {
  const scorers = await prisma.matchEvent.groupBy({
    by: ["playerId"],
    where: { type: "GOAL" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  const playerIds = scorers.map((s) => s.playerId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    include: { team: true },
  });

  return scorers.map((s) => ({
    player: players.find((p) => p.id === s.playerId)!,
    goals: s._count.id,
  }));
}

export async function getTopAssists(limit = 10) {
  const assists = await prisma.matchEvent.groupBy({
    by: ["playerId"],
    where: { type: "ASSIST" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  const playerIds = assists.map((a) => a.playerId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    include: { team: true },
  });

  return assists.map((a) => ({
    player: players.find((p) => p.id === a.playerId)!,
    assists: a._count.id,
  }));
}

export async function getTopCards(limit = 10) {
  const cards = await prisma.matchEvent.groupBy({
    by: ["playerId"],
    where: { type: { in: ["YELLOW_CARD", "RED_CARD"] } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  const playerIds = cards.map((c) => c.playerId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    include: { team: true },
  });

  // Get breakdown of yellow/red
  const breakdown = await prisma.matchEvent.groupBy({
    by: ["playerId", "type"],
    where: {
      playerId: { in: playerIds },
      type: { in: ["YELLOW_CARD", "RED_CARD"] },
    },
    _count: { id: true },
  });

  return cards.map((c) => {
    const yellows =
      breakdown.find(
        (b) => b.playerId === c.playerId && b.type === "YELLOW_CARD",
      )?._count.id ?? 0;
    const reds =
      breakdown.find((b) => b.playerId === c.playerId && b.type === "RED_CARD")
        ?._count.id ?? 0;
    return {
      player: players.find((p) => p.id === c.playerId)!,
      yellows,
      reds,
      total: c._count.id,
    };
  });
}

export async function deletePlayer(id: string) {
  await prisma.player.delete({ where: { id } });
  revalidatePath("/admin/players");
}
