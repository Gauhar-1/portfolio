'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type PersonaInfo = {
  _id: string;
  name: string;
  theme: string;
  description?: string;
  sectionOrder?: string[];
};

interface PersonaContextType {
  activePersona: PersonaInfo | null;
  setPersona: (persona: PersonaInfo) => void;
  clearPersona: () => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [activePersona, setActivePersonaState] = useState<PersonaInfo | null>(null);

  useEffect(() => {
    // Hydrate from localStorage on mount
    const saved = localStorage.getItem('activePersona');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActivePersonaState(parsed);
        applyTheme(parsed.theme);
      } catch (e) {
        console.error("Failed to parse saved persona", e);
      }
    }
  }, []);

  const applyTheme = (themeName: string) => {
    const root = document.documentElement;
    // Remove existing theme classes
    root.classList.remove('theme-emerald', 'theme-slate', 'theme-indigo', 'theme-ocean');
    // Add the new theme class if it exists
    if (themeName && themeName !== 'default') {
      root.classList.add(`theme-${themeName}`);
    }
  };

  const setPersona = (persona: PersonaInfo) => {
    setActivePersonaState(persona);
    localStorage.setItem('activePersona', JSON.stringify(persona));
    applyTheme(persona.theme);
  };

  const clearPersona = () => {
    setActivePersonaState(null);
    localStorage.removeItem('activePersona');
    const root = document.documentElement;
    root.classList.remove('theme-emerald', 'theme-slate', 'theme-indigo', 'theme-ocean');
  };

  return (
    <PersonaContext.Provider value={{ activePersona, setPersona, clearPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
