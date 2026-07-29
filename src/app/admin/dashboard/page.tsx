import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Users, MessageSquare, Code, MousePointerClick, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-2">
          Telemetry, CMS, and CRM metrics for your portfolio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Persona</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Recruiter</div>
            <p className="text-xs text-muted-foreground">45% of identified traffic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">3 require urgent response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,120</div>
            <p className="text-xs text-muted-foreground">E-commerce App is trending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Session Telemetry</CardTitle>
            <CardDescription>
              Visitor traffic over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-64 text-muted-foreground">
            {/* Placeholder for Recharts component which we will add in Phase 4 */}
            [ Telemetry Chart Placeholder ]
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Audit log of your recent actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Updated Persona: Founder</p>
                  <p className="text-sm text-muted-foreground">
                    Changed default layout priority
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Published Changelog</p>
                  <p className="text-sm text-muted-foreground">
                    "Released v2 of Analytics Module"
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">2 hrs ago</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Triggered Webhook</p>
                  <p className="text-sm text-muted-foreground">
                    Discord Notification sent
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
