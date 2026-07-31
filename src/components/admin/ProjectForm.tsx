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
import { Loader2, PlusCircle, Trash2, ChevronRight, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const storyThemes = ['Problem Solved', 'Mistake Made', 'Conflict Resolved', 'Influenced Decision', 'Proudest Build'] as const;

export const storySchema = z.object({
  theme: z.enum(storyThemes),
  situation: z.string().min(5, 'Situation must be at least 5 characters.'),
  challenge: z.string().min(5, 'Challenge must be at least 5 characters.'),
  action: z.string().min(5, 'Action must be at least 5 characters.'),
  result: z.string().min(5, 'Result must be at least 5 characters.'),
  learning: z.string().min(5, 'Learning must be at least 5 characters.'),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
  }).optional(),
  allowedPersonas: z.array(z.string()).default([]),
  stories: z.array(storySchema).default([]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  personas: any[];
  title: string;
}

export default function ProjectForm({ defaultValues, onSubmit, isSubmitting, personas, title }: ProjectFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      links: { website: '', github: '', demo: '' },
      allowedPersonas: [],
      stories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stories',
  });

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsPhotoSubmitting(true);
    const formData = new FormData();
    formData.append('projectPhoto', file);

    try {
      const res = await fetch('/api/projects/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const { url } = await res.json();
      form.setValue('imageUrl', url, { shouldValidate: true });
      
      toast({
        title: 'Photo Uploaded!',
        description: 'Your project photo has been successfully uploaded.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not upload photo.',
      });
    } finally {
      setIsPhotoSubmitting(false);
       if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            <Button type="button" size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isPhotoSubmitting}>
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
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input placeholder="e.g. Awesome Project" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea rows={4} placeholder="Describe your project..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem> <FormLabel>Technologies (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. React, Node.js, MongoDB" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                
                {/* Image Upload Field */}
                <FormField control={form.control} name="imageUrl" render={({ field }) => ( 
                  <FormItem> 
                    <FormLabel>Cover Image</FormLabel> 
                    <div className="flex gap-2 items-center mt-2">
                      <FormControl>
                        <Input placeholder="https://image.png" {...field} className="flex-1" />
                      </FormControl>
                      <FormControl>
                        <Input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={onFileChange}
                          ref={fileInputRef}
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPhotoSubmitting}
                      >
                        {isPhotoSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="mr-2 h-4 w-4" />Upload Photo</>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem> 
                )} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="links.website" render={({ field }) => ( <FormItem> <FormLabel>Website URL</FormLabel> <FormControl><Input placeholder="https://..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="links.github" render={({ field }) => ( <FormItem> <FormLabel>GitHub URL</FormLabel> <FormControl><Input placeholder="https://..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="links.demo" render={({ field }) => ( <FormItem> <FormLabel>Demo URL</FormLabel> <FormControl><Input placeholder="https://..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
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
                        Select which personas this project should be visible to. Leave blank to show for everyone.
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
                  <p className="text-sm text-muted-foreground mt-1">Add behavioral stories to this project.</p>
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
