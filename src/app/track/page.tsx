'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/Translated';

function TrackForm() {
  const lang = useLanguage();
  const ml = lang === 'ml';

  const searchParams = useSearchParams();
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState<{ status: string; kind: string; createdAt: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function performLookup(targetId: string, targetToken: string) {
    if (!targetId || !targetToken) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const r = await fetch(`/api/requests?id=${encodeURIComponent(targetId)}&token=${encodeURIComponent(targetToken)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : ml ? 'അപേക്ഷ കണ്ടെത്താനായില്ല' : 'Could not find request');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const qId = searchParams.get('id');
    const qToken = searchParams.get('token');
    if (qId && qToken) {
      setId(qId);
      setToken(qToken);
      performLookup(qId, qToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    performLookup(id, token);
  }

  return (
    <div className="form-card">
      <h2 className="page-title">{ml ? 'അപേക്ഷയുടെ തൽസ്ഥിതി പരിശോധിക്കുക' : 'Track a submission'}</h2>
      <form onSubmit={lookup} className="form-grid">
        <div className="field full">
          <label>{ml ? 'റെഫറൻസ് നമ്പർ' : 'Reference number'}</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </div>
        <div className="field full">
          <label>{ml ? 'സ്വകാര്യ ട്രാക്കിംഗ് ടോക്കൺ' : 'Private tracking token'}</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            placeholder={ml ? 'സമർപ്പിച്ചപ്പോൾ ലഭിച്ച ടോക്കൺ' : 'Token shown on your confirmation'}
          />
        </div>
        <div className="field full">
          <button className="btn btn-forest" disabled={loading}>
            <Search size={17} /> {loading ? (ml ? 'പരിശോധിക്കുന്നു...' : 'Checking status...') : ml ? 'തൽസ്ഥിതി അറിയുക' : 'Check status'}
          </button>
        </div>
      </form>
      {error && <p className="form-message error">{error}</p>}
      {result && (
        <div className="success-box">
          <ShieldCheck size={22} />
          <h3>
            {ml ? 'തൽസ്ഥിതി:' : 'Status:'} {result.status}
          </h3>
          <p>
            {ml ? 'വിഭാഗം:' : 'Type:'} {result.kind} · {ml ? 'സമർപ്പിച്ച തീയതി:' : 'Submitted:'}{' '}
            {new Date(result.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Track() {
  const lang = useLanguage();
  const ml = lang === 'ml';

  return (
    <main>
      <section className="inner-hero">
        <div className="container">
          <span className="eyebrow">✳ &nbsp; {ml ? 'സ്വകാര്യ അപേക്ഷാ പരിശോധന' : 'PRIVATE REQUEST TRACKING'}</span>
          <h1>
            {ml ? (
              <>
                നിങ്ങളുടെ അപേക്ഷയുടെ
                <br />
                <em>തൽസ്ഥിതി അറിയുക.</em>
              </>
            ) : (
              <>
                Check your
                <br />
                <em>request status.</em>
              </>
            )}
          </h1>
          <p>
            {ml
              ? 'സമർപ്പിച്ച ശേഷം ലഭിച്ച റെഫറൻസ് നമ്പറും സ്വകാര്യ ടോക്കണും ഉപയോഗിക്കുക.'
              : 'Use the reference number and private token shown after submission. Neither is publicly searchable alone.'}
          </p>
          <div className="hero-glance">
            <span>{ml ? 'റെഫറൻസ് നമ്പർ' : 'Reference ID'}</span>
            <span>{ml ? 'തൽസമയ സ്റ്റാറ്റസ്' : 'Live Status'}</span>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 730 }}>
          <Suspense fallback={<div className="form-card"><p>{ml ? 'ലോഡ് ചെയ്യുന്നു...' : 'Loading tracking form...'}</p></div>}>
            <TrackForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
