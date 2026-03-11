# Football Tournament Live Score App

A full-stack football tournament live score web application built with Next.js 14+, Prisma ORM, Neon PostgreSQL, and TailwindCSS.

## Features

- **Live Score Updates**: Auto-polling every 7 seconds for real-time score updates
- **Match Fixtures**: View upcoming matches
- **Match Results**: Browse completed match results
- **Points Table**: Automatic standings calculation (Win=3, Draw=1, Loss=0)
- **Player Stats**: Top scorers, assists, and disciplinary records
- **Match Details**: Full match timeline with goals, assists, and cards
- **Admin Panel**: Complete match management, team/player CRUD, event tracking

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Styling**: TailwindCSS
- **Deployment**: Vercel-compatible

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database (free tier works)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd football-tournament
npm install
```

### 2. Set Up the Database

1. Go to [neon.tech](https://neon.tech) and create a free database
2. Copy the connection string
3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Paste your Neon connection string in `.env`:

```
DATABASE_URL="postgresql://username:password@your-host.neon.tech/football_tournament?sslmode=require"
```

### 3. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database (Optional)

```bash
npx prisma db seed
```

This creates sample data with 6 teams, 36 players, and 6 matches (2 finished, 1 live, 3 upcoming).

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public-facing pages
│   │   ├── page.tsx        # Home (live matches)
│   │   ├── fixtures/       # Upcoming matches
│   │   ├── results/        # Completed matches
│   │   ├── standings/      # Points table
│   │   ├── players/        # Player statistics
│   │   └── match/[id]/     # Match detail page
│   ├── (admin)/            # Admin panel
│   │   └── admin/
│   │       ├── dashboard/  # Admin overview
│   │       ├── teams/      # Team management
│   │       ├── players/    # Player management
│   │       └── matches/    # Match management & events
│   └── api/
│       └── live/           # Live score polling endpoint
├── components/
│   ├── Navbar.tsx           # Public navigation
│   ├── AdminNav.tsx         # Admin sidebar
│   ├── MatchCard.tsx        # Match card with live badge
│   ├── LiveScoreBoard.tsx   # Auto-polling live matches
│   ├── PointsTable.tsx      # Standings table
│   ├── PlayerStats.tsx      # Top scorers/assists/cards
│   └── MatchTimeline.tsx    # Match events timeline
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   └── actions/
│       ├── teamActions.ts
│       ├── playerActions.ts
│       ├── matchActions.ts
│       ├── standingActions.ts
│       └── tournamentActions.ts
└── generated/prisma/        # Generated Prisma client
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Seed script
```

## Admin Panel

Access the admin panel at `/admin/dashboard`. From there you can:

1. **Create Teams**: Add teams with name and short code
2. **Add Players**: Assign players to teams with position and number
3. **Create Matches**: Schedule matches between teams in a tournament
4. **Manage Live Matches**:
   - Start/end matches
   - Add match events (goals, assists, cards)
   - Manually override scores
5. **Auto-Standings**: When a match is marked as finished, standings are automatically recalculated

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Add the environment variable:
   - `DATABASE_URL` = your Neon connection string
3. Vercel will auto-detect Next.js and deploy

### 3. Run Migrations on Production

After deployment, run migrations against your Neon database:

```bash
npx prisma migrate deploy
```

Or you can use the Vercel CLI:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Build Command (auto-configured)

The build command runs `prisma generate && next build` to ensure the Prisma client is generated before building.

## Points System

- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

Teams are ranked by: Points → Goal Difference → Goals Scored

## Live Score Polling

The app uses client-side polling (every 7 seconds) to fetch live match data from the `/api/live` endpoint. No WebSocket setup required.
