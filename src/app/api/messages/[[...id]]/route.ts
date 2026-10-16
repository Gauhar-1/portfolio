import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Session from '@/models/Session';
import { logAuditAction } from '@/lib/audit';

// ─── GET /api/messages ──────────────────────────────────────────────────────
export async function GET() {
  await dbConnect();
  try {
    const rawMessages = await Message.find({}).sort({ createdAt: -1 }).lean();

    // Enrich messages with session details if sessionId exists
    const sessionIds = rawMessages
      .map((m: any) => m.sessionId)
      .filter((s: any) => typeof s === 'string' && s.length > 0);

    const sessions = await Session.find({ sessionId: { $in: sessionIds } })
      .select('sessionId userAgent referrer pageviews clickedProjects inferredPersona')
      .populate('inferredPersona clickedProjects')
      .lean();

    const sessionMap = new Map<string, any>();
    sessions.forEach((sess: any) => {
      sessionMap.set(sess.sessionId, sess);
    });

    const messages = rawMessages.map((m: any) => ({
      ...m,
      sessionData: m.sessionId ? sessionMap.get(m.sessionId) : null,
    }));

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── POST /api/messages ─────────────────────────────────────────────────────
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
      { success: true, dispatchId: String(newMessage._id), message: newMessage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/messages/:id ────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const id = pathParts[pathParts.length - 1];

    const body = await req.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });
    }

    const updated = await Message.findByIdAndUpdate(
      id,
      { $set: { status: status || 'READ' } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating message status:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ─── DELETE /api/messages/:id ───────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'DELETE', entityType: 'Message', entityId: id });
    return NextResponse.json({ message: 'Message deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
