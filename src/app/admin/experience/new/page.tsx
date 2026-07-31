'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ExperienceForm, { ExperienceFormValues } from '@/components/admin/ExperienceForm';

export default function NewExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/personas')
      .then(res => res.json())
      .then(data => setPersonas(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (values: ExperienceFormValues) => {
    setIsSubmitting(true);
    
    const dataToSend = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()),
    };

    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Failed to create experience');

      toast({
        title: 'Experience Created!',
        description: `${values.title} has been successfully added.`,
      });
      
      router.push('/admin/experience');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not create experience.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExperienceForm 
      title="Add New Experience"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      personas={personas}
    />
  );
}
