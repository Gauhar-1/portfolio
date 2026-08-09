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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Loader2,
  PlusCircle,
  Trash2,
  ChevronRight,
  Upload,
  ImageIcon,
  BarChart3,
  Cpu,
  AlertTriangle,
  X,
  Replace,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useCallback } from 'react';
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
  // 1. If there's an existing Cloudinary image, delete it first
  if (currentUrl) {
    const oldPublicId = extractCloudinaryPublicId(currentUrl);
    if (oldPublicId) {
      await fetch('/api/projects/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: oldPublicId }),
      });
    }
  }

  // 2. Upload the new file
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

  // File input refs for the two image fields
  const coverInputRef = useRef<HTMLInputElement>(null);
  const diagramInputRef = useRef<HTMLInputElement>(null);

  // Upload loading states
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isDiagramUploading, setIsDiagramUploading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      title: '',
      tagline: '',
      overview: '',
      technologies: '',
      imageUrl: '',
      diagramUrl: '',
      videoUrl: '',
      links: { website: '', github: '', demo: '' },
      impactMetrics: [],
      systemFeatures: [],
      architecturalChallenges: [],
      dxSnippet: '',
    },
  });

  // --- Field Arrays ---
  const metricsArray = useFieldArray({ control: form.control, name: 'impactMetrics' });
  const featuresArray = useFieldArray({ control: form.control, name: 'systemFeatures' });
  const challengesArray = useFieldArray({ control: form.control, name: 'architecturalChallenges' });

  // --- Image upload handler (generic for both cover & diagram) ---
  const handleImageUpload = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      fieldName: 'imageUrl' | 'diagramUrl',
      setLoading: (v: boolean) => void,
      inputRef: React.RefObject<HTMLInputElement | null>
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const currentUrl = form.getValues(fieldName);
        const { url } = await uploadImageWithSwap(file, currentUrl || undefined);
        form.setValue(fieldName, url, { shouldValidate: true });

        toast({
          title: 'Image Uploaded!',
          description: `Your ${fieldName === 'imageUrl' ? 'cover image' : 'architecture diagram'} has been uploaded.`,
        });
      } catch (error: any) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message || 'Could not upload image.',
        });
      } finally {
        setLoading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    },
    [form, toast]
  );

  const anyUploading = isCoverUploading || isDiagramUploading;

  return (
    <div className="min-h-screen bg-secondary pb-24 overflow-y-auto">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href="/admin/projects" className="hover:text-primary transition-colors">Projects</Link>
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
              disabled={isSubmitting || anyUploading}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
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
            {/* Card 1: Basic Details                                     */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Basic Details
                </CardTitle>
                <CardDescription>Core information about the project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl><Input placeholder="e.g. Real-Time Analytics Pipeline" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl><Input placeholder="A concise one-liner that sells the project" {...field} /></FormControl>
                    <FormDescription>Min 10 characters. Think elevator pitch.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="overview" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="A comprehensive overview of the project — what it does, why it exists, and the engineering philosophy behind it..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Min 20 characters. This replaces the old description field.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="technologies" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies (comma-separated)</FormLabel>
                    <FormControl><Input placeholder="e.g. React, Node.js, Kafka, PostgreSQL" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="links.website" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="links.github" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="links.demo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="Loom or YouTube link" {...field} /></FormControl>
                    <FormDescription>A walkthrough or demo video.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="dxSnippet" render={({ field }) => (
                  <FormItem>
                    <FormLabel>DX Snippet (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder={"$ git clone https://github.com/...\n$ npm install\n$ npm run dev"}
                        className="font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Quick-start bash commands for developer experience.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 2: Media Management                                  */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Media Management
                </CardTitle>
                <CardDescription>Cover image and architecture diagram. Replacing an existing image automatically deletes the old one from Cloudinary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Cover Image */}
                <div className="space-y-3">
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image *</FormLabel>
                      <div className="flex gap-2 items-start">
                        <FormControl>
                          <Input placeholder="https://res.cloudinary.com/..." {...field} className="flex-1" readOnly />
                        </FormControl>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={coverInputRef}
                          onChange={(e) => handleImageUpload(e, 'imageUrl', setIsCoverUploading, coverInputRef)}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={isCoverUploading}
                        >
                          {isCoverUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                          ) : field.value ? (
                            <><Replace className="mr-2 h-4 w-4" />Replace</>
                          ) : (
                            <><Upload className="mr-2 h-4 w-4" />Upload</>
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Thumbnail preview */}
                  {form.watch('imageUrl') && (
                    <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={form.watch('imageUrl')}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Architecture Diagram */}
                <div className="space-y-3">
                  <FormField control={form.control} name="diagramUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Architecture Diagram</FormLabel>
                      <div className="flex gap-2 items-start">
                        <FormControl>
                          <Input placeholder="https://res.cloudinary.com/..." {...field} className="flex-1" readOnly />
                        </FormControl>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={diagramInputRef}
                          onChange={(e) => handleImageUpload(e, 'diagramUrl', setIsDiagramUploading, diagramInputRef)}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => diagramInputRef.current?.click()}
                          disabled={isDiagramUploading}
                        >
                          {isDiagramUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                          ) : field.value ? (
                            <><Replace className="mr-2 h-4 w-4" />Replace</>
                          ) : (
                            <><Upload className="mr-2 h-4 w-4" />Upload</>
                          )}
                        </Button>
                      </div>
                      <FormDescription>Upload your system architecture diagram.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Thumbnail preview */}
                  {form.watch('diagramUrl') && (
                    <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={form.watch('diagramUrl')!}
                        alt="Diagram preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 3: Impact Metrics                                    */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Impact Metrics
                  </CardTitle>
                  <CardDescription className="mt-1">Quantifiable results and KPIs. e.g. &ldquo;99.9% uptime&rdquo;, &ldquo;2x throughput&rdquo;.</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => metricsArray.append({ label: '', value: '', context: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {metricsArray.fields.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No metrics added yet. Click &ldquo;Add Metric&rdquo; to quantify your impact.
                  </div>
                )}
                {metricsArray.fields.map((field, index) => (
                  <div key={field.id} className="relative border border-border rounded-xl p-4 sm:p-5 bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => metricsArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                      <FormField control={form.control} name={`impactMetrics.${index}.label`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl><Input placeholder="e.g. Uptime" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`impactMetrics.${index}.value`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl><Input placeholder="e.g. 99.9%" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`impactMetrics.${index}.context`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Context</FormLabel>
                          <FormControl><Input placeholder="e.g. Over 12 months in production" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 4: System Features                                   */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    System Features
                  </CardTitle>
                  <CardDescription className="mt-1">Key capabilities and features of the system.</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => featuresArray.append({ featureTitle: '', description: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuresArray.fields.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No features added yet. Click &ldquo;Add Feature&rdquo; to describe system capabilities.
                  </div>
                )}
                {featuresArray.fields.map((field, index) => (
                  <div key={field.id} className="relative border border-border rounded-xl p-4 sm:p-5 bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => featuresArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4 pr-8">
                      <FormField control={form.control} name={`systemFeatures.${index}.featureTitle`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feature Title</FormLabel>
                          <FormControl><Input placeholder="e.g. Event-Driven Architecture" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`systemFeatures.${index}.description`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea rows={2} placeholder="Explain the feature and its engineering significance..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Card 5: Architectural Trade-offs                          */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Architectural Trade-offs
                  </CardTitle>
                  <CardDescription className="mt-1">Document the hard engineering decisions — bottleneck → solution → trade-off.</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => challengesArray.append({ theme: '', bottleneck: '', solution: '', tradeoff: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Challenge
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {challengesArray.fields.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No challenges added yet. Click &ldquo;Add Challenge&rdquo; to document trade-offs.
                  </div>
                )}
                {challengesArray.fields.map((field, index) => (
                  <div key={field.id} className="relative border border-border rounded-xl p-4 sm:p-6 bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => challengesArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4 pr-8">
                      <FormField control={form.control} name={`architecturalChallenges.${index}.theme`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <FormControl><Input placeholder="e.g. Scalability, Data Consistency" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`architecturalChallenges.${index}.bottleneck`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bottleneck</FormLabel>
                          <FormControl>
                            <Textarea rows={2} placeholder="What was the performance or design bottleneck?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`architecturalChallenges.${index}.solution`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solution</FormLabel>
                          <FormControl>
                            <Textarea rows={2} placeholder="How did you solve it?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`architecturalChallenges.${index}.tradeoff`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade-off</FormLabel>
                          <FormControl>
                            <Textarea rows={2} placeholder="What trade-off did the solution introduce?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </form>
        </Form>
      </div>
    </div>
  );
}
