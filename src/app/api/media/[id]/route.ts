import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 });
  }

  try {
    const [row] = await db
      .select({
        mimeType: mediaAssets.mimeType,
        dataBase64: mediaAssets.dataBase64
      })
      .from(mediaAssets)
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const buf = Buffer.from(row.dataBase64, 'base64');
    const total = buf.length;
    const range = req.headers.get('range');

    const baseHeaders: Record<string, string> = {
      'Content-Type': row.mimeType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff'
    };

    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range);
      if (match) {
        const start = Number(match[1]);
        const end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
        if (start >= 0 && start <= end && start < total) {
          const chunk = buf.subarray(start, end + 1);
          return new NextResponse(chunk, {
            status: 206,
            headers: {
              ...baseHeaders,
              'Content-Range': `bytes ${start}-${end}/${total}`,
              'Content-Length': String(chunk.length)
            }
          });
        }
      }
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(total)
      }
    });
  } catch (err) {
    console.error('Media serve failed:', err);
    return NextResponse.json({ error: 'Unable to load media' }, { status: 500 });
  }
}
