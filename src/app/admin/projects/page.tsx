
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManageProjectsPage() {
  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-muted-foreground">Here you will be able to add, edit, and remove your projects.</p>
      </div>
    </div>
  );
}
