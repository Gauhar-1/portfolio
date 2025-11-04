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
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileSchema = z.object({
  profilePhoto: z.any().optional(),
});

type FormValues = z.infer<typeof profileSchema>;

export default function ManageProfilePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/links');
        if (!res.ok) throw new Error('Failed to fetch profile data');
        const data = await res.json();
        if (data && data.profilePhotoUrl) {
          setCurrentPhoto(data.profilePhotoUrl);
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Failed to load profile data.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const { url } = await res.json();
      setCurrentPhoto(url);
      
      toast({
        title: 'Profile Photo Updated!',
        description: 'Your new profile photo has been saved.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not update profile photo.',
      });
    } finally {
      setIsSubmitting(false);
       if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Profile</h1>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="bg-card p-6 sm:p-8 rounded-lg border">
            <div className="flex flex-col sm:flex-row items-center gap-8">
                <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={currentPhoto || ''} alt="Profile Photo" className="object-cover" />
                    <AvatarFallback>
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </AvatarFallback>
                </Avatar>

                <Form {...form}>
                    <form className="w-full">
                        <FormField
                            control={form.control}
                            name="profilePhoto"
                            render={() => (
                            <FormItem>
                                <FormLabel className="text-lg">Update Profile Photo</FormLabel>
                                <div className="relative mt-2">
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
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Choose Photo
                                        </>
                                    )}
                                </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
