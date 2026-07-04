/* Karan Anchan — research log · hand-rolled interactions, no libraries */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── boot preloader ─────────────────────────────────────── */
  const boot = document.getElementById("boot");
  const bootBar = document.getElementById("boot-bar");
  const bootPct = document.getElementById("boot-pct");

  const finishBoot = () => {
    boot.classList.add("done");
    document.body.classList.add("booted");
    setTimeout(() => boot.remove(), 700);
  };

  if (reduced) {
    finishBoot();
  } else {
    const t0 = performance.now();
    const D = 1100;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / D);
      const eased = 1 - Math.pow(1 - p, 3);
      bootBar.style.transform = `scaleX(${eased})`;
      bootPct.textContent = "INITIALISING · " + String(Math.round(eased * 100)).padStart(3, "0");
      if (p < 1) requestAnimationFrame(tick);
      else finishBoot();
    };
    requestAnimationFrame(tick);
  }

  /* ── hero canvas: drifting gradient-descent contour field ── */
  const canvas = document.getElementById("field");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr, pts = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = Math.max(42, Math.min(64, W / 26));
      pts = [];
      for (let x = gap / 2; x < W + gap; x += gap)
        for (let y = gap / 2; y < H + gap; y += gap)
          pts.push({ bx: x, by: y, phase: Math.random() * Math.PI * 2 });
      canvas._gap = gap;
    };
    resize();
    window.addEventListener("resize", resize);

    canvas.parentElement.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    let visible = true;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

    let t = 0;
    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible) return;
      t += 0.006;
      ctx.clearRect(0, 0, W, H);
      const gap = canvas._gap;
      for (const p of pts) {
        // slow lissajous drift, like parameters descending a loss surface
        const dx = Math.sin(t + p.phase + p.by * 0.012) * 7;
        const dy = Math.cos(t * 0.8 + p.phase + p.bx * 0.01) * 7;
        let x = p.bx + dx, y = p.by + dy;

        // cursor repulsion
        const mdx = x - mouse.x, mdy = y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        const R = 150;
        let glow = 0;
        if (md < R) {
          const f = (1 - md / R) ** 2;
          x += (mdx / (md || 1)) * f * 26;
          y += (mdy / (md || 1)) * f * 26;
          glow = f;
        }

        const tw = 0.5 + 0.5 * Math.sin(t * 2 + p.phase * 3);
        const a = 0.05 + tw * 0.07 + glow * 0.5;
        const s = 1 + glow * 1.6;
        ctx.fillStyle = glow > 0.03
          ? `rgba(199,242,132,${a})`
          : `rgba(238,241,232,${a})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);

        // sparse connective hairlines
        if (((p.bx + p.by) / gap) % 4 === 0) {
          ctx.strokeStyle = `rgba(199,242,132,${0.025 + glow * 0.12})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(p.bx + Math.sin(t + p.phase + 2) * 20, p.by + gap * 0.8);
          ctx.stroke();
        }
      }
    };
    draw();
  }

  /* ── scroll reveals ─────────────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add("in");
        // stagger children line-reveals inside a .rv container
        en.target.querySelectorAll(".rv-line > span").forEach((s, i) => {
          s.style.transitionDelay = `${i * 90}ms`;
        });
        io.unobserve(en.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".rv, .rv-line, .entry-fig svg").forEach((el) => io.observe(el));

  // hero lines reveal after boot
  const heroDelay = reduced ? 0 : 1150;
  setTimeout(() => {
    document.querySelectorAll(".hero .rv-line, .hero .rv").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), i * 110);
    });
  }, heroDelay);

  /* ── metric counters ────────────────────────────────────── */
  const cio = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target;
        cio.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const span = el.querySelector(".cnt");
        if (!span) continue;
        if (reduced) { span.textContent = target; continue; }
        const t0 = performance.now();
        const D = 1300;
        const step = (now) => {
          const p = Math.min(1, (now - t0) / D);
          span.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ── role ticker ────────────────────────────────────────── */
  const roles = [
    "Reinforcement Learning",
    "Efficient Deep Learning",
    "Computer Vision",
    "World Models",
    "Multimodal Systems",
    "Agentic Workflows",
  ];
  const roleEl = document.getElementById("role-word");
  if (roleEl && !reduced) {
    let ri = 0;
    setInterval(() => {
      ri = (ri + 1) % roles.length;
      roleEl.animate(
        [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-0.9em)" }],
        { duration: 260, easing: "ease-in", fill: "forwards" }
      ).onfinish = () => {
        roleEl.textContent = roles[ri];
        roleEl.animate(
          [{ opacity: 0, transform: "translateY(0.9em)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 320, easing: "cubic-bezier(0.22,1,0.36,1)", fill: "forwards" }
        );
      };
    }, 2600);
  }

  /* ── rail: scroll progress + live section ───────────────── */
  const railBar = document.getElementById("rail-progress");
  const railLinks = [...document.querySelectorAll(".rail-nav a")];
  const sections = railLinks
    .map((a) => document.getElementById(a.dataset.sec))
    .filter(Boolean);

  let scrollScheduled = false;
  const onScroll = () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (railBar) railBar.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`;
      let live = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= innerHeight * 0.45) live = s.id;
      }
      railLinks.forEach((a) => a.classList.toggle("live", a.dataset.sec === live));
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── custom cursor + magnetic buttons ───────────────────── */
  if (fine && !reduced) {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      requestAnimationFrame(loop);
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
    };
    loop();

    const hot = "a, button, .entry, .road-cell";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(hot)) document.body.classList.add("cursor-hot");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hot)) document.body.classList.remove("cursor-hot");
    });

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
        btn.style.transform = "";
        setTimeout(() => (btn.style.transition = ""), 500);
      });
    });
  }

  /* ── figure spotlight follows cursor ────────────────────── */
  document.querySelectorAll(".entry-fig").forEach((fig) => {
    fig.addEventListener("pointermove", (e) => {
      const r = fig.getBoundingClientRect();
      fig.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      fig.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  /* deep-link scroll (also used for automated visual checks) */
  const peek = new URLSearchParams(location.search).get("peek");
  if (peek) addEventListener("load", () => scrollTo(0, parseInt(peek, 10) || 0));

  /* ── Freiburg local time ────────────────────────────────── */
  const timeEl = document.getElementById("local-time");
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
    });
    const setTime = () => (timeEl.textContent = fmt.format(new Date()));
    setTime();
    setInterval(setTime, 30000);
  }
})();
