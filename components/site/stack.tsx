import { Reveal, SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";

const cols: { head: string; items: [string, string][] }[] = [
  {
    head: "Core",
    items: [
      ["Python", "daily"],
      ["PyTorch", "daily"],
      ["C++ / C", "solid"],
      ["SQL", "solid"],
      ["TypeScript", "working"],
    ],
  },
  {
    head: "Research",
    items: [
      ["Transformers / PEFT", "daily"],
      ["MuJoCo · Gymnasium", "daily"],
      ["MONAI", "solid"],
      ["W&B / MLflow", "daily"],
      ["TensorFlow", "working"],
    ],
  },
  {
    head: "Systems",
    items: [
      ["ONNX / TensorRT", "active"],
      ["Docker", "solid"],
      ["CUDA basics", "learning"],
      ["AWS", "working"],
      ["Git / CI-CD", "daily"],
    ],
  },
  {
    head: "Agents & data",
    items: [
      ["LangChain", "solid"],
      ["ChromaDB / Qdrant", "solid"],
      ["n8n", "active"],
      ["MCP", "learning"],
      ["Ollama", "working"],
    ],
  },
];

export function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 py-24">
      <GiantTitle word="STACK" className="-mt-10 mb-2 opacity-70" />
      <SectionHead sprite="/mc/sprite-potion.png" hue="var(--accent-4)" index="§05" title="Working" accent="stack" side="ckpt 05 — daily drivers first" />
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c, i) => (
          <Reveal key={c.head} delay={i * 0.06} className="bg-[var(--bg)] p-6">
            <h3 className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: ["var(--lime)","var(--accent-4)","var(--accent-2)","var(--accent-5)"][i] }}>
              {c.head}
            </h3>
            <ul className="space-y-2">
              {c.items.map(([name, lvl]) => (
                <li
                  key={name}
                  className="flex items-baseline justify-between border-b border-dashed border-[var(--line)] pb-2 text-sm font-light text-[var(--fg2)] last:border-b-0"
                >
                  {name}
                  <span className="font-mono text-[0.55rem] tracking-[0.1em] text-[var(--faint)]">
                    {lvl}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
