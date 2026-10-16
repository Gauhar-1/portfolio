'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Loader2,
  ChevronRight,
  Upload,
  ImageIcon,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Replace,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { projectSchema, ProjectFormValues, extractCloudinaryPublicId } from './schema';

// Re-export for consumers (new/page.tsx, [id]/page.tsx)
export { projectSchema };
export type { ProjectFormValues };

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

// ---------------------------------------------------------------------------
// Helper: Image upload with old-image swap/delete
// ---------------------------------------------------------------------------
async function uploadImageWithSwap(
  file: File,
  currentUrl: string | undefined
): Promise<{ url: string; publicId: string }> {
  if (currentUrl) {
    const oldPublicId = extractCloudinaryPublicId(currentUrl);
    if (oldPublicId) {
      await fetch('/api/projects/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: oldPublicId }),
      }).catch(console.error);
    }
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/projects/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }

  const data = await res.json();
  return { url: data.url, publicId: data.publicId };
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  title,
}: ProjectFormProps) {
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [architectures, setArchitectures] = useState<Array<{ slug: string; name: string }>>([]);
  const [loadingArchs, setLoadingArchs] = useState(true);

  // Fetch architectures to check if slug matches an existing blueprint
  useEffect(() => {
    let isMounted = true;
    async function loadArchitectures() {
      try {
        const res = await fetch('/api/admin/architectures');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setArchitectures(data || []);
        }
      } catch (err) {
        console.error('Failed to load architectures for slug matching', err);
      } finally {
        if (isMounted) setLoadingArchs(false);
      }
    }
    loadArchitectures();
    return () => {
      isMounted = false;
    };
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      slug:
        defaultValues?.slug ||
        (defaultValues?.title || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
      category: defaultValues?.category || 'AI_RAG',
      featuredOrder:
        typeof defaultValues?.featuredOrder === 'number' ? defaultValues.featuredOrder : 99,
      tagline: defaultValues?.tagline || '',
      overview: defaultValues?.overview || '',
      technologies: defaultValues?.technologies || '',
      imageUrl: defaultValues?.imageUrl || '',
      videoUrl: defaultValues?.videoUrl || '',
      links: {
        website: defaultValues?.links?.website || '',
        github: defaultValues?.links?.github || '',
        demo: defaultValues?.links?.demo || '',
      },
    },
  });

  const watchedSlug = form.watch('slug') || '';
  const normalizedWatchedSlug = watchedSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchedArch = architectures.find(
    (a) => (a.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedWatchedSlug
  );

  // Handle Cover Image upload
  const handleCoverUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsCoverUploading(true);
      try {
        const currentUrl = form.getValues('imageUrl');
        const { url } = await uploadImageWithSwap(file, currentUrl || undefined);
        form.setValue('imageUrl', url, { shouldValidate: true });

        toast({
          title: 'Cover Image Uploaded!',
          description: 'Your project cover screenshot is saved.',
        });
      } catch (error: any) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message || 'Could not upload image.',
        });
      } finally {
        setIsCoverUploading(false);
        if (coverInputRef.current) {
          coverInputRef.current.value = '';
        }
      }
    },
    [form, toast]
  );

  return (
    <div className="min-h-screen bg-secondary pb-24 overflow-y-auto">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href="/admin/projects" className="hover:text-primary transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" asChild variant="outline" size="sm">
              <Link href="/admin/projects">Cancel</Link>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting || isCoverUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 1: Core Identity & Cross-Collection Architecture Link */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Project Identity & Architecture Link
                </CardTitle>
                <CardDescription>
                  Define the project title, hiring intent category, sorting order, and architecture
                  collection link via slug.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. QuickBiteQR, Founder Diary"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const auto = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, '');
                              form.setValue('slug', auto, { shouldValidate: true });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Lookup Slug *</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">
                            Auto-Formatted
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. quickbiteqr"
                            {...field}
                            onChange={(e) => {
                              const clean = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, '');
                              field.onChange(clean);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Lowercase, alphanumeric only. Matches{' '}
                          <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
                            /architecture/[slug]
                          </code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Architecture Blueprint Match Indicator */}
                <div className="p-3.5 rounded-lg border text-xs font-mono transition-all">
                  {loadingArchs ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Checking matching Architecture blueprint...
                    </div>
                  ) : matchedArch ? (
                    <div className="flex items-center justify-between gap-3 text-emerald-400 bg-emerald-500/10 border-emerald-500/30 p-2.5 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>
                          <strong>Connected Blueprint:</strong> &ldquo;{matchedArch.name}&rdquo; (
                          <code>/architecture/{matchedArch.slug}</code>)
                        </span>
                      </div>
                      <Link
                        href={`/architecture/${matchedArch.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] underline hover:text-emerald-300 shrink-0"
                      >
                        Preview <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border-amber-500/30 p-2.5 rounded-md">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>
                        <strong>Standalone Project:</strong> No Architecture blueprint found for{' '}
                        <code>{normalizedWatchedSlug || 'this-slug'}</code>. Recruiter stage will
                        render standalone fallback.
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recruiter JD Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select intent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AI_RAG">🧠 AI & RAG Engines</SelectItem>
                            <SelectItem value="SYSTEMS_ENGINES">
                              ⚡ Distributed & Media Engines
                            </SelectItem>
                            <SelectItem value="FULLSTACK_SAAS">🧩 Full-Stack & SaaS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Pigeonholes project under recruiter filter tabs.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Featured Order */}
                  <FormField
                    control={form.control}
                    name="featuredOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Display Order</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={999} {...field} />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first (e.g. 1, 2, 3... default 99).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tagline */}
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline (5-8 Word Hook) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Serverless POS handling Friday dinner rushes at 98% compute margins"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Crisp punchline visible in the left selector list.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Overview */}
                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview (2-Sentence Business Problem + Ownership) *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Restaurant traffic is aggressively clustered on Friday nights, causing relational databases to exhaust connection limits. I architected an edge-cached, serverless POS reducing read load by 92%."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Concise narrative shown on the tactical visual stage.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Technologies */}
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (Comma-separated) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Next.js 15, TypeScript, Upstash Redis, PostgreSQL, TailwindCSS"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 2: Visual Stage Media & Links                          */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Visual Showcase & External Links
                </CardTitle>
                <CardDescription>
                  Upload cover screenshot, optional preview video loop, and repo/live links.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover Image */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Cover Screenshot *</FormLabel>
                        <div className="flex gap-2 items-start">
                          <FormControl>
                            <Input
                              placeholder="https://res.cloudinary.com/..."
                              {...field}
                              className="flex-1"
                              readOnly
                            />
                          </FormControl>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={coverInputRef}
                            onChange={handleCoverUpload}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={isCoverUploading}
                          >
                            {isCoverUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : field.value ? (
                              <>
                                <Replace className="mr-2 h-4 w-4" />
                                Replace
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Thumbnail preview */}
                  {form.watch('imageUrl') && (
                    <div className="relative w-full max-w-sm h-48 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={form.watch('imageUrl')}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video URL */}
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Preview URL (Optional MP4 / WebM Loop)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/demo.mp4 or YouTube embed"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Plays muted loop in holographic stage if supplied.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website / Live Demo */}
                  <FormField
                    control={form.control}
                    name="links.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Demo / Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub URL */}
                  <FormField
                    control={form.control}
                    name="links.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Repository URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Secondary Demo */}
                  <FormField
                    control={form.control}
                    name="links.demo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
