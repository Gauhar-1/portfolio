import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
import '@/models/Persona';
import '@/models/Project';

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

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { sessionId, slug, companyName, role, userAgent } = body;

    if (!sessionId) {
      return NextResponse.json({ message: 'Session ID required' }, { status: 400 });
    }

    const newSession = await Session.create({
      sessionId,
      slug,
      companyName,
      role,
      userAgent: userAgent || 'Unknown',
      pageViews: [],
      clickedProjects: [],
      storyPings: [],
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
