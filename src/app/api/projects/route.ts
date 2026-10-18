import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Architecture from '@/models/Architecture';
import { logAuditAction } from '@/lib/audit';

import { architecturesData } from '@/data/architectures';

// ─── GET /api/projects ──────────────────────────────────────────────────────
export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch all Project documents sorted by featuredOrder: 1, createdAt: -1
    const rawProjects = await Project.find({})
      .sort({ featuredOrder: 1, createdAt: -1 })
      .lean();

    // 2. Normalize each project's lookup slug:
    const lookupSlugs = rawProjects.map((p: any) =>
      (p.slug || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    );

    // 3. Batch-query the Architecture collection:
    const architectures = await Architecture.find({ slug: { $in: lookupSlugs } })
      .select('slug theme hero.metrics challenges.title')
      .lean();

    const archMap = new Map<string, any>();
    architectures.forEach((arch: any) => {
      if (arch.slug) {
        archMap.set(arch.slug.toLowerCase(), arch);
      }
    });

    // Fallback to static architecturesData if missing from MongoDB
    Object.entries(architecturesData).forEach(([slug, data]) => {
      if (!archMap.has(slug.toLowerCase())) {
        archMap.set(slug.toLowerCase(), {
          slug: data.slug,
          theme: data.theme,
          hero: data.hero,
          challenges: data.challenges,
        });
      }
    });

    // 4. Merge the borrowed fields into each returned Project object
    const enrichedProjects = rawProjects.map((p: any) => {
      const lookupSlug = (p.slug || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedArch = archMap.get(lookupSlug);

      return {
        ...p,
        slug: lookupSlug,
        category: p.category || 'AI_RAG',
        featuredOrder: typeof p.featuredOrder === 'number' ? p.featuredOrder : 99,
        hasArchitecture: Boolean(matchedArch),
        theme: matchedArch?.theme || {
          primaryHex: '#8B5CF6',
          backgroundHex: '#09090d',
          textHex: '#F8FAFC',
        },
        borrowedMetrics: matchedArch?.hero?.metrics?.slice(0, 3) || [],
        borrowedChallenges: matchedArch?.challenges?.map((c: any) => c.title) || [],
      };
    });

    return NextResponse.json(enrichedProjects, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── POST /api/projects ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    } else if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const newProject = await Project.create(body);
    await logAuditAction({
      action: 'CREATE',
      entityType: 'Project',
      entityId: String(newProject._id),
      changes: body,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
