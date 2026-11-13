import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Video, ArrowUpRight, Award, CalendarDays } from 'lucide-react';
import { db } from '@/db';
import { contentEntries } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { site } from '@/lib/config';
import { T } from '@/components/Translated';
import { VideoPlayer } from '@/components/VideoPlayer';
import { isPlayableVideoUrl } from '@/lib/mediaUrl';
import { extractMediaId, getMediaMimeMap } from '@/lib/mediaServer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'History of Uliyil — Articles & Videos',
  description: 'Read articles and watch heritage videos exploring the rich history, culture, and milestones of Uliyil, Iritty.'
};

export default async function HistoryPage() {
  let entries: {
    id: string;
    title: string;
    body: string | null;
    category: string | null;
    locality: string | null;
    url: string | null;
    imageUrl: string | null;
    publishedAt: Date | null;
  }[] = [];

  try {
    entries = await db
      .select({
        id: contentEntries.id,
        title: contentEntries.title,
        body: contentEntries.body,
        category: contentEntries.category,
        locality: contentEntries.locality,
        url: contentEntries.url,
        imageUrl: contentEntries.imageUrl,
        publishedAt: contentEntries.publishedAt
      })
      .from(contentEntries)
      .where(and(eq(contentEntries.type, 'history'), eq(contentEntries.status, 'published')))
      .orderBy(desc(contentEntries.publishedAt))
      .limit(50);
  } catch (err) {
    console.warn('History fetch skipped:', err);
  }

  const mimeMap = await getMediaMimeMap(entries.map((e) => e.url));
  const isHistoryVideo = (e: (typeof entries)[number]) => {
    const mid = extractMediaId(e.url);
    return isPlayableVideoUrl(e.url, e.category, mid ? mimeMap.get(mid) || null : null);
  };
  const videoEntries = entries.filter(isHistoryVideo);
  const articleEntries = entries.filter((e) => !isHistoryVideo(e) || (e.body && e.body.trim().length > 0));

  return (
    <main>
      <section
        className="inner-hero photo-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(8,42,34,.92),rgba(8,42,34,.62)),url('${site.imagery.hills}')`
        }}
      >
        <div className="container">
          <span className="eyebrow">
            ✳ &nbsp; <T en="OUR HERITAGE & ROOTS" ml="നമ്മുടെ പൈതൃകവും വേരുകളും" />
          </span>
          <h1>
            <T en="History of" ml="ഉളിയിലിന്റെ" />
            <br />
            <em>
              <T en="Uliyil." ml="ചരിത്രം." />
            </em>
          </h1>
          <p>
            <T
              en="Articles, memories, and videos preserving the stories, milestones, and legacy of Uliyil."
              ml="ഉളിയിലിന്റെ ചരിത്രവും സംസ്കാരവും പോരാട്ടങ്ങളും നേട്ടങ്ങളും വിളിച്ചോതുന്ന ലേഖനങ്ങളും വീഡിയോകളും."
            />
          </p>
          <div className="hero-glance">
            <span><T en={`${articleEntries.length} Articles`} ml={`${articleEntries.length} ലേഖനങ്ങൾ`} /></span>
            <span><T en={`${videoEntries.length} Videos`} ml={`${videoEntries.length} വീഡിയോകൾ`} /></span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link href="/former-councillors" className="btn btn-lime btn-compact-mobile">
              <Award size={17} /> <T en="View Former Councillors" ml="മുൻ കൗൺസിലർമാരെ കാണാം" /> <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> <T en="HISTORICAL ARTICLES" ml="ചരിത്ര ലേഖനങ്ങൾ" />
              </span>
              <h2>
                <T en="Stories from" ml="ഉളിയിലിന്റെ" />{' '}
                <em>
                  <T en="our past." ml="ഇന്നലെകൾ." />
                </em>
              </h2>
            </div>
            <p>
              <T
                en="Verified articles and narratives contributed by local historians, elders, and ward moderators."
                ml="പ്രാദേശിക ചരിത്രകാരന്മാരും മുതിർന്നവരും വാർഡ് മോഡറേറ്റർമാരും പങ്കുവെച്ച ചരിത്ര ലേഖനങ്ങൾ."
              />
            </p>
          </div>

          {articleEntries.length ? (
            <div className="history-article-list">
              {articleEntries.map((art) => (
                <article className="history-article-card" key={art.id}>
                  {art.imageUrl && (
                    <div className="history-article-cover">
                      <img src={art.imageUrl} alt={art.title} loading="lazy" />
                    </div>
                  )}
                  <div className="history-article-content">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                      <span className="pill">{art.category || 'History Article'}</span>
                      {art.locality && (
                        <small style={{ color: '#587461', fontWeight: 700 }}>{art.locality}</small>
                      )}
                      {art.publishedAt && (
                        <small style={{ color: '#789080', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CalendarDays size={13} /> {new Date(art.publishedAt).toLocaleDateString('en-IN')}
                        </small>
                      )}
                    </div>
                    <h3>{art.title}</h3>
                    {art.body && (
                      <div className="history-prose">
                        {art.body.split('\n').map((para, idx) =>
                          para.trim() ? <p key={idx}>{para}</p> : null
                        )}
                      </div>
                    )}
                    {art.url && isHistoryVideo(art) ? (
                      <div style={{ marginTop: 18 }}>
                        <VideoPlayer url={art.url} title={art.title} poster={art.imageUrl} />
                      </div>
                    ) : art.url ? (
                      <div style={{ marginTop: 14 }}>
                        <a href={art.url} target="_blank" rel="noopener noreferrer" className="text-link">
                          <T en="Open reference link" ml="അനുബന്ധ ലിങ്ക് കാണുക" /> <ArrowUpRight size={15} />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BookOpen size={38} />
              <h3>
                <T en="History articles are being curated" ml="ചരിത്ര ലേഖനങ്ങൾ ഉടൻ പ്രസിദ്ധീകരിക്കും" />
              </h3>
              <p>
                <T
                  en="Ward moderators can add historical articles and stories of Uliyil from the Admin portal under the History tab."
                  ml="ഉളിയിലിന്റെ ചരിത്രം വിവരിക്കുന്ന ലേഖനങ്ങൾ അഡ്മിൻ പാനലിലെ History വിഭാഗം വഴി ചേർക്കാവുന്നതാണ്."
                />
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="page-section alt">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> <T en="HERITAGE VIDEOS" ml="ചരിത്ര വീഡിയോകൾ" />
              </span>
              <h2>
                <T en="Watch Uliyil's" ml="ഉളിയിലിന്റെ കഥ" />{' '}
                <em>
                  <T en="journey." ml="ദൃശ്യങ്ങളിലൂടെ." />
                </em>
              </h2>
            </div>
          </div>

          {videoEntries.length ? (
            <div className="social-grid">
              {videoEntries.map((vid) => (
                <article className="social-card" key={vid.id}>
                  <VideoPlayer url={vid.url!} title={vid.title} poster={vid.imageUrl} />
                  <h3 style={{ marginTop: 16 }}>{vid.title}</h3>
                  {vid.body && <p>{vid.body}</p>}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Video size={38} />
              <h3>
                <T en="Heritage videos coming soon" ml="ചരിത്ര വീഡിയോകൾ ഉടൻ ചേർക്കും" />
              </h3>
              <p>
                <T
                  en="Upload documentary clips or add YouTube / Facebook history videos via Admin -> History."
                  ml="ഉളിയിലിന്റെ പഴയകാല വീഡിയോകളും ഡോക്യുമെന്ററികളും അഡ്മിൻ പാനൽ വഴി ഇവിടെ ചേർക്കാവുന്നതാണ്."
                />
              </p>
            </div>
          )}

          <div className="history-callout" style={{ marginTop: 48 }}>
            <div>
              <span className="eyebrow">
                <Award size={15} /> <T en="LEADERSHIP TIMELINE" ml="മുൻ കൗൺസിലർമാർ" />
              </span>
              <h3>
                <T
                  en="Meet the Former Ward Councillors of Uliyil"
                  ml="ഉളിയിലിലെ മുൻ വാർഡ് കൗൺസിലർമാരെ പരിചയപ്പെടാം"
                />
              </h3>
              <p>
                <T
                  en="Explore portraits and service years of previous representatives."
                  ml="മുൻകാല കൗൺസിലർമാരുടെ ഫോട്ടോകളും സേവന കാലാവധിയും കാണുക."
                />
              </p>
            </div>
            <Link href="/former-councillors" className="btn btn-forest">
              <T en="Former Councillors" ml="മുൻ കൗൺസിലർമാർ" /> <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
