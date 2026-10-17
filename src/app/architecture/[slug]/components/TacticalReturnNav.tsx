'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLandingMap, LandingPageMap } from '@/utils/viewStatePersistence';

export default function TacticalReturnNav() {
  const router = useRouter();
  const [landingMap, setLandingMapState] = useState<LandingPageMap | null>(null);

  useEffect(() => {
    setLandingMapState(getLandingMap());
  }, []);

  const handleReturn = useCallback(() => {
    router.push('/');
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleReturn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReturn]);

  // Construct tactical destination label based on stored map
  const destinationLabel = (() => {
    if (!landingMap) return 'RETURN TO COMMAND DOSSIER';

    switch (landingMap.section) {
      case 'hero':
        return typeof landingMap.heroSlotIndex === 'number'
          ? `RETURN // HERO LOADOUT [0${landingMap.heroSlotIndex + 1}]`
          : 'RETURN // HERO DOSSIER';
      case 'experience':
        return typeof landingMap.experienceIndex === 'number'
          ? `RETURN // EXPERIENCE [CARD 0${landingMap.experienceIndex + 1}]`
          : 'RETURN // EXPERIENCE STACK';
      case 'projects':
        return 'RETURN // PROJECT ARSENAL';
      case 'contact':
        return 'RETURN // MISSION DISPATCH';
      default:
        return 'RETURN TO COMMAND DOSSIER';
    }
  })();

  return (
    <motion.button
      type="button"
      onClick={handleReturn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 sm:gap-3 rounded-full border border-[var(--theme-text)]/15 bg-[var(--theme-text)]/[0.04] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[var(--theme-text)] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[var(--theme-primary)]/50 hover:bg-[var(--theme-primary)]/[0.08] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_22%,transparent)] transition-all duration-300 cursor-pointer select-none"
      title="Return to Landing Page [Esc]"
    >
      {/* Live Tactical Beacon */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-primary)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
      </span>

      {/* Kinetic Arrow */}
      <ArrowLeft className="w-3.5 h-3.5 text-[var(--theme-primary)] transition-transform duration-200 group-hover:-translate-x-1" />

      {/* Destination Intel Callsign */}
      <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity">
        <span className="hidden xs:inline">{destinationLabel}</span>
        <span className="xs:hidden">RETURN</span>
      </span>

      {/* Tactile Hotkey Pill */}
      <span className="hidden sm:inline-flex items-center text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border border-[var(--theme-text)]/15 bg-[var(--theme-text)]/[0.06] text-[var(--theme-text)]/60 group-hover:text-[var(--theme-primary)] group-hover:border-[var(--theme-primary)]/40 transition-colors">
        ESC
      </span>
    </motion.button>
  );
}
