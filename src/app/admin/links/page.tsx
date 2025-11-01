
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManageLinksPage() {
  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Links</h1>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-muted-foreground">Here you will be able to update your social and resume links.</p>
      </div>
    </div>
  );
}
