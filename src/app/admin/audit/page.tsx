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

type AuditLogEntry = {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  adminId: string;
  timestamp: string;
};

export default function AuditLogPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/audit');
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load audit logs.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleViewLog = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground mt-2">Track all modifications made in the Admin Console.</p>
        </div>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold text-muted-foreground">Action:</span> {selectedLog?.action}</div>
              <div><span className="font-semibold text-muted-foreground">Entity Type:</span> {selectedLog?.entityType}</div>
              <div><span className="font-semibold text-muted-foreground">Admin ID:</span> {selectedLog?.adminId}</div>
              <div><span className="font-semibold text-muted-foreground">Timestamp:</span> {selectedLog && new Date(selectedLog.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground text-sm">Payload Details:</span>
              <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
                {JSON.stringify(selectedLog?.changes || {}, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Admin ID</TableHead>
              <TableHead className="text-right">View Diff</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                     }`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="text-muted-foreground">{log.adminId}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewLog(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
