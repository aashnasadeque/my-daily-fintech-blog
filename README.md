# Fintech Daily Brief

A 1-day portfolio project that generates a daily fintech “brief” from mock RSS items. Click the button, get a blog-style summary with structured sections, and browse a local archive stored in your browser.

## What it does

- Generates a daily brief from mock RSS items (no external calls).
- Creates 3–5 sections (Markets & Macro, Regulation, Payments & Banking, etc.).
- Renders a professional, card-based brief with sources and watchlists.
- Keeps an archive in `localStorage` so the UI feels real.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

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

## How to enable real ChatGPT calls later

This app is **mock-first** and works without any API keys. When you want to wire up a real LLM:

1. Add `OPENAI_API_KEY` to `.env.local`.
2. Set `USE_LLM=true` in the environment when running the app.
3. The app uses `fetch` directly (no SDK dependency required).

The OpenAI integration lives in `src/lib/briefGenerator.ts` and validates the response against the `DailyBrief` schema.

## Future: GitHub Actions scheduling (not implemented)

A future enhancement can add a scheduled workflow that:

- Runs daily (cron).
- Calls the `/api/generate` endpoint.
- Stores the brief in a persistent data store.

This project intentionally keeps storage local-only for simplicity.
