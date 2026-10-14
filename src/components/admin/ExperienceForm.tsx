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
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, ChevronRight, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const employmentTypes = [
  'Freelance',
  'Contract',
  'Full-Time',
  'Part-Time',
  'Founding Engineer',
  'Internship',
] as const;

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  company: z.string().min(2, 'Company must be at least 2 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens or no spaces.'),
  domainTag: z.string().default('Systems & Full-Stack Architecture'),
  employmentType: z.enum(employmentTypes).default('Freelance'),
  date: z.string().min(3, 'Date must be provided.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  links: z
    .object({
      website: z.string().url().optional().or(z.literal('')),
      github: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceFormValues>;
  onSubmit: (values: ExperienceFormValues) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

export default function ExperienceForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  title,
}: ExperienceFormProps) {
  const [architectures, setArchitectures] = useState<Array<{ slug: string; name: string }>>([]);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(defaultValues?.slug));

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      company: defaultValues?.company || '',
      slug:
        defaultValues?.slug ||
        (defaultValues?.company
          ? defaultValues.company.toLowerCase().replace(/\s+/g, '')
          : ''),
      domainTag: defaultValues?.domainTag || 'Systems & Full-Stack Architecture',
      employmentType: defaultValues?.employmentType || 'Freelance',
      date: defaultValues?.date || '',
      description: defaultValues?.description || '',
      technologies: defaultValues?.technologies || '',
      links: {
        website: defaultValues?.links?.website || '',
        github: defaultValues?.links?.github || '',
      },
    },
  });

  // Fetch architectures to check if matching slug exists
  useEffect(() => {
    fetch('/api/admin/architectures')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setArchitectures(data);
        }
      })
      .catch(console.error);
  }, []);

  const watchedSlug = (form.watch('slug') || '').toLowerCase().replace(/\s+/g, '');
  const matchedArchitecture = architectures.find(
    (a) => a.slug?.toLowerCase().replace(/\s+/g, '') === watchedSlug
  );

  const handleCompanyChange = (val: string) => {
    form.setValue('company', val, { shouldValidate: true });
    if (!isSlugManuallyEdited) {
      form.setValue('slug', val.toLowerCase().replace(/\s+/g, ''), {
        shouldValidate: true,
      });
    }
  };

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
            <Link href="/admin/experience" className="hover:text-primary transition-colors">
              Experience
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/experience">Cancel</Link>
            </Button>
            <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
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
            <Card>
              <CardHeader>
                <CardTitle>Experience Core & Recruiter Intent</CardTitle>
                <CardDescription>
                  Define the role details. Metrics, themes, and deep-dive challenges are auto-borrowed
                  from the matching Architecture engine via deterministic slug.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Staff Full Stack Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. QuickBiteQR"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCompanyChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Slug Auto-Generation & Architecture Link Badge */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Deterministic Slug</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            Auto-derived from company (lowercase, no spaces)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. quickbiteqr"
                            {...field}
                            onChange={(e) => {
                              setIsSlugManuallyEdited(true);
                              field.onChange(e.target.value.toLowerCase().replace(/\s+/g, ''));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Architecture Match Status Badge */}
                  {watchedSlug ? (
                    matchedArchitecture ? (
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            Architecture Linked: <strong>{matchedArchitecture.name}</strong> (
                            <code className="text-emerald-300">/architecture/{matchedArchitecture.slug}</code>)
                          </span>
                        </div>
                        <Link
                          href={`/architecture/${matchedArchitecture.slug}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1 shrink-0 text-emerald-300"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            No Architecture found matching slug <code className="text-amber-200">"{watchedSlug}"</code>
                          </span>
                        </div>
                        <Link
                          href="/admin/architectures/new"
                          target="_blank"
                          className="hover:underline text-amber-200 font-semibold flex items-center gap-1 shrink-0"
                        >
                          <Sparkles className="w-3 h-3" /> Create Architecture
                        </Link>
                      </div>
                    )
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="domainTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recruiter Domain Tag</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. High-Concurrency POS & FinTech"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Pill shown at top of the card for JD keyword pattern-matching.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jan 2024 - Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Executive Thesis / Card Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="A concise 1-2 sentence hook highlighting your core impact and engineering ownership..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Rendered on the card as a high-density, clamped executive summary.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Next.js, TypeScript, Go, PostgreSQL, Redis, Docker" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="links.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="links.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/user/repo" {...field} />
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
