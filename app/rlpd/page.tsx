import type { Metadata } from "next";
import { RlpdExperience } from "./rlpd-experience";

export const metadata: Metadata = {
  title: "RLPD — an offline-to-online RL reproduction",
  description:
    "A three-person PyTorch reproduction and critical evaluation of RLPD across MuJoCo locomotion and Humanoid-v5.",
  alternates: { canonical: "/rlpd/" },
  authors: [
    { name: "Karan Anchan" },
    { name: "Pranav Menon" },
    { name: "Sridhar Kandi" },
  ],
  creator: "Karan Anchan, Pranav Menon, and Sridhar Kandi",
  openGraph: {
    title: "RLPD — the ablation changed the story",
    description:
      "We reproduced offline-to-online reinforcement learning, extended it to Humanoid-v5, and found a +21.9 point online-only result at the matched 500k horizon.",
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
    title: "RLPD — the ablation changed the story",
    description:
      "A team reproduction of RLPD, from three-seed locomotion to a surprising Humanoid-v5 ablation.",
    images: ["/rlpd/rlpd-social-cover.webp"],
  },
};

const projectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: "RLPD — an offline-to-online reinforcement learning reproduction",
  description:
    "A PyTorch reproduction and critical evaluation of RLPD on MuJoCo locomotion and Humanoid-v5.",
  url: "https://karan-anchan.github.io/rlpd/",
  image: "https://karan-anchan.github.io/rlpd/rlpd-social-cover.webp",
  author: [
    { "@type": "Person", name: "Karan Anchan" },
    { "@type": "Person", name: "Pranav Menon" },
    { "@type": "Person", name: "Sridhar Kandi" },
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
