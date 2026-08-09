import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, projectId, eventType, weight, metadata } = body;

    if (!sessionId || !projectId || !eventType || typeof weight !== 'number') {
      return NextResponse.json(
        { message: 'Missing required fields: sessionId, projectId, eventType, weight' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Build the event object
    const newEvent = {
      eventType,
      target: projectId,
      timestamp: new Date(),
    };

    // Update the session: increment intentScore and push the new event
    const updatedSession = await Session.findOneAndUpdate(
      { sessionId },
      {
        $inc: { intentScore: weight },
        $push: { events: newEvent },
        $set: { lastActiveAt: new Date() }
      },
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Intent telemetry logged successfully', intentScore: updatedSession.intentScore },
      { status: 200 }
    );
  } catch (error) {
    console.error('Intent Telemetry Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
