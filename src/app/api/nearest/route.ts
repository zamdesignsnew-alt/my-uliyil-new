import { NextResponse } from 'next/server';
import { db } from '@/db';
import { nearestPlaces } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(nearestPlaces)
      .where(eq(nearestPlaces.status, 'published'))
      .orderBy(desc(nearestPlaces.createdAt))
      .limit(100);
    return NextResponse.json(rows);
  } catch (err) {
    console.warn('Nearest places GET error:', err);
    return NextResponse.json([]);
  }
}
