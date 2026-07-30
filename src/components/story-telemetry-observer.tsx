'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

export default function StoryTelemetryObserver({ 
  children, 
  storyTheme,
  pageType,
  pageId 
}: { 
  children: ReactNode;
  storyTheme: string;
  pageType: string;
  pageId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPinged, setHasPinged] = useState(false);

  useEffect(() => {
    if (hasPinged) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Dwell Time Tracking: > 15 seconds (+20 intent points)
          timeoutId = setTimeout(() => {
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
              fetch('/api/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId,
                  score: 20,
                  action: `Read ${pageType} Story: ${storyTheme}`,
                }),
              }).catch(err => console.error('Telemetry failed', err));
              
              setHasPinged(true);
            }
          }, 15000);
        } else {
          // Clear timer if they scroll past quickly
          clearTimeout(timeoutId);
        }
      },
      { threshold: 0.5 } // 50% of the story must be visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [hasPinged, storyTheme, pageType]);

  return <div ref={containerRef}>{children}</div>;
}
