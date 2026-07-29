import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Webhook from '@/models/Webhook';
import { logAuditAction } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  try {
    if (id) {
      const webhook = await Webhook.findById(id);
      if (!webhook) return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
      return NextResponse.json(webhook, { status: 200 });
    }
    const webhooks = await Webhook.find({});
    return NextResponse.json(webhooks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newWebhook = await Webhook.create(body);
    await logAuditAction({ action: 'CREATE', entityType: 'Webhook', entityId: newWebhook._id as string, changes: body });
    return NextResponse.json(newWebhook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedWebhook = await Webhook.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedWebhook) {
      return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'UPDATE', entityType: 'Webhook', entityId: updatedWebhook._id as string, changes: body });
    return NextResponse.json(updatedWebhook, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id?: string[] } }) {
  await dbConnect();
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0];

  if (!id) {
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  try {
    const deletedWebhook = await Webhook.findByIdAndDelete(id);
    if (!deletedWebhook) {
      return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
    }
    await logAuditAction({ action: 'DELETE', entityType: 'Webhook', entityId: id });
    return NextResponse.json({ message: 'Webhook deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
