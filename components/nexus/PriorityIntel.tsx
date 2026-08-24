/**
 * Priority Intelligence table for the NEXUS Command Center — a thin renderer
 * over rows the page builds from real signals (comms feed, agent runs,
 * roadmap). Every row traces back to real data; nothing is fabricated.
 */
export type Importance = 'HIGH' | 'MEDIUM' | 'LOW';

export type IntelRow = {
  id: string;
  event: string;
  category: string;
  importance: Importance;
  relevance: string;
  status: string;
  time: string;
};

const IMPORTANCE_CLASS: Record<Importance, string> = {
  HIGH: 'text-os-accent border-[var(--accent-line)] bg-[var(--accent-soft)]',
  MEDIUM: 'text-[var(--nexus-blue)] border-[color-mix(in_oklab,var(--nexus-blue)_30%,transparent)] bg-[color-mix(in_oklab,var(--nexus-blue)_8%,transparent)]',
  LOW: 'text-os-dim border-os-border',
};

function statusChip(status: string): string {
  const s = status.toUpperCase();
  if (s === 'NEW') return 'text-os-accent';
  if (s === 'FAILED') return 'text-os-err';
  if (s === 'DONE' || s === 'OK') return 'text-os-ok';
  if (s === 'UPDATING') return 'text-[var(--nexus-blue)]';
  return 'text-os-dim';
}

export function PriorityIntel({ rows }: { rows: IntelRow[] }) {
  return (
    <section className="nexus-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-os-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-os-accent" />
          Priority Intelligence
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-os-dim">{rows.length} active</span>
      </div>

      <div className="overflow-hidden rounded-sm border border-os-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-os-bg2/60 font-mono text-[8.5px] uppercase tracking-[0.14em] text-os-dim">
              <th className="px-2.5 py-2 font-semibold">Event</th>
              <th className="px-2.5 py-2 font-semibold">Category</th>
              <th className="px-2.5 py-2 font-semibold">Importance</th>
              <th className="hidden px-2.5 py-2 font-semibold min-[1200px]:table-cell">Relevance</th>
              <th className="px-2.5 py-2 font-semibold">Status</th>
              <th className="px-2.5 py-2 text-right font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2.5 py-6 text-center font-mono text-[11px] text-os-dim">
                  No active signals — all nominal.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-os-hairline hover:bg-os-surface2/50">
                <td className="max-w-[220px] truncate px-2.5 py-2 text-[12px] text-os-text">{r.event}</td>
                <td className="whitespace-nowrap px-2.5 py-2 font-mono text-[10px] text-os-muted">{r.category}</td>
                <td className="px-2.5 py-2">
                  <span className={`inline-block rounded-sm border px-1.5 py-[2px] font-mono text-[8.5px] font-semibold tracking-[0.08em] ${IMPORTANCE_CLASS[r.importance]}`}>
                    {r.importance}
                  </span>
                </td>
                <td className="hidden px-2.5 py-2 font-mono text-[10px] text-os-dim min-[1200px]:table-cell">{r.relevance}</td>
                <td className={`whitespace-nowrap px-2.5 py-2 font-mono text-[10px] font-semibold ${statusChip(r.status)}`}>
                  {r.status}
                </td>
                <td className="whitespace-nowrap px-2.5 py-2 text-right font-mono text-[10px] text-os-dim">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
