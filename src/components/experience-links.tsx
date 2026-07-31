'use client';

import { ExternalLink } from 'lucide-react';
import { useExactTelemetry } from '@/hooks/useExactTelemetry';

export default function ExperienceLinks({ 
  websiteUrl, 
  companyName 
}: { 
  websiteUrl?: string, 
  companyName: string
}) {
  const { trackClick } = useExactTelemetry();

  if (!websiteUrl) return null;

  return (
    <div className="flex gap-4 pt-4">
      <a 
        href={websiteUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => trackClick(`Visit Company: ${companyName}`)}
        className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 font-medium transition-colors shadow-lg shadow-blue-500/20"
      >
        <ExternalLink className="w-4 h-4 mr-2" /> Visit Company
      </a>
    </div>
  );
}
