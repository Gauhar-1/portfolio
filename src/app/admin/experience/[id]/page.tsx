'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ExperienceForm, { ExperienceFormValues } from '@/components/admin/ExperienceForm';
import { Loader2 } from 'lucide-react';

export default function EditExperiencePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<Partial<ExperienceFormValues> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expRes = await fetch(`/api/experience`);
        
        if (!expRes.ok) throw new Error('Failed to fetch data');
        
        const experiences = await expRes.json();
        
        const expData = experiences.find((e: any) => e._id === id);
        
        if (!expData) {
          toast({ variant: 'destructive', title: 'Not found' });
          router.push('/admin/experience');
          return;
        }

        setDefaultValues({
          title: expData.title || '',
          company: expData.company || '',
          employmentType: expData.employmentType || 'Freelance',
          date: expData.date || '',
          description: expData.description || '',
          keyMetric: expData.keyMetric || '',
          technologies: Array.isArray(expData.technologies) ? expData.technologies.join(', ') : expData.technologies || '',
          links: {
            website: expData.links?.website || '',
            github: expData.links?.github || '',
          },
          caseStudy: {
            businessProblem: expData.caseStudy?.businessProblem || '',
            roleAndScope: expData.caseStudy?.roleAndScope || '',
            architectureDetails: expData.caseStudy?.architectureDetails || '',
            hardestChallenge: expData.caseStudy?.hardestChallenge || '',
            outcomes: expData.caseStudy?.outcomes || [],
          },
          stories: expData.stories || [],
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

  const handleSubmit = async (values: ExperienceFormValues) => {
    setIsSubmitting(true);
    
    const dataToSend = {
      ...values,
      technologies: values.technologies.split(',').map(tech => tech.trim()),
    };

    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Failed to update experience');

      toast({
        title: 'Experience Updated!',
        description: `${values.title} has been successfully updated.`,
      });
      
      router.push('/admin/experience');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not update experience.',
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
    <ExperienceForm 
      title={`Edit: ${defaultValues.title}`}
      defaultValues={defaultValues as ExperienceFormValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
