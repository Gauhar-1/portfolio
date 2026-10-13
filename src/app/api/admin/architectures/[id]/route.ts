import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Architecture from '@/models/Architecture';
import { architectureSchema } from '@/validations/architectureSchema';

// ─── Helper: Find by _id or slug ────────────────────────────────────────────

async function findArchitecture(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return await Architecture.findById(idOrSlug);
  }
  return await Architecture.findOne({ slug: idOrSlug });
}

// ─── GET /api/admin/architectures/[id] ───────────────────────────────────────
// Fetch single full document for editing

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const architecture = await findArchitecture(id);
    if (!architecture) {
      return NextResponse.json(
        { error: 'Architecture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(architecture, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching architecture:', error);
    return NextResponse.json(
      { error: 'Failed to fetch architecture', details: error.message },
      { status: 500 }
    );
  }
}

// ─── PUT /api/admin/architectures/[id] ───────────────────────────────────────
// Update existing architecture document with Zod validation

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
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

    const architecture = await findArchitecture(id);
    if (!architecture) {
      return NextResponse.json(
        { error: 'Architecture not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness against other records
    const { slug } = validationResult.data;
    const slugCollision = await Architecture.findOne({
      slug,
      _id: { $ne: architecture._id },
    });
    if (slugCollision) {
      return NextResponse.json(
        { error: `Another architecture already uses the slug "${slug}".` },
        { status: 409 }
      );
    }

    const updated = await Architecture.findByIdAndUpdate(
      architecture._id,
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Error updating architecture:', error);
    return NextResponse.json(
      { error: 'Failed to update architecture', details: error.message },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/architectures/[id] ────────────────────────────────────
// Delete an existing architecture document

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const architecture = await findArchitecture(id);
    if (!architecture) {
      return NextResponse.json(
        { error: 'Architecture not found' },
        { status: 404 }
      );
    }

    await Architecture.findByIdAndDelete(architecture._id);

    return NextResponse.json(
      { message: 'Architecture deleted successfully', id: architecture._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting architecture:', error);
    return NextResponse.json(
      { error: 'Failed to delete architecture', details: error.message },
      { status: 500 }
    );
  }
}
