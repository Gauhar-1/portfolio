"use client";

import { useEffect, useRef, useCallback, type RefCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Lightbulb, Zap, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";
import type { ChallengeItem } from "@/data/architectures";

interface FeatureSlideOverProps {
  card: ChallengeItem | null;
  onClose: () => void;
}

export default function FeatureSlideOver({
  card,
  onClose,
}: FeatureSlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const setCloseBtnRef: RefCallback<HTMLButtonElement> = useCallback(
    (node) => {
      closeBtnRef.current = node;
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!card) return;

    document.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [card, handleKeyDown]);

  const sections = [
    {
      key: "problem" as const,
      label: "The Problem",
      stepMarker: "01 // ROOT BOTTLENECK",
      Icon: AlertTriangle,
      KpiIcon: ShieldAlert,
      text: card?.problem,
    },
    {
      key: "solution" as const,
      label: "The Solution",
      stepMarker: "02 // ARCHITECTURE DECISION",
      Icon: Lightbulb,
      KpiIcon: Cpu,
      text: card?.solution,
    },
    {
      key: "impact" as const,
      label: "The Impact",
      stepMarker: "03 // MEASURED OUTCOME",
      Icon: Zap,
      KpiIcon: CheckCircle2,
      text: card?.impact,
    },
  ];

  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Desktop Right Drawer */}
          <motion.div
            ref={panelRef}
            key="panel-desktop"
            role="dialog"
            aria-modal="true"
            aria-label={`Details about ${card.title}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 hidden w-full max-w-xl flex-col overflow-y-auto border-l border-[var(--theme-text)]/15 bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-2xl backdrop-blur-xl md:flex"
          >
            <PanelContent card={card} sections={sections} onClose={onClose} closeBtnRef={setCloseBtnRef} />
          </motion.div>

          {/* Mobile Bottom Sheet (85% height) */}
          <motion.div
            key="panel-mobile"
            role="dialog"
            aria-modal="true"
            aria-label={`Details about ${card.title}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] max-h-[85vh] flex-col overflow-hidden rounded-t-[28px] border-t border-[var(--theme-text)]/15 bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-2xl backdrop-blur-xl md:hidden"
          >
            {/* Mobile Drag Handle */}
            <div className="flex shrink-0 items-center justify-center pt-3 pb-1">
              <span className="h-1.5 w-12 rounded-full bg-[var(--theme-text)]/20" />
            </div>

            <div className="flex-1 overflow-y-auto">
              <PanelContent card={card} sections={sections} onClose={onClose} closeBtnRef={setCloseBtnRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  card,
  sections,
  onClose,
  closeBtnRef,
}: {
  card: ChallengeItem;
  sections: Array<{
    key: string;
    label: string;
    stepMarker: string;
    Icon: React.ElementType;
    KpiIcon: React.ElementType;
    text?: string;
  }>;
  onClose: () => void;
  closeBtnRef: RefCallback<HTMLButtonElement>;
}) {
  return (
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--theme-text)]/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-primary)]">
              Decision Deep Dive
            </span>
            <span className="text-[10px] font-mono opacity-50 uppercase">
              ID // {card.id}
            </span>
          </div>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tighter sm:text-3xl">
            {card.title}
          </h2>
          <p className="mt-1 text-sm tracking-tight opacity-75">
            {card.teaser}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center rounded border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.04] px-2 py-0.5 font-mono text-[10px] opacity-70 sm:inline-flex">
            ESC
          </span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.03] p-2 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Cards matching the page design */}
      <div className="space-y-4">
        {sections.map(({ key, label, stepMarker, Icon, KpiIcon, text }) => (
          <div
            key={key}
            className="group relative overflow-hidden rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.03] p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:border-[var(--theme-primary)]/40"
          >
            <div className="mb-3.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-[var(--theme-primary)]">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>

              <span className="text-[10px] font-mono tracking-wider opacity-50">
                {stepMarker}
              </span>
            </div>

            <p className="text-sm leading-relaxed tracking-tight opacity-85">
              {text}
            </p>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/[0.04] px-3 py-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary)] font-medium">
                <KpiIcon className="h-3.5 w-3.5" />
                <span>ARCHITECTURAL INSIGHT</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-60">
                VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
