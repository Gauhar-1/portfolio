import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Experience from '@/models/Experience';

// GET all experiences
export async function GET() {
  await dbConnect();
  try {
    const experiences = await Experience.find({}).sort({ date: -1 }); // Sorting can be adjusted
    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST a new experience
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newExperience = await Experience.create(body);
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// PUT (update) an experience
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedExperience = await Experience.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedExperience) {
      return NextResponse.json({ message: 'Experience not found' }, { status: 404 });
    }
    return NextResponse.json(updatedExperience, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// DELETE an experience
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
    return NextResponse.json({ message: 'Experience deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
