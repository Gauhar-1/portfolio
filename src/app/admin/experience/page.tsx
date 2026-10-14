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
import { Edit, PlusCircle, Trash2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
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
  slug: string;
  domainTag?: string;
  hasArchitecture?: boolean;
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Deterministic slug joins each experience to its corresponding Architecture deep-dive engine.
            </p>
          </div>
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

        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Title</TableHead>
                <TableHead>Company & Slug</TableHead>
                <TableHead>Architecture Engine</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell className="font-semibold text-foreground">
                      {exp.title}
                      {exp.domainTag && (
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {exp.domainTag}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{exp.company}</div>
                      <div className="text-xs font-mono text-muted-foreground">/{exp.slug}</div>
                    </TableCell>
                    <TableCell>
                      {exp.hasArchitecture ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Linked</span>
                          <Link
                            href={`/architecture/${exp.slug}`}
                            target="_blank"
                            className="text-emerald-300 hover:text-emerald-200 ml-0.5"
                          >
                            <ExternalLink className="w-3 h-3 inline" />
                          </Link>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Missing Engine</span>
                          <Link
                            href="/admin/architectures/new"
                            className="text-amber-300 hover:underline ml-1 text-[11px]"
                          >
                            + Add
                          </Link>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{exp.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/experience/${exp._id}`} aria-label="Edit experience">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" aria-label="Delete experience">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the experience entry for "{exp.company}".
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
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
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
