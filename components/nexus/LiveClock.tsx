'use client';

import { useEffect, useState } from 'react';

/**
 * Live command-center clock: real wall time (browser timezone), updated every
 * second. Renders a stable placeholder on the server/first paint so there is no
 * hydration mismatch, then swaps to the ticking value after mount.
 */
export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : '--:--:-- --';
  const date = now
    ? now
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase()
    : '-- --- ----';

  return (
    <span className="font-mono text-[12px] tracking-[0.08em] text-os-text tabular-nums">
      <span className="text-os-accent">{time}</span>
      <span className="mx-2 text-os-border-strong">·</span>
      <span className="text-os-muted">{date}</span>
    </span>
  );
}
