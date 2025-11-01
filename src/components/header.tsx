'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Github, Linkedin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/data';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">DevFolio</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/Manish-Das-Resume.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Resume
            </a>
          </Button>
          <div className="hidden md:flex items-center space-x-2">
            <a href="https://github.com/manish-das-22" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </a>
            <a href="https://linkedin.com/in/manish-das-02" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </a>
          </div>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden ml-4" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col h-full py-6">
                <Link href="/" className="mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-bold text-lg">DevFolio</span>
                </Link>
                <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                </nav>
                <div className="mt-auto flex items-center gap-4">
                    <a href="https://github.com/manish-das-22" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Button>
                    </a>
                    <a href="https://linkedin.com/in/manish-das-02" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Button>
                    </a>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
