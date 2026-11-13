import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  HeartPulse,
  BookOpen,
  Building2,
  ExternalLink,
  Camera,
  Users,
  CircleHelp,
  Award,
  Store,
  BriefcaseBusiness
} from 'lucide-react';
import { db } from '@/db';
import { contentEntries, formerCouncillors, listings } from '@/db/schema';
import { and, asc, desc, eq, gt, ilike, isNull, or } from 'drizzle-orm';
import { site } from '@/lib/config';
import { extractMediaId, getMediaMimeMap } from '@/lib/mediaServer';
import { Portrait } from '@/components/Portrait';
import { RequestForm } from '@/components/RequestForm';
import { ServicesHub } from '@/components/ServicesHub';
import { T } from '@/components/Translated';
import { GalleryImage } from '@/components/GalleryImage';
import { VideoPlayer } from '@/components/VideoPlayer';
import { isPlayableVideoUrl } from '@/lib/mediaUrl';
import { FormerCouncillorsGrid, type FormerCouncillorItem } from '@/components/FormerCouncillorsGrid';

export const dynamic = 'force-dynamic';

const pages = [
  'councillor',
  'services',
  'development',
  'gallery',
  'ward',
  'announcements',
  'helping-hand',
  'ideas',
  'report',
  'academic'
];

const titles: Record<string, string> = {
  councillor: 'Meet Shabna Teacher',
  services: 'Government Services',
  development: 'Development & Progress',
  gallery: 'Community Gallery',
  ward: 'Explore Uliyil',
  announcements: 'Announcements',
  'helping-hand': 'Helping Hand',
  ideas: 'Ward Idea Box',
  report: 'Report an Issue',
  academic: 'Academic Directory'
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: titles[slug] || 'My Uliyil' };
}

async function content(type: string) {
  try {
    return await db
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
      .limit(60);
  } catch (err) {
    console.warn(`Database skipped for content(${type}):`, err);
    return [];
  }
}

const Empty = ({
  title,
  titleMl,
  description,
  descriptionMl
}: {
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
}) => (
  <div className="empty-state">
    <CircleHelp size={33} />
    <h3>
      <T en={title} ml={titleMl} />
    </h3>
    <p>
      <T en={description} ml={descriptionMl} />
    </p>
  </div>
);

export default async function Interior({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages.includes(slug)) notFound();

  if (slug === 'councillor') {
    const meetings = await content('meeting');
    let formerRows: FormerCouncillorItem[] = [];
    try {
      formerRows = await db
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
        <section className="inner-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="WARD COUNCILLOR · SHABNA TEACHER" ml="വാർഡ് കൗൺസിലർ · ശബ്ന ടീച്ചർ" />
            </span>
            <h1>
              <T en="Meet Shabna Teacher." ml="ശബ്ന ടീച്ചറെ" />{' '}
              <em>
                <T en="Ward 19 Councillor." ml="പരിചയപ്പെടാം." />
              </em>
            </h1>
            <p>
              <T
                en="Contact Uliyil's Ward Councillor directly, request a public appointment, view meetings, or meet former leaders."
                ml="ഇരിട്ടി നഗരസഭയിലെ ഉളിയിൽ വാർഡ് കൗൺസിലറുമായി ബന്ധപ്പെടുക, കൂടിക്കാഴ്ച ബുക്ക് ചെയ്യുക, മുൻ സാരഥികളെ കാണുക."
              />
            </p>
            <div className="hero-glance">
              <span><T en="Direct Call & Email" ml="നേരിട്ട് വിളിക്കാം" /></span>
              <span><T en="Book Appointment" ml="കൂടിക്കാഴ്ച ബുക്ക് ചെയ്യാം" /></span>
              <span><T en="Former Councillors" ml="മുൻ കൗൺസിലർമാർ" /></span>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container feature-layout">
            <div className="profile-portrait">
              <Portrait src={site.councillor.archPortrait} />
              <small>
                <T en="Shabna Teacher · Ward 19 Councillor" ml="ശബ്ന ടീച്ചർ · വാർഡ് 19 കൗൺസിലർ" />
              </small>
            </div>
            <div>
              <span className="eyebrow">
                <T en="A MESSAGE TO OUR COMMUNITY" ml="നാട്ടുകാർക്കുള്ള സന്ദേശം" />
              </span>
              <h2 className="page-title councillor-greeting-title">
                <T en="Hello, I'm" ml="നമസ്കാരം, ഞാൻ" />
                <br />
                <T en="Shabna Teacher." ml="ശബ്ന ടീച്ചർ." />
              </h2>
              <p className="page-lead">
                <T en={site.councillor.welcome} ml={site.councillor.welcomeMl} />
              </p>
              <div className="contact-list">
                <span>
                  <MapPin size={17} /> <T en={site.councillor.role} ml={site.councillor.roleMl} />
                </span>
                <span>
                  <Phone size={17} /> {site.councillor.phone}
                </span>
              </div>
              <div className="contact-buttons">
                <a className="btn btn-forest" href={`tel:${site.councillor.phone}`}>
                  <Phone size={17} /> <T en="Call Councillor" ml="വിളിക്കുക" />
                </a>
                <a className="btn btn-outline" href={`mailto:${site.councillor.email}`}>
                  <Mail size={17} /> <T en="Send Email" ml="ഇമെയിൽ അയയ്ക്കുക" />
                </a>
                <a className="btn btn-outline" href={site.councillor.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook <ExternalLink size={15} />
                </a>
                <a className="btn btn-outline" href={site.councillor.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section alt">
          <div className="container split-form">
            <div>
              <span className="eyebrow">
                ✳ &nbsp; <T en="LET'S TALK" ml="നമുക്ക് സംസാരിക്കാം" />
              </span>
              <h2 className="page-title">
                <T en="A conversation" ml="ഒരു കൂടിക്കാഴ്ച" />
                <br />
                <T en="starts here." ml="ഇവിടെ തുടങ്ങാം." />
              </h2>
              <p className="page-lead">
                <T
                  en="Request a public appointment. For urgent matters, please call directly."
                  ml="കൂടിക്കാഴ്ചയ്ക്കായി സമയം തേടുക. അടിയന്തര കാര്യങ്ങൾക്ക് ദയവായി നേരിട്ട് വിളിക്കുക."
                />
              </p>
              <a href={`tel:${site.councillor.phone}`} className="text-link">
                <Phone size={16} /> 94975 30282
              </a>
              <div style={{ marginTop: 45 }}>
                <h3>
                  <T en="Upcoming meetings" ml="വരാനിരിക്കുന്ന യോഗങ്ങൾ" />
                </h3>
                {meetings.length ? (
                  meetings.map((m) => (
                    <p key={m.id}>
                      {m.title} · {m.publishedAt?.toLocaleDateString('en-IN')}
                    </p>
                  ))
                ) : (
                  <p className="inline-note">
                    <T
                      en="No verified upcoming meetings have been published. Check back for updates."
                      ml="വരാനിരിക്കുന്ന യോഗങ്ങളുടെ വിവരങ്ങൾ പ്രസിദ്ധീകരിക്കുമ്പോൾ ഇവിടെ കാണാം."
                    />
                  </p>
                )}
              </div>
            </div>
            <RequestForm kind="appointment" />
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <FormerCouncillorsGrid items={formerRows} showHistoryLink={true} />
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'services') {
    return (
      <main>
        <section className="inner-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="SERVICES · GOVERNMENT PORTALS" ml="സർക്കാർ സേവനങ്ങൾ · പോർട്ടലുകൾ" />
            </span>
            <h1>
              <T en="Government" ml="നിത്യജീവിതത്തിലെ" />{' '}
              <em>
                <T en="Services Hub." ml="സേവനങ്ങൾ." />
              </em>
            </h1>
            <p>
              <T
                en="Quick official links for welfare pensions, LIFE Mission, ration cards, e-District certificates, scholarships & K-SMART."
                ml="ക്ഷേമ പെൻഷൻ, ലൈഫ് മിഷൻ, റേഷൻ കാർഡ്, ഇ-ഡിസ്ട്രിക്റ്റ് സർട്ടിഫിക്കറ്റുകൾ, K-SMART പോർട്ടലുകൾ ഒരിടത്ത്."
              />
            </p>
            <div className="hero-glance">
              <span><T en="11 Service Categories" ml="11 സേവന വിഭാഗങ്ങൾ" /></span>
              <span><T en="Direct Official Links" ml="ഔദ്യോഗിക ലിങ്കുകൾ" /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <T en="THE SERVICES HUB" ml="സേവന കേന്ദ്രം" />
                </span>
                <h2>
                  <T en="Find your way" ml="ശരിയായ വഴി" />
                  <br />
                  <em>
                    <T en="forward." ml="തിരഞ്ഞെടുക്കാം." />
                  </em>
                </h2>
              </div>
              <p>
                <T
                  en="These are informational links to official websites, not applications or eligibility decisions by My Uliyil."
                  ml="ഇവ ഔദ്യോഗിക സർക്കാർ വെബ്‌സൈറ്റുകളിലേക്കുള്ള നേരിട്ടുള്ള ലിങ്കുകളാണ്."
                />
              </p>
            </div>
            <ServicesHub />
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'ideas' || slug === 'report') {
    const isIdea = slug === 'ideas';
    return (
      <main>
        <section className={`inner-hero ${isIdea ? '' : 'dark-hero'}`}>
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp;{' '}
              {isIdea ? (
                <T en="THE WARD IDEA BOX" ml="വാർഡ് ആശയപ്പെട്ടി" />
              ) : (
                <T en="GRIEVANCE REDRESSAL" ml="പരാതി പരിഹാര വേദി" />
              )}
            </span>
            <h1>
              {isIdea ? (
                <>
                  <T en="Your idea could" ml="നിങ്ങളുടെ ആശയത്തിന്" />
                  <br />
                  <em>
                    <T en="change everything." ml="വലിയ മാറ്റങ്ങൾ കൊണ്ടുവരാനാകും." />
                  </em>
                </>
              ) : (
                <>
                  <T en="See a problem?" ml="നാട്ടിൽ ഒരു പ്രശ്നം കണ്ടോ?" />
                  <br />
                  <em>
                    <T en="Let's work on it." ml="നമുക്ക് പരിഹരിക്കാം." />
                  </em>
                </>
              )}
            </h1>
            <p>
              {isIdea ? (
                <T
                  en="The best ideas often begin close to home. Share your suggestion for a better Uliyil."
                  ml="മികച്ച ആശയങ്ങൾ തുടങ്ങുന്നത് നമ്മുടെ വീടിനടുത്തുനിന്നാണ്. ഉളിയിലിന്റെ വളർച്ചയ്ക്കായി നിങ്ങളുടെ നിർദ്ദേശങ്ങൾ പങ്കുവയ്ക്കൂ."
                />
              ) : (
                <T
                  en="Report a local issue privately. Your report will be saved with a unique reference for review and tracking."
                  ml="പ്രാദേശിക പ്രശ്നങ്ങൾ സ്വകാര്യമായി അറിയിക്കൂ. പരിശോധിക്കാനും തൽസ്ഥിതി അറിയാനുമുള്ള റെഫറൻസ് നമ്പർ ഉടൻ ലഭിക്കും."
                />
              )}
            </p>
            <div className="hero-glance">
              <span>{isIdea ? <T en="Quick Suggestion Form" ml="ലളിതമായ ഫോം" /> : <T en="Private & Confidential" ml="സ്വകാര്യവും സുരക്ഷിതവും" />}</span>
              <span><T en="Instant Reference ID" ml="റെഫറൻസ് നമ്പർ ഉടൻ ലഭിക്കും" /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container split-form">
            <aside className="side-panel">
              <span className="eyebrow light">
                ✳ &nbsp;{' '}
                {isIdea ? (
                  <T en="BETTER TOGETHER" ml="ഒരുമയോടെ മുന്നോട്ട്" />
                ) : (
                  <T en="A SAFER COMMUNITY" ml="സുരക്ഷിതമായ നാടിനായി" />
                )}
              </span>
              <h2>
                {isIdea ? (
                  <T en="Every voice belongs here." ml="ഓരോ ശബ്ദവും വിലപ്പെട്ടതാണ്." />
                ) : (
                  <T en="Your concerns matter." ml="നിങ്ങളുടെ പരാതികൾക്ക് പരിഗണനയുണ്ട്." />
                )}
              </h2>
              <p>
                {isIdea ? (
                  <T
                    en="From greener spaces to better public facilities, tell us what you imagine for our ward. Approved ideas may be shared later."
                    ml="പൊതു ഇടങ്ങൾ മെച്ചപ്പെടുത്താനും പുതിയ വികസനങ്ങൾക്കും നിങ്ങളുടെ ആശയങ്ങൾ ഇവിടെ രേഖപ്പെടുത്താം."
                  />
                ) : (
                  <T
                    en="Reports are kept private. Please avoid sensitive details beyond what is necessary. This is not an emergency service."
                    ml="പരാതികൾ സ്വകാര്യമായി സൂക്ഷിക്കുന്നതാണ്. അടിയന്തര സഹായങ്ങൾക്കായി 112-ൽ വിളിക്കുക."
                  />
                )}
              </p>
              <Link href="/track">
                <T en="Track an existing request" ml="നൽകിയ അപേക്ഷയുടെ തൽസ്ഥിതി അറിയുക" /> <ArrowUpRight size={17} />
              </Link>
              <Link href="/helping-hand">
                <T en="Find emergency contacts" ml="അടിയന്തര നമ്പറുകൾ കാണുക" /> <ArrowUpRight size={17} />
              </Link>
              {isIdea && site.googleIdeaFormUrl && (
                <a href={site.googleIdeaFormUrl} target="_blank" rel="noopener noreferrer">
                  <T en="Open idea form" ml="ആശയ ഫോം തുറക്കുക" /> <ExternalLink size={16} />
                </a>
              )}
            </aside>
            <RequestForm kind={isIdea ? 'idea' : 'issue'} />
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'announcements') {
    const entries = await content('announcement');
    return (
      <main>
        <section className="inner-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="ANNOUNCEMENTS · WARD NOTICES" ml="അറിയിപ്പുകൾ · വാർഡ് വാർത്തകൾ" />
            </span>
            <h1>
              <T en="Ward Notices &" ml="പ്രധാന അറിയിപ്പുകളും" />{' '}
              <em>
                <T en="Announcements." ml="വിവരങ്ങളും." />
              </em>
            </h1>
            <p>
              <T
                en="Verified community updates, Grama Sabha notices, meetings, and important public announcements in Uliyil."
                ml="വാർഡിലെ പ്രധാന അറിയിപ്പുകളും യോഗ വിവരങ്ങളും വാർത്തകളും ഒരിടത്ത്."
              />
            </p>
            <div className="hero-glance">
              <span><T en={`${entries.length} Active Notices`} ml={`${entries.length} അറിയിപ്പുകൾ`} /></span>
              <span><T en="Verified by Moderators" ml="സ്ഥിരീകരിച്ചവ" /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container">
            <h2 className="page-title">
              <T en="Latest announcements" ml="ഏറ്റവും പുതിയ അറിയിപ്പുകൾ" />
            </h2>
            <p className="page-lead">
              <T
                en="Only published, unexpired notices appear here. Older notices are automatically hidden from this view."
                ml="സ്ഥിരീകരിച്ചതും കാലാവധി കഴിയാത്തതുമായ അറിയിപ്പുകൾ മാത്രമാണ് ഇവിടെ പ്രദർശിപ്പിക്കുന്നത്."
              />
            </p>
            {entries.length ? (
              <div className="card-grid">
                {entries.map((a) => (
                  <article className="info-card" key={a.id}>
                    <span className="card-icon">
                      <Megaphone size={23} />
                    </span>
                    <span className="pill">{a.category || 'Community update'}</span>
                    <h3 style={{ marginTop: 15 }}>{a.title}</h3>
                    <p>{a.body}</p>
                    <small>{a.publishedAt?.toLocaleDateString('en-IN')}</small>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="No verified notices right now"
                titleMl="നിലവിൽ പുതിയ അറിയിപ്പുകൾ ഇല്ല"
                description="When confirmed ward announcements are published, you'll find them here. Please check official channels for time-sensitive information."
                descriptionMl="ഔദ്യോഗിക വാർഡ് അറിയിപ്പുകൾ വരുമ്പോൾ അവ ഇവിടെ പ്രസിദ്ധീകരിക്കുന്നതാണ്."
              />
            )}
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'development') {
    const entries = await content('project');
    return (
      <main>
        <section
          className="inner-hero photo-hero"
          style={{
            backgroundImage: `linear-gradient(90deg,#0b322acb,#0b322a5e),url('${site.imagery.hills}')`
          }}
        >
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="PROJECTS · ULIYIL DEVELOPMENT" ml="പദ്ധതികൾ · വാർഡ് വികസനം" />
            </span>
            <h1>
              <T en="Development" ml="ഉളിയിലിലെ" />{' '}
              <em>
                <T en="Projects." ml="വികസന പദ്ധതികൾ." />
              </em>
            </h1>
            <p>
              <T
                en="View completed works, ongoing infrastructure projects, and approved ward plans across Uliyil Ward 19."
                ml="വാർഡിൽ പൂർത്തിയായതും നടന്നുകൊണ്ടിരിക്കുന്നതും നിർദ്ദേശിക്കപ്പെട്ടതുമായ വികസന പദ്ധതികൾ കാണാം."
              />
            </p>
            <div className="hero-glance">
              <span><T en={`${entries.length} Verified Projects`} ml={`${entries.length} വികസന പദ്ധതികൾ`} /></span>
              <span><T en="Roads • Welfare • Infrastructure" ml="റോഡുകൾ • അടിസ്ഥാന സൗകര്യങ്ങൾ" /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container">
            <h2 className="page-title">
              <T en="Development & progress" ml="വികസന പദ്ധതികളും പുരോഗതിയും" />
            </h2>
            <p className="page-lead">
              <T
                en="Projects are shown only after their details and status have been verified. No progress percentages or budgets are estimated."
                ml="വിവരങ്ങൾ പരിശോധിച്ചുറപ്പിച്ച ശേഷമാണ് ഓരോ വികസന പദ്ധതിയും ഇവിടെ ഉൾപ്പെടുത്തുന്നത്."
              />
            </p>
            {entries.length ? (
              <div className="card-grid">
                {entries.map((a) => (
                  <article className="info-card project-card" key={a.id}>
                    {a.imageUrl && <img src={a.imageUrl} alt="Project photograph" />}
                    <span className="pill">{a.category || 'Project update'}</span>
                    <h3 style={{ marginTop: 17 }}>{a.title}</h3>
                    <p>{a.body}</p>
                    <small>{a.locality || 'Uliyil Ward 19'}</small>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="Verified projects coming soon"
                titleMl="വികസന പദ്ധതികളുടെ വിവരങ്ങൾ ഉടൻ ചേർക്കും"
                description="This section is ready for completed, ongoing, approved, and proposed work. We won't invent project details or budgets before they're confirmed."
                descriptionMl="അംഗീകരിച്ചതും നടക്കുന്നതുമായ വാർഡ് വികസന പ്രവൃത്തികളുടെ വിവരങ്ങൾ അഡ്മിൻ വഴി ഇവിടെ ചേർക്കുന്നതാണ്."
              />
            )}
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'gallery') {
    const entries = await content('gallery');
    const mimeMap = await getMediaMimeMap(entries.map((g) => g.url));
    return (
      <main>
        <section className="inner-hero dark-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="COMMUNITY GALLERY · PHOTOS & VIDEOS" ml="കമ്മ്യൂണിറ്റി ഗാലറി · ചിത്രങ്ങളും വീഡിയോകളും" />
            </span>
            <h1>
              <T en="Uliyil Gallery," ml="ഉളിയിൽ ഗാലറി," />{' '}
              <em>
                <T en="photos & videos." ml="നിമിഷങ്ങൾ." />
              </em>
            </h1>
            <p>
              <T
                en="Official photographs, ward events, development moments, and community videos curated by Ward moderators."
                ml="വാർഡിലെ പ്രധാന പരിപാടികളുടെയും വികസന നിമിഷങ്ങളുടെയും ചിത്രങ്ങളും വീഡിയോകളും."
              />
            </p>
            <div className="hero-glance">
              <span><T en={`${entries.length} Curated Posts`} ml={`${entries.length} ചിത്രങ്ങളും വീഡിയോകളും`} /></span>
              <span><T en="Official Ward Highlights" ml="വാർഡ് വിശേഷങ്ങൾ" /></span>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-heading compact-mobile-head">
              <div>
                <span className="eyebrow">
                  <T en="VERIFIED ARCHIVE" ml="കമ്മ്യൂണിറ്റി ശേഖരം" />
                </span>
                <h2>
                  <T en="Moments & stories" ml="നമ്മുടെ നാട്ടിലെ" />{' '}
                  <em>
                    <T en="from Uliyil." ml="നല്ല നിമിഷങ്ങൾ." />
                  </em>
                </h2>
              </div>
              <p>
                <T
                  en="Verified photographs and video highlights published for Uliyil Ward 19."
                  ml="ഉളിയിൽ വാർഡിലെ പരിശോധിച്ചുറപ്പിച്ച ചിത്രങ്ങളും വീഡിയോകളുമാണ് താഴെ പ്രദർശിപ്പിക്കുന്നത്."
                />
              </p>
            </div>

            {entries.length ? (
              <div className="gallery-media-grid">
                {entries.map((g) => {
                  const mediaId = extractMediaId(g.url);
                  const detectedMime = mediaId ? mimeMap.get(mediaId) || null : null;
                  const isVideo = isPlayableVideoUrl(g.url, g.category, detectedMime);
                  const photoSrc = !isVideo ? g.imageUrl || g.url : g.imageUrl;
                  const externalLink =
                    g.url && !g.url.startsWith('/api/media/') && g.url !== g.imageUrl ? g.url : null;

                  return (
                    <article key={g.id} className="gallery-entry">
                      <div className="gallery-media-box">
                        {isVideo && g.url ? (
                          <VideoPlayer url={g.url} title={g.title} poster={g.imageUrl} />
                        ) : photoSrc ? (
                          <a
                            href={externalLink || photoSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gallery-media-link"
                          >
                            <GalleryImage src={photoSrc} alt={g.title} />
                          </a>
                        ) : (
                          <div className="gallery-media-fallback">
                            <Camera size={30} />
                          </div>
                        )}
                      </div>
                      <div className="gallery-entry-body">
                        {g.category && <span className="pill">{g.category}</span>}
                        <h3>{g.title}</h3>
                        {g.body && <p>{g.body}</p>}
                        {externalLink && (
                          <a className="gallery-entry-link" href={externalLink} target="_blank" rel="noopener noreferrer">
                            <T en="View original post" ml="യഥാർത്ഥ പോസ്റ്റ് കാണുക" /> <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <Empty
                title="Community gallery is being curated"
                titleMl="കമ്മ്യൂണിറ്റി ഗാലറി ഒരുങ്ങിക്കൊണ്ടിരിക്കുന്നു"
                description="Verified ward photos and videos published by moderators will appear here."
                descriptionMl="വാർഡിലെ ചിത്രങ്ങളും വീഡിയോകളും മോഡറേറ്റർമാർ പ്രസിദ്ധീകരിക്കുമ്പോൾ ഇവിടെ കാണാം."
              />
            )}

            <div className="social-grid">
              <div className="social-card">
                <Camera size={28} />
                <h3>
                  <T en="Follow the moments" ml="വിശേഷങ്ങൾ പിന്തുടരൂ" />
                </h3>
                <p>
                  <T
                    en="Visit Shabna Teacher's Facebook for the latest public posts."
                    ml="പുതിയ അറിയിപ്പുകൾക്കും ചിത്രങ്ങൾക്കുമായി ശബ്ന ടീച്ചറുടെ ഫേസ്ബുക്ക് പേജ് സന്ദർശിക്കൂ."
                  />
                </p>
                <a className="btn btn-forest" href={site.councillor.facebook} target="_blank" rel="noopener noreferrer">
                  <T en="Open Facebook" ml="ഫേസ്ബുക്ക് തുറക്കുക" /> <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="social-card">
                <Camera size={28} />
                <h3>
                  <T en="See more on Instagram" ml="ഇൻസ്റ്റാഗ്രാമിലും കാണാം" />
                </h3>
                <p>
                  <T
                    en="Explore the councillor's Instagram profile for reels and community highlights."
                    ml="റീലുകൾക്കും മറ്റു വിശേഷങ്ങൾക്കുമായി കൗൺസിലറുടെ ഇൻസ്റ്റാഗ്രാം പ്രൊഫൈൽ സന്ദർശിക്കൂ."
                  />
                </p>
                <a className="btn btn-forest" href={site.councillor.instagram} target="_blank" rel="noopener noreferrer">
                  <T en="Open Instagram" ml="ഇൻസ്റ്റാഗ്രാം തുറക്കുക" /> <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="landscape-grid">
              <div style={{ backgroundImage: `url('${site.imagery.hero}')` }}>
                <small>
                  <T en="Illustrative Kerala landscape · Pexels" ml="കേരളത്തിന്റെ പ്രകൃതിഭംഗി" />
                </small>
              </div>
              <div style={{ backgroundImage: `url('${site.imagery.landscape}')` }}>
                <small>
                  <T en="Illustrative Kerala landscape · Pexels" ml="കേരളത്തിന്റെ പ്രകൃതിഭംഗി" />
                </small>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'ward') {
    const institutions = await content('institution');
    const organisations = await content('organisation');
    return (
      <main>
        <section
          className="inner-hero photo-hero"
          style={{
            backgroundImage: `linear-gradient(90deg,#0b322ae5,#0b322a69),url('${site.imagery.landscape}')`
          }}
        >
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="EXPLORE ULIYIL · WARD 19 GUIDE" ml="ഉളിയിലിനെ അറിയാം · വാർഡ് 19 വഴികാട്ടി" />
            </span>
            <h1>
              <T en="Explore Uliyil" ml="ഉളിയിലിനെ" />{' '}
              <em>
                <T en="Ward Guide." ml="അടുത്തറിയാം." />
              </em>
            </h1>
            <p>
              <T
                en="Jump straight into Uliyil History & Videos, Former Councillors, Nearest Iritty Shops, Ward Professionals, Map & Institutions."
                ml="ഉളിയിലിന്റെ ചരിത്രം, മുൻ കൗൺസിലർമാർ, ഇരിട്ടിയിലെ സമീപ കടകൾ, പ്രൊഫഷണലുകൾ, മാപ്പ്, സ്ഥാപനങ്ങൾ എന്നിവ ഇവിടെ കാണാം."
              />
            </p>
            <div className="hero-glance">
              <span><T en="History & Videos" ml="ചരിത്രവും വീഡിയോകളും" /></span>
              <span><T en="Former Councillors" ml="മുൻ കൗൺസിലർമാർ" /></span>
              <span><T en="Nearest Shops" ml="സമീപ കടകൾ" /></span>
              <span><T en="Professionals & Map" ml="പ്രൊഫഷണലുകൾ & മാപ്പ്" /></span>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            {/* Highlighted Special Explorations: History, Former Councillors, Nearest, Professionals */}
            <div className="ward-specials">
              <Link href="/history" className="ward-special-card highlight-history">
                <span className="ward-sp-badge">
                  <BookOpen size={16} /> <T en="HISTORY & VIDEOS" ml="ചരിത്രവും വീഡിയോകളും" />
                </span>
                <h3>
                  <T en="History of Uliyil" ml="ഉളിയിലിന്റെ ചരിത്രം" />
                </h3>
                <p>
                  <T
                    en="Read articles & watch heritage videos telling the story of Uliyil."
                    ml="ഉളിയിലിന്റെ ചരിത്രം വിളിച്ചോതുന്ന ലേഖനങ്ങളും വീഡിയോകളും കാണുക."
                  />
                </p>
                <span className="ward-sp-link">
                  <T en="Open History Page" ml="ചരിത്രം വായിക്കൂ" /> <ArrowUpRight size={16} />
                </span>
              </Link>

              <Link href="/former-councillors" className="ward-special-card">
                <span className="ward-sp-badge">
                  <Award size={16} /> <T en="LEADERSHIP LEGACY" ml="മുൻ ജനപ്രതിനിധികൾ" />
                </span>
                <h3>
                  <T en="Former Councillors" ml="മുൻ കൗൺസിലർമാർ" />
                </h3>
                <p>
                  <T
                    en="View portraits and years of service of former ward councillors."
                    ml="ഉളിയിലിലെ പഴയ കൗൺസിലർമാരുടെ ഫോട്ടോയും സേവന വർഷങ്ങളും കാണുക."
                  />
                </p>
                <span className="ward-sp-link">
                  <T en="View Profiles" ml="പ്രൊഫൈലുകൾ കാണുക" /> <ArrowUpRight size={16} />
                </span>
              </Link>

              <Link href="/nearest" className="ward-special-card">
                <span className="ward-sp-badge">
                  <Store size={16} /> <T en="IRITTY & NEARBY" ml="ഇരിട്ടിയും പരിസരവും" />
                </span>
                <h3>
                  <T en="Nearest Shops & Logos" ml="സമീപ കടകളും സ്ഥാപനങ്ങളും" />
                </h3>
                <p>
                  <T
                    en="Major supermarkets, hospitals & showrooms in Iritty and around Uliyil."
                    ml="ഇരിട്ടിയിലെയും പരിസരത്തെയും പ്രധാന കടകളുടെ ലോഗോകളും വിവരങ്ങളും."
                  />
                </p>
                <span className="ward-sp-link">
                  <T en="Explore Nearest" ml="സമീപ കടകൾ കാണുക" /> <ArrowUpRight size={16} />
                </span>
              </Link>

              <Link href="/professionals" className="ward-special-card">
                <span className="ward-sp-badge">
                  <BriefcaseBusiness size={16} /> <T en="WARD EXPERTS" ml="വാർഡ് പ്രൊഫഷണലുകൾ" />
                </span>
                <h3>
                  <T en="Ward Professionals" ml="പ്രൊഫഷണലുകൾ" />
                </h3>
                <p>
                  <T
                    en="Connect with doctors, engineers, teachers, and advocates from Uliyil."
                    ml="ഉളിയിലിലെ ഡോക്ടർമാർ, എഞ്ചിനീയർമാർ, അഭിഭാഷകർ തുടങ്ങിയവരെ പരിചയപ്പെടൂ."
                  />
                </p>
                <span className="ward-sp-link">
                  <T en="Meet Professionals" ml="വിദഗ്ധരെ കാണുക" /> <ArrowUpRight size={16} />
                </span>
              </Link>
            </div>

            <div className="ward-block" style={{ marginTop: 64 }}>
              <div>
                <span className="eyebrow">
                  <T en="OUR HOME" ml="നമ്മുടെ നാട്" />
                </span>
                <h2 className="page-title">
                  <T en="Find your way around." ml="വഴികളും ഇടങ്ങളും അറിയാം." />
                </h2>
                <p className="page-lead">
                  <T
                    en="Localities, roads, landmarks, and public spaces will be added when verified. For now, explore the area using OpenStreetMap."
                    ml="ഉളിയിലിലെ പ്രധാന പ്രദേശങ്ങളും റോഡുകളും മാപ്പിൽ നേരിട്ട് പരിശോധിക്കാം."
                  />
                </p>
                <a className="btn btn-forest" href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                  <T en="Explore Uliyil on OpenStreetMap" ml="ഓപ്പൺസ്ട്രീറ്റ് മാപ്പിൽ ഉളിയിൽ കാണാം" /> <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="ward-map">
                <MapPin size={43} />
                <strong>
                  <T en="Uliyil, Iritty" ml="ഉളിയിൽ, ഇരിട്ടി" />
                </strong>
                <span>
                  <T en="Kannur · Kerala · India" ml="കണ്ണൂർ · കേരളം · ഇന്ത്യ" />
                </span>
                <small>
                  <T en="Interactive map opens on OpenStreetMap" ml="മാപ്പ് കാണാൻ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക" />
                </small>
              </div>
            </div>

            <div style={{ marginTop: 80 }}>
              <h2 className="page-title">
                <T en="Institutions & public places" ml="സ്ഥാപനങ്ങളും പൊതു ഇടങ്ങളും" />
              </h2>
              <p className="page-lead">
                <T
                  en="Anganwadis, schools, health centres, libraries, community halls, and places of worship."
                  ml="അംഗൻവാടികൾ, സ്കൂളുകൾ, ആരോഗ്യ കേന്ദ്രങ്ങൾ, വായനശാലകൾ, ആരാധനാലയങ്ങൾ."
                />
              </p>
              {institutions.length ? (
                <div className="card-grid">
                  {institutions.map((i) => (
                    <article className="info-card" key={i.id}>
                      <span className="card-icon">
                        <Building2 />
                      </span>
                      <h3>{i.title}</h3>
                      <p>{i.body}</p>
                      <small>{i.locality}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title="Verified institutions will appear here"
                  titleMl="സ്ഥാപനങ്ങളുടെ വിവരങ്ങൾ ഉടൻ ചേർക്കും"
                  description="We don't publish unconfirmed institution names, addresses, or private contacts."
                  descriptionMl="സ്ഥിരീകരിച്ച സ്ഥാപനങ്ങളുടെ പേരും വിലാസവും ഇവിടെ പ്രസിദ്ധീകരിക്കുന്നതാണ്."
                />
              )}
            </div>

            <div style={{ marginTop: 80 }}>
              <h2 className="page-title">
                <T en="Community organisations" ml="സാമൂഹിക കൂട്ടായ്മകൾ" />
              </h2>
              <p className="page-lead">
                <T
                  en="Kudumbashree units, resident groups, ASHA workers, clubs and community committees."
                  ml="കുടുംബശ്രീ യൂണിറ്റുകൾ, റസിഡന്റ്സ് അസോസിയേഷനുകൾ, ആശാ വർക്കർമാർ, ക്ലബ്ബുകൾ."
                />
              </p>
              {organisations.length ? (
                <div className="card-grid">
                  {organisations.map((i) => (
                    <article className="info-card" key={i.id}>
                      <span className="card-icon">
                        <Users />
                      </span>
                      <h3>{i.title}</h3>
                      <p>{i.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title="Community groups are being gathered"
                  titleMl="കൂട്ടായ്മകളുടെ വിവരങ്ങൾ ശേഖരിച്ചുവരുന്നു"
                  description="Verified organisations will be added by authorised administrators."
                  descriptionMl="അംഗീകൃത ക്ലബ്ബുകളുടെയും സംഘടനകളുടെയും വിവരങ്ങൾ ഉടൻ ലഭ്യമാകും."
                />
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'academic') {
    const eduCats = ['Schools', 'Tuition centres', 'Training centres', 'Libraries', 'Educational services'];
    let rows: { id: string; name: string; description: string; category: string; locality: string; phone: string }[] = [];
    try {
      rows = await db
        .select({
          id: listings.id,
          name: listings.name,
          description: listings.description,
          category: listings.category,
          locality: listings.locality,
          phone: listings.phone
        })
        .from(listings)
        .where(
          and(
            eq(listings.status, 'approved'),
            or(...eduCats.map((c) => ilike(listings.category, `%${c}%`)))!
          )
        )
        .limit(100);
    } catch (err) {
      console.warn('Academic query skipped:', err);
    }

    return (
      <main>
        <section className="inner-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="ACADEMIC DIRECTORY · SCHOOLS & LIBRARIES" ml="വിദ്യാഭ്യാസ ഡയറക്ടറി · സ്കൂളുകളും ലൈബ്രറികളും" />
            </span>
            <h1>
              <T en="Academic" ml="വിദ്യാഭ്യാസ" />{' '}
              <em>
                <T en="Directory." ml="ഡയറക്ടറി." />
              </em>
            </h1>
            <p>
              <T
                en="Browse approved schools, tuition centres, training institutes, and libraries in and around Uliyil."
                ml="ഉളിയിലിലെ സ്കൂളുകൾ, ട്യൂഷൻ സെന്ററുകൾ, വായനശാലകൾ, പരിശീലന കേന്ദ്രങ്ങൾ എന്നിവയുടെ ഡയറക്ടറി."
              />
            </p>
            <div className="hero-glance">
              <span><T en={`${rows.length} Verified Listings`} ml={`${rows.length} സ്ഥാപനങ്ങൾ`} /></span>
              <span><T en="Schools • Tuition • Libraries" ml="സ്കൂളുകൾ • ട്യൂഷൻ • വായനശാലകൾ" /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container">
            <h2 className="page-title">
              <T en="Academic directory" ml="വിദ്യാഭ്യാസ ഡയറക്ടറി" />
            </h2>
            <p className="page-lead">
              <T
                en="Only approved listings with permission to share their public contact details are shown."
                ml="അനുമതിയോടെ പ്രസിദ്ധീകരിച്ച വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ മാത്രമാണ് ഇവിടെ കാണിക്കുന്നത്."
              />
            </p>
            {rows.length ? (
              <div className="card-grid">
                {rows.map((r) => (
                  <article className="info-card" key={r.id}>
                    <span className="card-icon">
                      <BookOpen />
                    </span>
                    <h3>{r.name}</h3>
                    <p>{r.description}</p>
                    <small>
                      {r.category} · {r.locality}
                    </small>
                    <a className="card-action" href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>
                      <T en="Call" ml="വിളിക്കുക" /> <Phone size={15} />
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="No academic listings yet"
                titleMl="വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ ഇതുവരെ ചേർത്തിട്ടില്ല"
                description="Verified schools and learning services will appear once submitted and reviewed."
                descriptionMl="പരിശോധനയ്ക്ക് ശേഷം സ്കൂളുകളുടെയും ട്യൂഷൻ സെന്ററുകളുടെയും വിവരങ്ങൾ ഇവിടെ കാണാം."
              />
            )}
            <Link className="btn btn-forest" style={{ marginTop: 25 }} href="/hello-uliyil#join">
              <T en="List an educational service" ml="ഒരു വിദ്യാഭ്യാസ സ്ഥാപനം ചേർക്കുക" /> <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'helping-hand') {
    const helpCats = [
      'Ambulance providers',
      'Hospitals',
      'Clinics',
      'Auto-rickshaw drivers',
      'Taxi drivers',
      'Electricians',
      'Plumbers',
      'Mechanics'
    ];
    let rows: { id: string; name: string; category: string; locality: string; phone: string }[] = [];
    try {
      rows = await db
        .select({
          id: listings.id,
          name: listings.name,
          category: listings.category,
          locality: listings.locality,
          phone: listings.phone
        })
        .from(listings)
        .where(
          and(
            eq(listings.status, 'approved'),
            or(...helpCats.map((c) => ilike(listings.category, `%${c}%`)))!
          )
        )
        .limit(100);
    } catch (err) {
      console.warn('Helping-hand query skipped:', err);
    }

    return (
      <main>
        <section className="inner-hero dark-hero">
          <div className="container">
            <span className="eyebrow">
              ✳ &nbsp; <T en="HELPING HAND · EMERGENCY & HEALTH" ml="സഹായ ഹസ്തം · അടിയന്തര സഹായം" />
            </span>
            <h1>
              <T en="Emergency &" ml="അടിയന്തര" />{' '}
              <em>
                <T en="Helping Hand." ml="സഹായ കേന്ദ്രങ്ങൾ." />
              </em>
            </h1>
            <p>
              <T
                en="Tap to call 112 / 108 / 101 helplines plus approved local ambulances, hospitals, auto drivers & technicians."
                ml="112, 108, 101 അടിയന്തര ഹെൽപ്പ്‌ലൈൻ നമ്പറുകളും പ്രാദേശിക ആംബുലൻസ്, ആശുപത്രി, ഓട്ടോ സഹായ കേന്ദ്രങ്ങളും."
              />
            </p>
            <div className="hero-glance">
              <span><T en="112 • 108 • 101 Direct Call" ml="112 • 108 • 101" /></span>
              <span><T en={`${rows.length} Local Helpers`} ml={`${rows.length} പ്രാദേശിക സഹായികൾ`} /></span>
            </div>
          </div>
        </section>
        <section className="page-section">
          <div className="container">
            <h2 className="page-title">
              <T en="Emergency numbers" ml="അടിയന്തര ഹെൽപ്പ്‌ലൈൻ നമ്പറുകൾ" />
            </h2>
            <p className="page-lead">
              <T
                en="These are national or Kerala-wide helplines, not Uliyil-specific providers. Availability may vary."
                ml="കേരളത്തിലും ഇന്ത്യയിലുടനീളവും ലഭ്യമാകുന്ന പ്രധാന എമർജൻസി നമ്പറുകൾ."
              />
            </p>
            <div className="card-grid">
              {site.emergencyContacts.map((c) => (
                <article className="info-card emergency-card" key={c.number}>
                  <span className="card-icon">
                    <HeartPulse />
                  </span>
                  <h3>
                    <T en={c.name} ml={c.nameMl} />
                  </h3>
                  <p>
                    <T en={c.scope} ml={c.scopeMl} />
                  </p>
                  <a className="btn btn-forest" href={`tel:${c.number}`}>
                    <Phone size={16} /> <T en={`Call ${c.number}`} ml={`${c.number} വിളിക്കുക`} />
                  </a>
                </article>
              ))}
            </div>
            <h2 className="page-title" style={{ marginTop: 80 }}>
              <T en="Local helping hands" ml="പ്രാദേശിക സഹായ സേവനങ്ങൾ" />
            </h2>
            <p className="page-lead">
              <T
                en="These contacts are published only with permission after review."
                ml="അനുമതിയോടും പരിശോധനയോടും കൂടി പ്രസിദ്ധീകരിച്ച പ്രാദേശിക നമ്പറുകൾ."
              />
            </p>
            {rows.length ? (
              <div className="card-grid">
                {rows.map((r) => (
                  <article className="info-card" key={r.id}>
                    <span className="card-icon">
                      <Phone />
                    </span>
                    <h3>{r.name}</h3>
                    <p>
                      {r.category} · {r.locality}
                    </p>
                    <a className="card-action" href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>
                      <T en="Call provider" ml="വിളിക്കുക" /> <ArrowUpRight size={15} />
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="Local contacts coming soon"
                titleMl="പ്രാദേശിക നമ്പറുകൾ ഉടൻ ചേർക്കും"
                description="Verified local providers will appear here after they consent to publication and are approved."
                descriptionMl="ആംബുലൻസ്, ആശുപത്രി, ഓട്ടോ, ടെക്നീഷ്യൻ വിവരങ്ങൾ അംഗീകരിക്കുന്നതനുസരിച്ച് ഇവിടെ ദൃശ്യമാകും."
              />
            )}
          </div>
        </section>
      </main>
    );
  }

  return null;
}
