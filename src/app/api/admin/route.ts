import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, makeSession, validPassword } from '@/lib/auth';
import { db } from '@/db';
import {
  listings,
  requests,
  contentEntries,
  professionals,
  formerCouncillors,
  nearestPlaces
} from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const failedLogins = new Map<string, { count: number; until: number }>();

const safeMediaOrUrl = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (v) => v === '' || v.startsWith('https://') || /^\/api\/media\/[a-f0-9-]{36}$/.test(v) || v.startsWith('/images/'),
    'Must be an https:// URL or uploaded media path'
  )
  .optional()
  .or(z.literal(''));

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (body.action === 'login') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
    const attempt = failedLogins.get(ip);
    if (attempt && attempt.count >= 5 && attempt.until > Date.now()) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    if (!validPassword(String(body.password || ''))) {
      failedLogins.set(ip, {
        count: (attempt?.until && attempt.until > Date.now() ? attempt.count : 0) + 1,
        until: Date.now() + 15 * 60 * 1000
      });
      return NextResponse.json({ error: 'Invalid credentials or admin access not configured.' }, { status: 401 });
    }
    failedLogins.delete(ip);
    const response = NextResponse.json({ ok: true });
    response.cookies.set('uliyil_admin', makeSession(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 604800
    });
    return response;
  }

  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (body.action === 'logout') {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete('uliyil_admin');
    return response;
  }

  const shape = z.object({
    action: z.enum([
      'listing',
      'create-listing',
      'edit-listing',
      'request',
      'content',
      'create-content',
      'edit-content',
      'delete-content',
      'professional',
      'create-professional',
      'edit-professional',
      'delete-professional',
      'create-former-councillor',
      'edit-former-councillor',
      'delete-former-councillor',
      'nearest',
      'create-nearest',
      'edit-nearest',
      'delete-nearest'
    ]),
    id: z.string().uuid().optional(),
    status: z.string().max(30).optional(),
    name: z.string().trim().min(1).max(160).optional(),
    nameMl: z.string().trim().max(160).optional(),
    phone: z.string().trim().max(25).optional(),
    whatsapp: z.string().trim().max(25).optional(),
    email: z.string().trim().max(255).optional(),
    description: z.string().trim().max(3000).optional(),
    availability: z.string().trim().max(160).optional(),
    listingType: z.enum(['business', 'individual', 'institution']).optional(),
    title: z.string().trim().min(2).max(200).optional(),
    type: z.enum(['announcement', 'project', 'gallery', 'institution', 'organisation', 'service', 'meeting', 'history']).optional(),
    body: z.string().max(15000).optional(),
    category: z.string().max(100).optional(),
    locality: z.string().max(160).optional(),
    url: safeMediaOrUrl,
    imageUrl: safeMediaOrUrl,
    photoUrl: safeMediaOrUrl,
    logoUrl: safeMediaOrUrl,
    mapUrl: safeMediaOrUrl,
    websiteUrl: safeMediaOrUrl,
    profession: z.string().trim().max(160).optional(),
    qualification: z.string().trim().max(200).optional(),
    bio: z.string().trim().max(1500).optional(),
    yearSpan: z.string().trim().max(60).optional(),
    note: z.string().trim().max(500).optional(),
    sortOrder: z.coerce.number().int().min(0).max(100).optional(),
    town: z.string().trim().max(100).optional(),
    distanceNote: z.string().trim().max(160).optional(),
    publishNow: z.boolean().optional()
  });

  const parsed = shape.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
  }
  const d = parsed.data;

  // Listings
  if (d.action === 'listing' && d.id && ['approved', 'rejected', 'pending', 'removed'].includes(d.status || '')) {
    await db
      .update(listings)
      .set({ status: d.status, verified: d.status === 'approved', updatedAt: new Date() })
      .where(eq(listings.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'create-listing' && d.name && d.phone && d.description) {
    await db.insert(listings).values({
      type: d.listingType || 'business',
      name: d.name,
      phone: d.phone.replace(/[^\d+]/g, ''),
      whatsapp: d.whatsapp ? d.whatsapp.replace(/[^\d+]/g, '') || null : null,
      category: d.category || 'Other local businesses',
      locality: d.locality || 'Uliyil',
      availability: d.availability || null,
      description: d.description,
      imageUrl: d.imageUrl || null,
      mapUrl: d.mapUrl || null,
      status: 'approved',
      verified: true,
      consent: true
    });
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'edit-listing' && d.id && d.name && d.phone && d.description) {
    await db
      .update(listings)
      .set({ name: d.name, phone: d.phone.replace(/[^\d+]/g, ''), description: d.description, updatedAt: new Date() })
      .where(eq(listings.id, d.id));
    return NextResponse.json({ ok: true });
  }

  // Requests
  if (d.action === 'request' && d.id && ['received', 'reviewing', 'resolved', 'closed', 'approved', 'rejected'].includes(d.status || '')) {
    await db.update(requests).set({ status: d.status, updatedAt: new Date() }).where(eq(requests.id, d.id));
    return NextResponse.json({ ok: true });
  }

  // Content Entries (Announcements, Projects, Gallery, History, Institutions, etc.)
  if (d.action === 'content' && d.id && ['published', 'draft', 'archived'].includes(d.status || '')) {
    await db
      .update(contentEntries)
      .set({ status: d.status, publishedAt: d.status === 'published' ? new Date() : undefined })
      .where(eq(contentEntries.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'create-content' && d.title && d.type) {
    await db.insert(contentEntries).values({
      title: d.title,
      type: d.type,
      body: d.body || null,
      category: d.category || null,
      locality: d.locality || null,
      url: d.url || null,
      imageUrl: d.imageUrl || null,
      status: d.publishNow ? 'published' : 'draft',
      publishedAt: d.publishNow ? new Date() : null
    });
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'edit-content' && d.id && d.title) {
    const [existing] = await db
      .select({ publishedAt: contentEntries.publishedAt })
      .from(contentEntries)
      .where(eq(contentEntries.id, d.id))
      .limit(1);
    const nextStatus = d.status && ['published', 'draft', 'archived'].includes(d.status) ? d.status : undefined;
    await db
      .update(contentEntries)
      .set({
        ...(d.type ? { type: d.type } : {}),
        title: d.title,
        ...(d.body !== undefined ? { body: d.body || null } : {}),
        ...(d.category !== undefined ? { category: d.category || null } : {}),
        ...(d.locality !== undefined ? { locality: d.locality || null } : {}),
        ...(d.url !== undefined ? { url: d.url || null } : {}),
        ...(d.imageUrl !== undefined ? { imageUrl: d.imageUrl || null } : {}),
        ...(nextStatus
          ? {
              status: nextStatus,
              publishedAt: nextStatus === 'published' ? existing?.publishedAt || new Date() : existing?.publishedAt ?? null
            }
          : {})
      })
      .where(eq(contentEntries.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'delete-content' && d.id) {
    await db.delete(contentEntries).where(eq(contentEntries.id, d.id));
    return NextResponse.json({ ok: true });
  }

  // Professionals
  if (d.action === 'professional' && d.id && ['approved', 'pending', 'rejected'].includes(d.status || '')) {
    await db.update(professionals).set({ status: d.status }).where(eq(professionals.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'create-professional' && d.name && d.profession && d.bio) {
    await db.insert(professionals).values({
      name: d.name,
      nameMl: d.nameMl || null,
      profession: d.profession,
      category: d.category || 'Other',
      qualification: d.qualification || null,
      locality: d.locality || 'Uliyil',
      phone: d.phone?.replace(/[^\d+]/g, '') || null,
      whatsapp: d.whatsapp?.replace(/[^\d+]/g, '') || null,
      email: d.email || null,
      bio: d.bio,
      photoUrl: d.photoUrl || null,
      status: 'approved'
    });
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'edit-professional' && d.id && d.name && d.profession && d.bio) {
    await db
      .update(professionals)
      .set({
        name: d.name,
        ...(d.nameMl !== undefined ? { nameMl: d.nameMl || null } : {}),
        profession: d.profession,
        ...(d.category ? { category: d.category } : {}),
        ...(d.qualification !== undefined ? { qualification: d.qualification || null } : {}),
        ...(d.locality ? { locality: d.locality } : {}),
        ...(d.phone !== undefined ? { phone: d.phone?.replace(/[^\d+]/g, '') || null } : {}),
        ...(d.whatsapp !== undefined ? { whatsapp: d.whatsapp?.replace(/[^\d+]/g, '') || null } : {}),
        ...(d.email !== undefined ? { email: d.email || null } : {}),
        bio: d.bio,
        ...(d.photoUrl !== undefined ? { photoUrl: d.photoUrl || null } : {}),
        ...(d.status && ['approved', 'pending', 'rejected'].includes(d.status) ? { status: d.status } : {})
      })
      .where(eq(professionals.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'delete-professional' && d.id) {
    await db.delete(professionals).where(eq(professionals.id, d.id));
    return NextResponse.json({ ok: true });
  }

  // Former Councillors (Max 8)
  if (d.action === 'create-former-councillor' && d.name && d.yearSpan) {
    const existing = await db.select({ id: formerCouncillors.id }).from(formerCouncillors);
    if (existing.length >= 8) {
      return NextResponse.json({ error: 'Maximum 8 former councillor profiles allowed.' }, { status: 400 });
    }
    await db.insert(formerCouncillors).values({
      name: d.name,
      nameMl: d.nameMl || null,
      yearSpan: d.yearSpan,
      note: d.note || null,
      photoUrl: d.photoUrl || null,
      sortOrder: d.sortOrder ?? existing.length
    });
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'edit-former-councillor' && d.id && d.name && d.yearSpan) {
    await db
      .update(formerCouncillors)
      .set({
        name: d.name,
        nameMl: d.nameMl || null,
        yearSpan: d.yearSpan,
        note: d.note || null,
        ...(d.sortOrder !== undefined ? { sortOrder: d.sortOrder } : {}),
        ...(d.photoUrl !== undefined ? { photoUrl: d.photoUrl || null } : {})
      })
      .where(eq(formerCouncillors.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'delete-former-councillor' && d.id) {
    await db.delete(formerCouncillors).where(eq(formerCouncillors.id, d.id));
    return NextResponse.json({ ok: true });
  }

  // Nearest Places (Iritty & Uliyil Shops with Logos)
  if (d.action === 'nearest' && d.id && ['published', 'draft'].includes(d.status || '')) {
    await db.update(nearestPlaces).set({ status: d.status }).where(eq(nearestPlaces.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'create-nearest' && d.name) {
    await db.insert(nearestPlaces).values({
      name: d.name,
      town: d.town || 'Iritty',
      category: d.category || 'Shopping',
      logoUrl: d.logoUrl || null,
      distanceNote: d.distanceNote || null,
      phone: d.phone?.replace(/[^\d+]/g, '') || null,
      whatsapp: d.whatsapp?.replace(/[^\d+]/g, '') || null,
      mapUrl: d.mapUrl || null,
      websiteUrl: d.websiteUrl || null,
      description: d.description || null,
      status: 'published'
    });
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'edit-nearest' && d.id && d.name) {
    await db
      .update(nearestPlaces)
      .set({
        name: d.name,
        ...(d.town ? { town: d.town } : {}),
        ...(d.category ? { category: d.category } : {}),
        ...(d.logoUrl !== undefined ? { logoUrl: d.logoUrl || null } : {}),
        ...(d.distanceNote !== undefined ? { distanceNote: d.distanceNote || null } : {}),
        ...(d.phone !== undefined ? { phone: d.phone?.replace(/[^\d+]/g, '') || null } : {}),
        ...(d.whatsapp !== undefined ? { whatsapp: d.whatsapp?.replace(/[^\d+]/g, '') || null } : {}),
        ...(d.mapUrl !== undefined ? { mapUrl: d.mapUrl || null } : {}),
        ...(d.websiteUrl !== undefined ? { websiteUrl: d.websiteUrl || null } : {}),
        ...(d.description !== undefined ? { description: d.description || null } : {}),
        ...(d.status && ['published', 'draft'].includes(d.status) ? { status: d.status } : {})
      })
      .where(eq(nearestPlaces.id, d.id));
    return NextResponse.json({ ok: true });
  }
  if (d.action === 'delete-nearest' && d.id) {
    await db.delete(nearestPlaces).where(eq(nearestPlaces.id, d.id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const [allListings, allRequests, allContent, allProfessionals, allFormer, allNearest] = await Promise.all([
    db.select().from(listings).orderBy(desc(listings.createdAt)),
    db
      .select({
        id: requests.id,
        kind: requests.kind,
        category: requests.category,
        name: requests.name,
        phone: requests.phone,
        email: requests.email,
        locality: requests.locality,
        description: requests.description,
        status: requests.status,
        photoMime: requests.photoMime,
        createdAt: requests.createdAt
      })
      .from(requests)
      .orderBy(desc(requests.createdAt)),
    db.select().from(contentEntries).orderBy(desc(contentEntries.createdAt)),
    db.select().from(professionals).orderBy(desc(professionals.createdAt)),
    db.select().from(formerCouncillors).orderBy(asc(formerCouncillors.sortOrder), asc(formerCouncillors.createdAt)),
    db.select().from(nearestPlaces).orderBy(desc(nearestPlaces.createdAt))
  ]);
  return NextResponse.json({
    listings: allListings,
    requests: allRequests,
    content: allContent,
    professionals: allProfessionals,
    formerCouncillors: allFormer,
    nearestPlaces: allNearest
  });
}
