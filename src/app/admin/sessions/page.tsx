'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Eye, Loader2, Trophy, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

type SessionEntry = {
  _id: string;
  slug: string;
  userAgent: string;
  companyName?: string;
  role?: string;
  intentScore: number;
  interactionLog: { action: string; timestamp: string }[];
  startTime: string;
  lastActiveAt: string;
};

export default function VisitorSessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load telemetry data.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);



  // Helper to parse basic device info from user agent
  const getDeviceFromUA = (ua: string) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Mobile')) return 'Mobile';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Intent Telemetry</h1>
          <p className="text-muted-foreground mt-2">Track visitor engagement, behavioral reading, and intent scores.</p>
        </div>
      </div>



      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Slug</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead className="text-right text-emerald-500">Intent Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
                </TableCell>
              </TableRow>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session._id} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">{session.slug}</TableCell>
                  <TableCell className="font-medium">{session.companyName || <span className="italic text-muted-foreground">Anonymous</span>}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {session.role || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-500">
                    {session.intentScore}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/sessions/${session._id}`}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No tracking sessions available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
