"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import ExperienceSection from "@/components/experience-section";
import TacticalHeader from "./components/TacticalHeader";
import OperatorDossier from "./components/OperatorDossier";
import OperatorViewport from "./components/OperatorViewport";
import LoadoutInspector from "./components/LoadoutInspector";
import TransitionBridge from "./components/TransitionBridge";
import {
  DEFAULT_HERO_THEME,
  OPERATOR_IDENTITY,
  OPERATOR_ATTRIBUTES,
  COMMS_INTEL_LINKS,
  TACTICAL_LOADOUTS,
  OperatorIdentity,
  OperatorAttribute,
  IntelLink,
  TacticalLoadout,
} from "./constants/operator-data";

export default function HeroLabPage() {
  // ── State: activeSlotIndex is null (Default Theme) or 0, 1, 2, 3 (Equipped Loadout) ──
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  // ── State: Dynamic Database Configuration (Hydrated from /api/hero) ──
  const [identity, setIdentity] = useState<OperatorIdentity>(OPERATOR_IDENTITY);
  const [attributes, setAttributes] = useState<OperatorAttribute[]>(OPERATOR_ATTRIBUTES);
  const [links, setLinks] = useState<IntelLink[]>(COMMS_INTEL_LINKS);
  const [loadouts, setLoadouts] = useState<TacticalLoadout[]>(TACTICAL_LOADOUTS);

  // ── 1. Hydrate Live Configuration from Database via GET /api/hero ──
  useEffect(() => {
    async function fetchHeroData() {
      try {
        const res = await fetch("/api/hero");
        if (!res.ok) return;
        const data = await res.json();

        if (data.heroConfig) {
          const cfg = data.heroConfig;
          setIdentity((prev) => ({
            ...prev,
            callsign: cfg.callsign || prev.callsign,
            classTitle: cfg.classTitle || prev.classTitle,
            statusBadge: cfg.statusBadge || prev.badge,
            headline: cfg.headline || prev.headline,
            subheadline: cfg.subheadline || prev.subheadline,
            avatarUrl: cfg.avatarUrl || prev.avatarUrl,
          }));

          if (cfg.attributes?.length) {
            setAttributes(
              cfg.attributes.map((a: any, i: number) => ({
                id: `db-attr-${i}`,
                label: a.label,
                displayValue: a.displayValue,
                fillPercent: a.fillPercent,
                tier: a.fillPercent >= 95 ? "S-TIER" : "A-TIER",
                category: "SYSTEM_BENCHMARK",
              }))
            );
          }
        }

        // Live populated architecture loadouts
        if (data.populatedSlots?.length) {
          setLoadouts(data.populatedSlots);
        }

        // Live links from DB
        if (data.links) {
          const l = data.links;
          setLinks([
            {
              id: "link-gh",
              label: "GitHub",
              url: l.github || "https://github.com/Gauhar-1",
              keyBind: "G",
              icon: "github",
              tooltip: "Inspect Production Source Code [Press G]",
            },
            {
              id: "link-li",
              label: "LinkedIn",
              url: l.linkedin || "https://linkedin.com/in/mdgoharkhan",
              keyBind: "L",
              icon: "linkedin",
              tooltip: "Verify Professional Record [Press L]",
            },
            {
              id: "link-x",
              label: "X / Twitter",
              url: l.x || "https://x.com",
              keyBind: "X",
              icon: "twitter",
              tooltip: "Follow Technical Signals [Press X]",
            },
            {
              id: "link-mail",
              label: "Email Intel",
              url: l.email ? `mailto:${l.email}` : "mailto:mustakkhan1210@gmail.com",
              keyBind: "M",
              icon: "mail",
              tooltip: "Direct Operator Uplink [Press M]",
            },
            {
              id: "link-resume",
              label: "Download Intel (Resume)",
              url: l.resumeUrl || "/resume.pdf",
              keyBind: "R",
              icon: "download",
              isPrimary: true,
              tooltip: "Retrieve Confidential Dossier [Press R]",
            },
          ]);
        }
      } catch (err) {
        console.warn("[HeroLab] Hydration from /api/hero skipped, using defaults:", err);
      }
    }

    fetchHeroData();
  }, []);

  // ── 2. Active Theme Calculation: Default Operator Theme vs Company Theme ──
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
    return loadouts[0] || TACTICAL_LOADOUTS[0];
  }, [activeSlotIndex, loadouts]);

  // ── 3. Global Keyboard Shortcuts (0: Default, 1-4: Loadouts, G/L/X/M/R: Comms) ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      const key = e.key.toUpperCase();

      // Key 0 or Escape: Reset to Default Operator Theme
      if (e.key === "0" || e.key === "Escape") {
        e.preventDefault();
        setActiveSlotIndex(null);
        return;
      }

      // Keys 1, 2, 3, 4: Equip corresponding slot
      if (["1", "2", "3", "4"].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        if (slotIdx >= 0 && slotIdx < loadouts.length) {
          e.preventDefault();
          setActiveSlotIndex((prev) => (prev === slotIdx ? null : slotIdx));
          return;
        }
      }

      // Comms Hotkeys: G, L, X, M, R
      const matchLink = links.find((l) => l.keyBind === key);
      if (matchLink) {
        e.preventDefault();
        if (matchLink.isPrimary) {
          const dl = document.createElement("a");
          dl.href = matchLink.url;
          dl.download = "MD_Gohar_Khan_Resume.pdf";
          document.body.appendChild(dl);
          dl.click();
          document.body.removeChild(dl);
        } else {
          window.open(matchLink.url, matchLink.url.startsWith("http") ? "_blank" : "_self");
        }
      }
    },
    [loadouts.length, links]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-700"
      style={
        {
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
          "--theme-primary": activeTheme.primaryHex,
          "--theme-bg": activeTheme.backgroundHex,
          "--theme-text": activeTheme.textHex,
        } as React.CSSProperties
      }
    >
      {/* ── 1. Top Tactical HUD Header ── */}
      <TacticalHeader
        activeLoadout={displayLoadout}
        identity={identity}
        activeSlotIndex={activeSlotIndex}
      />

      {/* ── 2. Tactical Hero Section ── */}
      <section
        id="tactical-hero"
        aria-label="Tactical Operator Dossier and Loadout"
        className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 pt-4 pb-6 transition-colors duration-700"
        style={{ backgroundColor: "var(--theme-bg)" }}
      >
        {/* Ambient Hex / Precision Tech Background Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--theme-text) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--theme-text) 14%, transparent) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Dynamic Volumetric Spot Glow that follows --theme-primary */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 transition-colors duration-700 pointer-events-none"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary) 16%, var(--theme-bg))",
            }}
          />
        </div>

        {/* Tactical 3-Zone FPS Operator Grid */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 my-auto">
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

      {/* ── 3. Seamless Handshake: ExperienceSection Stack ── */}
      <section id="experience-stack" className="relative z-20">
        <ExperienceSection />
      </section>

      {/* ── 4. AEO & Semantic Search Crawler Block (Hidden for AI Agents) ── */}
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
              <p>Pipeline: {loadout.pipeline?.join(" -> ")}</p>
              <ul>
                {loadout.combatStats?.map((stat) => (
                  <li key={stat.label}>{stat.label}: {stat.value}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
