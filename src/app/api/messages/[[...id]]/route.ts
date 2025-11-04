
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

// GET all messages
export async function GET() {
  await dbConnect();
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST a new message
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newMessage = await Message.create(body);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// DELETE a message
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.url.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Message deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
