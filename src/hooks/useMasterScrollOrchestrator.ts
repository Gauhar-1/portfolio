'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { setSavedViewState } from '@/utils/viewStatePersistence';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export type SectionId = 'hero' | 'experience' | 'projects' | 'contact';

export const SECTION_IDS: SectionId[] = ['hero', 'experience', 'projects', 'contact'];

export interface UseMasterScrollOrchestratorOptions {
  sectionRefs: (React.RefObject<HTMLElement | null> | { current: HTMLElement | null })[];
  experiencesCount: number;
  activeSectionIndex: 0 | 1 | 2 | 3;
  onSectionIndexChange: (newIndex: 0 | 1 | 2 | 3) => void;
  activeExperienceIndex: number;
  onExperienceIndexChange: (newIndex: number) => void;
  enabled?: boolean;
}

export function useMasterScrollOrchestrator({
  sectionRefs,
  experiencesCount,
  activeSectionIndex,
  onSectionIndexChange,
  activeExperienceIndex,
  onExperienceIndexChange,
  enabled = true,
}: UseMasterScrollOrchestratorOptions) {
  // Strict inertia lock to absorb MacBook trackpad and high-frequency mouse wheels
  const isLockedRef = useRef(false);
  const lastWheelTimeRef = useRef(0);

  const activeSection = useMemo<SectionId>(() => {
    return SECTION_IDS[activeSectionIndex] || 'hero';
  }, [activeSectionIndex]);

  // Activate inertia lock for a specified duration (default: 850ms)
  const lockWithCooldown = useCallback((ms = 850) => {
    isLockedRef.current = true;
    lastWheelTimeRef.current = Date.now();
    setTimeout(() => {
      isLockedRef.current = false;
    }, ms);
  }, []);

  // Glide smoothly to any section index (0, 1, 2, 3)
  const glideToSectionIndex = useCallback(
    (targetIndex: 0 | 1 | 2 | 3, instant = false) => {
      if (typeof window === 'undefined') return;
      const clampedIndex = Math.max(0, Math.min(3, targetIndex)) as 0 | 1 | 2 | 3;

      onSectionIndexChange(clampedIndex);
      setSavedViewState({
        sectionIndex: clampedIndex,
        experienceIndex: activeExperienceIndex,
      });

      const targetEl = sectionRefs[clampedIndex]?.current;
      const targetY = targetEl ? targetEl.offsetTop : clampedIndex * window.innerHeight;

      if (instant) {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      } else {
        isLockedRef.current = true;
        lastWheelTimeRef.current = Date.now();

        gsap.to(window, {
          scrollTo: { y: targetY, autoKill: false },
          duration: 0.75,
          ease: 'expo.inOut',
          onComplete: () => {
            setTimeout(() => {
              isLockedRef.current = false;
            }, 120);
          },
        });
      }
    },
    [sectionRefs, onSectionIndexChange, activeExperienceIndex]
  );

  // Glide to section by semantic ID ('hero' | 'experience' | 'projects' | 'contact')
  const glideToSection = useCallback(
    (sectionId: SectionId) => {
      const idx = SECTION_IDS.indexOf(sectionId);
      if (idx !== -1) {
        glideToSectionIndex(idx as 0 | 1 | 2 | 3);
      }
    },
    [glideToSectionIndex]
  );

  // Two-Tier Discrete Step Handler (direction: 1 = Down, -1 = Up)
  const handleStep = useCallback(
    (direction: 1 | -1) => {
      if (isLockedRef.current) return;
      lockWithCooldown(850);

      if (activeSectionIndex === 1) {
        // ── Tier 1: Inside Experience Section (Isolated Card Deck) ──
        if (direction === 1) {
          // Scrolling DOWN
          if (activeExperienceIndex < experiencesCount - 1) {
            // Strictly increment card by 1
            onExperienceIndexChange(activeExperienceIndex + 1);
            setSavedViewState({ sectionIndex: 1, experienceIndex: activeExperienceIndex + 1 });
          } else {
            // Already on last Experience card -> hand off to global snapper (Projects Section 2)
            glideToSectionIndex(2);
          }
        } else {
          // Scrolling UP
          if (activeExperienceIndex > 0) {
            // Strictly decrement card by 1
            onExperienceIndexChange(activeExperienceIndex - 1);
            setSavedViewState({ sectionIndex: 1, experienceIndex: activeExperienceIndex - 1 });
          } else {
            // Already on first Experience card -> hand off to global snapper (Hero Section 0)
            glideToSectionIndex(0);
          }
        }
      } else {
        // ── Tier 2: Global Section Snapping (Sections 0, 2, 3) ──
        if (direction === 1) {
          if (activeSectionIndex === 0) {
            // Forward entry: entering Experience from Hero -> always start at Card 0
            onExperienceIndexChange(0);
            glideToSectionIndex(1);
          } else if (activeSectionIndex === 2) {
            glideToSectionIndex(3);
          }
        } else {
          if (activeSectionIndex === 3) {
            glideToSectionIndex(2);
          } else if (activeSectionIndex === 2) {
            // Reverse entry: entering Experience from Projects -> start at LAST card!
            const lastCardIndex = Math.max(0, experiencesCount - 1);
            onExperienceIndexChange(lastCardIndex);
            glideToSectionIndex(1);
          }
        }
      }
    },
    [
      activeSectionIndex,
      activeExperienceIndex,
      experiencesCount,
      lockWithCooldown,
      onExperienceIndexChange,
      glideToSectionIndex,
    ]
  );

  // Intercept Wheel, Touch, and Key Gestures
  useEffect(() => {
    if (!enabled) return;

    const isInputActive = () => {
      const activeEl = document.activeElement;
      if (!activeEl) return false;
      const tag = activeEl.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );
    };

    const isModalOpen = () => {
      return (
        document.documentElement.dataset.modalOpen === 'true' ||
        document.body.style.overflow === 'hidden' ||
        Boolean(document.querySelector('[role="dialog"]'))
      );
    };

    const handleWheel = (e: WheelEvent) => {
      if (isModalOpen() || isInputActive()) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 22) return;

      // Always absorb native scroll so 100dvh sections and cards stay strictly locked
      e.preventDefault();

      if (isLockedRef.current) return;

      handleStep(deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isModalOpen() || isInputActive()) return;
      if (!e.touches || !e.touches[0]) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (Math.abs(deltaY) < 40) return;

      touchStartY = touchY; // Reset to prevent multiple card changes per swipe

      if (isLockedRef.current) return;

      handleStep(deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen() || isInputActive()) return;

      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        if (!isLockedRef.current) handleStep(1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        if (!isLockedRef.current) handleStep(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        if (!isLockedRef.current) glideToSectionIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        if (!isLockedRef.current) glideToSectionIndex(3);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleStep, glideToSectionIndex]);

  return {
    activeSection,
    activeSectionIndex,
    glideToSection,
    glideToSectionIndex,
    isLockedRef,
  };
}
