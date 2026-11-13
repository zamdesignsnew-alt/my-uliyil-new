import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';

export const dynamic = 'force-dynamic';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg'
]);

const MAX_BYTES = 4 * 1024 * 1024; // Safe under Vercel 4.5 MB limit

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Please select a file to upload.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File must be under 4 MB for direct upload. For larger videos, paste a YouTube or Facebook link.' },
        { status: 413 }
      );
    }

    const mime = file.type || 'application/octet-stream';
    if (!ALLOWED_MIMES.has(mime)) {
      return NextResponse.json(
        { error: 'Unsupported format. Use JPG, PNG, WebP, SVG, MP4, WebM, or MOV.' },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const [row] = await db
      .insert(mediaAssets)
      .values({
        mimeType: mime,
        fileName: file.name.slice(0, 255),
        sizeBytes: file.size,
        dataBase64: buf.toString('base64')
      })
      .returning({ id: mediaAssets.id });

    return NextResponse.json({ id: row.id, url: `/api/media/${row.id}`, mimeType: mime }, { status: 201 });
  } catch (err) {
    console.error('Media upload failed:', err);
    return NextResponse.json({ error: 'Failed to save uploaded media.' }, { status: 500 });
  }
}
