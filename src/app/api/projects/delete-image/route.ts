import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/projects/delete-image
 * Body: { publicId: string }
 *
 * Deletes an image from Cloudinary by its public_id.
 */
export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json(
        { message: 'A valid publicId is required.' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json(
        { message: 'Image deleted successfully', result: result.result },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Cloudinary deletion failed', result },
      { status: 500 }
    );
  } catch (error) {
    console.error('Delete Image Error:', error);
    return NextResponse.json(
      { message: 'Server Error during image deletion' },
      { status: 500 }
    );
  }
}
