'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Github, PlayCircle, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { PROJECT_SPOTLIGHT_DATA } from '@/lib/data';

type Project = {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
};

const ProjectSpotlight = () => {
  const screenshots = PlaceHolderImages.filter(img => img.id.startsWith('project-screenshot'));
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: Project[] = await res.json();
        const regularProjects = data.filter(p => p.title !== PROJECT_SPOTLIGHT_DATA.title);
        const specialProject = data.find(p => p.title === PROJECT_SPOTLIGHT_DATA.title);
        
        const sortedProjects = specialProject ? [specialProject, ...regularProjects] : regularProjects;

        setProjects(sortedProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);


  return (
    <section id="projects" className="py-24 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground font-headline">Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground">A few things I've built.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {projects.map((project, index) => (
              <Card 
                key={project._id} 
                className={`flex flex-col transform transition-all duration-300 hover:-translate-y-2 animate-slide-in-from-bottom opacity-0 fill-mode-forwards shadow-lg hover:shadow-xl hover:shadow-primary/20 
                 `}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`grid grid-cols-1  gap-6 h-full`}>
                  
                  {/* Image/Carousel Section : ADD LATER */}
                  <div className={`p-2 relative`}>
                    {/* {index === 0 ? (
                      <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                          {screenshots.map((img) => (
                            <CarouselItem key={img.id}>
                              <div className="aspect-video relative h-full">
                                  <Image
                                    src={img.imageUrl}
                                    alt={img.description}
                                    fill
                                    className="rounded-t-lg md:rounded-l-lg md:rounded-r-none object-cover"
                                    data-ai-hint={img.imageHint}
                                  />
                                </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-16" />
                        <CarouselNext className="mr-16" />
                      </Carousel>
                    ) :  */}
                   { project.imageUrl ? (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image
                          src={project.imageUrl}
                          alt={`${project.title} screenshot`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                       <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                          <p className="text-muted-foreground">No Image</p>
                       </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className={`flex flex-col p-6 ${index === 0 ? 'order-2' : 'order-2'}`}>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-primary text-2xl">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow space-y-4">
                      <p className="text-muted-foreground">{project.description}</p>
                      <div>
                        <h4 className="font-semibold mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map(tech => <Badge key={tech} variant="default" className='hover:cursor-pointer'>{tech}</Badge>)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 flex items-center gap-4 pt-4 mt-auto">
                      {project.links?.website && (
                        <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                          <ExternalLink className="mr-1.5 h-4 w-4" /> Website
                        </a>
                      )}
                      {project.links?.github && (
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Github className="mr-1.5 h-4 w-4" /> GitHub
                        </a>
                      )}
                      {project.links?.demo && (
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                          <PlayCircle className="mr-1.5 h-4 w-4" /> Demo
                        </a>
                      )}
                    </CardFooter>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSpotlight;
