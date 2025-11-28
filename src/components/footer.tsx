'use client';

import { Github, Linkedin, Loader2, Mail, Twitter, ArrowUp, ShieldCheck, Activity, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Links = {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [links, setLinks] = useState<Links>({});
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH LINKS ---
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/links');
        const data = await res.json();
        setLinks(data || {});
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    fetchLinks();
  }, []);

  // --- EXTRACTION LOGIC ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-emerald-900/30 pt-16 pb-8 overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Scanline Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          {/* Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-emerald-500/50 blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
            
            {/* --- COL 1: IDENTITY & STATUS --- */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-900/20 border border-emerald-500/50 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none">GOHAR_KHAN</h3>
                        <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em]">SYSTEM ARCHITECT</span>
                    </div>
                </div>
                
                <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-xs">
                    // END_OF_FILE <br/>
                    Mission objectives completed. Intelligence secured. 
                    System standing by for next assignment.
                </p>

                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>SYSTEM_INTEGRITY: 100%</span>
                </div>
            </div>

            {/* --- COL 2: VISUAL BARCODE (DECORATION) --- */}
            <div className="hidden md:flex flex-col items-center justify-center opacity-30">
                <div className="flex items-end gap-1 h-12 mb-2">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-emerald-500/50"
                            style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                    ))}
                </div>
                <span className="text-[8px] font-mono text-emerald-500 tracking-[0.5em]">SECURE_HASH_256</span>
            </div>

            {/* --- COL 3: COMMS & EXTRACTION --- */}
            <div className="flex flex-col items-start md:items-end space-y-6">
                
                {/* Social Grid */}
                <div className="space-y-2 text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 block">
                        External Comms
                    </span>
                    <div className="flex gap-2">
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        ) : (
                            <>
                                {links.github && <FooterSocial href={links.github} icon={<Github className="w-4 h-4" />} />}
                                {links.linkedin && <FooterSocial href={links.linkedin} icon={<Linkedin className="w-4 h-4" />} />}
                                {links.x && <FooterSocial href={links.x} icon={<Twitter className="w-4 h-4" />} />}
                                {links.email && <FooterSocial href={`mailto:${links.email}`} icon={<Mail className="w-4 h-4" />} />}
                            </>
                        )}
                    </div>
                </div>

                {/* Extraction Button */}
                <button 
                    onClick={scrollToTop}
                    className="group flex items-center gap-3 px-4 py-2 border border-slate-700 hover:border-emerald-500 bg-slate-900/50 transition-all duration-300"
                >
                    <div className="text-right">
                        <span className="block text-[9px] font-mono text-slate-500 group-hover:text-emerald-500 transition-colors">RTB</span>
                        <span className="block text-xs font-bold text-white tracking-widest uppercase">Extract</span>
                    </div>
                    <div className="w-8 h-8 bg-slate-800 group-hover:bg-emerald-600 flex items-center justify-center transition-colors">
                        <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-black" />
                    </div>
                </button>

            </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span>&copy; {currentYear} GOHAR_KHAN </span>
                <span className="hidden md:inline text-slate-800">|</span>
                <span className="hidden md:inline">AUTH_CODE: 8X-99</span>
            </div>
            <div className="flex items-center gap-2">
                <Radio className="w-3 h-3" />
                <span>TRANSMISSION_ENDED </span>
            </div>
        </div>

      </div>
    </footer>
  );
};

// --- SUB-COMPONENT ---
const FooterSocial = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#0a0a0a] border border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all duration-300"
    >
        {icon}
    </a>
);

export default Footer;