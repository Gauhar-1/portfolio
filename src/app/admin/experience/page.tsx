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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
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

type Experience = { 
  _id: string;
  title: string;
  company: string;
  date: string;
};

export default function ManageExperiencePage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load data.',
        description: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (experienceId: string) => {
    try {
      const res = await fetch(`/api/experience/${experienceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      await fetchExperiences();
      toast({
        title: 'Experience Deleted!',
        description: 'The experience has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete experience.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/admin/experience/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Experience
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell className="font-medium">{exp.title}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/experience/${exp._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
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
                              This action cannot be undone. This will permanently delete the experience entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exp._id)}
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
                  <TableCell colSpan={4} className="text-center h-24">
                    No experience found. Add one to get started!
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
