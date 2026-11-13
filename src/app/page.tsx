import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  MapPin,
  MoveDown,
  Megaphone,
  Search,
  HeartHandshake,
  Construction,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Compass,
  CalendarDays,
  Camera,
  BriefcaseBusiness,
  Store
} from 'lucide-react';
import { site } from '@/lib/config';
import { Portrait } from '@/components/Portrait';
import { T } from '@/components/Translated';
import { db } from '@/db';
import { contentEntries } from '@/db/schema';
import { and, eq, or, isNull, gt, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let notices: { title: string }[] = [];
  try {
    notices = await db
      .select({ title: contentEntries.title })
      .from(contentEntries)
      .where(
        and(
          eq(contentEntries.type, 'announcement'),
          eq(contentEntries.status, 'published'),
          or(isNull(contentEntries.expiresAt), gt(contentEntries.expiresAt, new Date()))
        )
      )
      .orderBy(desc(contentEntries.publishedAt))
      .limit(2);
  } catch (err) {
    console.warn('Database query skipped:', err);
  }

  return (
    <main>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(7,32,27,.81) 0%,rgba(9,34,29,.55) 48%,rgba(11,37,30,.15) 100%),linear-gradient(0deg,rgba(6,30,25,.55),transparent 35%),url('${site.imagery.hero}')`
        }}
      >
        <div className="hero-noise" />
        <div className="hero-content container">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="pulse-dot" /> <T en="ULIYIL" ml="ഉളിയിൽ" /> <span className="kicker-sep">·</span>{' '}
              <T en="WARD 19" ml="വാർഡ് 19" /> <span className="kicker-sep">•</span>{' '}
              <T en="YOUR COMMUNITY" ml="നമ്മുടെ സമൂഹം" />
            </div>
            <h1>
              <T en="Our Place." ml="നമ്മുടെ നാട്." />
              <br />
              <em>
                <T en="Our People." ml="നമ്മുടെ ആളുകൾ." />
              </em>
            </h1>
            <p className="hero-sub">
              <T en="Everything happening in Uliyil," ml="ഉളിയിലിലെ ഓരോ വിശേഷവും," />
              <br />
              <T en="all in one beautiful place." ml="ഒരിടത്ത് മനോഹരമായി." />
            </p>
            <div className="hero-slogan">
              ✳ &nbsp;
              <T en={site.slogan} ml={site.sloganMl} />
            </div>
            <div className="hero-buttons">
              <a href="#hello-uliyil" className="btn btn-lime">
                <T en="Explore My Uliyil" ml="മൈ ഉളിയിൽ കാണാം" /> <ArrowUpRight size={18} />
              </a>
              <Link href="/councillor" className="btn btn-glass">
                <T en="Meet Your Councillor" ml="കൗൺസിലറെ പരിചയപ്പെടാം" /> <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="hero-loc">
              <MapPin size={15} />{' '}
              <T en="Iritty Municipality · Kannur District · Kerala" ml="ഇരിട്ടി നഗരസഭ · കണ്ണൂർ ജില്ല · കേരളം" />
            </div>
          </div>

          <div className="hero-float">
            <div className="float-top">
              <span className="float-icon">✳</span>
              <span>
                <T en="HERE FOR OUR COMMUNITY" ml="നമ്മുടെ നാടിനായി എന്നും" />
              </span>
            </div>
            <div className="float-body">
              <Portrait className="float-portrait" />
              <div>
                <small>
                  <T en="WARD COUNCILLOR" ml="വാർഡ് കൗൺസിലർ" />
                </small>
                <strong>
                  <T en={site.councillor.name} ml={site.councillor.nameMl} />
                </strong>
                <a href={`tel:${site.councillor.phone}`}>
                  <Phone size={14} /> 94975 30282
                </a>
              </div>
            </div>
            <Link href="/councillor" className="float-footer">
              <T en="Get to know your councillor" ml="കൗൺസിലറെ അടുത്തറിയൂ" /> <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="hero-bottom container">
          <a href="#discover" className="scroll-cue">
            <span className="scroll-circle">
              <MoveDown size={17} />
            </span>
            <span>
              <T en="SCROLL TO DISCOVER" ml="കൂടുതൽ കാണാൻ താഴോട്ട് സ്ക്രോൾ ചെയ്യൂ" />
            </span>
          </a>
          <div className="hero-count">
            <span>
              01 <i /> 05
            </span>
            <span>
              <T en="THE DIGITAL HEART OF ULIYIL" ml="ഉളിയിലിന്റെ ഡിജിറ്റൽ ഹൃദയം" />
            </span>
          </div>
        </div>
      </section>

      <div className="notice-strip">
        <div className="container notice-inner">
          <div className="notice-label">
            <Megaphone size={18} /> <T en="COMMUNITY NOTE" ml="പ്രധാന അറിയിപ്പ്" />
          </div>
          <div className="notice-text">
            {notices.length ? (
              notices.map((n) => n.title).join('   •   ')
            ) : (
              <T
                en="A new way to stay connected is here. Verified ward announcements will appear in this space."
                ml="ഉളിയിലുമായി എന്നും ചേർന്നിരിക്കാനുള്ള പുത്തൻ വേദി. സ്ഥിരീകരിച്ച വാർഡ് അറിയിപ്പുകൾ ഇവിടെ കാണാം."
              />
            )}
          </div>
          <Link href="/announcements">
            <T en="View updates" ml="അറിയിപ്പുകൾ കാണാം" /> <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Mobile-First Irresistible 5 Important Links Hub */}
      <section className="mobile-spotlight" aria-label="Quick explore links">
        <div className="container">
          <div className="spotlight-head">
            <span className="eyebrow">
              ✳ <T en="QUICK EXPLORE" ml="പ്രധാന വിഭാഗങ്ങൾ" />
            </span>
            <h2>
              <T en="Tap to open Uliyil" ml="ഒരു ടാപ്പിൽ ഉളിയിൽ" />
            </h2>
          </div>

          <Link href="/hello-uliyil" className="spotlight-hero-card">
            <div className="spot-icon-wrap lime">
              <Search size={22} />
            </div>
            <div className="spot-copy">
              <span className="spot-badge">
                <T en="LOCAL DIRECTORY" ml="പ്രാദേശിക ഡയറക്ടറി" />
              </span>
              <strong>
                <T en="Hello Uliyil" ml="ഹലോ ഉളിയിൽ" />
              </strong>
              <small>
                <T en="Shops, autos, workers & local contacts" ml="കടകൾ, ഓട്ടോകൾ, തൊഴിലാളികൾ & സേവനങ്ങൾ" />
              </small>
            </div>
            <span className="spot-arrow">
              <ArrowUpRight size={20} />
            </span>
          </Link>

          <div className="spotlight-grid">
            <Link href="/development" className="spotlight-tile tile-project">
              <div className="spot-tile-top">
                <span className="spot-mini-icon">
                  <Construction size={20} />
                </span>
                <ArrowUpRight size={17} />
              </div>
              <strong>
                <T en="Project" ml="വികസന പദ്ധതികൾ" />
              </strong>
              <small>
                <T en="Ward works & progress" ml="വാർഡിലെ വികസന വിവരങ്ങൾ" />
              </small>
            </Link>

            <Link href="/gallery" className="spotlight-tile tile-gallery">
              <div className="spot-tile-top">
                <span className="spot-mini-icon">
                  <Camera size={20} />
                </span>
                <ArrowUpRight size={17} />
              </div>
              <strong>
                <T en="Gallery" ml="ഗാലറി & വീഡിയോ" />
              </strong>
              <small>
                <T en="Photos & community videos" ml="ചിത്രങ്ങളും വീഡിയോകളും" />
              </small>
            </Link>

            <Link href="/professionals" className="spotlight-tile tile-pros">
              <div className="spot-tile-top">
                <span className="spot-mini-icon">
                  <BriefcaseBusiness size={20} />
                </span>
                <span className="spot-pill-new">★ NEW</span>
              </div>
              <strong>
                <T en="Professionals" ml="പ്രൊഫഷണലുകൾ" />
              </strong>
              <small>
                <T en="Doctors, engineers & experts" ml="ഡോക്ടർമാർ, എഞ്ചിനീയർമാർ & വിദഗ്ധർ" />
              </small>
            </Link>

            <Link href="/ward" className="spotlight-tile tile-explore">
              <div className="spot-tile-top">
                <span className="spot-mini-icon">
                  <Compass size={20} />
                </span>
                <span className="spot-pill-new">★</span>
              </div>
              <strong>
                <T en="Explore Uliyil" ml="ഉളിയിലിനെ അറിയാം" />
              </strong>
              <small>
                <T en="History, past leaders & nearest" ml="ചരിത്രം, മുൻ കൗൺസിലർമാർ & സമീപ കടകൾ" />
              </small>
            </Link>
          </div>
        </div>
      </section>

      <section id="discover" className="intro-section section-pad">
        <div className="container intro-grid">
          <div className="intro-left">
            <span className="eyebrow">
              <span className="eyebrow-line" /> <T en="WELCOME TO MY ULIYIL" ml="മൈ ഉളിയിലിലേക്ക് സ്വാഗതം" />
            </span>
            <h2>
              <T en="A little place." ml="ചെറിയൊരു നാട്." />
              <br />
              <em>
                <T en="A lot of heart." ml="വലിയൊരു മനസ്സ്." />
              </em>
            </h2>
          </div>
          <div className="intro-right">
            <p>
              <T
                en="Every neighbourhood has a story. Ours is written by the people who live here — in everyday kindness, familiar faces, and the small things that make Uliyil feel like home."
                ml="ഓരോ നാടിനും ഒരു കഥ പറയാനുണ്ട്. ഉളിയിലിന്റെ കഥ എഴുതുന്നത് ഇവിടുത്തെ മനുഷ്യരാണ് — പരസ്പര സ്നേഹവും കരുതലും നമ്മുടെ നാടിനെ എന്നും ഒരു കുടുംബമായി ചേർത്തുനിർത്തുന്നു."
              />
            </p>
            <p>
              <T
                en="My Uliyil brings our people, services and shared future closer together."
                ml="മൈ ഉളിയിൽ നമ്മുടെ നാട്ടുകാരെയും സേവനങ്ങളെയും പൊതു ഭാവിയെയും കൂടുതൽ അടുപ്പിക്കുന്നു."
              />
            </p>
            <Link href="/ward" className="text-link">
              <T en="Discover our community" ml="നമ്മുടെ നാടിനെ അടുത്തറിയാം" /> <ArrowUpRight size={22} />
            </Link>
          </div>
        </div>

        <div className="container stats-row">
          <div>
            <span className="stat-icon">
              <MapPin size={19} />
            </span>
            <strong>
              <T en="One community" ml="ഒരൊറ്റ സമൂഹം" />
            </strong>
            <small>
              <T en="Many stories, one home" ml="പല കഥകൾ, ഒരു നാട്" />
            </small>
          </div>
          <div>
            <span className="stat-icon">
              <HeartHandshake size={19} />
            </span>
            <strong>
              <T en="People first" ml="നാട്ടുകാർക്ക് മുൻഗണന" />
            </strong>
            <small>
              <T en="Made for every resident" ml="ഓരോ താമസക്കാരനും വേണ്ടി" />
            </small>
          </div>
          <div>
            <span className="stat-icon">
              <Sparkles size={19} />
            </span>
            <strong>
              <T en="Better together" ml="ഒരുമയോടെ മുന്നോട്ട്" />
            </strong>
            <small>
              <T en="Building what comes next" ml="നല്ലൊരു നാളെക്കായി ഒന്നിക്കാം" />
            </small>
          </div>
        </div>
      </section>

      <section className="directory-promo">
        <div className="promo-image" style={{ backgroundImage: `url('${site.imagery.landscape}')` }}>
          <div className="photo-caption">
            <T en="A glimpse of Kerala · illustrative landscape photography" ml="കേരളത്തിന്റെ പ്രകൃതിഭംഗി · പ്രതീകാത്മക ചിത്രം" />
          </div>
        </div>
        <div className="promo-panel">
          <span className="eyebrow light">
            ✳ &nbsp; <T en="INTRODUCING HELLO ULIYIL" ml="ഹലോ ഉളിയിൽ അവതരിപ്പിക്കുന്നു" />
          </span>
          <h2>
            <T en="Good neighbours." ml="നല്ല അയൽക്കാർ." />
            <br />
            <em>
              <T en="Great connections." ml="മികച്ച ബന്ധങ്ങൾ." />
            </em>
          </h2>
          <p>
            <T
              en="Need a nearby shop, a ride, or someone to fix that leaky tap? Find the people and services that keep our community moving."
              ml="അടുത്തുള്ള കടയോ, യാത്രയ്ക്ക് ഒരു ഓട്ടോയോ, അറ്റകുറ്റപ്പണികൾക്ക് ഒരു വിദഗ്ധനെയോ ആവശ്യമുണ്ടോ? നമ്മുടെ നാടിനെ ചലിപ്പിക്കുന്ന സേവനങ്ങൾ ഇവിടെ കണ്ടെത്തൂ."
            />
          </p>
          <div className="promo-search">
            <Search size={21} />
            <span>
              <T en="Who can we help you find?" ml="നിങ്ങൾക്ക് ആരെയാണ് കണ്ടെത്തേണ്ടത്?" />
            </span>
            <a href="#hello-uliyil" aria-label="Search directory">
              <ArrowUpRight size={21} />
            </a>
          </div>
          <div className="promo-chips">
            <span>
              ✳ <T en="Local shops" ml="നാട്ടിലെ കടകൾ" />
            </span>
            <span>
              ↗ <T en="Transport" ml="യാത്രാ സൗകര്യം" />
            </span>
            <span>
              ✦ <T en="Home services" ml="വീട്ടുസേവനങ്ങൾ" />
            </span>
          </div>
          <a href="#hello-uliyil" className="btn btn-lime">
            <T en="Explore Hello Uliyil" ml="ഹലോ ഉളിയിൽ കാണാം" /> <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <section className="ways-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> <T en="HERE TO MAKE LIFE EASIER" ml="ജീവിതം എളുപ്പമാക്കാൻ" />
              </span>
              <h2>
                <T en="Everything you need," ml="ആവശ്യമുള്ളതെല്ലാം," />
                <br />
                <em>
                  <T en="closer to home." ml="വീടിനടുത്ത് തന്നെ." />
                </em>
              </h2>
            </div>
            <p>
              <T
                en="Simple tools and useful information, designed around the everyday needs of our community."
                ml="നമ്മുടെ നാട്ടുകാരുടെ നിത്യജീവിത ആവശ്യങ്ങൾക്കായി ഒരുക്കിയ ലളിതമായ വിവരങ്ങളും സേവനങ്ങളും."
              />
            </p>
          </div>

          <div className="ways-grid">
            <Link href="/services" className="way-card way-mint">
              <div className="way-top">
                <span className="way-number">
                  01 / <T en="SERVICES" ml="സേവനങ്ങൾ" />
                </span>
                <ArrowUpRight size={22} />
              </div>
              <div className="way-art art-services">
                <span>✳</span>
                <span>⌁</span>
              </div>
              <div className="way-bottom">
                <span className="way-icon">
                  <Compass size={22} />
                </span>
                <h3>
                  <T en="Find the right" ml="ശരിയായ സേവനം" />
                  <br />
                  <T en="service." ml="കണ്ടെത്തൂ." />
                </h3>
                <p>
                  <T
                    en="Helpful guidance for government services and everyday essentials."
                    ml="സർക്കാർ സേവനങ്ങൾക്കും നിത്യോപയോഗ ആവശ്യങ്ങൾക്കുമുള്ള വഴികാട്ടി."
                  />
                </p>
              </div>
            </Link>

            <Link href="/report" className="way-card way-cream">
              <div className="way-top">
                <span className="way-number">
                  02 / <T en="YOUR VOICE" ml="നിങ്ങളുടെ ശബ്ദം" />
                </span>
                <ArrowUpRight size={22} />
              </div>
              <div className="way-art art-issue">
                <span>↗</span>
                <span>●</span>
              </div>
              <div className="way-bottom">
                <span className="way-icon">
                  <Megaphone size={22} />
                </span>
                <h3>
                  <T en="Make your" ml="നിങ്ങളുടെ അഭിപ്രായം" />
                  <br />
                  <T en="voice heard." ml="പങ്കുവയ്ക്കൂ." />
                </h3>
                <p>
                  <T
                    en="Report an issue or share what matters in your neighbourhood."
                    ml="പരാതികൾ അറിയിക്കാനും നാട്ടിലെ പ്രശ്നങ്ങൾ ശ്രദ്ധയിൽപ്പെടുത്താനും."
                  />
                </p>
              </div>
            </Link>

            <Link href="/development" className="way-card way-dark">
              <div className="way-top">
                <span className="way-number">
                  03 / <T en="OUR FUTURE" ml="നമ്മുടെ ഭാവി" />
                </span>
                <ArrowUpRight size={22} />
              </div>
              <div className="way-art art-future">
                <span>◌</span>
                <span>✷</span>
              </div>
              <div className="way-bottom">
                <span className="way-icon">
                  <Construction size={22} />
                </span>
                <h3>
                  <T en="See what's" ml="നടക്കുന്ന വികസനം" />
                  <br />
                  <T en="taking shape." ml="നേരിൽ കാണൂ." />
                </h3>
                <p>
                  <T
                    en="Follow verified updates on community development and progress."
                    ml="വാർഡിലെ വികസന പ്രവർത്തനങ്ങളുടെ കൃത്യമായ വിവരങ്ങൾ പിന്തുടരൂ."
                  />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="councillor-section section-pad">
        <div className="container councillor-grid">
          <div className="councillor-visual">
            <div className="councillor-frame">
              <Portrait className="councillor-photo" src={site.councillor.archPortrait} />
              <span className="portrait-note">
                <T en="Shabna Teacher · Ward 19 Councillor" ml="ശബ്ന ടീച്ചർ · വാർഡ് 19 കൗൺസിലർ" />
              </span>
            </div>
            <div className="councillor-badge">
              ✳{' '}
              <span>
                <T en="WITH YOU," ml="നിങ്ങളോടൊപ്പം," />
                <br />
                <T en="FOR ULIYIL." ml="ഉളിയിലിനായി." />
              </span>
            </div>
          </div>

          <div className="councillor-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" />{' '}
              <T en="A NOTE FROM YOUR COUNCILLOR" ml="കൗൺസിലറുടെ സന്ദേശം" />
            </span>
            <h2>
              <T en="Building a" ml="കൂടുതൽ മികവോടെ" />
              <br />
              <em>
                <T en="more connected" ml="ചേർന്നുനിൽക്കുന്ന" />
              </em>
              <br />
              <T en="Uliyil." ml="ഉളിയിലിനായി." />
            </h2>
            <div className="quote-mark">“</div>
            <blockquote>
              <T en={site.councillor.welcome} ml={site.councillor.welcomeMl} />
            </blockquote>
            <div className="signature">
              <strong>
                <T en={site.councillor.name} ml={site.councillor.nameMl} />
              </strong>
              <span>
                <T en="Ward Councillor · Uliyil" ml="വാർഡ് കൗൺസിലർ · ഉളിയിൽ" />
              </span>
            </div>
            <div className="councillor-actions">
              <Link href="/councillor" className="btn btn-forest">
                <T en="Meet Shabna Teacher" ml="ശബ്ന ടീച്ചറെ അറിയാം" /> <ArrowUpRight size={17} />
              </Link>
              <a className="round-link" href={`tel:${site.councillor.phone}`} aria-label="Call councillor">
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="community-band"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(8,47,39,.91),rgba(8,47,39,.35)),url('${site.imagery.hills}')`
        }}
      >
        <div className="container community-band-inner">
          <div>
            <span className="eyebrow light">
              <T en="THE WARD IDEA BOX" ml="വാർഡ് ആശയപ്പെട്ടി" />
            </span>
            <h2>
              <T en="Your ideas can make" ml="നിങ്ങളുടെ ആശയങ്ങൾ" />
              <br />
              <em>
                <T en="this place even better." ml="നാടിനെ കൂടുതൽ മികച്ചതാക്കും." />
              </em>
            </h2>
            <p>
              <T
                en="Big or small, every idea deserves a place to begin."
                ml="ചെറുതോ വലുതോ ആകട്ടെ, ഓരോ നല്ല നിർദ്ദേശവും വിലപ്പെട്ടതാണ്."
              />
            </p>
          </div>
          <Link href="/ideas" className="btn btn-lime">
            <T en="Share an idea" ml="ആശയം പങ്കുവയ്ക്കാം" /> <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <section className="explore-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> <T en="MORE TO EXPLORE" ml="കൂടുതൽ അറിയാം" />
              </span>
              <h2>
                <T en="A community in" ml="നിറപ്പകിട്ടോടെ" />
                <br />
                <em>
                  <T en="full colour." ml="നമ്മുടെ സമൂഹം." />
                </em>
              </h2>
            </div>
            <Link href="/gallery" className="text-link">
              <T en="View community gallery" ml="കമ്മ്യൂണിറ്റി ഗാലറി കാണാം" /> <ArrowUpRight size={20} />
            </Link>
          </div>

          <div className="explore-grid">
            <Link
              href="/gallery"
              className="explore-photo"
              style={{
                backgroundImage: `linear-gradient(0deg,rgba(8,33,27,.7),transparent 70%),url('${site.imagery.community}')`
              }}
            >
              <span>
                <T en="COMMUNITY MOMENTS" ml="സാമൂഹിക നിമിഷങ്ങൾ" />
              </span>
              <strong>
                <T en="Moments that" ml="നമ്മളെ ഒന്നാക്കുന്ന" />
                <br />
                <T en="bring us together." ml="സുന്ദര നിമിഷങ്ങൾ." />
              </strong>
              <ArrowUpRight size={26} />
            </Link>

            <div className="explore-stack">
              <Link href="/professionals">
                <div className="explore-mini-icon">
                  <BriefcaseBusiness size={23} />
                </div>
                <div>
                  <small>
                    <T en="WARD EXPERTS" ml="വാർഡിലെ വിദഗ്ധർ" />
                  </small>
                  <h3>
                    <T en="Ward Professionals" ml="പ്രൊഫഷണലുകൾ" />
                  </h3>
                  <p>
                    <T
                      en="Meet doctors, engineers, teachers, advocates and specialists from Uliyil."
                      ml="ഉളിയിലിലെ ഡോക്ടർമാർ, എഞ്ചിനീയർമാർ, അധ്യാപകർ, അഭിഭാഷകർ തുടങ്ങിയവരെ പരിചയപ്പെടൂ."
                    />
                  </p>
                </div>
                <ChevronRight size={21} />
              </Link>

              <Link href="/nearest">
                <div className="explore-mini-icon">
                  <Store size={23} />
                </div>
                <div>
                  <small>
                    <T en="ULIYIL & IRITTY" ml="ഉളിയിലും ഇരിട്ടിയും" />
                  </small>
                  <h3>
                    <T en="Nearest Shops & Services" ml="സമീപത്തെ കടകളും സേവനങ്ങളും" />
                  </h3>
                  <p>
                    <T
                      en="Top shops, supermarkets, hospitals & hubs in Iritty and around Uliyil."
                      ml="ഇരിട്ടിയിലെയും പരിസരത്തെയും പ്രമുഖ സ്ഥാപനങ്ങളും കടകളും."
                    />
                  </p>
                </div>
                <ChevronRight size={21} />
              </Link>

              <Link href="/announcements">
                <div className="explore-mini-icon">
                  <CalendarDays size={23} />
                </div>
                <div>
                  <small>
                    <T en="STAY IN THE KNOW" ml="അപ്‌ഡേറ്റുകൾ അറിയാം" />
                  </small>
                  <h3>
                    <T en="Announcements" ml="പ്രധാന അറിയിപ്പുകൾ" />
                  </h3>
                  <p>
                    <T
                      en="Verified news and notices from around the ward."
                      ml="വാർഡിലെ സ്ഥിരീകരിച്ച വാർത്തകളും അറിയിപ്പുകളും."
                    />
                  </p>
                </div>
                <ChevronRight size={21} />
              </Link>

              <Link href="/helping-hand">
                <div className="explore-mini-icon">
                  <HeartHandshake size={23} />
                </div>
                <div>
                  <small>
                    <T en="WHEN YOU NEED IT" ml="അടിയന്തര ഘട്ടങ്ങളിൽ" />
                  </small>
                  <h3>
                    <T en="Helping Hand" ml="സഹായ ഹസ്തം" />
                  </h3>
                  <p>
                    <T
                      en="Important contacts, help and emergency numbers."
                      ml="അത്യാവശ്യ നമ്പറുകളും എമർജൻസി സഹായ കേന്ദ്രങ്ങളും."
                    />
                  </p>
                </div>
                <ChevronRight size={21} />
              </Link>

              <Link href="/ward">
                <div className="explore-mini-icon">
                  <MapPin size={23} />
                </div>
                <div>
                  <small>
                    <T en="GET TO KNOW US" ml="നമ്മുടെ ചരിത്രവും ഇടങ്ങളും" />
                  </small>
                  <h3>
                    <T en="Explore Uliyil & History" ml="ഉളിയിലിനെയും ചരിത്രത്തെയും അറിയാം" />
                  </h3>
                  <p>
                    <T
                      en="Uliyil's history, former councillors, local places and institutions."
                      ml="ഉളിയിലിന്റെ ചരിത്രം, മുൻ കൗൺസിലർമാർ, സ്ഥാപനങ്ങൾ, കൂട്ടായ്മകൾ."
                    />
                  </p>
                </div>
                <ChevronRight size={21} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="closing-strip">
        <div className="container">
          <span>
            <ShieldCheck size={19} />{' '}
            <T en="A community platform built on trust." ml="വിശ്വാസത്തിലധിഷ്ഠിതമായ ഒരു നാട്ടുപൊതുവേദി." />
          </span>
          <span>
            <T en="Local. Connected. Together." ml="നാട്. ബന്ധങ്ങൾ. ഒരുമ." /> <ArrowRight size={17} />
          </span>
        </div>
      </section>
    </main>
  );
}
