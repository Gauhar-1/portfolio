'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Github, Linkedin, Download, Loader2, Mail, Twitter, Wifi, Battery, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/data';
import { cn } from '@/lib/utils';

type Links = {
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  x?: string;
  email?: string;
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [links, setLinks] = useState<Links>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  // --- 1. FETCH LINKS ---
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/links');
        const data = await res.json();
        setLinks(data || {});
      } catch (error) {
        console.error("Failed to fetch links", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // --- 2. SYSTEM CLOCK & SCROLL SPY ---
  useEffect(() => {
    // Clock
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    // Scroll Handler
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll Spy Logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 200)) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* GLOBAL SMOOTH SCROLL */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>

      <header 
        className={cn(
            "fixed top-0 z-50 w-full transition-all duration-300 border-b",
            scrolled 
                ? "bg-[#050505]/90 backdrop-blur-md border-emerald-900/30 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
                : "bg-transparent border-transparent py-4"
        )}
      >
        {/* DECORATIVE TOP LINE (Only visible on scroll) */}
        <div className={cn(
            "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0"
        )}></div>

        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          
          {/* --- LEFT: IDENTITY BLOCK --- */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative flex h-8 w-8 items-center justify-center bg-emerald-900/20 border border-emerald-500/50 rounded-sm overflow-hidden group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                  <span className="font-mono font-bold text-emerald-500 group-hover:text-black">OP</span>
                  {/* Scan line */}
                  <div className="absolute top-0 w-full h-[1px] bg-emerald-400/50 animate-scan-down opacity-50"></div>
              </div>
              <div className="flex flex-col">
                  <span className="font-bold text-white tracking-wider text-sm group-hover:text-emerald-400 transition-colors">GOHAR_KHAN</span>
                  <span className="text-[9px] font-mono text-slate-500 tracking-[0.2em] group-hover:text-emerald-600 transition-colors">DEV_OPERATOR</span>
              </div>
            </Link>

            {/* --- SYSTEM STATUS (Desktop) --- */}
            <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600/70">
                    <Wifi className="w-3 h-3" />
                    <span>NET_ONLINE</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600/70">
                    <Battery className="w-3 h-3" />
                    <span>PWR_100%</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span>UTC {time}</span>
                </div>
            </div>
          </div>

          {/* --- CENTER: TACTICAL NAVIGATION --- */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "relative px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:text-emerald-400",
                        isActive ? "text-emerald-500" : "text-slate-400"
                    )}
                  >
                    {isActive && (
                        <div className="absolute inset-0 bg-emerald-500/5 border-x border-emerald-500/20 skew-x-[-12deg]"></div>
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {/* Active Indicator Dot */}
                    {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>}
                  </Link>
                );
            })}
          </nav>

          {/* --- RIGHT: COMMS & RESUME --- */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            ) : (
              <>
                {/* SOCIAL BUTTONS */}
                <div className="hidden lg:flex items-center space-x-1 border-r border-white/10 pr-4 mr-2">
                  {links.github && <SocialBtn href={links.github} icon={<Github className="h-4 w-4" />} label="GH" />}
                  {links.linkedin && <SocialBtn href={links.linkedin} icon={<Linkedin className="h-4 w-4" />} label="LI" />}
                  {links.x && <SocialBtn href={links.x} icon={<Twitter className="h-4 w-4" />} label="X" />}
                  {links.email && <SocialBtn href={`mailto:${links.email}`} icon={<Mail className="h-4 w-4" />} label="EM" />}
                </div>

                {/* DOWNLOAD RESUME */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hidden sm:flex border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black uppercase tracking-widest text-[10px] font-bold h-8 bg-emerald-950/30"
                >
                  <a href={links.resumeUrl || '/MD-Gohar-Khan-Resume.pdf'} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-3 w-3" />
                    GET_INTEL
                  </a>
                </Button>
              </>
            )}

            {/* MOBILE MENU TRIGGER */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden text-emerald-500 hover:bg-emerald-950/50 hover:text-emerald-400" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-emerald-900/50 bg-[#0a0a0a]/95 backdrop-blur-xl p-0">
                
                {/* MOBILE MENU CONTENT */}
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <span className="font-mono text-sm font-bold text-white tracking-widest">TAC_MAP</span>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col p-6 gap-2">
                        {NAV_LINKS.map((link, i) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex items-center justify-between p-3 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-900/20 rounded-sm transition-all duration-300"
                          >
                            <span className="text-sm font-mono text-slate-400 group-hover:text-white uppercase tracking-wider">
                                {link.label}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-800 group-hover:text-emerald-500">0{i+1}</span>
                          </Link>
                        ))}
                    </nav>

                    {/* Footer / Socials */}
                    <div className="mt-auto p-6 border-t border-white/10 bg-black/20">
                        <div className="flex justify-center gap-4">
                             {links.github && <MobileSocial href={links.github} icon={<Github className="h-5 w-5" />} />}
                             {links.linkedin && <MobileSocial href={links.linkedin} icon={<Linkedin className="h-5 w-5" />} />}
                             {links.email && <MobileSocial href={`mailto:${links.email}`} icon={<Mail className="h-5 w-5" />} />}
                        </div>
                        <div className="mt-6 text-center">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs" asChild>
                                <a href={links.resumeUrl || '/resume.pdf'}>Download Resume </a>
                            </Button>
                        </div>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </header>
    </>
  );
};

// --- HELPER COMPONENTS ---

const SocialBtn = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group relative p-2">
        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-sm transition-colors"></div>
        <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
            {icon}
        </div>
        <span className="sr-only">{label}</span>
    </a>
);

const MobileSocial = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all rounded-sm">
        {icon}
    </a>
);

export default Header;