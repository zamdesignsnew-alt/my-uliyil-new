'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './Translated';

type Kind = 'issue' | 'idea' | 'appointment' | 'listing-report' | 'correction';

const options: Record<Kind, { en: string; ml: string }[]> = {
  issue: [
    { en: 'Streetlight failure', ml: 'തെരുവുവിളക്ക് തകരാർ' },
    { en: 'Pothole or road', ml: 'റോഡിലെ കുഴികൾ / തകരാർ' },
    { en: 'Drainage', ml: 'ഓട / ഡ്രെയിനേജ് പ്രശ്നം' },
    { en: 'Waste management', ml: 'മാലിന്യ സംസ്കരണം' },
    { en: 'Waterlogging', ml: 'വെള്ളക്കെട്ട്' },
    { en: 'Water supply', ml: 'കുടിവെള്ള വിതരണം' },
    { en: 'Other local issue', ml: 'മറ്റു പ്രാദേശിക പ്രശ്നങ്ങൾ' }
  ],
  idea: [
    { en: 'Public spaces', ml: 'പൊതു ഇടങ്ങൾ' },
    { en: 'Environment', ml: 'പരിസ്ഥിതി സംരക്ഷണം' },
    { en: 'Youth & education', ml: 'യുവജനങ്ങളും വിദ്യാഭ്യാസവും' },
    { en: 'Accessibility', ml: 'സഞ്ചാര സൗകര്യം' },
    { en: 'Community events', ml: 'സാമൂഹിക പരിപാടികൾ' },
    { en: 'Other idea', ml: 'മറ്റു ആശയങ്ങൾ' }
  ],
  appointment: [
    { en: 'Ward matter', ml: 'വാർഡ് സംബന്ധമായ കാര്യം' },
    { en: 'Community discussion', ml: 'പ്രാദേശിക ചർച്ച' },
    { en: 'Other', ml: 'മറ്റുള്ളവ' }
  ],
  'listing-report': [
    { en: 'Incorrect information', ml: 'തെറ്റായ വിവരങ്ങൾ' },
    { en: 'Inappropriate listing', ml: 'അനുചിതമായ ലിസ്റ്റിംഗ്' },
    { en: 'Unreachable contact', ml: 'ബന്ധപ്പെടാൻ കഴിയുന്നില്ല' },
    { en: 'Other concern', ml: 'മറ്റു പരാതികൾ' }
  ],
  correction: [
    { en: 'Correct a listing', ml: 'വിവരങ്ങൾ തിരുത്തുക' },
    { en: 'Remove my listing', ml: 'എന്റെ ലിസ്റ്റിംഗ് നീക്കം ചെയ്യുക' },
    { en: 'Other request', ml: 'മറ്റു അഭ്യർത്ഥനകൾ' }
  ]
};

export function RequestForm({ kind }: { kind: Kind }) {
  const lang = useLanguage();
  const ml = lang === 'ml';

  const [submittedData, setSubmittedData] = useState<{ id: string; token: string } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    form.set('kind', kind);
    if (kind === 'listing-report') {
      const id = new URLSearchParams(location.search).get('listing');
      if (id) form.set('description', `Listing ID: ${id}\n${form.get('description')}`);
    }

    try {
      const r = await fetch('/api/requests', { method: 'POST', body: form });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error || (ml ? 'സമർപ്പിക്കാനായില്ല' : 'Unable to submit'));

      setSubmittedData({ id: result.id, token: result.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : ml ? 'സമർപ്പിക്കാനായില്ല' : 'Unable to submit');
    } finally {
      setBusy(false);
    }
  }

  if (submittedData) {
    return (
      <div className="form-card">
        <div style={{ textAlign: 'center', padding: '20px 10px' }}>
          <CheckCircle2 size={54} color="#276c4b" style={{ margin: '0 auto 16px' }} />
          <h2 className="page-title" style={{ fontSize: 28, marginBottom: 10 }}>
            {ml
              ? kind === 'issue'
                ? 'പരാതി സമർപ്പിച്ചു'
                : 'വിവരങ്ങൾ ലഭിച്ചു'
              : kind === 'issue'
              ? 'Complaint Submitted'
              : 'Submission Received'}
          </h2>
          <p className="page-lead" style={{ margin: '0 auto 24px', maxWidth: 500 }}>
            {ml
              ? 'നിങ്ങളുടെ വിവരങ്ങൾ സുരക്ഷിതമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്. ട്രാക്കിംഗ് വിവരങ്ങൾ താഴെ സൂക്ഷിക്കുക:'
              : 'Your request has been securely recorded for review. Save your tracking credentials below:'}
          </p>

          <div className="success-box" style={{ textAlign: 'left', marginBottom: 25 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13 }}>
              <strong>{ml ? 'റെഫറൻസ് നമ്പർ:' : 'Reference Number:'}</strong> <br />
              <code style={{ fontSize: 13, wordBreak: 'break-all', background: '#d7e8d5', padding: '2px 6px', borderRadius: 4 }}>
                {submittedData.id}
              </code>
            </p>
            <p style={{ margin: 0, fontSize: 13 }}>
              <strong>{ml ? 'സ്വകാര്യ ട്രാക്കിംഗ് ടോക്കൺ:' : 'Private Tracking Token:'}</strong> <br />
              <code style={{ fontSize: 13, wordBreak: 'break-all', background: '#d7e8d5', padding: '2px 6px', borderRadius: 4 }}>
                {submittedData.token}
              </code>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/track?id=${encodeURIComponent(submittedData.id)}&token=${encodeURIComponent(submittedData.token)}`}
              className="btn btn-forest"
            >
              {ml ? 'തൽസ്ഥിതി പരിശോധിക്കുക' : 'Track Request Status'} <ArrowUpRight size={16} />
            </Link>
            <button type="button" className="btn btn-outline" onClick={() => setSubmittedData(null)}>
              {ml ? 'മറ്റൊന്ന് നൽകുക' : 'Submit Another'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formHeading = ml
    ? kind === 'issue'
      ? 'പ്രശ്നം വിശദീകരിക്കുക'
      : kind === 'idea'
      ? 'നിങ്ങളുടെ ആശയം പങ്കുവയ്ക്കുക'
      : kind === 'appointment'
      ? 'കൂടിക്കാഴ്ചയ്ക്ക് സമയം തേടുക'
      : kind === 'correction'
      ? 'തിരുത്തൽ അഭ്യർത്ഥിക്കുക'
      : 'ലിസ്റ്റിംഗ് റിപ്പോർട്ട് ചെയ്യുക'
    : kind === 'issue'
    ? 'Tell us what happened'
    : kind === 'idea'
    ? 'Share your idea'
    : kind === 'appointment'
    ? 'Request an appointment'
    : kind === 'correction'
    ? 'Request a correction'
    : 'Report a listing';

  return (
    <div className="form-card">
      <h2 className="page-title">{formHeading}</h2>
      <p className="page-lead">
        {ml
          ? 'നിങ്ങളുടെ വിവരങ്ങൾ സ്വകാര്യമായി സൂക്ഷിക്കപ്പെടും. അടിയന്തര സഹായത്തിന് 112-ൽ വിളിക്കുക.'
          : 'Your submission is stored privately for review. It is not automatically delivered by phone or email. For emergencies, call 112.'}
      </p>
      <form onSubmit={submit} className="form-grid">
        <div className="field">
          <label htmlFor="category">{ml ? 'വിഭാഗം *' : 'Category *'}</label>
          <select id="category" name="category" required>
            <option value="">{ml ? 'ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക' : 'Choose a category'}</option>
            {options[kind].map((o) => (
              <option key={o.en} value={o.en}>
                {ml ? o.ml : o.en}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="locality">{ml ? 'സ്ഥലം' : 'Locality'}</label>
          <input
            id="locality"
            name="locality"
            placeholder={ml ? 'പ്രദേശം അല്ലെങ്കിൽ സമീപത്തെ അടയാളം' : 'Area or nearby landmark'}
            maxLength={160}
          />
        </div>
        <div className="field">
          <label htmlFor="name">{ml ? 'നിങ്ങളുടെ പേര്' : 'Your name'}</label>
          <input id="name" name="name" maxLength={160} />
        </div>
        <div className="field">
          <label htmlFor="phone">
            {ml
              ? `ഫോൺ നമ്പർ ${kind === 'issue' ? '*' : '(നിർബന്ധമില്ല)'}`
              : `Phone ${kind === 'issue' ? '*' : kind === 'idea' ? '(optional)' : '(recommended)'}`}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required={kind === 'issue'}
            placeholder={ml ? '10 അക്ക ഫോൺ നമ്പർ' : '10-digit phone number'}
            maxLength={20}
          />
        </div>
        <div className="field full">
          <label htmlFor="email">{ml ? 'ഇമെയിൽ (നിർബന്ധമില്ല)' : 'Email (optional)'}</label>
          <input id="email" name="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="field full">
          <label htmlFor="description">
            {ml
              ? kind === 'appointment'
                ? 'സംസാരിക്കേണ്ട വിഷയം *'
                : 'വിവരണം *'
              : `${kind === 'appointment' ? 'What would you like to discuss?' : 'Description'} *`}
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={3000}
            placeholder={ml ? 'വിശദാംശങ്ങൾ ഇവിടെ എഴുതുക...' : 'Share the details here...'}
          />
        </div>
        {kind === 'issue' && (
          <div className="field full">
            <label htmlFor="photo">{ml ? 'ഫോട്ടോ തെളിവ് (നിർബന്ധമില്ല)' : 'Photo evidence (optional)'}</label>
            <input id="photo" type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
            <small>
              {ml
                ? 'JPG, PNG അല്ലെങ്കിൽ WebP (പരമാവധി 3 MB). സ്വകാര്യ പരിശോധനയ്ക്ക് മാത്രം.'
                : 'JPG, PNG or WebP, up to 3 MB. Kept private for authorised review.'}
            </small>
          </div>
        )}
        <div className="field full">
          <label className="check-row">
            <input type="checkbox" name="consent" required />{' '}
            {ml
              ? 'പരിശോധനയ്ക്കും തുടർനടപടികൾക്കുമായി എന്റെ വിവരങ്ങൾ സ്വകാര്യമായി സൂക്ഷിക്കുന്നതിൽ ഞാൻ സമ്മതിക്കുന്നു. *'
              : 'I consent to my details being stored privately for review and follow-up. I understand this is not an emergency channel. *'}
          </label>
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
        <div className="field full">
          <div className="form-actions">
            <button className="btn btn-forest" disabled={busy}>
              {busy ? (ml ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...') : ml ? 'സുരക്ഷിതമായി സമർപ്പിക്കുക' : 'Submit securely'}{' '}
              <ArrowUpRight size={16} />
            </button>
            <span className="inline-note">
              <ShieldCheck size={14} /> {ml ? 'സ്വകാര്യത ഉറപ്പാണ്' : 'Private by default'}
            </span>
          </div>
          {error && (
            <p className="form-message error" style={{ marginTop: 15 }} role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
