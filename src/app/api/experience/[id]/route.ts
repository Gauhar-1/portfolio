import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { logAuditAction } from '@/lib/audit';

// ─── GET /api/experience/:id ────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const experience = await Experience.findById(id).lean();
    if (!experience) {
      return NextResponse.json({ message: 'Experience not found' }, { status: 404 });
    }
    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/experience/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── PUT /api/experience/:id ────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

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
    console.error('Error in PUT /api/experience/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── DELETE /api/experience/:id ─────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

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
    console.error('Error in DELETE /api/experience/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
