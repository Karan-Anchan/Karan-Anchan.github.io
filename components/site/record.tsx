import { Reveal, SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";

const xp = [
  {
    when: "Oct 2023 — Oct 2024",
    role: "Machine Learning Intern",
    org: "WiZdom Ed",
    where: "Mangalore, IN",
    points: [
      "Built a production RAG search system with LangChain + ChromaDB over 5,000+ educational documents.",
      "Cut ingestion time 40% via recursive text splitting; cosine-similarity feedback loop reached 90% answer accuracy.",
    ],
  },
];

const edu = [
  {
    when: "Apr 2025 — present",
    title: "M.Sc. Computer Science (AI)",
    body: "Albert-Ludwigs-Universität Freiburg — deep learning, probabilistic graphical models, statistical pattern recognition, robot mechanics.",
  },
  {
    when: "2020 — 2024",
    title: "B.E. Computer Science",
    body: "N.M.A.M. Institute of Technology — GPA 9.33/10 (German equivalent 1,3).",
  },
];

export function Record() {
  return (
    <section id="record" className="mx-auto max-w-6xl px-5 py-24">
      <GiantTitle word="RECORD" className="-mt-10 mb-2 opacity-70" />
      <SectionHead index="§04" title="The" accent="record" side="ckpt 04 — the receipts" />

      <div className="divide-y divide-white/5 border-y border-white/5">
        {xp.map((x) => (
          <Reveal key={x.role}>
            <div className="grid gap-3 py-8 md:grid-cols-[180px_1fr_160px]">
              <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">
                {x.when}
              </div>
              <div>
                <h3 className="text-xl font-light text-zinc-50">
                  {x.role}
                  <span className="mt-1 block text-sm font-light text-zinc-400">
                    {x.org}
                  </span>
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {x.points.map((p) => (
                    <li
                      key={p}
                      className="pl-5 text-sm font-light text-zinc-400 before:mr-2 before:-ml-5 before:text-[var(--lime)] before:content-['→']"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-zinc-500 md:text-right">
                {x.where}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2">
        {edu.map((e) => (
          <Reveal key={e.title} className="bg-zinc-950 p-7">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--lime)]">
              {e.when}
            </div>
            <h3 className="mt-2 text-lg font-light text-zinc-50">{e.title}</h3>
            <p className="mt-1.5 text-sm font-light text-zinc-400">{e.body}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          {
            label: "MLOps Specialization — Duke",
            href: "https://coursera.org/verify/specialization/BC9VRBWCQRU5",
          },
          {
            label: "ML Specialization — Stanford / DeepLearning.AI",
            href: "https://coursera.org/verify/specialization/JDYYP28JPJNZ",
          },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-white/10 px-4 py-2 font-mono text-[0.62rem] tracking-[0.08em] text-zinc-400 transition-colors before:mr-2 before:text-[var(--lime)] before:content-['✓'] hover:border-[var(--lime)]/50 hover:text-[var(--lime)]"
          >
            {c.label}
          </a>
        ))}
      </div>
    </section>
  );
}
