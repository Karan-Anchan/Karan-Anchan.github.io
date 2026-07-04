import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { FieldMarquee } from "@/components/site/marquee";
import { NowTicker } from "@/components/site/now";
import { About } from "@/components/site/about";
import { Work } from "@/components/site/work";
import { Roadmap } from "@/components/site/roadmap";
import { Record } from "@/components/site/record";
import { Stack } from "@/components/site/stack";
import { Contact } from "@/components/site/contact";
import { Cursor } from "@/components/site/cursor";
import { TrainingHud } from "@/components/site/hud";
import { SoundFx } from "@/components/site/sound-fx";

export default function Home() {
  return (
    <main className="grain">
      <Cursor />
      <SoundFx />
      <TrainingHud />
      <SiteNav />
      <Hero />
      <FieldMarquee />
      <NowTicker />
      <About />
      <Work />
      <Roadmap />
      <Record />
      <Stack />
      <Contact />
    </main>
  );
}
