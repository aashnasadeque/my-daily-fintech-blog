# Fintech Daily Brief

A portfolio project that generates a daily fintech "brief" from mock RSS items. Briefs are auto-generated daily at 6am PST via GitHub Actions and deployed to Vercel.

## What it does

- Generates a daily brief from mock RSS items (or real OpenAI calls).
- Creates 3–5 sections (Markets & Macro, Regulation, Payments & Banking, etc.).
- Renders a professional, card-based brief with sources and watchlists.
- Auto-generates briefs daily via GitHub Actions.
- Archive includes both auto-generated and manual briefs.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Generate a brief manually

```bash
# Mock mode (default)
npm run generate

# LLM mode (requires OPENAI_API_KEY in .env.local)
USE_LLM=true npm run generate
```

Generated briefs are saved to `data/briefs/YYYY-MM-DD.json`.

## Mock data

Mock RSS items live in `src/lib/mockRss.ts`. Each item includes:

- `title`
- `link` (example.com only)
- `published` (ISO string)
- `source`
- `snippet`

Edit or expand this list to change what the generator sees.

## How generation works

The generator is implemented in `src/lib/briefGenerator.ts`. It:

- Sorts items by recency and selects the top 8.
- Groups items with simple keyword rules into sections.
- Generates 3–5 blocks with `what_happened`, `why_it_matters`, `watchlist`, and `sources`.
- Builds a short overall summary for the brief header.

## How to enable real ChatGPT calls

This app is **mock-first** and works without any API keys. When you want to wire up a real LLM:

1. Add `OPENAI_API_KEY` to `.env.local` (local) or GitHub Secrets (CI).
2. Set `USE_LLM=true` in the environment.
3. The app uses `fetch` directly (no SDK dependency required).

The OpenAI integration lives in `src/lib/briefGenerator.ts` and validates the response against the `DailyBrief` schema.

## GitHub Actions: Daily Brief Generation

The workflow in `.github/workflows/daily-brief.yml` runs at **6am PST (2pm UTC)** every day:

1. Checks out the repo.
2. Runs `npm run generate` to create today's brief.
3. Commits the new `data/briefs/YYYY-MM-DD.json` file.
4. Pushes to main, triggering a Vercel redeploy.

### Required GitHub Secrets

| Secret | Required | Description |
|--------|----------|-------------|
| `OPENAI_API_KEY` | Only for LLM mode | Your OpenAI API key |
| `USE_LLM` | No | Set to `true` to use OpenAI instead of mock |

To add secrets: Repo Settings → Secrets and variables → Actions → New repository secret.

### Manual trigger

You can trigger the workflow manually from the Actions tab (workflow_dispatch).

## Deploy to Vercel

1. Push to GitHub.
2. Connect the repo to [Vercel](https://vercel.com).
3. Vercel auto-deploys on every push.

No environment variables are required for the default mock mode. For LLM mode, add `OPENAI_API_KEY` and `USE_LLM=true` in Vercel's Environment Variables settings.

## Project structure

```
fintech-brief/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── brief/[date]/page.tsx # Brief detail page
│   │   └── api/
│   │       ├── generate/route.ts # POST: generate brief
│   │       └── briefs/           # GET: fetch stored briefs
│   ├── components/               # UI components
│   ├── lib/
│   │   ├── briefGenerator.ts     # Generation logic
│   │   ├── briefStorage.ts       # Read briefs from files
│   │   ├── mockRss.ts            # Mock RSS data
│   │   └── schema.ts             # TypeScript types
├── data/
│   └── briefs/                   # Auto-generated briefs (JSON)
├── scripts/
│   └── generate-daily.ts         # CLI script for generation
└── .github/
    └── workflows/
        └── daily-brief.yml       # Scheduled generation
```
