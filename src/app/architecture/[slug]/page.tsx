import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { architecturesData } from "@/data/architectures";
import HeroHUD from "./components/HeroHUD";
import BentoGrid from "./components/BentoGrid";
import RoadmapTimeline from "./components/RoadmapTimeline";

// ─── Static Generation Params (Open/Closed) ────────────────────────────────

export function generateStaticParams() {
  return Object.keys(architecturesData).map((slug) => ({ slug }));
}

// ─── Dynamic Metadata ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = architecturesData[slug];

  if (!data) {
    return {
      title: "Architecture Case Study Not Found",
    };
  }

  return {
    title: `${data.name} Architecture Deep Dive | Engineering Case Study`,
    description: data.hero.subtitle,
    openGraph: {
      title: `${data.name} Architecture Case Study`,
      description: data.hero.subtitle,
      type: "article",
    },
  };
}

// ─── Dynamic Master UI Template Page ────────────────────────────────────────

export default async function ArchitectureCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = architecturesData[slug];

  if (!data) {
    notFound();
  }

  // Dynamic JSON-LD structured data for AI search engines & SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: data.hero.title,
    description: data.hero.subtitle,
    author: {
      "@type": "Person",
      name: "MD Gohar Khan",
    },
    proficiencyLevel: "Expert",
    articleSection: "Software Architecture Case Study",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        className="relative min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300 selection:bg-[var(--theme-primary)]/20"
        style={
          {
            "--theme-primary": data.theme.primaryHex,
            "--theme-bg": data.theme.backgroundHex,
            "--theme-text": data.theme.textHex,
          } as React.CSSProperties
        }
      >
        {/* ── Screen-covering subtle SVG noise/grain texture with physical blend ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">
          <HeroHUD hero={data.hero} name={data.name} />

          {/* Dynamic theme divider */}
          <div className="mx-6 border-t border-[var(--theme-text)]/10 md:mx-12 lg:mx-24" />

          <BentoGrid challenges={data.challenges} />

          {/* Dynamic theme divider */}
          <div className="mx-6 border-t border-[var(--theme-text)]/10 md:mx-12 lg:mx-24" />

          <RoadmapTimeline roadmap={data.roadmap} />

          <div className="h-20" />
        </div>
      </article>
    </>
  );
}
