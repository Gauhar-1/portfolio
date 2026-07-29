'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

type SessionEntry = {
  _id: string;
  userAgent: string;
  referrer: string;
  pageviews: string[];
  clickedProjects: any[];
  inferredPersona?: any;
  createdAt: string;
  lastActiveAt: string;
};

export default function VisitorSessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionEntry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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

  const handleViewSession = (session: SessionEntry) => {
    setSelectedSession(session);
    setIsViewOpen(true);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Visitor Telemetry</h1>
          <p className="text-muted-foreground mt-2">Track user journeys and inferred personas.</p>
        </div>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Session Journey</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
              <div><span className="font-semibold text-muted-foreground">Inferred Persona:</span> {selectedSession?.inferredPersona?.name || 'Unknown'}</div>
              <div><span className="font-semibold text-muted-foreground">Device:</span> {getDeviceFromUA(selectedSession?.userAgent || '')}</div>
              <div><span className="font-semibold text-muted-foreground">Started:</span> {selectedSession && new Date(selectedSession.createdAt).toLocaleString()}</div>
              <div><span className="font-semibold text-muted-foreground">Duration:</span> {selectedSession && formatDistanceToNow(new Date(selectedSession.createdAt), { addSuffix: false })}</div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Pageviews</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {selectedSession?.pageviews?.map((url, i) => (
                  <li key={i}>{url}</li>
                ))}
                {(!selectedSession?.pageviews || selectedSession.pageviews.length === 0) && (
                  <li>No pageviews recorded.</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Projects Clicked</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {selectedSession?.clickedProjects?.map((proj: any, i) => (
                  <li key={i}>{proj.title || 'Unknown Project'}</li>
                ))}
                {(!selectedSession?.clickedProjects || selectedSession.clickedProjects.length === 0) && (
                  <li>No projects interacted with.</li>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Interactions</TableHead>
              <TableHead className="text-right">View Journey</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell className="whitespace-nowrap">{new Date(session.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{getDeviceFromUA(session.userAgent)}</TableCell>
                  <TableCell>
                    {session.inferredPersona ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                          {session.inferredPersona.name}
                        </span>
                    ) : (
                        <span className="text-muted-foreground text-sm">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {session.pageviews?.length || 0} pages, {session.clickedProjects?.length || 0} projects
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewSession(session)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
