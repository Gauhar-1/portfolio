import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function GET() {
  await dbConnect();
  try {
    const sessions = await Session.find({})
      .populate('inferredPersona clickedProjects')
      .sort({ lastActiveAt: -1 })
      .limit(100);
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
