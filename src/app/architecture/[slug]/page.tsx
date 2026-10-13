import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Architecture from "@/models/Architecture";
import { architecturesData, type ArchitectureCaseStudy } from "@/data/architectures";
import HeroHUD from "./components/HeroHUD";
import BentoGrid from "./components/BentoGrid";
import RoadmapTimeline from "./components/RoadmapTimeline";

export const dynamic = "force-dynamic";

// ─── Data Access: MongoDB First with Static Dictionary Fallback ────────────

async function getArchitectureCaseStudy(slug: string): Promise<ArchitectureCaseStudy | null> {
  try {
    await dbConnect();
    const doc = await Architecture.findOne({ slug }).lean();
    if (doc) {
      return {
        slug: doc.slug,
        name: doc.name,
        theme: {
          primaryHex: doc.theme?.primaryHex || "#d6e9e3ff",
          backgroundHex: doc.theme?.backgroundHex || "#0a0a0c",
          textHex: doc.theme?.textHex || "#f8fafc",
        },
        hero: {
          title: doc.hero?.title || "",
          subtitle: doc.hero?.subtitle || "",
          metrics: (doc.hero?.metrics || []).map((m: any) => ({
            title: m.title,
            value: m.value,
            ariaLabel: m.ariaLabel || `${m.title}: ${m.value}`,
          })),
        },
        challenges: (doc.challenges || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          teaser: c.teaser,
          problem: c.problem,
          solution: c.solution,
          impact: c.impact,
          visualKey: c.visualKey,
        })),
        roadmap: (doc.roadmap || []).map((r: any, idx: number) => ({
          id: `roadmap-${idx}`,
          label: r.phase || `Phase ${idx + 1}`,
          title: r.title,
          description: r.description,
        })),
      };
    }
  } catch (error) {
    console.warn(`[getArchitectureCaseStudy] MongoDB fetch for "${slug}" failed, falling back to static data:`, error);
  }

  // Fallback to static dictionary
  return architecturesData[slug] || null;
}

// ─── Static Generation Params ───────────────────────────────────────────────

export async function generateStaticParams() {
  const staticSlugs = Object.keys(architecturesData);
  try {
    await dbConnect();
    const docs = await Architecture.find({}, { slug: 1 }).lean();
    const dbSlugs = docs.map((d: any) => d.slug);
    const allSlugs = Array.from(new Set([...staticSlugs, ...dbSlugs]));
    return allSlugs.map((slug) => ({ slug }));
  } catch {
    return staticSlugs.map((slug) => ({ slug }));
  }
}

// ─── Dynamic Metadata ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArchitectureCaseStudy(slug);

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
  const data = await getArchitectureCaseStudy(slug);

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
