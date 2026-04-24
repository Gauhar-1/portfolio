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
    <div className="bg-[#080808] min-h-screen relative">
      {!isAdminPage && <Header initialLinks={links || {}} />}
      
      {/* STAR ENGINEER FIX: 
        1. Removed 'flex flex-col' so GSAP's pin-spacer works flawlessly.
        2. Added 'overflow-x-hidden' to prevent horizontal scrollbars from 
           appearing during the GSAP wipe animations.
        3. Used a <main> tag for better semantic HTML.
      */}
      <main className="relative w-full overflow-x-hidden block">
        <HeroSection initialLinks={links || {}} />
        <SkillsSection />
        <ExperienceSection />
        <ProjectSpotlight /> 
        <ContactSection /> 
      </main>

      {!isAdminPage && <Footer initialLinks={links || {}} />}
    </div>
  );
}