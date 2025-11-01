import HeroSection from '@/components/hero-section';
import SkillsSection from '@/components/skills-section';
import ExperienceSection from '@/components/experience-section';
import ProjectSpotlight from '@/components/project-spotlight';
import ContactSection from '@/components/contact-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectSpotlight />
      <ContactSection />
    </div>
  );
}
