'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProjectForm, { ProjectFormValues } from '@/components/admin/ProjectForm';
import { Loader2 } from 'lucide-react';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [personas, setPersonas] = useState<any[]>([]);
  const [defaultValues, setDefaultValues] = useState<Partial<ProjectFormValues> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, personasRes] = await Promise.all([
          fetch(`/api/projects`),
          fetch('/api/personas')
        ]);
        
        if (!projRes.ok || !personasRes.ok) throw new Error('Failed to fetch data');
        
        const projects = await projRes.json();
        const personasData = await personasRes.json();
        
        const projData = projects.find((p: any) => p._id === id);
        
        if (!projData) {
          toast({ variant: 'destructive', title: 'Not found' });
          router.push('/admin/projects');
          return;
        }

        setPersonas(personasData);
        setDefaultValues({
          title: projData.title || '',
          description: projData.description || '',
          technologies: Array.isArray(projData.technologies) ? projData.technologies.join(', ') : projData.technologies || '',
          imageUrl: projData.imageUrl || '',
          links: {
            website: projData.links?.website || '',
            github: projData.links?.github || '',
            demo: projData.links?.demo || '',
          },
          allowedPersonas: projData.allowedPersonas || [],
          stories: projData.stories || [],
        });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error loading data' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router, toast]);

  const handleSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    
    const dataToSend = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()),
    };

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Failed to update project');

      toast({
        title: 'Project Updated!',
        description: `${values.title} has been successfully updated.`,
      });
      
      router.push('/admin/projects');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not update project.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !defaultValues) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ProjectForm 
      title={`Edit: ${defaultValues.title}`}
      defaultValues={defaultValues as ProjectFormValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      personas={personas}
    />
  );
}
