"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Crosshair, Cpu, RotateCcw, Layers } from "lucide-react";
import { TacticalLoadout } from "../constants/operator-data";
import { setSavedViewState, setLandingMap } from "@/utils/viewStatePersistence";

interface LoadoutInspectorProps {
  activeLoadout: TacticalLoadout;
  activeSlotIndex: number | null;
  onSelectSlot: (index: number | null) => void;
  loadouts: TacticalLoadout[];
}

export default function LoadoutInspector({
  activeLoadout,
  activeSlotIndex,
  onSelectSlot,
  loadouts,
}: LoadoutInspectorProps) {
  const isDefaultThemeActive = activeSlotIndex === null;

  return (
    <section className="flex flex-col justify-between space-y-4 w-full lg:max-w-md xl:max-w-lg z-20">
      {/* ── 1. Top: 4 Tactical Loadout Selector Tabs + Default Theme Reset Button ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono">
          <span
            className="font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))" }}
          >
            <Layers className="h-3 w-3" style={{ color: "var(--theme-primary)" }} />
            TACTICAL WEAPON LOADOUTS
          </span>

          {/* [ 0 // DEFAULT THEME ] Reset Button */}
          <button
            type="button"
            onClick={() => onSelectSlot(null)}
            className="group flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer"
            style={{
              borderColor: isDefaultThemeActive
                ? "var(--theme-primary)"
                : "color-mix(in srgb, var(--theme-text) 16%, transparent)",
              backgroundColor: isDefaultThemeActive
                ? "color-mix(in srgb, var(--theme-primary) 18%, var(--theme-bg))"
                : "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
              color: isDefaultThemeActive
                ? "var(--theme-primary)"
                : "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))",
              boxShadow: isDefaultThemeActive
                ? "0 0 12px color-mix(in srgb, var(--theme-primary) 25%, transparent)"
                : "none",
            }}
            title="Reset to Tactical Operator Default Theme [Press 0 or ESC]"
          >
            <RotateCcw className="h-2.5 w-2.5 group-hover:-rotate-90 transition-transform" />
            <span>[0] DEFAULT THEME</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {loadouts.map((loadout, idx) => {
            const isEquipped = activeSlotIndex === idx;
            return (
              <button
                key={loadout.id || loadout.slotNumber}
                type="button"
                onClick={() => onSelectSlot(isEquipped ? null : idx)}
                className="group relative flex flex-col p-2 rounded-lg text-left transition-all duration-300 border focus:outline-none cursor-pointer"
                style={{
                  borderColor: isEquipped
                    ? "var(--theme-primary)"
                    : "color-mix(in srgb, var(--theme-text) 16%, transparent)",
                  backgroundColor: isEquipped
                    ? "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))"
                    : "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
                  boxShadow: isEquipped
                    ? "0 0 16px color-mix(in srgb, var(--theme-primary) 30%, transparent)"
                    : "none",
                }}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className="text-[9px] font-mono font-bold px-1 rounded transition-colors"
                    style={{
                      backgroundColor: isEquipped
                        ? "var(--theme-primary)"
                        : "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                      color: isEquipped
                        ? "var(--theme-bg)"
                        : "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))",
                    }}
                  >
                    [{loadout.key || idx + 1}]
                  </span>
                  <span
                    className="text-[7.5px] font-mono"
                    style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
                  >
                    SLOT_{loadout.slotNumber}
                  </span>
                </div>

                <span
                  className="text-[10px] font-mono font-bold truncate leading-tight transition-colors"
                  style={{
                    color: isEquipped
                      ? "var(--theme-text)"
                      : "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))",
                  }}
                >
                  {loadout.roleClass.split("&")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Active Loadout Inspection Card (Smooth Morphing) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLoadout.id || activeLoadout.slotNumber}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative rounded-2xl p-4 sm:p-5 border space-y-4 shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
            borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
            boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--theme-text) 10%, transparent), 0 10px 30px color-mix(in srgb, var(--theme-bg) 60%, black)",
          }}
        >
          {/* Card Header Strip */}
          <div
            className="flex items-start justify-between gap-3 border-b pb-3"
            style={{ borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-primary) 16%, var(--theme-bg))",
                    borderColor: "var(--theme-primary)",
                    color: "var(--theme-primary)",
                  }}
                >
                  {activeLoadout.calloutBadge || `SLOT ${activeLoadout.slotNumber}`}
                </span>
                <span
                  className="text-[8px] font-mono tracking-wider"
                  style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
                >
                  {activeLoadout.weaponTag}
                </span>
              </div>
              <h3
                className="text-base sm:text-lg font-bold font-sans tracking-tight leading-snug"
                style={{ color: "var(--theme-text)" }}
              >
                {activeLoadout.weaponName}
              </h3>
            </div>

            <div
              className="h-8 w-8 rounded-lg border flex items-center justify-center shrink-0"
              style={{
                borderColor: "var(--theme-primary)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))",
              }}
            >
              <Cpu className="h-4 w-4" style={{ color: "var(--theme-primary)" }} />
            </div>
          </div>

          {/* Mission Brief Narrative */}
          <p
            className="text-xs font-mono leading-relaxed text-justify"
            style={{ color: "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))" }}
          >
            {activeLoadout.missionBrief}
          </p>

          {/* 3-Node Architecture Pipeline Visual (Fully Responsive & Content-Adaptive) */}
          <div
            className="space-y-2 border rounded-xl p-3 w-full overflow-hidden"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, var(--theme-text) 4%)",
              borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
            }}
          >
            <div className="flex items-center justify-between text-[8px] font-mono">
              <span
                className="font-bold uppercase tracking-widest block"
                style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
              >
                EXECUTION PIPELINE FLOW
              </span>
              <span
                className="text-[7.5px] font-mono px-1.5 py-0.2 rounded"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, var(--theme-bg))",
                  color: "var(--theme-primary)",
                }}
              >
                {activeLoadout.pipeline.length} STAGES // VERIFIED
              </span>
            </div>

            {/* Responsive Pipeline Flow: Stacks cleanly on mobile, fluid connected row on desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full min-w-0">
              {activeLoadout.pipeline.map((node, i) => {
                const isTerminal = i === activeLoadout.pipeline.length - 1;
                return (
                  <div key={node} className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div
                      className="flex-1 min-w-0 rounded-lg px-2.5 py-2 border transition-all duration-300 flex flex-col justify-center"
                      style={{
                        borderColor: isTerminal
                          ? "var(--theme-primary)"
                          : "color-mix(in srgb, var(--theme-text) 14%, transparent)",
                        backgroundColor: isTerminal
                          ? "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))"
                          : "color-mix(in srgb, var(--theme-bg) 92%, var(--theme-text) 8%)",
                        boxShadow: isTerminal
                          ? "0 0 12px color-mix(in srgb, var(--theme-primary) 20%, transparent)"
                          : "none",
                      }}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className="text-[6.5px] font-mono uppercase tracking-wider block"
                          style={{
                            color: isTerminal
                              ? "var(--theme-primary)"
                              : "color-mix(in srgb, var(--theme-text) 48%, var(--theme-bg))",
                          }}
                        >
                          STAGE 0{i + 1}
                        </span>
                        {isTerminal && (
                          <span
                            className="h-1.5 w-1.5 rounded-full animate-ping shrink-0"
                            style={{ backgroundColor: "var(--theme-primary)" }}
                          />
                        )}
                      </div>

                      <span
                        className="text-[8px] sm:text-[8.5px] font-mono font-bold leading-tight break-words line-clamp-2"
                        style={{
                          color: isTerminal
                            ? "var(--theme-primary)"
                            : "color-mix(in srgb, var(--theme-text) 88%, var(--theme-bg))",
                        }}
                        title={node}
                      >
                        {node}
                      </span>
                    </div>

                    {/* Step Arrow (visible horizontally between items on sm+ screens) */}
                    {!isTerminal && (
                      <span
                        className="hidden sm:inline-block text-[9px] shrink-0 font-mono select-none"
                        style={{ color: "color-mix(in srgb, var(--theme-text) 35%, var(--theme-bg))" }}
                      >
                        →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Combat Stats Benchmarks */}
          <div className="grid grid-cols-3 gap-2">
            {activeLoadout.combatStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-2 text-center border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, var(--theme-text) 4%)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)",
                }}
              >
                <span
                  className="text-[7.5px] font-mono uppercase tracking-tight block truncate"
                  style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-xs sm:text-sm font-black font-mono tracking-tight mt-0.5 block"
                  style={{ color: "var(--theme-primary)" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Primary CTA Deep-Dive Button */}
          <Link
            href={activeLoadout.deepDiveUrl}
            onClick={() => {
              setLandingMap({
                section: "hero",
                sectionIndex: 0,
                heroSlotIndex: activeSlotIndex,
              });
              setSavedViewState({
                sectionIndex: 0,
                heroSlotIndex: activeSlotIndex,
              });
            }}
            className="group relative flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 border shadow-lg overflow-hidden cursor-pointer"
            style={{
              backgroundColor: "var(--theme-primary)",
              borderColor: "var(--theme-primary)",
              color: "var(--theme-bg)",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent)",
            }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <Crosshair className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>DEPLOY ARCHITECTURE BLUEPRINT</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
