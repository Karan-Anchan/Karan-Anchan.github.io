import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/site/preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-accent",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karan Anchan — AI Researcher & Engineer",
  description:
    "Karan Anchan — M.Sc. Computer Science (AI), University of Freiburg. Reinforcement learning, efficient deep learning, and systems that ship.",
  metadataBase: new URL("https://karan-anchan.github.io"),
  alternates: { canonical: "/" },
  authors: [{ name: "Karan Anchan", url: "https://karan-anchan.github.io/" }],
  creator: "Karan Anchan",
  openGraph: {
    title: "Karan Anchan — AI Researcher & Engineer",
    description:
      "Reinforcement learning · efficient deep learning · multimodal systems.",
    url: "https://karan-anchan.github.io/",
    type: "website",
    siteName: "Karan Anchan",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Karan Anchan — AI Researcher & Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karan Anchan — AI Researcher & Engineer",
    description:
      "Reinforcement learning · efficient deep learning · multimodal systems.",
    images: ["/og.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karan Anchan",
  url: "https://karan-anchan.github.io/",
  image: "https://karan-anchan.github.io/portrait.webp",
  jobTitle: "AI Researcher & Engineer",
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
    "Efficient Deep Learning",
    "Computer Vision",
    "Multimodal Systems",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] font-sans text-[var(--fg)]">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Preloader />
      </body>
    </html>
  );
}
