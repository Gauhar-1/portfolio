'use client';

import { ExternalLink, Github, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSessionId } from '@/lib/telemetry';
import {
  setSavedViewState,
  setLandingMap,
} from '@/utils/viewStatePersistence';

export type BorrowedMetric = {
  title: string;
  value: string;
  ariaLabel?: string;
};

export type Experience = {
  _id: string;
  title: string;
  slug: string;
  company: string;
  domainTag?: string;
  employmentType?: string;
  date: string;
  description: string;
  technologies: string[];
  links?: { website?: string; github?: string };
  hasArchitecture?: boolean;
  theme?: {
    primaryHex: string;
    backgroundHex?: string;
    textHex?: string;
  };
  borrowedMetrics?: BorrowedMetric[];
  borrowedChallenges?: string[];
};

// ─── Color & Contrast Utilities ─────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = (hex || '#000000').replace('#', '').trim();
  const full =
    cleaned.length === 3
      ? cleaned.split('').map((c) => c + c).join('')
      : cleaned.substring(0, 6);
  return {
    r: parseInt(full.substring(0, 2), 16) || 0,
    g: parseInt(full.substring(2, 4), 16) || 0,
    b: parseInt(full.substring(4, 6), 16) || 0,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getLuminanceFromHex(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getContrastTextColor(hexColor?: string): string {
  if (!hexColor) return '#0b0b0e';
  const luma = getLuminanceFromHex(hexColor);
  return luma > 125 ? '#0b0b0e' : '#ffffff';
}

function getContrastingSectionBg(cardBg: string, cardPrimary: string): string {
  const luma = getLuminanceFromHex(cardBg);
  const { r: pr, g: pg, b: pb } = hexToRgb(cardPrimary);

  if (luma > 120) {
    return rgbToHex(
      Math.round(6 + pr * 0.05),
      Math.round(7 + pg * 0.05),
      Math.round(10 + pb * 0.05)
    );
  } else {
    return rgbToHex(
      Math.round(2 + pr * 0.08),
      Math.round(2 + pg * 0.08),
      Math.round(4 + pb * 0.08)
    );
  }
}

// ─── Experience Card Component ──────────────────────────────────────────────

interface ExperienceCardProps {
  xp: Experience;
  index: number;
  trackClick: (company: string) => void;
  isActive: boolean;
}

const ExperienceCard = ({ xp, index, trackClick, isActive }: ExperienceCardProps) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const cardPrimary = xp.theme?.primaryHex || '#10B981';
  const cardBg = xp.theme?.backgroundHex || '#0b0b0e';
  const cardText = xp.theme?.textHex || '#ffffff';
  const ctaTextColor = getContrastTextColor(cardPrimary);
  const isLight = getLuminanceFromHex(cardBg) > 120;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const x = Math.max(-5, Math.min(5, normX * 10));
    const y = Math.max(-5, Math.min(5, normY * 10));
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="photo-card relative w-[94vw] sm:w-[86vw] md:w-[76vw] lg:w-[62vw] max-w-4xl backdrop-blur-xl rounded-2xl p-5 sm:p-7 md:p-8 flex flex-col justify-between will-change-transform group overflow-hidden"
      style={
        {
          '--theme-primary': cardPrimary,
          '--theme-bg': cardBg,
          '--theme-text': cardText,
          '--card-theme': 'var(--theme-primary)',
          '--card-bg': 'var(--theme-bg)',
          '--card-text': 'var(--theme-text)',
          backgroundColor: isLight
            ? 'color-mix(in srgb, var(--card-bg) 95%, var(--card-text) 5%)'
            : 'color-mix(in srgb, var(--card-bg) 84%, var(--card-text) 16%)',
          border: isLight
            ? '1px solid color-mix(in srgb, var(--card-text) 22%, transparent)'
            : '1px solid color-mix(in srgb, var(--card-theme) 40%, var(--card-text) 20%)',
          boxShadow: isLight
            ? '0 30px 80px -15px rgba(0, 0, 0, 0.45), 0 0 25px -5px color-mix(in srgb, var(--card-theme) 25%, transparent)'
            : '0 30px 80px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px color-mix(in srgb, var(--card-theme) 20%, transparent)',
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Double Machined Chamfer Inner Border */}
      <div
        aria-hidden="true"
        className="absolute inset-[1px] pointer-events-none rounded-[15px]"
        style={{
          border: '1px solid color-mix(in srgb, var(--card-text) 8%, transparent)',
        }}
      />

      {/* Top Radial Ambient Spotlight inside the card (18% opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(600px circle at 50% 0%, color-mix(in srgb, var(--card-theme) 18%, transparent), transparent 70%)',
        }}
      />

      {/* Micro-Interaction Tilt/Shift Wrapper */}
      <div
        className="relative z-10 flex-1 w-full flex flex-col justify-between gap-4 will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) rotateX(${
            -mouseOffset.y * 0.3
          }deg) rotateY(${mouseOffset.x * 0.3}deg)`,
          transition:
            mouseOffset.x === 0 && mouseOffset.y === 0
              ? 'transform 0.4s ease-out'
              : 'transform 0.1s ease-out',
        }}
      >
        {/* ── Layer 1: Header Row ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-4"
          style={{
            borderBottom: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
          }}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight"
              style={{ color: 'var(--card-text)' }}
            >
              {xp.company}
            </span>
            {xp.employmentType && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 20%)',
                  border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
                  color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))',
                }}
              >
                {xp.employmentType}
              </span>
            )}
            <span
              className="font-mono text-xs tracking-wider"
              style={{ color: 'color-mix(in srgb, var(--card-text) 55%, var(--card-bg))' }}
            >
              • {xp.date}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wide"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card-theme) 14%, var(--card-bg))',
                border: '1px solid color-mix(in srgb, var(--card-theme) 45%, transparent)',
                color: 'var(--card-theme)',
                boxShadow: '0 0 12px color-mix(in srgb, var(--card-theme) 18%, transparent)',
              }}
            >
              {xp.domainTag || 'Systems & Full-Stack Architecture'}
            </span>
          </div>
        </div>

        {/* ── Layer 2: Role & Executive Thesis ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h3
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
              style={{ color: 'var(--card-text)' }}
            >
              {xp.title}
            </h3>
            <span
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs shrink-0"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 20%)',
                border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                color: 'color-mix(in srgb, var(--card-text) 60%, var(--card-bg))',
              }}
            >
              0{index + 1}
            </span>
          </div>
          <p
            className="text-sm sm:text-base leading-relaxed line-clamp-2 md:line-clamp-3 font-normal"
            style={{ color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))' }}
          >
            {xp.description}
          </p>
        </div>

        {/* ── Layer 3: Borrowed 3-Pillar Impact Strip ── */}
        {xp.borrowedMetrics && xp.borrowedMetrics.length > 0 && (
          <div
            className="p-3.5 sm:p-4 rounded-xl backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
              border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
            }}
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {xp.borrowedMetrics.slice(0, 3).map((metric, mIdx) => (
                <div
                  key={mIdx}
                  className={mIdx > 0 ? 'pl-2.5 sm:pl-4' : ''}
                  style={{
                    borderLeft:
                      mIdx > 0
                        ? '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)'
                        : 'none',
                  }}
                >
                  <div
                    className="text-lg sm:text-2xl md:text-3xl font-black tabular-nums tracking-tight"
                    style={{ color: 'var(--card-theme)' }}
                  >
                    {metric.value}
                  </div>
                  <div
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-0.5 truncate font-medium"
                    style={{
                      color: 'color-mix(in srgb, var(--card-text) 55%, var(--card-bg))',
                    }}
                  >
                    {metric.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Layer 4: Borrowed Curiosity Teaser & Action Dock ── */}
        <div
          className="pt-3 space-y-3.5"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
          }}
        >
          {xp.borrowedChallenges && xp.borrowedChallenges.length > 0 && (
            <div
              className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-lg overflow-hidden"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 12%)',
                border: '1px solid color-mix(in srgb, var(--card-text) 14%, transparent)',
              }}
            >
              <span className="font-semibold shrink-0" style={{ color: 'var(--card-theme)' }}>
                Architecture Deep Dive:
              </span>
              <span
                className="truncate font-medium"
                style={{ color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))' }}
              >
                {xp.borrowedChallenges.join(' • ')}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Technologies Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {xp.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-md font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 12%)',
                    border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
                    color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))',
                  }}
                >
                  {tech}
                </span>
              ))}
              {xp.technologies.length > 5 && (
                <span
                  className="px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-medium"
                  style={{
                    color: 'color-mix(in srgb, var(--card-text) 45%, var(--card-bg))',
                  }}
                >
                  +{xp.technologies.length - 5} MORE
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 justify-end">
              <a
                href={`/architecture/${xp.slug}`}
                onClick={() => {
                  trackClick(xp.company);
                  setLandingMap({
                    section: 'experience',
                    sectionIndex: 1,
                    experienceIndex: index,
                  });
                  setSavedViewState({
                    sectionIndex: 1,
                    experienceIndex: index,
                  });
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--card-theme)',
                  color: ctaTextColor,
                  boxShadow:
                    '0 8px 25px -4px color-mix(in srgb, var(--card-theme) 40%, transparent)',
                }}
              >
                Explore Architecture
                <ArrowRight className="w-4 h-4" />
              </a>
              {xp.links?.website && (
                <a
                  href={xp.links.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
                    border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                    color: 'var(--card-text)',
                  }}
                  aria-label="Website Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {xp.links?.github && (
                <a
                  href={xp.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
                    border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                    color: 'var(--card-text)',
                  }}
                  aria-label="GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Experience Section Component (Pure 100dvh Deck, Zero Pin Spacers) ──

export interface ExperienceSectionProps {
  experiences?: Experience[];
  initialExperiences?: Experience[];
  activeCardIndex?: number;
  onCardIndexChange?: (newIndex: number) => void;
  ref?: React.Ref<HTMLElement>;
}

export default function ExperienceSection({
  experiences = [],
  initialExperiences = [],
  activeCardIndex,
  onCardIndexChange,
  ref,
}: ExperienceSectionProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const cards = experiences.length > 0 ? experiences : initialExperiences;
  const activeIndex =
    typeof activeCardIndex === 'number'
      ? Math.max(0, Math.min(cards.length - 1, activeCardIndex))
      : internalIndex;

  const handleCardIndexChange = (newIndex: number) => {
    if (onCardIndexChange) {
      onCardIndexChange(newIndex);
    } else {
      setInternalIndex(newIndex);
    }
  };

  const trackClick = (company: string) => {
    const sessionId = getSessionId();
    if (sessionId) {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: 10,
          action: `Clicked Experience Deep Dive: ${company}`,
        }),
      }).catch(console.error);
    }
  };

  // Active Environmental Colors calculated deterministically from activeCardIndex
  const activeTheme = useMemo(() => {
    const activeXp = cards[activeIndex];
    const primary = activeXp?.theme?.primaryHex || '#10B981';
    const cardBg = activeXp?.theme?.backgroundHex || '#0a0a0c';
    const text = activeXp?.theme?.textHex || '#ffffff';
    const sectionBg = getContrastingSectionBg(cardBg, primary);
    return { primary, cardBg, text, sectionBg };
  }, [cards, activeIndex]);

  return (
    <section
      ref={ref}
      id="experience"
      aria-label="Tactical Experience Architecture Deck"
      className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full overflow-hidden relative flex flex-col justify-between font-sans select-none transition-colors duration-700"
      style={
        {
          backgroundColor: activeTheme.sectionBg,
          color: activeTheme.text,
          '--env-primary': activeTheme.primary,
          '--env-bg': activeTheme.sectionBg,
          '--env-text': activeTheme.text,
          '--theme-primary': 'var(--env-primary)',
          '--theme-bg': 'var(--env-bg)',
          '--theme-text': 'var(--env-text)',
        } as React.CSSProperties
      }
    >
      {cards.length === 0 ? (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center font-mono text-sm tracking-widest px-4 text-center"
          style={{
            backgroundColor: activeTheme.sectionBg,
            color: 'color-mix(in srgb, var(--env-text, #ffffff) 65%, var(--env-bg, #0a0a0c))',
          }}
        >
          <Layers className="w-8 h-8 mb-4 animate-pulse" style={{ color: 'var(--env-primary, #10B981)' }} />
          Initializing Engineering Architecture...
        </div>
      ) : (
        <>
          {/* Subtle smooth ambient radial background wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(85% 65% at 50% 50%, color-mix(in srgb, var(--env-primary, #10B981) 12%, transparent), transparent 80%)',
            }}
          />

          {/* Dynamic Ambient Center Orb that morphs with var(--env-primary) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-700"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--env-primary, #10B981) 22%, transparent), transparent 70%)',
            }}
          />

          {/* Top HUD Row: Telemetry Pill & Interactive Card Stack Indicators */}
          <div className="relative z-30 pt-6 sm:pt-8 px-6 sm:px-12 flex items-center justify-between">
            {/* Top-left Telemetry Pill */}
            <div
              className="px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2.5 text-xs font-mono tracking-widest uppercase shadow-lg"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--env-primary, #10B981) 14%, var(--env-bg, #08090c))',
                border:
                  '1px solid color-mix(in srgb, var(--env-primary, #10B981) 45%, transparent)',
                color: 'var(--env-primary, #10B981)',
                boxShadow:
                  '0 0 20px color-mix(in srgb, var(--env-primary, #10B981) 16%, transparent)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold tracking-wider">Career_Gallery // Telemetry</span>
            </div>

            {/* Interactive Card Step Indicators (Click to Jump Directly) */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
              {cards.map((_, i) => {
                const isSelected = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCardIndexChange(i)}
                    className="px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--env-primary, #10B981)'
                        : 'transparent',
                      color: isSelected
                        ? getContrastTextColor(activeTheme.primary)
                        : 'rgba(255, 255, 255, 0.45)',
                      boxShadow: isSelected
                        ? '0 0 15px color-mix(in srgb, var(--env-primary) 35%, transparent)'
                        : 'none',
                    }}
                    title={`Jump to Architecture Card 0${i + 1}`}
                  >
                    0{i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Stacked Cards Stage (Deterministic Index-Driven GSAP/Framer Deck) */}
          <div className="relative flex-1 w-full flex items-center justify-center z-20 perspective-[1000px] my-auto">
            {cards.map((xp, i) => {
              const isPassed = i < activeIndex;
              const isActive = i === activeIndex;
              const diff = i - activeIndex;

              const yPercent = isPassed ? -115 : isActive ? 0 : diff * 6;
              const scale = isPassed ? 0.92 : isActive ? 1 : Math.max(0.7, 1 - diff * 0.04);
              const opacity = isPassed ? 0 : isActive ? 1 : Math.max(0, 1 - diff * 0.35);
              const zIndex = isActive ? 30 : isPassed ? 10 : 30 - diff;

              return (
                <motion.div
                  key={xp._id || i}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex }}
                  initial={false}
                  animate={{
                    y: `${yPercent}%`,
                    scale,
                    opacity,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1], // Expo-out curve
                  }}
                >
                  <div
                    className="will-change-transform"
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    <ExperienceCard
                      xp={xp}
                      index={i}
                      trackClick={trackClick}
                      isActive={isActive}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Dynamic Scroll Cue */}
          <div
            className="relative z-30 pb-6 sm:pb-8 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-widest pointer-events-none"
            style={{
              color: 'color-mix(in srgb, var(--env-text, #ffffff) 50%, var(--env-bg, #08090c))',
            }}
          >
            <div
              className="w-[1px] h-8 sm:h-10"
              style={{
                background:
                  'linear-gradient(to bottom, var(--env-primary, #10B981), transparent)',
              }}
            />
            <span className="tracking-widest">
              {activeIndex < cards.length - 1
                ? `Scroll for Next Card [0${activeIndex + 2} / 0${cards.length}]`
                : 'Scroll down to Project Arsenal'}
            </span>
          </div>
        </>
      )}
    </section>
  );
}