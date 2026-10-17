'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Globe,
  Radio,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { getSessionId } from '@/lib/telemetry';
import {
  getSavedViewState,
  setSavedViewState,
  getLandingMap,
  setLandingMap,
} from '@/utils/viewStatePersistence';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface ProjectTheme {
  primaryHex: string;
  backgroundHex: string;
  textHex: string;
}

export interface BorrowedMetric {
  title: string;
  value: string;
  ariaLabel?: string;
}

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  category: 'AI_RAG' | 'SYSTEMS_ENGINES' | 'FULLSTACK_SAAS';
  featuredOrder?: number;
  tagline: string;
  overview: string;
  technologies: string[];
  imageUrl: string;
  videoUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
  hasArchitecture?: boolean;
  theme: ProjectTheme;
  borrowedMetrics: BorrowedMetric[];
  borrowedChallenges: string[];
}

type IntentCategory = 'ALL' | 'AI_RAG' | 'SYSTEMS_ENGINES' | 'FULLSTACK_SAAS';

interface FilterPill {
  id: IntentCategory;
  label: string;
}

const FILTER_PILLS: FilterPill[] = [
  { id: 'ALL', label: 'ALL SYSTEMS' },
  { id: 'AI_RAG', label: 'AI & RAG' },
  { id: 'SYSTEMS_ENGINES', label: 'SYSTEMS & MEDIA' },
  { id: 'FULLSTACK_SAAS', label: 'FULL-STACK SAAS' },
];

const CATEGORY_NAMES: Record<string, string> = {
  AI_RAG: 'AI & RAG ENGINE',
  SYSTEMS_ENGINES: 'SYSTEMS & ENGINE',
  FULLSTACK_SAAS: 'FULL-STACK SAAS',
};

// ─── Component Props ────────────────────────────────────────────────────────
export interface ProjectsSectionProps {
  initialProjects?: ProjectItem[];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProjectsSection({ initialProjects = [] }: ProjectsSectionProps) {
  // Restore semantic landing map or saved view state if available from previous navigation
  const landingMap = useMemo(() => getLandingMap(), []);
  const savedState = useMemo(() => getSavedViewState(), []);

  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<IntentCategory>(
    (landingMap?.projectCategory as IntentCategory) ||
    (savedState?.projectCategory as IntentCategory) ||
    'ALL'
  );
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    const targetSlug = landingMap?.projectSlug || savedState?.projectSlug;
    if (targetSlug) {
      if (
        initialProjects.length === 0 ||
        initialProjects.some((p) => (p.slug || p._id) === targetSlug)
      ) {
        return targetSlug;
      }
    }
    return initialProjects[0]?.slug || initialProjects[0]?._id || '';
  });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Complete Background Scroll Lock Lifecycle for Lightbox Modal
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.dataset.modalOpen = 'true';
    } else {
      document.body.style.overflow = '';
      delete document.documentElement.dataset.modalOpen;
      setZoomLevel(1);
    }
    return () => {
      document.body.style.overflow = '';
      delete document.documentElement.dataset.modalOpen;
      setZoomLevel(1);
    };
  }, [isLightboxOpen]);

  // Sync state when initialProjects updates
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
      setSelectedSlug((prev) => {
        if (prev && initialProjects.some((p) => (p.slug || p._id) === prev)) return prev;
        if (
          savedState?.projectSlug &&
          initialProjects.some((p) => (p.slug || p._id) === savedState.projectSlug)
        ) {
          return savedState.projectSlug;
        }
        return initialProjects[0]?.slug || initialProjects[0]?._id || '';
      });
    }
  }, [initialProjects, savedState]);

  // Telemetry click tracker
  const trackClick = useCallback((targetName: string, meta?: string) => {
    const sessionId = getSessionId();
    if (sessionId) {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: 5,
          action: `[Projects] ${targetName}${meta ? ` (${meta})` : ''}`,
        }),
      }).catch(console.error);
    }
  }, []);

  // Fetch projects from MongoDB API if not hydrated from bootloader
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) return;
    let isMounted = true;
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProjects(data);
            setSelectedSlug(data[0].slug || data[0]._id);
          }
        }
      } catch (err) {
        console.error('[Projects] Hydration error:', err);
      }
    }
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, [initialProjects]);

  // Filter projects by recruiter intent
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // When category changes, auto-select the first project in that category
  const handleSelectCategory = (cat: IntentCategory) => {
    setSelectedCategory(cat);
    const matches = cat === 'ALL' ? projects : projects.filter((p) => p.category === cat);
    if (matches.length > 0) {
      const first = matches[0];
      const nextSlug = first.slug || first._id;
      setSelectedSlug(nextSlug);
      trackClick(first.title, `Filter: ${cat}`);
      setSavedViewState({ projectCategory: cat, projectSlug: nextSlug });
    } else {
      setSavedViewState({ projectCategory: cat });
    }
  };

  // Active selected project
  const selectedProject = useMemo(() => {
    const found = filteredProjects.find((p) => (p.slug || p._id) === selectedSlug);
    if (found) return found;
    return filteredProjects[0] || projects[0] || null;
  }, [filteredProjects, selectedSlug, projects]);

  // Current index in filtered list
  const currentIndex = useMemo(() => {
    const idx = filteredProjects.findIndex(
      (p) => (p.slug || p._id) === (selectedProject?.slug || selectedProject?._id)
    );
    return idx >= 0 ? idx : 0;
  }, [filteredProjects, selectedProject]);

  // Next / Prev navigation
  const handlePrevProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    const prev = filteredProjects[prevIdx];
    const nextSlug = prev.slug || prev._id;
    setSelectedSlug(nextSlug);
    trackClick(prev.title, 'Navigated Prev');
    setSavedViewState({ projectSlug: nextSlug, projectCategory: selectedCategory });
  }, [currentIndex, filteredProjects, trackClick, selectedCategory]);

  const handleNextProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredProjects.length;
    const next = filteredProjects[nextIdx];
    const nextSlug = next.slug || next._id;
    setSelectedSlug(nextSlug);
    trackClick(next.title, 'Navigated Next');
    setSavedViewState({ projectSlug: nextSlug, projectCategory: selectedCategory });
  }, [currentIndex, filteredProjects, trackClick, selectedCategory]);

  // Keyboard arrow navigation & Escape for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsLightboxOpen(false);
          setZoomLevel(1);
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleZoomReset();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevProject();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevProject, handleNextProject, isLightboxOpen]);

  return (
    <section
      id="projects"
      style={
        {
          '--theme-primary': selectedProject?.theme?.primaryHex || '#10b981',
          '--theme-bg': selectedProject?.theme?.backgroundHex || '#0a0a0c',
          '--theme-text': selectedProject?.theme?.textHex || '#f8fafc',
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          transition: 'background-color 700ms ease, color 700ms ease',
        } as React.CSSProperties
      }
      className="relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full overflow-hidden px-4 md:px-10 lg:px-16 py-3.5 md:py-5 flex flex-col justify-between transition-colors duration-700 select-none"
    >
      {/* Dynamic Ambient Chameleon Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 75% 30%, color-mix(in srgb, var(--theme-primary) 20%, transparent) 0%, transparent 60%), radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--theme-primary) 12%, transparent) 0%, transparent 55%)`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--theme-text) 1px, transparent 1px), linear-gradient(to bottom, var(--theme-text) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Zone 1: Top Header & Intent Filter Bar (shrink-0)                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b relative z-10"
        style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)' }}
      >
        {/* Left: Compact Tactical Title */}
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
              color: 'var(--theme-primary)',
            }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PROJECT_ARSENAL // R&D SYSTEMS</span>
          </div>
          <span
            className="hidden md:inline font-mono text-[11px]"
            style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
          >
            [{filteredProjects.length} SYSTEMS DEPLOYED]
          </span>
        </div>

        {/* Right: The 4 Recruiter Intent Filter Tabs (Zero Scrollbars) */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTER_PILLS.map((pill) => {
            const isActive = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => handleSelectCategory(pill.id)}
                className="px-3 py-1.5 rounded-full font-mono text-[10px] md:text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0"
                style={{
                  background: isActive
                    ? 'color-mix(in srgb, var(--theme-primary) 18%, var(--theme-bg) 82%)'
                    : 'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 8%)',
                  borderColor: isActive
                    ? 'var(--theme-primary)'
                    : 'color-mix(in srgb, var(--theme-text) 15%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: isActive
                    ? 'var(--theme-primary)'
                    : 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
                  boxShadow: isActive
                    ? '0 0 16px color-mix(in srgb, var(--theme-primary) 25%, transparent)'
                    : 'none',
                }}
              >
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  />
                )}
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Zone 2: The Locked Center Stage (flex-1 min-h-0 Side-by-Side Card)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 my-1.5 md:my-2 relative z-10">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key={selectedProject.slug || selectedProject._id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="h-full w-full rounded-2xl border overflow-hidden flex flex-col lg:grid lg:grid-cols-12 shadow-2xl"
              style={{
                background: 'color-mix(in srgb, var(--theme-bg) 88%, var(--theme-text) 8%)',
                borderColor: 'color-mix(in srgb, var(--theme-primary) 35%, transparent)',
                boxShadow:
                  '0 20px 50px color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              }}
            >
              {/* ── Left Half: The Engineering Brief (lg:col-span-6) ────────── */}
              <div className="flex-1 min-h-0 lg:h-full lg:col-span-6 p-3.5 sm:p-5 md:p-6 lg:p-6 flex flex-col justify-between overflow-hidden">
                {/* Content Group (Tight Vertical Rhythm, Zero Dead Gaps) */}
                <div className="space-y-2.5 sm:space-y-3">
                  {/* 1. Top Meta & Title */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                          style={{
                            background:
                              'color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text) 10%)',
                            borderColor:
                              'color-mix(in srgb, var(--theme-text) 15%, transparent)',
                            color: 'var(--theme-primary)',
                          }}
                        >
                          {String(currentIndex + 1).padStart(2, '0')} /{' '}
                          {String(filteredProjects.length).padStart(2, '0')}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border font-bold"
                          style={{
                            background:
                              'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                            borderColor:
                              'color-mix(in srgb, var(--theme-primary) 40%, transparent)',
                            color: 'var(--theme-primary)',
                          }}
                        >
                          {CATEGORY_NAMES[selectedProject.category] || selectedProject.category}
                        </span>
                      </div>

                      {selectedProject.hasArchitecture && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          BLUEPRINT_CONNECTED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mt-1.5 truncate">
                      {selectedProject.title}
                    </h3>

                    <p
                      className="mt-0.5 font-mono text-xs md:text-sm font-semibold line-clamp-1"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      {selectedProject.tagline}
                    </p>
                  </div>

                  {/* 2. Expanded Overview (line-clamp-4 for full 2-sentence clarity) */}
                  <p
                    className="font-mono text-xs sm:text-[13px] leading-relaxed line-clamp-3 lg:line-clamp-4"
                    style={{ color: 'color-mix(in srgb, var(--theme-text) 82%, transparent)' }}
                  >
                    {selectedProject.overview}
                  </p>

                  {/* 3. 3-Pillar Borrowed Metric Strip */}
                  {selectedProject.borrowedMetrics &&
                    selectedProject.borrowedMetrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 md:gap-2.5">
                        {selectedProject.borrowedMetrics.slice(0, 3).map((metric, idx) => (
                          <div
                            key={idx}
                            className="p-2 md:p-2.5 rounded-xl border backdrop-blur-sm flex flex-col justify-center shadow-sm overflow-hidden"
                            style={{
                              background:
                                'color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text) 8%)',
                              borderColor:
                                'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                            }}
                          >
                            <span
                              className="font-mono text-xs sm:text-sm md:text-base font-black tracking-tight truncate"
                              style={{ color: 'var(--theme-primary)' }}
                            >
                              {metric.value}
                            </span>
                            <span
                              className="font-mono text-[9px] md:text-[10px] uppercase tracking-wider truncate mt-0.5"
                              style={{
                                color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)',
                              }}
                            >
                              {metric.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* 4. Vertically Stacked Architecture Blueprint Modules */}
                  {selectedProject.borrowedChallenges &&
                    selectedProject.borrowedChallenges.length > 0 && (
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase font-semibold">
                          <span
                            style={{
                              color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                            }}
                          >
                            // ARCHITECTURE BLUEPRINT MODULES
                          </span>
                          <span
                            className="px-1.5 py-0.5 rounded text-[8.5px] font-mono border"
                            style={{
                              background:
                                'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                              borderColor:
                                'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                              color: 'var(--theme-primary)',
                            }}
                          >
                            3 SPEC MODULES
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {selectedProject.borrowedChallenges.slice(0, 3).map((challenge, cIdx) => (
                            <div
                              key={cIdx}
                              className="px-2.5 py-1.5 rounded-lg border font-mono text-xs flex items-center justify-between gap-2 transition-all hover:translate-x-0.5"
                              style={{
                                background:
                                  'color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text) 8%)',
                                borderColor:
                                  'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                              }}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="text-[10px] font-bold shrink-0"
                                  style={{ color: 'var(--theme-primary)' }}
                                >
                                  [{String(cIdx + 1).padStart(2, '0')}]
                                </span>
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: 'var(--theme-primary)' }}
                                />
                                <span className="truncate font-medium text-[11px] sm:text-xs">
                                  {challenge}
                                </span>
                              </div>

                              <span
                                className="text-[9.5px] shrink-0 font-mono opacity-60 hidden sm:inline"
                                style={{
                                  color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)',
                                }}
                              >
                                VERIFIED
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* 5. Bottom Action Dock */}
                <div
                  className="pt-2.5 mt-2 flex items-center justify-between gap-2 border-t"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/architecture/${selectedProject.slug}`}
                      onClick={() => {
                        trackClick(selectedProject.title, 'CTA Explore Architecture');
                        setLandingMap({
                          section: 'projects',
                          sectionIndex: 2,
                          projectSlug: selectedProject.slug || selectedProject._id,
                          projectIndex: currentIndex,
                          projectCategory: selectedCategory,
                        });
                        setSavedViewState({
                          sectionIndex: 2,
                          projectCategory: selectedCategory,
                          projectSlug: selectedProject.slug || selectedProject._id,
                        });
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 md:px-5 py-2.5 rounded-lg font-mono text-xs md:text-sm font-black tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] shadow-xl group/btn shrink-0"
                      style={{
                        backgroundColor: 'var(--theme-primary)',
                        color: 'var(--theme-bg)',
                        boxShadow:
                          '0 0 20px color-mix(in srgb, var(--theme-primary) 35%, transparent)',
                      }}
                    >
                      <span>Explore Architecture</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>

                    {selectedProject.links?.website && (
                      <a
                        href={selectedProject.links.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackClick(selectedProject.title, 'Live Demo')}
                        title="Live Demo"
                        className="p-2.5 rounded-lg border transition-colors hover:border-current flex items-center justify-center shrink-0 cursor-pointer"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
                          borderColor:
                            'color-mix(in srgb, var(--theme-text) 20%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}

                    {selectedProject.links?.github && (
                      <a
                        href={selectedProject.links.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackClick(selectedProject.title, 'GitHub')}
                        title="Source Code"
                        className="p-2.5 rounded-lg border transition-colors hover:border-current flex items-center justify-center shrink-0 cursor-pointer"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
                          borderColor:
                            'color-mix(in srgb, var(--theme-text) 20%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Prev / Next Quick Arrow Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevProject}
                      aria-label="Previous Project (ArrowLeft)"
                      title="Previous Project (ArrowLeft)"
                      className="p-2 rounded-lg border transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        background:
                          'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
                        borderColor:
                          'color-mix(in srgb, var(--theme-text) 20%, transparent)',
                        color: 'var(--theme-text)',
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextProject}
                      aria-label="Next Project (ArrowRight)"
                      title="Next Project (ArrowRight)"
                      className="p-2 rounded-lg border transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        background:
                          'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
                        borderColor:
                          'color-mix(in srgb, var(--theme-text) 20%, transparent)',
                        color: 'var(--theme-text)',
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right Half: The Visual Viewport (lg:col-span-6) ─────────── */}
              <div
                className="h-44 sm:h-52 lg:h-full lg:col-span-6 shrink-0 relative overflow-hidden bg-black/60 border-t lg:border-t-0 lg:border-l flex flex-col"
                style={{
                  borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                }}
              >
                {/* HUD Header Bar with Interactive VIEW FULL SCREEN Button */}
                <div
                  className="h-7 md:h-8 px-3 shrink-0 flex items-center justify-between border-b backdrop-blur-md z-20"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-bg) 75%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <span className="font-mono text-[10px] opacity-70 ml-1 truncate">
                      system://{selectedProject.slug}.architecture
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Full Screen Trigger in HUD Header */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLightboxOpen(true);
                        trackClick(selectedProject.title, 'Open Lightbox Header');
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        background:
                          'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                        borderColor:
                          'color-mix(in srgb, var(--theme-primary) 35%, transparent)',
                        color: 'var(--theme-primary)',
                      }}
                      title="View Full-Screen Uncropped Image"
                    >
                      <Maximize2 className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">VIEW FULL SCREEN</span>
                    </button>

                    <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Media Content (Clickable Zoom Target) */}
                <div
                  onClick={() => {
                    setIsLightboxOpen(true);
                    trackClick(selectedProject.title, 'Open Lightbox Image Click');
                  }}
                  className="relative flex-1 w-full h-full cursor-zoom-in group/img overflow-hidden"
                >
                  {/* Floating Hover Pill on Image */}
                  <div
                    className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-lg border font-mono text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg opacity-0 group-hover/img:opacity-100 transition-all duration-200 backdrop-blur-md"
                    style={{
                      background:
                        'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                      borderColor:
                        'color-mix(in srgb, var(--theme-primary) 50%, transparent)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    <Maximize2 className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
                    <span>VIEW FULL IMAGE</span>
                  </div>

                  {selectedProject.videoUrl ? (
                    selectedProject.videoUrl.includes('youtube') ||
                      selectedProject.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={selectedProject.videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video
                        src={selectedProject.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <Image
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      fill
                      priority
                      className="object-cover object-top filter contrast-110 transition-transform duration-500 group-hover/img:scale-[1.02]"
                    />
                  )}

                  {/* Gradient Vignette into var(--theme-bg) */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, var(--theme-bg) 0%, transparent 40%), linear-gradient(to bottom, var(--theme-bg) 0%, transparent 15%)',
                    }}
                  />

                  {/* Floating Tech Badges at Bottom */}
                  {selectedProject.technologies &&
                    selectedProject.technologies.length > 0 && (
                      <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 flex flex-wrap gap-1 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/85 to-transparent pt-6 pointer-events-none">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md"
                            style={{
                              background:
                                'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 10%)',
                              borderColor:
                                'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                              color: 'color-mix(in srgb, var(--theme-text) 85%, transparent)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full w-full rounded-2xl border border-white/10 bg-black/40 flex flex-col items-center justify-center font-mono text-xs text-white/50 tracking-wider">
              <Radio className="w-8 h-8 mb-3 text-emerald-400 animate-pulse" />
              <span>[ NO SYSTEMS LOADED // AWAITING TELEMETRY ]</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Zone 3: Bottom Quick-Switch Dock (Zero Horizontal Scrollbar)         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 relative z-10">
        {filteredProjects.map((project, idx) => {
          const isSelected =
            (project.slug || project._id) ===
            (selectedProject?.slug || selectedProject?._id);
          const indexStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={project.slug || project._id}
              onClick={() => {
                const nextSlug = project.slug || project._id;
                setSelectedSlug(nextSlug);
                trackClick(project.title, 'Selected Dock Tab');
                setSavedViewState({ projectSlug: nextSlug, projectCategory: selectedCategory });
              }}
              className="group relative min-w-[190px] md:min-w-[230px] px-3.5 md:px-4 py-1.5 md:py-2 rounded-xl border cursor-pointer transition-all duration-300 text-left shrink-0"
              style={{
                background: isSelected
                  ? 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 10%)'
                  : 'color-mix(in srgb, var(--theme-bg) 95%, var(--theme-text) 5%)',
                borderColor: isSelected
                  ? 'color-mix(in srgb, var(--theme-primary) 60%, transparent)'
                  : 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                boxShadow: isSelected
                  ? '0 0 20px color-mix(in srgb, var(--theme-primary) 20%, transparent)'
                  : 'none',
              }}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--theme-primary)'
                        : 'color-mix(in srgb, var(--theme-text) 30%, transparent)',
                    }}
                  />
                  <span
                    className="font-mono text-xs font-bold"
                    style={{
                      color: isSelected
                        ? 'var(--theme-primary)'
                        : 'color-mix(in srgb, var(--theme-text) 45%, transparent)',
                    }}
                  >
                    {indexStr}
                  </span>
                  <span className="font-bold text-xs md:text-sm tracking-tight truncate max-w-[110px] md:max-w-[130px]">
                    {project.title}
                  </span>
                </div>

                <span
                  className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 opacity-70"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                  }}
                >
                  {project.category === 'AI_RAG'
                    ? 'AI'
                    : project.category === 'SYSTEMS_ENGINES'
                      ? 'SYS'
                      : 'SAAS'}
                </span>
              </div>

              <p
                className="mt-0.5 text-[10.5px] font-mono truncate opacity-70"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
              >
                {project.tagline}
              </p>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Fixed-Aspect MacBook Pro Studio Display Lightbox Modal                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isLightboxOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsLightboxOpen(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 select-none"
          >
            {/* Fixed-Dimension MacBook Display Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[94vw] max-w-[1240px] aspect-[16/10] max-h-[85dvh] flex flex-col rounded-[20px] md:rounded-[26px] p-[6px] md:p-[10px] bg-gradient-to-b from-[#27272A] via-[#18181B] to-[#09090B] shadow-[0_25px_100px_rgba(0,0,0,0.95)] border border-white/15 overflow-hidden"
            >
              {/* Inner Screen Bezel */}
              <div className="flex-1 flex flex-col w-full h-full bg-[#000000] rounded-[14px] md:rounded-[18px] overflow-hidden border border-white/5 relative">
                {/* Top macOS Menu Bar */}
                <div className="h-9 md:h-10 px-4 bg-[#0B0B0E] border-b border-white/10 flex items-center justify-between shrink-0 select-none relative">
                  {/* Left (Traffic Lights) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(false)}
                      className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group/dot transition-transform hover:scale-110 cursor-pointer"
                      aria-label="Close modal"
                      title="Close [Esc]"
                    >
                      <span className="text-[8px] font-bold text-black opacity-0 group-hover/dot:opacity-100 transition-opacity leading-none">
                        ✕
                      </span>
                    </button>
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                  </div>

                  {/* Center (MacBook Notch & Title) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-black px-5 py-1 rounded-b-xl border-x border-b border-white/10 flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                    <span className="font-mono text-[11px] text-white/80 font-medium tracking-tight">
                      system://{selectedProject.slug}.display
                    </span>
                  </div>

                  {/* Right (Zoom Controls Cluster + ESC TO CLOSE button) */}
                  <div className="flex items-center gap-2 z-10">
                    {/* Tactical Zoom Cluster */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 gap-0.5 font-mono text-[11px] shadow-inner">
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 1}
                        className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                        aria-label="Zoom out"
                        title="Zoom Out [-]"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleZoomReset}
                        className="px-2 py-0.5 rounded hover:bg-white/10 text-emerald-400 font-bold text-[10px] sm:text-[11px] tracking-tight transition-colors cursor-pointer"
                        title="Reset Zoom [0]"
                      >
                        {Math.round(zoomLevel * 100)}%
                      </button>
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                        className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                        aria-label="Zoom in"
                        title="Zoom In [+]"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      {zoomLevel > 1 && (
                        <button
                          type="button"
                          onClick={handleZoomReset}
                          className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                          aria-label="Reset zoom"
                          title="Reset [0]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLightboxOpen(false);
                        setZoomLevel(1);
                      }}
                      className="hidden sm:inline-flex font-mono text-[10px] md:text-xs text-white/60 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:border-white/30 bg-white/5 transition-colors cursor-pointer"
                    >
                      [ ESC TO CLOSE ]
                    </button>
                  </div>
                </div>

                {/* Main Display Viewport (100% OLED black backdrop, object-contain with drag and zoom) */}
                <div className="flex-1 w-full h-full min-h-0 bg-[#000000] flex items-center justify-center relative overflow-hidden p-2 md:p-4">
                  <motion.div
                    drag={zoomLevel > 1}
                    dragConstraints={{
                      left: -280 * (zoomLevel - 1),
                      right: 280 * (zoomLevel - 1),
                      top: -180 * (zoomLevel - 1),
                      bottom: 180 * (zoomLevel - 1),
                    }}
                    animate={{ scale: zoomLevel }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className={`w-full h-full flex items-center justify-center ${
                      zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                  >
                    {selectedProject.videoUrl ? (
                      selectedProject.videoUrl.includes('youtube') ||
                      selectedProject.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={selectedProject.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full border-0 object-contain rounded pointer-events-auto"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <video
                          src={selectedProject.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain select-none pointer-events-auto"
                        />
                      )
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        draggable={false}
                        className="w-full h-full object-contain select-none pointer-events-none"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Bottom macOS Dock Bar (Subtle Status Strip) */}
                <div className="h-8 px-4 bg-[#0B0B0E]/90 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60 shrink-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-white/80 truncate">{selectedProject.title}</span>
                    <span className="text-white/30 hidden sm:inline">•</span>
                    <span className="text-white/40 hidden sm:inline uppercase text-[10px]">
                      {CATEGORY_NAMES[selectedProject.category] || selectedProject.category}
                    </span>
                  </div>

                  <Link
                    href={`/architecture/${selectedProject.slug}`}
                    onClick={() => {
                      setLandingMap({
                        section: 'projects',
                        sectionIndex: 2,
                        projectSlug: selectedProject.slug || selectedProject._id,
                        projectIndex: currentIndex,
                        projectCategory: selectedCategory,
                      });
                      setSavedViewState({
                        sectionIndex: 2,
                        projectCategory: selectedCategory,
                        projectSlug: selectedProject.slug || selectedProject._id,
                      });
                    }}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors shrink-0 text-[10px] md:text-[11px]"
                  >
                    <span>Open Architecture Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
