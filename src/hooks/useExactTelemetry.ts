import { useEffect, useRef, useCallback } from 'react';
import { getSessionId } from '@/lib/telemetry';

type EventType = 'PAGE_VIEW' | 'OUTBOUND_CLICK' | 'CONTACT_INITIATED';

export function useExactTelemetry(targetName?: string) {
  const startTimeRef = useRef<number | null>(null);

  // Helper to send beacon
  const sendTelemetry = useCallback((eventType: EventType, target: string, duration?: number) => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const payload = JSON.stringify({
      sessionId,
      event: {
        eventType,
        target,
        duration,
      },
    });

    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/telemetry', blob);
  }, []);

  useEffect(() => {
    if (!targetName) return;
    
    startTimeRef.current = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (startTimeRef.current && targetName) {
          const duration = Date.now() - startTimeRef.current;
          sendTelemetry('PAGE_VIEW', targetName, duration);
          startTimeRef.current = null;
        }
      } else if (document.visibilityState === 'visible') {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (startTimeRef.current) {
        const duration = Date.now() - startTimeRef.current;
        sendTelemetry('PAGE_VIEW', targetName!, duration);
        startTimeRef.current = null;
      }
    };
  }, [targetName, sendTelemetry]);

  const trackClick = useCallback((clickTarget: string) => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        event: {
          eventType: 'OUTBOUND_CLICK',
          target: clickTarget
        }
      })
    }).catch(console.error);
  }, []);

  const trackContactInit = useCallback(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        event: {
          eventType: 'CONTACT_INITIATED',
          target: 'Contact Form'
        }
      })
    }).catch(console.error);
  }, []);

  return { trackClick, trackContactInit };
}
