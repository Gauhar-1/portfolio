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

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(2, 'Please add at least one technology.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
  }).optional(),
});


type FormValues = z.infer<typeof projectSchema>;
type Project = FormValues & { 
  _id?: string;
  technologies: string[] | string;
};


export default function ManageProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      links: { website: '', github: '', demo: '' },
    },
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load projects.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';

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

      if (!res.ok) throw new Error(`Failed to ${editingProject ? 'update' : 'create'} project`);

      await fetchProjects();
      toast({
        title: `Project ${editingProject ? 'Updated' : 'Created'}!`,
        description: `${values.title} has been successfully ${editingProject ? 'updated' : 'added'}.`,
      });
      setIsDialogOpen(false);
      setEditingProject(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not ${editingProject ? 'update' : 'create'} project.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      await fetchProjects();
      toast({
        title: 'Project Deleted!',
        description: 'The project has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete project.',
      });
    }
  };
  
  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    form.reset({
        ...project,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingProject(null);
    form.reset({
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      links: { website: '', github: '', demo: '' },
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          <div className="flex gap-4">
             <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Title</FormLabel> <FormControl><Input placeholder="e.g. Awesome Project" {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="Describe your project..." {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem> <FormLabel>Technologies (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. React, Node.js, MongoDB" {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem> <FormLabel>Image URL</FormLabel> <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="links.website" render={({ field }) => ( <FormItem> <FormLabel>Website URL</FormLabel> <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="links.github" render={({ field }) => ( <FormItem> <FormLabel>GitHub URL</FormLabel> <FormControl><Input placeholder="https://github.com/user/repo" {...field} /></FormControl>  </FormItem> )} />
                <FormField control={form.control} name="links.demo" render={({ field }) => ( <FormItem> <FormLabel>Demo URL</FormLabel> <FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl>  </FormItem> )} />
                
                <Button type="submit" disabled={isSubmitting} className="mt-4">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Project'}
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <TableRow key={proj._id}>
                    <TableCell className="font-medium">{proj.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{proj.description}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(proj)}>
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
                              This action cannot be undone. This will permanently delete the project entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(proj._id!)}
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
                  <TableCell colSpan={3} className="text-center h-24">
                    No projects found. Add one to get started!
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
