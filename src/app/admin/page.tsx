
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Button asChild>
                <Link href="/">Back to Site</Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Update your profile picture.</p>
              <Button asChild>
                <Link href="/admin/profile">Manage Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Add, edit, or remove skills from your portfolio.</p>
              <Button asChild>
                <Link href="/admin/skills">Manage Skills</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Update your work experience and professional journey.</p>
              <Button asChild>
                <Link href="/admin/experience">Manage Experience</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Showcase your latest projects and creations.</p>
              <Button asChild>
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Manage Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Update your social and resume links.</p>
               <Button asChild>
                <Link href="/admin/links">Manage Links</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">See messages submitted through your contact form.</p>
               <Button asChild>
                <Link href="/admin/messages">View Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
