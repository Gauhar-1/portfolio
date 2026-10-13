"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import type { HeroData, HeroMetric } from "@/data/architectures";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract numeric value, prefix, suffix, and decimal precision from a metric string. */
function parseMetricValue(value: string) {
  const match = value.match(/^([^\d]*?)([\d.]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, decimals: 0, suffix: value };
  const numStr = match[2];
  return {
    prefix: match[1],
    target: parseFloat(numStr),
    decimals: numStr.includes(".") ? numStr.split(".")[1].length : 0,
    suffix: match[3],
  };
}

// ─── useCountUp ─────────────────────────────────────────────────────────────

function useCountUp(target: number, decimals: number, shouldStart: boolean) {
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!shouldStart) return;
    if (target === 0) {
      setDisplay(target.toFixed(decimals));
      return;
    }

    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });

    return () => controls.stop();
  }, [shouldStart, target, decimals]);

  return display;
}

// ─── MetricCard ─────────────────────────────────────────────────────────────

function MetricCard({
  metric,
  shouldAnimate,
  index,
}: {
  metric: HeroMetric;
  shouldAnimate: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { prefix, target, decimals, suffix } = parseMetricValue(metric.value);
  const displayValue = useCountUp(target, decimals, shouldAnimate);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) return;

      const el = cardRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      mouseX.set(x);
      mouseY.set(y);

      rotateX.set(((y - height / 2) / (height / 2)) * -5);
      rotateY.set(((x - width / 2) / (width / 2)) * 5);
    },
    [mouseX, mouseY, rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // Enhanced 400px radial spotlight with color-mix for vibrant theme illumination
  const spotlightBg = useMotionTemplate`radial-gradient(
    400px circle at ${mouseX}px ${mouseY}px,
    color-mix(in srgb, var(--theme-primary) 18%, transparent),
    transparent 80%
  )`;

  const spotlightBorder = useMotionTemplate`radial-gradient(
    400px circle at ${mouseX}px ${mouseY}px,
    color-mix(in srgb, var(--theme-primary) 35%, transparent),
    transparent 80%
  )`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.55,
        delay: 0.2 + index * 0.08,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      aria-label={metric.ariaLabel}
      className="group relative w-full rounded-2xl"
    >
      {/* ── Illuminated Spotlight Border following cursor ── */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
        style={{ background: spotlightBorder }}
      />

      {/* ── Machined Glass Card Body with reactive border transition ── */}
      <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.03] p-4 sm:p-5 md:py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors duration-300 group-hover:border-[var(--theme-primary)]/30">
        {/* ── Spotlight inner glow ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
          style={{ background: spotlightBg }}
        />

        <p className="relative text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-60 truncate">
          {metric.title}
        </p>
        <p className="relative mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-bold tabular-nums tracking-tighter text-[var(--theme-primary)]">
          {prefix}
          {displayValue}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}

// ─── HeroHUD ────────────────────────────────────────────────────────────────

export default function HeroHUD({
  hero,
  name,
}: {
  hero: HeroData;
  name: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.05 });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const shouldAnimate = inView || hasMounted;

  // Split title if colon exists
  const titleLines = (() => {
    const idx = hero.title.indexOf(": ");
    if (idx === -1) return [hero.title];
    return [hero.title.slice(0, idx + 1), hero.title.slice(idx + 2)];
  })();

  const sectionMouseX = useMotionValue(0);
  const sectionMouseY = useMotionValue(0);

  const handleSectionMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      sectionMouseX.set(e.clientX - rect.left);
      sectionMouseY.set(e.clientY - rect.top);
    },
    [sectionMouseX, sectionMouseY],
  );

  const ambientGlow = useMotionTemplate`radial-gradient(
    900px circle at ${sectionMouseX}px ${sectionMouseY}px,
    color-mix(in srgb, var(--theme-primary) 12%, transparent),
    transparent 70%
  )`;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="relative overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-16 md:px-12 md:pt-28 md:pb-20 lg:px-24"
      aria-labelledby="hero-heading"
    >
      {/* ── Dynamic Ambient Theme Spotlight ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: ambientGlow }}
      />

      {/* ── "System Status: Operational" Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="relative mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-[0_0_15px_var(--theme-primary)]/20"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-primary)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--theme-primary)]">
          System Status: Operational
        </span>
      </motion.div>

      {/* ── Breadcrumb ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative mb-3 sm:mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] opacity-60"
      >
        Case Study &mdash; {name} Architecture Deep Dive
      </motion.p>

      {/* ── Headline Reveal ── */}
      <h1
        id="hero-heading"
        className="relative max-w-3xl text-2xl font-bold leading-tight tracking-tighter sm:text-4xl lg:text-5xl break-words"
      >
        {titleLines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: "100%" }}
              animate={shouldAnimate ? { y: "0%" } : { y: "100%" }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* ── Subtitle ── */}
      <div className="relative overflow-hidden mt-3 sm:mt-5">
        <motion.p
          initial={{ y: "100%" }}
          animate={shouldAnimate ? { y: "0%" } : { y: "100%" }}
          transition={{
            duration: 0.7,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed tracking-tight opacity-75"
        >
          {hero.subtitle}
        </motion.p>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="relative mt-8 sm:mt-12 md:mt-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {hero.metrics.map((metric, i) => (
            <MetricCard
              key={metric.title}
              metric={metric}
              shouldAnimate={shouldAnimate}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
