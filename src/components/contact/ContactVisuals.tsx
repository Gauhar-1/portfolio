'use client';

import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Cpu,
  Rocket,
  CheckCircle2,
  Database,
  Layers,
  Code2,
  Gauge,
  FileCheck,
  GitBranch,
  ShieldCheck,
  Star,
  Sparkles,
} from 'lucide-react';
import { ContactVisualType } from '@/constants/contact-intents';

interface ContactVisualsProps {
  visualType: ContactVisualType;
  visualTitle: string;
  rating?: number;
}

export default function ContactVisuals({ visualType, visualTitle, rating = 5 }: ContactVisualsProps) {
  return (
    <div
      className="relative w-full rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden shadow-sm select-none transition-colors duration-700"
      style={{
        background: 'color-mix(in srgb, var(--theme-bg) 92%, var(--theme-text) 8%)',
        borderColor: 'color-mix(in srgb, var(--theme-primary) 32%, transparent)',
        color: 'var(--theme-text)',
      }}
    >
      {/* Background Micro Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--theme-text) 1px, transparent 1px), linear-gradient(to bottom, var(--theme-text) 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* Visual Header Strip */}
      <div
        className="flex items-center justify-between text-[10px] font-mono pb-2 mb-1.5 border-b relative z-10"
        style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)' }}
      >
        <span
          className="font-bold tracking-widest uppercase flex items-center gap-1.5 text-[9.5px] sm:text-[10px] truncate"
          style={{ color: 'var(--theme-primary)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
          {visualType === 'review-scorecard'
            ? `LIVE_PORTFOLIO_TELEMETRY // SCORE: ${(rating || 5).toFixed(1)} / 5.0`
            : visualTitle}
        </span>
        <span
          className="px-1.5 py-0.5 rounded border text-[8.5px] uppercase tracking-wider font-semibold shrink-0"
          style={{
            background: 'color-mix(in srgb, var(--theme-bg) 88%, var(--theme-text) 12%)',
            borderColor: 'color-mix(in srgb, var(--theme-text) 15%, transparent)',
            color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
          }}
        >
          {visualType === 'review-scorecard' ? 'DYNAMIC SCORE' : 'SLA VERIFIED'}
        </span>
      </div>

      {/* Visual Interactive Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden z-10 py-1">
        {visualType === 'interview-pipeline' && <InterviewPipelineVisual />}
        {visualType === 'founding-ownership' && <FoundingOwnershipVisual />}
        {visualType === 'freelance-delivery' && <FreelanceDeliveryVisual />}
        {visualType === 'review-scorecard' && <ReviewScorecardVisual rating={rating} />}
      </div>
    </div>
  );
}

// ─── 1. Interview Pipeline Visual (3-Stage Connected Protocol) ───────────────
function InterviewPipelineVisual() {
  const steps = [
    {
      num: '01',
      title: 'Calendar Handshake',
      spec: '< 4h response • IST / Global overlap',
      status: 'SYNCED',
      icon: CalendarCheck,
    },
    {
      num: '02',
      title: 'Architecture Deep-Dive',
      spec: 'QuickBiteQR / Founderdiary codebase review',
      status: 'VERIFIED',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Immediate Squad Impact',
      spec: 'Zero ramp-up • Ready to ship Day 1',
      status: 'DEPLOY',
      icon: Rocket,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 font-mono text-[9px] sm:text-[10px]">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div
            key={step.num}
            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border relative transition-all"
            style={{
              background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
              borderColor:
                idx === 0
                  ? 'var(--theme-primary)'
                  : 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--theme-primary) 18%, transparent)',
                  color: 'var(--theme-primary)',
                  border: '1px solid color-mix(in srgb, var(--theme-primary) 35%, transparent)',
                }}
              >
                {step.num}
              </span>
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
              <div className="min-w-0">
                <span className="font-bold tracking-tight block truncate text-inherit">
                  {step.title}
                </span>
                <span
                  className="block text-[8px] truncate"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
                >
                  {step.spec}
                </span>
              </div>
            </div>

            <span
              className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider shrink-0 uppercase border"
              style={{
                background: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                color: 'var(--theme-primary)',
              }}
            >
              {step.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 2. Founding Ownership Visual (4 Capability Bars Locked at 100%) ─────────
function FoundingOwnershipVisual() {
  const pillars = [
    {
      title: 'DB & Edge Caching',
      detail: 'Postgres RLS • Redis • MongoDB',
      icon: Database,
    },
    {
      title: 'Backend & AI/RAG',
      detail: 'Next.js API • Hybrid RRF • Streams',
      icon: Layers,
    },
    {
      title: 'UI & Motion HUD',
      detail: 'TypeScript • GSAP • Three.js',
      icon: Code2,
    },
    {
      title: 'Unit Economics',
      detail: 'k6 Stress Tests • 98.9% Margin',
      icon: Gauge,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 font-mono text-[9px]">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <div
            key={pillar.title}
            className="px-2 py-1 rounded-lg border flex flex-col gap-0.5"
            style={{
              background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
              borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3 h-3 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span className="font-bold tracking-tight truncate">{pillar.title}</span>
                <span
                  className="hidden sm:inline text-[8px] truncate"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
                >
                  • {pillar.detail}
                </span>
              </div>
              <span
                className="font-bold text-[8px] tracking-wider shrink-0"
                style={{ color: 'var(--theme-primary)' }}
              >
                100% OWNED
              </span>
            </div>

            {/* Glowing 100% Ownership Progress Bar */}
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{
                background: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 3. Freelance Delivery Visual (3-Phase Milestone Execution) ──────────────
function FreelanceDeliveryVisual() {
  const phases = [
    {
      tag: 'PHASE 1',
      duration: 'DAYS 1–3',
      title: 'System RFC & DB Schema',
      detail: 'Wireframes, API contract & schema sign-off',
      icon: FileCheck,
    },
    {
      tag: 'PHASE 2',
      duration: 'SPRINT LOOP',
      title: 'Iterative Production Deploy',
      detail: 'Continuous delivery with live staging previews',
      icon: GitBranch,
    },
    {
      tag: 'PHASE 3',
      duration: 'HANDOVER',
      title: 'Load Verification & IP Transfer',
      detail: 'k6 load-tested, documentation & full IP grant',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 font-mono text-[9px] sm:text-[10px]">
      {phases.map((phase, idx) => {
        const Icon = phase.icon;
        return (
          <div
            key={phase.tag}
            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border transition-all"
            style={{
              background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
              borderColor:
                idx === 1
                  ? 'var(--theme-primary)'
                  : 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 border"
                style={{
                  background: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--theme-primary) 35%, transparent)',
                  color: 'var(--theme-primary)',
                }}
              >
                {phase.tag}
              </span>
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
              <div className="min-w-0">
                <span className="font-bold tracking-tight block truncate text-inherit">
                  {phase.title}
                </span>
                <span
                  className="block text-[8px] truncate"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
                >
                  {phase.detail}
                </span>
              </div>
            </div>

            <span
              className="text-[8px] font-bold tracking-wider uppercase shrink-0"
              style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
            >
              {phase.duration}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 4. Review Scorecard Visual (Live Reactive Scorecard) ────────────────────
function ReviewScorecardVisual({ rating = 5 }: { rating?: number }) {
  const currentRating = Math.max(1, Math.min(5, rating));

  const pillars = [
    {
      title: 'UI/UX Craftsmanship',
      percent: Math.round((currentRating / 5) * 100),
      status: currentRating >= 4 ? 'EXEMPLARY' : currentRating >= 3 ? 'ROBUST' : 'NEEDS POLISH',
    },
    {
      title: 'Architectural Depth',
      percent: currentRating >= 5 ? 99 : currentRating === 4 ? 85 : currentRating === 3 ? 70 : 45,
      status: currentRating >= 4 ? 'ZERO_DRIFT' : 'EVALUATED',
    },
    {
      title: 'Information Clarity',
      percent: currentRating >= 5 ? 100 : currentRating === 4 ? 90 : currentRating === 3 ? 75 : 55,
      status: currentRating >= 4 ? 'HIGH_SIGNAL' : 'ACCESSIBLE',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 font-mono text-[9px]">
      {/* Top Dynamic Status Banner */}
      <div
        className="px-2 py-1 rounded-md border flex items-center justify-between"
        style={{
          background: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
          borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
        }}
      >
        <span className="flex items-center gap-1 font-bold text-[8.5px]" style={{ color: 'var(--theme-primary)' }}>
          <Sparkles className="w-3 h-3" />
          {currentRating >= 5
            ? 'STATUS: FLAWLESS ARCHITECTURE // S-TIER'
            : currentRating >= 4
            ? 'STATUS: HIGH PRODUCTION GRADE // A-TIER'
            : currentRating >= 3
            ? 'STATUS: SOLID FOUNDATION // B-TIER'
            : currentRating >= 2
            ? 'STATUS: REVISION REQUIRED // C-TIER'
            : 'STATUS: CRITICAL AUDIT // D-TIER'}
        </span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-2.5 h-2.5 ${
                s <= currentRating ? 'fill-current' : 'opacity-25'
              }`}
              style={{ color: 'var(--theme-primary)' }}
            />
          ))}
        </div>
      </div>

      {/* 3 Reactive Audit Pillars */}
      {pillars.map((pillar) => (
        <div
          key={pillar.title}
          className="px-2 py-1 rounded-lg border flex flex-col gap-0.5"
          style={{
            background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
            borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
          }}
        >
          <div className="flex items-center justify-between text-[8.5px]">
            <span className="font-bold tracking-tight">{pillar.title}</span>
            <div className="flex items-center gap-1.5">
              <span
                className="px-1 py-0.2 rounded text-[7.5px] font-bold uppercase"
                style={{
                  background: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                  color: 'var(--theme-primary)',
                }}
              >
                {pillar.status}
              </span>
              <span className="font-bold">{pillar.percent}%</span>
            </div>
          </div>

          {/* Animated Dynamic Progress Bar */}
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{
              background: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
            }}
          >
            <motion.div
              key={currentRating}
              initial={{ width: 0 }}
              animate={{ width: `${pillar.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
