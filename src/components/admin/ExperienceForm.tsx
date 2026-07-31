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
import { Checkbox } from '@/components/ui/checkbox';
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

export const storySchema = z.object({
  theme: z.enum(storyThemes),
  situation: z.string().min(5, 'Situation must be at least 5 characters.'),
  challenge: z.string().min(5, 'Challenge must be at least 5 characters.'),
  action: z.string().min(5, 'Action must be at least 5 characters.'),
  result: z.string().min(5, 'Result must be at least 5 characters.'),
  learning: z.string().min(5, 'Learning must be at least 5 characters.'),
});

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  company: z.string().min(2, 'Company must be at least 2 characters.'),
  date: z.string().min(5, 'Date must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }).optional(),
  allowedPersonas: z.array(z.string()).default([]),
  stories: z.array(storySchema).default([]),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceFormValues>;
  onSubmit: (values: ExperienceFormValues) => Promise<void>;
  isSubmitting: boolean;
  personas: any[];
  title: string;
}

export default function ExperienceForm({ defaultValues, onSubmit, isSubmitting, personas, title }: ExperienceFormProps) {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues || {
      title: '',
      company: '',
      date: '',
      description: '',
      technologies: '',
      links: { website: '', github: '' },
      allowedPersonas: [],
      stories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stories',
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
                <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input placeholder="e.g. Jan 2023 - Present" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea rows={4} placeholder="Describe your role and responsibilities..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem> <FormLabel>Technologies (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. React, Node.js, MongoDB" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="links.website" render={({ field }) => ( <FormItem> <FormLabel>Website URL</FormLabel> <FormControl><Input placeholder="https://example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="links.github" render={({ field }) => ( <FormItem> <FormLabel>GitHub URL</FormLabel> <FormControl ><Input placeholder="https://github.com/user/repo" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Persona Targeting */}
            <Card>
              <CardHeader>
                <CardTitle>Persona Targeting</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="allowedPersonas" render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Select which personas this experience should be visible to. Leave blank to show for everyone.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {personas.map((persona) => (
                        <FormField
                          key={persona._id}
                          control={form.control}
                          name="allowedPersonas"
                          render={({ field }) => {
                            return (
                              <FormItem key={persona._id} className="flex flex-row items-center space-x-3 space-y-0 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(persona._id)}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                      return checked === true
                                        ? field.onChange([...(field.value || []), persona._id])
                                        : field.onChange(field.value?.filter((value) => value !== persona._id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full text-sm">
                                  {persona.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Card 3: Behavioral Stories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Story Builder (STAR Method)</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add behavioral stories to this experience.</p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => append({ theme: 'Problem Solved', situation: '', challenge: '', action: '', result: '', learning: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Story
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No stories added yet. Click "Add Story" to build a behavioral narrative.
                  </div>
                )}
                {fields.map((field, index) => (
                  <div key={field.id} className="relative border border-border rounded-xl p-4 sm:p-6 bg-background">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
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
