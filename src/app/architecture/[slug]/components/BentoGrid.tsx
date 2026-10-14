"use client";

import { useState, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ChallengeItem } from "@/data/architectures";
import VisualRegistry from "@/components/VisualRegistry";
import FeatureSlideOver from "./FeatureSlideOver";

// ─── Individual Bento Card Component ────────────────────────────────────────

function BentoCardItem({
  card,
  onSelect,
}: {
  card: ChallengeItem;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 350, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 350, damping: 25 });

  const handleMouseEnter = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      const { left, top, width, height } = el.getBoundingClientRect();
      rectRef.current = { left, top, width, height };
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      let rect = rectRef.current;
      if (!rect) {
        const el = cardRef.current;
        if (!el) return;
        rect = el.getBoundingClientRect();
        rectRef.current = rect;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);

      rotateX.set(((y - rect.height / 2) / (rect.height / 2)) * -4);
      rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 4);
    },
    [mouseX, mouseY, rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // Enhanced 400px radial spotlight with color-mix for distinct theme illumination
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
    <motion.button
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        },
      }}
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative cursor-pointer rounded-2xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] flex flex-col h-full"
      aria-label={`Read details about ${card.title}`}
    >
      {/* ── Illuminated Spotlight Border following cursor ── */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
        style={{ background: spotlightBorder }}
      />

      {/* ── Card body with Machined Glass resting state & reactive hover border ── */}
      <div 
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-6 backdrop-blur-md transition-all duration-300"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 92%, var(--theme-text, #f8fafc) 5%)",
          border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
          boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--theme-text, #f8fafc) 10%, transparent)",
        }}
      >
        {/* Spotlight inner glow wash on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
          style={{ background: spotlightBg }}
        />

        <div className="flex flex-col">
          {/* Top header row: Pill + Step Tag */}
          <div className="mb-4 flex items-center justify-between">
            <span 
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase font-mono"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 14%, var(--theme-bg, #0a0a0c))",
                border: "1px solid color-mix(in srgb, var(--theme-primary, #10B981) 45%, transparent)",
                color: "var(--theme-primary, #10B981)",
              }}
            >
              Architecture Pattern
            </span>

            <span 
              className="text-[11px] font-mono uppercase font-medium"
              style={{ color: "color-mix(in srgb, var(--theme-text, #f8fafc) 55%, var(--theme-bg, #0a0a0c))" }}
            >
              ID // {card.id}
            </span>
          </div>

          {/* Title & Teaser */}
          <h3 
            className="text-xl font-bold tracking-tight sm:text-2xl"
            style={{ color: "var(--theme-text, #f8fafc)" }}
          >
            {card.title}
          </h3>
          <p 
            className="mt-2 text-sm leading-relaxed tracking-tight"
            style={{ color: "color-mix(in srgb, var(--theme-text, #f8fafc) 78%, var(--theme-bg, #0a0a0c))" }}
          >
            {card.teaser}
          </p>

          {/* Dynamic Micro-Visualization via VisualRegistry */}
          <div className="mt-5">
            <VisualRegistry visualKey={card.visualKey} />
          </div>
        </div>

        {/* Footer: Interactive explore affordance */}
        <div 
          className="mt-6 flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)" }}
        >
          <span 
            className="text-xs font-semibold uppercase tracking-wider transition-colors group-hover:text-[var(--theme-primary)]"
            style={{ color: "color-mix(in srgb, var(--theme-text, #f8fafc) 65%, var(--theme-bg, #0a0a0c))" }}
          >
            Inspect Architecture Decision
          </span>
          <span 
            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 group-hover:translate-x-1"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 84%, var(--theme-text, #f8fafc) 9%)",
              border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 15%, transparent)",
              color: "var(--theme-text, #f8fafc)",
            }}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── BentoGrid Container ────────────────────────────────────────────────────

export default function BentoGrid({
  challenges,
}: {
  challenges: ChallengeItem[];
}) {
  const [activeCard, setActiveCard] = useState<ChallengeItem | null>(null);

  const handleClose = useCallback(() => setActiveCard(null), []);

  return (
    <>
      <section
        className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-24"
        aria-labelledby="bento-heading"
      >
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--theme-primary)]">
            Architecture Decisions
          </p>
          <h2
            id="bento-heading"
            className="text-2xl font-bold tracking-tighter sm:text-3xl lg:text-4xl"
          >
            Core Challenges &amp; Technical Solutions
          </h2>
        </div>

        {/* ── 3 Horizontal Bento Cards Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.04 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {challenges.map((card) => (
            <BentoCardItem
              key={card.id}
              card={card}
              onSelect={() => setActiveCard(card)}
            />
          ))}
        </motion.div>
      </section>

      {/* Slide-over / Bottom Sheet */}
      <FeatureSlideOver card={activeCard} onClose={handleClose} />
    </>
  );
}
