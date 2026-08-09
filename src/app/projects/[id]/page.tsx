import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Github, Globe, Target, AlertCircle, Handshake, Zap, Trophy, 
  Database, Terminal, ChevronRight, Activity, Server, Layout, Copy, Play, Maximize2
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StoryTelemetryObserver from '@/components/story-telemetry-observer';
import ClientTracker from '@/components/client-tracker';
import ProjectIntentObserver from '@/components/project-intent-observer';
import ProjectLinks from '@/components/project-links';
import CopyDxButton from '@/components/copy-dx-button';

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
  'Proudest Build': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  const project = await Project.findById(id).lean();
  
  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    _id: project._id.toString(),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans relative flex flex-col overflow-x-hidden">
      {/* Background Textures */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <ClientTracker targetName={`/projects/${id}`} />
      <div className="relative z-50">
        <Header initialLinks={{ github: '', linkedin: '' }} />
      </div>
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-24 relative z-10 space-y-32">
        
        {/* Navigation */}
        <Link 
          href="/overview" 
          className="inline-flex items-center font-mono text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors group mb-[-2rem]"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          Abort_To_Overview
        </Link>
        
        {/* ---------------------------------------------------------------- */}
        {/* SECTION 1: HERO & IMPACT METRICS                                 */}
        {/* ---------------------------------------------------------------- */}
        <header className="relative">
          <div className="inline-flex items-center gap-3 border-2 border-emerald-600/50 text-emerald-500 font-mono text-[10px] md:text-sm tracking-widest px-3 py-1 bg-emerald-600/10 mb-8 cursor-default">
            <Database className="w-4 h-4" />
            FILE_ID // {serializedProject._id.slice(-6).toUpperCase()}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-4 break-words shadow-black drop-shadow-md">
            {project.title}
          </h1>

          {project.tagline && (
            <p className="text-xl md:text-2xl font-mono text-emerald-400 mb-8 max-w-3xl">
              {project.tagline}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-10">
            {project.technologies.map((tech: string) => (
              <span key={tech} className="border border-white/10 px-3 py-1.5 font-mono text-xs font-bold text-slate-300 uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all bg-black/50 backdrop-blur-sm">
                {tech}
              </span>
            ))}
          </div>

          <div className="font-mono text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap max-w-4xl border-l-4 border-emerald-500/50 pl-6 py-4 bg-gradient-to-r from-emerald-500/5 to-transparent mb-12">
            <span className="text-emerald-500 font-bold mr-2 tracking-widest uppercase text-xs block mb-2">SYSTEM_OVERVIEW:</span>
            {project.overview || (project as any).description}
          </div>

          <div className="flex gap-4">
            {project.links?.github && (
              <ProjectIntentObserver projectId={serializedProject._id} eventType="CLICK_GITHUB" weight={15} triggerOn="click" className="inline-block">
                <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 px-6 bg-transparent text-white font-black uppercase tracking-widest text-sm transition-all border-2 border-slate-600 shadow-[4px_4px_0_0_#334155] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-slate-800 hover:border-white">
                  <Github className="w-5 h-5" /> Source Code
                </a>
              </ProjectIntentObserver>
            )}
            {project.links?.demo && (
              <ProjectIntentObserver projectId={serializedProject._id} eventType="CLICK_DEMO" weight={20} triggerOn="click" className="inline-block">
                <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-sm transition-all border-2 border-emerald-500 shadow-[4px_4px_0_0_#10b981] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-white hover:border-white">
                  <Globe className="w-5 h-5" /> Live Execution
                </a>
              </ProjectIntentObserver>
            )}
          </div>

          {/* Impact Metrics Bar */}
          {project.impactMetrics && project.impactMetrics.length > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-white/10 py-8">
              {project.impactMetrics.map((metric: any, idx: number) => (
                <div key={idx} className="flex flex-col border-l-2 border-emerald-500 pl-4">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">{metric.label}</span>
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">{metric.value}</span>
                  <span className="text-xs text-slate-400 mt-1">{metric.context}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 2: VISUAL PROOF & VIDEO DEMO                             */}
        {/* ---------------------------------------------------------------- */}
        {(project.videoUrl || project.imageUrl) && (
          <ProjectIntentObserver projectId={serializedProject._id} eventType="PLAY_VIDEO" weight={25} triggerOn="view">
            <section className="relative">
              <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-4">
                <Play className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Visual_Payload</h2>
              </div>
              
              <div className="w-full relative border-2 border-white/20 bg-black overflow-hidden rounded-t-xl group shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-shadow">
                {/* macOS / Terminal Frame Header */}
                <div className="h-10 bg-neutral-900 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-2 font-mono text-[10px] text-slate-500 tracking-widest bg-black/50 px-3 py-1 rounded">
                    <Activity className="w-3 h-3" /> LIVE_EXECUTION
                  </div>
                </div>

                {/* Media Content */}
                <div className="relative aspect-video w-full bg-[#050505]">
                  {project.videoUrl ? (
                    <iframe 
                      src={project.videoUrl.replace('watch?v=', 'embed/')} 
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0">
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title} 
                        fill 
                        className="object-cover object-top filter grayscale-[50%] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                      />
                      {/* Scanline effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-10"></div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </ProjectIntentObserver>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 3: SYSTEM ARCHITECTURE                                   */}
        {/* ---------------------------------------------------------------- */}
        {project.diagramUrl && (
          <ProjectIntentObserver projectId={serializedProject._id} eventType="VIEW_DIAGRAM" weight={15} triggerOn="view">
            <section className="relative">
              <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-4">
                <Server className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">System_Architecture</h2>
              </div>

              <div className="relative bg-neutral-950 border-2 border-slate-800 p-4 md:p-8 group overflow-hidden">
                <div className="absolute top-4 right-4 z-20">
                  <a href={project.diagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 bg-black border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="relative aspect-[16/9] md:aspect-[21/9] w-full border border-white/5 bg-black">
                  <Image 
                    src={project.diagramUrl} 
                    alt="System Architecture" 
                    fill 
                    className="object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none mix-blend-screen"></div>
                </div>
                
                <div className="mt-4 font-mono text-xs text-slate-500 tracking-widest uppercase flex items-center justify-between">
                  <span>STATUS: OPTIMAL</span>
                  <span>[DATA_FLOW_MAP]</span>
                </div>
              </div>
            </section>
          </ProjectIntentObserver>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 4: ARCHITECTURAL TRADE-OFFS                              */}
        {/* ---------------------------------------------------------------- */}
        {project.architecturalChallenges && project.architecturalChallenges.length > 0 && (
          <ProjectIntentObserver projectId={serializedProject._id} eventType="READ_TRADEOFFS" weight={10} triggerOn="view">
            <section className="relative">
              <div className="flex items-center gap-4 mb-10 border-b-2 border-white/10 pb-4">
                <AlertCircle className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Architectural_Trade-offs</h2>
              </div>

              <div className="space-y-12">
                {project.architecturalChallenges.map((challenge: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="inline-block bg-white/5 border border-white/10 px-4 py-1 mb-6 font-mono text-xs uppercase tracking-widest text-emerald-400">
                      THEME // {challenge.theme}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-white/10 shadow-2xl">
                      {/* Left: Bottleneck (Red) */}
                      <div className="bg-[#0f0a0a] border-b lg:border-b-0 lg:border-r border-red-900/30 p-6 md:p-8 relative overflow-hidden group/red">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-none border border-red-600/50 flex items-center justify-center bg-red-600/10 text-red-500">
                            <Activity className="w-4 h-4" />
                          </div>
                          <h3 className="font-mono text-sm font-bold text-red-400 tracking-widest uppercase">The Bottleneck</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-light">{challenge.bottleneck}</p>
                      </div>

                      {/* Right: Solution & Tradeoff (Green) */}
                      <div className="bg-[#0a0f0d] p-6 md:p-8 relative overflow-hidden group/green">
                        <div className="absolute top-0 left-0 lg:left-auto lg:right-0 w-1 h-full bg-emerald-600"></div>
                        
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-none border border-emerald-600/50 flex items-center justify-center bg-emerald-600/10 text-emerald-500">
                              <Zap className="w-4 h-4" />
                            </div>
                            <h3 className="font-mono text-sm font-bold text-emerald-400 tracking-widest uppercase">Engineered Solution</h3>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{challenge.solution}</p>
                        </div>
                        
                        <div className="pt-6 border-t border-emerald-900/30">
                          <h4 className="font-mono text-[10px] text-emerald-600 tracking-widest uppercase mb-2">Trade-off Accepted</h4>
                          <p className="text-sm text-slate-400 font-mono italic">"{challenge.tradeoff}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ProjectIntentObserver>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 5: ENTERPRISE CAPABILITIES BENTO GRID                    */}
        {/* ---------------------------------------------------------------- */}
        {project.systemFeatures && project.systemFeatures.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-4">
              <Layout className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">System_Capabilities</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.systemFeatures.map((feature: any, idx: number) => {
                // Make the first item larger for a bento effect if there are odd items
                const isLarge = idx === 0 && project.systemFeatures.length % 2 !== 0;
                return (
                  <div 
                    key={idx} 
                    className={`bg-neutral-900/50 border border-white/10 p-6 md:p-8 hover:bg-neutral-900 hover:border-emerald-500/50 transition-colors ${
                      isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <div className="w-2 h-2 bg-emerald-500 mb-6"></div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 tracking-tight">{feature.featureTitle}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 6: DX TERMINAL                                           */}
        {/* ---------------------------------------------------------------- */}
        {project.dxSnippet && (
          <section className="relative">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-4">
              <Terminal className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Developer_Experience</h2>
            </div>

            <div className="bg-[#0d1117] border border-slate-700 rounded-lg overflow-hidden shadow-2xl relative">
              <div className="h-10 bg-[#161b22] border-b border-slate-700 flex items-center justify-between px-4">
                <div className="font-mono text-xs text-slate-400">~/projects/{project.slug}</div>
                <CopyDxButton projectId={serializedProject._id} snippet={project.dxSnippet as string} />
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-slate-300">
                  {project.dxSnippet.split('\n').map((line: string, i: number) => (
                    <div key={i} className="flex group">
                      <span className="w-8 text-right pr-4 text-slate-600 select-none group-hover:text-slate-500">{i + 1}</span>
                      <span className={`${line.trim().startsWith('$') ? 'text-emerald-400 font-bold' : ''}`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 7: EXECUTION LOGS (LEGACY STAR STORIES)                  */}
        {/* ---------------------------------------------------------------- */}
        {(project as any).stories && (project as any).stories.length > 0 && (
          <div className="relative pt-16 border-t-4 border-dashed border-white/10">
            <div className="flex items-center gap-4 mb-16 pb-6">
              <Database className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">
                Legacy_Logs
              </h2>
            </div>

            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[15px] md:before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {(project as any).stories.map((story: any, index: number) => {
                const themeClass = themeColors[story.theme] || 'text-slate-400 border-slate-400/30 bg-slate-400/5';
                
                return (
                  <StoryTelemetryObserver key={index} storyTheme={story.theme} pageType="Project" pageId={serializedProject._id}>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-8 md:py-16">
                      
                      {/* Timeline Node */}
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-none border-2 border-white/20 bg-[#050505] text-white/50 group-hover:border-emerald-500 group-hover:text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,0,0,1)] transition-colors z-10 relative">
                        {themeIcons[story.theme] || <Target className="w-4 h-4" />}
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] border-2 border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-6 md:p-8 hover:border-white/30 transition-colors shadow-[8px_8px_0_0_rgba(255,255,255,0.02)] hover:shadow-[8px_8px_0_0_rgba(16,185,129,0.1)]">
                        
                        <div className={`inline-flex items-center font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-1 mb-6 border ${themeClass}`}>
                          {story.theme}
                        </div>
                        
                        <div className="space-y-8">
                          {/* Situation & Challenge */}
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-emerald-500" /> SITUATION
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
                          <div className="bg-white/[0.02] border-l-2 border-emerald-500 p-4 md:p-6 relative">
                            <h4 className="text-[10px] md:text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">ACTION_TAKEN</h4>
                            <p className="text-sm md:text-base text-white leading-relaxed">{story.action}</p>
                          </div>

                          {/* Result */}
                          <div>
                            <h4 className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-cyan-500" /> MEASURABLE_RESULT
                            </h4>
                            <p className="text-base md:text-lg text-emerald-400 font-mono tracking-tight leading-relaxed">
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
          </div>
        )}
      </main>

      <div className="relative z-50 mt-auto border-t border-white/10">
        <Footer initialLinks={{ github: '', linkedin: '' }} />
      </div>
    </div>
  );
}