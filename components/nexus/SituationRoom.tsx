import type { ConnectorStatus } from '@/lib/connectors/types';

/**
 * NEXUS Situation Room — an honest "intelligence radar" of the systems that
 * are actually wired. No fake world map: nodes are real connectors placed on
 * range rings around a central hub, glowing by live state. Risk index and
 * event counts come from real signals (failed runs, down connectors, activity).
 */
function riskBand(index: number): { label: string; tone: string } {
  if (index >= 70) return { label: 'CRITICAL', tone: 'text-os-err' };
  if (index >= 45) return { label: 'HIGH', tone: 'text-os-warn' };
  if (index >= 20) return { label: 'MODERATE', tone: 'text-os-warn' };
  return { label: 'LOW', tone: 'text-os-ok' };
}

export function SituationRoom({
  connections,
  eventsCount,
  resolvedCount,
  failedRuns,
  downCount,
}: {
  connections: ConnectorStatus[];
  eventsCount: number;
  resolvedCount: number;
  failedRuns: number;
  downCount: number;
}) {
  const nodes = connections.slice(0, 10);
  const cx = 200;
  const cy = 125;
  const rings = [42, 78, 112];
  const ringFor = (i: number) => rings[i % rings.length];

  const riskIndex = Math.min(100, Math.round(failedRuns * 10 + downCount * 12));
  const band = riskBand(riskIndex);

  const nodeColor = (s: string) =>
    s === 'connected' ? 'var(--ok)' : s === 'error' ? 'var(--err)' : 'var(--text-3)';

  return (
    <section className="nexus-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-os-muted">
          <span className="nexus-pulse h-1.5 w-1.5 rounded-full bg-os-err" />
          Situation Room
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">
          {nodes.length} nodes live
        </span>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-os-border bg-os-bg2/60">
        <svg viewBox="0 0 400 250" className="block w-full" role="img" aria-label="Situation room radar">
          {/* range rings */}
          {rings.map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="2 4" />
          ))}
          {/* crosshair */}
          <line x1={cx - 118} y1={cy} x2={cx + 118} y2={cy} stroke="var(--border)" strokeWidth={1} />
          <line x1={cx} y1={cy - 118} x2={cx} y2={cy + 118} stroke="var(--border)" strokeWidth={1} />

          {/* rotating sweep */}
          <g className="nexus-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <defs>
              <linearGradient id="nx-sweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent)" stopOpacity={0} />
                <stop offset="1" stopColor="var(--accent)" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <path d={`M ${cx} ${cy} L ${cx + 118} ${cy} A 118 118 0 0 0 ${cx + 83} ${cy - 83} Z`} fill="url(#nx-sweep)" />
          </g>

          {/* central hub */}
          <circle cx={cx} cy={cy} r="9" fill="var(--accent)" opacity={0.18} />
          <circle cx={cx} cy={cy} r="4" fill="var(--accent)" />

          {/* nodes + links */}
          {nodes.map((n, i) => {
            const ang = (i / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
            const r = ringFor(i);
            const x = cx + r * Math.cos(ang);
            const y = cy + r * Math.sin(ang);
            const col = nodeColor(n.state);
            const live = n.state === 'connected';
            return (
              <g key={n.id}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} opacity={live ? 0.6 : 0.25} />
                {live && (
                  <circle cx={x} cy={y} r="6" fill={col} opacity={0.4} className="nexus-halo" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={live ? 3.4 : 2.6}
                  fill={col}
                  className={live ? 'nexus-pulse' : undefined}
                />
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={8}
                  fill="var(--text-2)"
                >
                  {n.name.length > 14 ? n.name.slice(0, 13) + '…' : n.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* metric strip */}
      <div className="mt-3 grid grid-cols-4 gap-2 font-mono">
        <Metric label="Threat" value={band.label} valueClass={band.tone} />
        <Metric label="Risk Index" value={`${riskIndex}/100`} />
        <Metric label="Active Events" value={String(eventsCount)} valueClass="text-os-accent" />
        <Metric label="Resolved" value={String(resolvedCount)} valueClass="text-os-ok" />
      </div>
    </section>
  );
}

function Metric({ label, value, valueClass = 'text-os-text' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-sm border border-os-border bg-os-bg2/50 px-2.5 py-2">
      <div className="text-[8px] uppercase tracking-[0.16em] text-os-dim">{label}</div>
      <div className={`mt-1 text-[13px] font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}
