'use client';

import { ExternalLink, Github, Target, Camera, Sparkles } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

// Pre-defined organic rotations for the photos so they look casually dropped
const ROTATIONS = [-3, 4, -2, 5, -4, 3, -5, 2];

const ExperienceSection = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const res = await fetch('/api/experience');
                const data = await res.json();
                setExperiences(data || []);
            } catch (error) { 
                console.error(error); 
            } finally { 
                setIsLoading(false); 
                setTimeout(() => ScrollTrigger.refresh(), 200);
            }
        };
        fetchExperiences();
    }, []);

    useGSAP(() => {
        if (isLoading || !experiences.length || !sectionRef.current) return;

        const photos = gsap.utils.toArray(".photo-card");

        // 1. Set the initial state of all photos
        photos.forEach((photo: any, i: number) => {
            if (i === 0) {
                // First photo is already on the table
                gsap.set(photo, { y: 0, rotation: ROTATIONS[i] });
            } else {
                // Subsequent photos are hidden below the screen
                gsap.set(photo, { y: window.innerHeight * 1.2, rotation: ROTATIONS[i] + 15 });
            }
        });

        // 2. Create the master scroll timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                // Scroll distance scales dynamically based on how many photos there are
                end: () => `+=${experiences.length * 100}vh`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // 3. Build the stacking animation
        photos.forEach((photo: any, i: number) => {
            if (i === 0) return; // Skip the first one since it's already visible

            // Bring the new photo up
            tl.to(photo, {
                y: 0,
                rotation: ROTATIONS[i],
                ease: "power2.out",
                duration: 1
            });

            // SIMULTANEOUSLY: Push all previously dropped photos down into the Z-axis
            const previousPhotos = photos.slice(0, i);
            tl.to(previousPhotos, {
                scale: "-=0.04", // Scale down 4% every time a new photo lands
                filter: "brightness(0.6)", // Dim the underlying photos
                duration: 1,
                ease: "power2.out"
            }, "<"); // The "<" symbol means "play at the same time as the previous animation"
        });

    }, { scope: sectionRef, dependencies: [isLoading, experiences] });

    if (isLoading) {
        return (
            <div className="h-[100dvh] w-full bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-white/50 text-sm tracking-widest px-4 text-center">
                <Camera className="w-8 h-8 mb-4 animate-pulse" /> Developing Negatives...
            </div>
        );
    }

    return (
        <section ref={sectionRef} id="experience" className="bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans h-[100dvh] w-full relative">
            
            {/* BACKGROUND DESK TEXTURE */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
            
            {/* SUBTLE LIGHTING RING */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-neutral-800 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 flex items-center gap-3">
                <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 text-xs font-mono tracking-widest text-white/70 uppercase">
                    <Sparkles className="w-3 h-3 text-amber-100" /> Career_Gallery
                </div>
            </div>

            {/* THE PINNED CONTAINER FOR PHOTOS */}
            <div ref={containerRef} className="absolute inset-0 w-full h-full flex items-center justify-center z-20 perspective-[1000px]">
                
                {experiences.map((xp, index) => (
                    // THE PHOTOGRAPH FRAME
                    <div 
                        key={xp._id} 
                        className="photo-card absolute w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-4xl h-[75vh] md:h-[80vh] bg-[#f4f4f0] p-3 md:p-5 pb-20 md:pb-28 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col will-change-transform border border-[#e5e5df] group"
                        style={{ zIndex: index }} // Ensure DOM stacking order matches array order
                    >
                        
                        {/* THE "IMAGE" AREA (Dark content block) */}
                        <div className="flex-1 w-full bg-[#0f0f11] rounded-sm overflow-hidden relative flex flex-col p-6 md:p-10 shadow-inner group-hover:bg-[#151518] transition-colors duration-500">
                            
                            {/* Inner Grain on Photo */}
                            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            
                            {/* Top Metadata */}
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 shrink-0">
                                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                                    {xp.title}
                                </h3>
                                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-black text-white/50 font-mono text-sm shrink-0">
                                    0{index + 1}
                                </div>
                            </div>

                            {/* Scrollable Description */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 text-sm md:text-base text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                                {xp.description}
                            </div>

                            {/* Tech Tags */}
                            <div className="pt-6 shrink-0 border-t border-white/10 mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {xp.technologies.slice(0, 6).map(tech => (
                                        <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-[10px] md:text-xs font-mono uppercase tracking-wider rounded-sm">
                                            {tech}
                                        </span>
                                    ))}
                                    {xp.technologies.length > 6 && (
                                        <span className="px-3 py-1 bg-transparent text-white/40 text-[10px] md:text-xs font-mono uppercase tracking-wider">
                                            +{xp.technologies.length - 6} MORE
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons overlay inside the photo */}
                            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                {xp.links?.website && (
                                    <a href={xp.links.website} target="_blank" rel="noreferrer" className="p-3 bg-white text-black hover:bg-amber-100 rounded-full transition-colors shadow-lg">
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                                {xp.links?.github && (
                                    <a href={xp.links.github} target="_blank" rel="noreferrer" className="p-3 bg-black text-white border border-white/20 hover:bg-neutral-800 rounded-full transition-colors shadow-lg">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* POLAROID WHITE BOTTOM STRIP (Handwritten Metadata Area) */}
                        <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 px-6 md:px-10 flex items-center justify-between pointer-events-none">
                            <div className="flex flex-col">
                                <span className="text-black/80 font-black text-xl md:text-3xl uppercase tracking-tighter mix-blend-multiply">
                                    {xp.company}
                                </span>
                                <span className="text-black/50 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                    <Target className="w-3 h-3" /> OPERATION ARCHIVE
                                </span>
                            </div>
                            <div className="text-black/60 font-mono text-xs md:text-sm tracking-widest uppercase border-b border-black/20 pb-1 italic">
                                {xp.date}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            
            {/* SCROLL INDICATOR */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-white/30 font-mono text-[10px] uppercase tracking-widest">
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
                Scroll to flip
            </div>

        </section>
    );
};

export default ExperienceSection;