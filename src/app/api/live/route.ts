import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const matches = await prisma.match.findMany({
    where: { status: "LIVE" },
    include: {
      homeTeam: true,
      awayTeam: true,
      events: {
        include: { player: true },
        orderBy: { minute: "asc" },
      },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(matches);
}
