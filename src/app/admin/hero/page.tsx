'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Crosshair,
  Sparkles,
  Layers,
  Link as LinkIcon,
  Activity,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';

interface ArchitectureOption {
  slug: string;
  name: string;
  theme?: {
    primaryHex: string;
    backgroundHex: string;
    textHex: string;
  };
}

interface HeroFormValues {
  callsign: string;
  classTitle: string;
  statusBadge: string;
  headline: string;
  subheadline: string;
  avatarUrl: string;
  attributes: {
    label: string;
    displayValue: string;
    fillPercent: number;
  }[];
  loadoutSlots: {
    slotNumber: string;
    architectureSlug: string;
    roleClass: string;
    customBrief?: string;
  }[];
  links: {
    github: string;
    linkedin: string;
    x: string;
    email: string;
    resumeUrl: string;
  };
}

export default function AdminHeroPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [architectures, setArchitectures] = useState<ArchitectureOption[]>([]);

  const form = useForm<HeroFormValues>({
    defaultValues: {
      callsign: 'OP // MD GOHAR KHAN',
      classTitle: '0-TO-1 SYSTEMS & AI ARCHITECT',
      statusBadge: "STATUS: READY FOR DEPLOYMENT // NITS '26",
      headline: '',
      subheadline: '',
      avatarUrl: '/Gauhar.png',
      attributes: [],
      loadoutSlots: [
        { slotNumber: '01', architectureSlug: 'quickbiteqr', roleClass: 'HIGH-CONCURRENCY & FINTECH', customBrief: '' },
        { slotNumber: '02', architectureSlug: 'founderdiary', roleClass: 'HEADLESS CMS & DYNAMIC UI', customBrief: '' },
        { slotNumber: '03', architectureSlug: 'rajyasampark', roleClass: 'DISTRIBUTED MICROSERVICES', customBrief: '' },
        { slotNumber: '04', architectureSlug: 'taujiludo', roleClass: 'REAL-TIME STATE & 3D WEBGL', customBrief: '' },
      ],
      links: {
        github: '',
        linkedin: '',
        x: '',
        email: '',
        resumeUrl: '',
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = form;

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: 'attributes',
  });

  const avatarUrlWatch = watch('avatarUrl');
  const watchedSlots = watch('loadoutSlots');

  // Fetch Hero data & Architecture list on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Fetch hero config and links
        const heroRes = await fetch('/api/admin/hero');
        const heroData = await heroRes.json();

        // Fetch architectures list
        const archRes = await fetch('/api/admin/architectures');
        const archList = await archRes.json();
        setArchitectures(Array.isArray(archList) ? archList : []);

        if (heroData?.heroConfig) {
          const config = heroData.heroConfig;
          reset({
            callsign: config.callsign || 'OP // MD GOHAR KHAN',
            classTitle: config.classTitle || '0-TO-1 SYSTEMS & AI ARCHITECT',
            statusBadge: config.statusBadge || "STATUS: READY FOR DEPLOYMENT // NITS '26",
            headline: config.headline || '',
            subheadline: config.subheadline || '',
            avatarUrl: config.avatarUrl || '/Gauhar.png',
            attributes: config.attributes || [],
            loadoutSlots: config.loadoutSlots?.length
              ? config.loadoutSlots
              : [
                  { slotNumber: '01', architectureSlug: 'quickbiteqr', roleClass: 'HIGH-CONCURRENCY & FINTECH', customBrief: '' },
                  { slotNumber: '02', architectureSlug: 'founderdiary', roleClass: 'HEADLESS CMS & DYNAMIC UI', customBrief: '' },
                  { slotNumber: '03', architectureSlug: 'rajyasampark', roleClass: 'DISTRIBUTED MICROSERVICES', customBrief: '' },
                  { slotNumber: '04', architectureSlug: 'taujiludo', roleClass: 'REAL-TIME STATE & 3D WEBGL', customBrief: '' },
                ],
            links: {
              github: heroData.links?.github || '',
              linkedin: heroData.links?.linkedin || '',
              x: heroData.links?.x || '',
              email: heroData.links?.email || '',
              resumeUrl: heroData.links?.resumeUrl || '',
            },
          });
        }
      } catch (error) {
        console.error('Failed to load hero configuration:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch hero settings from database.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [reset, toast]);

  // Submit Handler
  const onSubmit = async (values: HeroFormValues) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroConfigData: {
            callsign: values.callsign,
            classTitle: values.classTitle,
            statusBadge: values.statusBadge,
            headline: values.headline,
            subheadline: values.subheadline,
            avatarUrl: values.avatarUrl,
            attributes: values.attributes,
            loadoutSlots: values.loadoutSlots,
          },
          linksData: values.links,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save hero configuration');
      }

      toast({
        title: 'Success',
        description: 'Hero configuration and architecture loadouts updated successfully!',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Crosshair className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Hero Section Manager</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure operator telemetry, stat bars, and cross-collection architecture loadouts.
          </p>
        </div>

        <Button type="submit" disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {/* ── Block 1: Operator Identity & Photo ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle>Block 1: Operator Identity &amp; Telemetry</CardTitle>
          </div>
          <CardDescription>
            Personal callsign, rank credentials, headline narrative, and tactical avatar URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Operator Callsign</Label>
              <Input placeholder="e.g. OP // MD GOHAR KHAN" {...register('callsign')} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Class Title</Label>
              <Input placeholder="e.g. 0-TO-1 SYSTEMS & AI ARCHITECT" {...register('classTitle')} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status HUD Badge</Label>
              <Input placeholder="e.g. STATUS: READY FOR DEPLOYMENT // NITS '26" {...register('statusBadge')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Primary Tactical Headline</Label>
            <Input
              placeholder="e.g. I engineer production systems that survive Friday night rushes and protect 98% compute margins."
              {...register('headline')}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sub-headline Credentials &amp; Background</Label>
            <Textarea
              rows={2}
              placeholder="e.g. B.Tech NIT Silchar '26 • NCC Cadet • Full-Stack & AI Systems Engineer..."
              {...register('subheadline')}
            />
          </div>

          {/* Avatar URL + Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pt-2">
            <div className="md:col-span-3 space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                Operator Photo URL (or public asset path)
              </Label>
              <Input placeholder="/Gauhar.png or https://..." {...register('avatarUrl')} />
              <p className="text-[11px] text-muted-foreground">
                Path to operator avatar in <code className="text-xs">/public</code> or hosted CDN URL.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-border/80 bg-muted/40">
              <span className="text-[10px] font-mono text-muted-foreground mb-1.5">PHOTO PREVIEW</span>
              <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                {avatarUrlWatch ? (
                  <img
                    src={avatarUrlWatch}
                    alt="Preview"
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/profile.jpg';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted text-xs font-mono">
                    NONE
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Block 2: Operator Stat Bars ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle>Block 2: FPS Attribute Stat Bars</CardTitle>
              </div>
              <CardDescription>
                Configure the tactical skill benchmark telemetry bars shown on the left of the Hero.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAttribute({ label: 'NEW ATTRIBUTE', displayValue: '99%', fillPercent: 90 })}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat Bar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {attributeFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 bg-muted/20"
            >
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] font-mono uppercase text-muted-foreground">Label</Label>
                <Input
                  placeholder="e.g. HIGH-CONCURRENCY BACKEND"
                  {...register(`attributes.${index}.label` as const)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="w-32 space-y-1">
                <Label className="text-[10px] font-mono uppercase text-muted-foreground">Display Value</Label>
                <Input
                  placeholder="e.g. 250+ RPS"
                  {...register(`attributes.${index}.displayValue` as const)}
                  className="h-8 text-xs font-mono font-bold"
                />
              </div>

              <div className="w-28 space-y-1">
                <Label className="text-[10px] font-mono uppercase text-muted-foreground">Fill % (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...register(`attributes.${index}.fillPercent` as const, { valueAsNumber: true })}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttribute(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {attributeFields.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No stat bars configured. Click &ldquo;Add Stat Bar&rdquo; to create one.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Block 3: The 4 Architecture Loadout Selectors ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle>Block 3: The 4 Architecture Loadout Selectors</CardTitle>
          </div>
          <CardDescription>
            Map the 4 quick-switch weapon loadouts to dynamic case study documents saved in the Architecture collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((slotIdx) => {
              const currentSlot = watchedSlots?.[slotIdx];
              const selectedSlug = currentSlot?.architectureSlug;
              const matchedArch = architectures.find((a) => a.slug === selectedSlug);
              const theme = matchedArch?.theme || {
                primaryHex: '#10B981',
                backgroundHex: '#0A0A0C',
                textHex: '#F8FAFC',
              };

              return (
                <div
                  key={slotIdx}
                  className="rounded-xl border border-border p-4 space-y-3 bg-muted/20 relative overflow-hidden"
                >
                  {/* Slot Header with 3-Token Swatch Preview */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        SLOT 0{slotIdx + 1}
                      </span>
                      <span className="text-xs font-semibold">
                        Hotkey [{slotIdx + 1}]
                      </span>
                    </div>

                    {/* Live 3-Token Theme Swatch Preview */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border/60 bg-black/40">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase mr-1">THEME:</span>
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.primaryHex }}
                        title={`Primary: ${theme.primaryHex}`}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.backgroundHex }}
                        title={`Background: ${theme.backgroundHex}`}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.textHex }}
                        title={`Text: ${theme.textHex}`}
                      />
                    </div>
                  </div>

                  {/* Architecture Dropdown Selector */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Associated Architecture</Label>
                    <select
                      {...register(`loadoutSlots.${slotIdx}.architectureSlug` as const)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                    >
                      {architectures.map((arch) => (
                        <option key={arch.slug} value={arch.slug}>
                          {arch.name} ({arch.slug})
                        </option>
                      ))}
                      {/* Fallback option if not in list */}
                      {!architectures.some((a) => a.slug === selectedSlug) && selectedSlug && (
                        <option value={selectedSlug}>{selectedSlug} (Current)</option>
                      )}
                    </select>
                  </div>

                  {/* Role Class (Recruiter JD Intent) */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Recruiter Role Class</Label>
                    <Input
                      placeholder="e.g. HIGH-CONCURRENCY & FINTECH"
                      {...register(`loadoutSlots.${slotIdx}.roleClass` as const)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  {/* Custom Brief Override */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">
                      Custom Brief Override <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Leave empty to use Architecture's hero subtitle..."
                      {...register(`loadoutSlots.${slotIdx}.customBrief` as const)}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Block 4: Comms & Links Integration ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            <CardTitle>Block 4: Comms &amp; Professional Intel Links</CardTitle>
          </div>
          <CardDescription>
            Live links synced with the Links database table and bound to hero quick-equip hotkeys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold font-mono">GitHub URL [G]</Label>
              <Input placeholder="https://github.com/..." {...register('links.github')} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold font-mono">LinkedIn URL [L]</Label>
              <Input placeholder="https://linkedin.com/in/..." {...register('links.linkedin')} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold font-mono">X / Twitter URL [X]</Label>
              <Input placeholder="https://x.com/..." {...register('links.x')} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold font-mono">Email Address [M]</Label>
              <Input placeholder="user@example.com" {...register('links.email')} className="h-8 text-xs" />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <Label className="text-xs font-semibold font-mono">Resume / CV Download URL [R]</Label>
            <Input placeholder="/resume.pdf or https://..." {...register('links.resumeUrl')} className="h-8 text-xs" />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving} size="lg" className="gap-2 px-8">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving Changes...' : 'Save All Changes'}
        </Button>
      </div>
    </form>
  );
}
