'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, ExternalLink, Network, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ArchitectureSummary {
  _id: string;
  name: string;
  slug: string;
  theme?: {
    primaryHex: string;
    backgroundHex: string;
    textHex: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminArchitecturesPage() {
  const { toast } = useToast();
  const [architectures, setArchitectures] = useState<ArchitectureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArchitectures = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/architectures');
      if (!res.ok) throw new Error('Failed to fetch architectures');
      const data = await res.json();
      setArchitectures(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error loading architectures',
        description: error.message || 'Please check MongoDB connection.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArchitectures();
  }, [fetchArchitectures]);

  const handleDelete = async (id: string, name: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/architectures/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      setArchitectures((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: 'Architecture deleted',
        description: `"${name}" has been removed successfully.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message || 'Unable to delete architecture.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Network className="h-8 w-8 text-primary" />
            Architecture Case Studies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your dynamic system case studies, Bento visual keys, and interactive themes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArchitectures}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button asChild className="gap-2">
            <Link href="/admin/architectures/new">
              <PlusCircle className="h-4 w-4" />
              Create Architecture
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading architectures from MongoDB...</p>
          </div>
        ) : architectures.length === 0 ? (
          <div className="p-14 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Network className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No architecture studies found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Get started by creating your first dynamic case study with customized theme colors and Bento challenges.
              </p>
            </div>
            <Button asChild className="mt-2 gap-2">
              <Link href="/admin/architectures/new">
                <PlusCircle className="h-4 w-4" />
                Create First Architecture
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Case Study Name</TableHead>
                <TableHead className="font-semibold">Route Slug</TableHead>
                <TableHead className="font-semibold">Color Palette</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {architectures.map((item) => (
                <TableRow key={item._id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      <Link
                        href={`/architecture/${item.slug}`}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="View Live Page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      /architecture/{item.slug}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border border-border shadow-xs"
                        style={{ backgroundColor: item.theme?.primaryHex || '#10b981' }}
                        title={`Primary: ${item.theme?.primaryHex}`}
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-border shadow-xs"
                        style={{ backgroundColor: item.theme?.backgroundHex || '#0a0a0c' }}
                        title={`Background: ${item.theme?.backgroundHex}`}
                      />
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.theme?.primaryHex}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link href={`/admin/architectures/edit?id=${item._id}`}>
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={deletingId === item._id}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Architecture Case Study?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the{' '}
                              <strong className="text-foreground">{item.name}</strong> case study and its
                              Bento card configurations from MongoDB.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item._id, item.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
