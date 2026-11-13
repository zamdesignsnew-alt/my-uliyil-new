import type { Metadata } from 'next';
import { db } from '@/db';
import { nearestPlaces } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NearestClient, type NearestPlace } from '@/components/NearestClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nearest Shops & Hubs (Uliyil & Iritty)',
  description:
    'Explore nearby shops, supermarkets, hospitals, and showrooms in Iritty and around Uliyil with logos, locations, and contact info.'
};

export default async function NearestPage() {
  let rows: NearestPlace[] = [];
  try {
    rows = await db
      .select({
        id: nearestPlaces.id,
        name: nearestPlaces.name,
        town: nearestPlaces.town,
        category: nearestPlaces.category,
        logoUrl: nearestPlaces.logoUrl,
        distanceNote: nearestPlaces.distanceNote,
        phone: nearestPlaces.phone,
        whatsapp: nearestPlaces.whatsapp,
        mapUrl: nearestPlaces.mapUrl,
        websiteUrl: nearestPlaces.websiteUrl,
        description: nearestPlaces.description
      })
      .from(nearestPlaces)
      .where(eq(nearestPlaces.status, 'published'))
      .orderBy(desc(nearestPlaces.createdAt))
      .limit(100);
  } catch (err) {
    console.warn('Nearest places fetch skipped:', err);
  }

  return <NearestClient initialPlaces={rows} />;
}
