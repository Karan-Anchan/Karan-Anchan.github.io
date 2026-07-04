# karan-anchan.github.io

Personal portfolio — **Karan Anchan**, AI researcher & engineer.
Live at **https://karan-anchan.github.io/**

Next.js (App Router, static export) + Tailwind v4 + shadcn, with components from
[KokonutUI](https://kokonutui.com), [Skiper UI](https://skiper-ui.com),
[Vengeance UI](https://www.vengenceui.com), [Bklit](https://bklit.com) charts,
plus [anime.js](https://animejs.com) and [Motion](https://motion.dev).
Deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`.

## Develop

```powershell
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
```

Add more registry components with e.g.
`npx shadcn add @kokonutui/<name>` or `npx shadcn add "https://www.vengenceui.com/r/<name>.json"`.

## ⚠️ Placeholder content — replace before sharing widely

The following is **plausible fake data** used to make the site complete:

| Where | What's fake |
|---|---|
| Work entry 03 — *Mamba-2 × attention hybrid LM* | Whole project is from the 2026 roadmap, not started. Metrics (160M params, 1:7 ratio, ~3% ppl gap) are invented. |
| Work entry 04 — *Sparse autoencoders / circuit tracing* | Same — roadmap project, invented metrics (16× expansion, ~78% auto-interp). |
| Work entry 01 — *RLPD* metrics + chart | Project is real ([repo](https://github.com/Karan-Anchan/rlpd-offline-to-online-rl)) but the 3×3 seeds / UTD 20 / ensemble 10 numbers and the learning-curve data are the plan, not results. |
| Work entry 02 — *YOLO26* latency chart | Real project ([repo](https://github.com/Karan-Anchan/edge-yolo26-deployment)); the ms numbers are illustrative until benchmarks run. |
| Roadmap bento metrics | Efficient-inference percentages are targets, not measurements. |
| About — "5+ yrs Python & PyTorch" counter | Approximate. |
| "Now" ticker + personal microcopy (chai vs coffee, seed 2, 2am) | Personal flavor written for tone — edit to taste. |
| `public/CVKaranAnchan.pdf` | Old CV — still lists the old GitHub account. Regenerate from the `.tex`. |

Everything else (bio, education, WiZdom Ed internship, certifications, contact) is real.
The old `KaranAnchan` account is compromised/unrecoverable — nothing may link to it.
