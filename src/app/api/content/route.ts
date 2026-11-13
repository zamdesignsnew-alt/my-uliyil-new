import { db } from '@/db';
import { contentEntries } from '@/db/schema';
import { and, eq, or, isNull, gt, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'announcement';
  if (!['announcement', 'project', 'gallery', 'institution', 'organisation', 'service', 'meeting', 'history'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
  try {
    const rows = await db
      .select()
      .from(contentEntries)
      .where(
        and(
          eq(contentEntries.type, type),
          eq(contentEntries.status, 'published'),
          or(isNull(contentEntries.expiresAt), gt(contentEntries.expiresAt, new Date()))
        )
      )
      .orderBy(desc(contentEntries.publishedAt))
      .limit(100);
    return NextResponse.json(rows);
  } catch (err) {
    console.warn('Content fetch error:', err);
    return NextResponse.json([]);
  }
}
