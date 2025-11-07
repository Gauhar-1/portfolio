import { cn } from "@/lib/utils";
import type { LucideProps } from 'lucide-react';
import {
  Atom,
  Box,
  Cloud,
  Code,
  Container,
  Database,
  DatabaseZap,
  GitMerge,
  Github,
  Key,
  Lock,
  Network,
  Package,
  Rocket,
  Server,
  Shield,
} from 'lucide-react';

interface TechIconProps {
  name: string;
  className?: string;
}

export const TechIcon = ({ name, className }: TechIconProps) => {
  const iconName = name.toLowerCase();

  const ICONS: { [key: string]: React.FC<LucideProps> } = {
    javascript: Code,
    typescript: Code,
    react: Atom,
    nextjs: Code,
    nodejs: Server,
    express: Code,
    postgresql: Database,
    mongodb: DatabaseZap,
    mysql: Database,
    firebase: Cloud,
    redux: GitMerge,
    api: Network,
    microservices: Box,
    graphql: Rocket,
    docker: Package,
    kubernetes: Container,
    githubactions: Github,
    git: GitMerge,
    nginx: Server,
    oauth: Key,
    jwt: Shield,
    nextauth: Lock,
  };

  const IconComponent = ICONS[iconName] || Code;

  return <IconComponent className={cn(className)} />;
};
