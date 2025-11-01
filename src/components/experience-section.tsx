import { EXPERIENCE } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, ExternalLink, Github } from 'lucide-react';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground font-headline">Work Experience</h2>
          <p className="mt-4 text-lg text-muted-foreground">My professional journey and projects.</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 -ml-px w-0.5 h-full bg-border" aria-hidden="true"></div>

          {EXPERIENCE.map((item, index) => (
            <div key={index} className="relative flex items-start group mb-12 animate-slide-in-from-bottom opacity-0 fill-mode-forwards" style={{ animationDelay: `${index * 0.2}s` }}>
              {/* Timeline Dot */}
              <div className="absolute left-6 md:left-1/2 -ml-2.5 w-5 h-5 bg-background border-2 border-primary rounded-full z-10 transition-transform duration-300 group-hover:scale-125"></div>
              
              <div className={`w-full flex ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
                <div className="md:w-1/2 flex-shrink-0">
                  <div className={`p-6 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'} pl-16`}>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <h3 className="text-2xl font-bold text-primary mt-1">{item.title}</h3>
                    <p className="text-accent font-semibold mt-1">{item.company}</p>
                  </div>
                </div>

                <div className="md:w-1/2 w-full ml-12 md:ml-0">
                  <Card className="w-full transform transition-all duration-300 md:group-hover:scale-105 md:group-hover:shadow-2xl md:group-hover:shadow-primary/20">
                    <CardHeader>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        {item.links.website && (
                          <a href={item.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="mr-1.5 h-4 w-4" /> Website
                          </a>
                        )}
                        {item.links.github && (
                          <a href={item.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Github className="mr-1.5 h-4 w-4" /> GitHub
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
