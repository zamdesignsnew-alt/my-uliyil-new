'use client';
import { useState } from 'react';
import { HeartPulse, Building2, FileText, Search, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { serviceGuides } from '@/lib/config';
import { useLanguage } from './Translated';

export function ServicesHub() {
  const [query, setQuery] = useState('');
  const lang = useLanguage();
  const ml = lang === 'ml';

  const shown = serviceGuides.filter((s) =>
    (s.name + ' ' + s.nameMl + ' ' + s.description + ' ' + s.descriptionMl).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="service-search">
        <Search size={19} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ml ? 'സർക്കാർ സേവനങ്ങളും മാർഗ്ഗനിർദ്ദേശങ്ങളും തിരയുക...' : 'Search services and official guidance...'}
          aria-label="Search services"
        />
      </div>
      <div className="card-grid">
        {shown.map((s, i) => (
          <article className="info-card" key={s.name}>
            <span className="card-icon">
              {i % 3 === 0 ? <HeartPulse size={24} /> : i % 3 === 1 ? <Building2 size={24} /> : <FileText size={24} />}
            </span>
            <h3>{ml ? s.nameMl : s.name}</h3>
            <p>
              {ml
                ? `${s.descriptionMl} അപേക്ഷിക്കുന്നതിന് മുൻപ് ഔദ്യോഗിക പോർട്ടലിൽ രേഖകളും യോഗ്യതയും പരിശോധിക്കുക.`
                : `${s.description} Please verify current requirements, eligibility, and documents on the official portal before applying.`}
            </p>
            <a className="card-action" target="_blank" rel="noopener noreferrer" href={s.url}>
              {ml ? 'ഔദ്യോഗിക പോർട്ടൽ സന്ദർശിക്കുക' : 'Visit official portal'} <ArrowUpRight size={15} />
            </a>
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">
          <h3>{ml ? 'സേവനങ്ങൾ കണ്ടെത്താനായില്ല' : 'No matching services'}</h3>
          <p>
            {ml
              ? 'മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് തിരയുക അല്ലെങ്കിൽ ഔദ്യോഗിക സർക്കാർ പോർട്ടലുകൾ പരിശോധിക്കുക.'
              : 'Try another keyword or check the official state and municipal service portals.'}
          </p>
        </div>
      )}
      <div className="guide-note">
        <ShieldCheck size={21} />
        <span>
          {ml
            ? 'ഔദ്യോഗിക അപേക്ഷാ ഫോമുകളും രേഖകളും ബന്ധപ്പെട്ട സർക്കാർ പോർട്ടലുകളിൽ നിന്നാണ് ഡൗൺലോഡ് ചെയ്യേണ്ടത്.'
            : 'Official forms and downloadable documents should always be obtained from the linked authority. No unofficial forms are hosted here.'}
        </span>
      </div>
      <div className="forms-library">
        <span className="eyebrow">{ml ? 'ഔദ്യോഗിക ഫോമുകളുടെ ശേഖരം' : 'OFFICIAL FORMS LIBRARY'}</span>
        <h3>{ml ? 'ശരിയായ ഉറവിടത്തിൽ നിന്നും ആരംഭിക്കാം.' : 'Start with the right source.'}</h3>
        <p>
          {ml
            ? 'മുകളിലുള്ള തിരയൽ വഴി ആവശ്യമായ സേവനം കണ്ടെത്തി ഔദ്യോഗിക പോർട്ടൽ തുറക്കൂ. ഏറ്റവും പുതിയ ഫോമുകളും നിബന്ധനകളും അവിടെ ലഭ്യമാണ്.'
            : 'Use the search above to find a service, then open its official portal for the latest forms, document requirements and application instructions. No unverified files are offered as official downloads.'}
        </p>
      </div>
    </>
  );
}
