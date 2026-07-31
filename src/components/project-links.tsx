'use client';

import { Github, ExternalLink } from 'lucide-react';
import { useExactTelemetry } from '@/hooks/useExactTelemetry';

export default function ProjectLinks({ 
  githubUrl, 
  demoUrl, 
  projectTitle 
}: { 
  githubUrl?: string, 
  demoUrl?: string,
  projectTitle: string
}) {
  const { trackClick } = useExactTelemetry();

  return (
    <div className="flex gap-4 pt-4">
      {githubUrl && (
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => trackClick(`GitHub: ${projectTitle}`)}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
        >
          <Github className="w-4 h-4 mr-2" /> Source Code
        </a>
      )}
      {demoUrl && (
        <a 
          href={demoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => trackClick(`Demo: ${projectTitle}`)}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-emerald-500 text-black hover:bg-emerald-600 font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
        </a>
      )}
    </div>
  );
}
