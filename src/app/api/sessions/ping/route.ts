import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { sessionId, storyTheme, duration } = body;

    if (!sessionId || !storyTheme) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the session and append the ping
    const session = await Session.findOneAndUpdate(
      { sessionId },
      { 
        $push: { 
          storyPings: { 
            storyTheme, 
            duration: duration || 5, 
            timestamp: new Date() 
          } 
        },
        $set: { lastActiveAt: new Date() }
      },
      { new: true }
    );

    if (!session) {
       return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Telemetry ping error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
