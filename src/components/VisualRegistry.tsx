"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Server,
  Database,
  Activity,
  Lock,
  Cpu,
  Network,
  Radio,
  Share2,
  CheckCircle2,
  ShieldAlert,
  Timer,
  Gamepad2,
  Coins,
  Check,
  Box,
} from "lucide-react";

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

// ─── 7. ServiceMeshVisual: Decoupled Microservices & Regional Partitioning ──

export function ServiceMeshVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>API_GATEWAY // MESH</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          100% ISOLATED
        </span>
      </div>

      <div className="my-0.5 flex items-center justify-between gap-1.5">
        {/* Ingress Edge Gateway */}
        <div
          className="flex flex-col items-center justify-center rounded px-2 py-1 text-center shrink-0 min-w-[68px]"
          style={inactiveSlotStyle}
        >
          <Network className="h-3.5 w-3.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="text-[7px] font-mono font-bold tracking-tight" style={textSecondaryStyle}>
            [EDGE_GATEWAY]
          </span>
          <span className="text-[6px] font-mono" style={{ color: "var(--theme-primary, #10B981)" }}>
            INGRESS :443
          </span>
        </div>

        {/* Animated Connector Splitting Lines */}
        <div className="relative flex-1 h-10 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 50 36" fill="none" preserveAspectRatio="none">
            {/* Top Branch */}
            <path
              d="M 2 18 C 20 18, 25 8, 48 8"
              stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)"
              strokeWidth="1.25"
            />
            <motion.path
              d="M 2 18 C 20 18, 25 8, 48 8"
              stroke="var(--theme-primary, #10B981)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [-20, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
            {/* Bottom Branch */}
            <path
              d="M 2 18 C 20 18, 25 28, 48 28"
              stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)"
              strokeWidth="1.25"
            />
            <motion.path
              d="M 2 18 C 20 18, 25 28, 48 28"
              stroke="var(--theme-primary, #10B981)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [-20, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.7 }}
            />
          </svg>
        </div>

        {/* Isolated Service Boxes */}
        <div className="flex flex-col gap-1 min-w-[105px]">
          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-mono"
            style={inactiveSlotStyle}
          >
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
              <span className="font-bold truncate" style={textSecondaryStyle}>[PUBLIC_FEED_REPLICA]</span>
            </div>
            <span className="text-[6px] font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>RO</span>
          </div>

          <div
            className="flex items-center justify-between rounded px-1.5 py-0.5 text-[7px] font-mono"
            style={activeHighlightStyle}
          >
            <div className="flex items-center gap-1">
              <Lock className="h-2 w-2 shrink-0" />
              <span className="font-bold truncate">[PRIVATE_ADMIN_SUBNET]</span>
            </div>
            <span className="text-[6px] font-bold">AIRGAP</span>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Regional Partitioning</span>
        <span>Zero Shared State</span>
      </div>
    </div>
  );
}

// ─── 8. PubSubStreamVisual: Real-Time Campaign Messaging Pipeline ────────────

export function PubSubStreamVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>REDIS_PUBSUB // WS</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          &lt; 45MS BROADCAST
        </span>
      </div>

      <div className="my-0.5 flex items-center justify-between gap-1 text-[7px] font-mono">
        {/* Event Publisher */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[62px]"
          style={inactiveSlotStyle}
        >
          <Radio className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold tracking-tight truncate max-w-[60px]" style={textSecondaryStyle}>
            [ISSUE_MUTATION]
          </span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>PUB_EVENT</span>
        </div>

        {/* Pulse Connector to Exchange */}
        <div className="relative w-5 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-8, 8] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Central Regional Exchange Hub */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-0.5 text-center shrink-0"
          style={activeHighlightStyle}
        >
          <Share2 className="h-2.5 w-2.5 mb-0.5 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="font-bold text-[6.5px] leading-tight">[REGIONAL_EXCHANGE]</span>
          <span className="text-[5.5px] opacity-80">HUB</span>
        </div>

        {/* Fanout Connectors to 3 Subscribers */}
        <div className="relative flex-1 h-9 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 30 36" fill="none" preserveAspectRatio="none">
            <path d="M 2 18 C 12 18, 16 6, 28 6" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />
            <path d="M 2 18 L 28 18" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />
            <path d="M 2 18 C 12 18, 16 30, 28 30" stroke="color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent)" strokeWidth="1" />

            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 6] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 18] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
            <motion.circle
              r="1.2"
              fill="var(--theme-primary, #10B981)"
              animate={{ cx: [2, 28], cy: [18, 30] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </svg>
        </div>

        {/* 3 Live Subscribers */}
        <div className="flex flex-col gap-0.5 min-w-[56px]">
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>VOTER_1</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>VOTER_2</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
          <div className="flex items-center justify-between rounded px-1 py-0.2 text-[6.5px]" style={inactiveSlotStyle}>
            <span style={textSecondaryStyle}>AGENT_HQ</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Redis Broker Fanout</span>
        <span>Sub-45ms Broadcast</span>
      </div>
    </div>
  );
}

// ─── 9. RlsShieldVisual: Granular RBAC & Region-Confined Security ───────────

export function RlsShieldVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>POSTGRES_RLS // RBAC</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          JURISDICTION LOCKED
        </span>
      </div>

      {/* 2-Row Database Table Preview */}
      <div className="my-0.5 flex flex-col gap-1.5">
        {/* Row 1: Authorized Tenant */}
        <div
          className="flex items-center justify-between rounded px-2 py-1 text-[8px] font-mono"
          style={activeHighlightStyle}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span className="font-bold">REGION_A [AUTHORIZED]</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] font-bold px-1 py-0.2 rounded" style={inactiveSlotStyle}>
              ✓ 200 OK
            </span>
          </div>
        </div>

        {/* Row 2: Blocked by RLS */}
        <div
          className="flex items-center justify-between rounded px-2 py-1 text-[8px] font-mono opacity-65"
          style={{
            ...inactiveSlotStyle,
            borderStyle: "dashed",
          }}
        >
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 shrink-0" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="line-through font-medium" style={textMutedStyle}>
              REGION_B [BLOCKED BY RLS]
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="text-[7px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 12%, transparent)",
                color: "color-mix(in srgb, var(--theme-text, #f8fafc) 65%, transparent)",
              }}
            >
              <ShieldAlert className="h-2.5 w-2.5" />
              0 ROWS
            </span>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Kernel-Level Tenant Policy</span>
        <span>Zero Cross-Ward Leakage</span>
      </div>
    </div>
  );
}

// ─── 10. StateLoopVisual: Real-Time Deterministic Game State Synchronization ─

export function StateLoopVisual() {
  const [turnSeconds, setTurnSeconds] = useState(14.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurnSeconds((prev) => (prev <= 0.2 ? 15.0 : +(prev - 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>SOCKET_IO // GAME_LOOP</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          &lt; 50MS DELTA SYNC
        </span>
      </div>

      {/* Peer 1 -> Authoritative State Engine <- Peer 2 */}
      <div className="my-0.5 flex items-center justify-between gap-1 text-[7.5px] font-mono">
        {/* Peer 1 */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[50px]"
          style={inactiveSlotStyle}
        >
          <Gamepad2 className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold" style={textSecondaryStyle}>PEER_1</span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>&lt;18ms</span>
        </div>

        {/* Pulse Connector Left */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent), var(--theme-primary, #10B981))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [-12, 12, -12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Authoritative State Engine */}
        <div
          className="flex flex-col items-center justify-center rounded px-2 py-1 text-center shrink-0"
          style={activeHighlightStyle}
        >
          <div className="flex items-center gap-1">
            <Timer className="h-2.5 w-2.5 animate-pulse" />
            <span className="font-bold uppercase text-[7.5px]">
              TURN_LOCK: {turnSeconds.toFixed(1)}s
            </span>
          </div>
          <div className="text-[6px] font-mono mt-0.5 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full animate-ping" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
            <span>[AUTHORITATIVE_STATE_ENGINE]</span>
          </div>
          <span className="text-[5.5px] opacity-80 mt-0.5">STATE_VERIFIED // 0x8F2A</span>
        </div>

        {/* Pulse Connector Right */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(to right, var(--theme-primary, #10B981), color-mix(in srgb, var(--theme-text, #f8fafc) 20%, transparent))",
            }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--theme-primary, #10B981)",
              boxShadow: "0 0 6px var(--theme-primary, #10B981)",
            }}
            animate={{ x: [12, -12, 12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Peer 2 */}
        <div
          className="flex flex-col items-center justify-center rounded px-1.5 py-1 text-center shrink-0 min-w-[50px]"
          style={inactiveSlotStyle}
        >
          <Gamepad2 className="h-3 w-3 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
          <span className="font-bold" style={textSecondaryStyle}>PEER_2</span>
          <span className="text-[6px]" style={{ color: "var(--theme-primary, #10B981)" }}>&lt;24ms</span>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Lockstep Sync</span>
        <span>Deterministic Hash Verification</span>
      </div>
    </div>
  );
}

// ─── 11. EscrowLedgerVisual: Manual Wager Selection & KYC Ledger ─────────────

export function EscrowLedgerVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>ATOMIC_WAGER_LEDGER</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          ZERO DOUBLE-SPEND
        </span>
      </div>

      {/* 3-Step Pipeline: WAGER -> KYC -> ESCROW */}
      <div className="my-0.5 space-y-1">
        <div className="flex items-center justify-between gap-1 text-[7.5px] font-mono">
          {/* Step 1 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={inactiveSlotStyle}
          >
            <Coins className="h-2.5 w-2.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold truncate" style={textSecondaryStyle}>[MANUAL_WAGER_LOCK]</span>
          </div>

          <span className="text-[8px]" style={{ color: "var(--theme-primary, #10B981)" }}>→</span>

          {/* Step 2 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={inactiveSlotStyle}
          >
            <ShieldCheck className="h-2.5 w-2.5 mb-0.5" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold truncate" style={textSecondaryStyle}>[UTR_KYC_VERIFIER]</span>
          </div>

          <span className="text-[8px]" style={{ color: "var(--theme-primary, #10B981)" }}>→</span>

          {/* Step 3 */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded px-1 py-0.5 text-center"
            style={activeHighlightStyle}
          >
            <Check className="h-2.5 w-2.5 mb-0.5 stroke-[2.5]" />
            <span className="font-bold truncate">[ESCROW_SETTLED]</span>
          </div>
        </div>

        {/* Row Lock Status Indicator */}
        <div
          className="flex items-center justify-between rounded px-2 py-0.5 text-[7px] font-mono"
          style={inactiveSlotStyle}
        >
          <div className="flex items-center gap-1">
            <Lock className="h-2 w-2" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
              ROW_LOCK: ACQUIRED
            </span>
          </div>
          <span style={textSecondaryStyle}>ISOLATION: SERIALIZABLE</span>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>ACID Transaction Isolation</span>
        <span>Cryptographic Audit Proof</span>
      </div>
    </div>
  );
}

// ─── 12. WebGlPipelineVisual: Three.js / React Three Fiber 3D Experience ──────

export function WebGlPipelineVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-28 w-full overflow-hidden rounded-xl p-2.5 flex flex-col justify-between"
      style={outerContainerStyle}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span style={textSecondaryStyle}>R3F_WEBGL_SHADER</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
          style={activeHighlightStyle}
        >
          LOCKED 60 FPS
        </span>
      </div>

      {/* 3D Wireframe Cube Node + Parallel Thread Bars */}
      <div className="my-0.5 flex items-center gap-2.5">
        {/* Animated Wireframe Cube */}
        <div className="relative h-11 w-11 flex items-center justify-center shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="relative h-8 w-8 rounded border flex items-center justify-center"
            style={{
              borderColor: "var(--theme-primary, #10B981)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 12%, transparent)",
              boxShadow: "0 0 10px color-mix(in srgb, var(--theme-primary, #10B981) 30%, transparent)",
            }}
          >
            <Box className="h-4 w-4 animate-pulse" style={{ color: "var(--theme-primary, #10B981)" }} />
            <span
              className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
            />
            <span
              className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }}
            />
          </motion.div>
        </div>

        {/* Parallel Thread Bars */}
        <div className="flex-1 flex flex-col justify-center gap-1 text-[7.5px] font-mono">
          {/* Thread 1: GPU Shader */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1" style={textSecondaryStyle}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--theme-primary, #10B981)" }} />
                GPU_SHADER_THREAD
              </span>
              <span className="font-bold" style={{ color: "var(--theme-primary, #10B981)" }}>
                [60 FPS]
              </span>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--theme-primary, #10B981)" }}
                animate={{ width: ["96%", "100%", "98%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Thread 2: Main UI */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1" style={textSecondaryStyle}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--theme-text, #f8fafc) 40%, transparent)" }} />
                MAIN_UI_THREAD
              </span>
              <span className="font-medium text-[6.5px]" style={textMutedStyle}>
                [UNBLOCKED &lt; 1.2s]
              </span>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden" style={inactiveSlotStyle}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary, #10B981) 60%, var(--theme-text, #f8fafc))" }}
                animate={{ width: ["16%", "22%", "14%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono flex items-center justify-between" style={textMutedStyle}>
        <span>Off-Thread WebGL Shaders</span>
        <span>Zero Frame Drops (60fps)</span>
      </div>
    </div>
  );
}

// ─── 13. DefaultVisual: Generic System Fallback ─────────────────────────────

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
    case "service-mesh":
    case "servicemesh":
    case "mesh":
      return <ServiceMeshVisual />;
    case "pubsub-stream":
    case "pubsubstream":
    case "pubsub":
    case "stream":
      return <PubSubStreamVisual />;
    case "rls-shield":
    case "rlsshield":
    case "rls":
      return <RlsShieldVisual />;
    case "state-loop":
    case "stateloop":
    case "gameloop":
      return <StateLoopVisual />;
    case "escrow-ledger":
    case "escrowledger":
    case "escrow":
    case "ledger":
      return <EscrowLedgerVisual />;
    case "webgl-pipeline":
    case "webglpipeline":
    case "webgl":
    case "r3f":
      return <WebGlPipelineVisual />;
    default:
      return <DefaultVisual />;
  }
}
