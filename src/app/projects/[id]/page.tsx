import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Target, AlertCircle, Handshake, Zap, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StoryTelemetryObserver from '@/components/story-telemetry-observer';
import ClientTracker from '@/components/client-tracker';
import ProjectLinks from '@/components/project-links';

const themeIcons: Record<string, React.ReactNode> = {
  'Problem Solved': <Target className="w-5 h-5" />,
  'Mistake Made': <AlertCircle className="w-5 h-5" />,
  'Conflict Resolved': <Handshake className="w-5 h-5" />,
  'Influenced Decision': <Zap className="w-5 h-5" />,
  'Proudest Build': <Trophy className="w-5 h-5" />,
};

const themeColors: Record<string, string> = {
  'Problem Solved': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Mistake Made': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Conflict Resolved': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Influenced Decision': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Proudest Build': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

// Next.js 15 requires async params access
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  const project = await Project.findById(id).lean();
  
  if (!project) {
    notFound();
  }

  // Safely serialize for Client Components if needed
  const serializedProject = {
    ...project,
    _id: project._id.toString(),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClientTracker targetName={`/projects/${id}`} />
      <Header initialLinks={{ github: '', linkedin: '' }} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <Link 
          href="/overview" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </Link>
        
        <header className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-emerald-500">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="secondary" className="bg-secondary/50 text-sm py-1 px-3">
                {tech}
              </Badge>
            ))}
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <ProjectLinks 
            githubUrl={project.links?.github} 
            demoUrl={project.links?.demo} 
            projectTitle={project.title} 
          />
        </header>

        {project.stories && project.stories.length > 0 ? (
          <div className="space-y-16">
            <h2 className="text-2xl font-bold border-b border-border pb-4">The Narrative</h2>
            
            {project.stories.map((story: any, index: number) => (
              <StoryTelemetryObserver key={index} storyTheme={story.theme} pageType="Project" pageId={serializedProject._id}>
                <div className="relative pl-6 md:pl-10 border-l border-border space-y-8 pb-12 last:pb-0 last:border-transparent">
                  <div className="absolute -left-3 top-0 bg-background border border-border rounded-full p-1 shadow-sm">
                    <div className="text-muted-foreground">
                      {themeIcons[story.theme] || <Target className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  <div>
                    <Badge variant="outline" className={`mb-4 px-3 py-1 text-sm font-semibold border ${themeColors[story.theme] || 'bg-secondary text-foreground'}`}>
                      {story.theme}
                    </Badge>
                    
                    <div className="space-y-8 mt-6">
                      <div>
                        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-widest mb-3">Situation</h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">{story.situation}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-widest mb-3">Challenge</h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">{story.challenge}</p>
                      </div>

                      <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-widest mb-4">Action</h4>
                        <p className="text-lg text-foreground leading-relaxed">{story.action}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-widest mb-3">Result</h4>
                        <p className="text-lg text-emerald-500/90 font-medium leading-relaxed">{story.result}</p>
                      </div>

                      <div className="pt-6 border-t border-border/50">
                        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-widest mb-3">The Takeaway</h4>
                        <p className="text-xl text-foreground font-serif italic border-l-4 border-emerald-500/50 pl-6 py-2 leading-relaxed">
                          "{story.learning}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StoryTelemetryObserver>
            ))}
          </div>
        ) : (
          <div className="py-12 border-t border-border mt-12">
            <p className="text-muted-foreground italic text-center">No deep-dive narrative available for this project yet.</p>
          </div>
        )}
      </main>

      <Footer initialLinks={{ github: '', linkedin: '' }} />
    </div>
  );
}
