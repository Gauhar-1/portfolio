'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Github, Linkedin, ArrowRight, Loader2, Mail, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Links = {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  profilePhotoUrl?: string;
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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center animate-slide-in-from-bottom [animation-delay:0.2s] opacity-0 fill-mode-forwards">
                <Avatar className="w-48 h-48 md:w-64 md:h-64 border-4 border-primary/20 shadow-xl">
                    <AvatarImage src={links.profilePhotoUrl || 'https://picsum.photos/seed/gohar/400/400'} alt="MD Gohar Khan" data-ai-hint="man portrait" className="object-cover"/>
                    <AvatarFallback>MGK</AvatarFallback>
                </Avatar>
            </div>
            <div className="md:col-span-2 text-center md:text-left">
                <p className="text-primary font-semibold tracking-wide animate-slide-in-from-bottom [animation-delay:0.3s] opacity-0 fill-mode-forwards">Hello, I'm</p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-slide-in-from-bottom [animation-delay:0.4s] opacity-0 fill-mode-forwards">
                    MD Gohar Khan
                </h1>
                <h2 className="mt-2 text-2xl font-semibold text-muted-foreground sm:text-3xl md:text-4xl animate-slide-in-from-bottom [animation-delay:0.5s] opacity-0 fill-mode-forwards">
                    Full-Stack Developer & DevOps Enthusiast
                </h2>
                <p className="mt-6 max-w-2xl mx-auto md:mx-0 text-lg leading-8 text-muted-foreground animate-slide-in-from-bottom [animation-delay:0.6s] opacity-0 fill-mode-forwards">
                I build robust and scalable web applications from front to back, with a passion for creating efficient, secure, and user-friendly digital experiences.
                </p>
                <div className="mt-10 flex items-center justify-center md:justify-start gap-x-6 animate-slide-in-from-bottom [animation-delay:0.7s] opacity-0 fill-mode-forwards">
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
                <div className="mt-8 flex items-center justify-center md:justify-start gap-x-6 animate-fade-in [animation-delay:0.8s] opacity-0 fill-mode-forwards">
                    {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : (
                    <>
                        {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-7 w-7" />
                            <span className="sr-only">GitHub</span>
                        </a>}
                        {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-7 w-7" />
                            <span className="sr-only">LinkedIn</span>
                        </a>}
                        {links.x && <a href={links.x} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-7 w-7" />
                            <span className="sr-only">X</span>
                        </a>}
                        {links.email && <a href={`mailto:${links.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Mail className="h-7 w-7" />
                            <span className="sr-only">Email</span>
                        </a>}
                    </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
