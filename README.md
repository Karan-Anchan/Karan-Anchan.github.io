# Karan Anchan — research portfolio

[Live portfolio](https://karan-anchan.github.io/) · [RLPD study](https://karan-anchan.github.io/rlpd/)

A compact portfolio for machine-learning research and engineering work. The homepage summarizes each selected project through its method, recorded result, measurement boundary, tools, and source links. It also lists project-backed tools, experience, education, and contact details. The separate `/rlpd/` page retains the full RLPD study and its figures.

The homepage is a static Next.js export. IBM Plex Serif and IBM Plex Mono are self-hosted through Fontsource; the main favicon is `app/icon.svg`, and `public/og-card.svg` is the editable source for `public/og.jpg`.

Project previews are self-hosted and load lazily. RLPD uses recorded locomotion rollout GIFs; YOLO26 uses the browser sample-video detection capture; the NMT visualization comes from its project repository. The Mamba animation reveals the fixed, calculated 8K logical-state values in [`ratio_tradeoffs.svg`](https://github.com/Karan-Anchan/mamba-hybrid-lm/blob/main/results/week5-analysis-v1/plots/ratio_tradeoffs.svg), while the UNETR animation steps through the three panels of its [documented validation slice](https://github.com/Karan-Anchan/Unetr_3D_Abdomen_Segmentation/blob/main/viz.png). Those two animations do not represent live model execution. Static frames are served for visitors who request reduced motion.

## Run locally

```bash
npm ci
npm run dev
```

Run `npm run lint` and `npm run build` before publishing. The build generates `out/`, including the homepage and `/rlpd/` route. GitHub Actions deploys that static output to GitHub Pages when `main` is updated.

`npm run lint` checks the active app, `lib/`, and `types/` paths and is also run in the deployment workflow. `npm run lint:all` additionally audits the unused historical `components/` tree; that legacy tree currently has lint findings and has not been removed or silently rewritten.

## Evidence policy

Project summaries distinguish a measured outcome from its scope or limitation. Detailed protocols and artifacts remain in the linked project repositories. The WiZdom Ed internship summary describes recorded internal evaluation batches; it does not claim a production deployment. Speculative roadmap figures are not shown as research results.
