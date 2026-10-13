'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  architectureSchema,
  type ArchitectureFormValues,
} from '@/validations/architectureSchema';
import { ThemeSection } from './ThemeSection';
import { MetricsFieldArray } from './MetricsFieldArray';
import { ChallengesFieldArray } from './ChallengesFieldArray';
import { RoadmapFieldArray } from './RoadmapFieldArray';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Save,
  Loader2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { architecturesData } from '@/data/architectures';

const defaultFormValues: ArchitectureFormValues = {
  slug: '',
  name: '',
  theme: {
    primaryHex: '#10b981',
    backgroundHex: '#0a0a0c',
    textHex: '#f8fafc',
  },
  hero: {
    title: '',
    subtitle: '',
    metrics: [
      { title: 'Compute Margin', value: '98.9%', ariaLabel: 'Compute Margin 98.9%' },
      { title: 'Server Cost', value: '₹15 / mo', ariaLabel: 'Server Cost 15 INR per month' },
      { title: 'P99 Latency', value: '18ms', ariaLabel: 'P99 Latency 18 milliseconds' },
      { title: 'Orders Handled', value: '100K+', ariaLabel: 'Orders Handled 100 thousand plus' },
    ],
  },
  challenges: [
    {
      id: 'scale',
      title: 'Scaling 5,000+ Menus Without Memory Bloat',
      teaser: 'Edge SSR & Streaming Chunk Hydration',
      problem:
        'Full-menu server rendering consumed 300MB+ per tenant during weekend rushes, degrading response times and exceeding serverless memory limits.',
      solution:
        'Decomposed menu catalogs into lightweight immutable JSON chunks served via CDN edge caching with stale-while-revalidate invalidation.',
      impact:
        'Reduced server memory footprint by 92% and cut peak TTFB from 1.4s to 45ms under concurrent load.',
      visualKey: 'chart',
    },
    {
      id: 'concurrency',
      title: 'High-Concurrency Ordering Under Spotty Cellular',
      teaser: 'Optimistic UI & Idempotent Transaction Mesh',
      problem:
        'Restaurant diners in basement dining rooms experienced intermittent 3G drops, resulting in duplicated orders and stalled payment handshakes.',
      solution:
        'Designed an offline-first transactional queue using IndexedDB state sync paired with server-side UUIDv4 idempotency keys.',
      impact:
        'Zero duplicate orders across 100K+ live transactions and 99.98% delivery rate even in high packet-loss zones.',
      visualKey: 'security',
    },
    {
      id: 'infra',
      title: 'Zero-Idle Infrastructure for ₹15/Month Cost Ceiling',
      teaser: 'Edge Worker Mesh & Ephemeral Compute',
      problem:
        'Traditional container clusters incur high base costs during non-peak daytime hours, draining profit margins for independent eateries.',
      solution:
        'Migrated backend workloads to edge runtime workers and ephemeral micro-lambdas with scale-to-zero capabilities and cold-start minimization.',
      impact:
        'Maintained 98.9% compute margins with operational server costs capped at under ₹15 per restaurant per month.',
      visualKey: 'server',
    },
  ],
  roadmap: [
    {
      phase: 'Phase 1',
      title: 'Decentralized Edge Menu Ingestion',
      description:
        'Global distributed edge workers caching catalog payloads close to restaurant locations with sub-10ms localized latency.',
    },
    {
      phase: 'Phase 2',
      title: 'Predictive Kitchen Load Forecasting',
      description:
        'On-device tensor models predicting rush spikes 20 minutes before table seatings to pre-warm kitchen display queues.',
    },
  ],
};

interface ArchitectureFormProps {
  action: 'new' | 'edit';
  id?: string;
}

export function ArchitectureForm({ action, id }: ArchitectureFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingDoc, setLoadingDoc] = useState(action === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ArchitectureFormValues>({
    resolver: zodResolver(architectureSchema),
    defaultValues: defaultFormValues,
    mode: 'onTouched',
  });

  const watchedSlug = form.watch('slug');
  const watchedName = form.watch('name');

  // Load existing document if in edit mode
  useEffect(() => {
    if (action === 'edit' && id) {
      const fetchDoc = async () => {
        try {
          setLoadingDoc(true);
          const res = await fetch(`/api/admin/architectures/${id}`);
          if (!res.ok) {
            throw new Error('Failed to load architecture case study');
          }
          const doc = await res.json();
          form.reset({
            slug: doc.slug || '',
            name: doc.name || '',
            theme: {
              primaryHex: doc.theme?.primaryHex || '#10b981',
              backgroundHex: doc.theme?.backgroundHex || '#0a0a0c',
              textHex: doc.theme?.textHex || '#f8fafc',
            },
            hero: {
              title: doc.hero?.title || '',
              subtitle: doc.hero?.subtitle || '',
              metrics: doc.hero?.metrics || defaultFormValues.hero.metrics,
            },
            challenges: doc.challenges || defaultFormValues.challenges,
            roadmap: doc.roadmap || defaultFormValues.roadmap,
          });
        } catch (error: any) {
          console.error(error);
          toast({
            variant: 'destructive',
            title: 'Error loading document',
            description: error.message || 'Could not fetch architecture details.',
          });
          router.push('/admin/architectures');
        } finally {
          setLoadingDoc(false);
        }
      };

      fetchDoc();
    }
  }, [action, id, form, router, toast]);

  // Quick preset loader helper
  const handleLoadQuickbitePreset = () => {
    const qb = architecturesData['quickbiteqr'];
    if (qb) {
      form.reset({
        slug: qb.slug,
        name: qb.name,
        theme: qb.theme,
        hero: {
          title: qb.hero.title,
          subtitle: qb.hero.subtitle,
          metrics: qb.hero.metrics.map((m) => ({
            title: m.title,
            value: m.value,
            ariaLabel: m.ariaLabel || '',
          })),
        },
        challenges: qb.challenges.map((c) => ({
          id: c.id,
          title: c.title,
          teaser: c.teaser,
          problem: c.problem,
          solution: c.solution,
          impact: c.impact,
          visualKey: c.visualKey,
        })),
        roadmap: qb.roadmap.map((r) => ({
          phase: (r as any).phase || r.label || 'Phase 1',
          title: r.title,
          description: r.description,
        })),
      });

      toast({
        title: 'Template loaded',
        description: 'QuickbiteQR sample data loaded into form.',
      });
    }
  };

  const onSubmit = async (values: ArchitectureFormValues) => {
    try {
      setIsSubmitting(true);
      const url =
        action === 'edit' && id
          ? `/api/admin/architectures/${id}`
          : '/api/admin/architectures';
      const method = action === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save architecture');
      }

      toast({
        title: action === 'edit' ? 'Architecture updated!' : 'Architecture created!',
        description: `"${values.name}" case study successfully saved to MongoDB.`,
      });

      router.push('/admin/architectures');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission error',
        description: error.message || 'Something went wrong while saving.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDoc) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Fetching architecture case study from database...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-28">
      {/* ── Top Header & Actions ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              href="/admin/architectures"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Architectures
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">
              {action === 'edit' ? `Edit (${watchedName || 'Case Study'})` : 'Create New'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {action === 'edit' ? `Edit Architecture: ${watchedName}` : 'New Architecture Case Study'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure dynamic color tokens, Bento Box decision cards, and roadmap milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {action === 'new' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadQuickbitePreset}
              className="gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Load QuickbiteQR Template
            </Button>
          )}

          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/architectures">Cancel</Link>
          </Button>
        </div>
      </div>

      {/* ── Section 01: Basic Info & Theming ─────────────────────────── */}
      <ThemeSection form={form} />

      {/* ── Section 02: Hero & Metrics ───────────────────────────────── */}
      <MetricsFieldArray form={form} />

      {/* ── Section 03: Bento Challenges ─────────────────────────────── */}
      <ChallengesFieldArray form={form} />

      {/* ── Section 04: Future Roadmap ───────────────────────────────── */}
      <RoadmapFieldArray form={form} />

      {/* ── Floating Sticky Action Bar ───────────────────────────────── */}
      <div className="fixed bottom-4 left-4 right-4 md:left-64 md:right-8 z-40">
        <div className="rounded-2xl border border-border/80 bg-background/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">
                {action === 'edit' ? 'Editing Mode' : 'Drafting Case Study'}
              </span>
            </div>

            {watchedSlug && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-primary gap-1"
              >
                <Link href={`/architecture/${watchedSlug}`} target="_blank">
                  <ExternalLink className="h-3 w-3" />
                  Live Preview
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button asChild variant="outline" size="sm" disabled={isSubmitting}>
              <Link href="/admin/architectures">Discard</Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving to MongoDB...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {action === 'edit' ? 'Update Architecture' : 'Publish Architecture'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
