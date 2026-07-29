'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, User, Briefcase, Code, Link as LinkIcon, 
  MessageSquare, Settings, Activity, Users, FileText, Anchor
} from 'lucide-react';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Profile', href: '/admin/profile', icon: User },
      { name: 'Projects', href: '/admin/projects', icon: Code },
      { name: 'Experience', href: '/admin/experience', icon: Briefcase },
      { name: 'Skills', href: '/admin/skills', icon: Anchor },
      { name: 'Links', href: '/admin/links', icon: LinkIcon },
    ]
  },
  {
    title: 'CMS & Journey',
    items: [
      { name: 'Personas', href: '/admin/personas', icon: Users },
      { name: 'Content Rules', href: '/admin/rules', icon: Settings }, // Placeholder for rule engine
      { name: 'Changelog', href: '/admin/changelog', icon: FileText },
    ]
  },
  {
    title: 'CRM & Telemetry',
    items: [
      { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
      { name: 'Visitor Sessions', href: '/admin/sessions', icon: Activity },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Webhooks', href: '/admin/webhooks', icon: Settings },
      { name: 'Audit Log', href: '/admin/audit', icon: FileText },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Admin Console</h2>
      </div>
      <nav className="flex-1 space-y-6 px-4 pb-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
