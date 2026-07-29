import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export async function GET() {
  await dbConnect();
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
