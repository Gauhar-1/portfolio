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
import { Checkbox } from '@/components/ui/checkbox';
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

const personaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  isDefault: z.boolean().default(false),
  sectionOrder: z.string().min(2, 'Please specify section order.'),
});

type FormValues = z.infer<typeof personaSchema>;
type Persona = FormValues & { 
  _id?: string;
  sectionOrder: string[] | string;
};

export default function ManagePersonasPage() {
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      name: '',
      description: '',
      isDefault: false,
      sectionOrder: 'projects, experience, skills',
    },
  });

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/personas');
      if (!res.ok) throw new Error('Failed to fetch personas');
      const data = await res.json();
      setPersonas(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load personas.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const method = editingPersona ? 'PUT' : 'POST';
    const url = editingPersona ? `/api/personas/${editingPersona._id}` : '/api/personas';

    const dataToSend = {
      ...values,
      sectionOrder: values.sectionOrder.split(',').map(s => s.trim()),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error(`Failed to ${editingPersona ? 'update' : 'create'} persona`);

      await fetchPersonas();
      toast({
        title: `Persona ${editingPersona ? 'Updated' : 'Created'}!`,
        description: `${values.name} has been successfully ${editingPersona ? 'updated' : 'added'}.`,
      });
      setIsDialogOpen(false);
      setEditingPersona(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not ${editingPersona ? 'update' : 'create'} persona.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (personaId: string) => {
    try {
      const res = await fetch(`/api/personas/${personaId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete persona');
      await fetchPersonas();
      toast({
        title: 'Persona Deleted!',
        description: 'The persona has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete persona.',
      });
    }
  };

  const openEditDialog = (persona: Persona) => {
    setEditingPersona(persona);
    form.reset({
        ...persona,
        sectionOrder: Array.isArray(persona.sectionOrder) ? persona.sectionOrder.join(', ') : persona.sectionOrder,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingPersona(null);
    form.reset({
      name: '',
      description: '',
      isDefault: false,
      sectionOrder: 'projects, experience, skills',
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Personas</h1>
          <p className="text-muted-foreground mt-2">Define your target audiences to customize their experience.</p>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Persona
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPersona ? 'Edit Persona' : 'Add New Persona'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input placeholder="e.g. Founder, Recruiter" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="Describe this audience..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="sectionOrder" render={({ field }) => ( <FormItem> <FormLabel>Section Order (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. experience, projects, skills" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              
              <FormField control={form.control} name="isDefault" render={({ field }) => ( 
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Default Persona</FormLabel>
                    <p className="text-sm text-muted-foreground">Use this layout when visitor persona cannot be inferred.</p>
                  </div>
                </FormItem> 
              )} />
              
              <Button type="submit" disabled={isSubmitting} className="mt-4">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Persona'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personas.length > 0 ? (
              personas.map((persona) => (
                <TableRow key={persona._id}>
                  <TableCell className="font-medium">{persona.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{persona.description}</TableCell>
                  <TableCell>{persona.isDefault ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => openEditDialog(persona)}>
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
                            This will permanently delete this persona.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(persona._id!)} className="bg-destructive hover:bg-destructive/90">
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
                  No personas found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
