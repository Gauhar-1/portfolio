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
import { Edit, PlusCircle, Trash2, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
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

type Project = {
  _id: string;
  title: string;
  slug: string;
  category?: 'AI_RAG' | 'SYSTEMS_ENGINES' | 'FULLSTACK_SAAS';
  featuredOrder?: number;
  tagline: string;
  hasArchitecture?: boolean;
  theme?: {
    primaryHex?: string;
  };
};

const categoryLabels: Record<string, { label: string; badge: string }> = {
  AI_RAG: {
    label: 'AI & RAG',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  SYSTEMS_ENGINES: {
    label: 'Systems & Engines',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  FULLSTACK_SAAS: {
    label: 'Full-Stack SaaS',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
};

export default function ManageProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load data.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      await fetchProjects();
      toast({
        title: 'Project Deleted!',
        description: 'The project has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete project.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tactical arsenal connected to Architecture blueprints via normalized slug.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/admin/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
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
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Project / Slug</TableHead>
                <TableHead>Hiring Intent Category</TableHead>
                <TableHead>Architecture Blueprint</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((proj) => {
                  const cat = categoryLabels[proj.category || 'AI_RAG'] || categoryLabels.AI_RAG;
                  return (
                    <TableRow key={proj._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{proj.featuredOrder ?? 99}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground">{proj.title}</div>
                        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                          slug: {proj.slug}
                        </div>
                        <div className="text-xs text-muted-foreground/80 truncate max-w-sm mt-0.5">
                          {proj.tagline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cat.badge}`}
                        >
                          {cat.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {proj.hasArchitecture ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Blueprint Synced
                            </span>
                            <Link
                              href={`/architecture/${proj.slug}`}
                              target="_blank"
                              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Standalone
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/projects/${proj._id}`}>
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
                                This will permanently delete &ldquo;{proj.title}&rdquo;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(proj._id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    {isLoading ? 'Loading projects...' : 'No projects found. Add one to get started!'}
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