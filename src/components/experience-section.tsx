'use client';

import { ExternalLink, Github, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getSessionId } from '@/lib/telemetry';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type BorrowedMetric = {
    title: string;
    value: string;
    ariaLabel?: string;
};

export type Experience = {
    _id: string;
    title: string;
    slug: string;
    company: string;
    domainTag?: string;
    employmentType?: string;
    date: string;
    description: string;
    technologies: string[];
    links?: { website?: string; github?: string };
    hasArchitecture?: boolean;
    theme?: {
        primaryHex: string;
        backgroundHex?: string;
        textHex?: string;
    };
    borrowedMetrics?: BorrowedMetric[];
    borrowedChallenges?: string[];
};

// ─── Color & Contrast Utilities ─────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleaned = (hex || '#000000').replace('#', '').trim();
    const full = cleaned.length === 3 
        ? cleaned.split('').map(c => c + c).join('') 
        : cleaned.substring(0, 6);
    return {
        r: parseInt(full.substring(0, 2), 16) || 0,
        g: parseInt(full.substring(2, 4), 16) || 0,
        b: parseInt(full.substring(4, 6), 16) || 0,
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
    const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getLuminanceFromHex(hex: string): number {
    const { r, g, b } = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Computes high-contrast text color for primary CTA button based on relative luminance
function getContrastTextColor(hexColor?: string): string {
    if (!hexColor) return '#0b0b0e';
    const luma = getLuminanceFromHex(hexColor);
    return luma > 125 ? '#0b0b0e' : '#ffffff';
}

// Computes a high-contrast background for the section that makes the card pop visually
function getContrastingSectionBg(cardBg: string, cardPrimary: string): string {
    const luma = getLuminanceFromHex(cardBg);
    const { r: pr, g: pg, b: pb } = hexToRgb(cardPrimary);

    if (luma > 120) {
        // Light card (e.g., #cbc9d6, #8a9bab, #ffffff)
        // High-contrast deep dark atmosphere so the light card pops prominently
        return rgbToHex(
            Math.round(6 + pr * 0.05),
            Math.round(7 + pg * 0.05),
            Math.round(10 + pb * 0.05)
        );
    } else {
        // Dark card (e.g., #0a0a0c, #0b0b0e, #121217)
        // Deep obsidian canvas infused with the brand hue (8-10%)
        // creating distinct contrast and separation from the card surface
        return rgbToHex(
            Math.round(2 + pr * 0.08),
            Math.round(2 + pg * 0.08),
            Math.round(4 + pb * 0.08)
        );
    }
}

// Subtle 0 to 1 deg rotations so engineering typography remains razor-sharp to scan
const ROTATIONS = [0, -1, 1, -0.5, 0.5, -1, 1, 0];

interface ExperienceCardProps {
    xp: Experience;
    index: number;
    trackClick: (company: string) => void;
}

const ExperienceCard = ({ xp, index, trackClick }: ExperienceCardProps) => {
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const cardPrimary = xp.theme?.primaryHex || '#10B981';
    const cardBg = xp.theme?.backgroundHex || '#0b0b0e';
    const cardText = xp.theme?.textHex || '#ffffff';
    const ctaTextColor = getContrastTextColor(cardPrimary);
    const isLight = getLuminanceFromHex(cardBg) > 120;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        const x = Math.max(-5, Math.min(5, normX * 10));
        const y = Math.max(-5, Math.min(5, normY * 10));
        setMouseOffset({ x, y });
    };

    const handleMouseLeave = () => {
        setMouseOffset({ x: 0, y: 0 });
    };

    return (
        <div 
            className="photo-card absolute w-[94vw] sm:w-[86vw] md:w-[76vw] lg:w-[62vw] max-w-4xl backdrop-blur-xl rounded-2xl p-5 sm:p-7 md:p-8 flex flex-col justify-between will-change-transform group overflow-hidden"
            style={{ 
                '--theme-primary': cardPrimary, 
                '--theme-bg': cardBg,
                '--theme-text': cardText,
                '--card-theme': 'var(--theme-primary)',
                '--card-bg': 'var(--theme-bg)',
                '--card-text': 'var(--theme-text)',
                backgroundColor: isLight 
                    ? 'color-mix(in srgb, var(--card-bg) 95%, var(--card-text) 5%)'
                    : 'color-mix(in srgb, var(--card-bg) 84%, var(--card-text) 16%)',
                border: isLight
                    ? '1px solid color-mix(in srgb, var(--card-text) 22%, transparent)'
                    : '1px solid color-mix(in srgb, var(--card-theme) 40%, var(--card-text) 20%)',
                boxShadow: isLight
                    ? '0 30px 80px -15px rgba(0, 0, 0, 0.45), 0 0 25px -5px color-mix(in srgb, var(--card-theme) 25%, transparent)'
                    : '0 30px 80px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px color-mix(in srgb, var(--card-theme) 20%, transparent)',
                zIndex: index 
            } as React.CSSProperties}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Double Machined Chamfer Inner Border */}
            <div 
                aria-hidden="true" 
                className="absolute inset-[1px] pointer-events-none rounded-[15px]" 
                style={{
                    border: '1px solid color-mix(in srgb, var(--card-text) 8%, transparent)',
                }}
            />

            {/* Top Radial Ambient Spotlight inside the card (18% opacity) */}
            <div 
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(600px circle at 50% 0%, color-mix(in srgb, var(--card-theme) 18%, transparent), transparent 70%)',
                }}
            />

            {/* Micro-Interaction Tilt/Shift Wrapper (Max 5px translation) */}
            <div 
                className="relative z-10 flex-1 w-full flex flex-col justify-between gap-4 will-change-transform"
                style={{
                    transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) rotateX(${-mouseOffset.y * 0.3}deg) rotateY(${mouseOffset.x * 0.3}deg)`,
                    transition: mouseOffset.x === 0 && mouseOffset.y === 0 ? 'transform 0.4s ease-out' : 'transform 0.1s ease-out',
                }}
            >
                {/* ── Layer 1: Header Row (Intent Classification) ── */}
                <div 
                    className="flex flex-wrap items-center justify-between gap-3 pb-4"
                    style={{ borderBottom: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)' }}
                >
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span 
                            className="font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight"
                            style={{ color: 'var(--card-text)' }}
                        >
                            {xp.company}
                        </span>
                        {xp.employmentType && (
                            <span 
                                className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-medium"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 20%)',
                                    border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
                                    color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))',
                                }}
                            >
                                {xp.employmentType}
                            </span>
                        )}
                        <span 
                            className="font-mono text-xs tracking-wider"
                            style={{ color: 'color-mix(in srgb, var(--card-text) 55%, var(--card-bg))' }}
                        >
                            • {xp.date}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span 
                            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wide"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--card-theme) 14%, var(--card-bg))',
                                border: '1px solid color-mix(in srgb, var(--card-theme) 45%, transparent)',
                                color: 'var(--card-theme)',
                                boxShadow: '0 0 12px color-mix(in srgb, var(--card-theme) 18%, transparent)',
                            }}
                        >
                            {xp.domainTag || 'Systems & Full-Stack Architecture'}
                        </span>
                    </div>
                </div>

                {/* ── Layer 2: Role & Executive Thesis (Clamped, No trapped scrollbar) ── */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <h3 
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                            style={{ color: 'var(--card-text)' }}
                        >
                            {xp.title}
                        </h3>
                        <span 
                            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs shrink-0"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 20%)',
                                border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                                color: 'color-mix(in srgb, var(--card-text) 60%, var(--card-bg))',
                            }}
                        >
                            0{index + 1}
                        </span>
                    </div>
                    <p 
                        className="text-sm sm:text-base leading-relaxed line-clamp-2 md:line-clamp-3 font-normal"
                        style={{ color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))' }}
                    >
                        {xp.description}
                    </p>
                </div>

                {/* ── Layer 3: Borrowed 3-Pillar Impact Strip (xp.borrowedMetrics) ── */}
                {xp.borrowedMetrics && xp.borrowedMetrics.length > 0 && (
                    <div 
                        className="p-3.5 sm:p-4 rounded-xl backdrop-blur-md"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
                            border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
                        }}
                    >
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            {xp.borrowedMetrics.slice(0, 3).map((metric, mIdx) => (
                                <div 
                                    key={mIdx} 
                                    className={mIdx > 0 ? 'pl-2.5 sm:pl-4' : ''}
                                    style={{
                                        borderLeft: mIdx > 0 ? '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)' : 'none',
                                    }}
                                >
                                    <div 
                                        className="text-lg sm:text-2xl md:text-3xl font-black tabular-nums tracking-tight"
                                        style={{ color: 'var(--card-theme)' }}
                                    >
                                        {metric.value}
                                    </div>
                                    <div 
                                        className="text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-0.5 truncate font-medium"
                                        style={{ color: 'color-mix(in srgb, var(--card-text) 55%, var(--card-bg))' }}
                                    >
                                        {metric.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Layer 4: Borrowed Curiosity Teaser & Permanent Action Dock ── */}
                <div 
                    className="pt-3 space-y-3.5"
                    style={{ borderTop: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)' }}
                >
                    {/* Borrowed Curiosity Teaser */}
                    {xp.borrowedChallenges && xp.borrowedChallenges.length > 0 && (
                        <div 
                            className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-lg overflow-hidden"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 12%)',
                                border: '1px solid color-mix(in srgb, var(--card-text) 14%, transparent)',
                            }}
                        >
                            <span className="font-semibold shrink-0" style={{ color: 'var(--card-theme)' }}>
                                Architecture Deep Dive:
                            </span>
                            <span 
                                className="truncate font-medium"
                                style={{ color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))' }}
                            >
                                {xp.borrowedChallenges.join(' • ')}
                            </span>
                        </div>
                    )}

                    {/* Permanent Action Dock (Always visible on mobile & desktop) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        {/* Technologies Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {xp.technologies.slice(0, 5).map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-md font-medium"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 12%)',
                                        border: '1px solid color-mix(in srgb, var(--card-text) 15%, transparent)',
                                        color: 'color-mix(in srgb, var(--card-text) 80%, var(--card-bg))',
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                            {xp.technologies.length > 5 && (
                                <span 
                                    className="px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-medium"
                                    style={{ color: 'color-mix(in srgb, var(--card-text) 45%, var(--card-bg))' }}
                                >
                                    +{xp.technologies.length - 5} MORE
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0 justify-end">
                            <a
                                href={`/architecture/${xp.slug}`}
                                onClick={() => trackClick(xp.company)}
                                className="flex-1 sm:flex-initial px-5 py-2.5 font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                                style={{
                                    backgroundColor: 'var(--card-theme)',
                                    color: ctaTextColor,
                                    boxShadow: '0 8px 25px -4px color-mix(in srgb, var(--card-theme) 40%, transparent)',
                                }}
                            >
                                Explore Architecture
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            {xp.links?.website && (
                                <a
                                    href={xp.links.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
                                        border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                                        color: 'var(--card-text)',
                                    }}
                                    aria-label="Website Link"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {xp.links?.github && (
                                <a
                                    href={xp.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, var(--card-text) 14%)',
                                        border: '1px solid color-mix(in srgb, var(--card-text) 18%, transparent)',
                                        color: 'var(--card-text)',
                                    }}
                                    aria-label="GitHub Repository"
                                >
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExperienceSection = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const trackClick = (company: string) => {
        const sessionId = getSessionId();
        if (sessionId) {
            fetch('/api/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    score: 10,
                    action: `Clicked Experience Deep Dive: ${company}`
                })
            }).catch(console.error);
        }
    };

    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true; 

        const fetchExperiences = async () => {
            try {
                const res = await fetch('/api/experience');
                if (!res.ok) {
                    throw new Error(`Failed to fetch experiences: ${res.status}`);
                }
                const data: Experience[] = await res.json();
                
                if (!isMounted) return;

                setExperiences(data || []);
            } catch (error) { 
                console.error("Error loading experiences:", error); 
            } finally { 
                if (isMounted) setIsLoading(false); 
            }
        };
        fetchExperiences();

        return () => {
            isMounted = false;
        };
    }, []);

    useGSAP(() => {
        if (isLoading || !experiences.length || !sectionRef.current) return;

        const photos = gsap.utils.toArray(".photo-card");

        const initialPrimary = experiences[0]?.theme?.primaryHex || '#10B981';
        const initialCardBg = experiences[0]?.theme?.backgroundHex || '#0a0a0c';
        const initialText = experiences[0]?.theme?.textHex || '#ffffff';
        const initialSectionBg = getContrastingSectionBg(initialCardBg, initialPrimary);

        // Set initial contrasting background and environmental CSS variables
        gsap.set(sectionRef.current, {
            backgroundColor: initialSectionBg,
            '--env-primary': initialPrimary,
            '--env-bg': initialSectionBg,
            '--env-text': initialText,
        });

        photos.forEach((photo: any, i: number) => {
            const rot = ROTATIONS[i % ROTATIONS.length];
            if (i === 0) {
                gsap.set(photo, { y: 0, rotation: rot, scale: 1 });
            } else {
                gsap.set(photo, { y: window.innerHeight * 1.2, rotation: rot + 3, scale: 1 });
            }
        });

        // Silky smooth GSAP timeline scrubbed 1-to-1 with scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${experiences.length * 100}vh`,
                pin: true, 
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        photos.forEach((photo: any, i: number) => {
            if (i === 0) return; 

            const targetPrimary = experiences[i]?.theme?.primaryHex || '#10B981';
            const targetCardBg = experiences[i]?.theme?.backgroundHex || '#0a0a0c';
            const targetText = experiences[i]?.theme?.textHex || '#ffffff';
            const targetSectionBg = getContrastingSectionBg(targetCardBg, targetPrimary);

            // Card i smoothly slides into position with signature tactile rotation
            tl.to(photo, {
                y: 0,
                rotation: ROTATIONS[i % ROTATIONS.length],
                ease: "power2.out",
                duration: 1
            });

            // Concurrently morph section background to the high-contrast environment
            tl.to(sectionRef.current, {
                backgroundColor: targetSectionBg,
                '--env-primary': targetPrimary,
                '--env-bg': targetSectionBg,
                '--env-text': targetText,
                duration: 1,
                ease: "power2.out",
            }, "<");

            // Previous cards scale down and tuck into the stack
            const previousPhotos = photos.slice(0, i);
            tl.to(previousPhotos, {
                scale: "-=0.03", 
                filter: "brightness(0.65)", 
                duration: 1,
                ease: "power2.out"
            }, "<"); 
        });

    }, { scope: sectionRef, dependencies: [isLoading, experiences] });

    const defaultPrimary = experiences[0]?.theme?.primaryHex || '#10B981';
    const defaultCardBg = experiences[0]?.theme?.backgroundHex || '#0a0a0c';
    const defaultText = experiences[0]?.theme?.textHex || '#ffffff';
    const defaultSectionBg = getContrastingSectionBg(defaultCardBg, defaultPrimary);

    return (
        <section 
            ref={sectionRef} 
            id="experience" 
            className="overflow-hidden font-sans h-[100dvh] w-full relative"
            style={{
                backgroundColor: defaultSectionBg,
                color: defaultText,
                '--env-primary': defaultPrimary,
                '--env-bg': defaultSectionBg,
                '--env-text': defaultText,
                '--theme-primary': 'var(--env-primary)',
                '--theme-bg': 'var(--env-bg)',
                '--theme-text': 'var(--env-text)',
            } as React.CSSProperties}
        >
            {isLoading ? (
                <div 
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center font-mono text-sm tracking-widest px-4 text-center"
                    style={{
                        backgroundColor: defaultSectionBg,
                        color: 'color-mix(in srgb, var(--env-text, #ffffff) 65%, var(--env-bg, #0a0a0c))',
                    }}
                >
                    <Layers 
                        className="w-8 h-8 mb-4 animate-pulse" 
                        style={{ color: 'var(--env-primary, #10B981)' }} 
                    />
                    Initializing Engineering Architecture...
                </div>
            ) : (
                <>
                    {/* Subtle smooth ambient radial background wash */}
                    <div 
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background: 'radial-gradient(85% 65% at 50% 50%, color-mix(in srgb, var(--env-primary, #10B981) 12%, transparent), transparent 80%)',
                        }}
                    />

                    {/* Dynamic Ambient Center Orb that morphs with var(--env-primary) */}
                    <div 
                        aria-hidden="true"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-[120px] pointer-events-none z-0"
                        style={{
                            background: 'radial-gradient(circle, color-mix(in srgb, var(--env-primary, #10B981) 22%, transparent), transparent 70%)',
                        }}
                    />

                    {/* Top-left Telemetry Pill with dynamic var(--env-primary) border & glow */}
                    <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 flex items-center gap-3">
                        <div 
                            className="px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2.5 text-xs font-mono tracking-widest uppercase shadow-lg"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--env-primary, #10B981) 14%, var(--env-bg, #08090c))',
                                border: '1px solid color-mix(in srgb, var(--env-primary, #10B981) 45%, transparent)',
                                color: 'var(--env-primary, #10B981)',
                                boxShadow: '0 0 20px color-mix(in srgb, var(--env-primary, #10B981) 16%, transparent)',
                            }}
                        >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 
                            <span className="font-semibold tracking-wider">Career_Gallery // Telemetry</span>
                        </div>
                    </div>

                    {/* 3D Stacked Cards Canvas */}
                    <div ref={containerRef} className="absolute inset-0 w-full h-full flex items-center justify-center z-20 perspective-[1000px]">
                        {experiences.map((xp, index) => (
                            <ExperienceCard 
                                key={xp._id} 
                                xp={xp} 
                                index={index} 
                                trackClick={trackClick} 
                            />
                        ))}
                    </div>
                    
                    {/* Bottom Scroll Cue with dynamic gradient */}
                    <div 
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 font-mono text-[10px] uppercase tracking-widest pointer-events-none"
                        style={{ color: 'color-mix(in srgb, var(--env-text, #ffffff) 50%, var(--env-bg, #08090c))' }}
                    >
                        <div 
                            className="w-[1px] h-12"
                            style={{
                                background: 'linear-gradient(to bottom, var(--env-primary, #10B981), transparent)',
                            }}
                        />
                        <span className="tracking-widest">Scroll to inspect</span>
                    </div>
                </>
            )}
        </section>
    );
};

export default ExperienceSection;