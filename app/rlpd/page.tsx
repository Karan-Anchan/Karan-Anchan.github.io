import type { Metadata } from "next";
import RlpdContent from "./content";

export const metadata: Metadata = {
  title: "RLPD — offline-to-online RL, reproduced · Karan Anchan",
  description:
    "Reproducing RLPD in PyTorch, extending it to Humanoid-v5, and the ablation that contradicts the method — a first-person write-up by Karan Anchan.",
  alternates: { canonical: "/rlpd/" },
  openGraph: {
    title: "RLPD — offline-to-online RL, reproduced",
    description:
      "I rebuilt RLPD, pushed it onto Humanoid, and hit an ablation that argued against the whole premise.",
    url: "https://karan-anchan.github.io/rlpd/",
    type: "article",
    images: [{ url: "/og-rlpd.jpg", width: 1200, height: 630, alt: "RLPD deep-dive" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-rlpd.jpg"] },
};

export default function Page() {
  return <RlpdContent />;
}
