'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, PlusCircle, Trash2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const storyThemes = ['Problem Solved', 'Mistake Made', 'Conflict Resolved', 'Influenced Decision', 'Proudest Build'] as const;
const employmentTypes = ['Freelance', 'Contract', 'Full-Time', 'Part-Time'] as const;

export const storySchema = z.object({
  theme: z.enum(storyThemes),
  situation: z.string().min(5, 'Situation must be at least 5 characters.'),
  challenge: z.string().min(5, 'Challenge must be at least 5 characters.'),
  action: z.string().min(5, 'Action must be at least 5 characters.'),
  result: z.string().min(5, 'Result must be at least 5 characters.'),
  learning: z.string().min(5, 'Learning must be at least 5 characters.'),
});

export const caseStudySchema = z.object({
  businessProblem: z.string().default(''),
  roleAndScope: z.string().default(''),
  architectureDetails: z.string().default(''),
  hardestChallenge: z.string().default(''),
  outcomes: z.array(z.string()).default([]),
});

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  company: z.string().min(2, 'Company must be at least 2 characters.'),
  employmentType: z.enum(employmentTypes).default('Freelance'),
  date: z.string().min(5, 'Date must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  keyMetric: z.string().default(''),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }).optional(),
  caseStudy: caseStudySchema.default({
    businessProblem: '',
    roleAndScope: '',
    architectureDetails: '',
    hardestChallenge: '',
    outcomes: [],
  }),
  stories: z.array(storySchema).default([]),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceFormValues>;
  onSubmit: (values: ExperienceFormValues) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

export default function ExperienceForm({ defaultValues, onSubmit, isSubmitting, title }: ExperienceFormProps) {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues || {
      title: '',
      company: '',
      employmentType: 'Freelance',
      date: '',
      description: '',
      keyMetric: '',
      technologies: '',
      links: { website: '', github: '' },
      caseStudy: {
        businessProblem: '',
        roleAndScope: '',
        architectureDetails: '',
        hardestChallenge: '',
        outcomes: [],
      },
      stories: [],
    },
  });

  const { fields: storyFields, append: appendStory, remove: removeStory } = useFieldArray({
    control: form.control,
    name: 'stories',
  });

  const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome } = useFieldArray({
    control: form.control,
    name: 'caseStudy.outcomes' as any,
  });

  return (
    <div className="min-h-screen bg-secondary pb-24 overflow-y-auto">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href="/admin/experience" className="hover:text-primary transition-colors">Experience</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/experience">Cancel</Link>
            </Button>
            <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Card 1: Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl><Input placeholder="e.g. Full Stack Developer" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="company" render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl><Input placeholder="e.g. Google" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="employmentType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employmentTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input placeholder="e.g. Jan 2023 - Present" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description (Card Summary)</FormLabel> <FormControl><Textarea rows={4} placeholder="A short summary used as the hook on the UI card..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="keyMetric" render={({ field }) => ( <FormItem> <FormLabel>Key Metric</FormLabel> <FormControl><Input placeholder="e.g. Reduced load time by 40%" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem> <FormLabel>Technologies (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. React, Node.js, MongoDB" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="links.website" render={({ field }) => ( <FormItem> <FormLabel>Website URL</FormLabel> <FormControl><Input placeholder="https://example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="links.github" render={({ field }) => ( <FormItem> <FormLabel>GitHub URL</FormLabel> <FormControl ><Input placeholder="https://github.com/user/repo" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Case Study */}
            <Card>
              <CardHeader>
                <CardTitle>Case Study</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Deep-dive details for the experience detail page. All fields are optional.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="caseStudy.businessProblem" render={({ field }) => (
                  <FormItem>
                    <FormLabel>The Business Problem</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="What business problem were you hired to solve?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.roleAndScope" render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Role & Scope</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="What was your specific role and scope of responsibility?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.architectureDetails" render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Architecture (supports Markdown)</FormLabel>
                    <FormControl><Textarea rows={6} placeholder="Describe the system architecture. You can use Markdown and Mermaid diagrams here..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.hardestChallenge" render={({ field }) => (
                  <FormItem>
                    <FormLabel>The Hardest Technical Challenge</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="What was the hardest technical challenge you faced?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Dynamic Outcomes List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Outcomes</FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendOutcome('' as any)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Outcome
                    </Button>
                  </div>
                  {outcomeFields.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground text-sm">
                      No outcomes added yet. Click &quot;Add Outcome&quot; to add a measurable result.
                    </div>
                  )}
                  {outcomeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`caseStudy.outcomes.${index}` as any}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`e.g. Improved conversion rate by 25%`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => removeOutcome(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Behavioral Stories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Story Builder (STAR Method)</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add behavioral stories to this experience.</p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => appendStory({ theme: 'Problem Solved', situation: '', challenge: '', action: '', result: '', learning: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Story
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {storyFields.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No stories added yet. Click &quot;Add Story&quot; to build a behavioral narrative.
                  </div>
                )}
                {storyFields.map((field, index) => (
                  <div key={field.id} className="relative border border-border rounded-xl p-4 sm:p-6 bg-background">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => removeStory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-4 pr-8">
                      <FormField control={form.control} name={`stories.${index}.theme`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {storyThemes.map(theme => (
                                <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name={`stories.${index}.situation`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situation (Context)</FormLabel>
                          <FormControl><Textarea placeholder="What was the background context?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`stories.${index}.challenge`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Challenge (The Obstacle)</FormLabel>
                          <FormControl><Textarea placeholder="What was the specific challenge or task?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`stories.${index}.action`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action (What you did)</FormLabel>
                          <FormControl><Textarea placeholder="What action did you personally take?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`stories.${index}.result`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Result (Measurable Outcome)</FormLabel>
                          <FormControl><Textarea placeholder="What was the measurable outcome?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`stories.${index}.learning`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning (The Takeaway)</FormLabel>
                          <FormControl><Textarea placeholder="What did you learn from this?" {...field} /></FormControl>
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
