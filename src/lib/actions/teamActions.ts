"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeam(data: {
  name: string;
  shortName: string;
  logo?: string;
}) {
  const team = await prisma.team.create({ data });
  revalidatePath("/admin/teams");
  return team;
}

export async function getTeams() {
  return prisma.team.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { players: true } } },
  });
}

export async function getTeamById(id: string) {
  return prisma.team.findUnique({
    where: { id },
    include: { players: { orderBy: { number: "asc" } } },
  });
}

export async function updateTeam(
  id: string,
  data: { name?: string; shortName?: string; logo?: string }
) {
  const team = await prisma.team.update({ where: { id }, data });
  revalidatePath("/admin/teams");
  return team;
}

export async function deleteTeam(id: string) {
  await prisma.team.delete({ where: { id } });
  revalidatePath("/admin/teams");
}
