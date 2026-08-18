import type { Metadata } from "next";
import { RlpdExperience } from "./rlpd-experience";

export const metadata: Metadata = {
  title: "RLPD | Empirical reproduction and ablation study",
  description:
    "An empirical PyTorch reproduction of RLPD with controlled Humanoid-v5 replay-composition ablations, PCA visualization, and full-space state-coverage analysis.",
  alternates: { canonical: "/rlpd/" },
  authors: [
    { name: "Karan Anchan" },
    { name: "Pranav Prakash Menon" },
    { name: "Kandi Sridhar" },
  ],
  creator: "Karan Anchan, Pranav Prakash Menon, and Kandi Sridhar",
  openGraph: {
    title: "RLPD | Reproduction and ablation study",
    description:
      "A controlled Humanoid-v5 ablation measured a 21.9-point mean-return difference between online-only and 50/50 replay at a matched 500k-step horizon.",
    url: "https://karan-anchan.github.io/rlpd/",
    type: "article",
    siteName: "RLPD empirical study",
    images: [
      {
        url: "/rlpd/rlpd-social-cover.webp",
        width: 1672,
        height: 941,
        alt: "A humanoid research agent beside converging offline and online learning trajectories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RLPD | Reproduction and ablation study",
    description:
      "A three-seed RLPD reproduction with controlled Humanoid-v5 ablations, PCA visualization, and full-space state-distribution analysis.",
    images: ["/rlpd/rlpd-social-cover.webp"],
  },
};

const projectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: "RLPD: an empirical reproduction and ablation study",
  description:
    "A PyTorch reproduction of RLPD with controlled Humanoid-v5 replay-composition ablations, PCA visualization, and a cross-task offline-state coverage analysis.",
  url: "https://karan-anchan.github.io/rlpd/",
  image: "https://karan-anchan.github.io/rlpd/rlpd-social-cover.webp",
  author: [
    { "@type": "Person", name: "Karan Anchan" },
    { "@type": "Person", name: "Pranav Prakash Menon" },
    { "@type": "Person", name: "Kandi Sridhar" },
  ],
  about: [
    "Reinforcement learning",
    "Offline-to-online reinforcement learning",
    "RLPD",
    "MuJoCo",
  ],
  codeRepository:
    "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl",
};

export default function RlpdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <RlpdExperience />
    </>
  );
}
