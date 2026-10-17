'use client';

import { SectionId } from '@/hooks/useMasterScrollOrchestrator';

interface SectionNavHUDProps {
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
}

export default function SectionNavHUD({
  activeSection,
  onSelectSection,
}: SectionNavHUDProps) {
  const sections: { id: SectionId; label: string; code: string }[] = [
    { id: 'hero', label: 'HERO', code: '01' },
    { id: 'experience', label: 'EXP', code: '02' },
    { id: 'projects', label: 'ARSENAL', code: '03' },
    { id: 'contact', label: 'COMMS', code: '04' },
  ];

  return (
    <nav
      aria-label="Tactical Section Navigation"
      className="fixed right-3.5 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5 font-mono text-[10px] select-none p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl"
      style={{
        background: 'rgba(7, 9, 12, 0.75)',
      }}
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => onSelectSection(sec.id)}
            className="group flex items-center justify-end gap-2 px-2 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-left"
            style={{
              background: isActive
                ? 'color-mix(in srgb, var(--theme-primary, #10B981) 18%, transparent)'
                : 'transparent',
              border: `1px solid ${
                isActive
                  ? 'color-mix(in srgb, var(--theme-primary, #10B981) 40%, transparent)'
                  : 'transparent'
              }`,
            }}
          >
            <span
              className={`text-[9px] tracking-wider uppercase font-bold transition-colors ${
                isActive
                  ? 'text-[var(--theme-primary,#10B981)]'
                  : 'text-white/40 group-hover:text-white/80'
              }`}
            >
              {sec.code} {sec.label}
            </span>

            <span
              className="w-2 h-2 rounded-full transition-transform duration-300 shrink-0"
              style={{
                backgroundColor: isActive
                  ? 'var(--theme-primary, #10B981)'
                  : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isActive
                  ? '0 0 10px var(--theme-primary, #10B981)'
                  : 'none',
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
