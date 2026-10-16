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
} from 'lucide-react';
import { getSessionId } from '@/lib/telemetry';

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
  { id: 'AI_RAG', label: '🧠 AI & RAG' },
  { id: 'SYSTEMS_ENGINES', label: '⚡ SYSTEMS & MEDIA' },
  { id: 'FULLSTACK_SAAS', label: '🧩 FULL-STACK SAAS' },
];

const CATEGORY_NAMES: Record<string, string> = {
  AI_RAG: 'AI & RAG ENGINE',
  SYSTEMS_ENGINES: 'SYSTEMS & ENGINE',
  FULLSTACK_SAAS: 'FULL-STACK SAAS',
};

// ─── Curated Fallback Projects (Continuity with Architecture Blueprints) ───────
const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    _id: 'fb-quickbiteqr',
    title: 'QuickBiteQR',
    slug: 'quickbiteqr',
    category: 'SYSTEMS_ENGINES',
    featuredOrder: 1,
    tagline: 'Serverless POS handling Friday rushes at 98.9% compute margins',
    overview:
      'Restaurant traffic clusters aggressively during dinner rushes, overwhelming relational databases with concurrent menu scans. I engineered an edge-cached serverless POS reducing read load by 92% and securing UPI checkouts.',
    technologies: ['Next.js 15', 'TypeScript', 'Upstash Redis', 'PostgreSQL', 'TailwindCSS'],
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    links: {
      github: 'https://github.com',
      website: 'https://quickbiteqr.demo',
    },
    hasArchitecture: true,
    theme: {
      primaryHex: '#10b981',
      backgroundHex: '#0a0a0c',
      textHex: '#f8fafc',
    },
    borrowedMetrics: [
      { title: 'Compute Margin', value: '98.9%' },
      { title: 'Infra COGS', value: '₹15 / mo' },
      { title: 'Peak Scale', value: '250+ RPS' },
    ],
    borrowedChallenges: ['Menu Read Scaling', 'Zero-Trust Checkout', 'Analytics Decoupling'],
  },
  {
    _id: 'fb-founderdiary',
    title: 'Founder Diary',
    slug: 'founderdiary',
    category: 'AI_RAG',
    featuredOrder: 2,
    tagline: 'Deterministic AST-driven canvas & semantic vector knowledge graph',
    overview:
      'Early-stage founders suffer from fragmented ideation across notes and roadmaps. I architected an AST block compiler with hybrid vector-graph retrieval that turns unstructured brainstorms into structured engineering blueprints.',
    technologies: ['React 19', 'FastAPI', 'PostgreSQL', 'LangChain', 'pgvector'],
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    links: {
      github: 'https://github.com',
      website: 'https://founderdiary.demo',
    },
    hasArchitecture: true,
    theme: {
      primaryHex: '#8B5CF6',
      backgroundHex: '#09090d',
      textHex: '#F8FAFC',
    },
    borrowedMetrics: [
      { title: 'Vector Latency', value: '18ms' },
      { title: 'AST Parse Rate', value: '1.2k ops/s' },
      { title: 'Context Window', value: '128k' },
    ],
    borrowedChallenges: ['Layout Orchestrator', 'Block AST Compiler', 'Schema Compiler'],
  },
  {
    _id: 'fb-rajyasampark',
    title: 'RajyaSampark',
    slug: 'rajyasampark',
    category: 'SYSTEMS_ENGINES',
    featuredOrder: 3,
    tagline: 'Statewide civic grievance mesh with fault-tolerant dead-letter queues',
    overview:
      'Public grievance redressal systems suffer bureaucratic bottlenecks and silent request drops during civic emergencies. I engineered an asynchronous event streaming mesh that guarantees zero drop rate with audited bureaucratic dispatch.',
    technologies: ['Go', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes'],
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    links: {
      github: 'https://github.com',
      website: 'https://rajyasampark.demo',
    },
    hasArchitecture: true,
    theme: {
      primaryHex: '#0ea5e9',
      backgroundHex: '#050b14',
      textHex: '#f0f9ff',
    },
    borrowedMetrics: [
      { title: 'Daily Tickets', value: '50k+' },
      { title: 'Dispatch Latency', value: '<120ms' },
      { title: 'Uptime', value: '99.99%' },
    ],
    borrowedChallenges: [
      'Service Mesh Topology',
      'Dead-Letter Recovery',
      'Constituent Anonymization',
    ],
  },
  {
    _id: 'fb-taujiludo',
    title: 'TaujiLudo',
    slug: 'taujiludo',
    category: 'FULLSTACK_SAAS',
    featuredOrder: 4,
    tagline: 'Sub-50ms lockstep multiplayer game engine with state synchronization',
    overview:
      'Turn-based mobile games suffer desynchronization and dropped turns when players fluctuate across erratic mobile cell towers. I engineered a deterministic lockstep server with WebSocket delta-compression and rollback reconciliation.',
    technologies: ['Node.js', 'WebSockets', 'Redis', 'TypeScript', 'Canvas API'],
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    links: {
      github: 'https://github.com',
      website: 'https://taujiludo.demo',
    },
    hasArchitecture: true,
    theme: {
      primaryHex: '#f59e0b',
      backgroundHex: '#120d04',
      textHex: '#fef3c7',
    },
    borrowedMetrics: [
      { title: 'Sync Tick', value: '16ms' },
      { title: 'Concurrent Rooms', value: '5,000+' },
      { title: 'Packet Overhead', value: '-74%' },
    ],
    borrowedChallenges: [
      'Lockstep Synchronization',
      'Rollback Reconciliation',
      'Anti-Cheat Arbitration',
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IntentCategory>('ALL');
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  // Telemetry click logger
  const trackClick = (title: string, actionType: string) => {
    const sessionId = getSessionId();
    if (sessionId) {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: 15,
          action: `[Arsenal 100dvh] ${actionType}: ${title}`,
        }),
      }).catch(console.error);
    }
  };

  // Fetch enriched projects
  useEffect(() => {
    let isMounted = true;
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data: ProjectItem[] = await res.json();
        if (isMounted) {
          if (data && data.length > 0) {
            setProjects(data);
            setSelectedSlug(data[0].slug || data[0]._id);
          } else {
            setProjects(FALLBACK_PROJECTS);
            setSelectedSlug(FALLBACK_PROJECTS[0].slug);
          }
        }
      } catch (err) {
        console.error('Error fetching projects, falling back to curated blueprints', err);
        if (isMounted) {
          setProjects(FALLBACK_PROJECTS);
          setSelectedSlug(FALLBACK_PROJECTS[0].slug);
        }
      }
    }
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

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
      setSelectedSlug(first.slug || first._id);
      trackClick(first.title, `Filter: ${cat}`);
    }
  };

  // Active selected project
  const selectedProject = useMemo(() => {
    const found = filteredProjects.find((p) => (p.slug || p._id) === selectedSlug);
    if (found) return found;
    return filteredProjects[0] || projects[0] || FALLBACK_PROJECTS[0];
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
    setSelectedSlug(prev.slug || prev._id);
    trackClick(prev.title, 'Navigated Prev');
  }, [currentIndex, filteredProjects]);

  const handleNextProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredProjects.length;
    const next = filteredProjects[nextIdx];
    setSelectedSlug(next.slug || next._id);
    trackClick(next.title, 'Navigated Next');
  }, [currentIndex, filteredProjects]);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrevProject();
      } else if (e.key === 'ArrowRight') {
        handleNextProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevProject, handleNextProject]);

  // Chameleon 3-token theme
  const activeTheme = selectedProject?.theme || {
    primaryHex: '#8B5CF6',
    backgroundHex: '#09090d',
    textHex: '#F8FAFC',
  };

  return (
    <section
      id="projects"
      style={
        {
          '--theme-primary': activeTheme.primaryHex,
          '--theme-bg': activeTheme.backgroundHex,
          '--theme-text': activeTheme.textHex,
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          transition: 'background-color 700ms ease, color 700ms ease',
        } as React.CSSProperties
      }
      className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden px-4 md:px-10 lg:px-16 py-4 md:py-6 flex flex-col justify-between gap-3 md:gap-4 transition-colors duration-700"
    >
      {/* Dynamic Chameleon Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35 transition-all duration-1000"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, color-mix(in srgb, var(--theme-primary) 18%, transparent) 0%, transparent 60%), radial-gradient(circle at 20% 75%, color-mix(in srgb, var(--theme-primary) 12%, transparent) 0%, transparent 50%)',
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--theme-text) 1px, transparent 1px), linear-gradient(to bottom, var(--theme-text) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Zone 1: Top Header & Intent Filter Bar (shrink-0)                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b relative z-10"
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

        {/* Right: The 4 Recruiter Intent Filter Tabs */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar">
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
      <div className="flex-1 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          {selectedProject && (
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
              <div className="flex-1 min-h-0 lg:h-full lg:col-span-6 p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between overflow-hidden">
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

                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight mt-2 truncate">
                    {selectedProject.title}
                  </h3>

                  <p
                    className="mt-1 font-mono text-xs md:text-sm font-semibold line-clamp-1"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    {selectedProject.tagline}
                  </p>
                </div>

                {/* 2. Clamped Overview */}
                <p
                  className="font-mono text-xs sm:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 my-2"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 80%, transparent)' }}
                >
                  {selectedProject.overview}
                </p>

                {/* 3. 3-Pillar Borrowed Metric Strip */}
                {selectedProject.borrowedMetrics &&
                  selectedProject.borrowedMetrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 md:gap-3 my-1">
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
                            className="font-mono text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-tight truncate"
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

                {/* 4. Curiosity Teaser & Action Dock */}
                <div className="space-y-2.5 pt-1">
                  {/* Single-line Curiosity Teaser */}
                  {selectedProject.borrowedChallenges &&
                    selectedProject.borrowedChallenges.length > 0 && (
                      <div
                        className="px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 overflow-hidden"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-primary) 8%, var(--theme-bg) 92%)',
                          borderColor:
                            'color-mix(in srgb, var(--theme-primary) 25%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      >
                        <span
                          className="font-bold tracking-wider uppercase shrink-0 text-[10px]"
                          style={{ color: 'var(--theme-primary)' }}
                        >
                          Blueprint:
                        </span>
                        <span className="truncate opacity-90 text-[11px] line-clamp-1">
                          {selectedProject.borrowedChallenges.join(' • ')}
                        </span>
                      </div>
                    )}

                  {/* Action Row */}
                  <div
                    className="pt-2 flex items-center justify-between gap-2 border-t"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/architecture/${selectedProject.slug}`}
                        onClick={() =>
                          trackClick(selectedProject.title, 'CTA Explore Architecture')
                        }
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
                          className="p-2.5 rounded-lg border transition-colors hover:border-current flex items-center justify-center shrink-0"
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
                          className="p-2.5 rounded-lg border transition-colors hover:border-current flex items-center justify-center shrink-0"
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
              </div>

              {/* ── Right Half: The Visual Viewport (lg:col-span-6) ─────────── */}
              <div
                className="h-36 sm:h-48 lg:h-full lg:col-span-6 shrink-0 relative overflow-hidden bg-black/60 border-t lg:border-t-0 lg:border-l"
                style={{
                  borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                }}
              >
                {/* HUD Header Bar */}
                <div
                  className="absolute top-0 inset-x-0 h-7 md:h-8 px-3 z-20 flex items-center justify-between border-b backdrop-blur-md"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-bg) 75%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <span className="font-mono text-[10px] opacity-70 ml-1 truncate">
                      system://{selectedProject.slug}.architecture
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Media Content */}
                <div className="relative w-full h-full">
                  {selectedProject.videoUrl ? (
                    selectedProject.videoUrl.includes('youtube') ||
                    selectedProject.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={selectedProject.videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full border-0"
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
                      className="object-cover object-top filter contrast-110"
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
                      <div
                        className="absolute bottom-0 inset-x-0 p-2.5 z-10 flex flex-wrap gap-1 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/85 to-transparent pt-6"
                      >
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
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Zone 3: Bottom Quick-Switch Dock (shrink-0 Horizontal Carousel)       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-1 relative z-10">
        {filteredProjects.map((project, idx) => {
          const isSelected =
            (project.slug || project._id) ===
            (selectedProject?.slug || selectedProject?._id);
          const indexStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={project.slug || project._id}
              onClick={() => {
                setSelectedSlug(project.slug || project._id);
                trackClick(project.title, 'Selected Dock Tab');
              }}
              className="group relative min-w-[200px] md:min-w-[240px] px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl border cursor-pointer transition-all duration-300 text-left shrink-0"
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
                  <span className="font-bold text-xs md:text-sm tracking-tight truncate max-w-[120px] md:max-w-[140px]">
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
                className="mt-1 text-[11px] font-mono truncate opacity-70"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
              >
                {project.tagline}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
