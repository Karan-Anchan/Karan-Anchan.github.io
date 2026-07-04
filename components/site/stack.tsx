import { Reveal, SectionHead } from "@/components/site/reveal";

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
      <SectionHead index="§05" title="Working" accent="stack" side="daily drivers first" />
      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c, i) => (
          <Reveal key={c.head} delay={i * 0.06} className="bg-zinc-950 p-6">
            <h4 className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--lime)]">
              {c.head}
            </h4>
            <ul className="space-y-2">
              {c.items.map(([name, lvl]) => (
                <li
                  key={name}
                  className="flex items-baseline justify-between border-b border-dashed border-white/5 pb-2 text-sm font-light text-zinc-300 last:border-b-0"
                >
                  {name}
                  <span className="font-mono text-[0.55rem] tracking-[0.1em] text-zinc-500">
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
