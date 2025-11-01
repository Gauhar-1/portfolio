import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Skill from '@/models/Skill';

// GET all skills
export async function GET() {
  await dbConnect();
  try {
    const skills = await Skill.find({});
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST a new skill
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newSkill = await Skill.create(body);
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// PUT (update) a skill
export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    const last_segment = req.url.split('/').pop();
    const query_param_id = last_segment ? last_segment : null;
    if (!query_param_id) {
        return NextResponse.json({ message: 'ID not found' }, { status: 400 });
    }
  }

  const idToUse = id ? id : req.url.split('/').pop();


  try {
    const body = await req.json();
    const updatedSkill = await Skill.findByIdAndUpdate(idToUse, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSkill) {
      return NextResponse.json({ message: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(updatedSkill, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// DELETE a skill
export async function DELETE(req: NextRequest) {
  await dbConnect();
   const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    const last_segment = req.url.split('/').pop();
    const query_param_id = last_segment ? last_segment : null;
    if (!query_param_id) {
        return NextResponse.json({ message: 'ID not found' }, { status: 400 });
    }
  }

  const idToUse = id ? id : req.url.split('/').pop();

  try {
    const deletedSkill = await Skill.findByIdAndDelete(idToUse);
    if (!deletedSkill) {
      return NextResponse.json({ message: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Skill deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
