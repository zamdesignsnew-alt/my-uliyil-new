import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { mediaAssets, professionals } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const recent = new Map<string, number>();

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  nameMl: z.string().trim().max(160).optional(),
  profession: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(100),
  qualification: z.string().trim().max(200).optional(),
  locality: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  bio: z.string().trim().min(10).max(1500),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(professionals)
      .where(eq(professionals.status, 'approved'))
      .orderBy(desc(professionals.createdAt))
      .limit(100);
    return NextResponse.json(rows);
  } catch (err) {
    console.warn('Professionals GET error:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
    if (Date.now() - (recent.get(ip) || 0) < 30000) {
      return NextResponse.json({ error: 'Please wait a moment before submitting again.' }, { status: 429 });
    }

    const isMultipart = req.headers.get('content-type')?.includes('multipart/form-data');
    const form = isMultipart ? await req.formData() : null;
    const raw = form ? Object.fromEntries(form.entries()) : await req.json();
    const input = {
      ...raw,
      consent: raw.consent === true || raw.consent === 'on'
    };
    delete input.photo;

    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please fill in all required fields and accept consent.' }, { status: 400 });
    }
    const d = parsed.data;

    let photoUrl: string | null = typeof raw.photoUrl === 'string' && raw.photoUrl.startsWith('https://')
      ? raw.photoUrl.slice(0, 1000)
      : null;

    const photo = form?.get('photo');
    if (photo instanceof File && photo.size > 0) {
      if (photo.size > 3 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)) {
        return NextResponse.json({ error: 'Please use a JPG, PNG, or WebP photo smaller than 3 MB.' }, { status: 400 });
      }
      const buf = Buffer.from(await photo.arrayBuffer());
      const [media] = await db
        .insert(mediaAssets)
        .values({
          mimeType: photo.type,
          fileName: photo.name.slice(0, 255),
          sizeBytes: photo.size,
          dataBase64: buf.toString('base64')
        })
        .returning({ id: mediaAssets.id });
      photoUrl = `/api/media/${media.id}`;
    }

    const [row] = await db
      .insert(professionals)
      .values({
        name: d.name,
        nameMl: d.nameMl || null,
        profession: d.profession,
        category: d.category,
        qualification: d.qualification || null,
        locality: d.locality,
        phone: d.phone?.replace(/[^\d+]/g, '') || null,
        whatsapp: d.whatsapp?.replace(/[^\d+]/g, '') || null,
        email: d.email || null,
        bio: d.bio,
        photoUrl,
        status: 'pending'
      })
      .returning({ id: professionals.id });

    recent.set(ip, Date.now());
    return NextResponse.json({ id: row.id, status: 'Pending Review' }, { status: 201 });
  } catch (err) {
    console.error('Professionals POST error:', err);
    return NextResponse.json({ error: 'Unable to submit profile. Please try again.' }, { status: 500 });
  }
}
