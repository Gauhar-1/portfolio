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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Eye, Loader2, Trash2, CheckCircle2, Star, Mail, Building, Clock } from 'lucide-react';
import { format } from 'date-fns';

type Message = {
  _id: string;
  name: string;
  email: string;
  companyOrRole?: string;
  intent?: 'INTERVIEW_REQUEST' | 'FOUNDING_ROLE' | 'FREELANCE_BUILD' | 'PORTFOLIO_REVIEW';
  rating?: number;
  message: string;
  status?: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  sessionId?: string;
  sessionData?: {
    userAgent?: string;
    referrer?: string;
    pageviews?: string[];
    clickedProjects?: any[];
    inferredPersona?: { name: string };
  };
  createdAt: string;
};

const intentBadges: Record<
  string,
  { label: string; badge: string; border: string }
> = {
  INTERVIEW_REQUEST: {
    label: '⚡ Interview',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500',
  },
  FOUNDING_ROLE: {
    label: '🚀 Founding Role',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'border-amber-500',
  },
  FREELANCE_BUILD: {
    label: '🛠️ Freelance',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    border: 'border-blue-500',
  },
  PORTFOLIO_REVIEW: {
    label: '🏆 Review',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    border: 'border-purple-500',
  },
};

export default function ManageMessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load messages.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [toast]);

  const toggleStatus = async (msg: Message) => {
    const nextStatus = msg.status === 'READ' ? 'UNREAD' : 'READ';
    try {
      const res = await fetch(`/api/messages/${msg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: nextStatus } : m))
      );
      toast({
        title: `Marked as ${nextStatus}`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error updating status',
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      await fetchMessages();
      toast({
        title: 'Message Deleted!',
        description: 'The message has been successfully removed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not delete the message.',
      });
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewOpen(true);
    if (message.status === 'UNREAD') {
      toggleStatus(message);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mission Comms & Dispatches</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recruiter hiring intent presets, portfolio reviews, and operator dispatches.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {/* View Message Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                    intentBadges[selectedMessage?.intent || 'INTERVIEW_REQUEST']?.badge
                  }`}
                >
                  {intentBadges[selectedMessage?.intent || 'INTERVIEW_REQUEST']?.label}
                </span>
                {selectedMessage?.rating && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">
                    <Star className="w-3 h-3 fill-current" /> {selectedMessage.rating} / 5 Stars
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl">
                Dispatch from {selectedMessage?.name}
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-xs space-y-1 pt-1">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Mail className="w-3.5 h-3.5" /> {selectedMessage?.email}
                  </div>
                  {selectedMessage?.companyOrRole && (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Building className="w-3.5 h-3.5" /> {selectedMessage.companyOrRole}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />{' '}
                    {selectedMessage && format(new Date(selectedMessage.createdAt), 'PPpp')}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 bg-muted/60 p-4 rounded-lg text-foreground border font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>

            {/* Pre-Message Journey / Telemetry */}
            {selectedMessage?.sessionData && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Pre-Message Journey & Session Telemetry
                </h3>
                <div className="space-y-2 text-xs font-mono bg-muted/30 p-3 rounded-lg border">
                  <div>
                    <span className="text-muted-foreground">Inferred Persona: </span>
                    <strong className="text-foreground">
                      {selectedMessage.sessionData.inferredPersona?.name || 'Unknown'}
                    </strong>
                  </div>
                  <div className="truncate">
                    <span className="text-muted-foreground">Device / Agent: </span>
                    <span className="text-foreground">{selectedMessage.sessionData.userAgent}</span>
                  </div>
                  {selectedMessage.sessionData.clickedProjects &&
                    selectedMessage.sessionData.clickedProjects.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Projects Inspected:</span>
                        <ul className="list-disc pl-5 mt-1 text-foreground">
                          {selectedMessage.sessionData.clickedProjects.map((p: any, i: number) => (
                            <li key={i}>{p.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Messages Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-40">Intent</TableHead>
                <TableHead>Contact / Company</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead className="w-32">Received</TableHead>
                <TableHead className="text-right w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const intentMeta =
                    intentBadges[msg.intent || 'INTERVIEW_REQUEST'] || intentBadges.INTERVIEW_REQUEST;
                  const isUnread = msg.status !== 'READ';

                  return (
                    <TableRow key={msg._id} className={isUnread ? 'bg-primary/5 font-medium' : ''}>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => toggleStatus(msg)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-bold border transition-colors cursor-pointer ${
                            isUnread
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {isUnread ? 'UNREAD' : 'READ'}
                        </button>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${intentMeta.badge}`}
                          >
                            {intentMeta.label}
                          </span>
                          {msg.rating && (
                            <span className="text-[10px] font-mono text-purple-400 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> {msg.rating} Stars
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-foreground text-sm">{msg.name}</div>
                        <div className="text-xs text-muted-foreground">{msg.email}</div>
                        {msg.companyOrRole && (
                          <div className="text-[11px] text-primary font-mono truncate max-w-[200px]">
                            {msg.companyOrRole}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                        {msg.message}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewMessage(msg)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete message?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. Permanently delete message from{' '}
                                  {msg.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(msg._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No dispatches received yet.
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
