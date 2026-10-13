"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers, Globe } from "lucide-react";
import type { TimelineEvent } from "@/data/architectures";

const ICON_MAP = [CheckCircle2, Layers, Globe];

const lineContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const nodeVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export interface RoadmapItemInput {
  id?: string;
  phase?: string;
  label?: string;
  title: string;
  description: string;
}

export default function RoadmapTimeline({
  roadmap,
}: {
  roadmap: RoadmapItemInput[];
}) {
  return (
    <section
      className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-24"
      aria-labelledby="roadmap-heading"
    >
      <div className="mb-14 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--theme-primary)]">
          Technical Roadmap
        </p>
        <h2
          id="roadmap-heading"
          className="text-2xl font-bold tracking-tighter sm:text-3xl lg:text-4xl"
        >
          System Evolution &amp; Future Architecture
        </h2>
      </div>

      <div className="relative">
        {/* Continuous gradient spine */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-2 bottom-6 w-px bg-gradient-to-b from-[var(--theme-primary)] via-[var(--theme-primary)]/40 to-transparent md:left-5"
        />

        <motion.ol
          className="relative ml-0 space-y-8 md:space-y-10"
          variants={lineContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {roadmap.map((event, idx) => {
            const Icon = ICON_MAP[idx % ICON_MAP.length];
            const isCurrent = idx === 0;

            return (
              <motion.li
                key={event.id || event.phase || `milestone-${idx}`}
                variants={nodeVariant}
                className="group relative pl-12 md:pl-14"
              >
                {/* ── Glowing timeline node on the spine ── */}
                <div
                  aria-hidden="true"
                  className="absolute left-[11px] top-6 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-[15px]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)] shadow-[0_0_12px_var(--theme-primary)]"
                  />
                  {isCurrent && (
                    <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-[var(--theme-primary)] opacity-60" />
                  )}
                </div>

                {/* ── Milestone Card Container with Machined Glass ── */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.03] p-5 sm:p-6 md:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:border-[var(--theme-primary)]/40">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[var(--theme-primary)]">
                      <Icon className="h-3 w-3" />
                      {event.phase || event.label || `Phase ${idx + 1}`}
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-50 font-mono">
                      {isCurrent ? "PROVEN BASELINE" : `MILESTONE 0${idx + 1}`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed tracking-tight opacity-75">
                    {event.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
