import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { FieldMarquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { Work } from "@/components/site/work";
import { Roadmap } from "@/components/site/roadmap";
import { Record } from "@/components/site/record";
import { Stack } from "@/components/site/stack";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <FieldMarquee />
      <About />
      <Work />
      <Roadmap />
      <Record />
      <Stack />
      <Contact />
    </main>
  );
}
