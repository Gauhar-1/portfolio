'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  company: z.string().min(2, 'Company must be at least 2 characters.'),
  date: z.string().min(5, 'Date must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

type FormValues = z.infer<typeof experienceSchema>;
type Experience = FormValues & { 
  _id?: string;
  technologies: string[] | string;
};


export default function ManageExperiencePage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      date: '',
      description: '',
      technologies: '',
      links: { website: '', github: '' },
    },
  });

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience');
      if (!res.ok) throw new Error('Failed to fetch experiences');
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load experiences.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const method = editingExperience ? 'PUT' : 'POST';
    const url = editingExperience ? `/api/experience/${editingExperience._id}` : '/api/experience';

    const dataToSend = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error(`Failed to ${editingExperience ? 'update' : 'create'} experience`);

      await fetchExperiences();
      toast({
        title: `Experience ${editingExperience ? 'Updated' : 'Created'}!`,
        description: `${values.title} has been successfully ${editingExperience ? 'updated' : 'added'}.`,
      });
      setIsDialogOpen(false);
      setEditingExperience(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not ${editingExperience ? 'update' : 'create'} experience.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (experienceId: string) => {
    try {
      const res = await fetch(`/api/experience/${experienceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      await fetchExperiences();
      toast({
        title: 'Experience Deleted!',
        description: 'The experience has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete experience.',
      });
    }
  };
  
  const openEditDialog = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset({
        ...experience,
        technologies: Array.isArray(experience.technologies) ? experience.technologies.join(', ') : experience.technologies,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingExperience(null);
    form.reset({
      title: '',
      company: '',
      date: '',
      description: '',
      technologies: '',
      links: { website: '', github: '' },
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
          <div className="flex gap-4">
             <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Experience
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl> <Input placeholder="e.g. Full Stack Developer" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="company" render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl> <Input placeholder="e.g. Google" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl> <Input placeholder="e.g. Jan 2023 - Present" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl> <Textarea placeholder="Describe your role and responsibilities..." {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem> <FormLabel>Technologies (comma-separated)</FormLabel> <FormControl> <Input placeholder="e.g. React, Node.js, MongoDB" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="links.website" render={({ field }) => ( <FormItem> <FormLabel>Website URL</FormLabel> <FormControl> <Input placeholder="https://example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="links.github" render={({ field }) => ( <FormItem> <FormLabel>GitHub URL</FormLabel> <FormControl> <Input placeholder="https://github.com/user/repo" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                
                <Button type="submit" disabled={isSubmitting} className="mt-4">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Experience'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell className="font-medium">{exp.title}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the experience entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exp._id!)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No experience found. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
