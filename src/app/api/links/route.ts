import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Links from '@/models/Links';

// GET the links
export async function GET() {
  await dbConnect();
  try {
    // There should only ever be one document in this collection
    const links = await Links.findOne({});
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST (update) the links
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    // Use findOneAndUpdate with upsert:true to create the document if it doesn't exist,
    // or update it if it does.
    const updatedLinks = await Links.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json(updatedLinks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
