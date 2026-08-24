/**
 * The NEXUS mark — a gold hexagon core with three radiating synapses, the
 * "network of specialists around one person" identity. Crisp inline vector so
 * it scales and themes; re-ink with `color` (defaults to cyber gold).
 */
export function NexusMark({
  size = 34,
  color = 'var(--accent)',
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="NEXUS">
      <g fill="none" stroke={color} strokeWidth={5.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 16 L78 32 L78 68 L50 84 L22 68 L22 32 Z" opacity={0.45} />
        <path d="M50 30 L66 39 L66 61 L50 70 L34 61 L34 39 Z" />
      </g>
      <g stroke={color} strokeWidth={3.4} strokeLinecap="round">
        <line x1="50" y1="50" x2="50" y2="30" />
        <line x1="50" y1="50" x2="67" y2="60" />
        <line x1="50" y1="50" x2="33" y2="60" />
      </g>
      <circle cx="50" cy="50" r="6.5" fill={color} />
      <circle cx="50" cy="30" r="4" fill={color} />
      <circle cx="67" cy="60" r="4" fill={color} />
      <circle cx="33" cy="60" r="4" fill={color} />
    </svg>
  );
}
