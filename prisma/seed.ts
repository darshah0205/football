import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.matchEvent.deleteMany();
  await prisma.standing.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();

  // Create Tournament
  const tournament = await prisma.tournament.create({
    data: { name: "Champions League 2025", season: "2025" },
  });
  console.log(`✅ Created tournament: ${tournament.name}`);

  // Create Teams
  const teamsData = [
    { name: "Manchester City", shortName: "MCI" },
    { name: "Real Madrid", shortName: "RMA" },
    { name: "Bayern Munich", shortName: "BAY" },
    { name: "FC Barcelona", shortName: "BAR" },
    { name: "Liverpool FC", shortName: "LIV" },
    { name: "Paris Saint-Germain", shortName: "PSG" },
  ];

  const teams: Record<string, string> = {};
  for (const data of teamsData) {
    const team = await prisma.team.create({ data });
    teams[data.shortName] = team.id;
    console.log(`✅ Created team: ${team.name}`);
  }

  // Create Players
  const playersData = [
    // Manchester City
    {
      name: "Ederson",
      number: 31,
      position: "GOALKEEPER" as const,
      team: "MCI",
    },
    {
      name: "Kyle Walker",
      number: 2,
      position: "DEFENDER" as const,
      team: "MCI",
    },
    {
      name: "Ruben Dias",
      number: 3,
      position: "DEFENDER" as const,
      team: "MCI",
    },
    {
      name: "Kevin De Bruyne",
      number: 17,
      position: "MIDFIELDER" as const,
      team: "MCI",
    },
    {
      name: "Phil Foden",
      number: 47,
      position: "MIDFIELDER" as const,
      team: "MCI",
    },
    {
      name: "Erling Haaland",
      number: 9,
      position: "FORWARD" as const,
      team: "MCI",
    },

    // Real Madrid
    {
      name: "Thibaut Courtois",
      number: 1,
      position: "GOALKEEPER" as const,
      team: "RMA",
    },
    {
      name: "Dani Carvajal",
      number: 2,
      position: "DEFENDER" as const,
      team: "RMA",
    },
    {
      name: "Antonio Rudiger",
      number: 22,
      position: "DEFENDER" as const,
      team: "RMA",
    },
    {
      name: "Luka Modric",
      number: 10,
      position: "MIDFIELDER" as const,
      team: "RMA",
    },
    {
      name: "Jude Bellingham",
      number: 5,
      position: "MIDFIELDER" as const,
      team: "RMA",
    },
    {
      name: "Vinicius Jr",
      number: 7,
      position: "FORWARD" as const,
      team: "RMA",
    },

    // Bayern Munich
    {
      name: "Manuel Neuer",
      number: 1,
      position: "GOALKEEPER" as const,
      team: "BAY",
    },
    {
      name: "Joshua Kimmich",
      number: 6,
      position: "DEFENDER" as const,
      team: "BAY",
    },
    {
      name: "Dayot Upamecano",
      number: 2,
      position: "DEFENDER" as const,
      team: "BAY",
    },
    {
      name: "Jamal Musiala",
      number: 42,
      position: "MIDFIELDER" as const,
      team: "BAY",
    },
    {
      name: "Leroy Sane",
      number: 10,
      position: "MIDFIELDER" as const,
      team: "BAY",
    },
    {
      name: "Harry Kane",
      number: 9,
      position: "FORWARD" as const,
      team: "BAY",
    },

    // FC Barcelona
    {
      name: "Marc-Andre ter Stegen",
      number: 1,
      position: "GOALKEEPER" as const,
      team: "BAR",
    },
    {
      name: "Ronald Araujo",
      number: 4,
      position: "DEFENDER" as const,
      team: "BAR",
    },
    {
      name: "Jules Kounde",
      number: 23,
      position: "DEFENDER" as const,
      team: "BAR",
    },
    { name: "Pedri", number: 8, position: "MIDFIELDER" as const, team: "BAR" },
    { name: "Gavi", number: 6, position: "MIDFIELDER" as const, team: "BAR" },
    {
      name: "Robert Lewandowski",
      number: 9,
      position: "FORWARD" as const,
      team: "BAR",
    },

    // Liverpool
    {
      name: "Alisson",
      number: 1,
      position: "GOALKEEPER" as const,
      team: "LIV",
    },
    {
      name: "Virgil van Dijk",
      number: 4,
      position: "DEFENDER" as const,
      team: "LIV",
    },
    {
      name: "Trent Alexander-Arnold",
      number: 66,
      position: "DEFENDER" as const,
      team: "LIV",
    },
    {
      name: "Dominik Szoboszlai",
      number: 8,
      position: "MIDFIELDER" as const,
      team: "LIV",
    },
    {
      name: "Alexis Mac Allister",
      number: 10,
      position: "MIDFIELDER" as const,
      team: "LIV",
    },
    {
      name: "Mohamed Salah",
      number: 11,
      position: "FORWARD" as const,
      team: "LIV",
    },

    // PSG
    {
      name: "Gianluigi Donnarumma",
      number: 99,
      position: "GOALKEEPER" as const,
      team: "PSG",
    },
    {
      name: "Achraf Hakimi",
      number: 2,
      position: "DEFENDER" as const,
      team: "PSG",
    },
    {
      name: "Marquinhos",
      number: 5,
      position: "DEFENDER" as const,
      team: "PSG",
    },
    {
      name: "Vitinha",
      number: 17,
      position: "MIDFIELDER" as const,
      team: "PSG",
    },
    {
      name: "Warren Zaire-Emery",
      number: 33,
      position: "MIDFIELDER" as const,
      team: "PSG",
    },
    {
      name: "Ousmane Dembele",
      number: 10,
      position: "FORWARD" as const,
      team: "PSG",
    },
  ];

  const players: Record<string, string> = {};
  for (const p of playersData) {
    const player = await prisma.player.create({
      data: {
        name: p.name,
        number: p.number,
        // position: p.position,
        teamId: teams[p.team],
      },
    });
    players[p.name] = player.id;
  }
  console.log(`✅ Created ${playersData.length} players`);

  // Create Matches
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // Finished match: MCI 3-1 RMA
  const match1 = await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["MCI"],
      awayTeamId: teams["RMA"],
      date: new Date(now.getTime() - 2 * oneDay),
      status: "FINISHED",
      homeScore: 3,
      awayScore: 1,
      venue: "Etihad Stadium",
    },
  });

  await prisma.matchEvent.createMany({
    data: [
      {
        matchId: match1.id,
        playerId: players["Erling Haaland"],
        type: "GOAL",
        minute: 12,
      },
      {
        matchId: match1.id,
        playerId: players["Kevin De Bruyne"],
        type: "ASSIST",
        minute: 12,
      },
      {
        matchId: match1.id,
        playerId: players["Vinicius Jr"],
        type: "GOAL",
        minute: 34,
      },
      {
        matchId: match1.id,
        playerId: players["Phil Foden"],
        type: "GOAL",
        minute: 56,
      },
      {
        matchId: match1.id,
        playerId: players["Erling Haaland"],
        type: "GOAL",
        minute: 78,
      },
      {
        matchId: match1.id,
        playerId: players["Dani Carvajal"],
        type: "YELLOW_CARD",
        minute: 45,
      },
    ],
  });

  // Finished match: BAY 2-2 BAR
  const match2 = await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["BAY"],
      awayTeamId: teams["BAR"],
      date: new Date(now.getTime() - oneDay),
      status: "FINISHED",
      homeScore: 2,
      awayScore: 2,
      venue: "Allianz Arena",
    },
  });

  await prisma.matchEvent.createMany({
    data: [
      {
        matchId: match2.id,
        playerId: players["Harry Kane"],
        type: "GOAL",
        minute: 15,
      },
      {
        matchId: match2.id,
        playerId: players["Robert Lewandowski"],
        type: "GOAL",
        minute: 30,
      },
      {
        matchId: match2.id,
        playerId: players["Jamal Musiala"],
        type: "GOAL",
        minute: 52,
      },
      {
        matchId: match2.id,
        playerId: players["Pedri"],
        type: "GOAL",
        minute: 67,
      },
      {
        matchId: match2.id,
        playerId: players["Pedri"],
        type: "ASSIST",
        minute: 30,
      },
      {
        matchId: match2.id,
        playerId: players["Gavi"],
        type: "YELLOW_CARD",
        minute: 72,
      },
    ],
  });

  // Live match: LIV 1-0 PSG
  const match3 = await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["LIV"],
      awayTeamId: teams["PSG"],
      date: new Date(now.getTime() - 60 * 60 * 1000), // started 1 hour ago
      status: "LIVE",
      homeScore: 1,
      awayScore: 0,
      venue: "Anfield",
    },
  });

  await prisma.matchEvent.createMany({
    data: [
      {
        matchId: match3.id,
        playerId: players["Mohamed Salah"],
        type: "GOAL",
        minute: 23,
      },
      {
        matchId: match3.id,
        playerId: players["Trent Alexander-Arnold"],
        type: "ASSIST",
        minute: 23,
      },
      {
        matchId: match3.id,
        playerId: players["Achraf Hakimi"],
        type: "YELLOW_CARD",
        minute: 38,
      },
    ],
  });

  // Upcoming matches
  await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["RMA"],
      awayTeamId: teams["BAY"],
      date: new Date(now.getTime() + oneDay),
      status: "UPCOMING",
      venue: "Santiago Bernabeu",
    },
  });

  await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["BAR"],
      awayTeamId: teams["MCI"],
      date: new Date(now.getTime() + 2 * oneDay),
      status: "UPCOMING",
      venue: "Camp Nou",
    },
  });

  await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      homeTeamId: teams["PSG"],
      awayTeamId: teams["LIV"],
      date: new Date(now.getTime() + 3 * oneDay),
      status: "UPCOMING",
      venue: "Parc des Princes",
    },
  });

  console.log("✅ Created matches with events");

  // Calculate Standings
  const finishedMatches = await prisma.match.findMany({
    where: { tournamentId: tournament.id, status: "FINISHED" },
  });

  const allTeamIds = Object.values(teams);
  for (const teamId of allTeamIds) {
    let played = 0,
      won = 0,
      drawn = 0,
      lost = 0,
      goalsFor = 0,
      goalsAgainst = 0;

    finishedMatches.forEach((m) => {
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

    await prisma.standing.create({
      data: {
        tournamentId: tournament.id,
        teamId,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
      },
    });
  }

  console.log("✅ Calculated standings");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
