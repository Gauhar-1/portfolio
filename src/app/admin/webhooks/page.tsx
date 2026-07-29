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

const webhookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  url: z.string().url('Must be a valid URL.'),
  events: z.string().min(2, 'Please specify at least one event.'),
  isActive: z.boolean().default(true),
  secret: z.string().min(8, 'Secret must be at least 8 characters.'),
});

type FormValues = z.infer<typeof webhookSchema>;
type Webhook = FormValues & { 
  _id?: string;
  events: string[] | string;
};

export default function ManageWebhooksPage() {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      name: '',
      url: '',
      events: 'MESSAGE_RECEIVED, NEW_SESSION',
      isActive: true,
      secret: crypto.randomUUID().slice(0, 16),
    },
  });

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks');
      if (!res.ok) throw new Error('Failed to fetch webhooks');
      const data = await res.json();
      setWebhooks(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load webhooks.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const method = editingWebhook ? 'PUT' : 'POST';
    const url = editingWebhook ? `/api/webhooks/${editingWebhook._id}` : '/api/webhooks';

    const dataToSend = {
      ...values,
      events: values.events.split(',').map(e => e.trim().toUpperCase()),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error(`Failed to ${editingWebhook ? 'update' : 'create'} webhook`);

      await fetchWebhooks();
      toast({
        title: `Webhook ${editingWebhook ? 'Updated' : 'Created'}!`,
        description: `${values.name} has been successfully ${editingWebhook ? 'updated' : 'added'}.`,
      });
      setIsDialogOpen(false);
      setEditingWebhook(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `Could not ${editingWebhook ? 'update' : 'create'} webhook.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (webhookId: string) => {
    try {
      const res = await fetch(`/api/webhooks/${webhookId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete webhook');
      await fetchWebhooks();
      toast({
        title: 'Webhook Deleted!',
        description: 'The webhook has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete webhook.',
      });
    }
  };

  const openEditDialog = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    form.reset({
        ...webhook,
        events: Array.isArray(webhook.events) ? webhook.events.join(', ') : webhook.events,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingWebhook(null);
    form.reset({
      name: '',
      url: '',
      events: 'MESSAGE_RECEIVED, NEW_SESSION',
      isActive: true,
      secret: crypto.randomUUID().slice(0, 16),
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Webhooks</h1>
          <p className="text-muted-foreground mt-2">Configure external notifications for portfolio events.</p>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Webhook
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input placeholder="e.g. Slack Notifications" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="url" render={({ field }) => ( <FormItem> <FormLabel>Endpoint URL</FormLabel> <FormControl><Input placeholder="https://hooks.slack.com/services/..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="events" render={({ field }) => ( <FormItem> <FormLabel>Events (comma-separated)</FormLabel> <FormControl><Input placeholder="e.g. MESSAGE_RECEIVED, NEW_SESSION" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="secret" render={({ field }) => ( <FormItem> <FormLabel>Secret (for payload signing)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              
              <FormField control={form.control} name="isActive" render={({ field }) => ( 
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">Enable or disable this webhook.</p>
                  </div>
                </FormItem> 
              )} />
              
              <Button type="submit" disabled={isSubmitting} className="mt-4">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Webhook'}
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
              <TableHead>Endpoint</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.length > 0 ? (
              webhooks.map((webhook) => (
                <TableRow key={webhook._id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{webhook.url}</TableCell>
                  <TableCell className="text-xs">
                    {Array.isArray(webhook.events) ? webhook.events.join(', ') : webhook.events}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${webhook.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {webhook.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => openEditDialog(webhook)}>
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
                            This will permanently delete this webhook.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(webhook._id!)} className="bg-destructive hover:bg-destructive/90">
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
                <TableCell colSpan={5} className="text-center h-24">
                  No webhooks configured.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
