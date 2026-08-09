'use client';

import { Copy } from 'lucide-react';
import ProjectIntentObserver from './project-intent-observer';

interface CopyDxButtonProps {
  projectId: string;
  snippet: string;
}

export default function CopyDxButton({ projectId, snippet }: CopyDxButtonProps) {
  return (
    <ProjectIntentObserver projectId={projectId} eventType="COPY_DX_COMMANDS" weight={20} triggerOn="click">
      <button 
        className="flex items-center gap-2 text-xs font-mono text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 transition-colors rounded"
        onClick={() => {
          if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(snippet);
          }
        }}
      >
        <Copy className="w-3 h-3" /> COPY
      </button>
    </ProjectIntentObserver>
  );
}
