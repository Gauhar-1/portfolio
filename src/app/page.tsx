'use client';

import HeroSection from '@/components/hero-section';
import SkillsSection from '@/components/skills-section';
import ExperienceSection from '@/components/experience-section';
import ProjectSpotlight from '@/components/project-spotlight';
import ContactSection from '@/components/contact-section';
import Header from '@/components/header';
import { usePathname } from 'next/navigation';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import Loader from '@/components/liquidLoader';

export default function Home() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  
  const [loading, setLoading] = useState(true); 
  const [links, setLinks] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        setLinks(data);
        
        setTimeout(() => {
          setLoading(false);
        }, 3500); 

      } catch (error) {
        console.error("Critical boot error:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <div className='h-screen w-screen flex justify-center items-center bg-[#080808]'>
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#080808]">
      {!isAdminPage && <Header initialLinks={links || {}} />}
      <div className="flex flex-col">
        <HeroSection initialLinks={links || {}} />
        <SkillsSection />
        <ExperienceSection />
        <ProjectSpotlight />
        <ContactSection />
      </div>
      {!isAdminPage && <Footer initialLinks={links || {}} />}
    </div>
  );
}
