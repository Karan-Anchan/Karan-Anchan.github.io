import type { Metadata } from "next";
import { RlpdExperience } from "./rlpd-experience";

export const metadata: Metadata = {
  title: "RLPD | An offline-to-online RL reproduction",
  description:
    "A three-person PyTorch reproduction of RLPD, extended with Humanoid-v5 ablations and a cross-task state-coverage audit.",
  alternates: { canonical: "/rlpd/" },
  authors: [
    { name: "Karan Anchan" },
    { name: "Pranav Prakash Menon" },
    { name: "Kandi Sridhar" },
  ],
  creator: "Karan Anchan, Pranav Prakash Menon, and Kandi Sridhar",
  openGraph: {
    title: "RLPD | Offline-to-online RL reproduction",
    description:
      "Online-only gained 21.9 normalized points on Humanoid-v5, where the offline dataset covered just 6.6% of visited online states.",
    url: "https://karan-anchan.github.io/rlpd/",
    type: "article",
    siteName: "RLPD reproduction study",
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
    title: "RLPD | Offline-to-online RL reproduction",
    description:
      "A three-seed RLPD reproduction, Humanoid-v5 ablation study, and state-distribution audit.",
    images: ["/rlpd/rlpd-social-cover.webp"],
  },
};

const projectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: "RLPD: an offline-to-online reinforcement learning reproduction",
  description:
    "A PyTorch reproduction of RLPD with Humanoid-v5 ablations and a cross-task offline-state coverage audit.",
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
