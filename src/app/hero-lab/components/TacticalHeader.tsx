"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wifi, Activity, Terminal, Zap } from "lucide-react";
import { OperatorIdentity, TacticalLoadout } from "../constants/operator-data";

interface TacticalHeaderProps {
  activeLoadout: TacticalLoadout;
  identity: OperatorIdentity;
  activeSlotIndex: number | null;
}

export default function TacticalHeader({
  activeLoadout,
  identity,
  activeSlotIndex,
}: TacticalHeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="w-full border-b backdrop-blur-md sticky top-0 z-50 px-4 py-2.5 transition-colors duration-700"
      style={{
        backgroundColor: "color-mix(in srgb, var(--theme-bg) 85%, transparent)",
        borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Call-sign & Identity Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div
              className="relative flex h-7 w-7 items-center justify-center rounded border transition-all duration-300"
              style={{
                borderColor: "var(--theme-primary)",
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))",
                boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary) 25%, transparent)",
              }}
            >
              <Terminal className="h-3.5 w-3.5" style={{ color: "var(--theme-primary)" }} />
              <div
                className="absolute top-0 w-full h-[1px] animate-pulse"
                style={{ backgroundColor: "var(--theme-primary)" }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-xs font-black tracking-wider transition-colors"
                style={{ color: "var(--theme-text)" }}
              >
                {identity.callsign}
              </span>
              <span
                className="text-[8px] font-mono tracking-[0.2em]"
                style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
              >
                {identity.classTitle}
              </span>
            </div>
          </Link>

          {/* Active Blueprint Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border transition-all duration-500"
            style={{
              borderColor: activeSlotIndex !== null
                ? "var(--theme-primary)"
                : "color-mix(in srgb, var(--theme-text) 20%, transparent)",
              backgroundColor: activeSlotIndex !== null
                ? "color-mix(in srgb, var(--theme-primary) 12%, var(--theme-bg))"
                : "color-mix(in srgb, var(--theme-bg) 92%, var(--theme-text) 8%)",
              color: activeSlotIndex !== null
                ? "var(--theme-primary)"
                : "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))",
            }}
          >
            <Zap className="h-2.5 w-2.5 animate-pulse" />
            <span>
              {activeSlotIndex !== null
                ? `ACTIVE LOADOUT [${activeLoadout.slotNumber}]`
                : "DEFAULT OPERATOR THEME [0]"}
            </span>
          </div>
        </div>

        {/* Center: Tactical Keybind Hints */}
        <div
          className="hidden lg:flex items-center gap-2 text-[10px] font-mono px-3 py-1 rounded-full border"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
            borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)",
            color: "color-mix(in srgb, var(--theme-text) 64%, var(--theme-bg))",
          }}
        >
          <span className="font-semibold" style={{ color: "var(--theme-text)" }}>HOTKEYS:</span>
          <span className="flex items-center gap-1">
            <kbd
              className="px-1.5 py-0.2 rounded border text-[9px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, black)",
                borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              0
            </kbd>
            <span>DEFAULT</span>
          </span>
          <span className="opacity-40">&bull;</span>
          <span className="flex items-center gap-1">
            <kbd
              className="px-1.5 py-0.2 rounded border text-[9px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, black)",
                borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              1-4
            </kbd>
            <span>LOADOUTS</span>
          </span>
          <span className="opacity-40">&bull;</span>
          <span className="flex items-center gap-1">
            <kbd
              className="px-1.5 py-0.2 rounded border text-[9px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, black)",
                borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              G
            </kbd>
            <kbd
              className="px-1.5 py-0.2 rounded border text-[9px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, black)",
                borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              L
            </kbd>
            <kbd
              className="px-1.5 py-0.2 rounded border text-[9px] font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-bg) 96%, black)",
                borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              R
            </kbd>
            <span>COMMS</span>
          </span>
        </div>

        {/* Right: Telemetry & Clock */}
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div
            className="hidden md:flex items-center gap-2"
            style={{ color: "color-mix(in srgb, var(--theme-text) 60%, var(--theme-bg))" }}
          >
            <Wifi className="h-3 w-3" style={{ color: "var(--theme-primary)" }} />
            <span className="font-bold" style={{ color: "var(--theme-text)" }}>NET_OK</span>
            <span style={{ color: "color-mix(in srgb, var(--theme-text) 45%, var(--theme-bg))" }}>&lt;12ms</span>
          </div>

          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
              borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)",
              color: "color-mix(in srgb, var(--theme-text) 76%, var(--theme-bg))",
            }}
          >
            <Activity className="h-3 w-3 animate-pulse" style={{ color: "var(--theme-primary)" }} />
            <span>60 FPS</span>
          </div>

          <div
            className="flex items-center gap-1.5 font-mono font-bold tracking-widest"
            style={{ color: "var(--theme-text)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: "var(--theme-primary)" }}
            />
            <span>{time || "00:00:00"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
