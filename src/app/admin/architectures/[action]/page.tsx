import { redirect } from 'next/navigation';
import { ArchitectureForm } from '@/components/admin/architectures/ArchitectureForm';

interface PageProps {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminArchitectureActionPage({
  params,
  searchParams,
}: PageProps) {
  const { action } = await params;
  const { id } = await searchParams;

  // Validate action route segment
  if (action !== 'new' && action !== 'edit') {
    redirect('/admin/architectures');
  }

  // If in edit mode without an ID, redirect back to list
  if (action === 'edit' && !id) {
    redirect('/admin/architectures');
  }

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <ArchitectureForm
        action={action as 'new' | 'edit'}
        id={typeof id === 'string' ? id : undefined}
      />
    </div>
  );
}
