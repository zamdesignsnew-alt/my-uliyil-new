'use client';
import { useState } from 'react';
import {
  BriefcaseBusiness,
  Search,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Plus,
  CheckCircle2,
  ArrowUpRight,
  GraduationCap,
  UserRound
} from 'lucide-react';
import { professionalCategories, professionalCategoryMl } from '@/lib/config';
import { formatTelHref, formatWhatsAppUrl } from '@/lib/contact';
import { T, useLanguage } from './Translated';
import { prepareFileForUpload } from '@/lib/clientUpload';

export type ProfessionalItem = {
  id: string;
  name: string;
  nameMl: string | null;
  profession: string;
  category: string;
  qualification: string | null;
  locality: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  bio: string;
  photoUrl: string | null;
};

export function ProfessionalsClient({ initialItems }: { initialItems: ProfessionalItem[] }) {
  const lang = useLanguage();
  const ml = lang === 'ml';

  const [items] = useState<ProfessionalItem[]>(initialItems);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtered = items.filter((p) => {
    const matchCat = cat === 'All' || p.category === cat;
    const text = `${p.name} ${p.nameMl || ''} ${p.profession} ${p.qualification || ''} ${p.locality} ${p.bio}`.toLowerCase();
    const matchQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    return matchCat && matchQuery;
  });

  async function submitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setDoneId(null);

    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);
      const photo = fd.get('photo');
      if (photo instanceof File && photo.size > 0) {
        const prepared = await prepareFileForUpload(photo);
        fd.set('photo', prepared);
      }

      const res = await fetch('/api/professionals', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (ml ? 'സമർപ്പിക്കാനായില്ല' : 'Unable to submit'));
      setDoneId(data.id);
      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : ml ? 'സമർപ്പിക്കാനായില്ല' : 'Unable to submit');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <section className="inner-hero dark-hero">
        <div className="container">
          <span className="eyebrow">
            ✳ &nbsp; <T en="PROFESSIONALS · WARD 19 EXPERTS" ml="പ്രൊഫഷണലുകൾ · വാർഡ് 19 വിദഗ്ധർ" />
          </span>
          <h1>
            <T en="Ward" ml="നമ്മുടെ വാർഡിലെ" />{' '}
            <em>
              <T en="Professionals." ml="പ്രൊഫഷണലുകൾ." />
            </em>
          </h1>
          <p>
            <T
              en="Meet verified doctors, engineers, advocates, teachers, and specialists from Uliyil, or submit your own profile."
              ml="ഉളിയിലിൽ നിന്നുള്ള ഡോക്ടർമാർ, എഞ്ചിനീയർമാർ, അഭിഭാഷകർ, അധ്യാപകർ, മറ്റ് വിവിധ മേഖലകളിലെ വിദഗ്ധർ എന്നിവരെ പരിചയപ്പെടൂ."
            />
          </p>
          <div className="hero-glance">
            <span>{ml ? `${items.length} വിദഗ്ധർ` : `${items.length} Profiles`}</span>
            <span>{ml ? 'ഡോക്ടർ • എഞ്ചിനീയർ • അഭിഭാഷകർ' : 'Doctors • Engineers • Teachers'}</span>
          </div>

          <div className="search-bar hero-search">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                ml
                  ? 'പേര്, തൊഴിൽ, യോഗ്യത അല്ലെങ്കിൽ സ്ഥലം തിരയുക...'
                  : 'Search by name, profession, qualification, or locality...'
              }
              aria-label="Search ward professionals"
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              className="btn btn-lime btn-compact-mobile"
              onClick={() => {
                setShowForm(true);
                setTimeout(() => document.getElementById('pro-join-form')?.scrollIntoView({ behavior: 'smooth' }), 60);
              }}
            >
              <Plus size={17} /> {ml ? 'നിങ്ങളുടെ പ്രൊഫൈൽ ചേർക്കുക' : 'Add your professional profile'}
            </button>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="category-cloud">
            <button className={cat === 'All' ? 'selected' : ''} onClick={() => setCat('All')}>
              {ml ? 'എല്ലാം' : 'All'} ({items.length})
            </button>
            {professionalCategories.map((c) => (
              <button key={c} className={cat === c ? 'selected' : ''} onClick={() => setCat(c)}>
                {ml ? professionalCategoryMl[c] || c : c}
              </button>
            ))}
          </div>

          {filtered.length ? (
            <div className="card-grid pro-grid">
              {filtered.map((p) => (
                <article className="info-card pro-card" key={p.id}>
                  <div className="pro-card-head">
                    <div className="pro-avatar">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} loading="lazy" />
                      ) : (
                        <UserRound size={30} />
                      )}
                    </div>
                    <div>
                      <span className="pill">
                        {ml ? professionalCategoryMl[p.category] || p.category : p.category}
                      </span>
                      <h3 style={{ marginTop: 8 }}>{ml && p.nameMl ? p.nameMl : p.name}</h3>
                      <strong className="pro-role">{p.profession}</strong>
                    </div>
                  </div>

                  {p.qualification && (
                    <div className="pro-meta">
                      <GraduationCap size={15} />
                      <span>{p.qualification}</span>
                    </div>
                  )}
                  <div className="pro-meta">
                    <MapPin size={15} />
                    <span>{p.locality}</span>
                  </div>

                  <p style={{ marginTop: 10 }}>{p.bio}</p>

                  <div className="listing-actions">
                    {p.phone && (
                      <a href={formatTelHref(p.phone)}>
                        <Phone size={14} /> {ml ? 'വിളിക്കൂ' : 'Call'}
                      </a>
                    )}
                    {p.whatsapp && (
                      <a
                        className="wa-action"
                        href={formatWhatsAppUrl(p.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={14} /> {ml ? 'വാട്സ്ആപ്പ്' : 'WhatsApp'}
                      </a>
                    )}
                    {p.email && (
                      <a href={`mailto:${p.email}`}>
                        <Mail size={14} /> {ml ? 'ഇമെയിൽ' : 'Email'}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BriefcaseBusiness size={38} />
              <h3>
                {ml ? 'ഈ വിഭാഗത്തിൽ പ്രൊഫഷണലുകൾ ഇതുവരെ ചേർത്തിട്ടില്ല' : 'No professional profiles added here yet'}
              </h3>
              <p>
                {ml
                  ? 'ഉളിയിൽ വാർഡിലെ വിദഗ്ധരെ പരിചയപ്പെടുത്തുന്ന പേജാണിത്. താഴെയുള്ള ബട്ടൺ വഴി നിങ്ങളുടെ പ്രൊഫൈൽ സമർപ്പിക്കാം.'
                  : 'Know a doctor, engineer, teacher, lawyer, or specialist in Uliyil? Submit a profile below for ward moderator approval.'}
              </p>
              <button
                type="button"
                className="btn btn-forest"
                onClick={() => {
                  setShowForm(true);
                  setTimeout(() => document.getElementById('pro-join-form')?.scrollIntoView({ behavior: 'smooth' }), 60);
                }}
              >
                {ml ? 'പ്രൊഫൈൽ സമർപ്പിക്കുക' : 'Submit a Profile'} <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="page-section alt" id="pro-join-form">
        <div className="container" style={{ maxWidth: 860 }}>
          {!showForm && !doneId ? (
            <div className="join-invite">
              <BriefcaseBusiness size={42} />
              <h3>
                {ml
                  ? 'നിങ്ങൾ ഉളിയിൽ വാർഡിൽ നിന്നുള്ള ഒരു പ്രൊഫഷണൽ ആണോ?'
                  : 'Are you a professional from Uliyil?'}
              </h3>
              <p>
                {ml
                  ? 'വാർഡിലെ വിദ്യാർത്ഥികൾക്കും നാട്ടുകാർക്കും പ്രചോദനവും സഹായവുമായി മാറാൻ നിങ്ങളുടെ വിവരങ്ങൾ പങ്കുവയ്ക്കൂ.'
                  : 'Share your expertise, qualification, and introduction so residents and students in our ward can connect with you.'}
              </p>
              <button type="button" className="btn btn-forest" onClick={() => setShowForm(true)}>
                {ml ? 'പ്രൊഫൈൽ ചേർക്കുക' : 'Register Your Profile'} <ArrowUpRight size={16} />
              </button>
            </div>
          ) : doneId ? (
            <div className="form-card" style={{ textAlign: 'center', padding: 36 }}>
              <CheckCircle2 size={50} color="#276c4b" style={{ margin: '0 auto 14px' }} />
              <h2 className="page-title">
                {ml ? 'പരിശോധനയ്ക്കായി സമർപ്പിച്ചു!' : 'Profile Submitted for Review!'}
              </h2>
              <p className="page-lead" style={{ margin: '0 auto 20px' }}>
                {ml
                  ? 'നന്ദി! വാർഡ് മോഡറേറ്റർ പരിശോധിച്ച ശേഷം നിങ്ങളുടെ പ്രൊഫൈൽ ഈ പേജിൽ പ്രസിദ്ധീകരിക്കും.'
                  : 'Thank you! Once approved by our moderators, your profile will appear in the Ward Professionals showcase.'}
              </p>
              <button type="button" className="btn btn-forest" onClick={() => setDoneId(null)}>
                {ml ? 'മറ്റൊരു പ്രൊഫൈൽ ചേർക്കുക' : 'Submit Another Profile'}
              </button>
            </div>
          ) : (
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 className="page-title" style={{ marginBottom: 0 }}>
                  {ml ? 'പ്രൊഫഷണൽ പ്രൊഫൈൽ ചേർക്കുക' : 'Register Ward Professional'}
                </h2>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  {ml ? 'അടയ്ക്കുക' : 'Close'}
                </button>
              </div>
              <p className="page-lead">
                {ml
                  ? 'പരിശോധനയ്ക്ക് ശേഷം മാത്രമേ വിവരങ്ങൾ പ്രസിദ്ധീകരിക്കുകയുള്ളൂ.'
                  : 'Submitted profiles are reviewed before appearing publicly.'}
              </p>

              <form onSubmit={submitProfile} className="form-grid">
                <div className="field">
                  <label>{ml ? 'പേര് (ഇംഗ്ലീഷിൽ) *' : 'Full Name *'}</label>
                  <input name="name" required minLength={2} maxLength={160} placeholder="e.g. Dr. Rahul Krishna" />
                </div>
                <div className="field">
                  <label>{ml ? 'പേര് (മലയാളത്തിൽ - നിർബന്ധമില്ല)' : 'Name in Malayalam (optional)'}</label>
                  <input name="nameMl" maxLength={160} placeholder="ഉദാ: ഡോ. രാഹുൽ കൃഷ്ണ" />
                </div>
                <div className="field">
                  <label>{ml ? 'തൊഴിൽ / പദവി *' : 'Profession / Designation *'}</label>
                  <input
                    name="profession"
                    required
                    minLength={2}
                    maxLength={160}
                    placeholder={ml ? 'ഉദാ: അഡ്വക്കേറ്റ്, സിവിൽ എഞ്ചിനീയർ, ഡോക്ടർ' : 'e.g. Advocate, Civil Engineer, Software Architect'}
                  />
                </div>
                <div className="field">
                  <label>{ml ? 'മേഖല *' : 'Field / Category *'}</label>
                  <select name="category" required>
                    {professionalCategories.map((c) => (
                      <option key={c} value={c}>
                        {ml ? professionalCategoryMl[c] || c : c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>{ml ? 'യോഗ്യത / സ്പെഷ്യലൈസേഷൻ' : 'Qualification / Specialization'}</label>
                  <input name="qualification" maxLength={200} placeholder="e.g. MBBS, MD / B.Tech / LLB" />
                </div>
                <div className="field">
                  <label>{ml ? 'ഉളിയിലിലെ സ്ഥലം *' : 'Locality in Uliyil *'}</label>
                  <input name="locality" required placeholder={ml ? 'ഉദാ: ഉളിയിൽ' : 'e.g. Uliyil Town'} />
                </div>
                <div className="field">
                  <label>{ml ? 'ഫോൺ നമ്പർ (നിർബന്ധമില്ല)' : 'Phone (optional)'}</label>
                  <input name="phone" type="tel" placeholder="10-digit number" />
                </div>
                <div className="field">
                  <label>{ml ? 'വാട്സ്ആപ്പ് (നിർബന്ധമില്ല)' : 'WhatsApp (optional)'}</label>
                  <input name="whatsapp" type="tel" placeholder="10-digit number" />
                </div>
                <div className="field full">
                  <label>{ml ? 'പ്രൊഫൈൽ ഫോട്ടോ' : 'Profile Photo (optional)'}</label>
                  <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
                  <small>{ml ? 'JPG, PNG അല്ലെങ്കിൽ WebP ചിത്രം.' : 'Clear portrait JPG, PNG or WebP.'}</small>
                </div>
                <div className="field full">
                  <label>{ml ? 'ലഘു വിവരണം / പരിചയപ്പെടുത്തൽ *' : 'Short Introduction / Expertise *'}</label>
                  <textarea
                    name="bio"
                    required
                    minLength={10}
                    maxLength={1500}
                    placeholder={
                      ml
                        ? 'നിങ്ങളുടെ സേവന മേഖലയും അനുഭവസമ്പത്തും ചുരുക്കി എഴുതുക...'
                        : 'Share your background, areas of work, and how you can guide or serve the community...'
                    }
                  />
                </div>
                <div className="field full">
                  <label className="check-row">
                    <input type="checkbox" name="consent" required />{' '}
                    {ml
                      ? 'ഈ വിവരങ്ങളും ഫോട്ടോയും മൈ ഉളിയിൽ വെബ്‌സൈറ്റിൽ പ്രസിദ്ധീകരിക്കുന്നതിന് ഞാൻ സമ്മതിക്കുന്നു. *'
                      : 'I consent to publish these details on My Uliyil after review. *'}
                  </label>
                </div>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
                <div className="field full">
                  <button type="submit" className="btn btn-forest" disabled={busy}>
                    {busy ? (ml ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...') : ml ? 'പ്രൊഫൈൽ സമർപ്പിക്കുക' : 'Submit Profile'}{' '}
                    <ArrowUpRight size={16} />
                  </button>
                  {error && <p className="form-message error">{error}</p>}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
