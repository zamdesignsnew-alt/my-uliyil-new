import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { inArray } from 'drizzle-orm';

export function extractMediaId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.trim().match(/^\/api\/media\/([a-f0-9-]{36})$/i);
  return m ? m[1] : null;
}

export async function getMediaMimeMap(urls: (string | null | undefined)[]): Promise<Map<string, string>> {
  const ids = Array.from(new Set(urls.map(extractMediaId).filter((id): id is string => Boolean(id))));
  const map = new Map<string, string>();
  if (ids.length === 0) return map;

  try {
    const rows = await db
      .select({ id: mediaAssets.id, mimeType: mediaAssets.mimeType })
      .from(mediaAssets)
      .where(inArray(mediaAssets.id, ids));
    for (const r of rows) {
      map.set(r.id, r.mimeType);
    }
  } catch (err) {
    console.warn('Media mime lookup skipped:', err);
  }
  return map;
}
