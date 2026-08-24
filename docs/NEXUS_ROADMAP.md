# NEXUS — Build Roadmap

> The canonical plan. Every future session reads this before touching code.
> Source vision: `NEXUS Vision` (sections referenced below as §N).

## Foundation decision

We **evolve the Founder OS repository INTO NEXUS** — not a fresh build. ~60% of
the spine already exists here; we build the NEXUS delta on top of it.

---

## What we already have (the floor)

| NEXUS need | Already in this repo |
| --- | --- |
| Honest data, no fakes (§40) | Repository layer `lib/db.ts` + Zod validation `lib/schemas.ts` |
| Agent Army | Agent registry with real `run()` (`lib/agents/real.ts`) |
| NEXUS HQ coordinator (§7) | Conductor (`lib/agents/conductor.ts`) + runtime (`lib/agents/runtime.ts`) |
| Companies → Agents | Org hierarchy operator → department → lead/specialist/worker (`lib/hierarchy.ts`) |
| 7-layer Memory (§28) | Multi-layer memory core (`lib/memory-core.ts`) |
| Tool Registry + No-Fake (§37-40) | Honest connectors `lib/connectors/*` + catalog `lib/integrations-catalog.ts` |
| Security (§42) | Server-side keys `lib/keys.ts` / `lib/creds.ts` |
| Command Center UI (§31) | Dark premium home `app/page.tsx` + themes `app/globals.css` |
| Identity Graph / Intelligence Map (§5,33) | Knowledge graph `lib/brain-graph.ts` |

## What we must build (the NEXUS delta)

1. **Dynamic Identity / Evolving Profile** (§4-5) — static personas → evidence-driven evolving identity.
2. **Permission Graph + Human-in-the-Loop** (§6,43) — read-gate → per-action execution approvals.
3. **Evidence/Verification layer** (§12,39) — shape validation → Claim/Source/Confidence verification.
4. **Model Router / Registry** (§35-36) — single LLM gateway → multi-model, cost-aware, free-first.
5. **Event-Driven + Background Intelligence** (§26-27) — request-only → proactive monitoring + triggers.
6. **Temporary Teams + Decision Briefs** (§24-25) — simple conductor → cross-company synthesis.
7. **Scenario Engine + Adaptive Learning** (§16-20,49).
8. **Cost Control MAX_SPEND=0** (§36).

---

## Phase 0 — Rebrand & Data Scaffold  *(quick, Day-0)*

**Goal:** rename identity to NEXUS with **no behavior change**; add empty
repositories/tables for the new spine so later phases only fill them.

- Branding → NEXUS (title/meta/nav labels); default theme to dark Monolith.
- New SQLite tables + repos (`lib/db.ts`) + Zod schemas (`lib/schemas.ts`):
  `identities`, `identity_evidence`, `permissions`, `approval_requests`,
  `claims`, `evidence`, `sources`, `model_registry`, `tool_registry`, `events`,
  `scenarios`, `audit_log`.
- Every existing page keeps working.

**DoD:** app still boots seeded; new tables exist empty; "NEXUS" name shows in UI.

---

## Phase 1 — Core Architecture Spine  ← **WE START HERE**

The skeleton every Company hangs on. Each sub-step ships to the preview.

- **1.1 Dynamic Identity (Identity Graph)** — central evolving profile: stage,
  goals, skills, learning, projects, career, finance context, progress,
  strengths/weaknesses, decisions, history, future plans. Evidence-of-change
  triggers identity-update *suggestions*. (`lib/identity.ts` + repos)
- **1.2 Memory Architecture** — extend `memory-core` to all 7 layers (User,
  Episodic, Semantic, Project, Learning, Decision, Organizational); wire
  Identity as the User-Memory source.
- **1.3 Agent Registry v2** — evolve existing agents into the NEXUS model:
  Role/Skills/Tools/Memory/KPIs/Workflows/Permissions/Monitoring/Alerts/Reports/
  Decision Rules. Department → **Company**.
- **1.4 Permission Graph + Approval Gates** — per-agent read/use/edit/execute
  scopes; sensitive actions (email, GitHub, financial, delete, external)
  require Human Approval; every action written to `audit_log`.
- **1.5 Model Router / Registry** — multi-model (Gemini/OpenRouter/OpenAI/
  Anthropic/xAI), cost-aware; `MAX_SPEND=0` free-first; router picks by
  task/cost/capability/latency/quota.
- **1.6 Tool Registry** — formalize connectors into a registry
  (name/desc/input+output schema/cost/provider/permissions/reliability/limits/
  status) with a Source-Evaluation pipeline for new APIs.
- **1.7 Event Bus + Triggers** — typed events (`NEW_RESEARCH`, `MARKET_CHANGE`,
  `FORECAST_VARIANCE`, `GOAL_MISSED`, `NEW_COMPETITOR_MOVE`…); rules/filters →
  LLM only when needed; route to responsible agent + approval gate.
- **1.8 NEXUS HQ (Conductor v2)** — intent detection → temporary team →
  parallel dispatch → cross-verification → synthesis → **Decision Brief**.

**DoD:** a single request flows YOU → NEXUS HQ → temporary team (stub agents) →
synthesis → Decision Brief; identity evolves with evidence; a sensitive action
shows an approval gate; model router respects `MAX_SPEND=0`.

---

## Phase 2 — Research Company + Evidence/Verification  *(§12-14)*

Research is the most important company; Evidence underpins every other Company.

- Agents: Web Research, News, Academic (CORE API), Source Verification, Fact
  Extraction, Cross-Source Comparison, Intelligence Briefing, Video
  Intelligence, Evidence Management.
- Claim model: `FACT / INFERENCE / RECOMMENDATION / UNCERTAIN`; confidence:
  `AGREE / CONFLICT / PARTIAL / INSUFFICIENT`. Conflicts are **shown**, never
  hidden. No invented sources.
- Data Sources layer + Source Evaluation (cost/limits/reliability/license →
  tool registration).

**DoD:** ask a research question → get claims each tied to sources with a
confidence verdict; conflicting sources surfaced.

---

## Phase 3 — Finance Company (full blueprint loop)  *(§9, §45)*

First domain built end-to-end per §45 to prove the Company-Blueprint loop.

- Agents: CFO/Advisor, FP&A (dynamic reforecast), Controller, Treasury, Working
  Capital, Inventory Finance, Risk, Financial Intelligence.
- Dynamic FP&A: Actuals → Update → Reforecast → Compare → Explain Variance.
- Finance Advisor synthesizes all specialists into one financial picture.

**DoD:** financial question → multi-agent Finance response with forecast,
variance, risk, and a synthesized advisor view.

---

## Phase 4 — Learning Company + Scenario Engine + Adaptive Learning  *(§15-20,49)*

- Personal Development & Learning org: knows courses/books/certs/level/
  strengths/weaknesses/history.
- Adaptive Learning Engine: domain-agnostic; escalates deep topics to specialist
  Companies, returns results as lessons/scenarios. (Context ≠ Authority, §3.)
- Scenario Engine: Course → Scenario → Decision → Evaluation → Feedback → Next
  Scenario; increasing difficulty; analyzes Strategy/Finance/Risk/Marketing/
  Decision Quality/Blind Spots.
- Real-world learning: Research findings → scenarios. Cross-domain
  (Economics+Finance+Business+Marketing → one training scenario).
- German/Language: roleplay, Ausbildung interview, workplace, pressure
  scenarios; evaluates grammar/vocab/fluency/reaction/professional comm.

**DoD:** user enters a business scenario → decides → gets evaluated across
dimensions → next scenario adapts.

---

## Phase 5 — Business + Marketing Companies  *(§10-11)*

- Business: Strategy, BD, Operations, Competitive/Market Intelligence, Product
  Strategy, Business Models, Growth, Decision Support, Business Advisor.
- Marketing: Market Research, Customer Intelligence, Competitor Monitoring,
  Campaign Analysis, Growth, Brand, Content Intelligence, Strategy, Advisor.

**DoD:** competitor move detected (via Research) → Business + Marketing
analyze → replication recommendation with assumptions/risks.

---

## Phase 6 — Performance + Engineering + Legal Companies  *(§21-23,24)*

- Performance: Goal → Plan → Execution → Result → Feedback → Adjustment;
  bottlenecks.
- Engineering: Coding/Architecture/GitHub/Testing/Debugging/DevOps/Code Review/
  Technical Research/System Design.
- Legal: Legal Research, Contract Analysis, Compliance, Risk, Monitoring;
  explicit "not a lawyer" boundary for sensitive decisions.

**DoD:** cross-company question ("can we launch next month?") → Business +
Finance + Marketing + Legal + Engineering → single Decision Brief.

---

## Phase 7 — Background Intelligence & Event Maturity  *(§26-27)*

- Monitoring jobs: market/company/financial/research/competitor/learning/
  project events.
- Mature triggers, filters, dedup; LLM only when needed; alert routing +
  human-approval where needed.

**DoD:** system proactively surfaces a relevant event without being asked,
routed to the right agent.

---

## Phase 8 — NEXUS Command Center  *(§31-33)*

- Premium dark Intelligence/Operations-room UI: glassmorphism, live status,
  agent activity, alerts, events, execution logs, system health.
- Visualization: financial dashboards, KPIs, forecasts, goal progress, agent
  activity, research trends, risk, network graphs, timelines.
- Intelligence Map (not a globe): cities/events/companies/markets/research/
  alerts/connections with interactive layers.

**DoD:** home screen feels like a personal command center — data-driven, not
decorative.

---

## Phase 9 — Voice Interface & Agent Voice  *(§29-30)*

- Live voice conversation: streaming, fast, natural, interruptions,
  context-aware, agent handoff, real-time.
- Agent voice personas serving function (not gimmick).

**DoD:** speak to NEXUS live; it coordinates agents in the background while
responding.

---

## Phase 10 — Polish, Cost Control, Audit, Security Hardening  *(§34,36,41-42)*

- Motion/sound polish (subtle glow, transitions, alert animations, UI/ambient
  sounds) — **after** function is stable.
- Budget policy beyond `MAX_SPEND=0`.
- Full auditability: request/agent/tools/model/permissions/evidence/result/
  verification/errors/timestamp.
- Security hardening: tool/agent isolation, data minimization.

**DoD:** full audit trail for any important action; polished feel without
breaking function.

---

## Phase 11 — Adaptive Personal Intelligence  *(§47-50)*

- Personal Development Engine: monitors Knowledge/Skills/Decision/
  Communication/Business/Finance/Languages/Performance/Projects →
  Strengths/Weaknesses/Opportunities/Blind Spots/Next Development Area.
- System becomes more useful as the user evolves; suggests identity updates on
  real change.

**DoD:** NEXUS adapts recommendations as the user moves
Student → Founder → Business Owner → Executive.

---

## Build discipline (from §45-46)

- **One Company at a time**, full blueprint loop before the next.
- Before any Company: answer the 18 Blueprint questions (§46).
- Everything reads through the repo layer (`lib/db.ts` repos) + Zod
  (`lib/schemas.ts`); never query SQLite from a page/route.
- Honest status always; **no fake intelligence** (§40): `BLOCKED` / `FAILED` /
  `UNCERTAIN`, never a fake green light.
- **Cost-first**: `MAX_SPEND=0`, free models/APIs/local/deterministic unless
  explicitly allowed (§36).
- **Functionality first → visual polish later** (§34).
- **TDD**: failing test first (`tests/`, `FOUNDER_OS_DB=:memory:`), green before
  claiming done.

---

## Where we start

**Phase 1 — Core Architecture Spine**, first sub-step **1.1 Dynamic Identity
(Identity Graph)**. Phase 0's data scaffolding is folded into 1.1 so we begin
immediately.
