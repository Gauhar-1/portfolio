import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Changelog from '@/models/Changelog';
import { logAuditAction } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  try {
    if (id) {
      const changelog = await Changelog.findById(id).populate('relatedProjects relatedSkills');
      if (!changelog) return NextResponse.json({ message: 'Changelog not found' }, { status: 404 });
      return NextResponse.json(changelog, { status: 200 });
    }
    const changelogs = await Changelog.find({}).sort({ publishDate: -1 });
    return NextResponse.json(changelogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newChangelog = await Changelog.create(body);
    await logAuditAction({ action: 'CREATE', entityType: 'Changelog', entityId: newChangelog._id as string, changes: body });
    return NextResponse.json(newChangelog, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedChangelog = await Changelog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedChangelog) {
      return NextResponse.json({ message: 'Changelog not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'UPDATE', entityType: 'Changelog', entityId: updatedChangelog._id as string, changes: body });
    return NextResponse.json(updatedChangelog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const deletedChangelog = await Changelog.findByIdAndDelete(id);
    if (!deletedChangelog) {
      return NextResponse.json({ message: 'Changelog not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'DELETE', entityType: 'Changelog', entityId: id });
    return NextResponse.json({ message: 'Changelog deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
