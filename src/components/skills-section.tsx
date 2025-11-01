'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechIcon } from '@/components/icons';
import { useEffect, useState } from 'react';

type Skill = {
  _id: string;
  name: string;
  icon: string;
  category: string;
};

type GroupedSkills = {
  [key: string]: Skill[];
};

const SkillsSection = () => {
  const [skills, setSkills] = useState<GroupedSkills>({});

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        if (!res.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data: Skill[] = await res.json();
        const grouped = data.reduce((acc, skill) => {
          const { category } = skill;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(skill);
          return acc;
        }, {} as GroupedSkills);
        setSkills(grouped);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);


  return (
    <section id="skills" className="py-24 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground font-headline">My Tech Stack</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A selection of technologies I enjoy working with.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, skillItems], index) => (
            <Card 
              key={category} 
              className="border-border/60 hover:border-primary/50 transition-all duration-300 animate-slide-in-from-bottom opacity-0 fill-mode-forwards shadow-md hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {skillItems.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border/40">
                      <TechIcon name={skill.icon} className="h-6 w-6 text-accent" />
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;