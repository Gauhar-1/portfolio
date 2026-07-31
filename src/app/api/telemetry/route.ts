import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { sessionId, event, score, action } = body;

    if (!sessionId) {
      return NextResponse.json({ message: 'Missing sessionId' }, { status: 400 });
    }

    const updateQuery: any = {
      $set: { lastActiveAt: new Date() }
    };

    // Legacy support (optional, can be removed if fully deprecated)
    if (score && action) {
      updateQuery.$inc = { intentScore: score };
      updateQuery.$push = { interactionLog: { action, timestamp: new Date() } };
    }

    // New Exact Telemetry
    if (event) {
      if (!updateQuery.$push) updateQuery.$push = {};
      updateQuery.$push.events = {
        ...event,
        timestamp: new Date()
      };
    }

    const session = await Session.findOneAndUpdate(
      { sessionId },
      updateQuery,
      { new: true }
    );

    if (!session) {
       // Graceful degradation: if session was deleted from DB but cookie remains, 
       // do not throw an error to the client, just ignore the telemetry ping.
       return NextResponse.json({ success: false, message: 'Session not found (ignored)' }, { status: 200 });
    }

    return NextResponse.json({ success: true, newScore: session.intentScore }, { status: 200 });
  } catch (error) {
    console.error('Telemetry scoring error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
