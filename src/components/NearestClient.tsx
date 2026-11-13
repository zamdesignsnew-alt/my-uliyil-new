'use client';
import { useState } from 'react';
import { Store, Search, Phone, MessageCircle, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { nearestTowns } from '@/lib/config';
import { formatTelHref, formatWhatsAppUrl } from '@/lib/contact';
import { T, useLanguage } from './Translated';

export type NearestPlace = {
  id: string;
  name: string;
  town: string;
  category: string;
  logoUrl: string | null;
  distanceNote: string | null;
  phone: string | null;
  whatsapp: string | null;
  mapUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
};

export function NearestClient({ initialPlaces }: { initialPlaces: NearestPlace[] }) {
  const lang = useLanguage();
  const ml = lang === 'ml';

  const [query, setQuery] = useState('');
  const [town, setTown] = useState('All');

  const townLabelsMl: Record<string, string> = {
    All: 'എല്ലാ സ്ഥലങ്ങളും',
    Iritty: 'ഇരിട്ടി',
    Uliyil: 'ഉളിയിൽ',
    Keezhur: 'കീഴൂർ',
    Mattannur: 'മട്ടന്നൂർ',
    Peravoor: 'പേരാവൂർ',
    'Other Nearby': 'മറ്റു സമീപ ഇടങ്ങൾ'
  };

  const visible = initialPlaces.filter((p) => {
    const matchTown = town === 'All' || p.town.toLowerCase() === town.toLowerCase();
    const text = `${p.name} ${p.town} ${p.category} ${p.distanceNote || ''} ${p.description || ''}`.toLowerCase();
    const matchQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    return matchTown && matchQuery;
  });

  return (
    <main>
      <section className="inner-hero dark-hero">
        <div className="container">
          <span className="eyebrow">
            ✳ &nbsp; <T en="NEAREST SHOPS · IRITTY & ULIYIL" ml="സമീപ കടകൾ · ഇരിട്ടിയും ഉളിയിലും" />
          </span>
          <h1>
            <T en="Nearest Shops" ml="സമീപത്തെ കടകളും" />{' '}
            <em>
              <T en="& Landmarks." ml="സ്ഥാപനങ്ങളും." />
            </em>
          </h1>
          <p>
            <T
              en="Browse supermarkets, hospitals, jewellery & showrooms around Uliyil and Iritty with large logos, Call, WhatsApp & Maps."
              ml="ഇരിട്ടിയിലും ഉളിയിലിലും ഉള്ള പ്രധാന കടകൾ, സൂപ്പർമാർക്കറ്റുകൾ, ആശുപത്രികൾ, ഷോറൂമുകൾ എന്നിവയുടെ ലോഗോകളും ഫോൺ/വാട്സ്ആപ്പ് വിവരങ്ങളും."
            />
          </p>
          <div className="hero-glance">
            <span>{ml ? `${initialPlaces.length} സ്ഥാപനങ്ങൾ` : `${initialPlaces.length} Shops & Hubs`}</span>
            <span>{ml ? 'കോൾ & വാട്സ്ആപ്പ്' : 'Call & WhatsApp'}</span>
            <span>{ml ? 'ലൊക്കേഷൻ മാപ്പ്' : 'Directions'}</span>
          </div>
          <div className="search-bar hero-search">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ml ? 'കടയുടെ പേര്, ഇരിട്ടി, വിഭാഗം തിരയുക...' : 'Search shop name, Iritty, hospital, supermarket...'}
              aria-label="Search nearest shops"
            />
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="category-cloud">
            {['All', ...nearestTowns].map((t) => (
              <button key={t} className={town === t ? 'selected' : ''} onClick={() => setTown(t)}>
                {ml ? townLabelsMl[t] || t : t}
              </button>
            ))}
          </div>

          {visible.length ? (
            <div className="card-grid">
              {visible.map((item) => (
                <article className="info-card nearest-card" key={item.id}>
                  <div className="nearest-logo-stage">
                    {item.logoUrl ? (
                      <img src={item.logoUrl} alt={`${item.name} logo`} loading="lazy" />
                    ) : (
                      <div className="nearest-logo-fallback">
                        <Store size={46} color="#276c4b" strokeWidth={1.6} />
                        <span>{item.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="nearest-meta-row">
                    <span className="pill">{ml ? townLabelsMl[item.town] || item.town : item.town}</span>
                    <small>{item.category}</small>
                  </div>

                  <h3 style={{ marginTop: 10 }}>{item.name}</h3>
                  {item.distanceNote && (
                    <div className="pro-meta" style={{ marginBottom: 6 }}>
                      <Navigation size={14} />
                      <span>{item.distanceNote}</span>
                    </div>
                  )}
                  {item.description && <p>{item.description}</p>}

                  <div className="listing-actions">
                    {item.phone && (
                      <a href={formatTelHref(item.phone)}>
                        <Phone size={14} /> {ml ? 'വിളിക്കൂ' : 'Call'}
                      </a>
                    )}
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
                        <MapPin size={14} /> {ml ? 'വഴി കാണുക' : 'Directions'}
                      </a>
                    )}
                    {item.websiteUrl && (
                      <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} /> {ml ? 'വെബ്‌സൈറ്റ്' : 'Website'}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Store size={38} />
              <h3>
                {ml
                  ? 'ഈ പ്രദേശത്ത് ഷോപ്പുകൾ ഇതുവരെ ചേർത്തിട്ടില്ല'
                  : 'Nearest shops & logos are being added'}
              </h3>
              <p>
                {ml
                  ? 'ഇരിട്ടിയിലും ഉളിയിലിലും ഉള്ള പ്രധാന സ്ഥാപനങ്ങളുടെ ലോഗോകളും വിവരങ്ങളും അഡ്മിൻ പാനൽ വഴി എളുപ്പത്തിൽ ചേർക്കാവുന്നതാണ്.'
                  : 'Administrators can add major shops, brands, and landmarks from Iritty and Uliyil with their logos via the /admin dashboard.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
