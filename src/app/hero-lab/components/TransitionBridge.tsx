"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TacticalLoadout } from "../constants/operator-data";

interface TransitionBridgeProps {
  activeLoadout: TacticalLoadout;
}

export default function TransitionBridge({ activeLoadout }: TransitionBridgeProps) {
  const scrollToNext = () => {
    const el = document.getElementById("experience-stack") || document.getElementById("experience");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full z-20 flex flex-col items-center justify-center pt-8 pb-4">
      {/* Subtle Horizontal Telemetry Rule */}
      <div className="w-full max-w-4xl h-px relative flex items-center justify-center mb-4">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--theme-text) 18%, transparent), transparent)`,
          }}
        />
        <div
          className="absolute h-1.5 w-16 rounded-full blur-[2px] transition-colors duration-500"
          style={{ backgroundColor: "var(--theme-primary)" }}
        />
      </div>

      {/* Interactive Scroll Down Affordance */}
      <button
        type="button"
        onClick={scrollToNext}
        className="group flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none transition-transform hover:scale-105"
        aria-label="Scroll to enter career archive"
      >
        <span
          className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase transition-colors"
          style={{ color: "color-mix(in srgb, var(--theme-text) 65%, var(--theme-bg))" }}
        >
          SCROLL TO ENTER CAREER ARCHIVE
        </span>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center h-6 w-6 rounded-full border transition-colors backdrop-blur-sm"
          style={{
            borderColor: "color-mix(in srgb, var(--theme-text) 20%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 6%)",
            color: "var(--theme-text)",
          }}
        >
          <ChevronDown className="h-3.5 w-3.5 group-hover:text-[var(--theme-primary)] transition-colors" />
        </motion.div>
      </button>

      {/* Decorative Bottom Gradient Fading into Experience Section */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top, var(--theme-bg), transparent)`,
        }}
      />
    </div>
  );
}
