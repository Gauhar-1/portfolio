'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { usePersona } from '@/context/PersonaContext';
import { ArrowRight, Sparkles, Building2, Code2, Users, Briefcase, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Persona = {
  _id: string;
  name: string;
  description: string;
  theme: string;
  sectionOrder?: string[];
};

// Map specific persona names to elegant icons for the Bento Grid
const getIconForPersona = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('founder') || lower.includes('startup')) return <Building2 className="w-6 h-6" />;
  if (lower.includes('dev') || lower.includes('engineer')) return <Code2 className="w-6 h-6" />;
  if (lower.includes('hiring') || lower.includes('recruiter')) return <Users className="w-6 h-6" />;
  return <Briefcase className="w-6 h-6" />;
};

// Bento Grid sizes based on index
const getBentoClasses = (index: number, total: number) => {
  // A sleek 2x2 or dynamic grid
  if (total === 4) {
    if (index === 0) return "col-span-1 md:col-span-2 row-span-1";
    if (index === 3) return "col-span-1 md:col-span-2 row-span-1";
    return "col-span-1 row-span-1";
  }
  return "col-span-1";
};

export default function IntentGatewayClient({ personas }: { personas: Persona[] }) {
  const router = useRouter();
  const { setPersona } = usePersona();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
      
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSelect = async (persona: Persona) => {
    setIsLoading(true);
    setSelectedId(persona._id);
    
    // Set Context
    setPersona({ 
      _id: persona._id, 
      name: persona.name, 
      theme: persona.theme,
      description: persona.description,
      sectionOrder: persona.sectionOrder
    });

    try {
      // 1. Generate IDs
      const sessionId = crypto.randomUUID();
      const sessionSlug = `session-${Date.now().toString(36)}`;
      
      localStorage.setItem('sessionId', sessionId);

      // 2. Register telemetry payload silently
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          slug: sessionSlug,
          companyName: companyName.trim() || 'Anonymous Visitor',
          role: persona.name,
          inferredPersona: persona._id,
          userAgent: window.navigator.userAgent,
        }),
      });

      // 3. Elegant exit animation
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          router.push('/overview');
        }
      });

    } catch (error) {
      console.error('Failed to register session', error);
      router.push('/overview');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div ref={containerRef} className="max-w-4xl w-full z-10 opacity-0 py-12">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
            Welcome to the Narrative.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Please enter your organization and select the lens through which you'd like to explore this portfolio.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <label htmlFor="company" className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block mb-2 px-1">
            Organization (Optional)
          </label>
          <Input
            id="company"
            type="text"
            placeholder="e.g. Vercel, Stripe, Stealth Startup"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-14 bg-card/50 backdrop-blur-sm border-border/50 text-base shadow-inner focus-visible:ring-primary/50"
            disabled={isLoading}
          />
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[160px]">
          {personas.map((persona, i) => {
            const isSelected = selectedId === persona._id;
            return (
              <button
                key={persona._id}
                disabled={isLoading}
                onClick={() => handleSelect(persona)}
                className={cn(
                  "group relative text-left p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-500",
                  getBentoClasses(i, personas.length),
                  "hover:bg-card hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1",
                  isSelected ? "bg-card border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "",
                  isLoading && !isSelected ? "opacity-50 grayscale" : ""
                )}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      {getIconForPersona(persona.name)}
                    </div>
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background transition-all duration-300 group-hover:translate-x-1">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {persona.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
