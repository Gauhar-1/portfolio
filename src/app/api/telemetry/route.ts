import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { sessionId, score, action } = body;

    if (!sessionId || !score || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const session = await Session.findOneAndUpdate(
      { sessionId },
      { 
        $inc: { intentScore: score },
        $push: { 
          interactionLog: { action, timestamp: new Date() } 
        },
        $set: { lastActiveAt: new Date() }
      },
      { new: true }
    );

    if (!session) {
       return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, newScore: session.intentScore }, { status: 200 });
  } catch (error) {
    console.error('Telemetry scoring error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
