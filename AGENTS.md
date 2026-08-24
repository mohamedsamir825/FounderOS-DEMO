# FOUNDER OS — agent rules

Full project docs live in **CLAUDE.md** (same directory) — read it first.
This file exists so non-Claude agents (Codex, etc.) get the same house rules.

## Non-negotiables

- **Never commit or copy secrets.** Credentials live in `.env.local`
  (gitignored) and Alex's canonical files; `lib/creds.ts` resolves them.
  Never copy keys from `~/knowledge/.env.agents` into the repo.
- **Never push to any remote or touch `main` without Alex's explicit yes.**
  Commit locally on `founder-os`, small checkpoints, often.
- **Don't kill the dev server on 4100 or 4101** — other sessions use them.
  If your edit crashes the dev server's hot reload, fix it fast: a crash loop
  corrupts `.next` and breaks every session's page chunks (kill the port,
  `rm -rf .next`, restart).
- `/org` markup is frozen — do not restructure it.
- No em/en dashes in anything written for Alex.

## How to work

- TDD: failing test first (`tests/`, one file per module,
  `FOUNDER_OS_DB=:memory:`), then implement. `npm test` and
  `npm run typecheck` must be green before claiming done.
- Everything reads through the repo layer: `lib/db.ts` repos + `lib/schemas.ts`
  Zod validation + `lib/seed.ts` seeds. Never query SQLite from a page/route.
- Theme via CSS vars on `data-theme` (five themes in `app/globals.css`);
  Tailwind `os.*` tokens map to them. Keep `tailwind.config.ts` and
  `globals.css` in sync.
- Commands: `npm run dev` (port 4100) · `npm test` · `npm run typecheck` ·
  `npm run seed` · `npm run brain:docs`.

## Base44 dev environment

- Run with `docker compose -f docker-compose.base44.yml up -d` (host port 3000 →
  container dev server on 4100). The compose uses a plain `node:20-bookworm-slim`
  runtime with the repo bind-mounted; `npm install` runs at container start and
  `node_modules` lives in a named volume so the native `better-sqlite3` build is
  never shadowed by a wrong-arch host copy.
- No external credentials are required to boot: the app seeds a demo SQLite DB
  on first touch (`data/founder-os.db`) and every connector honestly reports
  "not configured" without keys. All keys in `.env.example` are optional.
- Live reload is enabled (`next dev` + `WATCHPACK_POLLING=true` for the bind
  mount). Next.js 14 does not gate dev assets by origin, so no
  `allowedDevOrigins` config is needed.
- Verify the preview: `curl -sf -H "Host: external-preview.example.com"
  http://localhost:3000/` must return the app HTML.

## Multi-agent etiquette

Multiple agent sessions (Claude, Codex) work this repo concurrently:
- `git log --oneline` to see where others are; commit small and often.
- Coordinate by surface: don't edit a page/component another session has
  uncommitted changes in (`git status` shows them).
- The Playwright browser is shared across sessions — expect interference.
- Leave handoff notes in `docs/` if you stop mid-feature.
