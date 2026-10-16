import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Session from '@/models/Session';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, companyOrRole, intent, rating, message, sessionId } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      companyOrRole: companyOrRole ? String(companyOrRole).trim() : '',
      intent: intent || 'INTERVIEW_REQUEST',
      rating: typeof rating === 'number' ? rating : undefined,
      message: message.trim(),
      status: 'UNREAD',
      sessionId: sessionId ? String(sessionId) : undefined,
    });

    // If sessionId is present, log a high-value conversion event (+50 score)
    if (sessionId) {
      try {
        await Session.findOneAndUpdate(
          { sessionId: String(sessionId) },
          {
            $inc: { intentScore: 50 },
            $push: {
              interactionLog: {
                action: `Submitted Contact Dispatch: ${intent || 'INTERVIEW_REQUEST'}`,
                timestamp: new Date(),
              },
              events: {
                eventType: 'CONTACT_INITIATED',
                target: intent || 'INTERVIEW_REQUEST',
                timestamp: new Date(),
              },
            },
            $set: { lastActiveAt: new Date() },
          }
        );
      } catch (telemetryErr) {
        console.error('Failed to log contact conversion telemetry:', telemetryErr);
      }
    }

    return NextResponse.json(
      { success: true, dispatchId: String(newMessage._id) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
