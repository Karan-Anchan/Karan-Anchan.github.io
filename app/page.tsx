import styles from "./portfolio.module.css";

type Project = {
  number: string;
  field: string;
  role: string;
  title: string;
  method: string;
  value: string;
  measure: string;
  finding: string;
  limit: string;
  tools: string;
  links: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    number: "01", field: "Reinforcement learning", role: "Team of three · 2026",
    title: "Offline-to-online RL on locomotion and Humanoid",
    method: "Reproduced RLPD in PyTorch across three MuJoCo locomotion tasks, then tested replay composition on Humanoid-v5 with matched architecture and online interaction budgets.",
    value: "+22.0", measure: "normalized-return points",
    finding: "Online-only minus 50/50 replay at the 495k-step evaluation; three seeds per condition.",
    limit: "Descriptive difference with substantial seed variance. Minari-v5 normalization is project-specific.",
    tools: "PyTorch · Gymnasium · MuJoCo · Minari · W&B",
    links: [
      { label: "Study and figures", href: "/rlpd/" },
      { label: "Code and results", href: "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl" },
    ],
  },
  {
    number: "02", field: "Efficient language models", role: "Individual study · 2026",
    title: "Mamba-2 and attention ratio study",
    method: "Compared three 16-layer hybrid language models under the same tokenizer, data pipeline, optimizer schedule, and 700 million sampled training-token positions per variant.",
    value: "26.301", measure: "best validation perplexity",
    finding: "The 1:3 attention:SSM model led the single-seed sweep. At 8K, 1:15 used 66.3% less calculated logical state for +0.212 perplexity.",
    limit: "Matched sampled-token exposure is not matched FLOPs. Long-context retrieval remained weak in the tested setup.",
    tools: "PyTorch · Mamba-2 · Hugging Face Datasets · FastAPI",
    links: [
      { label: "Research summary", href: "https://karan-anchan.github.io/mamba-hybrid-lm-showcase/" },
      { label: "Code and results", href: "https://github.com/Karan-Anchan/mamba-hybrid-lm" },
    ],
  },
  {
    number: "03", field: "Computer vision · deployment", role: "Individual project · 2026",
    title: "YOLO26 across GPU, CPU, and browser",
    method: "Fine-tuned one YOLO26-s detector on SKU-110K and built TensorRT, ONNX Runtime, and browser WebGPU/WASM inference paths for the same dense-detection task.",
    value: "1.9 ms", measure: "p50 model latency",
    finding: "TensorRT FP16 on an RTX 5070, with 0.06% relative mAP loss and 9.3 latency-derived FPS/W in the recorded protocol.",
    limit: "One training run; the reciprocal rate is not end-to-end video throughput, and power was measured only for GPU paths.",
    tools: "PyTorch · ONNX · TensorRT · ONNX Runtime · WebGPU",
    links: [
      { label: "Live browser demo", href: "https://karan-anchan.github.io/edge-yolo26-deployment/" },
      { label: "Code and benchmarks", href: "https://github.com/Karan-Anchan/edge-yolo26-deployment" },
    ],
  },
  {
    number: "04", field: "Medical image segmentation", role: "Individual project",
    title: "UNETR for 3D abdominal CT segmentation",
    method: "Built a 14-label volumetric segmentation pipeline around UNETR, covering CT preprocessing, patch-based training, inference, and validation analysis.",
    value: "0.8027", measure: "validation Dice",
    finding: "Recorded on one validation split of the abdominal CT dataset.",
    limit: "No independent test set or cross-validation result is reported.",
    tools: "Python · PyTorch · MONAI · 3D medical imaging",
    links: [{ label: "Code and documentation", href: "https://github.com/Karan-Anchan/Unetr_3D_Abdomen_Segmentation" }],
  },
  {
    number: "05", field: "Sequence modeling", role: "Individual project",
    title: "English–Hindi Transformer from scratch",
    method: "Implemented a six-layer encoder–decoder Transformer directly in PyTorch and compared greedy and beam decoding on a fixed evaluation set.",
    value: "41.58", measure: "chrF++ with beam search",
    finding: "Measured on 500 frozen test pairs; beam search incurred 9.3× greedy decoding latency.",
    limit: "The result describes this fixed test sample and training setup, not a broad translation benchmark.",
    tools: "PyTorch · byte-level BPE · beam search",
    links: [{ label: "Code and evaluation", href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer" }],
  },
];

const toolGroups = [
  { title: "Modeling and training", tools: "Python, PyTorch, MONAI, Transformers, Mamba-2, Hugging Face Datasets and Tokenizers", evidence: "UNETR · Mamba · translation model" },
  { title: "Reinforcement learning", tools: "Gymnasium, MuJoCo, Minari, Weights & Biases", evidence: "RLPD reproduction and Humanoid ablations" },
  { title: "Inference and deployment", tools: "ONNX, TensorRT, ONNX Runtime, WebGPU, FastAPI, server-sent events", evidence: "YOLO26 deployment · Mamba inference service" },
  { title: "Retrieval and interfaces", tools: "LangChain, ChromaDB, React, TypeScript, Next.js", evidence: "WiZdom Ed internship · project showcases · this site" },
];

export default function Home() {
  return (
    <main id="top" className={styles.page}>
      <a className={styles.skipLink} href="#work">Skip to selected work</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#top" aria-label="Karan Anchan, back to top">Karan Anchan</a>
          <nav className={styles.nav} aria-label="Main navigation">
            <a href="#work">Work</a><a href="#stack">Tools</a><a href="#record">Background</a><a href="#contact">Contact</a>
          </nav>
          <a className={styles.headerCv} href="/CVKaranAnchan.pdf">CV <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>Machine learning research and engineering</p>
          <h1 id="hero-title">Karan Anchan</h1>
          <p className={styles.lead}>I build and evaluate models for reinforcement learning, language modeling, medical segmentation, and edge vision. The work below records methods, results, and limitations.</p>
          <div className={styles.heroBottom}>
            <p>M.Sc. Computer Science (AI) · University of Freiburg · Freiburg, Germany</p>
            <div className={styles.heroLinks}>
              <a href="#work">Selected work ↓</a><a href="https://github.com/Karan-Anchan">GitHub ↗</a><a href="/CVKaranAnchan.pdf">CV ↗</a>
            </div>
          </div>
        </section>

        <section id="work" className={styles.section} aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>01 / Research and engineering</p><h2 id="work-title">Selected work</h2></div>
            <p>Methods, measured outcomes, and limits are summarized below. Full protocols and artifacts are in the linked projects.</p>
          </div>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <article key={project.number} className={styles.project}>
                <div className={styles.projectMeta}><span className={styles.projectNumber}>{project.number}</span><span>{project.field}</span><small>{project.role}</small></div>
                <div className={styles.projectMain}>
                  <h3>{project.title}</h3><p>{project.method}</p>
                  <p className={styles.toolLine}><span>Tools</span> {project.tools}</p>
                  <div className={styles.projectLinks}>{project.links.map((link) => <a key={link.href} href={link.href}>{link.label} ↗</a>)}</div>
                </div>
                <div className={styles.projectResult}>
                  <span className={styles.resultKicker}>Recorded result</span><strong>{project.value}</strong><span className={styles.metricLabel}>{project.measure}</span>
                  <p>{project.finding}</p><p className={styles.limit}><span>Limit</span> {project.limit}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className={styles.section} aria-labelledby="stack-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>02 / Project-backed practice</p><h2 id="stack-title">Tools and methods</h2></div>
            <p>These tools appear in the projects or documented work above. The list is not a proficiency ranking.</p>
          </div>
          <div className={styles.toolGrid}>{toolGroups.map((group) => (
            <div key={group.title} className={styles.toolGroup}><h3>{group.title}</h3><p>{group.tools}</p><small>{group.evidence}</small></div>
          ))}</div>
        </section>

        <section id="record" className={styles.section} aria-labelledby="record-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / Experience and education</p><h2 id="record-title">Background</h2></div></div>
          <div className={styles.recordList}>
            <article className={styles.recordItem}>
              <p className={styles.recordDate}>Oct 2023 – Oct 2024</p>
              <div><h3>Machine Learning Intern · WiZdom Ed</h3>
                <p>Built and evaluated a retrieval-based study-path system over 5,000+ internal educational documents using LangChain and ChromaDB. A company-provided 100-batch evaluation recorded 71.7% Recall@5, 93.4% groundedness, and 89.1% refusal accuracy.</p>
                <p className={styles.recordNote}>The recorded 2.72 s p95 is across batch-level latency values. Deployment status is not documented.</p>
              </div>
            </article>
            <article className={styles.recordItem}><p className={styles.recordDate}>Apr 2025 – present</p><div><h3>M.Sc. Computer Science (AI) · University of Freiburg</h3><p>Graduate study in deep learning, probabilistic graphical models, statistical pattern recognition, and robot mechanics.</p></div></article>
            <article className={styles.recordItem}><p className={styles.recordDate}>2020 – 2024</p><div><h3>B.E. Computer Science · N.M.A.M. Institute of Technology</h3><p>Graduated with a 9.33/10 GPA.</p></div></article>
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-title">
          <p className={styles.eyebrow}>04 / Contact</p><h2 id="contact-title">Contact</h2>
          <p>For research collaborations and machine-learning engineering roles, email me with the project or problem you have in mind.</p>
          <a className={styles.email} href="mailto:kar.anchan02@gmail.com">kar.anchan02@gmail.com</a>
          <div className={styles.contactLinks}><a href="https://github.com/Karan-Anchan">GitHub ↗</a><a href="https://linkedin.com/in/karan-anchan">LinkedIn ↗</a><a href="/CVKaranAnchan.pdf">CV · PDF ↗</a></div>
        </section>
      </div>
      <footer className={styles.footer}><div className={styles.shell}><span>© {new Date().getFullYear()} Karan Anchan</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
