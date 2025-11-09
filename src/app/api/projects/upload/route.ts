import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get('projectPhoto') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "devfolio",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        ).end(buffer);
    });

    const secureUrl = (uploadResult as any).secure_url;

    if (!secureUrl) {
      return NextResponse.json({ message: 'Cloudinary upload failed' }, { status: 500 });
    }

    // Save URL to database
    return NextResponse.json({ message: 'Image uploaded successfully', url: secureUrl}, { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Server Error during upload' }, { status: 500 });
  }
}
