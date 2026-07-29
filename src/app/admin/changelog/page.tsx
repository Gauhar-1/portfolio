'use client';

import { Button } from '@/components/ui/button';
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

const changelogSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  type: z.enum(['Release', 'Patch', 'Post-Mortem']),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

type FormValues = z.infer<typeof changelogSchema>;
type Changelog = FormValues & { 
  _id?: string;
  publishDate: string;
};

export default function ManageChangelogPage() {
  const { toast } = useToast();
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingChangelog, setEditingChangelog] = useState<Changelog | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(changelogSchema),
    defaultValues: {
      title: '',
      type: 'Release',
      content: '',
    },
  });

  const fetchChangelogs = async () => {
    try {
      const res = await fetch('/api/changelog');
      if (!res.ok) throw new Error('Failed to fetch changelogs');
      const data = await res.json();
      setChangelogs(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load changelogs.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchChangelogs();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const method = editingChangelog ? 'PUT' : 'POST';
    const url = editingChangelog ? `/api/changelog/${editingChangelog._id}` : '/api/changelog';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error(`Failed to ${editingChangelog ? 'update' : 'create'} changelog`);

      await fetchChangelogs();
      toast({
        title: `Changelog ${editingChangelog ? 'Updated' : 'Published'}!`,
        description: `${values.title} has been successfully ${editingChangelog ? 'updated' : 'published'}.`,
      });
      setIsDialogOpen(false);
      setEditingChangelog(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not ${editingChangelog ? 'update' : 'publish'} changelog.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (changelogId: string) => {
    try {
      const res = await fetch(`/api/changelog/${changelogId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete changelog');
      await fetchChangelogs();
      toast({
        title: 'Changelog Deleted!',
        description: 'The entry has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete entry.',
      });
    }
  };

  const openEditDialog = (changelog: Changelog) => {
    setEditingChangelog(changelog);
    form.reset({
        title: changelog.title,
        type: changelog.type,
        content: changelog.content,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingChangelog(null);
    form.reset({
      title: '',
      type: 'Release',
      content: '',
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Changelog</h1>
          <p className="text-muted-foreground mt-2">Publish releases, patches, and post-mortems.</p>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Publish Update
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingChangelog ? 'Edit Entry' : 'Publish New Entry'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem className="col-span-1"> <FormLabel>Title</FormLabel> <FormControl><Input placeholder="e.g. v2.0 Released" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="type" render={({ field }) => ( 
                  <FormItem className="col-span-1"> 
                    <FormLabel>Type</FormLabel> 
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Release">Release</option>
                        <option value="Patch">Patch</option>
                        <option value="Post-Mortem">Post-Mortem</option>
                      </select>
                    </FormControl> 
                    <FormMessage /> 
                  </FormItem> 
                )} />
              </div>
              
              <FormField control={form.control} name="content" render={({ field }) => ( <FormItem> <FormLabel>Content (Markdown supported)</FormLabel> <FormControl><Textarea rows={10} placeholder="Write your changelog..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              
              <Button type="submit" disabled={isSubmitting} className="mt-4">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Publish Entry'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changelogs.length > 0 ? (
              changelogs.map((changelog) => (
                <TableRow key={changelog._id}>
                  <TableCell className="whitespace-nowrap">{new Date(changelog.publishDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                     <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        changelog.type === 'Release' ? 'bg-blue-100 text-blue-700' :
                        changelog.type === 'Patch' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                     }`}>
                      {changelog.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium w-full">{changelog.title}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                     <Button variant="ghost" size="icon" onClick={() => openEditDialog(changelog)}>
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
                            This will permanently delete this changelog entry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(changelog._id!)} className="bg-destructive hover:bg-destructive/90">
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
                  No changelog entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
