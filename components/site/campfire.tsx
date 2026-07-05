"use client";

import { useEffect, useRef, useState } from "react";

type MVTexture = object;
interface MVTextureInfo {
  setTexture(t: MVTexture): void;
}
interface MVMaterial {
  name: string;
  pbrMetallicRoughness: { baseColorTexture: MVTextureInfo };
  emissiveTexture: MVTextureInfo;
}
interface MVElement extends HTMLElement {
  model?: { materials: MVMaterial[] };
  createTexture(uri: string): Promise<MVTexture>;
}

const FIRE = Array.from({ length: 8 }, (_, i) => `/models/campfire/fire-${i}.png`);
const LOG = Array.from({ length: 4 }, (_, i) => `/models/campfire/log-${i}.png`);

/* Minecraft campfire, kept warm: the animated strip texture is cycled
   frame-by-frame through model-viewer's scene-graph API. */
export function Campfire() {
  const [ready, setReady] = useState(false);
  const ref = useRef<MVElement>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      import("@google/model-viewer").then(() => {
        if (alive) setReady(true);
      });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => load(), { timeout: 4000 });
    } else {
      setTimeout(load, 2200);
    }
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const mv = ref.current;
    if (!mv) return;
    let timer: ReturnType<typeof setInterval> | undefined;

    const onLoad = async () => {
      const mats = mv.model?.materials ?? [];
      const fire = mats.find((m) => m.name === "fire_anim");
      const log = mats.find((m) => m.name === "log_anim");
      if (!fire || !log) return;
      const fireTex = await Promise.all(FIRE.map((u) => mv.createTexture(u)));
      const logTex = await Promise.all(LOG.map((u) => mv.createTexture(u)));
      let i = 0;
      timer = setInterval(() => {
        i++;
        const f = fireTex[i % fireTex.length];
        fire.pbrMetallicRoughness.baseColorTexture.setTexture(f);
        fire.emissiveTexture.setTexture(f);
        if (i % 2 === 0) {
          const l = logTex[(i >> 1) % logTex.length];
          log.pbrMetallicRoughness.baseColorTexture.setTexture(l);
          log.emissiveTexture.setTexture(l);
        }
      }, 110);
    };
    mv.addEventListener("load", onLoad);
    return () => {
      mv.removeEventListener("load", onLoad);
      if (timer) clearInterval(timer);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-24 right-[4%] z-[5] hidden h-72 w-72 lg:block"
    >
      {/* warm hearth glow, flickering */}
      <div
        className="fire-flicker absolute inset-[-40%]"
        style={{
          background:
            "radial-gradient(circle at 50% 62%, rgba(255,160,60,0.34), rgba(255,120,30,0.10) 45%, transparent 70%)",
        }}
      />
      <model-viewer
        ref={ref}
        src="/models/campfire/campfire.glb"
        alt=""
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="5deg"
        interaction-prompt="none"
        disable-zoom
        shadow-intensity="0.8"
        shadow-softness="1"
        exposure="1.1"
        tone-mapping="aces"
        environment-image="/env/studio.hdr"
        camera-orbit="25deg 76deg 110%"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel text-[0.66rem] text-[var(--accent-3)]/80">
        the lab hearth · always on
      </div>
    </div>
  );
}
