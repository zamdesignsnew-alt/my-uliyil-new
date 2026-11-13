import { isAdmin } from '@/lib/auth';
import { db } from '@/db';
import { requests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req:NextRequest){if(!await isAdmin())return NextResponse.json({error:'Unauthorised'},{status:401});const id=req.nextUrl.searchParams.get('id');if(!id||!/^[a-f0-9-]{36}$/.test(id))return NextResponse.json({error:'Invalid ID'},{status:400});const [row]=await db.select({photoData:requests.photoData,photoMime:requests.photoMime}).from(requests).where(eq(requests.id,id)).limit(1);if(!row?.photoData||!row.photoMime)return NextResponse.json({error:'No attachment'},{status:404});return new NextResponse(Buffer.from(row.photoData,'base64'),{headers:{'Content-Type':row.photoMime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
