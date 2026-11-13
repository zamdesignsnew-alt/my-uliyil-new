import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contentEntries, mediaAssets } from '@/db/schema';
import { isAdmin } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const recent = new Map<string, number>();

const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_VIDEO = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']);

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().max(1200).optional(),
  locality: z.string().trim().max(160).optional(),
  videoUrl: z.string().url().startsWith('https://').max(1000).optional().or(z.literal('')),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Public gallery uploads are disabled. Only ward administrators can add gallery media.' },
        { status: 403 }
      );
    }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
    if (!admin && Date.now() - (recent.get(ip) || 0) < 30000) {
      return NextResponse.json({ error: 'Please wait a moment before uploading again.' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('media');
    const title = String(form.get('title') || '').trim();
    const body = String(form.get('body') || '').trim();
    const locality = String(form.get('locality') || '').trim();
    const videoUrl = String(form.get('videoUrl') || '').trim();
    const consent = form.get('consent') === 'on' || form.get('consent') === 'true' || admin;
    const website = String(form.get('website') || '');

    const parsed = schema.safeParse({ title, body, locality, videoUrl, consent, website });
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please provide a title and accept the permission checkbox.' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let url: string | null = parsed.data.videoUrl || null;
    let category = url ? 'Video' : 'Photo';

    if (file instanceof File && file.size > 0) {
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File must be under 4 MB for direct upload. For larger videos, paste a YouTube or Facebook video link.' },
          { status: 413 }
        );
      }

      const isImg = ALLOWED_IMAGE.has(file.type);
      const isVid = ALLOWED_VIDEO.has(file.type);
      if (!isImg && !isVid) {
        return NextResponse.json(
          { error: 'Unsupported format. Please upload JPG, PNG, WebP, MP4, WebM, or MOV.' },
          { status: 400 }
        );
      }

      const buf = Buffer.from(await file.arrayBuffer());
      const [media] = await db
        .insert(mediaAssets)
        .values({
          mimeType: file.type,
          fileName: file.name.slice(0, 255),
          sizeBytes: file.size,
          dataBase64: buf.toString('base64')
        })
        .returning({ id: mediaAssets.id });

      const mediaPath = `/api/media/${media.id}`;
      if (isVid) {
        url = mediaPath;
        category = 'Video';
      } else {
        imageUrl = mediaPath;
        category = 'Photo';
      }
    }

    if (!imageUrl && !url) {
      return NextResponse.json({ error: 'Please attach a photo/video file or paste a video link.' }, { status: 400 });
    }

    const [entry] = await db
      .insert(contentEntries)
      .values({
        type: 'gallery',
        title: parsed.data.title,
        body: parsed.data.body || null,
        locality: parsed.data.locality || null,
        category,
        imageUrl,
        url,
        status: admin && form.get('publishNow') === 'true' ? 'published' : 'draft',
        publishedAt: admin && form.get('publishNow') === 'true' ? new Date() : null
      })
      .returning({ id: contentEntries.id, status: contentEntries.status });

    if (!admin) recent.set(ip, Date.now());
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('Gallery POST error:', err);
    return NextResponse.json({ error: 'Unable to upload to gallery.' }, { status: 500 });
  }
}
