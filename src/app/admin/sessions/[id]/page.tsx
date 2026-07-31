import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Target, Ghost, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

function formatDuration(ms?: number) {
  if (!ms || ms === 0) return 'Bounced (0s)';
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default async function SessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  const session = await Session.findById(id).lean();
  
  if (!session) {
    notFound();
  }

  // Ensure arrays exist
  const events = session.events || [];
  
  // Sort events by timestamp (newest first)
  events.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/sessions" className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-500 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Session Intel
          </h1>
          <p className="text-muted-foreground font-mono text-xs mt-2">ID: {session.sessionId}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-emerald-500">{session.intentScore}</div>
          <div className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest">Intent Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm col-span-1 md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2">Visitor Profile</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Company</div>
                    <div className="font-medium text-foreground">{session.companyName || 'Unknown'}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Persona</div>
                    <div className="font-medium text-foreground">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {session.role || 'Unidentified'}
                        </span>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">User Agent</div>
                    <div className="font-mono text-[10px] text-muted-foreground truncate" title={session.userAgent}>{session.userAgent}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">IP Address</div>
                    <div className="font-mono text-xs text-foreground">{session.ipAddress || 'Hidden'}</div>
                </div>
            </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2">Time Matrix</h2>
            <div className="space-y-3">
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Initial Contact</div>
                    <div className="font-medium text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {format(new Date(session.startTime), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Active</div>
                    <div className="font-medium text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden mt-8 shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" /> Exact Telemetry Timeline
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking exact dwell times and explicit outbound clicks. Sessions missing duration are logged as Bounces.
          </p>
        </div>
        
        <div className="p-6">
            <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                {events.length > 0 ? (
                    events.map((evt: any, i: number) => {
                        const isBounce = evt.eventType === 'PAGE_VIEW' && (!evt.duration || evt.duration === 0);
                        const isClick = evt.eventType === 'OUTBOUND_CLICK';
                        const isContact = evt.eventType === 'CONTACT_INITIATED';

                        return (
                            <div key={i} className="relative pl-6">
                                <div className={`absolute -left-[21px] top-1 bg-background border-2 rounded-full p-1.5 ${
                                    isBounce ? 'border-red-500/50' : 
                                    isClick ? 'border-blue-500/50' : 
                                    isContact ? 'border-amber-500/50' : 'border-emerald-500/50'
                                }`}>
                                    {isBounce ? <Ghost className="w-3 h-3 text-red-500" /> :
                                     isContact ? <Target className="w-3 h-3 text-amber-500" /> :
                                     <CheckCircle2 className={`w-3 h-3 ${isClick ? 'text-blue-500' : 'text-emerald-500'}`} />}
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${
                                                isBounce ? 'text-red-500' : 
                                                isClick ? 'text-blue-500' : 
                                                isContact ? 'text-amber-500' : 'text-emerald-500'
                                            }`}>
                                                {evt.eventType.replace('_', ' ')}
                                            </span>
                                            {isBounce && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Bounced</span>}
                                        </div>
                                        <div className="text-base text-foreground font-medium">{evt.target}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                                        {evt.duration !== undefined && !isBounce && (
                                            <span className="bg-muted px-2 py-1 rounded text-emerald-400">
                                                {formatDuration(evt.duration)}
                                            </span>
                                        )}
                                        <span>{format(new Date(evt.timestamp), 'MMM d, HH:mm:ss')}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="pl-6 text-muted-foreground italic">No detailed exact telemetry available yet.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
