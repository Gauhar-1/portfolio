'use client';

import { useState } from 'react';
import StoryNode from '@/components/story-node';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  _id?: string;
  theme: string;
  situation: string;
  challenge: string;
  action: string;
  result: string;
  learning: string;
}

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  links?: { website?: string; github?: string; demo?: string };
  stories: Story[];
}

interface ExperienceData {
  _id: string;
  title: string;
  company: string;
  date: string;
  description: string;
  technologies: string[];
  links?: { website?: string; github?: string };
  stories: Story[];
}

interface StoryExplorerProps {
  projects: ProjectData[];
  experience: ExperienceData[];
}

const ALL_FILTER = 'All Work';
const THEMES = [
  'Problem Solved',
  'Mistake Made',
  'Conflict Resolved',
  'Influenced Decision',
  'Proudest Build'
];

export default function StoryExplorer({ projects, experience }: StoryExplorerProps) {
  const [activeTheme, setActiveTheme] = useState<string>(ALL_FILTER);

  // Filter items that contain AT LEAST ONE story matching the active theme
  // If activeTheme is 'All Work', show all items.
  const filteredProjects = projects.filter(p => 
    activeTheme === ALL_FILTER ? true : p.stories.some(s => s.theme === activeTheme)
  );

  const filteredExperience = experience.filter(e => 
    activeTheme === ALL_FILTER ? true : e.stories.some(s => s.theme === activeTheme)
  );

  // Helper to extract which stories to render based on filter
  const getRelevantStories = (stories: Story[]) => {
    if (activeTheme === ALL_FILTER) return stories; // or we can choose to only show 1, but let's show all
    return stories.filter(s => s.theme === activeTheme);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      
      {/* Behavioral Filter Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 border-b border-border">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest hidden md:inline-block mr-2">
            Explore By:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTheme(ALL_FILTER)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTheme === ALL_FILTER 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'bg-card text-foreground hover:bg-card/80 border border-border'
              }`}
            >
              {ALL_FILTER}
            </button>
            {THEMES.map(theme => (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTheme === theme 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-card text-foreground hover:bg-card/80 border border-border'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {/* Experience Section */}
        {filteredExperience.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight border-b border-border pb-4">Professional Experience</h2>
            <div className="space-y-12">
              {filteredExperience.map(exp => (
                <div key={exp._id} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">{exp.title}</h3>
                      <p className="text-xl text-foreground font-medium">{exp.company} <span className="text-muted-foreground mx-2">|</span> <span className="text-sm font-normal text-muted-foreground">{exp.date}</span></p>
                    </div>
                    {exp.links?.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={exp.links.website} target="_blank" rel="noopener noreferrer">
                          Visit Company <ExternalLink className="ml-2 w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="bg-secondary/50">{tech}</Badge>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {getRelevantStories(exp.stories).map(story => (
                      <StoryNode 
                        key={story._id || story.theme + exp._id} 
                        story={story} 
                        contextTitle={`${exp.title} @ ${exp.company}`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {filteredProjects.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight border-b border-border pb-4">Key Projects</h2>
            <div className="space-y-12">
              {filteredProjects.map(proj => (
                <div key={proj._id} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">{proj.title}</h3>
                      <p className="text-muted-foreground mt-2 max-w-2xl">{proj.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {proj.links?.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={proj.links.github} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 w-4 h-4" /> Source
                          </a>
                        </Button>
                      )}
                      {proj.links?.demo && (
                        <Button variant="default" size="sm" asChild>
                          <a href={proj.links.demo} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 w-4 h-4" /> Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="bg-secondary/50">{tech}</Badge>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {getRelevantStories(proj.stories).map(story => (
                      <StoryNode 
                        key={story._id || story.theme + proj._id} 
                        story={story} 
                        contextTitle={proj.title} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredProjects.length === 0 && filteredExperience.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-muted-foreground">No stories found for this theme.</h3>
            <p className="text-muted-foreground mt-2">Try selecting a different behavioral filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
