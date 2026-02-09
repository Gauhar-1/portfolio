'use client';

import Image from 'next/image';
import { ExternalLink, Github, Globe, Target, Cpu, Wifi, ChevronRight, MousePointer2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { PROJECT_SPOTLIGHT_DATA } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Project = {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
};

const ProjectSpotlight = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null); // The container we Pin
  const trackRef = useRef<HTMLDivElement>(null);   // The long horizontal strip

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/projects');
        const data: Project[] = await res.json();
        
        const regularProjects = data.filter(p => p.title !== PROJECT_SPOTLIGHT_DATA.title);
        const specialProject = data.find(p => p.title === PROJECT_SPOTLIGHT_DATA.title);
        const sortedProjects = specialProject ? [specialProject, ...regularProjects] : regularProjects;

        setProjects(sortedProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useGSAP(() => {
    if (isLoading || projects.length === 0 || !trackRef.current || !wrapperRef.current) return;

    // 1. Calculate the exact distance we need to scroll horizontally
    // (Total Width of Track) - (Viewport Width)
    const getScrollAmount = () => {
        let trackWidth = trackRef.current!.scrollWidth;
        return -(trackWidth - window.innerWidth);
    };

    const tween = gsap.to(trackRef.current, {
      x: getScrollAmount, // Move left by the calculated amount
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top", // When top of section hits top of viewport
      end: () => `+=${Math.abs(getScrollAmount())}`, // Scroll duration = horizontal width
      pin: true,      // Lock the section in place
      animation: tween,
      scrub: 1,       // Smoothness
      invalidateOnRefresh: true, // Recalculate on window resize
      // markers: true, // Uncomment this if you need to debug start/end points visually
    });

    return () => {
       // Cleanup
       tween.kill();
       ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, { scope: wrapperRef, dependencies: [isLoading, projects] });

  return (
    // Added z-10 relative to ensure it sits correctly in the flow
    <section id="projects" className="bg-[#050505] relative z-10">
      
      {/* --- PINNED WRAPPER --- */}
      <div ref={wrapperRef} className="h-screen w-full overflow-hidden relative flex flex-col">
        
        {/* BACKGROUND HUD (Fixed inside the pinned wrapper) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="absolute top-8 left-0 w-full px-8 z-20 flex justify-between items-end border-b border-white/10 pb-4">
            <div>
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs tracking-[0.3em] font-bold mb-2">
                    <Wifi className="w-4 h-4 animate-pulse" />
                    SURVEILLANCE_FEED
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                    Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Log</span>
                </h2>
            </div>
            <div className="hidden md:block text-right font-mono text-xs text-slate-500">
                <p>SCROLL TO SCAN SECTOR {">>"}</p>
                <p>HOVER TO INSPECT INTEL</p>
            </div>
        </div>

        {/* --- HORIZONTAL TRACK --- */}
        {/* h-full ensures it takes the full pinned height. items-center centers cards vertically. */}
        <div ref={trackRef} className="flex h-full items-center pl-8 md:pl-32 w-max">
            
            {/* INTRO CARD */}
            <div className="op-card w-[90vw] md:w-[60vw] lg:w-[40vw] h-[60vh] flex-shrink-0 pr-8 md:pr-20 flex items-center">
                 <div className="border-l-4 border-emerald-500 pl-8">
                    <h3 className="text-6xl md:text-8xl font-black text-white/10 mb-4 select-none">
                        DEPLOYED
                    </h3>
                    <p className="text-xl md:text-2xl font-mono text-slate-400 mb-6 max-w-md">
                        Reviewing operational history for Subject <span className="text-white font-bold">Gohar-1</span>.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-emerald-500 animate-bounce">
                        <ChevronRight /> Scroll down to scan projects
                    </div>
                </div>
            </div>

            {/* PROJECT CARDS */}
            {projects.map((project, index) => (
                <div key={project._id} className="op-card w-[90vw] md:w-[600px] h-[65vh] flex-shrink-0 pr-8 md:pr-16 flex items-center justify-center">
                    <OperationCard project={project} index={index} />
                </div>
            ))}
            
            {/* SPACER (Buffer at the end so the last card isn't stuck to the edge) */}
            <div className="w-[20vw] h-full"></div>
        </div>

      </div>
    </section>
  );
};

// --- SUB-COMPONENT: The Tactical Card (Same as before) ---
const OperationCard = ({ project, index }: { project: Project, index: number }) => {
    return (
        <div className="group relative w-full h-full bg-[#0a0a0a] border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col">
            
            {/* --- IMAGE / BACKGROUND LAYER --- */}
            <div className="absolute inset-0 h-full w-full z-0 transition-transform duration-700 group-hover:scale-105">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover filter grayscale contrast-125 brightness-50 group-hover:blur-sm transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="font-mono text-xs text-slate-600">NO_VISUAL_FEED</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* --- HUD DECORATIONS --- */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="font-mono text-[10px] text-red-500 font-bold tracking-widest">LIVE</span>
            </div>
            <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-emerald-500 tracking-widest bg-black/60 px-2 py-1 backdrop-blur-sm border border-emerald-500/30">
                OP_0{index + 1}
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-600 group-hover:border-emerald-500 transition-colors z-20"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-600 group-hover:border-emerald-500 transition-colors z-20"></div>

            {/* --- HOVER INSTRUCTION --- */}
            <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                 <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <MousePointer2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-mono text-white tracking-widest">HOVER FOR INTEL</span>
                 </div>
            </div>

            {/* --- INTEL PANEL --- */}
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md transform translate-y-[85%] group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col">
                
                <div className="p-6 border-b border-white/10 shrink-0">
                    <div className="font-mono text-emerald-500 text-xs tracking-[0.2em] mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        OPERATION_NAME
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter truncate">
                        {project.title}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="font-mono text-sm text-slate-300 leading-relaxed">
                        <span className="text-emerald-600 font-bold mr-2">MISSION_BRIEF:</span>
                        {project.description}
                    </div>

                    <div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2 mb-3">
                            <Cpu className="w-3 h-3" /> Mission Assets
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map(tech => (
                                <Badge key={tech} variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/50 text-[10px] uppercase font-mono tracking-wide hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-default">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-4">
                        {project.links?.website && (
                             <a href={project.links.website} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-wider text-xs clip-path-slant transition-colors">
                                <Globe className="w-3 h-3" /> Execute
                             </a>
                        )}
                        {project.links?.github && (
                             <a href={project.links.github} target="_blank" className="flex items-center justify-center gap-2 py-3 border border-slate-600 hover:border-white text-slate-300 hover:text-white font-bold uppercase tracking-wider text-xs clip-path-slant transition-colors">
                                <Github className="w-3 h-3" /> Intel
                             </a>
                        )}
                    </div>
                </div>
                <div className="h-1 w-full bg-emerald-900 group-hover:bg-emerald-500 transition-colors duration-500 shrink-0"></div>
            </div>
        </div>
    );
};

export default ProjectSpotlight;