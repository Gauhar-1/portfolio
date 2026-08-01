import dbConnect from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Target, AlertCircle, Handshake, Zap, Trophy, Briefcase, ChevronRight, Calendar, Building2 } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StoryTelemetryObserver from '@/components/story-telemetry-observer';
import ClientTracker from '@/components/client-tracker';
import ExperienceLinks from '@/components/experience-links';

// Adapted for the dark brutalist theme
const themeIcons: Record<string, React.ReactNode> = {
  'Problem Solved': <Target className="w-5 h-5" />,
  'Mistake Made': <AlertCircle className="w-5 h-5" />,
  'Conflict Resolved': <Handshake className="w-5 h-5" />,
  'Influenced Decision': <Zap className="w-5 h-5" />,
  'Proudest Build': <Trophy className="w-5 h-5" />,
};

const themeColors: Record<string, string> = {
  'Problem Solved': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  'Mistake Made': 'text-red-500 border-red-500/30 bg-red-500/5',
  'Conflict Resolved': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Influenced Decision': 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  'Proudest Build': 'text-blue-500 border-blue-500/30 bg-blue-500/5',
};

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  const experience = await Experience.findById(id).lean();
  
  if (!experience) {
    notFound();
  }

  const serializedExperience = {
    ...experience,
    _id: experience._id.toString(),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 selection:bg-blue-500/30 font-sans relative flex flex-col overflow-x-hidden">
      {/* Background Textures matching the Experience Section */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <ClientTracker targetName={`/experience/${id}`} />
      <div className="relative z-50">
        <Header initialLinks={{ github: '', linkedin: '' }} />
      </div>
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-24 relative z-10">
        
        {/* Navigation */}
        <Link 
          href="/overview" 
          className="inline-flex items-center font-mono text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          Close_File
        </Link>
        
        {/* Hero Section */}
        <header className="relative mb-20">
          <div className="inline-flex items-center gap-3 border-2 border-blue-600/50 text-blue-500 font-mono text-[10px] md:text-sm tracking-widest px-3 py-1 bg-blue-600/10 mb-8 cursor-default">
            <Building2 className="w-4 h-4" />
            DOSSIER // {serializedExperience._id.slice(-6).toUpperCase()}
          </div>
          
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter break-words">
              {experience.title}
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-blue-500 uppercase tracking-tight">
              @ {experience.company}
            </h2>
            <div className="flex items-center gap-2 font-mono text-slate-400 text-sm md:text-base tracking-widest uppercase border-b border-white/10 pb-4 inline-flex">
              <Calendar className="w-4 h-4" /> {experience.date}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {experience.technologies.map((tech: string) => (
              <span key={tech} className="border border-white/10 px-3 py-1.5 font-mono text-xs font-bold text-slate-300 uppercase hover:border-blue-500 hover:text-blue-500 transition-all bg-black/50 backdrop-blur-sm">
                {tech}
              </span>
            ))}
          </div>

          <div className="font-mono text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap max-w-3xl border-l-4 border-blue-500/50 pl-6 py-2 bg-gradient-to-r from-blue-500/5 to-transparent">
            <span className="text-blue-500 font-bold mr-2 tracking-widest uppercase text-xs">CAREER_SUMMARY:</span>
            {experience.description}
          </div>

          <div className="mt-12 inline-block">
            <ExperienceLinks 
              websiteUrl={experience.links?.website} 
              companyName={experience.company} 
            />
          </div>
        </header>

        {/* The Narrative (STAR Stories) */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-16 border-b-2 border-white/10 pb-6">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">
              Milestone_Logs
            </h2>
          </div>

          {experience.stories && experience.stories.length > 0 ? (
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[15px] md:before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              {experience.stories.map((story: any, index: number) => {
                const themeClass = themeColors[story.theme] || 'text-slate-400 border-slate-400/30 bg-slate-400/5';
                
                return (
                  <StoryTelemetryObserver key={index} storyTheme={story.theme} pageType="Experience" pageId={serializedExperience._id}>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-8 md:py-16">
                      
                      {/* Timeline Node */}
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-none border-2 border-white/20 bg-[#050505] text-white/50 group-hover:border-blue-500 group-hover:text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,0,0,1)] transition-colors z-10 relative">
                        {themeIcons[story.theme] || <Target className="w-4 h-4" />}
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] border-2 border-white/10 bg-[#0f0f11]/80 backdrop-blur-sm p-6 md:p-8 hover:border-white/30 transition-colors shadow-[8px_8px_0_0_rgba(255,255,255,0.02)] hover:shadow-[8px_8px_0_0_rgba(59,130,246,0.1)]">
                        
                        <div className={`inline-flex items-center font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-1 mb-6 border ${themeClass}`}>
                          {story.theme}
                        </div>
                        
                        <div className="space-y-8">
                          {/* Situation & Challenge */}
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-blue-500" /> SITUATION
                              </h4>
                              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">{story.situation}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-red-500" /> CHALLENGE
                              </h4>
                              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">{story.challenge}</p>
                            </div>
                          </div>

                          {/* Action (Highlighted) */}
                          <div className="bg-white/[0.02] border-l-2 border-blue-500 p-4 md:p-6 relative">
                            <h4 className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">ACTION_TAKEN</h4>
                            <p className="text-sm md:text-base text-white leading-relaxed">{story.action}</p>
                          </div>

                          {/* Result */}
                          <div>
                            <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-cyan-500" /> MEASURABLE_RESULT
                            </h4>
                            <p className="text-base md:text-lg text-blue-400 font-mono tracking-tight leading-relaxed">
                              {story.result}
                            </p>
                          </div>

                          {/* Learning */}
                          <div className="pt-6 border-t border-white/10">
                            <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-3">SYSTEM_TAKEAWAY</h4>
                            <p className="text-sm md:text-base text-slate-400 font-mono italic">
                              "{story.learning}"
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </StoryTelemetryObserver>
                );
              })}
            </div>
          ) : (
            <div className="py-20 border-2 border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <Briefcase className="w-8 h-8 text-white/20 mb-4" />
              <p className="font-mono text-sm text-white/40 uppercase tracking-widest">No milestone logs found for this dossier.</p>
            </div>
          )}
        </div>
      </main>

      <div className="relative z-50 mt-auto">
        <Footer initialLinks={{ github: '', linkedin: '' }} />
      </div>
    </div>
  );
}