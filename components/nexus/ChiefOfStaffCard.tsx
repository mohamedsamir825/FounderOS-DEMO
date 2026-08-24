import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * Chief of Staff card — the NEXUS HQ / Conductor's nightly brief, surfaced as
 * the operator's first read. The avatar is a stylized hooded tactical
 * silhouette (vector, not a stock image). Counts come from real signal
 * buckets the page computes (high = failed runs / down systems / offline
 * brain; medium = inbound to reply / degraded; monitor = roadmap + active
 * tracking).
 */
export function ChiefOfStaffCard({
  greeting,
  operator,
  attentionCount,
  high,
  medium,
  monitor,
}: {
  greeting: string;
  operator: string;
  attentionCount: number;
  high: number;
  medium: number;
  monitor: number;
}) {
  return (
    <section className="nexus-panel is-accent rounded-md p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-os-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-os-accent" />
        Chief of Staff
      </div>

      <div className="flex items-center gap-3.5">
        {/* hooded tactical silhouette */}
        <svg viewBox="0 0 64 64" width={56} height={56} className="shrink-0" aria-hidden="true">
          <defs>
            <radialGradient id="nx-hood" cx="50%" cy="35%" r="70%">
              <stop offset="0" stopColor="color-mix(in oklab, var(--accent) 30%, var(--surface))" />
              <stop offset="1" stopColor="var(--bg-2)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="64" height="64" rx="6" fill="url(#nx-hood)" stroke="var(--accent-line)" strokeWidth="1" />
          <path
            d="M32 14 C 22 14 17 22 17 32 C 17 40 21 46 24 50 L 24 56 L 40 56 L 40 50 C 43 46 47 40 47 32 C 47 22 42 14 32 14 Z"
            fill="color-mix(in oklab, var(--text) 14%, transparent)"
            stroke="var(--accent)"
            strokeWidth="1.4"
          />
          <path d="M24 40 Q 32 44 40 40 L 40 56 L 24 56 Z" fill="var(--bg-2)" opacity="0.7" />
          <circle cx="27" cy="33" r="2" fill="var(--accent)" />
          <circle cx="37" cy="33" r="2" fill="var(--accent)" />
        </svg>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-os-text">
            {greeting}, {operator}.
          </div>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-os-muted">
            I&apos;ve analyzed the environment.{' '}
            <span className="text-os-accent">{attentionCount} items</span> require your attention.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <AlertTier label="High" count={high} tone="text-os-err" border="border-[color-mix(in_oklab,var(--err)_30%,transparent)]" />
        <AlertTier label="Medium" count={medium} tone="text-os-warn" border="border-[color-mix(in_oklab,var(--warn)_30%,transparent)]" />
        <AlertTier label="Monitor" count={monitor} tone="text-os-muted" border="border-os-border" />
      </div>

      <Link
        href="/agents"
        className="hoverable mt-4 flex items-center justify-between rounded-sm border border-[var(--accent-line)] bg-[var(--accent-soft)] px-3.5 py-2.5 text-[12px] font-semibold tracking-[0.04em] text-os-accent transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
      >
        View Full Brief
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
      </Link>
    </section>
  );
}

function AlertTier({ label, count, tone, border }: { label: string; count: number; tone: string; border: string }) {
  return (
    <div className={`rounded-sm border ${border} bg-os-bg2/50 px-2.5 py-2 text-center`}>
      <div className={`font-mono text-[18px] font-semibold tabular-nums ${tone}`}>
        {String(count).padStart(2, '0')}
      </div>
      <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-os-dim">{label}</div>
    </div>
  );
}
