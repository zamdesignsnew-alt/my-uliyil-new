import type { Metadata } from 'next';
import { db } from '@/db';
import { professionals } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ProfessionalsClient, type ProfessionalItem } from '@/components/ProfessionalsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ward Professionals',
  description:
    'Meet the doctors, engineers, teachers, advocates, and skilled professionals from Uliyil Ward 19, Iritty Municipality.'
};

export default async function ProfessionalsPage() {
  let rows: ProfessionalItem[] = [];
  try {
    rows = await db
      .select({
        id: professionals.id,
        name: professionals.name,
        nameMl: professionals.nameMl,
        profession: professionals.profession,
        category: professionals.category,
        qualification: professionals.qualification,
        locality: professionals.locality,
        phone: professionals.phone,
        whatsapp: professionals.whatsapp,
        email: professionals.email,
        bio: professionals.bio,
        photoUrl: professionals.photoUrl
      })
      .from(professionals)
      .where(eq(professionals.status, 'approved'))
      .orderBy(desc(professionals.createdAt))
      .limit(100);
  } catch (err) {
    console.warn('Professionals page fetch skipped:', err);
  }

  return <ProfessionalsClient initialItems={rows} />;
}
