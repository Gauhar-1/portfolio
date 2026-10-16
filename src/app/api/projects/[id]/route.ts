import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { logAuditAction } from '@/lib/audit';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1].replace(/^v\d+\//, '');
    return afterUpload.replace(/\.[^/.]+$/, '') || null;
  } catch {
    return null;
  }
}

// ─── GET /api/projects/:id ──────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── PUT /api/projects/:id ──────────────────────────────────────────────────
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
    if (body.title && !body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    } else if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    await logAuditAction({
      action: 'UPDATE',
      entityType: 'Project',
      entityId: String(updatedProject._id),
      changes: body,
    });
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/projects/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────
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
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.image) {
      const publicId = extractPublicId(project.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Project.findByIdAndDelete(id);
    await logAuditAction({ action: 'DELETE', entityType: 'Project', entityId: id });
    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/projects/:id:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
