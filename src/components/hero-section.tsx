'use client';

import Link from 'next/link';
import {
    Crosshair, Shield, Zap, Terminal,
    Cpu, Globe, Database,
    Code2
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Loader from './liquidLoader';

gsap.registerPlugin(useGSAP);

type Links = {
    github?: string;
    linkedin?: string;
    x?: string;
    email?: string;
    profilePhotoUrl?: string;
};

// --- COMPONENT: RADAR CHART (THE "WEAPON STATS") ---
const RadarStats = () => {
    return (
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            {/* Background Grid (Hexagon) */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 stroke-slate-400 stroke-[0.5] fill-none">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
                <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" />
                <line x1="50" y1="50" x2="50" y2="10" />
                <line x1="50" y1="50" x2="90" y2="30" />
                <line x1="50" y1="50" x2="90" y2="70" />
                <line x1="50" y1="50" x2="50" y2="90" />
                <line x1="50" y1="50" x2="10" y2="70" />
                <line x1="50" y1="50" x2="10" y2="30" />
            </svg>

            {/* The Data Shape (Animated) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                <polygon
                    className="fill-emerald-500/30 stroke-emerald-500 stroke-[1.5] animate-pulse-slow"
                    points="50,15 85,35 80,65 50,85 15,65 20,35" // Hardcoded "High Stats" shape
                />
            </svg>

            {/* Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[8px] font-mono text-emerald-500 tracking-wider">FRONTEND</div>
            <div className="absolute top-[25%] right-[-10px] text-[8px] font-mono text-slate-500 tracking-wider">BACKEND</div>
            <div className="absolute bottom-[25%] right-[-10px] text-[8px] font-mono text-slate-500 tracking-wider">DEVOPS</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[8px] font-mono text-slate-500 tracking-wider">UI/UX</div>
            <div className="absolute bottom-[25%] left-[-10px] text-[8px] font-mono text-slate-500 tracking-wider">SYS_ARCH</div>
            <div className="absolute top-[25%] left-[-10px] text-[8px] font-mono text-slate-500 tracking-wider">SPEED</div>
        </div>
    );
};

// --- COMPONENT: ATTACHMENT SLOT (TECH STACK) ---
const AttachmentSlot = ({ label, value, icon, delay }: any) => (
    <div className="attachment-slot flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-emerald-500/70">{label}</span>
                <span className="text-sm font-bold text-slate-200 uppercase tracking-tight group-hover:text-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">{value}</span>
            </div>
        </div>
        {/* Connection Line */}
        <div className="flex-1 h-[1px] bg-slate-800 mx-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </div>
        {/* Status Node */}
        <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors"></div>
    </div>
);

interface heroProps {
    initialLinks: Links;
}

const HeroSection = ({ initialLinks }: heroProps) => {
    const [links] = useState<Links>(initialLinks);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Initial Blackout to HUD Boot
        tl.fromTo(".hud-boot", { opacity: 0 }, { opacity: 1, duration: 0.2, repeat: 2, yoyo: true })

            // 2. Elements Slide In
            .fromTo(".left-panel", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
            .fromTo(".attachment-slot", { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, "-=0.5")

            // 3. Operator Reveal
            .fromTo(".operator-img", { opacity: 0, scale: 1.1, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5 }, "-=1");

        // Breathing Animation
        gsap.to(".operator-container", { y: -10, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });

    }, { scope: containerRef });



    return (
        <section
            ref={containerRef}
            id="home"
            className="relative min-h-screen w-full bg-[#080808] overflow-hidden flex items-center font-sans text-slate-200"
        >
            {/* --- GLOBAL CSS --- */}
            <style jsx global>{`
        .bg-grid-hex {
            background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L40 10 L40 30 L20 40 L0 30 L0 10 Z' fill='none' stroke='%231e293b' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E");
        }
      `}</style>

            {/* --- BACKGROUND LAYERS --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-hex z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
                {/* Volumetric Light */}
                <div className="absolute top-[-10%] right-[10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] z-0"></div>
            </div>

            {/* --- OPERATOR (RIGHT SIDE) --- */}
            <div className="absolute top-0 right-0 h-full w-full md:w-[60%] z-0 operator-container">
                <div
                    className="operator-img absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${links.profilePhotoUrl || 'https://picsum.photos/seed/gohar/800/1000'})`,
                        maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)'
                    }}
                ></div>
                {/* Floating 'Point' Markers on the Body */}
                <div className="absolute top-[30%] right-[40%] hidden md:flex items-center gap-2 opacity-50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[9px] font-mono text-emerald-500 bg-black/50 px-1">HEADSET_ACTIVE</span>
                </div>
            </div>

            <div className="container mx-auto px-4 h-full relative z-20 pt-20 pb-10 flex items-center">

                {/* --- LEFT PANEL: THE GUNSMITH UI --- */}
                <div className="left-panel w-full max-w-2xl bg-[#0F1115]/90 backdrop-blur-sm border border-slate-800 p-1 relative">

                    {/* Decorative Corner Brackets */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-emerald-500"></div>

                    <div className="p-6 md:p-10 relative overflow-hidden">

                        {/* Top Bar: Rank & Name */}
                        <div className="flex justify-between items-start border-b border-slate-800 pb-6 mb-8">
                            <div>
                                <div className="flex items-center gap-2 text-yellow-500 font-mono text-[10px] font-bold tracking-[0.3em] mb-2 uppercase">
                                    <Zap className="w-3 h-3 fill-yellow-500" />
                                    Blueprint: Prestige Master
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                                    Gohar<span className="text-emerald-600">.Dev</span>
                                </h1>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Total XP</div>
                                <div className="text-2xl font-black text-white font-mono">1,405,920</div>
                            </div>
                        </div>

                        {/* Main Grid: Description vs Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                            {/* Column 1: Description (The "Weapon Lore") */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Terminal className="w-3 h-3 text-emerald-500" />
                                        System Description
                                    </h3>
                                    <p className="text-sm text-slate-400 font-mono leading-relaxed text-justify">
                                        High-caliber <span className="text-emerald-400">Full-Stack Architect</span> configured for rapid deployment in complex web environments.
                                        Optimized for scalability, security, and low-latency performance.
                                        Comes pre-equipped with advanced MERN stack integration.
                                    </p>
                                </div>

                                {/* "Pros" List */}
                                <div className="bg-emerald-950/20 border border-emerald-500/20 p-4">
                                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Tactical Advantages</h4>
                                    <ul className="space-y-1">
                                        {['Scalable Architecture', 'Real-time Comms', 'Clean Codebase', 'Fast Deployment'].map(pro => (
                                            <li key={pro} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Link href="#projects" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black h-12 flex items-center justify-center font-bold uppercase tracking-widest text-xs clip-path-slant transition-colors">
                                        <Crosshair className="w-4 h-4 mr-2" />
                                        Deploy
                                    </Link>
                                    <Link href="#contact" className="flex-1 border border-slate-600 hover:border-white text-slate-400 hover:text-white h-12 flex items-center justify-center font-bold uppercase tracking-widest text-xs clip-path-slant transition-colors">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Intel
                                    </Link>
                                </div>
                            </div>

                            {/* Column 2: The "Attachments" (Tech Stack) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                        Modifications (5/5)
                                    </h3>
                                    <Link href="#skills" className="text-[10px] text-emerald-500 hover:text-white underline decoration-dashed">
                                        EDIT LOADOUT
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    <AttachmentSlot label="OPTIC" value="Next.js 14" icon={<Globe className="w-4 h-4" />} />
                                    <AttachmentSlot label="BARREL" value="TypeScript" icon={<Code2 className="w-4 h-4" />} />
                                    <AttachmentSlot label="MUZZLE" value="React.js" icon={<Cpu className="w-4 h-4" />} />
                                    <AttachmentSlot label="MAGAZINE" value="MongoDB" icon={<Database className="w-4 h-4" />} />
                                    <AttachmentSlot label="UNDERBARREL" value="Node.js" icon={<Terminal className="w-4 h-4" />} />
                                </div>

                                {/* The Radar Chart (At the bottom of stack) */}
                                <div className="mt-6 flex justify-center border-t border-slate-800 pt-6">
                                    <RadarStats />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* --- BOTTOM HUD BAR --- */}
                <div className="hud-boot fixed bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-30 opacity-0">
                    <div className="flex gap-2">
                        <div className="w-2 h-8 bg-emerald-500 animate-pulse"></div>
                        <div className="flex flex-col justify-between h-8">
                            <span className="text-[10px] font-mono text-emerald-500 font-bold leading-none">SQUAD: SOLO</span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold leading-none">MIC: MUTED</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 border border-slate-600 rounded-full flex items-center justify-center text-[8px]">ESC</span>
                            <span className="text-[10px] font-bold uppercase">BACK</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-12 h-3 bg-white/20 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase text-white">CONNECTING...</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;