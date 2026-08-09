'use client';

import React, { useEffect, useRef, useState, cloneElement, isValidElement } from 'react';
import { getSessionId } from '@/lib/telemetry';

type IntentEventType =
  | 'VIEW_DIAGRAM'
  | 'READ_TRADEOFFS'
  | 'COPY_DX_COMMANDS'
  | 'PLAY_VIDEO'
  | 'CLICK_GITHUB'
  | 'CLICK_DEMO'
  | 'SECTION_DWELL';

interface ProjectIntentObserverProps {
  projectId: string;
  eventType: IntentEventType;
  weight: number;
  triggerOn?: 'view' | 'click';
  children: React.ReactNode;
  className?: string;
}

export default function ProjectIntentObserver({
  projectId,
  eventType,
  weight,
  triggerOn = 'view',
  children,
  className = '',
}: ProjectIntentObserverProps) {
  const [hasTriggered, setHasTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const logIntent = async () => {
    if (hasTriggered) return;
    setHasTriggered(true);

    const sessionId = getSessionId();
    if (!sessionId) return;

    try {
      await fetch('/api/telemetry/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          projectId,
          eventType,
          weight,
        }),
      });
    } catch (error) {
      console.error(`Failed to log telemetry intent for ${eventType}:`, error);
    }
  };

  useEffect(() => {
    if (triggerOn !== 'view' || hasTriggered) return;

    const currentRef = containerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          logIntent();
          observer.disconnect();
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [triggerOn, hasTriggered]);

  const handleClick = () => {
    if (triggerOn === 'click') {
      logIntent();
    }
  };

  // If we only have one valid React element and we want to attach click without wrapper div?
  // Using a wrapper div is generally safer to avoid breaking child refs or styles, but let's
  // allow className passthrough.

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={triggerOn === 'click' ? handleClick : undefined}
      role={triggerOn === 'click' ? 'presentation' : undefined}
    >
      {children}
    </div>
  );
}
