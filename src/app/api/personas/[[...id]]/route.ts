import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Persona from '@/models/Persona';
import { logAuditAction } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  
  // Await the params object before accessing its properties (Next.js 15+ async route params)
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  try {
    if (id) {
      const persona = await Persona.findById(id);
      if (!persona) return NextResponse.json({ message: 'Persona not found' }, { status: 404 });
      return NextResponse.json(persona, { status: 200 });
    }
    const personas = await Persona.find({});
    return NextResponse.json(personas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newPersona = await Persona.create(body);
    await logAuditAction({ action: 'CREATE', entityType: 'Persona', entityId: String(newPersona._id), changes: body });
    return NextResponse.json(newPersona, { status: 201 });
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
    const updatedPersona = await Persona.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPersona) {
      return NextResponse.json({ message: 'Persona not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'UPDATE', entityType: 'Persona', entityId: String(updatedPersona._id), changes: body });
    return NextResponse.json(updatedPersona, { status: 200 });
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
    const deletedPersona = await Persona.findByIdAndDelete(id);
    if (!deletedPersona) {
      return NextResponse.json({ message: 'Persona not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'DELETE', entityType: 'Persona', entityId: id });
    return NextResponse.json({ message: 'Persona deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
