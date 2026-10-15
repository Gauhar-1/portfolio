"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Download,
  Terminal,
  Activity,
} from "lucide-react";
import {
  OperatorIdentity,
  OperatorAttribute,
  IntelLink,
  TacticalLoadout,
} from "../constants/operator-data";

interface OperatorDossierProps {
  activeLoadout: TacticalLoadout;
  identity: OperatorIdentity;
  attributes: OperatorAttribute[];
  links: IntelLink[];
}

export default function OperatorDossier({
  activeLoadout,
  identity,
  attributes,
  links,
}: OperatorDossierProps) {
  const getIcon = (type: IntelLink["icon"]) => {
    switch (type) {
      case "github":
        return <Github className="h-3.5 w-3.5" />;
      case "linkedin":
        return <Linkedin className="h-3.5 w-3.5" />;
      case "twitter":
        return <Twitter className="h-3.5 w-3.5" />;
      case "mail":
        return <Mail className="h-3.5 w-3.5" />;
      case "download":
        return <Download className="h-3.5 w-3.5" />;
    }
  };

  return (
    <section className="flex flex-col justify-between space-y-6 w-full lg:max-w-md xl:max-w-lg z-20">
      {/* ── 1. Operator Header & Identity Dossier ── */}
      <header className="space-y-3">
        {/* Callsign Strip */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors duration-500"
            style={{
              borderColor: "var(--theme-primary)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))",
              color: "var(--theme-primary)",
            }}
          >
            <Terminal className="h-3 w-3" />
            <span>OPERATOR // 0-TO-1 SPECIALIST</span>
          </div>
          <span
            className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline"
            style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
          >
            NITS // 2026
          </span>
        </div>

        {/* Primary Name & Class Title */}
        <h1
          className="text-3xl sm:text-4xl xl:text-5xl font-black font-sans tracking-tight uppercase leading-[1.05]"
          style={{ color: "var(--theme-text)" }}
        >
          {identity.callsign.replace(/^OP \/\/\s*/i, "").split(" ")[0]}{" "}
          <span style={{ color: "var(--theme-primary)" }}>
            {identity.callsign.replace(/^OP \/\/\s*/i, "").split(" ").slice(1).join(" ") || "KHAN"}
          </span>
        </h1>

        <h2
          className="text-xs font-mono font-bold tracking-[0.25em] uppercase"
          style={{ color: "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))" }}
        >
          {identity.classTitle}
        </h2>

        {/* High-Impact Tactical Headline */}
        <p
          className="text-sm font-sans font-medium leading-relaxed border-l-2 pl-3 py-0.5"
          style={{
            borderColor: "var(--theme-primary)",
            color: "color-mix(in srgb, var(--theme-text) 86%, var(--theme-bg))",
          }}
        >
          {identity.headline}
        </p>

        {/* Sub-headline Credentials */}
        <p
          className="text-xs font-mono leading-normal"
          style={{ color: "color-mix(in srgb, var(--theme-text) 60%, var(--theme-bg))" }}
        >
          {identity.subheadline}
        </p>
      </header>

      {/* ── 2. Core Operator Attributes (FPS Stat Bars) ── */}
      <div
        className="space-y-3 border rounded-xl p-3.5 backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
          borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
        }}
      >
        <div
          className="flex items-center justify-between text-[10px] font-mono border-b pb-2"
          style={{ borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)" }}
        >
          <span
            className="font-bold uppercase flex items-center gap-1.5"
            style={{ color: "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))" }}
          >
            <Activity className="h-3 w-3" style={{ color: "var(--theme-primary)" }} />
            COMBAT TELEMETRY // STATS
          </span>
          <span
            className="font-mono text-[9px]"
            style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
          >
            S-TIER BENCHMARKS
          </span>
        </div>

        <dl className="space-y-2.5">
          {attributes.map((attr, idx) => (
            <div key={attr.id || attr.label} className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono">
                <dt
                  className="font-bold tracking-tight"
                  style={{ color: "color-mix(in srgb, var(--theme-text) 80%, var(--theme-bg))" }}
                >
                  {attr.label}
                </dt>
                <dd className="font-bold font-mono" style={{ color: "var(--theme-primary)" }}>
                  {attr.displayValue}
                </dd>
              </div>

              {/* Stat Progress Bar with Military Ticks */}
              <div
                className="h-1.5 w-full rounded-full overflow-hidden p-[1px] relative"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, var(--theme-text) 4%)",
                  border: "1px solid color-mix(in srgb, var(--theme-text) 12%, transparent)",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${attr.fillPercent}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full relative"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    boxShadow: "0 0 10px var(--theme-primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* ── 3. Quick-Equip Comms Dock ── */}
      <nav aria-label="Comms & Intel Links" className="space-y-2 pt-1">
        <div
          className="text-[9px] font-mono uppercase tracking-widest flex items-center justify-between"
          style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
        >
          <span>QUICK-EQUIP COMMS DOCK</span>
          <span className="text-[8px]">[CLICK OR PRESS HOTKEY]</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {links.map((link) => {
            const isDownload = link.isPrimary;
            return (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                download={isDownload ? true : undefined}
                title={link.tooltip}
                className="group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono transition-all duration-300 border focus:outline-none"
                style={{
                  borderColor: isDownload
                    ? "var(--theme-primary)"
                    : "color-mix(in srgb, var(--theme-text) 16%, transparent)",
                  backgroundColor: isDownload
                    ? "color-mix(in srgb, var(--theme-primary) 18%, var(--theme-bg))"
                    : "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
                  color: isDownload
                    ? "var(--theme-primary)"
                    : "color-mix(in srgb, var(--theme-text) 82%, var(--theme-bg))",
                  boxShadow: isDownload
                    ? "0 0 16px color-mix(in srgb, var(--theme-primary) 30%, transparent)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="shrink-0 transition-transform group-hover:scale-110"
                    style={{ color: isDownload ? "var(--theme-primary)" : "inherit" }}
                  >
                    {getIcon(link.icon)}
                  </span>
                  <span className="font-semibold text-[11px] truncate">{link.label}</span>
                </div>

                {/* Hotkey Pill */}
                <kbd
                  className="ml-1.5 shrink-0 px-1 py-0.2 rounded text-[8px] font-bold border transition-colors"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, var(--theme-text) 4%)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
                    color: "color-mix(in srgb, var(--theme-text) 60%, var(--theme-bg))",
                  }}
                >
                  [{link.keyBind}]
                </kbd>
              </a>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
