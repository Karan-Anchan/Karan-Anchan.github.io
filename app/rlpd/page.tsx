import type { Metadata } from "next";
import { RlpdExperience } from "./rlpd-experience";

export const metadata: Metadata = {
  title: "RLPD | Offline-to-online reinforcement learning",
  description:
    "PyTorch reproduction of RLPD on MuJoCo locomotion and Humanoid-v5, with matched replay ablations and offline-state coverage analysis.",
  alternates: { canonical: "/rlpd/" },
  authors: [
    { name: "Karan Anchan" },
    { name: "Pranav Prakash Menon" },
    { name: "Kandi Sridhar" },
  ],
  creator: "Karan Anchan, Pranav Prakash Menon, and Kandi Sridhar",
  openGraph: {
    title: "RLPD | Offline-to-online reinforcement learning",
    description:
      "At a matched 495k-step Humanoid evaluation, online-only replay exceeded 50/50 replay by 22.0 normalized-return points across three seeds per condition.",
    url: "https://karan-anchan.github.io/rlpd/",
    type: "article",
    siteName: "Karan Anchan · RLPD project",
    images: [
      {
        url: "/rlpd/fig-returns.png",
        width: 2937,
        height: 886,
        alt: "Measured normalized-return curves for RLPD, IQL, and SACfD across three locomotion tasks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RLPD | Offline-to-online reinforcement learning",
    description:
      "PyTorch reproduction across locomotion tasks, a Humanoid-v5 replay ablation, and state-coverage analysis.",
    images: ["/rlpd/fig-returns.png"],
  },
};

const projectJsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  headline: "RLPD: offline-to-online reinforcement learning",
  description:
    "A PyTorch reproduction of RLPD with controlled Humanoid-v5 replay-composition ablations, PCA visualization, and a cross-task offline-state coverage analysis.",
  url: "https://karan-anchan.github.io/rlpd/",
  image: "https://karan-anchan.github.io/rlpd/fig-returns.png",
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
      <div>
        <RlpdExperience />
      </div>
    </>
  );
}
