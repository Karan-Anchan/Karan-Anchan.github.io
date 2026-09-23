import type { Metadata } from "next";
import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/500.css";
import "@fontsource/ibm-plex-serif/600.css";
import "@fontsource/ibm-plex-serif/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karan Anchan | Machine Learning Research and Engineering",
  description:
    "Research and engineering portfolio of Karan Anchan, M.Sc. Computer Science (AI) student at the University of Freiburg. Project methods, measured results, limitations, and code.",
  metadataBase: new URL("https://karan-anchan.github.io"),
  alternates: { canonical: "/" },
  authors: [{ name: "Karan Anchan", url: "https://karan-anchan.github.io/" }],
  creator: "Karan Anchan",
  openGraph: {
    title: "Karan Anchan | Machine Learning Research and Engineering",
    description:
      "Reinforcement learning, efficient language models, medical segmentation, and edge deployment—with methods, results, and limitations.",
    url: "https://karan-anchan.github.io/",
    type: "website",
    siteName: "Karan Anchan",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Karan Anchan, machine learning research and engineering portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karan Anchan | Machine Learning Research and Engineering",
    description:
      "Project methods, measured results, limitations, and code.",
    images: ["/og.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karan Anchan",
  url: "https://karan-anchan.github.io/",
  image: "https://karan-anchan.github.io/portrait.webp",
  description: "M.Sc. Computer Science (AI) student working on machine-learning research and engineering projects.",
  email: "mailto:kar.anchan02@gmail.com",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Freiburg",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Freiburg",
    addressCountry: "DE",
  },
  sameAs: [
    "https://github.com/Karan-Anchan",
    "https://linkedin.com/in/karan-anchan",
  ],
  knowsAbout: [
    "Reinforcement Learning",
    "Efficient Language Models",
    "Computer Vision",
    "Medical Image Segmentation",
    "Model Deployment",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
