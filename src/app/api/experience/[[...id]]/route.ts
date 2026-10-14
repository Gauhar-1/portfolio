import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Experience from '@/models/Experience';
import Architecture from '@/models/Architecture';
import { logAuditAction } from '@/lib/audit';

// ─── GET /api/experience ────────────────────────────────────────────────────
// Returns all experiences enriched with borrowed Architecture data matched by slug
export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch all Experience documents lean
    const rawExperiences = await Experience.find({}).sort({ date: -1 }).lean();

    // 2. Normalize each experience's lookup slug
    const lookupSlugs = rawExperiences.map((xp: any) =>
      (xp.slug || xp.company || '').toLowerCase().replace(/\s+/g, '')
    );

    // 3. Batch query Architecture collection for matching slugs
    const matchingArchitectures = await Architecture.find({
      slug: { $in: lookupSlugs },
    })
      .select('slug theme hero.metrics challenges.title')
      .lean();

    const archMap = new Map<string, any>();
    for (const arch of matchingArchitectures) {
      if (arch.slug) {
        archMap.set(arch.slug.toLowerCase().replace(/\s+/g, ''), arch);
      }
    }

    // 4. Merge borrowed data into each returned Experience DTO
    const experiences = rawExperiences.map((xp: any) => {
      const lookupSlug = (xp.slug || xp.company || '').toLowerCase().replace(/\s+/g, '');
      const matchedArch = archMap.get(lookupSlug);

      return {
        ...xp,
        _id: String(xp._id),
        slug: lookupSlug,
        hasArchitecture: Boolean(matchedArch),
        theme: matchedArch?.theme || {
          primaryHex: '#10B981',
          backgroundHex: '#0a0a0c',
          textHex: '#ffffff',
        },
        borrowedMetrics: matchedArch?.hero?.metrics?.slice(0, 3) || [],
        borrowedChallenges: matchedArch?.challenges?.map((c: any) => c.title) || [],
      };
    });

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/experience:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── POST /api/experience ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();

    if (!body.slug && body.company) {
      body.slug = body.company.toLowerCase().replace(/\s+/g, '');
    } else if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/\s+/g, '');
    }

    const newExperience = await Experience.create(body);
    await logAuditAction({
      action: 'CREATE',
      entityType: 'Experience',
      entityId: String(newExperience._id),
      changes: body,
    });
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/experience:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── PUT /api/experience/:id ────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const body = await req.json();

    if (!body.slug && body.company) {
      body.slug = body.company.toLowerCase().replace(/\s+/g, '');
    } else if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/\s+/g, '');
    }

    const updatedExperience = await Experience.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedExperience) {
      return NextResponse.json({ message: 'Experience not found' }, { status: 404 });
    }
    await logAuditAction({
      action: 'UPDATE',
      entityType: 'Experience',
      entityId: String(updatedExperience._id),
      changes: body,
    });
    return NextResponse.json(updatedExperience, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/experience:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── DELETE /api/experience/:id ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const deletedExperience = await Experience.findByIdAndDelete(id);
    if (!deletedExperience) {
      return NextResponse.json({ message: 'Experience not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'DELETE', entityType: 'Experience', entityId: id });
    return NextResponse.json({ message: 'Experience deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/experience:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
