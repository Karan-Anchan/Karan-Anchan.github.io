import styles from "./portfolio.module.css";

type Project = {
  number: string;
  tone: "forest" | "indigo" | "rust" | "teal" | "ochre";
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
  media: { src: string; still: string; alt: string; caption: string; href: string; linkLabel: string };
};

const projects: Project[] = [
  {
    number: "01", tone: "forest", field: "Reinforcement learning", role: "Team of three · 2026",
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
    media: {
      src: "/covers/rlpd-rollouts.gif", still: "/previews/rlpd-still.webp",
      alt: "Recorded RLPD policy rollouts for Hopper, Walker2d, and HalfCheetah shown side by side.",
      caption: "Recorded locomotion rollouts · qualitative, not the Humanoid ablation result.",
      href: "/rlpd/#results", linkLabel: "Open RLPD result figures",
    },
  },
  {
    number: "02", tone: "indigo", field: "Efficient language models", role: "Individual study · 2026",
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
    media: {
      src: "/previews/mamba-ratio.gif", still: "/previews/mamba-still.webp",
      alt: "Animated reveal of calculated 8K logical state: 61.33, 34.22, and 20.66 MiB for the 1:3, 1:7, and 1:15 attention-to-SSM models.",
      caption: "Ratio-sweep figure · calculated 8K logical state, not peak VRAM.",
      href: "/previews/mamba-ratio-source.svg", linkLabel: "Open full Mamba ratio-tradeoff figure",
    },
  },
  {
    number: "03", tone: "rust", field: "Computer vision · deployment", role: "Individual project · 2026",
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
    media: {
      src: "/covers/yolo-demo.webp", still: "/previews/yolo-still.webp",
      alt: "YOLO26 browser sample-video detection on a store shelf with product bounding boxes.",
      caption: "Browser sample-video detection · separate from the TensorRT latency benchmark.",
      href: "https://karan-anchan.github.io/edge-yolo26-deployment/", linkLabel: "Open YOLO26 browser demo",
    },
  },
  {
    number: "04", tone: "teal", field: "Medical image segmentation", role: "Individual project",
    title: "UNETR for 3D abdominal CT segmentation",
    method: "Built a 14-label volumetric segmentation pipeline around UNETR, covering CT preprocessing, patch-based training, inference, and validation analysis.",
    value: "0.8027", measure: "validation Dice",
    finding: "Recorded on one validation split of the abdominal CT dataset.",
    limit: "No independent test set or cross-validation result is reported.",
    tools: "Python · PyTorch · MONAI · 3D medical imaging",
    links: [{ label: "Code and documentation", href: "https://github.com/Karan-Anchan/Unetr_3D_Abdomen_Segmentation" }],
    media: {
      src: "/previews/unetr-slice.gif", still: "/previews/unetr-still.webp",
      alt: "One documented validation CT slice shown in sequence as the input image, reference segmentation, and model prediction.",
      caption: "One validation slice · sequential view of input, label, and prediction.",
      href: "/previews/unetr-viz-source.png", linkLabel: "Open full UNETR validation-slice figure",
    },
  },
  {
    number: "05", tone: "ochre", field: "Sequence modeling", role: "Individual project",
    title: "English–Hindi Transformer from scratch",
    method: "Implemented a six-layer encoder–decoder Transformer directly in PyTorch and compared greedy and beam decoding on a fixed evaluation set.",
    value: "41.58", measure: "chrF++ with beam search",
    finding: "Measured on 500 frozen test pairs; beam search incurred 9.3× greedy decoding latency.",
    limit: "The result describes this fixed test sample and training setup, not a broad translation benchmark.",
    tools: "PyTorch · byte-level BPE · beam search",
    links: [
      { label: "Code and evaluation", href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer" },
      { label: "Beam analysis figure", href: "/previews/nmt-beam-source.png" },
    ],
    media: {
      src: "/covers/nmt-decode.webp", still: "/previews/nmt-still.webp",
      alt: "Greedy Hindi decoding visualization with final-layer, head-averaged cross-attention highlighting the English source words.",
      caption: "Greedy decoding visualization from the project repository.",
      href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer/blob/main/decode_live.webp", linkLabel: "Open NMT greedy-decoding visualization",
    },
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
              <article key={project.number} className={`${styles.project} ${styles[project.tone]}`}>
                <div className={styles.projectMeta}><span className={styles.projectNumber}>{project.number}</span><span>{project.field}</span><small>{project.role}</small></div>
                <div className={styles.projectMain}>
                  <div className={styles.projectCopy}>
                    <h3>{project.title}</h3><p>{project.method}</p>
                    <p className={styles.toolLine}><span>Tools</span> {project.tools}</p>
                    <div className={styles.projectLinks}>{project.links.map((link) => <a key={link.href} href={link.href}>{link.label} ↗</a>)}</div>
                  </div>
                  <figure className={styles.projectMedia}>
                    <a className={styles.previewLink} href={project.media.href} aria-label={project.media.linkLabel}>
                      <picture>
                        <source media="(prefers-reduced-motion: reduce)" srcSet={project.media.still} />
                        <img src={project.media.src} alt={project.media.alt} width="560" height="330" loading="lazy" decoding="async" />
                      </picture>
                      <span className={styles.previewArrow} aria-hidden="true">↗</span>
                    </a>
                    <figcaption>{project.media.caption}</figcaption>
                  </figure>
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
