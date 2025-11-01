'use client';

import { Github, Linkedin, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

type Links = {
  github?: string;
  linkedin?: string;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
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
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          &copy; {currentYear} MD Gohar Khan. All Rights Reserved.
        </p>
        <div className="flex items-center space-x-2">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <a href={links.github || '#'} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
              <a href={links.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
