const FIELDS = [
  "Reinforcement Learning",
  "World Models",
  "Efficient Inference",
  "Computer Vision",
  "Multimodal Systems",
  "Test-Time Compute",
  "Agentic Workflows",
  "Diffusion Models",
];

export function FieldMarquee() {
  const row = [...FIELDS, ...FIELDS];
  return (
    <div
      aria-hidden
      className="brand-marquee overflow-hidden border-y border-[var(--line)] bg-[var(--card)] py-3"
    >
      <div className="brand-marquee-track flex w-max gap-10">
        {row.map((f, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--faint)]"
          >
            {f}
            <span className={["text-[var(--lime)]","text-[var(--accent-4)]","text-[var(--accent-2)]","text-[var(--accent-3)]"][i % 4]}>✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
