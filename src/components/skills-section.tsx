'use client';

import { useEffect, useState, useRef } from 'react';
import { TechIcon } from '@/components/icons';
import {
  Crosshair, Shield, Database, Terminal,
  Zap, Globe, Cpu, Wifi, Lock, Unlock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Skill = {
  _id: string;
  name: string;
  icon: string;
  category: string;
};

type GroupedSkills = {
  [key: string]: Skill[];
};

const SkillsSection = () => {
  const [skills, setSkills] = useState<GroupedSkills>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // --- DATA FETCH ---
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        if (!res.ok) throw new Error('Failed');
        const data: Skill[] = await res.json();
        const grouped = data.reduce((acc, skill) => {
          const { category } = skill;
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill);
          return acc;
        }, {} as GroupedSkills);
        setSkills(grouped);
      } catch (error) { console.error(error); }
    };
    fetchSkills();
  }, []);

  // --- ANIMATION ---
  useGSAP(() => {
    if (Object.keys(skills).length === 0 || !pathRef.current) return;

    // 1. Draw the Path based on Scroll
    const pathLength = pathRef.current.getTotalLength();

    // Set initial state (hidden path)
    gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 2. Unlock Sectors (Nodes)
    const sectors = gsap.utils.toArray('.sector-node');
    sectors.forEach((sector: any) => {
      const lockIcon = sector.querySelector('.sector-lock');
      const unlockIcon = sector.querySelector('.sector-unlock');
      const content = sector.querySelector('.sector-content');
      const skills = sector.querySelectorAll('.skill-unit');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sector,
          start: "top 60%", // Unlock when center-screen
          toggleActions: "play none none reverse"
        }
      });

      tl.to(sector, { opacity: 1, scale: 1, duration: 0.3 })
        .to(lockIcon, { opacity: 0, scale: 0, duration: 0.2 })
        .to(unlockIcon, { opacity: 1, scale: 1, rotate: 360, duration: 0.4 }, "<")
        .to(content, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(skills,
          { scale: 0, opacity: 0, x: -20 },
          { scale: 1, opacity: 1, x: 0, stagger: 0.05, ease: "back.out(1.7)" },
          "-=0.2"
        );
    });

  }, { scope: containerRef, dependencies: [skills] });

  return (
    <section ref={containerRef} id="skills" className="relative py-32 bg-[#050505] overflow-hidden min-h-screen">

      {/* --- BACKGROUND MAP TEXTURE --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* --- THE CONNECTING LASER PATH (SVG) --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <svg ref={svgRef} className="w-full h-full overflow-visible">
          {/* Define Gradient */}
          <defs>
            <linearGradient id="laserGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="10%" stopColor="#10b981" />
              <stop offset="90%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* The Path Line (Calculated purely vertically for simplicity in this responsive view) */}
          <path
            ref={pathRef}
            d="M 20,0 V 10000" // Simple vertical line on mobile, we move it via CSS for desktop
            className="stroke-[4px] stroke-emerald-500 fill-none shadow-[0_0_20px_#10b981] hidden md:block"
            style={{ transform: 'translateX(50vw)' }} // Center screen
          />
        </svg>
        {/* Mobile fallback line */}
        <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-slate-800">
          <div className="w-full bg-emerald-500 fixed top-0 h-screen opacity-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* --- HEADER --- */}
        <div className="text-center mb-32 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-500 text-xs font-mono tracking-[0.3em] mb-4 animate-pulse">
            <Wifi className="w-3 h-3" />
            SECTOR_MAP_LOADED
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            Skill <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700">Progression</span>
          </h2>
        </div>

        {/* --- SECTOR NODES (Vertical Stack) --- */}
        <div className="flex flex-col items-center space-y-32 pb-32">
          {Object.entries(skills).map(([category, skillItems], idx) => (
            <div key={category} className="sector-node relative w-full max-w-4xl opacity-50 scale-95 transition-all duration-500">

              {/* The Central "Node" on the line */}
              <div className="absolute left-0 md:left-1/2 top-8 md:-translate-x-1/2 w-16 h-16 bg-[#0a0a0a] border-4 border-slate-700 rounded-full flex items-center justify-center z-20 shadow-2xl group">
                {/* Locked State */}
                <Lock className="sector-lock w-6 h-6 text-slate-500 absolute" />
                {/* Unlocked State */}
                <div className="sector-unlock absolute opacity-0">
                  <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50"></div>
                  <Unlock className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              {/* The Card Content */}
              <div className={cn(
                "sector-content opacity-0 translate-y-10 flex flex-col md:flex-row items-start gap-8 md:gap-16 pt-4 pl-20 md:pl-0",
                // Alternate Left/Right layout on desktop
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}>

                {/* TEXT BLOCK */}
                <div className={cn("flex-1 pt-4", idx % 2 === 0 ? "md:text-right" : "md:text-left")}>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                    SECTOR {idx + 1}: <span className="text-emerald-500">{category}</span>
                  </h3>
                  <p className="font-mono text-slate-400 text-sm leading-relaxed mb-4">
                            // DEPLOYING ASSETS... <br />
                            // {skillItems.length} MODULES DETECTED. <br />
                            // OPTIMIZATION LEVEL: MAX
                  </p>
                  <div className={cn("h-1 w-24 bg-emerald-800 mt-4", idx % 2 === 0 ? "ml-auto" : "mr-auto")}>
                    <div className="h-full bg-emerald-400 w-[60%] animate-pulse"></div>
                  </div>
                </div>

                {/* SKILLS GRID */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                  {skillItems.map((skill) => (
                    <div key={skill._id} className="skill-unit group relative bg-slate-900/80 border border-slate-700 hover:border-emerald-500/50 p-3 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      {/* Corner cut */}
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/30 group-hover:border-emerald-500 transition-colors"></div>

                      <div className="text-slate-400 group-hover:text-white transition-colors scale-90 group-hover:scale-110 duration-300">
                        <TechIcon name={skill.icon} className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-bold font-mono text-slate-500 group-hover:text-emerald-400 uppercase tracking-wider text-center leading-none">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Connecting Horizontal Line (Decor) */}
              <div className={cn(
                "hidden md:block absolute top-16 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0",
                idx % 2 === 0 ? "right-1/2 origin-right" : "left-1/2 origin-left"
              )}></div>

            </div>
          ))}
        </div>

        {/* --- END OF LINE --- */}
        <div className="flex justify-center pb-20">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <div className="w-[2px] h-24 bg-gradient-to-b from-emerald-500 to-transparent"></div>
            <div className="text-center">
              <Database className="w-6 h-6 text-emerald-900 mx-auto mb-2" />
              <span className="text-[10px] font-mono text-slate-600 tracking-[0.5em]">END_OF_TREE</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;