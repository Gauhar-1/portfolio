'use client';

import { useExactTelemetry } from '@/hooks/useExactTelemetry';

export default function ClientTracker({ targetName }: { targetName: string }) {
  useExactTelemetry(targetName);
  return null;
}
