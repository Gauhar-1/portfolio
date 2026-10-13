import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Architecture from '@/models/Architecture';
import { architectureSchema } from '@/validations/architectureSchema';

// ─── GET /api/admin/architectures ───────────────────────────────────────────
// List all architectures projecting only summary fields for the table list

export async function GET() {
  try {
    await dbConnect();
    const architectures = await Architecture.find(
      {},
      { _id: 1, name: 1, slug: 1, theme: 1, createdAt: 1, updatedAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(architectures, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching architectures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch architectures', details: error.message },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/architectures ──────────────────────────────────────────
// Validate payload via Zod, verify unique slug, save to MongoDB

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const validationResult = architectureSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { slug } = validationResult.data;
    const existing = await Architecture.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `An architecture with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const newArchitecture = await Architecture.create(validationResult.data);

    return NextResponse.json(newArchitecture, { status: 201 });
  } catch (error: any) {
    console.error('Error creating architecture:', error);
    return NextResponse.json(
      { error: 'Failed to create architecture', details: error.message },
      { status: 500 }
    );
  }
}
