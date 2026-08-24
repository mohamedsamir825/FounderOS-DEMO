/**
 * Circular progress gauge for the NEXUS Command Center personal/pillar state.
 * Server-component friendly: pure SVG, no state. A ring fills to `value`,
 * the percentage sits in the center, and an optional sparkline rides beneath.
 */
export function CircularGauge({
  label,
  value,
  sub,
  color = 'var(--accent)',
  spark,
}: {
  label: string;
  value: number;
  sub?: string;
  color?: string;
  spark?: number[];
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 96, height: 96 }}>
        <svg viewBox="0 0 100 100" width={96} height={96} className="-rotate-90">
          <circle cx={50} cy={50} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
          <circle
            cx={50}
            cy={50}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter: `drop-shadow(0 0 5px color-mix(in oklab, ${color} 55%, transparent))` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[20px] font-semibold tabular-nums text-os-text">{pct}</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-os-dim">%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[11px] font-semibold tracking-[0.04em] text-os-text">{label}</div>
        {sub && <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-os-dim">{sub}</div>}
      </div>
      {spark && spark.length > 1 && (
        <svg width={84} height={20} viewBox={`0 0 84 20`} aria-hidden="true" className="-mt-1">
          <MiniSpark data={spark} w={84} h={20} color={color} />
        </svg>
      )}
    </div>
  );
}

function MiniSpark({ data, w, h, color }: { data: number[]; w: number; h: number; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map(
    (v, i) =>
      `${((i / (data.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / range) * (h - 5)).toFixed(1)}`,
  );
  return (
    <>
      <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={color} opacity={0.1} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.3} />
    </>
  );
}
