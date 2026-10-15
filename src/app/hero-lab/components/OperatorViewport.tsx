"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Crosshair, Shield, Cpu } from "lucide-react";
import { TacticalLoadout } from "../constants/operator-data";

interface OperatorViewportProps {
  activeLoadout: TacticalLoadout;
  avatarUrl: string;
  badge: string;
  callsign: string;
  baseNode: string;
}

export default function OperatorViewport({
  activeLoadout,
  avatarUrl,
  badge,
  callsign,
  baseNode,
}: OperatorViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  // 3D Parallax Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 250, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 250, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    rotateX.set((-y / (rect.height / 2)) * 8);
    rotateY.set((x / (rect.width / 2)) * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center [perspective:1000px] w-full max-w-sm sm:max-w-md mx-auto py-2"
    >
      {/* Dynamic Ambient Volumetric Rim-Glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-[90px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)`,
        }}
      />

      {/* Main Tactical Viewport Frame */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-bg) 92%, var(--theme-text) 4%)",
          borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
        }}
      >
        {/* Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
        <div
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 z-30 transition-colors duration-500 pointer-events-none"
          style={{ borderColor: "var(--theme-primary)" }}
        />
        <div
          className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 z-30 transition-colors duration-500 pointer-events-none"
          style={{ borderColor: "var(--theme-primary)" }}
        />
        <div
          className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 z-30 transition-colors duration-500 pointer-events-none"
          style={{ borderColor: "var(--theme-primary)" }}
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 z-30 transition-colors duration-500 pointer-events-none"
          style={{ borderColor: "var(--theme-primary)" }}
        />

        {/* Top Viewport HUD Overlay Bar */}
        <div className="absolute top-3 inset-x-4 z-20 flex items-center justify-between text-[8px] font-mono tracking-widest pointer-events-none">
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg) 94%, black)",
              borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
              color: "color-mix(in srgb, var(--theme-text) 80%, var(--theme-bg))",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: "var(--theme-primary)" }}
            />
            <span>HUD // FEED: LIVE</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-bg) 94%, black)",
              borderColor: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
              color: "color-mix(in srgb, var(--theme-text) 60%, var(--theme-bg))",
            }}
          >
            <Crosshair className="h-2.5 w-2.5" style={{ color: "var(--theme-primary)" }} />
            <span>OPTICAL_TARGETING</span>
          </div>
        </div>

        {/* Operator Image Layer with Duotone & Vignette */}
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          {!imageError ? (
            <Image
              src={avatarUrl || "/Gauhar.png"}
              alt={`Operator ${callsign}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              onError={() => setImageError(true)}
              className="object-cover object-top scale-105 transition-transform duration-700 hover:scale-110 filter contrast-110 brightness-95"
            />
          ) : (
            // Tactical Silhouette Fallback if image fails
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ backgroundColor: "var(--theme-bg)" }}
            >
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-4 transition-colors duration-500"
                style={{
                  borderColor: "var(--theme-primary)",
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, var(--theme-bg))",
                }}
              >
                <Cpu className="w-12 h-12" style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: "var(--theme-text)" }}>
                {callsign}
              </span>
              <span
                className="text-[10px] font-mono mt-1"
                style={{ color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))" }}
              >
                AVATAR_FALLBACK_RENDER
              </span>
            </div>
          )}

          {/* Tactical Duotone / Radial Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, var(--theme-bg) 0%, transparent 60%, color-mix(in srgb, var(--theme-bg) 40%, black) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-color transition-colors duration-700"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />

          {/* CRT Scanline Overlay Effect */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)",
              backgroundSize: "100% 4px",
            }}
          />

          {/* Center Tactical Crosshair Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div
              className="w-32 h-32 rounded-full border border-dashed transition-colors duration-500"
              style={{ borderColor: "var(--theme-primary)" }}
            />
            <div
              className="absolute w-44 h-44 rounded-full border transition-colors duration-500 opacity-20"
              style={{ borderColor: "var(--theme-primary)" }}
            />
          </div>
        </div>

        {/* Floating Deployment Badge */}
        <div className="absolute bottom-10 inset-x-4 z-20 flex justify-center pointer-events-none">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border backdrop-blur-md shadow-lg transition-all duration-500"
            style={{
              borderColor: "var(--theme-primary)",
              backgroundColor: "color-mix(in srgb, var(--theme-primary) 18%, var(--theme-bg))",
              color: "var(--theme-text)",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent)",
            }}
          >
            <Shield className="h-3 w-3" style={{ color: "var(--theme-primary)" }} />
            <span>{badge}</span>
          </div>
        </div>

        {/* Bottom Coordinate Telemetry Strip */}
        <div
          className="absolute bottom-2 inset-x-4 z-20 flex items-center justify-between text-[7.5px] font-mono pointer-events-none border-t pt-1.5"
          style={{
            borderColor: "color-mix(in srgb, var(--theme-text) 14%, transparent)",
            color: "color-mix(in srgb, var(--theme-text) 54%, var(--theme-bg))",
          }}
        >
          <span className="truncate">{baseNode}</span>
          <span className="font-bold" style={{ color: "var(--theme-primary)" }}>
            SECTOR // 01
          </span>
        </div>
      </motion.div>
    </div>
  );
}
