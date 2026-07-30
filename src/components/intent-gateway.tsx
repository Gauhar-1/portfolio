'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { usePersona } from '@/context/PersonaContext';
import { Sparkles, Building2, Code2, Users, Briefcase, ChevronRight, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Persona = {
  _id: string;
  name: string;
  theme: string;
  sectionOrder?: string[];
};

const getIconForPersona = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('founder') || lower.includes('startup')) return <Building2 className="w-5 h-5" />;
  if (lower.includes('dev') || lower.includes('engineer') || lower.includes('cto')) return <Terminal className="w-5 h-5" />;
  if (lower.includes('hiring') || lower.includes('recruiter')) return <Users className="w-5 h-5" />;
  return <Briefcase className="w-5 h-5" />;
};

const getBentoClasses = (index: number, total: number) => {
  if (total === 4) {
    if (index === 0) return "col-span-1 md:col-span-2";
    if (index === 3) return "col-span-1 md:col-span-2";
    return "col-span-1";
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
      );
      
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, scale: 0.98, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSelect = async (persona: Persona) => {
    setIsLoading(true);
    setSelectedId(persona._id);
    
    setPersona({ 
      _id: persona._id, 
      name: persona.name, 
      theme: persona.theme,
      description: '', // Removed description usage
      sectionOrder: persona.sectionOrder
    });

    try {
      const sessionId = crypto.randomUUID();
      const sessionSlug = `session-${Date.now().toString(36)}`;
      
      // Store in cookies for middleware to read
      document.cookie = `sessionId=${sessionId}; path=/; max-age=604800`; // 7 days
      document.cookie = `sessionSlug=${sessionSlug}; path=/; max-age=604800`;
      
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

      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => router.push('/overview')
      });

    } catch (error) {
      console.error('Failed to register session', error);
      router.push('/overview');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-white/20">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div ref={containerRef} className="max-w-3xl w-full z-10 opacity-0 py-12">
        
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-white/5 border border-white/10 rounded-xl mb-2 text-zinc-100 shadow-2xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            System Initialization
          </h1>
          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-base text-zinc-400 font-light leading-relaxed">
              To respect your time, this system dynamically tailors its data payload based on your intent. Please provide your organization and role to compile the portfolio.
            </p>
            <p className="text-sm text-zinc-500 font-light border-t border-white/5 pt-4">
              <strong className="text-zinc-300 font-medium">Note:</strong> I value radical candor. If you spot an architectural flaw or UX friction while browsing, please roast me in the contact section.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <label htmlFor="company" className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest block mb-3 px-1">
            Organization
          </label>
          <Input
            id="company"
            type="text"
            placeholder="e.g. Vercel, Stripe, Stealth..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-14 bg-white/[0.02] border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 transition-all text-base"
            disabled={isLoading}
          />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {personas.map((persona, i) => {
            const isSelected = selectedId === persona._id;
            return (
              <button
                key={persona._id}
                disabled={isLoading}
                onClick={() => handleSelect(persona)}
                className={cn(
                  "group relative flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-300",
                  getBentoClasses(i, personas.length),
                  "hover:bg-white/[0.04] hover:border-white/20",
                  isSelected ? "bg-white/[0.08] border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "",
                  isLoading && !isSelected ? "opacity-30 grayscale pointer-events-none" : ""
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/5 rounded-lg text-zinc-300 group-hover:text-white transition-colors">
                    {getIconForPersona(persona.name)}
                  </div>
                  <h3 className="text-base font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {persona.name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}