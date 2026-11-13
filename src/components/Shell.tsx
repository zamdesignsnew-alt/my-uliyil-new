'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
  Globe2,
  Phone,
  Compass,
  Search,
  Camera,
  Users,
  MapPin,
  ArrowRight,
  Construction,
  BriefcaseBusiness
} from 'lucide-react';
import { site } from '@/lib/config';
import { useLanguage } from './Translated';
import { HelloOverlay } from './HelloOverlay';
import { ScrollReveal } from './ScrollReveal';

const nav = [
  { en: 'Home', ml: 'ഹോം', href: '/' },
  { en: 'Councillor', ml: 'കൗൺസിലർ', href: '/councillor' },
  { en: 'Services', ml: 'സേവനങ്ങൾ', href: '/services' },
  { en: 'Professionals', ml: 'വിദഗ്ധർ', href: '/professionals' },
  { en: 'Nearest', ml: 'സമീപം', href: '/nearest' },
  { en: 'Projects', ml: 'പദ്ധതികൾ', href: '/development' },
  { en: 'Gallery', ml: 'ഗാലറി', href: '/gallery' },
  { en: 'Explore', ml: 'അറിയൂ ഉളിയിൽ', href: '/ward' }
];

const drawerLinks = [
  { en: 'Home', ml: 'ഹോം', href: '/' },
  { en: 'Hello Uliyil Directory', ml: 'ഹലോ ഉളിയിൽ ഡയറക്ടറി', href: '/hello-uliyil' },
  { en: 'Ward Professionals ★', ml: 'വാർഡ് പ്രൊഫഷണലുകൾ ★', href: '/professionals' },
  { en: 'Development & Projects', ml: 'വികസന പദ്ധതികൾ', href: '/development' },
  { en: 'Gallery & Videos', ml: 'ഗാലറി & വീഡിയോകൾ', href: '/gallery' },
  { en: 'Explore Uliyil ★', ml: 'ഉളിയിലിനെ അറിയാം ★', href: '/ward' },
  { en: 'Uliyil History & Videos', ml: 'ഉളിയിലിന്റെ ചരിത്രം & വീഡിയോ', href: '/history' },
  { en: 'Former Councillors', ml: 'മുൻ കൗൺസിലർമാർ', href: '/former-councillors' },
  { en: 'Nearest (Iritty & Shops)', ml: 'സമീപ കടകൾ (ഇരിട്ടി & ഉളിയിൽ)', href: '/nearest' },
  { en: 'Meet Shabna Teacher', ml: 'കൗൺസിലറെ പരിചയപ്പെടാം', href: '/councillor' },
  { en: 'Government Services', ml: 'സർക്കാർ സേവനങ്ങൾ', href: '/services' },
  { en: 'Announcements', ml: 'അറിയിപ്പുകൾ', href: '/announcements' },
  { en: 'Helping Hand (112 / 108)', ml: 'സഹായ ഹസ്തം (അടിയന്തര നമ്പറുകൾ)', href: '/helping-hand' },
  { en: 'Academic Directory', ml: 'വിദ്യാഭ്യാസ ഡയറക്ടറി', href: '/academic' },
  { en: 'Ward Idea Box', ml: 'ആശയപ്പെട്ടി', href: '/ideas' },
  { en: 'Report an Issue', ml: 'പരാതി അറിയിക്കുക', href: '/report' },
  { en: 'Track Request Status', ml: 'പരാതിയുടെ തൽസ്ഥിതി അറിയുക', href: '/track' }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const lang = useLanguage();

  useEffect(() => {
    setDark(localStorage.getItem('uliyil-theme') === 'dark');
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('uliyil-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode', next);
  }

  function toggleLang() {
    const next = lang === 'en' ? 'ml' : 'en';
    localStorage.setItem('uliyil-lang', next);
    window.dispatchEvent(new Event('uliyil-language'));
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', dark);
  }, [dark]);

  const ml = lang === 'ml';

  return (
    <>
      <ScrollReveal />
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="My Uliyil home">
            <span className="brand-mark">
              <span />
            </span>
            <span>
              my <strong>uliyil</strong>
              <small>{ml ? 'ഉളിയിലിന്റെ ഡിജിറ്റൽ ഹൃദയം' : 'THE DIGITAL HEART OF ULIYIL'}</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                className={path === item.href ? 'active' : ''}
                href={item.href}
                key={item.href}
              >
                {ml ? item.ml : item.en}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/hello-uliyil" className="hello-link">
              {ml ? 'ഹലോ ഉളിയിൽ' : 'Hello Uliyil'} <ArrowUpRight size={14} />
            </Link>
            <button onClick={toggleLang} className="icon-control language-control" aria-label="Change language">
              <Globe2 size={16} />
              <span>{ml ? 'EN' : 'മല'}</span>
            </button>
            <button onClick={toggleTheme} className="icon-control theme-control" aria-label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link className="report-link" href="/report">
              {ml ? 'പരാതി അറിയിക്കുക' : 'Report an issue'} <ArrowUpRight size={15} />
            </Link>
            <button className="mobile-menu icon-control" onClick={() => setOpen(!open)} aria-label="Open menu">
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-drawer">
          <div className="drawer-links">
            {drawerLinks.map((item) => (
              <Link onClick={() => setOpen(false)} href={item.href} key={item.href}>
                {ml ? item.ml : item.en}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </div>
          <div className="drawer-bottom">
            <button onClick={toggleLang}>
              {ml ? 'ഭാഷ: മലയാളം (Switch to English)' : 'Language: English (മലയാളത്തിലേക്ക്)'}
            </button>
            <button onClick={toggleTheme}>
              {ml ? (dark ? 'ലൈറ്റ് മോഡ്' : 'ഡാർക്ക് മോഡ്') : dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}

      {children}

      <HelloOverlay />

      <footer className="footer">
        <div className="footer-top">
          <div>
            <span className="eyebrow light">{ml ? 'നമ്മുടെ സ്വന്തം ഇടം' : 'A PLACE TO BELONG'}</span>
            <h2>
              {ml ? (
                <>
                  ഒരുമിച്ച് നടന്നാൽ
                  <br />
                  <em>നാളെ കൂടുതൽ മനോഹരം.</em>
                </>
              ) : (
                <>
                  Our future looks
                  <br />
                  <em>better together.</em>
                </>
              )}
            </h2>
            <p>
              {ml
                ? 'ഉളിയിലിലെ ആളുകളുമായും സ്ഥലങ്ങളുമായും പുത്തൻ സാധ്യതകളുമായും എന്നും ചേർന്നിരിക്കൂ.'
                : 'Stay connected to the people, places, and possibilities shaping Uliyil.'}
            </p>
            <Link className="btn btn-lime" href="/hello-uliyil">
              {ml ? 'ഹലോ ഉളിയിൽ കാണാം' : 'Explore Hello Uliyil'} <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="footer-graphic">
            ഉളിയിൽ<span>✳</span>
          </div>
        </div>

        <div className="footer-grid">
          <div>
            <Link href="/" className="brand footer-brand">
              <span className="brand-mark">
                <span />
              </span>
              <span>
                my <strong>uliyil</strong>
                <small>{ml ? 'ഉളിയിൽ · വാർഡ് 19 · ഇരിട്ടി നഗരസഭ' : 'ULIYIL · WARD 19 · IRITTY MUNICIPALITY'}</small>
              </span>
            </Link>
            <p>
              {ml
                ? 'ഉളിയിൽ വാർഡ് 19 · ഇരിട്ടി നഗരസഭ · കണ്ണൂർ ജില്ല · കേരളം.'
                : 'Uliyil Ward 19 · Iritty Municipality · Kannur District · Kerala.'}
            </p>
            <p className="footer-slogan">{ml ? site.sloganMl : site.slogan}</p>
          </div>

          <div>
            <h4>{ml ? 'പര്യവേക്ഷണം ചെയ്യാം' : 'Explore'}</h4>
            <Link href="/hello-uliyil">{ml ? 'ഹലോ ഉളിയിൽ' : 'Hello Uliyil'}</Link>
            <Link href="/professionals">{ml ? 'വാർഡ് പ്രൊഫഷണലുകൾ' : 'Ward professionals'}</Link>
            <Link href="/nearest">{ml ? 'സമീപ കടകൾ (ഇരിട്ടി)' : 'Nearest shops & Iritty'}</Link>
            <Link href="/development">{ml ? 'വികസന പദ്ധതികൾ' : 'Development'}</Link>
            <Link href="/ward">{ml ? 'നമ്മുടെ വാർഡ്' : 'Explore Uliyil'}</Link>
            <Link href="/history">{ml ? 'ഉളിയിലിന്റെ ചരിത്രം' : 'Uliyil history'}</Link>
          </div>

          <div>
            <h4>{ml ? 'പങ്കാളിയാകൂ' : 'Get involved'}</h4>
            <Link href="/councillor">{ml ? 'കൗൺസിലറെ കാണാം' : 'Councillor & past leaders'}</Link>
            <Link href="/services">{ml ? 'സർക്കാർ സേവനങ്ങൾ' : 'Services'}</Link>
            <Link href="/ideas">{ml ? 'വാർഡ് ആശയപ്പെട്ടി' : 'Ward idea box'}</Link>
            <Link href="/report">{ml ? 'പരാതി അറിയിക്കുക' : 'Report an issue'}</Link>
            <Link href="/announcements">{ml ? 'അറിയിപ്പുകൾ' : 'Announcements'}</Link>
            <Link href="/helping-hand">{ml ? 'സഹായ ഹസ്തം' : 'Helping hand'}</Link>
            <Link href="/gallery">{ml ? 'ഗാലറി & വീഡിയോ' : 'Gallery'}</Link>
            <Link href="/academic">{ml ? 'വിദ്യാഭ്യാസ ഡയറക്ടറി' : 'Academic directory'}</Link>
          </div>

          <div>
            <h4>{ml ? 'ബന്ധപ്പെടുക' : 'Connect'}</h4>
            <a href={`tel:${site.councillor.phone}`}>
              <Phone size={14} /> 94975 30282
            </a>
            <a href={`mailto:${site.councillor.email}`}>{site.councillor.email}</a>
            <div className="social-row">
              <a href={site.councillor.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Users size={18} />
              </a>
              <a href={site.councillor.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Camera size={18} />
              </a>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Map">
                <MapPin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-base">
          <span>
            © {new Date().getFullYear()} {ml ? 'മൈ ഉളിയിൽ · ഉളിയിൽ വാർഡ് 19 · ഇരിട്ടി നഗരസഭ · കണ്ണൂർ' : 'My Uliyil · Uliyil Ward 19 · Iritty Municipality · Kannur District · Kerala'}
          </span>
          <span>{ml ? site.sloganMl : site.slogan}</span>
          <Link href="/admin">
            {ml ? 'അഡ്മിൻ' : 'Admin'} <ArrowRight size={13} />
          </Link>
        </div>
      </footer>

      <nav className="mobile-bottom" aria-label="Mobile quick links">
        <Link href="/hello-uliyil" className={path === '/hello-uliyil' ? 'active' : ''}>
          <Search size={19} />
          <span>{ml ? 'ഹലോ ഉളിയിൽ' : 'Hello Uliyil'}</span>
        </Link>
        <Link href="/development" className={path === '/development' ? 'active' : ''}>
          <Construction size={19} />
          <span>{ml ? 'പദ്ധതികൾ' : 'Project'}</span>
        </Link>
        <Link href="/gallery" className={path === '/gallery' ? 'active' : ''}>
          <Camera size={19} />
          <span>{ml ? 'ഗാലറി' : 'Gallery'}</span>
        </Link>
        <Link href="/professionals" className={`pro-tab ${path === '/professionals' ? 'active' : ''}`}>
          <BriefcaseBusiness size={19} />
          <span>{ml ? 'വിദഗ്ധർ' : 'Professionals'}</span>
        </Link>
        <Link
          href="/ward"
          className={
            path === '/ward' || path === '/history' || path === '/nearest' || path === '/former-councillors' ? 'active' : ''
          }
        >
          <Compass size={19} />
          <span>{ml ? 'ഉളിയിൽ' : 'Explore'}</span>
        </Link>
      </nav>
    </>
  );
}
