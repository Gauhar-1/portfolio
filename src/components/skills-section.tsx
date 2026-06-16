'use client';

import { useRef, useState, useEffect } from 'react';
import { Database, ShieldAlert, ChevronDown, Lock, Terminal, FolderGit2, X, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- TYPES ---
type MasteryLevel = 'master' | 'advanced' | 'beginner' | 'target';

interface SkillBlock {
    l: string; t: string; w: string; h: string;
    skill: string;
    level: MasteryLevel;
    projects: string[];
    desc: string;
}

// --- MOCK DATA ---
const ROADMAP_PIECES = [
    { id: 'P0', x: '0%', y: '83.333%', w: '100%', h: '16.666%',
      blocks: [ 
        { l: '0%', t: '0%', w: '16.666%', h: '100%', skill: 'HTML', level: 'master', projects: ['DevFolio', 'E-Com Plus'], desc: 'Semantic structuring and high-accessibility markup.' }, 
        { l: '16.666%', t: '0%', w: '16.666%', h: '100%', skill: 'CSS', level: 'master', projects: ['DevFolio', 'SaaS Dashboard'], desc: 'Advanced layouts, animations, and responsive architectures.' }, 
        { l: '33.333%', t: '0%', w: '16.666%', h: '100%', skill: 'JS', level: 'master', projects: ['All Frontend Projects'], desc: 'Deep understanding of ES6+, event loops, and DOM manipulation.' }, 
        { l: '50%', t: '0%', w: '16.666%', h: '100%', skill: 'TS', level: 'advanced', projects: ['FinTech App', 'DevFolio'], desc: 'Strict typing, generics, and interface-driven development.' }, 
        { l: '66.666%', t: '0%', w: '16.666%', h: '100%', skill: 'React', level: 'master', projects: ['Social Network', 'CRM Tool'], desc: 'Component lifecycles, custom hooks, and state management.' },
        { l: '83.333%', t: '0%', w: '16.666%', h: '100%', skill: 'Next.js', level: 'advanced', projects: ['DevFolio', 'Blog Engine'], desc: 'App router, SSR/SSG, and API route architectures.' } 
      ] as SkillBlock[]
    },
    { id: 'P1', x: '0%', y: '0%', w: '33.333%', h: '83.333%',
      blocks: [ 
        { l: '0%', t: '0%', w: '50%', h: '20%', skill: 'Node.js', level: 'advanced', projects: ['Chat Server', 'API Gateway'], desc: 'Event-driven backend architectures and stream processing.' }, 
        { l: '0%', t: '20%', w: '50%', h: '20%', skill: 'Express', level: 'master', projects: ['E-Com API', 'Auth Service'], desc: 'Middleware pipelines, routing, and error handling.' }, 
        { l: '0%', t: '40%', w: '50%', h: '20%', skill: 'Postgres', level: 'beginner', projects: ['User DB'], desc: 'Relational schema design and basic querying.' }, 
        { l: '0%', t: '60%', w: '50%', h: '20%', skill: 'MongoDB', level: 'advanced', projects: ['Social Network', 'IoT Logger'], desc: 'NoSQL aggregation pipelines and index optimization.' }, 
        { l: '0%', t: '80%', w: '50%', h: '20%', skill: 'REST API', level: 'master', projects: ['All Backend Projects'], desc: 'Stateless design, versioning, and status code best practices.' },
        { l: '50%', t: '80%', w: '50%', h: '20%', skill: 'GraphQL', level: 'target', projects: [], desc: 'Target: Learn to build efficient, single-endpoint data fetching graphs.' }
      ] as SkillBlock[]
    },
    { id: 'P2', x: '66.666%', y: '0%', w: '33.333%', h: '83.333%',
      blocks: [ 
        { l: '50%', t: '0%', w: '50%', h: '20%', skill: 'Git', level: 'master', projects: ['Team Collab'], desc: 'Advanced branching, rebasing, and conflict resolution.' }, 
        { l: '50%', t: '20%', w: '50%', h: '20%', skill: 'Tailwind', level: 'master', projects: ['DevFolio'], desc: 'Utility-first rapid prototyping and custom configuration.' }, 
        { l: '50%', t: '40%', w: '50%', h: '20%', skill: 'Figma', level: 'beginner', projects: ['UI Mockups'], desc: 'Basic wireframing and prototyping layouts.' }, 
        { l: '50%', t: '60%', w: '50%', h: '20%', skill: 'Vercel', level: 'advanced', projects: ['Next.js Apps'], desc: 'CI/CD edge deployment and serverless function hosting.' }, 
        { l: '50%', t: '80%', w: '50%', h: '20%', skill: 'AWS', level: 'beginner', projects: ['S3 Buckets'], desc: 'Basic infrastructure: EC2 instances and S3 object storage.' },
        { l: '0%', t: '80%', w: '50%', h: '20%', skill: 'Docker', level: 'target', projects: [], desc: 'Target: Containerizing applications for universal deployment.' }
      ] as SkillBlock[]
    },
    { id: 'P3', x: '33.333%', y: '50%', w: '33.333%', h: '33.333%',
      blocks: [ 
        { l: '0%', t: '0%', w: '50%', h: '50%', skill: 'K8s', level: 'target', projects: [], desc: 'Target: Orchestrating containerized systems at scale.' }, 
        { l: '50%', t: '0%', w: '50%', h: '50%', skill: 'CI/CD', level: 'beginner', projects: ['Github Actions'], desc: 'Automated testing and deployment pipelines.' }, 
        { l: '0%', t: '50%', w: '50%', h: '50%', skill: 'Kafka', level: 'target', projects: [], desc: 'Target: High-throughput event streaming.' }, 
        { l: '50%', t: '50%', w: '50%', h: '50%', skill: 'Redis', level: 'beginner', projects: ['Session Store'], desc: 'In-memory caching for high-speed data retrieval.' } 
      ] as SkillBlock[]
    },
    { id: 'P4', x: '16.666%', y: '0%', w: '33.333%', h: '50%',
      blocks: [ 
        { l: '0%', t: '0%', w: '50%', h: '33.333%', skill: 'Python', level: 'advanced', projects: ['Data Scraper'], desc: 'Scripting, automation, and backend logic.' }, 
        { l: '50%', t: '0%', w: '50%', h: '33.333%', skill: 'Prisma', level: 'beginner', projects: ['CRM Tool'], desc: 'Type-safe database ORM implementation.' }, 
        { l: '0%', t: '33.333%', w: '50%', h: '33.333%', skill: 'Go', level: 'target', projects: [], desc: 'Target: High-performance concurrent microservices.' }, 
        { l: '50%', t: '33.333%', w: '50%', h: '33.333%', skill: 'Rust', level: 'target', projects: [], desc: 'Target: Memory-safe systems programming.' }, 
        { l: '0%', t: '66.666%', w: '50%', h: '33.333%', skill: 'WebRTC', level: 'target', projects: [], desc: 'Target: Peer-to-peer real-time communication.' },
        { l: '50%', t: '66.666%', w: '50%', h: '33.333%', skill: 'gRPC', level: 'target', projects: [], desc: 'Target: High-speed RPC frameworks.' } 
      ] as SkillBlock[]
    },
    { id: 'P5', x: '50%', y: '0%', w: '33.333%', h: '50%',
      blocks: [ 
        { l: '0%', t: '0%', w: '50%', h: '33.333%', skill: 'WebGL', level: 'target', projects: [], desc: 'Target: Hardware-accelerated 2D/3D graphics.' }, 
        { l: '50%', t: '0%', w: '50%', h: '33.333%', skill: 'Three.js', level: 'target', projects: [], desc: 'Target: 3D scene graphs and rendering in browser.' }, 
        { l: '0%', t: '33.333%', w: '50%', h: '33.333%', skill: 'WASM', level: 'target', projects: [], desc: 'Target: Near-native performance execution in web.' }, 
        { l: '50%', t: '33.333%', w: '50%', h: '33.333%', skill: 'Web3', level: 'target', projects: [], desc: 'Target: Decentralized application architectures.' }, 
        { l: '0%', t: '66.666%', w: '50%', h: '33.333%', skill: 'LLMs', level: 'beginner', projects: ['AI Chatbot'], desc: 'Prompt engineering and basic API integrations.' },
        { l: '50%', t: '66.666%', w: '50%', h: '33.333%', skill: 'Sys Des.', level: 'beginner', projects: ['E-Com API'], desc: 'Designing scalable, highly-available architectures.' } 
      ] as SkillBlock[]
    },
    { id: 'P6', x: '16.666%', y: '50%', w: '16.666%', h: '16.666%',
      blocks: [ { l: '0%', t: '0%', w: '100%', h: '100%', skill: 'Micro Svcs', level: 'target', projects: [], desc: 'Target: Decoupled service architecture patterns.' } ] as SkillBlock[] },
    { id: 'P7', x: '66.666%', y: '50%', w: '16.666%', h: '16.666%',
      blocks: [ { l: '0%', t: '0%', w: '100%', h: '100%', skill: 'Elastic', level: 'target', projects: [], desc: 'Target: Advanced full-text search engines.' } ] as SkillBlock[] }
];

// Star Engineer Theme Mapping
const getBlockStyle = (level: MasteryLevel) => {
    switch(level) {
        case 'master': return { bg: 'bg-[#d63d3a]/90', text: 'text-[#f2ebd9]', border: 'border-[#d63d3a] border-[1px]' }; // Crimson
        case 'advanced': return { bg: 'bg-[#407c87]/80', text: 'text-[#f2ebd9]', border: 'border-[#407c87] border-[1px]' }; // Teal
        case 'beginner': return { bg: 'bg-[#1a1c23]/90', text: 'text-slate-300 hover:text-white', border: 'border-slate-700 border-[1px]' }; // Dark UI
        case 'target': return { bg: 'bg-transparent', text: 'text-slate-600 hover:text-slate-400', border: 'border-slate-800 border-[1px] border-dashed hover:border-slate-600' };
    }
};

export default function PremiumSkillsRoadmap() {
    const sectionRef = useRef<HTMLElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [activeSkill, setActiveSkill] = useState<SkillBlock | null>(null);

    // Prevent scrolling when panel is open
    useEffect(() => {
        if (activeSkill) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [activeSkill]);

    useGSAP(() => {
        if (!sectionRef.current || !boardRef.current) return;

        const pieces = gsap.utils.toArray('.roadmap-piece');

        gsap.set(pieces, { 
            yPercent: -600, 
            rotation: () => [90, -90, 180, 270][Math.floor(Math.random() * 4)], 
            opacity: 0,
            scale: 0.8
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=3500", 
                pin: true,
                scrub: 1, 
                anticipatePin: 1,
                onUpdate: (self) => setProgress(Math.floor(self.progress * 100))
            }
        });

        pieces.forEach((piece: any, index) => {
            tl.to(piece, {
                yPercent: 0,
                rotation: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out", 
            }, index * 0.15); 
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="skills" className="bg-[#050b14] text-[#f2ebd9] h-[100dvh] w-full relative overflow-hidden flex flex-col z-10 font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=JetBrains+Mono:wght@400;700;800&display=swap');
                .font-cinematic { font-family: 'Oswald', sans-serif; }
                .font-tech { font-family: 'JetBrains Mono', monospace; }
                .clip-chamfer { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
            `}</style>
            
            {/* Background Grid & Vignette */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(64,124,135,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(64,124,135,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,20,0.8)_100%)] pointer-events-none z-0"></div>

            {/* PREMIUM HUD HEADER */}
            <header className="w-full h-16 md:h-20 border-b border-slate-800 flex flex-col md:flex-row justify-between items-stretch z-30 bg-[#0a0f18]/80 backdrop-blur-md shrink-0 relative">
                <div className="px-4 md:px-8 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 text-[#f2ebd9] font-cinematic font-bold uppercase tracking-widest text-sm md:text-base shrink-0">
                    <Activity className="w-4 h-4 text-[#d63d3a] animate-pulse" /> 
                    <span>Architecture_Matrix</span>
                </div>
                
                {/* HUD Legend */}
                <div className="flex-1 flex items-center justify-start md:justify-end px-4 md:px-8 py-2 md:py-0 gap-4 md:gap-8 font-tech text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#d63d3a]"></div> MASTER</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#407c87]"></div> ADVANCED</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-700"></div> BEGINNER</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 border border-slate-600 border-dashed"></div> TARGET</div>
                    <div className="hidden lg:flex items-center gap-2 text-[#f2ebd9] bg-[#d63d3a]/20 px-3 py-1 border border-[#d63d3a]/50 ml-4">
                        SEQ_BUILD: {progress}%
                    </div>
                </div>
            </header>

            <main className="flex-1 relative flex items-center justify-center p-4 md:p-8">
                
                {/* Scroll Indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-20 mt-10">
                    <ChevronDown className="w-12 h-12 md:w-16 md:h-16 mb-4 animate-bounce text-[#407c87]" />
                    <h2 className="text-3xl md:text-5xl font-cinematic font-bold uppercase tracking-widest text-center text-[#407c87]">Execute<br/>Assembly</h2>
                </div>

                {/* THE MATRIX BOARD */}
                <div 
                    ref={boardRef}
                    className="relative w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] aspect-square bg-[#03060a] border border-[#407c87]/30 shadow-[0_0_50px_rgba(64,124,135,0.1)] z-10"
                >
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-20">
                        {Array.from({ length: 36 }).map((_, i) => (<div key={i} className="border border-slate-800"></div>))}
                    </div>

                    {ROADMAP_PIECES.map((piece) => (
                        <div 
                            key={piece.id}
                            className="roadmap-piece absolute will-change-transform"
                            style={{ left: piece.x, top: piece.y, width: piece.w, height: piece.h }}
                        >
                            {piece.blocks.map((block, i) => {
                                const styles = getBlockStyle(block.level);
                                const isActive = activeSkill?.skill === block.skill;
                                return (
                                    <button 
                                        key={i}
                                        onClick={() => setActiveSkill(block)}
                                        className={cn(
                                            "absolute flex flex-col items-center justify-center transition-all duration-300 outline-none backdrop-blur-sm",
                                            styles.border, styles.bg, styles.text,
                                            isActive ? "scale-110 z-50 shadow-[0_0_20px_rgba(214,61,58,0.4)] border-[#d63d3a]" : "hover:brightness-125 z-10 hover:z-30 hover:scale-105"
                                        )}
                                        style={{ left: block.l, top: block.t, width: block.w, height: block.h }}
                                    >
                                        {block.level === 'target' && <Lock className="w-2 h-2 md:w-3 md:h-3 text-slate-700 mb-1" />}
                                        <span className="font-tech font-bold text-[8px] sm:text-[9px] md:text-xs text-center leading-none px-0.5 uppercase break-words">
                                            {block.skill}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </main>

            {/* --- CLICK-AWAY BACKDROP --- */}
            <div 
                className={cn(
                    "absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-500",
                    activeSkill ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={() => setActiveSkill(null)}
            />

            {/* --- SLIDE-OUT DOSSIER SIDEBAR --- */}
            <aside 
                className={cn(
                    "absolute top-0 right-0 h-full w-full sm:w-[400px] lg:w-[450px] bg-[#0a0f18]/95 border-l border-slate-800 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    activeSkill ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 md:h-20 bg-[#05080c] border-b border-slate-800 text-[#f2ebd9] flex items-center justify-between px-6 shrink-0">
                    <div className="font-tech text-xs font-bold tracking-[0.2em] flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[#407c87]" /> NODE_INSPECTOR
                    </div>
                    <button 
                        onClick={() => setActiveSkill(null)} 
                        className="p-2 text-slate-500 hover:text-[#d63d3a] transition-colors bg-[#1a1c23] hover:bg-[#8a1214]/20 rounded-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {activeSkill && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            
                            {/* Skill Title */}
                            <h2 className="text-4xl md:text-5xl font-cinematic font-bold uppercase tracking-wider leading-none mb-6 text-[#f2ebd9]">
                                {activeSkill.skill}
                            </h2>
                            
                            {/* Mastery Badge */}
                            <div className="mb-8">
                                <div className="font-tech text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">Access Level</div>
                                <div className={cn(
                                    "inline-block px-4 py-1.5 font-tech text-xs font-bold uppercase tracking-widest clip-chamfer",
                                    activeSkill.level === 'master' ? "bg-[#d63d3a] text-white" :
                                    activeSkill.level === 'advanced' ? "bg-[#407c87] text-white" :
                                    activeSkill.level === 'beginner' ? "bg-[#1a1c23] text-slate-300 border border-slate-700" :
                                    "bg-transparent border border-dashed border-slate-700 text-slate-500"
                                )}>
                                    {activeSkill.level}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-10 border-l-2 border-[#407c87] pl-4 py-1">
                                <div className="font-tech text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">Technical Overview</div>
                                <p className="font-sans text-sm md:text-base text-slate-300 leading-relaxed">
                                    {activeSkill.desc}
                                </p>
                            </div>

                            {/* Projects Array */}
                            {activeSkill.projects.length > 0 ? (
                                <div>
                                    <div className="font-tech text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <FolderGit2 className="w-3 h-3 text-[#d63d3a]" /> Deployed Architecture
                                    </div>
                                    <ul className="space-y-3">
                                        {activeSkill.projects.map(proj => (
                                            <li key={proj} className="bg-[#05080c] border border-slate-800 px-4 py-3 font-tech text-xs font-bold uppercase flex items-center justify-between text-slate-300 hover:border-[#407c87] hover:text-[#f2ebd9] transition-colors cursor-default">
                                                {proj}
                                                <ShieldAlert className="w-3 h-3 text-slate-600" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-800 bg-[#05080c]/50 p-6 flex flex-col items-center justify-center gap-2 text-center mt-10">
                                    <Lock className="w-5 h-5 text-slate-600 mb-1" />
                                    <p className="font-tech text-[10px] text-slate-500 uppercase tracking-[0.2em]">Deployment Locked<br/>Awaiting Future Implementation</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </aside>

        </section>
    );
}