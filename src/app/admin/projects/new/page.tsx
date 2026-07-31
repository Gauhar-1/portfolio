'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProjectForm, { ProjectFormValues } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
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

  const handleSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    
    const dataToSend = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()),
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Failed to create project');

      toast({
        title: 'Project Created!',
        description: `${values.title} has been successfully added.`,
      });
      
      router.push('/admin/projects');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not create project.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectForm 
      title="Add New Project"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      personas={personas}
    />
  );
}
