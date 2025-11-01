import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PROJECT_SPOTLIGHT_DATA } from '@/lib/data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { PlayCircle } from 'lucide-react';

const ProjectSpotlight = () => {
  const screenshots = PlaceHolderImages.filter(img => img.id.startsWith('project-screenshot'));
  const demoThumb = PlaceHolderImages.find(img => img.id === 'project-demo-thumb');

  return (
    <section id="projects" className="py-24 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground font-headline">Project Spotlight</h2>
          <p className="mt-4 text-lg text-muted-foreground">{PROJECT_SPOTLIGHT_DATA.title}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-semibold text-primary mb-4">Project Overview</h3>
            <p className="text-muted-foreground mb-6">{PROJECT_SPOTLIGHT_DATA.description}</p>
            
            <h4 className="text-xl font-semibold text-foreground mb-3">Key Features:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {PROJECT_SPOTLIGHT_DATA.features.map((feature, i) => <li key={i}>{feature}</li>)}
            </ul>

            <h4 className="text-xl font-semibold text-foreground mb-3">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {PROJECT_SPOTLIGHT_DATA.technologies.map(tech => <Badge key={tech} variant="default">{tech}</Badge>)}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Carousel className="w-full">
              <CarouselContent>
                {screenshots.map((img) => (
                  <CarouselItem key={img.id}>
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-0">
                        <Image
                          src={img.imageUrl}
                          alt={img.description}
                          width={1280}
                          height={720}
                          className="rounded-lg object-cover"
                          data-ai-hint={img.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
            
            {demoThumb && (
              <div className="relative cursor-pointer group">
                <Image
                  src={demoThumb.imageUrl}
                  alt={demoThumb.description}
                  width={1280}
                  height={720}
                  className="rounded-lg object-cover w-full"
                  data-ai-hint={demoThumb.imageHint}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-opacity duration-300">
                  <PlayCircle className="h-20 w-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="font-semibold text-white text-lg">Watch Video Demo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSpotlight;
