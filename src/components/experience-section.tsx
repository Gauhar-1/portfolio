'use client';

import { ExternalLink, Github, Fingerprint, Lock, ChevronRight, X, Maximize2, ScanLine } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- TYPES ---
type Experience = {
  _id: string;
  title: string;
  company: string;
  date: string;
  description: string;
  technologies: string[];
  links?: { website?: string; github?: string };
};

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedXP, setSelectedXP] = useState<Experience | null>(null); // TRACKS OPEN DOSSIER
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('/api/experience');
        const data = await res.json();
        setExperiences(data || []);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    fetchExperiences();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedXP(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useGSAP(() => {
  if (isLoading || !experiences.length || !sectionRef.current) return;

  const sections = gsap.utils.toArray(".mission-file");
  
  // 1. Calculate the exact overflow width
  const getScrollAmount = () => {
    const trackWidth = sectionRef.current!.scrollWidth;
    return -(trackWidth - window.innerWidth);
  };

  // 2. Create the horizontal tween
  const tween = gsap.to(sectionRef.current, {
    x: getScrollAmount,
    ease: "none",
  });

  // 3. Create the ScrollTrigger
  ScrollTrigger.create({
    trigger: triggerRef.current,
    start: "top",
    // This makes the 'scrollable height' perfectly match the content width
    end: () => `+=${Math.abs(getScrollAmount())}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true, // Recalculates if window is resized
    onUpdate: (self) => {
      if (progressRef.current) {
        gsap.to(progressRef.current, { scaleX: self.progress, duration: 0.1 });
      }
    }
  });

}, { scope: triggerRef, dependencies: [isLoading, experiences] });

  return (
    <section id="experience" className="bg-[#0f0f11] text-slate-200 overflow-hidden">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
      
      {/* --- SCROLL WRAPPER --- */}
      <div ref={triggerRef} className="relative h-screen flex flex-col justify-center">
        
        {/* --- HEADER --- */}
        <div className="absolute top-8 left-0 w-full px-8 z-20 flex justify-between items-end border-b border-white/10 pb-4">
            <div>
                <div className="flex items-center gap-2 text-red-500 font-mono text-xs tracking-[0.3em] font-bold animate-pulse">
                    <Lock className="w-3 h-3" />
                    TOP_SECRET // EYES_ONLY
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white/90 uppercase tracking-tighter mt-2">
                    Operative <span className="text-red-600">Archives</span>
                </h2>
            </div>
            <div className="hidden md:block font-mono text-xs text-slate-500 text-right">
                <p>AUTH_TOKEN: #8X-99</p>
                <p>SCROLL TO NAVIGATE // CLICK TO INSPECT</p>
            </div>
        </div>

        {/* --- HORIZONTAL CONTAINER --- */}
        <div ref={sectionRef} className="flex flex-nowrap items-center pl-8 md:pl-32 h-[70vh] w-[400%]">
            
            {/* INTRO CARD */}
            <div className="mission-file w-[90vw] md:w-[60vw] lg:w-[40vw] h-full flex-shrink-0 pr-8 md:pr-20 flex items-center">
                <div className="w-full">
                    <h3 className="text-6xl md:text-8xl font-black text-white/10 absolute -left-10 top-0 -z-10 rotate-90 origin-top-left">
                        CLASSIFIED
                    </h3>
                    <p className="text-xl md:text-2xl font-mono text-slate-400 mb-6">
                        The following files contain the operational history of Subject <span className="text-white font-bold">Gohar-1</span>.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 animate-bounce">
                        <ChevronRight /> Scroll to view files
                    </div>
                </div>
            </div>

            {/* --- EXPERIENCE FILES --- */}
            {experiences.map((xp, index) => (
                <div key={xp._id} className="mission-file w-[90vw] md:w-[60vw] lg:w-[50vw] h-full flex-shrink-0 pr-8 md:pr-16 flex items-center justify-center">
                    
                    {/* THE FILE FOLDER (Clickable) */}
                    <div 
                        onClick={() => setSelectedXP(xp)}
                        className="relative w-full h-full md:h-[90%] bg-[#1a1a1c] border border-white/5 shadow-2xl flex flex-col overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:border-amber-500/30"
                    >
                        
                        {/* Folder Tab */}
                        <div className="absolute top-0 left-0 w-32 h-8 bg-amber-600/20 border-t border-r border-amber-600/50 rounded-tr-xl flex items-center justify-center text-[10px] font-mono text-amber-500 tracking-widest font-bold">
                            FILE_{index + 1}0{index + 9}
                        </div>

                        {/* HOVER OVERLAY: "INSPECT" */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 flex flex-col items-center justify-center gap-2">
                             <Maximize2 className="w-12 h-12 text-amber-500 animate-pulse" />
                             <span className="text-amber-500 font-mono text-sm tracking-[0.3em] font-bold">OPEN_DOSSIER</span>
                        </div>

                        {/* "Stamped" Background */}
                        <div className="absolute right-10 top-10 border-4 border-red-900/20 text-red-900/20 font-black text-6xl -rotate-12 pointer-events-none select-none">
                            CONFIDENTIAL
                        </div>

                        {/* --- FILE CONTENT PREVIEW --- */}
                        <div className="flex-1 p-8 md:p-12 mt-8 flex flex-col relative z-10">
                            <div className="flex justify-between items-start mb-8 border-b border-dashed border-slate-700 pb-6">
                                <div>
                                    <div className="font-mono text-slate-500 text-xs mb-2">OPERATION:</div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-100 uppercase tracking-tight">
                                        {xp.title}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-slate-500 text-xs mb-2">TARGET:</div>
                                    <div className="text-xl font-bold text-amber-500 uppercase">{xp.company}</div>
                                </div>
                            </div>

                            <div className="flex-1 font-mono text-sm md:text-base text-slate-400 leading-relaxed relative overflow-hidden">
                                <div className="absolute -left-2 top-2 bottom-2 w-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent opacity-20"></div>
                                <div className="mb-2 text-[10px] text-slate-600">SUMMARY_REPORT:</div>
                                <p className="mb-6 line-clamp-4">
                                    {xp.description}
                                </p>
                                <div className="mt-auto pt-4 text-xs text-amber-500/70 italic">
                                    [ Click to read full brief ]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="w-[10vw]"></div>
        </div>

        {/* --- PROGRESS BAR --- */}
        <div className="absolute bottom-8 left-8 right-8 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div ref={progressRef} className="h-full bg-red-600 origin-left scale-x-0"></div>
        </div>

        {/* --- MODAL: FULL DOSSIER INSPECTOR --- */}
        {selectedXP && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                
                {/* BACKDROP */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => setSelectedXP(null)}
                ></div>

                {/* THE DOSSIER UI */}
                <div className="relative w-full max-w-4xl h-[85vh] bg-[#121214] border border-amber-500/30 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    
                    {/* DECORATIVE CORNERS */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                    {/* SCAN LINE ANIMATION */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,18,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-scan-down"></div>

                    {/* MODAL HEADER */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 relative z-10">
                        <div className="flex items-center gap-3">
                            <ScanLine className="w-5 h-5 text-amber-500 animate-pulse" />
                            <span className="font-mono text-amber-500 text-sm tracking-widest font-bold">FULL_BRIEFING_LOADED</span>
                        </div>
                        <button 
                            onClick={() => setSelectedXP(null)}
                            className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/50"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 relative z-10 custom-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-8">
                            
                            {/* TITLE BLOCK */}
                            <div className="text-center md:text-left border-b border-dashed border-slate-700 pb-8">
                                <span className="inline-block px-3 py-1 mb-4 border border-amber-500/50 text-amber-500 font-mono text-xs tracking-widest bg-amber-500/10">
                                    {selectedXP.date}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
                                    {selectedXP.title}
                                </h2>
                                <h3 className="text-2xl text-slate-400 font-bold uppercase">
                                    AT: {selectedXP.company}
                                </h3>
                            </div>

                            {/* MAIN DESCRIPTION */}
                            <div className="font-mono text-slate-300 leading-relaxed text-sm md:text-base space-y-6">
                                <p className="text-xs text-slate-500 tracking-widest">// MISSION_DETAILS:</p>
                                <p className="whitespace-pre-wrap">{selectedXP.description}</p>
                            </div>

                            {/* TECH GRID */}
                            <div className="bg-black/20 p-6 border border-white/5">
                                <div className="text-xs text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4" /> AUTHORIZED_EQUIPMENT
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {selectedXP.technologies.map(tech => (
                                        <Badge key={tech} variant="outline" className="border-slate-700 bg-slate-900/50 text-amber-500 hover:border-amber-500 rounded-sm px-3 py-1 font-mono uppercase">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* ACTION LINKS */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                {selectedXP.links?.website && (
                                    <a href={selectedXP.links.website} target="_blank" className="flex-1 min-w-[200px] flex items-center justify-center gap-3 p-4 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest transition-colors clip-path-slant">
                                        <ExternalLink className="w-5 h-5" /> Visit Deployment
                                    </a>
                                )}
                                {selectedXP.links?.github && (
                                    <a href={selectedXP.links.github} target="_blank" className="flex-1 min-w-[200px] flex items-center justify-center gap-3 p-4 border border-slate-600 hover:border-white text-slate-300 hover:text-white font-bold uppercase tracking-widest transition-colors clip-path-slant">
                                        <Github className="w-5 h-5" /> Source Code
                                    </a>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;