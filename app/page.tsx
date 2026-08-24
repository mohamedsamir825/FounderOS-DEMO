import Link from 'next/link';
import { ShieldCheck, ShieldAlert, ShieldX, Radio } from 'lucide-react';
import { getDb } from '@/lib/data';
import { allConnectorStatuses } from '@/lib/connectors';
import { createGBrainProvider } from '@/lib/connectors/gbrain';
import { gatherCommsFeed } from '@/lib/comms-feed';
import { inboundLast24h } from '@/lib/comms';
import { stateOfWorld, runsPerDay, type Tone } from '@/lib/pulse-history';
import { pillarRadarAxes } from '@/lib/pillar-radar';
import { groupRoadmapByQuarter } from '@/lib/roadmap';
import type { ConnectorStatus } from '@/lib/connectors/types';
import { NexusMark } from '@/components/NexusMark';
import { LiveClock } from '@/components/nexus/LiveClock';
import { SituationRoom } from '@/components/nexus/SituationRoom';
import { PriorityIntel, type IntelRow, type Importance } from '@/components/nexus/PriorityIntel';
import { CircularGauge } from '@/components/nexus/CircularGauge';
import { ChiefOfStaffCard } from '@/components/nexus/ChiefOfStaffCard';

export const dynamic = 'force-dynamic';

const OPERATOR = 'NAVAI';

const TONE_CLASS: Record<Tone, string> = {
  ok: 'text-os-ok',
  warn: 'text-os-warn',
  err: 'text-os-err',
  accent: 'text-os-accent',
  dim: 'text-os-dim',
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Late night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 'just now';
  const m = Math.floor(ms / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const SOURCE_LABEL: Record<string, string> = { email: 'EMAIL', slack: 'SLACK', whatsapp: 'WHATSAPP' };

export default async function HomePage() {
  const db = getDb();

  const [connections, overview, feed] = await Promise.all([
    allConnectorStatuses(),
    createGBrainProvider().overview(),
    gatherCommsFeed(),
  ]).then(([c, o, f]) => [c, o, f] as const);

  const agents = db.agents.all();
  const departments = db.departments.all();
  const deptName = new Map(departments.map((d) => [d.id, d.name]));
  const recentRuns = db.agentRuns.recent(40);
  const runsForSpark = db.agentRuns.recent(400);

  const runsByAgent: Record<string, (typeof recentRuns)[number]> = {};
  for (const r of recentRuns) if (!runsByAgent[r.agentId]) runsByAgent[r.agentId] = r;

  const connected = connections.filter((c) => c.state === 'connected').length;
  const down = Math.max(0, connections.length - connected);
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const inbound = inboundLast24h(feed);
  const failedRuns = recentRuns.filter((r) => !r.ok).length;
  const health = overview.doctor.healthScore;
  const okRunsToday = recentRuns.filter((r) => r.ok).length;

  // ── Honest state-of-the-world line ──────────────────────────────────────
  const hero = stateOfWorld({
    activeAgents,
    totalAgents: agents.length,
    connected,
    totalConnectors: connections.length,
    inbound,
    health: health ?? null,
    brainConnected: overview.doctor.connected,
    failedRuns,
  });

  // ── Situation room signals ─────────────────────────────────────────────
  const eventsCount = recentRuns.length + inbound;
  const resolvedCount = okRunsToday;

  // ── Pillar-health gauges (real, computed from roster/freshness/SOP) ─────
  const axes = pillarRadarAxes(departments, agents, db.sopTasks.all(), runsByAgent)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // ── Priority intelligence rows (real comms + runs + roadmap) ────────────
  const nowQuarter = groupRoadmapByQuarter(db.roadmap.all())[0];
  const nowItems = nowQuarter?.items.slice(0, 4) ?? [];

  type Pending = { ts: number; row: IntelRow };
  const pending: Pending[] = [];

  for (const item of feed) {
    const t = Date.parse(item.ts);
    if (!Number.isFinite(t)) continue;
    pending.push({
      ts: t,
      row: {
        id: `comms-${item.ts}`,
        event: item.sender ?? item.title,
        category: SOURCE_LABEL[item.source] ?? 'COMMS',
        importance: (item.priority === 1 ? 'HIGH' : 'MEDIUM') as Importance,
        relevance: 'COMMS',
        status: 'NEW',
        time: relativeTime(item.ts),
      },
    });
  }
  for (const r of recentRuns) {
    pending.push({
      ts: Date.parse(r.finishedAt),
      row: {
        id: `run-${r.id}`,
        event: r.summary,
        category: deptName.get(agents.find((a) => a.id === r.agentId)?.departmentId ?? '') ?? 'AGENT',
        importance: (r.ok ? 'MEDIUM' : 'HIGH') as Importance,
        relevance: r.agentId,
        status: r.ok ? 'DONE' : 'FAILED',
        time: relativeTime(r.finishedAt),
      },
    });
  }
  for (const it of nowItems) {
    pending.push({
      ts: Date.now(),
      row: {
        id: `road-${it.id}`,
        event: it.title,
        category: (it.departmentId && deptName.get(it.departmentId)) || 'ROADMAP',
        importance: 'MEDIUM',
        relevance: 'PROJECTS',
        status: 'MONITOR',
        time: 'now',
      },
    });
  }
  pending.sort((a, b) => b.ts - a.ts);
  const intelRows = pending.slice(0, 8).map((p) => p.row);

  // ── Chief of Staff alert buckets (real) ─────────────────────────────────
  const highAlerts = failedRuns + (overview.doctor.connected ? 0 : 1) + down;
  const mediumAlerts = inbound;
  const monitorAlerts = nowItems.length;
  const attentionCount = highAlerts + mediumAlerts;

  // ── Intel ticker (real runs + comms) ────────────────────────────────────
  const ticker = [
    ...recentRuns.slice(0, 6).map((r) => ({
      tag: r.ok ? 'OK' : 'FAIL',
      tagClass: r.ok ? 'text-os-ok' : 'text-os-err',
      text: `${r.agentId} · ${r.summary}`,
    })),
    ...feed.slice(0, 6).map((i) => ({
      tag: SOURCE_LABEL[i.source] ?? 'COMMS',
      tagClass: 'text-[var(--nexus-blue)]',
      text: `${i.sender ?? i.title} · ${i.preview}`.slice(0, 120),
    })),
  ];

  // ── System security state ───────────────────────────────────────────────
  const secure = failedRuns === 0 && down === 0;
  const SecIcon = secure ? ShieldCheck : failedRuns > 0 ? ShieldX : ShieldAlert;
  const secLabel = secure ? 'SECURE' : failedRuns > 0 ? 'ALERT' : 'DEGRADED';
  const secClass = secure ? 'text-os-ok' : failedRuns > 0 ? 'text-os-err' : 'text-os-warn';

  return (
    <div className="view">
      {/* ── Command Center header ──────────────────────────────────────── */}
      <header className="nexus-panel mb-4 flex flex-wrap items-center gap-4 rounded-md px-5 py-3.5">
        <div className="flex items-center gap-3">
          <NexusMark size={36} />
          <div>
            <div className="text-[15px] font-bold tracking-[0.18em] text-os-text">NEXUS</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-os-dim">
              Command Center
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
          <LiveClock />
          <div className={`flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.1em] ${secClass}`}>
            <SecIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            {secLabel}
          </div>
          <div className="flex items-center gap-2 rounded-sm border border-os-border bg-os-bg2/60 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-os-accent nexus-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-os-text">{OPERATOR}</span>
          </div>
        </div>
      </header>

      {/* ── Honest state-of-the-world line ─────────────────────────────── */}
      <div className="-mt-1 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px]">
        {hero.map((s, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-os-border-strong">·</span>}
            <span className={TONE_CLASS[s.tone]}>{s.text}</span>
          </span>
        ))}
      </div>

      {/* ── Main grid: situation + intel | personal state + chief ──────── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* left / center */}
        <div className="flex min-w-0 flex-col gap-4">
          <SituationRoom
            connections={connections}
            eventsCount={eventsCount}
            resolvedCount={resolvedCount}
            failedRuns={failedRuns}
            downCount={down}
          />
          <PriorityIntel rows={intelRows} />
        </div>

        {/* right */}
        <div className="flex min-w-0 flex-col gap-4">
          <section className="nexus-panel rounded-md p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-os-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-os-accent" />
                Pillar Health
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">
                {axes.length} pillars
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {axes.map((a) => (
                <CircularGauge
                  key={a.id}
                  label={a.label}
                  value={a.score}
                  color={a.color}
                  spark={[a.roster, a.freshness, a.sop, a.score]}
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-[9px] leading-relaxed text-os-dim">
              Real scores from roster activity, run freshness and SOP coverage. Focus / Energy /
              Learning / Physical / Execution arrive with the Performance Company.
            </p>
          </section>

          <ChiefOfStaffCard
            greeting={greeting()}
            operator={OPERATOR}
            attentionCount={attentionCount}
            high={highAlerts}
            medium={mediumAlerts}
            monitor={monitorAlerts}
          />
        </div>
      </div>

      {/* ── Live intelligence feed ticker ─────────────────────────────── */}
      <section className="nexus-panel mt-4 flex items-stretch overflow-hidden rounded-md">
        <div className="z-[2] flex items-center gap-2 border-r border-os-border bg-os-bg2/70 px-3.5 font-mono text-[9px] uppercase tracking-[0.18em] text-os-accent">
          <Radio className="h-3 w-3" strokeWidth={1.8} />
          Live Feed
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="nexus-ticker-track py-2.5 pl-4">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-7 pr-7">
                {ticker.map((t, i) => (
                  <span key={copy + i} className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[11px]">
                    <b className={t.tagClass}>{t.tag}</b>
                    <span className="text-os-dim">{t.text}</span>
                    <span className="text-os-border-strong">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
