'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import TacticalBootloader from '@/components/TacticalBootloader';
import SectionNavHUD from '@/components/SectionNavHUD';
import { useMasterScrollOrchestrator } from '@/hooks/useMasterScrollOrchestrator';

import ExperienceSection, { Experience } from '@/components/experience-section';
import ProjectsSection, { ProjectItem } from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import TacticalHeader from '@/app/hero-lab/components/TacticalHeader';
import OperatorDossier from '@/app/hero-lab/components/OperatorDossier';
import OperatorViewport from '@/app/hero-lab/components/OperatorViewport';
import LoadoutInspector from '@/app/hero-lab/components/LoadoutInspector';
import TransitionBridge from '@/app/hero-lab/components/TransitionBridge';

import {
  DEFAULT_HERO_THEME,
  OPERATOR_IDENTITY,
  OPERATOR_ATTRIBUTES,
  TACTICAL_LOADOUTS,
  OperatorIdentity,
  OperatorAttribute,
  IntelLink,
  TacticalLoadout,
} from '@/app/hero-lab/constants/operator-data';
import {
  getPortfolioDataCache,
  setPortfolioDataCache,
  getSavedViewState,
  setSavedViewState,
  getLandingMap,
  clearLandingMap,
} from '@/utils/viewStatePersistence';

export default function HomePage() {
  // ── 1. Page Boot & Telemetry Loading State ──
  const [loading, setLoading] = useState(true);
  const [isRestoringPosition, setIsRestoringPosition] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'hero' | 'experience' | 'projects' | 'ready'>('hero');
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [bootError, setBootError] = useState<string | null>(null);

  // ── 2. Real Database Payloads (Initialized with Structured Telemetry Defaults) ──
  const [identity, setIdentity] = useState<OperatorIdentity>(OPERATOR_IDENTITY);
  const [attributes, setAttributes] = useState<OperatorAttribute[]>(OPERATOR_ATTRIBUTES);
  const [links, setLinks] = useState<IntelLink[]>([]);
  const [loadouts, setLoadouts] = useState<TacticalLoadout[]>(TACTICAL_LOADOUTS);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // ── 3. Two-Tier Navigation State ──
  const [activeSectionIndex, setActiveSectionIndex] = useState<0 | 1 | 2 | 3>(0);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState<number>(0);

  // ── 4. Section DOM Element References for Clean Offset Snapping ──
  const heroRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useMemo(() => [heroRef, expRef, projectsRef, contactRef], []);

  // ── 5. Active Loadout Theme State ──
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const map = getLandingMap();
      if (map && map.section === 'hero' && typeof map.heroSlotIndex === 'number') {
        return map.heroSlotIndex;
      }
      const saved = getSavedViewState();
      if (saved && typeof saved.heroSlotIndex === 'number') {
        return saved.heroSlotIndex;
      }
    }
    return null;
  });

  // Persist activeSlotIndex changes
  useEffect(() => {
    if (!loading && !isRestoringPosition) {
      setSavedViewState({ heroSlotIndex: activeSlotIndex });
    }
  }, [activeSlotIndex, loading, isRestoringPosition]);

  // ── 6. Unified Hero Config Hydration Helper ──
  const applyHeroData = useCallback((heroData: any) => {
    if (!heroData) return;

    if (heroData.heroConfig) {
      const cfg = heroData.heroConfig;
      setIdentity({
        callsign: cfg.callsign || 'OPERATOR',
        classTitle: cfg.classTitle || 'Principal Systems Engineer',
        headline: cfg.headline || 'Production Systems Architect & Motion Engineer',
        subheadline:
          cfg.subheadline ||
          'Specializing in high-throughput microservices, edge computing, and real-time architectures.',
        avatarUrl: cfg.avatarUrl || '/avatar.webp',
        fallbackInitials: 'GK',
        badge: cfg.statusBadge || 'LEVEL_4_LEAD',
        status: 'ONLINE // COMBAT_READY',
        rank: 'CHIEF ARCHITECT',
        clearance: 'TOP_SECRET // LEVEL_5',
        baseNode: 'DELHI_NCR_NODE_01',
      });

      if (Array.isArray(cfg.attributes) && cfg.attributes.length > 0) {
        setAttributes(
          cfg.attributes.map((a: any, i: number) => ({
            id: `db-attr-${i}`,
            label: a.label,
            displayValue: a.displayValue,
            fillPercent: a.fillPercent ?? 90,
            tier: (a.fillPercent ?? 90) >= 95 ? 'S-TIER' : 'A-TIER',
            category: 'SYSTEM_BENCHMARK',
          }))
        );
      }
    }

    if (Array.isArray(heroData.populatedSlots) && heroData.populatedSlots.length > 0) {
      setLoadouts(heroData.populatedSlots);
    }

    if (heroData.links) {
      const l = heroData.links;
      setLinks([
        {
          id: 'link-gh',
          label: 'GitHub',
          url: l.github || 'https://github.com/Gauhar-1',
          keyBind: 'G',
          icon: 'github',
          tooltip: 'Inspect Production Source Code [Press G]',
        },
        {
          id: 'link-li',
          label: 'LinkedIn',
          url: l.linkedin || 'https://linkedin.com/in/mdgoharkhan',
          keyBind: 'L',
          icon: 'linkedin',
          tooltip: 'Verify Professional Record [Press L]',
        },
        {
          id: 'link-x',
          label: 'X / Twitter',
          url: l.x || 'https://x.com',
          keyBind: 'X',
          icon: 'twitter',
          tooltip: 'Follow Technical Signals [Press X]',
        },
        {
          id: 'link-mail',
          label: 'Email Intel',
          url: l.email ? `mailto:${l.email}` : 'mailto:mustakkhan1210@gmail.com',
          keyBind: 'M',
          icon: 'mail',
          tooltip: 'Direct Operator Uplink [Press M]',
        },
        {
          id: 'link-resume',
          label: 'Download Intel (Resume)',
          url: l.resumeUrl || '/resume.pdf',
          keyBind: 'R',
          icon: 'download',
          isPrimary: true,
          tooltip: 'Retrieve Confidential Dossier [Press R]',
        },
      ]);
    }
  }, []);

  // ── 7. Silent Background Revalidation (Non-Blocking) ──
  const revalidateInBackground = useCallback(async () => {
    try {
      const [heroData, experiencesData, projectsData] = await Promise.all([
        fetch('/api/hero').then((res) => (res.ok ? res.json() : null)),
        fetch('/api/experiences').then((res) => (res.ok ? res.json() : null)),
        fetch('/api/projects').then((res) => (res.ok ? res.json() : null)),
      ]);

      if (heroData && Array.isArray(experiencesData) && Array.isArray(projectsData)) {
        applyHeroData(heroData);
        setExperiences(experiencesData);
        setProjects(projectsData);
        setPortfolioDataCache({ heroData, experiencesData, projectsData });
      }
    } catch (err) {
      console.warn('[Background Revalidate] Non-blocking refresh skipped:', err);
    }
  }, [applyHeroData]);

  // ── 8. Synchronized Telemetry Bootloader Uplink ──
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setBootError(null);
    setLoadingStage('hero');
    setLoadingProgress(20);

    const startTime = Date.now();

    try {
      const heroFetch = fetch('/api/hero').then(async (res) => {
        if (!res.ok) throw new Error(`[HERO_CONFIG_SYNC_FAIL] Status ${res.status}`);
        return res.json();
      });

      const expFetch = fetch('/api/experiences').then(async (res) => {
        if (!res.ok) throw new Error(`[EXP_TELEMETRY_SYNC_FAIL] Status ${res.status}`);
        return res.json();
      });

      const projFetch = fetch('/api/projects').then(async (res) => {
        if (!res.ok) throw new Error(`[PROJECT_ARSENAL_SYNC_FAIL] Status ${res.status}`);
        return res.json();
      });

      setLoadingStage('hero');
      setLoadingProgress(45);

      const [heroData, experiencesData, projectsData] = await Promise.all([
        heroFetch,
        expFetch,
        projFetch,
      ]);

      setLoadingStage('experience');
      setLoadingProgress(70);

      // Validate critical payload integrity
      if (!heroData) {
        throw new Error('Hero configuration payload was empty or unparseable.');
      }
      if (!Array.isArray(experiencesData)) {
        throw new Error('Experience telemetry array was missing or invalid.');
      }
      if (!Array.isArray(projectsData)) {
        throw new Error('Project arsenal array was missing or invalid.');
      }

      setLoadingStage('projects');
      setLoadingProgress(90);

      // Hydrate Experience, Project, and Hero stores
      setExperiences(experiencesData);
      setProjects(projectsData);
      applyHeroData(heroData);

      setPortfolioDataCache({ heroData, experiencesData, projectsData });

      // Enforce minimum 1.5s bootloader duration for optimal recruiter UX
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        setLoadingStage('ready');
        setLoadingProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 350);
      }, remaining);
    } catch (err: any) {
      console.error('[Telemetry Bootloader] Uplink Failure:', err);
      setBootError(err?.message || 'Database Uplink Failed. Check network or server configuration.');
    }
  }, [applyHeroData]);

  // ── 9. Curtain-Shielded Sequential State Replay on Page Return ──
  const replaySavedState = useCallback(async () => {
    const map = getLandingMap();
    const saved = getSavedViewState();

    let targetSectionIndex: 0 | 1 | 2 | 3 = 0;
    let targetExpIndex = 0;
    let targetHeroSlot: number | null = null;

    if (map) {
      if (typeof map.sectionIndex === 'number') {
        targetSectionIndex = map.sectionIndex;
      } else if (map.section === 'hero') targetSectionIndex = 0;
      else if (map.section === 'experience') targetSectionIndex = 1;
      else if (map.section === 'projects') targetSectionIndex = 2;
      else if (map.section === 'contact') targetSectionIndex = 3;

      if (typeof map.experienceIndex === 'number') targetExpIndex = map.experienceIndex;
      if (typeof map.heroSlotIndex === 'number') targetHeroSlot = map.heroSlotIndex;
    } else if (saved) {
      targetSectionIndex = saved.sectionIndex ?? 0;
      targetExpIndex = saved.experienceIndex ?? 0;
      targetHeroSlot = saved.heroSlotIndex ?? null;
    }

    if (
      targetSectionIndex === 0 &&
      targetExpIndex === 0 &&
      targetHeroSlot === null
    ) {
      return;
    }

    setIsRestoringPosition(true);

    // Step A: Restore hero slot state
    if (targetHeroSlot !== null) {
      setActiveSlotIndex(targetHeroSlot);
    }

    // Small delay to allow DOM nodes to settle inside the curtain
    await new Promise((r) => setTimeout(r, 60));

    // Step B: Walk Section-by-Section
    for (let s = 0; s <= targetSectionIndex; s++) {
      const secIdx = s as 0 | 1 | 2 | 3;
      setActiveSectionIndex(secIdx);

      const targetEl = sectionRefs[secIdx]?.current;
      const targetY = targetEl ? targetEl.offsetTop : secIdx * window.innerHeight;
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });

      if (secIdx === 1) {
        // ExperienceSection: Walk card-by-card up to targetExpIndex
        const maxExp =
          targetSectionIndex > 1
            ? Math.max(0, (experiences.length || 3) - 1)
            : targetExpIndex;

        for (let c = 0; c <= maxExp; c++) {
          setActiveExperienceIndex(c);
          await new Promise((r) => setTimeout(r, 45));
        }
      }

      await new Promise((r) => setTimeout(r, 45));
    }

    // Step C: Lift the Curtain after brief settle frame
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    setIsRestoringPosition(false);
    clearLandingMap();
  }, [experiences.length, sectionRefs]);

  // ── 10. Mounting Lifecycle: Cache First, Then Fallback to Synchronized Bootloader ──
  useEffect(() => {
    const cached = getPortfolioDataCache();
    if (
      cached &&
      cached.heroData &&
      Array.isArray(cached.experiencesData) &&
      Array.isArray(cached.projectsData)
    ) {
      applyHeroData(cached.heroData);
      setExperiences(cached.experiencesData);
      setProjects(cached.projectsData);

      setLoading(true);
      setLoadingStage('hero');
      setLoadingProgress(25);

      const t1 = setTimeout(() => {
        setLoadingStage('experience');
        setLoadingProgress(60);
      }, 350);

      const t2 = setTimeout(() => {
        setLoadingStage('projects');
        setLoadingProgress(85);
      }, 700);

      const t3 = setTimeout(() => {
        setLoadingStage('ready');
        setLoadingProgress(100);
      }, 1100);

      const t4 = setTimeout(() => {
        setLoading(false);
      }, 1500);

      revalidateInBackground();

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      loadAllData();
    }
  }, [applyHeroData, loadAllData, revalidateInBackground]);

  // Execute sequential state replay as soon as experiences and loadouts are hydrated
  useEffect(() => {
    if (experiences.length > 0 || loadouts.length > 0) {
      replaySavedState();
    }
  }, [experiences.length, loadouts.length, replaySavedState]);

  // Disable browser's auto scroll restoration to prevent premature jumping
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // ── 11. Master Two-Tier Scroll Orchestrator ──
  const { activeSection, glideToSection } = useMasterScrollOrchestrator({
    sectionRefs,
    experiencesCount: experiences.length || 3,
    activeSectionIndex,
    onSectionIndexChange: setActiveSectionIndex,
    activeExperienceIndex,
    onExperienceIndexChange: setActiveExperienceIndex,
    enabled: !loading && !isRestoringPosition,
  });

  // ── 12. Active Theme Calculation: Default Theme vs Equipped Slot Theme ──
  const activeTheme = useMemo(() => {
    if (activeSlotIndex !== null && loadouts[activeSlotIndex]) {
      const active = loadouts[activeSlotIndex];
      return {
        primaryHex: active.primaryHex,
        backgroundHex: active.bgHex,
        textHex: active.textHex || DEFAULT_HERO_THEME.textHex,
      };
    }
    return DEFAULT_HERO_THEME;
  }, [activeSlotIndex, loadouts]);

  // Display loadout in the right inspector
  const displayLoadout = useMemo(() => {
    if (activeSlotIndex !== null && loadouts[activeSlotIndex]) {
      return loadouts[activeSlotIndex];
    }
    return (
      loadouts[0] || {
        key: 'default',
        id: 'default',
        slotNumber: '01',
        roleClass: 'CORE OPERATOR',
        weaponName: 'SYSTEMS_KERNEL',
        weaponTag: 'PRIMARY',
        primaryHex: '#10b981',
        bgHex: '#080808',
        textHex: '#F8FAFC',
        missionBrief: 'Production full-stack engineering and real-time distributed architecture.',
        combatStats: [
          { label: 'THROUGHPUT', value: '100K+ RPS' },
          { label: 'UPTIME SLA', value: '99.99%' },
          { label: 'P99 LATENCY', value: '<15MS' },
        ],
        pipeline: ['Edge Routing', 'Kafka Stream', 'Event Bus'],
      }
    );
  }, [activeSlotIndex, loadouts]);

  // ── 13. Global Keyboard Shortcuts (0: Default, 1-4: Loadouts, G/L/X/M/R: Comms) ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      if (e.key === '0' || e.key === 'Escape') {
        e.preventDefault();
        setActiveSlotIndex(null);
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        if (slotIdx >= 0 && slotIdx < loadouts.length) {
          e.preventDefault();
          setActiveSlotIndex((prev) => (prev === slotIdx ? null : slotIdx));
          return;
        }
      }

      const matchLink = links.find((l) => l.keyBind === key);
      if (matchLink) {
        e.preventDefault();
        if (matchLink.isPrimary) {
          const dl = document.createElement('a');
          dl.href = matchLink.url;
          dl.download = 'MD_Gohar_Khan_Resume.pdf';
          document.body.appendChild(dl);
          dl.click();
          document.body.removeChild(dl);
        } else {
          window.open(matchLink.url, matchLink.url.startsWith('http') ? '_blank' : '_self');
        }
      }
    },
    [loadouts.length, links]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── 14. Locked 100dvh Sections with Curtain-Shielded Bootloader Overlay ──
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-700 relative"
        style={
          {
            backgroundColor: 'var(--theme-bg)',
            color: 'var(--theme-text)',
            '--theme-primary': activeTheme.primaryHex,
            '--theme-bg': activeTheme.backgroundHex,
            '--theme-text': activeTheme.textHex,
          } as React.CSSProperties
        }
      >
        {/* ── Right-Edge Tactical Section HUD Indicator ── */}
        <SectionNavHUD
          activeSection={activeSection}
          onSelectSection={glideToSection}
        />

        {/* ── Section 0: Hero Section (#hero) ── */}
        <section
          ref={heroRef}
          id="hero"
          aria-label="Tactical Operator Dossier and Loadout"
          className="relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col justify-between transition-colors duration-700"
          style={{ backgroundColor: 'var(--theme-bg)' }}
        >
          {/* Top Tactical HUD Header */}
          <TacticalHeader
            activeLoadout={displayLoadout}
            identity={identity}
            activeSlotIndex={activeSlotIndex}
          />

          {/* Ambient Hex / Precision Tech Background Grid */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--theme-text) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--theme-text) 14%, transparent) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            {/* Dynamic Volumetric Spot Glow */}
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 transition-colors duration-700 pointer-events-none"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-primary) 16%, var(--theme-bg))',
              }}
            />
          </div>

          {/* Tactical 3-Zone FPS Operator Grid */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 my-auto">
            {/* Left Zone: Operator Dossier (Col 4) */}
            <div className="lg:col-span-4 order-2 lg:order-1 flex justify-center lg:justify-start">
              <OperatorDossier
                activeLoadout={displayLoadout}
                identity={identity}
                attributes={attributes}
                links={links}
              />
            </div>

            {/* Center Zone: Operator Viewport Photo HUD (Col 4) */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
              <OperatorViewport
                activeLoadout={displayLoadout}
                avatarUrl={identity.avatarUrl}
                badge={identity.badge}
                callsign={identity.callsign}
                baseNode={identity.baseNode}
              />
            </div>

            {/* Right Zone: Tactical Loadout Inspector (Col 4) */}
            <div className="lg:col-span-4 order-3 flex justify-center lg:justify-end">
              <LoadoutInspector
                activeLoadout={displayLoadout}
                activeSlotIndex={activeSlotIndex}
                onSelectSlot={setActiveSlotIndex}
                loadouts={loadouts}
              />
            </div>
          </div>

          {/* Bottom Transition Bridge into Experience Section */}
          <TransitionBridge activeLoadout={displayLoadout} />
        </section>

        {/* ── Section 1: Experience Section (#experience) ── */}
        <ExperienceSection
          ref={expRef}
          experiences={experiences}
          activeCardIndex={activeExperienceIndex}
          onCardIndexChange={setActiveExperienceIndex}
        />

        {/* ── Section 2: Project Arsenal Section (#projects) ── */}
        <div ref={projectsRef} className="w-full">
          <ProjectsSection initialProjects={projects} />
        </div>

        {/* ── Section 3: Mission Comms & Dispatch Terminal (#contact) ── */}
        <div ref={contactRef} className="w-full">
          <ContactSection />
        </div>

        {/* ── AEO & Semantic Search Crawler Block ── */}
        <div className="sr-only" aria-hidden="false">
          <h2>Operator Dossier: {identity.callsign} — {identity.classTitle}</h2>
          <p>{identity.headline}</p>
          <p>{identity.subheadline}</p>
          <dl>
            {attributes.map((attr) => (
              <div key={attr.id || attr.label}>
                <dt>{attr.label}</dt>
                <dd>{attr.displayValue}</dd>
              </div>
            ))}
          </dl>
          <h3>Tactical Engineering Blueprints and Architectural Case Studies:</h3>
          <ul>
            {loadouts.map((loadout) => (
              <li key={loadout.id || loadout.slotNumber}>
                <h4>{loadout.weaponName} ({loadout.roleClass})</h4>
                <p>{loadout.missionBrief}</p>
                <p>Pipeline: {loadout.pipeline?.join(' -> ')}</p>
                <ul>
                  {loadout.combatStats?.map((stat) => (
                    <li key={stat.label}>{stat.label}: {stat.value}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── Tactical Bootloader Screen as a Fixed Smooth Overlay (Minimum 1.5s Display) ── */}
      <AnimatePresence>
        {(loading || isRestoringPosition) && (
          <motion.div
            key="tactical-bootloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-[200] pointer-events-auto"
          >
            <TacticalBootloader
              progress={loadingProgress}
              stage={loadingStage}
              error={bootError}
              onRetry={loadAllData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
