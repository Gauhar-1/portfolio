"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Server, Database, Activity, Lock, Cpu } from "lucide-react";

// ─── Adaptive Strict 3-Token Mathematical Style Tokens ──────────────────────

const outerContainerStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 88%, var(--theme-text, #f8fafc) 6%)",
  border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 16%, transparent)",
  boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--theme-text, #f8fafc) 10%, transparent)",
};

const inactiveSlotStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-bg, #0a0a0c) 96%, var(--theme-text, #f8fafc) 4%)",
  border: "1px solid color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
};

const activeHighlightStyle: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 15%, var(--theme-bg, #0a0a0c))",
  border: "1px solid var(--theme-primary, #10B981)",
  color: "var(--theme-primary, #10B981)",
};

const textSecondaryStyle: React.CSSProperties = {
  color: "color-mix(in srgb, var(--theme-text, #f8fafc) 85%, var(--theme-bg, #0a0a0c))",
};

const textMutedStyle: React.CSSProperties = {
  color: "color-mix(in srgb, var(--theme-text, #f8fafc) 60%, var(--theme-bg, #0a0a0c))",
};

// ─── 1. ChartVisual: Animated Glowing Line / Spike Visualization ────────────

export function ChartVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      {/* Background grid */}
      <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="chart-reg-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M 18 0 L 0 0 0 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              style={{ stroke: "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chart-reg-grid)" />
      </svg>

      {/* Dynamic Animated Line Curve */}
      <svg className="absolute inset-0 h-full w-full p-1" viewBox="0 0 300 110" preserveAspectRatio="none">
        <defs>
          <linearGradient id="themeChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--theme-primary, #10B981)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--theme-primary, #10B981)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Threshold line */}
        <line
          x1="0"
          y1="40"
          x2="300"
          y2="40"
          stroke="var(--theme-primary, #10B981)"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {/* Gradient area */}
        <path
          d="M 0 95 Q 50 90 90 75 T 160 55 T 215 15 T 260 50 T 300 45 L 300 110 L 0 110 Z"
          fill="url(#themeChartGradient)"
        />

        {/* Animated glowing wave line */}
        <motion.path
          d="M 0 95 Q 50 90 90 75 T 160 55 T 215 15 T 260 50 T 300 45"
          fill="none"
          stroke="var(--theme-primary, #10B981)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Pulsing peak beacon */}
        <circle cx="215" cy="15" r="4" fill="var(--theme-primary, #10B981)" />
        <motion.circle
          cx="215"
          cy="15"
          r="8"
          fill="none"
          stroke="var(--theme-primary, #10B981)"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Overlay status tags */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
        <span
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold"
          style={activeHighlightStyle}
        >
          <Activity className="h-3 w-3 animate-pulse" />
          Traffic Burst Active
        </span>
        <span className="text-xs font-mono font-semibold" style={textSecondaryStyle}>
          p99 &lt; 10ms
        </span>
      </div>

      <div className="relative z-10 text-[9px] font-mono" style={textMutedStyle}>
        In-Memory Fast Path &bull; Zero Buffer Saturation
      </div>
    </div>
  );
}

// ─── 2. SecurityVisual: Animated Cryptographic Handshake ────────────────────

export function SecurityVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Identity &amp; Handshake</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZERO-TRUST ENFORCED
        </span>
      </div>

      <div className="my-1 flex items-center justify-between gap-2 text-[10px] font-mono">
        {/* Client node */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center rounded-lg px-2 py-1.5 text-center"
          style={inactiveSlotStyle}
        >
          <Lock className="h-3.5 w-3.5 mb-0.5" style={textSecondaryStyle} />
          <span className="text-[8px] uppercase font-bold" style={textSecondaryStyle}>Client</span>
        </motion.div>

        {/* Animated cryptographic trace line */}
        <div className="relative flex flex-1 items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 8px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-28, 28, -28] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Verified Server node */}
        <motion.div
          animate={{
            borderColor: [
              "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
              "var(--theme-primary, #10B981)",
              "color-mix(in srgb, var(--theme-text, #f8fafc) 18%, transparent)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center rounded-lg px-2 py-1.5 text-center"
          style={activeHighlightStyle}
        >
          <ShieldCheck className="h-3.5 w-3.5 mb-0.5" />
          <span className="text-[8px] font-bold uppercase">Verified</span>
        </motion.div>
      </div>

      <div className="text-[9px] font-mono" style={textMutedStyle}>
        Cryptographic Proof &bull; Ephemeral Rotation
      </div>
    </div>
  );
}

// ─── 3. ServerVisual: Animated Mesh / Decoupled Pipeline ────────────────────

export function ServerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Architecture Topology</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          DECOUPLED MESH
        </span>
      </div>

      <div className="my-1 flex flex-col gap-1.5 text-[10px] font-mono">
        {/* Ingestion Engine */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5"
          style={inactiveSlotStyle}
        >
          <span className="flex items-center gap-1.5 text-[9px] font-medium" style={textSecondaryStyle}>
            <Server className="h-3 w-3" style={{ color: "var(--theme-primary, #10B981)" }} />
            Core Ingestion Node
          </span>
          <span className="text-[8px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
            0% Contention
          </span>
        </div>

        {/* Decoupled Read/Storage */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5"
          style={activeHighlightStyle}
        >
          <span className="flex items-center gap-1.5 text-[9px] font-bold">
            <Database className="h-3 w-3" />
            Decoupled Snapshot Bus
          </span>
          <span className="text-[8px] font-bold">Sub-10ms Read</span>
        </div>
      </div>

      <div className="text-[9px] font-mono" style={textMutedStyle}>
        Dedicated Event Streaming &bull; Isolated Workloads
      </div>
    </div>
  );
}

// ─── 4. LayoutOrchestratorVisual: Zero-Deploy Storefront Orchestration ────────

export function LayoutOrchestratorVisual() {
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVariant((v) => (v === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      {/* Top Browser Header */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 25%, transparent)" }}
            />
          </div>
          <span className="text-[8px] font-mono ml-1" style={textMutedStyle}>
            slot-runtime.cms
          </span>
        </div>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider flex items-center gap-1"
          style={activeHighlightStyle}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-ping"
            style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
          />
          LIVE SLOT ENGINE // 0 DEPLOYS
        </span>
      </div>

      {/* Dynamic Mini-Storefront Wireframe Slots */}
      <div className="my-1 flex-1 flex flex-col justify-center">
        {variant === 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {/* Hero Slot (Span 2) */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-2 rounded p-1.5 flex flex-col justify-between"
              style={activeHighlightStyle}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold uppercase">
                  SLOT: HERO_SPLIT
                </span>
                <span
                  className="h-1 w-6 rounded"
                  style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 45%, transparent)" }}
                />
              </div>
              <div
                className="h-1 w-16 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)" }}
              />
            </motion.div>

            {/* Side Bento Slot */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-1 rounded p-1.5 flex flex-col justify-between"
              style={inactiveSlotStyle}
            >
              <span className="text-[7px] font-mono font-semibold uppercase" style={textSecondaryStyle}>
                SLOT: BENTO_A
              </span>
              <div
                className="h-1 w-8 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 22%, transparent)" }}
              />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {/* Bento Slot Left */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-1 rounded p-1.5 flex flex-col justify-between"
              style={inactiveSlotStyle}
            >
              <span className="text-[7px] font-mono font-semibold uppercase" style={textSecondaryStyle}>
                SLOT: BENTO_A
              </span>
              <div
                className="h-1 w-8 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 22%, transparent)" }}
              />
            </motion.div>

            {/* Hero Slot (Span 2) Moved Right */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="col-span-2 rounded p-1.5 flex flex-col justify-between"
              style={activeHighlightStyle}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold uppercase">
                  SLOT: HERO_REORCHESTRATED
                </span>
                <span
                  className="h-1 w-6 rounded"
                  style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 45%, transparent)" }}
                />
              </div>
              <div
                className="h-1 w-20 rounded mt-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 35%, transparent)" }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-[9px] font-mono flex justify-between items-center" style={textMutedStyle}>
        <span>Dynamic Slot Mutation</span>
        <span>Hot Reload: 0ms</span>
      </div>
    </div>
  );
}

// ─── 5. BlockAstVisual: Polymorphic Block Editorial Studio ───────────────────

export function BlockAstVisual() {
  const blocks = [
    { tag: "TXT_NODE", label: "Executive Lead Paragraph" },
    { tag: "MEDIA_GALLERY", label: "Responsive Mesh Asset" },
    { tag: "METRIC_CALLOUT", label: "Realtime KPI Counter" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Editorial AST Pipeline</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          POLYMORPHIC NODES
        </span>
      </div>

      {/* 3 Stacked Modular Blocks */}
      <div className="my-0.5 space-y-1">
        {blocks.map((b, idx) => (
          <motion.div
            key={b.tag}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="flex items-center justify-between rounded-md px-2 py-0.5"
            style={{
              ...inactiveSlotStyle,
              borderLeft: "2px solid var(--theme-primary, #10B981)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                [{b.tag}]
              </span>
              <span className="text-[8px] font-mono truncate max-w-[130px] font-medium" style={textSecondaryStyle}>
                {b.label}
              </span>
            </div>
            <span className="text-[7.5px] font-mono" style={textMutedStyle}>
              L{idx + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Pulsing + ADD AST BLOCK Indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center gap-1 rounded py-0.5 text-[8px] font-mono font-bold tracking-wider"
        style={{
          ...activeHighlightStyle,
          borderStyle: "dashed",
        }}
      >
        <span>+</span>
        <span>ADD AST BLOCK</span>
      </motion.div>
    </div>
  );
}

// ─── 6. SchemaCompilerVisual: Schema-Driven Form Engine ─────────────────────

export function SchemaCompilerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Schema Form Engine</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZOD &bull; JSON AST
        </span>
      </div>

      {/* Two-Column Micro-Diagram */}
      <div className="my-0.5 grid grid-cols-5 items-center gap-1.5 text-[9px] font-mono">
        {/* Left: JSON Schema Pill */}
        <div className="col-span-2 rounded p-1.5 space-y-0.5" style={inactiveSlotStyle}>
          <div className="text-[7px] uppercase tracking-wider font-bold" style={textMutedStyle}>
            JSON_SCHEMA
          </div>
          <div className="text-[8px] font-bold truncate" style={{ color: "var(--theme-primary, #10B981)" }}>
            {`{ field: "arr" }`}
          </div>
          <div className="text-[7.5px]" style={textSecondaryStyle}>
            {`req: true, min: 2`}
          </div>
        </div>

        {/* Center: Animated Compiler Beam */}
        <div className="col-span-1 relative flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 8px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Right: Compiled UI Form Input */}
        <div className="col-span-2 rounded p-1.5 space-y-0.5" style={activeHighlightStyle}>
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-bold uppercase">
              RENDERED_UI
            </span>
            <span className="text-[8px] font-bold">✓</span>
          </div>
          <div
            className="rounded px-1.5 py-0.5 text-[8px] flex items-center justify-between"
            style={inactiveSlotStyle}
          >
            <span className="truncate font-medium" style={textSecondaryStyle}>valid_input</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Zero Client Glue</span>
        <span>Instant Compilation</span>
      </div>
    </div>
  );
}

// ─── 7. DefaultVisual: Generic System Fallback ──────────────────────────────

export function DefaultVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>Subsystem Architecture</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ACTIVE
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Cpu className="h-5 w-5 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
        <span className="text-xs font-mono font-bold" style={textSecondaryStyle}>
          Distributed Engine
        </span>
      </div>
      <div className="text-[9px] font-mono" style={textMutedStyle}>
        High-Throughput Operational Reliability
      </div>
    </div>
  );
}

// ─── VisualRegistry: Switch-based Visual Dispatcher ─────────────────────────

export default function VisualRegistry({ visualKey }: { visualKey: string }) {
  const normalizedKey = visualKey ? visualKey.toLowerCase().replace(/visual$/, "") : "";
  switch (normalizedKey) {
    case "chart":
      return <ChartVisual />;
    case "security":
      return <SecurityVisual />;
    case "server":
      return <ServerVisual />;
    case "layout-orchestrator":
    case "layoutorchestrator":
    case "layout":
      return <LayoutOrchestratorVisual />;
    case "block-ast":
    case "blockast":
    case "block":
      return <BlockAstVisual />;
    case "schema-compiler":
    case "schemacompiler":
    case "schema":
      return <SchemaCompilerVisual />;
    default:
      return <DefaultVisual />;
  }
}
