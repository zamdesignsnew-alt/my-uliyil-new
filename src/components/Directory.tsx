'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowUpRight,
  Check,
  Phone,
  MessageCircle,
  MapPin,
  Store,
  CarFront,
  Wrench,
  HeartPulse,
  GraduationCap,
  BriefcaseBusiness,
  BadgeCheck,
  CircleHelp,
  Navigation,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';
import { categories, categoryMl } from '@/lib/config';
import { formatTelHref, formatWhatsAppUrl } from '@/lib/contact';
import { T, useLanguage } from './Translated';

type Listing = {
  id: string;
  name: string;
  type: string;
  phone: string;
  whatsapp: string | null;
  category: string;
  locality: string;
  address: string | null;
  description: string;
  availability: string | null;
  mapUrl: string | null;
  imageUrl: string | null;
  verified: boolean;
};

const groups = [
  {
    name: 'Shops & commerce',
    nameMl: 'കടകളും വ്യാപാരവും',
    icon: Store,
    match: ['Grocery', 'Bakeries', 'Medical shops', 'Hardware', 'Electrical shops', 'Mobile shops', 'Tailoring', 'Printing', 'Beauty', 'Repair shops', 'Other local']
  },
  {
    name: 'Transport',
    nameMl: 'യാത്രാ സൗകര്യങ്ങൾ',
    icon: CarFront,
    match: ['Auto-', 'Taxi', 'Car rental', 'Other transport']
  },
  {
    name: 'Home & repair',
    nameMl: 'വീട്ടുസേവനങ്ങൾ & റിപ്പയർ',
    icon: Wrench,
    match: ['Electricians', 'Plumbers', 'Mechanics', 'Painters', 'Carpenters', 'Appliance', 'Construction', 'Cleaning']
  },
  {
    name: 'Health & emergency',
    nameMl: 'ആരോഗ്യം & അടിയന്തര സഹായം',
    icon: HeartPulse,
    match: ['Hospitals', 'Clinics', 'Pharmacies', 'Ambulance', 'Other health']
  },
  {
    name: 'Education',
    nameMl: 'വിദ്യാഭ്യാസം',
    icon: GraduationCap,
    match: ['Schools', 'Tuition', 'Training', 'Libraries', 'Educational']
  },
  {
    name: 'People & services',
    nameMl: 'വ്യക്തികളും സേവനങ്ങളും',
    icon: BriefcaseBusiness,
    match: ['Freelancers', 'Startups', 'Home-based', 'Local professionals', 'Other services']
  }
];

export function Directory({ onBack }: { onBack?: () => void }) {
  const lang = useLanguage();
  const ml = lang === 'ml';

  const [items, setItems] = useState<Listing[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const listingsRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (groupName: string) => {
    const next = filter === groupName ? 'All' : groupName;
    setFilter(next);
    if (next !== 'All') {
      setTimeout(() => {
        const target = listingsRef.current;
        if (!target) return;
        const isCompact = typeof window !== 'undefined' && window.innerWidth <= 900;
        target.scrollIntoView({
          behavior: 'smooth',
          block: isCompact ? 'start' : 'nearest'
        });
      }, 50);
    }
  };
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [nearby, setNearby] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/listings?q=' + encodeURIComponent(query));
        const rows = await res.json();
        if (active) setItems(Array.isArray(rows) ? rows : []);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const visible = items.filter(
    (i) =>
      (filter === 'All' ||
        groups.find((g) => g.name === filter)?.match.some((m) => i.category.toLowerCase().includes(m.toLowerCase()))) &&
      (!nearby || i.locality.toLowerCase().includes(nearby.toLowerCase()))
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (selectedCats.length === 0) {
      setError(ml ? 'ദയവായി കുറഞ്ഞത് ഒരു വിഭാഗമെങ്കിലും തിരഞ്ഞെടുക്കുക.' : 'Please select at least one category for your listing.');
      return;
    }

    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    payload.consent = form.get('consent') === 'on';
    payload.category = selectedCats;

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmittedId(data.id);
      setMessage(
        ml
          ? `നന്ദി! നിങ്ങളുടെ റെഫറൻസ് നമ്പർ: ${data.id}. പരിശോധനയ്ക്ക് ശേഷം ലിസ്റ്റിംഗ് പ്രസിദ്ധീകരിക്കും.`
          : `Thank you! Your listing reference is ${data.id}. It is pending review and is not public yet.`
      );
      setSelectedCats([]);
      e.currentTarget.reset();
      setTimeout(() => {
        document.getElementById('listing-success-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : ml ? 'സമർപ്പിക്കാനായില്ല' : 'Unable to submit');
    } finally {
      setSubmitting(false);
    }
  }

  function requestLocation() {
    navigator.geolocation?.getCurrentPosition(
      () => {
        const answer = window.prompt(
          ml
            ? 'ലൊക്കേഷൻ അനുമതി ലഭിച്ചു. അടുത്തുള്ളവ കാണാൻ നിങ്ങളുടെ പ്രദേശത്തിന്റെ പേര് നൽകൂ:'
            : 'Location access granted. Enter your locality to filter nearby listings (precise coordinates are not stored):'
        );
        if (answer) setNearby(answer);
      },
      () =>
        setError(
          ml
            ? 'ലൊക്കേഷൻ അനുമതി ലഭിച്ചില്ല. പകരം സ്ഥലത്തിന്റെ പേര് ഉപയോഗിച്ച് തിരയാം.'
            : 'Location access was not granted. You can search by locality instead.'
        ),
      { enableHighAccuracy: false, timeout: 7000 }
    );
  }

  const activeFilterName =
    filter === 'All'
      ? ml
        ? 'എല്ലാ വിഭാഗങ്ങളും'
        : 'All categories'
      : ml
      ? groups.find((g) => g.name === filter)?.nameMl || filter
      : filter;

  return (
    <main className="directory-root">
      <section className="inner-hero dark-hero directory-hero">
        <div className="container">
          <span className="eyebrow">
            ✳ &nbsp; <T en="HELLO ULIYIL · LOCAL SHOPS, AUTO & SERVICES" ml="ഹലോ ഉളിയിൽ · പ്രാദേശിക സേവന ഡയറക്ടറി" />
          </span>
          <h1>
            <T en="Hello Uliyil" ml="ഹലോ ഉളിയിൽ —" />{' '}
            <em>
              <T en="Local Directory." ml="സേവനങ്ങൾ കണ്ടെത്തൂ." />
            </em>
          </h1>
          <p>
            <T
              en="Find local shops, auto & taxi drivers, plumbers, electricians, schools & health contacts around Uliyil."
              ml="കടകൾ, ഓട്ടോ-ടാക്സി, പ്ലംബർ, ഇലക്ട്രീഷ്യൻ, സ്കൂളുകൾ, ആരോഗ്യ കേന്ദ്രങ്ങൾ — എല്ലാം ഒരിടത്ത് തിരയൂ."
            />
          </p>
          <div className="hero-glance">
            <span><T en="Shops & Auto" ml="കടകളും ഓട്ടോയും" /></span>
            <span><T en="Home Repair" ml="വീട്ടുസേവനങ്ങൾ" /></span>
            <span><T en="Health & Schools" ml="ആരോഗ്യവും വിദ്യാഭ്യാസവും" /></span>
          </div>
          <div className="search-bar hero-search">
            <Search size={22} />
            <input
              aria-label="Search local listings"
              placeholder={ml ? 'സേവനം, കട, അല്ലെങ്കിൽ സ്ഥലം തിരയുക...' : 'Search a service, business, or locality...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}>
              {ml ? 'തിരയുക ↗' : 'Search ↗'}
            </button>
          </div>
          <div className="directory-hero-actions">
            <button onClick={requestLocation}>
              <Navigation size={15} /> {ml ? 'അടുത്തുള്ളവ കണ്ടെത്തുക' : 'Find nearby'}
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => document.getElementById('listing-form-card')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
            >
              <Plus size={15} /> {ml ? 'നിങ്ങളുടെ സേവനം ചേർക്കുക' : 'List your service'}
            </button>
            {onBack && (
              <button className="back-directory" onClick={onBack}>
                {ml ? '← മടങ്ങുക' : '← Back'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="page-section" id="results">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> <T en="EXPLORE THE DIRECTORY" ml="ഡയറക്ടറി പരിശോധിക്കുക" />
              </span>
              <h2>
                <T en="Find exactly who" ml="ആവശ്യമുള്ളവരെ" />
                <br />
                <em>
                  <T en="you need." ml="കൃത്യമായി കണ്ടെത്തൂ." />
                </em>
              </h2>
            </div>
            <p>
              <T
                en="Listings appear only after review and permission to publish. Call or message providers directly — no account needed."
                ml="അനുമതിയും പരിശോധനയും പൂർത്തിയായ ശേഷമാണ് വിവരങ്ങൾ പ്രസിദ്ധീകരിക്കുന്നത്. അക്കൗണ്ട് ഇല്ലാതെ തന്നെ നേരിട്ട് വിളിക്കാം."
              />
            </p>
          </div>

          <div className="category-tiles">
            {groups.map((g) => {
              const isActive = filter === g.name;
              return (
                <button
                  type="button"
                  className={isActive ? 'active' : ''}
                  aria-pressed={isActive}
                  onClick={() => handleCategorySelect(g.name)}
                  key={g.name}
                >
                  <g.icon size={27} strokeWidth={1.5} />
                  <span>{ml ? g.nameMl : g.name}</span>
                  {isActive ? <Check size={15} strokeWidth={2.5} /> : <ArrowUpRight size={15} />}
                </button>
              );
            })}
          </div>

          <div className="directory-filter-line" id="directory-listings" ref={listingsRef}>
            <div className="directory-filter-status">
              <span className={filter !== 'All' || nearby ? 'directory-active-pill' : ''}>
                {nearby ? (ml ? `സ്ഥലം: ${nearby}` : `Showing locality: ${nearby}`) : activeFilterName}
              </span>
              <span className="directory-count">
                {visible.length}{' '}
                {ml
                  ? 'അംഗീകൃത ലിസ്റ്റിംഗുകൾ'
                  : `approved listing${visible.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="directory-filter-actions">
              {nearby && (
                <button type="button" onClick={() => setNearby('')}>
                  {ml ? 'സ്ഥലം മാറ്റുക' : 'Clear locality'} <X size={13} />
                </button>
              )}
              <button type="button" onClick={() => setFilter('All')}>
                {ml ? 'എല്ലാം കാണിക്കുക' : 'Show all'} <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>{ml ? 'അംഗീകൃത വിവരങ്ങൾ തിരയുന്നു...' : 'Searching approved listings...'}</p>
            </div>
          ) : visible.length ? (
            <div className="card-grid">
              {visible.map((item) => (
                <article className="listing-card" key={item.id}>
                  {item.imageUrl && (
                    <img className="listing-cover" src={item.imageUrl} alt={`${item.name} listing image`} loading="lazy" />
                  )}
                  <div className="listing-top">
                    <div className="listing-avatar">
                      <Store size={23} />
                    </div>
                    {item.verified && (
                      <span className="pill">
                        <BadgeCheck size={13} /> {ml ? 'പരിശോധിച്ചത്' : 'Reviewed'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <small>
                      {item.category} · {item.locality}
                    </small>
                  </div>
                  <p>{item.description}</p>
                  {item.availability && (
                    <small>
                      {ml ? 'സമയം:' : 'Available:'} {item.availability}
                    </small>
                  )}
                  <div className="listing-actions">
                    <a href={formatTelHref(item.phone)}>
                      <Phone size={14} />{' '}
                      {ml
                        ? item.category.includes('Auto-rickshaw')
                          ? 'ഓട്ടോ വിളിക്കൂ'
                          : 'വിളിക്കൂ'
                        : `Call ${item.category.includes('Auto-rickshaw') ? 'Auto Driver' : 'Now'}`}
                    </a>
                    {item.whatsapp && (
                      <a
                        className="wa-action"
                        href={formatWhatsAppUrl(item.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={14} /> {ml ? 'വാട്സ്ആപ്പ്' : 'WhatsApp'}
                      </a>
                    )}
                    {item.mapUrl && (
                      <a href={item.mapUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin size={14} /> {ml ? 'മാപ്പ്' : 'Map'}
                      </a>
                    )}
                    <Link href={`/report?kind=listing-report&listing=${item.id}`}>
                      {ml ? 'റിപ്പോർട്ട്' : 'Report listing'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <CircleHelp size={35} />
              <h3>{ml ? 'ഈ വിഭാഗത്തിൽ വിവരങ്ങൾ ഇതുവരെ ചേർത്തിട്ടില്ല.' : 'No approved listings here yet.'}</h3>
              <p>
                {ml
                  ? 'നമ്മുടെ കമ്മ്യൂണിറ്റി ഡയറക്ടറി വളർന്നുകൊണ്ടിരിക്കുകയാണ്. ആദ്യമായി നിങ്ങളുടെ സേവനം ചേർക്കൂ അല്ലെങ്കിൽ മറ്റൊരു വിഭാഗം പരിശോധിക്കൂ.'
                  : 'Our community directory is growing. Be the first to share a local service, or try another category or locality. We never publish unverified sample businesses.'}
              </p>
              <button
                className="btn btn-forest"
                onClick={() => {
                  setShowForm(true);
                  setTimeout(() => document.getElementById('listing-form-card')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
              >
                {ml ? 'നിങ്ങളുടെ സേവനം ചേർക്കൂ' : 'List your service'} <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="page-section alt" id="join">
        <div className="container split-form">
          <aside className="side-panel">
            <span className="eyebrow light">
              ✳ &nbsp; <T en="JOIN THE DIRECTORY" ml="ഡയറക്ടറിയിൽ പങ്കുചേരൂ" />
            </span>
            <h2>
              <T en="Let your neighbours find you." ml="അയൽക്കാർ നിങ്ങളെ കണ്ടെത്തട്ടെ." />
            </h2>
            <p>
              <T
                en="Own a business or provide a local service? Submit your details for review. Your contact information is displayed only if you explicitly consent and the listing is approved."
                ml="നിങ്ങൾക്ക് ഒരു സ്ഥാപനമോ പ്രാദേശിക സേവനമോ ഉണ്ടോ? വിവരങ്ങൾ നൽകൂ. നിങ്ങളുടെ സമ്മതത്തോടെയും പരിശോധനയ്ക്ക് ശേഷവും മാത്രമേ വിവരങ്ങൾ പ്രസിദ്ധീകരിക്കുകയുള്ളൂ."
              />
            </p>
            <p>
              <ShieldCheck size={17} />{' '}
              <T en="Your listing stays private until approved." ml="അംഗീകാരം ലഭിക്കുന്നത് വരെ വിവരങ്ങൾ സുരക്ഷിതമായിരിക്കും." />
            </p>
            <button
              className="btn btn-lime"
              onClick={() => {
                const n = !showForm;
                setShowForm(n);
                if (n) setTimeout(() => document.getElementById('listing-form-card')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
            >
              {showForm ? (ml ? 'ഫോം മറയ്ക്കുക' : 'Hide form') : ml ? 'സേവനം ചേർക്കുക' : 'List your service'}{' '}
              <ArrowUpRight size={16} />
            </button>
            <Link href="/report?kind=correction">
              <T en="Request a correction or removal" ml="തിരുത്തലുകളോ ഒഴിവാക്കലോ അഭ്യർത്ഥിക്കുക" /> <ArrowUpRight size={14} />
            </Link>
          </aside>

          <div>
            {submittedId ? (
              <div className="form-card" id="listing-success-card">
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <ShieldCheck size={52} color="#276c4b" style={{ margin: '0 auto 16px' }} />
                  <h2 className="page-title" style={{ fontSize: 28, marginBottom: 10 }}>
                    {ml ? 'പരിശോധനയ്ക്കായി സമർപ്പിച്ചു' : 'Listing Submitted for Review'}
                  </h2>
                  <p className="page-lead" style={{ margin: '0 auto 20px', maxWidth: 500 }}>
                    {ml
                      ? 'നന്ദി! നിങ്ങളുടെ സ്ഥാപനത്തിന്റെ വിവരങ്ങൾ പരിശോധനയ്ക്കായി ലഭിച്ചു. റെഫറൻസ് നമ്പർ:'
                      : 'Thank you! Your business/service details have been saved for review. Reference number:'}
                  </p>
                  <div className="success-box" style={{ maxWidth: 450, margin: '0 auto 24px', textAlign: 'center' }}>
                    <code style={{ fontSize: 14, fontWeight: 700, wordBreak: 'break-all' }}>{submittedId}</code>
                  </div>
                  <p style={{ fontSize: 13, color: '#557260', marginBottom: 24 }}>
                    {ml
                      ? 'വാർഡ് മോഡറേറ്റർമാരുടെ അംഗീകാരത്തിന് ശേഷം ഹലോ ഉളിയിലിൽ ഇത് പ്രദർശിപ്പിക്കും.'
                      : 'Your listing will appear in Hello Uliyil once approved by our ward moderators.'}
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-forest"
                      onClick={() => {
                        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {ml ? 'ഡയറക്ടറി കാണാം' : 'Explore Directory'} <ArrowUpRight size={16} />
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setSubmittedId(null);
                        setShowForm(true);
                      }}
                    >
                      {ml ? 'മറ്റൊന്ന് ചേർക്കുക' : 'Submit Another Listing'}
                    </button>
                  </div>
                </div>
              </div>
            ) : showForm ? (
              <div className="form-card" id="listing-form-card">
                <h2 className="page-title">{ml ? 'പുതിയ ലിസ്റ്റിംഗ് ചേർക്കുക' : 'Submit a listing'}</h2>
                <p className="page-lead">
                  {ml
                    ? '* അടയാളപ്പെടുത്തിയവ നിർബന്ധമാണ്. പരിശോധനയ്ക്ക് ശേഷമാണ് പ്രസിദ്ധീകരിക്കുക.'
                    : 'All fields marked * are required. Your listing will be reviewed before publication.'}
                </p>
                <form onSubmit={submit} className="form-grid">
                  <div className="field">
                    <label>{ml ? 'ലിസ്റ്റിംഗ് തരം *' : 'Listing type *'}</label>
                    <select name="type" required>
                      <option value="business">{ml ? 'ബിസിനസ്സ് / കട' : 'Business'}</option>
                      <option value="individual">{ml ? 'വ്യക്തിഗത സേവനദാതാവ്' : 'Individual service provider'}</option>
                      <option value="institution">{ml ? 'വിദ്യാഭ്യാസ സ്ഥാപനം' : 'Academic institution'}</option>
                    </select>
                  </div>

                  <div className="field full">
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{ml ? 'വിഭാഗം (ഒന്നോ അതിലധികമോ തിരഞ്ഞെടുക്കാം) *' : 'Category (select one or more) *'}</span>
                      {selectedCats.length > 0 && (
                        <span style={{ fontSize: 11, color: '#276c4b', fontWeight: 700 }}>
                          {selectedCats.length} {ml ? 'തിരഞ്ഞെടുത്തു' : 'selected'}
                        </span>
                      )}
                    </label>
                    <div className="multi-cat-container">
                      {selectedCats.length > 0 && (
                        <div className="selected-tags" aria-label="Selected categories">
                          {selectedCats.map((cat) => (
                            <span key={cat} className="cat-tag">
                              {ml ? categoryMl[cat] || cat : cat}
                              <button
                                type="button"
                                onClick={() => setSelectedCats((prev) => prev.filter((c) => c !== cat))}
                                aria-label={`Remove ${cat}`}
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <select
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !selectedCats.includes(val)) {
                            setSelectedCats((prev) => [...prev, val]);
                          }
                        }}
                        aria-label="Add category"
                      >
                        <option value="">{ml ? '+ വിഭാഗം തിരഞ്ഞെടുക്കുക...' : '+ Choose category to add...'}</option>
                        {categories.map((c) => (
                          <option key={c} value={c} disabled={selectedCats.includes(c)}>
                            {selectedCats.includes(c)
                              ? `✓ ${ml ? categoryMl[c] || c : c} (${ml ? 'ചേർത്തു' : 'added'})`
                              : ml
                              ? categoryMl[c] || c
                              : c}
                          </option>
                        ))}
                      </select>
                      <small style={{ fontSize: 11, color: '#577761' }}>
                        {ml
                          ? '💡 നിങ്ങൾക്ക് ഒന്നിലധികം വിഭാഗങ്ങൾ ചേർക്കാവുന്നതാണ് (ഉദാ: ഇലക്ട്രീഷ്യൻ, പ്ലംബർ).'
                          : '💡 You can select multiple categories (e.g. Electricians and Plumbers). Click ✕ on a badge to remove.'}
                      </small>
                    </div>
                  </div>

                  <div className="field">
                    <label>{ml ? 'സ്ഥാപനത്തിന്റെ അല്ലെങ്കിൽ സേവനത്തിന്റെ പേര് *' : 'Business or public display name *'}</label>
                    <input
                      name="name"
                      required
                      minLength={2}
                      maxLength={160}
                      placeholder={ml ? 'ഉദാ: ഉളിയിൽ ഓട്ടോ സ്റ്റാൻഡ്' : 'e.g. Uliyil Auto Stand or Royal Bakery'}
                    />
                  </div>

                  <div className="field">
                    <label>{ml ? 'ബന്ധപ്പെടേണ്ട വ്യക്തിയുടെ പേര്' : "Contact person's name"}</label>
                    <input name="contactName" maxLength={160} placeholder={ml ? 'ഉടമയുടെ അല്ലെങ്കിൽ മാനേജരുടെ പേര്' : 'Owner or manager name'} />
                  </div>

                  <div className="field">
                    <label>{ml ? 'ഫോൺ നമ്പർ *' : 'Public phone number *'}</label>
                    <input name="phone" type="tel" required placeholder={ml ? '10 അക്ക ഫോൺ നമ്പർ' : '10-digit phone number'} />
                  </div>

                  <div className="field">
                    <label>{ml ? 'വാട്സ്ആപ്പ് നമ്പർ' : 'WhatsApp number'}</label>
                    <input name="whatsapp" type="tel" placeholder={ml ? 'നിർബന്ധമില്ല' : 'Optional 10-digit number'} />
                  </div>

                  <div className="field">
                    <label>{ml ? 'ഉളിയിലിലെ പ്രദേശം / സ്ഥലം *' : 'Locality in Uliyil *'}</label>
                    <input
                      name="locality"
                      required
                      placeholder={ml ? 'ഉദാ: ഉളിയിൽ ടൗൺ, കുളിക്കടവ്' : 'e.g. Uliyil Town, Kulikkadavu, Thilanoor'}
                    />
                  </div>

                  <div className="field">
                    <label>{ml ? 'പ്രവർത്തന സമയം' : 'Availability / hours'}</label>
                    <input name="availability" placeholder={ml ? 'ഉദാ: രാവിലെ 9 മുതൽ വൈകിട്ട് 8 വരെ' : 'e.g. Mon–Sat, 8 am–8 pm or 24/7'} />
                  </div>

                  <div className="field full">
                    <label>{ml ? 'വിലാസം / ലാൻഡ്മാർക്ക്' : 'Address / Landmark'}</label>
                    <input name="address" placeholder={ml ? 'ബസ് സ്റ്റോപ്പിന് സമീപം, മുതലായവ' : 'Near bus stop, Opp. Juma Masjid, etc.'} />
                  </div>

                  <div className="field full">
                    <label>{ml ? 'നൽകുന്ന സേവനങ്ങളെക്കുറിച്ച് വിവരിക്കുക *' : 'What do you offer? *'}</label>
                    <textarea
                      name="description"
                      required
                      minLength={10}
                      maxLength={1200}
                      placeholder={
                        ml
                          ? 'നിങ്ങളുടെ ഉൽപ്പന്നങ്ങളെയും സേവനങ്ങളെയും കുറിച്ച് ഇവിടെ ചുരുക്കി വിവരിക്കുക...'
                          : 'Describe your products, services, specializations or fares so neighbours know how you can help them...'
                      }
                    />
                  </div>

                  <div className="field">
                    <label>{ml ? 'ലോഗോ / ചിത്രം URL (നിർബന്ധമില്ല)' : 'Optional image or logo URL'}</label>
                    <input type="url" name="imageUrl" placeholder="https://..." />
                    <small>{ml ? 'നിങ്ങൾക്ക് സ്വന്തമായുള്ള ചിത്രത്തിന്റെ ലിങ്ക് നൽകുക.' : 'Use an image you own or have permission to publish.'}</small>
                  </div>

                  <div className="field">
                    <label>{ml ? 'ഗൂഗിൾ മാപ്പ് ലിങ്ക് (നിർബന്ധമില്ല)' : 'Optional map URL'}</label>
                    <input type="url" name="mapUrl" placeholder="https://maps.google.com/..." />
                  </div>

                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />

                  <div className="field full">
                    <div className="verification-box">
                      <div className="verification-header">
                        <ShieldCheck size={20} color="#1b633f" />
                        <span>{ml ? 'പരിശോധനയും സമർപ്പണവും' : 'VERIFICATION & SUBMISSION'}</span>
                      </div>
                      <p className="verification-subtitle">
                        {ml
                          ? 'വ്യാജ വിവരങ്ങൾ തടയുന്നതിനും സുരക്ഷ ഉറപ്പാക്കുന്നതിനുമായി എല്ലാ അപേക്ഷകളും മോഡറേറ്റർമാരുടെ പരിശോധനയ്ക്ക് ശേഷമാണ് പ്രസിദ്ധീകരിക്കുന്നത്.'
                          : 'To protect community safety and prevent spam, all submissions require confirmation before review by Uliyil ward moderators.'}
                      </p>

                      <label className="verification-check-card">
                        <input type="checkbox" name="consent" required />
                        <span>
                          <strong>{ml ? 'സമ്മതപത്രം:' : 'I confirm and consent:'}</strong>{' '}
                          {ml
                            ? 'നൽകിയിട്ടുള്ള പേര്, ഫോൺ നമ്പർ, വിവരങ്ങൾ എന്നിവ പൊതുവായി പ്രസിദ്ധീകരിക്കാൻ എനിക്ക് പൂർണ്ണ അനുമതിയുണ്ട് എന്ന് ഞാൻ ഉറപ്പുനൽകുന്നു. *'
                            : 'I have full permission to publish this business/service name, phone number, and details. I agree to public display on My Uliyil after moderator review. *'}
                        </span>
                      </label>

                      <button type="submit" className="btn btn-forest submit-btn-prominent" disabled={submitting}>
                        {submitting ? (
                          ml ? 'സമർപ്പിക്കുന്നു...' : 'Submitting your listing...'
                        ) : (
                          <>
                            <span>
                              {ml ? 'പരിശോധനയ്ക്കായി സമർപ്പിക്കുക' : 'Submit Listing for Review & Verification'}
                            </span>
                            <ArrowUpRight size={18} />
                          </>
                        )}
                      </button>

                      <div className="trust-badges">
                        <span>
                          <ShieldCheck size={13} color="#2b754b" /> {ml ? '100% സൗജന്യം' : '100% Free Listing'}
                        </span>
                        <span>•</span>
                        <span>
                          <BadgeCheck size={13} color="#2b754b" /> {ml ? 'വാർഡ് മോഡറേറ്റർ പരിശോധന' : 'Ward Moderator Reviewed'}
                        </span>
                        <span>•</span>
                        <span>{ml ? 'ഉടൻ റെഫറൻസ് ഐഡി' : 'Instant Reference ID'}</span>
                      </div>

                      {message && (
                        <div
                          style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 8,
                            background: '#dcf1df',
                            color: '#185338',
                            fontSize: 13,
                            fontWeight: 600,
                            textAlign: 'center'
                          }}
                          role="status"
                        >
                          {message}
                        </div>
                      )}
                      {error && (
                        <div
                          style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 8,
                            background: '#fae7e5',
                            color: '#9e2b20',
                            fontSize: 13,
                            fontWeight: 600,
                            textAlign: 'center'
                          }}
                          role="alert"
                        >
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="join-invite">
                <Store size={44} />
                <h3>{ml ? 'നാട്ടുകാർ നിങ്ങളെ തിരയുന്നുണ്ട്.' : 'Your community is looking for you.'}</h3>
                <p>
                  {ml
                    ? 'കടകൾ, ഡ്രൈവർമാർ, കലാകാരന്മാർ, തൊഴിലാളികൾ — എല്ലാവർക്കും ഇവിടെ ഇടമുണ്ട്.'
                    : "Shops, drivers, makers, professionals, helpers — there's a place for you here."}
                </p>
                <button className="btn btn-forest" onClick={() => setShowForm(true)}>
                  {ml ? 'നിങ്ങളുടെ ബിസിനസ്സ് ചേർക്കുക' : 'List your business'} <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
