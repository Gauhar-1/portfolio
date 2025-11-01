'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Github, Linkedin, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Links = {
  github?: string;
  linkedin?: string;
};

const HeroSection = () => {
  const [links, setLinks] = useState<Links>({});
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <section id="home" className="py-24 sm:py-32 md:py-40 animate-fade-in">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-slide-in-from-bottom [animation-delay:0.2s] opacity-0 fill-mode-forwards">
          Full-Stack Developer & DevOps Enthusiast
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground animate-slide-in-from-bottom [animation-delay:0.4s] opacity-0 fill-mode-forwards">
          I build robust and scalable web applications from front to back, with a passion for creating efficient, secure, and user-friendly digital experiences.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 animate-slide-in-from-bottom [animation-delay:0.6s] opacity-0 fill-mode-forwards">
          <Button asChild size="lg">
            <Link href="#projects">
              View My Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#contact">Get In Touch</Link>
          </Button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in [animation-delay:0.8s] opacity-0 fill-mode-forwards">
            {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : (
              <>
                <a href={links.github || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-7 w-7" />
                    <span className="sr-only">GitHub</span>
                </a>
                <a href={links.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-7 w-7" />
                    <span className="sr-only">LinkedIn</span>
                </a>
              </>
            )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
