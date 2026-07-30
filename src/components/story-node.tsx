'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, AlertCircle, Handshake, Zap, Trophy } from 'lucide-react';

interface Story {
  _id?: string;
  theme: string;
  situation: string;
  challenge: string;
  action: string;
  result: string;
  learning: string;
}

interface StoryNodeProps {
  story: Story;
  contextTitle: string;
}

const themeIcons: Record<string, React.ReactNode> = {
  'Problem Solved': <Target className="w-4 h-4 mr-1" />,
  'Mistake Made': <AlertCircle className="w-4 h-4 mr-1" />,
  'Conflict Resolved': <Handshake className="w-4 h-4 mr-1" />,
  'Influenced Decision': <Zap className="w-4 h-4 mr-1" />,
  'Proudest Build': <Trophy className="w-4 h-4 mr-1" />,
};

const themeColors: Record<string, string> = {
  'Problem Solved': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Mistake Made': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Conflict Resolved': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Influenced Decision': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Proudest Build': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

export default function StoryNode({ story, contextTitle }: StoryNodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPinged, setHasPinged] = useState(false);

  useEffect(() => {
    if (hasPinged) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start 5-second timer
          timeoutId = setTimeout(() => {
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
              fetch('/api/sessions/ping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId,
                  storyTheme: story.theme,
                  duration: 5, // recorded 5 seconds
                }),
              }).catch(err => console.error('Ping failed', err));
              
              setHasPinged(true);
            }
          }, 5000);
        } else {
          // Clear timer if they scroll past quickly
          clearTimeout(timeoutId);
        }
      },
      { threshold: 0.6 } // 60% of the card must be visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [hasPinged, story.theme]);

  return (
    <Card ref={containerRef} className="border-border/50 bg-card/40 hover:bg-card/60 transition-colors duration-300">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Context</h4>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">{contextTitle}</h3>
          </div>
          <Badge variant="outline" className={`px-3 py-1 text-sm font-medium ${themeColors[story.theme] || 'bg-primary/10 text-primary'}`}>
            {themeIcons[story.theme]}
            {story.theme}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wide">Situation</h5>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{story.situation}</p>
            </div>
            <div>
              <h5 className="text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wide">Challenge</h5>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{story.challenge}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wide">Action</h5>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{story.action}</p>
            </div>
            <div>
              <h5 className="text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wide">Result</h5>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">{story.result}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <h5 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">The Takeaway</h5>
          <p className="text-foreground leading-relaxed font-serif italic text-lg border-l-2 border-primary pl-4">
            "{story.learning}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
