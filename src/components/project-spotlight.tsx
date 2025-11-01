import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PROJECTS } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Github, PlayCircle } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ProjectSpotlight = () => {
  const screenshots = PlaceHolderImages.filter(img => img.id.startsWith('project-screenshot'));

  return (
    <section id="projects" className="py-24 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground font-headline">Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground">A few things I've built.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project, index) => (
            <Card 
              key={index} 
              className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 animate-slide-in-from-bottom opacity-0 fill-mode-forwards"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <CardTitle className="text-primary">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                {project.id === 'lan-communicator' ? (
                  <Carousel className="w-full max-w-full mx-auto">
                    <CarouselContent>
                      {screenshots.map((img) => (
                        <CarouselItem key={img.id}>
                           <div className="aspect-video relative">
                              <Image
                                src={img.imageUrl}
                                alt={img.description}
                                fill
                                className="rounded-md object-cover"
                                data-ai-hint={img.imageHint}
                              />
                            </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12" />
                  </Carousel>
                ) : project.imageUrl ? (
                  <div className="aspect-video relative overflow-hidden rounded-md">
                    <Image
                      src={project.imageUrl}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                {project.features && (
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {project.features.map((feature, i) => <li key={i}>{feature}</li>)}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => <Badge key={tech} variant="default">{tech}</Badge>)}
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex items-center gap-4 pt-4 mt-auto">
                {project.links.website && (
                  <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="mr-1.5 h-4 w-4" /> Website
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Github className="mr-1.5 h-4 w-4" /> GitHub
                  </a>
                )}
                {project.links.demo && (
                   <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <PlayCircle className="mr-1.5 h-4 w-4" /> Demo
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSpotlight;
