import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroConfig from '@/models/HeroConfig';
import Architecture from '@/models/Architecture';
import Links from '@/models/Links';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    let heroConfig = await HeroConfig.findOne({});
    if (!heroConfig) {
      heroConfig = await HeroConfig.create({});
    }

    const architectures = await Architecture.find({}, { name: 1, slug: 1, theme: 1 })
      .sort({ createdAt: -1 })
      .lean();

    const links = await Links.findOne({}).lean();

    return NextResponse.json(
      {
        heroConfig,
        architectures,
        links: links || {},
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[GET /api/admin/hero] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin hero data', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { heroConfigData, linksData } = body;

    // 1. Update HeroConfig singleton
    const updatedHeroConfig = await HeroConfig.findOneAndUpdate(
      {},
      heroConfigData,
      { new: true, upsert: true, runValidators: true }
    );

    // 2. Optionally update Links if provided
    let updatedLinks = null;
    if (linksData) {
      updatedLinks = await Links.findOneAndUpdate({}, linksData, {
        new: true,
        upsert: true,
        runValidators: true,
      });
    }

    return NextResponse.json(
      {
        heroConfig: updatedHeroConfig,
        links: updatedLinks,
        message: 'Hero configuration updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PUT /api/admin/hero] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save hero configuration', details: error.message },
      { status: 500 }
    );
  }
}
