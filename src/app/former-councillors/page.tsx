import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { db } from '@/db';
import { formerCouncillors } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { T } from '@/components/Translated';
import { FormerCouncillorsGrid, type FormerCouncillorItem } from '@/components/FormerCouncillorsGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Former Councillors of Uliyil',
  description: 'Profiles, photos, and service years of the past Ward Councillors who served Uliyil, Iritty Municipality.'
};

export default async function FormerCouncillorsPage() {
  let rows: FormerCouncillorItem[] = [];
  try {
    rows = await db
      .select({
        id: formerCouncillors.id,
        name: formerCouncillors.name,
        nameMl: formerCouncillors.nameMl,
        yearSpan: formerCouncillors.yearSpan,
        note: formerCouncillors.note,
        photoUrl: formerCouncillors.photoUrl
      })
      .from(formerCouncillors)
      .orderBy(asc(formerCouncillors.sortOrder), asc(formerCouncillors.createdAt))
      .limit(8);
  } catch (err) {
    console.warn('Former councillors fetch skipped:', err);
  }

  return (
    <main>
      <section className="inner-hero dark-hero">
        <div className="container">
          <span className="eyebrow">
            ✳ &nbsp; <T en="HONOUR ROLL · ULIYIL WARD" ml="ആദരവ് · ഉളിയിൽ വാർഡ്" />
          </span>
          <h1>
            <T en="Former" ml="ഉളിയിലിന്റെ മുൻ" />
            <br />
            <em>
              <T en="Councillors." ml="കൗൺസിലർമാർ." />
            </em>
          </h1>
          <p>
            <T
              en="Remembering and honouring the representatives who dedicated their leadership to the growth of Uliyil."
              ml="ഉളിയിലിന്റെ വളർച്ചയ്ക്കും വികസനത്തിനുമായി നേതൃത്വം നൽകിയ മുൻ ജനപ്രതിനിധികളെ സ്നേഹത്തോടെ സ്മരിക്കുന്നു."
            />
          </p>
          <div className="hero-glance">
            <span><T en={`${rows.length} Former Leaders`} ml={`${rows.length} മുൻ കൗൺസിലർമാർ`} /></span>
            <span><T en="Photos & Service Years" ml="ഫോട്ടോ & സേവന കാലാവധി" /></span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <FormerCouncillorsGrid items={rows} showHistoryLink={false} />

          <div className="history-callout">
            <div>
              <span className="eyebrow">
                <BookOpen size={15} /> <T en="OUR HERITAGE & STORY" ml="നമ്മുടെ പൈതൃകവും ചരിത്രവും" />
              </span>
              <h3>
                <T
                  en="Read the History of Uliyil & Watch Heritage Videos"
                  ml="ഉളിയിലിന്റെ ചരിത്രം വിളിച്ചോതുന്ന ലേഖനങ്ങളും വീഡിയോകളും കാണാം"
                />
              </h3>
              <p>
                <T
                  en="Explore historical articles, stories of our land, and documentary videos capturing the journey of Uliyil."
                  ml="ഉളിയിലിന്റെ പഴയകാല ചരിത്രവും വളർച്ചയും വിവരിക്കുന്ന ലേഖനങ്ങളും വീഡിയോകളും പ്രത്യേക പേജിൽ വായിച്ചറിയൂ."
                />
              </p>
            </div>
            <Link href="/history" className="btn btn-lime">
              <T en="Open Uliyil History" ml="ചരിത്ര പേജ് തുറക്കുക" /> <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
