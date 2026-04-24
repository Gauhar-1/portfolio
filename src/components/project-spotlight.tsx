'use client';

import Image from 'next/image';
import { ExternalLink, Github, Globe, Target, Cpu, Wifi, ChevronRight, Scan, Layers } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PROJECT_SPOTLIGHT_DATA } from '@/lib/data';

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

    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetching logic
                const res = await fetch('/api/projects');
                const data: Project[] = await res.json();

                // Sort: Highlight project first
                const regularProjects = data.filter(p => p.title !== PROJECT_SPOTLIGHT_DATA.title);
                const specialProject = data.find(p => p.title === PROJECT_SPOTLIGHT_DATA.title);
                const sortedProjects = specialProject ? [specialProject, ...regularProjects] : regularProjects;

                setProjects(sortedProjects);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                setTimeout(() => ScrollTrigger.refresh(), 200);
            }
        };
        fetchProjects();
    }, []);

    useGSAP(() => {
        if (isLoading || !projects.length || !trackRef.current || !sectionRef.current) return;

        const panels = gsap.utils.toArray(".project-panel");
        const totalPanels = panels.length;

        // 1. Total horizontal scroll width
        const getTotalScrollWidth = () => (totalPanels - 1) * window.innerWidth;

        // 2. The Horizontal Wipe
        const tween = gsap.to(panels, {
            xPercent: -100 * (totalPanels - 1),
            ease: "none",
        });

        // 3. Pin & Snap
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getTotalScrollWidth()}`,
            pin: true,
            animation: tween,
            scrub: 1.2,
            snap: {
                snapTo: 1 / (totalPanels - 1),
                duration: { min: 0.3, max: 0.8 },
                delay: 0,
                ease: "power2.inOut"
            },
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                if (progressRef.current) {
                    gsap.to(progressRef.current, { scaleX: self.progress, duration: 0.1 });
                }
            }
        });

        // 4. Image Parallax Effect (The Multi-Million Dollar Feel)
        // Images move slightly opposite to the scroll direction inside their containers
        panels.forEach((panel: any, i) => {
            if (i === 0) return; // Skip intro panel
            const img = panel.querySelector('.parallax-img');
            if (img) {
                gsap.fromTo(img, 
                    { xPercent: 15, scale: 1.1 }, // Start slightly right and zoomed
                    {
                        xPercent: -15, // Move left
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top top-=${(i - 1) * window.innerWidth}`,
                            end: () => `top top-=${(i + 1) * window.innerWidth}`,
                            scrub: true,
                            invalidateOnRefresh: true,
                        }
                    }
                );
            }
        });

        // Intro Animations
        gsap.from('.brutal-proj-text', {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });

    }, { scope: sectionRef, dependencies: [isLoading, projects] });

    if (isLoading) {
        return (
            <div className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center font-mono text-emerald-500 text-xl md:text-2xl font-black uppercase tracking-widest px-4 text-center border-y-8 border-emerald-500">
                <Wifi className="w-8 h-8 mr-4 animate-pulse shrink-0" /> Establishing Uplink...
            </div>
        );
    }

    return (
        <section ref={sectionRef} id="projects" className="bg-[#050505] text-slate-200 overflow-hidden font-sans h-[100dvh] w-full flex flex-col relative border-y-8 border-[#050505] z-10">
            
            {/* NOISE OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* BRUTALIST HEADER */}
            <header className="h-14 md:h-16 w-full border-b-4 border-white/10 flex justify-between items-stretch z-40 bg-[#050505]/90 backdrop-blur-md shrink-0">
                <div className="px-4 md:px-6 flex items-center gap-2 md:gap-3 border-r-4 border-white/10 bg-emerald-600 text-black font-black uppercase tracking-widest text-xs md:text-base transition-colors hover:bg-white cursor-crosshair">
                    <Scan className="w-4 h-4 md:w-5 md:h-5" /> 
                    <span className="hidden sm:inline">Surveillance_Feed</span>
                    <span className="sm:hidden">Feed</span>
                </div>
                <div className="flex-1 flex items-center px-4 md:px-6 font-mono text-[10px] md:text-xs text-emerald-500 tracking-[0.2em] font-bold overflow-hidden whitespace-nowrap">
                    <span className="animate-pulse">ASSETS DEPLOYED // SCANNING SECTORS //</span>
                </div>
                {/* PROGRESS BAR */}
                <div className="w-20 md:w-64 bg-black border-l-4 border-white/10 relative overflow-hidden shrink-0">
                    <div ref={progressRef} className="absolute inset-0 bg-emerald-500 origin-left scale-x-0"></div>
                </div>
            </header>

            {/* MAIN CONTENT WRAPPER */}
            <main className="flex-1 w-full overflow-hidden relative">
                
                <div ref={trackRef} className="flex h-full w-max absolute top-0 left-0 will-change-transform">
                    
                    {/* --- PANEL 0: INTRO SCREEN --- */}
                    <div className="project-panel w-[100vw] h-full flex-shrink-0 flex items-center justify-center p-6 md:p-16 border-r-8 border-emerald-600/30 relative overflow-hidden group">
                        
                        {/* Blueprint Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none transition-transform duration-1000 group-hover:scale-105"></div>
                        
                        <div className="max-w-7xl w-full z-10 relative">
                            <p className="brutal-proj-text font-mono text-emerald-500 text-sm md:text-2xl font-bold tracking-[0.5em] mb-2 md:mb-4">SYSTEMS_ONLINE</p>
                            <h1 className="brutal-proj-text text-[15vw] md:text-[12vw] leading-[0.85] font-black text-white uppercase tracking-tighter hover:text-emerald-500 transition-colors duration-300 cursor-default">
                                Mission<br/>
                                <span className="text-transparent transition-all duration-300 hover:tracking-normal" style={{ WebkitTextStroke: '4px #10b981' }}>
                                    Log
                                </span>
                            </h1>
                            <div className="brutal-proj-text mt-8 md:mt-12 flex items-center gap-4 border-4 border-emerald-500 bg-emerald-500/10 w-fit px-4 py-3 md:px-6 md:py-4 font-mono text-emerald-500 text-xs md:text-base font-bold uppercase tracking-widest animate-pulse hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer shadow-[8px_8px_0_0_rgba(16,185,129,0.3)]">
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" /> Initialize scan sequence
                            </div>
                        </div>
                    </div>

                    {/* --- PANELS 1-N: THE PROJECTS --- */}
                    {projects.map((project, index) => (
                        <div key={project._id} className="project-panel w-[100vw] h-full flex-shrink-0 bg-[#050505] flex flex-col lg:flex-row relative group overflow-hidden">
                            
                            {/* --- LEFT SIDE: THE INTEL (Strict width) --- */}
                            <div className="w-full lg:w-[45%] h-[50%] lg:h-full flex flex-col p-6 md:p-10 lg:p-16 border-b-4 lg:border-b-0 lg:border-r-8 border-white/10 relative z-20 bg-[#0a0a0a] shrink-0 order-2 lg:order-1 shadow-[20px_0_50px_rgba(0,0,0,0.8)]">
                                
                                {/* Top Badge Area */}
                                <div className="flex justify-between items-start mb-4 md:mb-8 shrink-0">
                                    <div className="inline-block border-2 border-emerald-600 text-emerald-500 font-mono text-[10px] md:text-sm tracking-widest px-2 py-1 md:px-3 md:py-1 w-fit bg-emerald-600/10 hover:bg-emerald-600 hover:text-white transition-colors cursor-default">
                                        ASSET_0{index + 1} // VERIFIED
                                    </div>
                                    <Target className="w-6 h-6 md:w-8 md:h-8 text-emerald-500/50" />
                                </div>
                                
                                {/* Title Area */}
                                <div className="shrink-0">
                                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter break-words hover:text-emerald-500 transition-colors duration-300 line-clamp-2 md:line-clamp-3">
                                        {project.title}
                                    </h2>
                                </div>

                                {/* Description Area (Scrollable if needed) */}
                                <div className="mt-4 md:mt-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    <div className="font-mono text-slate-400 text-xs md:text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                                        <span className="text-emerald-600 font-bold mr-2 tracking-widest uppercase text-[10px] md:text-xs">MISSION_BRIEF:</span>
                                        {project.description}
                                    </div>
                                </div>

                                {/* Bottom Tech Stack & Actions */}
                                <div className="mt-4 md:mt-6 pt-4 border-t-2 border-white/10 shrink-0">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.technologies.slice(0, 5).map(tech => ( // Limit to 5 tags so it doesn't break layout
                                            <span 
                                                key={tech} 
                                                className="border border-slate-700 px-2 py-1 md:px-3 md:py-1 font-mono text-[10px] md:text-xs font-bold text-slate-300 uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all bg-black"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 5 && (
                                            <span className="border border-slate-700 px-2 py-1 font-mono text-[10px] font-bold text-slate-500 bg-black">
                                                +{project.technologies.length - 5} MORE
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        {project.links?.website && (
                                            <a href={project.links.website} target="_blank" rel="noreferrer" 
                                               className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 text-black font-black uppercase tracking-widest text-[10px] md:text-sm transition-all border-2 border-emerald-600 shadow-[4px_4px_0_0_#064e3b] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-white hover:border-white">
                                                <Globe className="w-4 h-4" /> Live
                                            </a>
                                        )}
                                        {project.links?.github && (
                                            <a href={project.links.github} target="_blank" rel="noreferrer" 
                                               className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-transparent text-white font-black uppercase tracking-widest text-[10px] md:text-sm transition-all border-2 border-slate-600 shadow-[4px_4px_0_0_#334155] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-slate-800 hover:border-white">
                                                <Github className="w-4 h-4" /> Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT SIDE: CINEMATIC PARALLAX IMAGE --- */}
                            <div className="w-full lg:w-[55%] h-[50%] lg:h-full relative overflow-hidden z-10 bg-black order-1 lg:order-2 group/img cursor-crosshair">
                                {/* The physical image that moves inside the container */}
                                <div className="absolute inset-0 w-[130%] h-full parallax-img origin-center">
                                    {project.imageUrl ? (
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover object-center filter grayscale contrast-125 brightness-50 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30">
                                            <Layers className="w-20 h-20 text-slate-800" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Overlay gradient to blend harsh borders */}
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                
                                {/* "Recording" HUD elements overlay */}
                                <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-none">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                                    <span className="font-mono text-xs text-red-500 font-bold tracking-widest bg-black/50 px-2 py-1 backdrop-blur-sm">REC</span>
                                </div>
                                <div className="absolute bottom-6 right-6 font-mono text-[10px] text-slate-500 tracking-[0.3em] pointer-events-none">
                                    COORD: {Math.floor(Math.random() * 90)}°N {Math.floor(Math.random() * 180)}°W
                                </div>
                                
                                {/* Brutalist crosshairs */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-emerald-500"></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-emerald-500"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-emerald-500"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-emerald-500"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </section>
    );
};

export default ProjectSpotlight;