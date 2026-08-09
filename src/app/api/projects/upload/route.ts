import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/projects/upload
 * Body: FormData with key "file"
 *
 * Uploads an image to Cloudinary and returns both the secure_url and public_id
 * so the client can track the public_id for future deletion/replacement.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'devfolio',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            if (result) {
              resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          }
        )
        .end(buffer);
    });

    if (!uploadResult.secure_url) {
      return NextResponse.json({ message: 'Cloudinary upload failed' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Server Error during upload' }, { status: 500 });
  }
}
