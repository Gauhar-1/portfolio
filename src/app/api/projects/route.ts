import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { logAuditAction } from '@/lib/audit';

// ─── GET /api/projects ──────────────────────────────────────────────────────
export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
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
