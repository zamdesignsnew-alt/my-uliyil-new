import { NextResponse } from 'next/server';
import { db } from '@/db';
import { formerCouncillors } from '@/db/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(formerCouncillors)
      .orderBy(asc(formerCouncillors.sortOrder), asc(formerCouncillors.createdAt))
      .limit(8);
    return NextResponse.json(rows);
  } catch (err) {
    console.warn('Former councillors GET error:', err);
    return NextResponse.json([]);
  }
}
