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

/**
 * Extracts the Cloudinary public_id from a secure_url.
 */
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

// GET all projects
export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({});
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST a new project
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newProject = await Project.create(body);
    await logAuditAction({ action: 'CREATE', entityType: 'Project', entityId: String(newProject._id), changes: body });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// PUT (update) a project
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'UPDATE', entityType: 'Project', entityId: String(updatedProject._id), changes: body });
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// DELETE a project — also cleans up Cloudinary images
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Clean up Cloudinary images before deleting the document
    const imageUrls = [project.imageUrl, project.diagramUrl].filter(Boolean) as string[];
    const deletePromises = imageUrls.map((url) => {
      const publicId = extractPublicId(url);
      if (publicId) {
        return cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch((err: unknown) => {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, err);
        });
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);

    await Project.findByIdAndDelete(id);
    await logAuditAction({ action: 'DELETE', entityType: 'Project', entityId: id });
    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
