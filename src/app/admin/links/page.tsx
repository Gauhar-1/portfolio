'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const linksSchema = z.object({
  github: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  x: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
  resumeUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof linksSchema>;
type Links = FormValues & { _id?: string };

export default function ManageLinksPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(linksSchema),
    defaultValues: {
      github: '',
      linkedin: '',
      x: '',
      email: '',
      resumeUrl: '',
    },
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch('/api/links');
        if (!res.ok) throw new Error('Failed to fetch links');
        const data = await res.json();
        if (data) {
          form.reset(data);
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Failed to load links.',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, [form, toast]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to update links');

      toast({
        title: 'Links Updated!',
        description: 'Your social and resume links have been successfully updated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not update links.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Links</h1>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <div className="bg-card p-6 rounded-lg border">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://github.com/your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="x"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>X (Twitter) URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://x.com/your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Resume URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/your-resume.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                        </>
                    ) : (
                        'Save Links'
                    )}
                    </Button>
                </form>
                </Form>
            </div>
        )}
      </div>
    </div>
  );
}
