'use client';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Upload,
  Pencil,
  X,
  Film,
  Camera
} from 'lucide-react';
import { categories, nearestCategories, nearestTowns, professionalCategories } from '@/lib/config';
import { prepareFileForUpload } from '@/lib/clientUpload';

type Entry = {
  id: string;
  name?: string;
  nameMl?: string;
  title?: string;
  kind?: string;
  type?: string;
  category?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  locality?: string;
  description?: string;
  body?: string;
  status: string;
  createdAt: string;
  url?: string;
  imageUrl?: string;
  photoUrl?: string;
  logoUrl?: string;
  mapUrl?: string;
  websiteUrl?: string;
  profession?: string;
  qualification?: string;
  bio?: string;
  yearSpan?: string;
  note?: string;
  sortOrder?: number;
  town?: string;
  distanceNote?: string;
  photoMime?: string | null;
};

type AdminTab = 'gallery' | 'listings' | 'content' | 'professionals' | 'formerCouncillors' | 'nearestPlaces' | 'requests';
type EditKind = 'content' | 'listings' | 'professionals' | 'formerCouncillors' | 'nearestPlaces';

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<AdminTab>('gallery');
  const [contentFilter, setContentFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const [newContentType, setNewContentType] = useState<string>('project');
  const [data, setData] = useState<Record<Exclude<AdminTab, 'gallery'>, Entry[]>>({
    listings: [],
    requests: [],
    content: [],
    professionals: [],
    formerCouncillors: [],
    nearestPlaces: []
  });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  // Media upload states for creation forms
  const [galleryImgUrl, setGalleryImgUrl] = useState('');
  const [galleryVideoUrl, setGalleryVideoUrl] = useState('');
  const [galleryMediaType, setGalleryMediaType] = useState<'Photo' | 'Video'>('Photo');
  const [listingImgUrl, setListingImgUrl] = useState('');
  const [contentImgUrl, setContentImgUrl] = useState('');
  const [contentVideoUrl, setContentVideoUrl] = useState('');
  const [proPhotoUrl, setProPhotoUrl] = useState('');
  const [formerPhotoUrl, setFormerPhotoUrl] = useState('');
  const [nearestLogoUrl, setNearestLogoUrl] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Edit modal state
  const [editing, setEditing] = useState<{ kind: EditKind; form: Record<string, string> } | null>(null);

  async function load() {
    try {
      const r = await fetch('/api/admin');
      if (!r.ok) {
        setLogged(false);
        return;
      }
      setLogged(true);
      const json = await r.json();
      setData({
        listings: json.listings || [],
        requests: json.requests || [],
        content: json.content || [],
        professionals: json.professionals || [],
        formerCouncillors: json.formerCouncillors || [],
        nearestPlaces: json.nearestPlaces || []
      });
    } catch {
      setLogged(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const r = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', password })
    });
    if (!r.ok) {
      setError('Invalid password or admin access is not configured.');
      return;
    }
    setPassword('');
    await load();
  }

  async function action(payload: Record<string, unknown>): Promise<boolean> {
    setBusy(true);
    setNotice('');
    try {
      const r = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.error || 'Action failed');
      setNotice('Saved successfully.');
      await load();
      return true;
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save. Please try again.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleFileUpload(file: File | undefined, fieldKey: string, onDone: (url: string) => void) {
    if (!file) return;
    setUploadingField(fieldKey);
    setNotice('');
    try {
      const prepared = await prepareFileForUpload(file);
      if (prepared.size > 4 * 1024 * 1024) {
        throw new Error('File must be under 4 MB for direct upload. For larger videos, paste a YouTube or Facebook link.');
      }
      const fd = new FormData();
      fd.append('file', prepared);
      const res = await fetch('/api/media', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      onDone(json.url);
      setNotice('File uploaded and ready to save.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingField(null);
    }
  }

  function openEdit(kind: EditKind, item: Entry) {
    if (kind === 'content') {
      setEditing({
        kind,
        form: {
          id: item.id,
          type: item.type || 'gallery',
          status: item.status || 'published',
          title: item.title || '',
          category: item.category || '',
          locality: item.locality || '',
          body: item.body || '',
          imageUrl: item.imageUrl || '',
          url: item.url || ''
        }
      });
    } else if (kind === 'listings') {
      setEditing({
        kind,
        form: {
          id: item.id,
          name: item.name || '',
          phone: item.phone || '',
          description: item.description || ''
        }
      });
    } else if (kind === 'professionals') {
      setEditing({
        kind,
        form: {
          id: item.id,
          name: item.name || '',
          nameMl: item.nameMl || '',
          profession: item.profession || '',
          category: item.category || 'Other',
          qualification: item.qualification || '',
          locality: item.locality || 'Uliyil',
          phone: item.phone || '',
          whatsapp: item.whatsapp || '',
          bio: item.bio || '',
          photoUrl: item.photoUrl || '',
          status: item.status || 'approved'
        }
      });
    } else if (kind === 'formerCouncillors') {
      setEditing({
        kind,
        form: {
          id: item.id,
          name: item.name || '',
          nameMl: item.nameMl || '',
          yearSpan: item.yearSpan || '',
          note: item.note || '',
          sortOrder: String(item.sortOrder ?? 0),
          photoUrl: item.photoUrl || ''
        }
      });
    } else if (kind === 'nearestPlaces') {
      setEditing({
        kind,
        form: {
          id: item.id,
          name: item.name || '',
          town: item.town || 'Iritty',
          category: item.category || 'Shopping',
          distanceNote: item.distanceNote || '',
          phone: item.phone || '',
          whatsapp: item.whatsapp || '',
          mapUrl: item.mapUrl || '',
          websiteUrl: item.websiteUrl || '',
          description: item.description || '',
          logoUrl: item.logoUrl || '',
          status: item.status || 'published'
        }
      });
    }
  }

  function updateEditField(key: string, val: string) {
    setEditing((prev) => (prev ? { ...prev, form: { ...prev.form, [key]: val } } : null));
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { kind, form } = editing;
    let payload: Record<string, unknown> = {};

    if (kind === 'content') {
      payload = { action: 'edit-content', ...form };
    } else if (kind === 'listings') {
      payload = { action: 'edit-listing', ...form };
    } else if (kind === 'professionals') {
      payload = { action: 'edit-professional', ...form };
    } else if (kind === 'formerCouncillors') {
      payload = { action: 'edit-former-councillor', ...form, sortOrder: Number(form.sortOrder || 0) };
    } else if (kind === 'nearestPlaces') {
      payload = { action: 'edit-nearest', ...form };
    }

    const ok = await action(payload);
    if (ok) setEditing(null);
  }

  async function createGallery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const finalImageUrl = (galleryImgUrl || String(obj.imageUrl || '')).trim();
    const finalVideoUrl = (galleryVideoUrl || String(obj.url || '')).trim();
    if (!finalImageUrl && !finalVideoUrl) {
      setNotice('Upload failed: please attach a photo/video file or paste a video/image link.');
      return;
    }
    const ok = await action({
      action: 'create-content',
      type: 'gallery',
      category: (obj.category as string) || galleryMediaType,
      title: obj.title,
      body: obj.body,
      locality: obj.locality,
      url: finalVideoUrl,
      imageUrl: finalImageUrl,
      publishNow: form.get('publishNow') === 'on'
    });
    if (ok) {
      e.currentTarget.reset();
      setGalleryImgUrl('');
      setGalleryVideoUrl('');
      setGalleryMediaType('Photo');
    }
  }

  async function createListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const ok = await action({
      action: 'create-listing',
      listingType: obj.listingType,
      name: obj.name,
      category: obj.category,
      locality: obj.locality,
      phone: obj.phone,
      whatsapp: obj.whatsapp,
      availability: obj.availability,
      mapUrl: obj.mapUrl,
      imageUrl: listingImgUrl || (obj.imageUrl as string),
      description: obj.description
    });
    if (ok) {
      e.currentTarget.reset();
      setListingImgUrl('');
    }
  }

  async function createContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const ok = await action({
      action: 'create-content',
      type: newContentType,
      category: obj.category,
      title: obj.title,
      body: obj.body,
      locality: obj.locality,
      url: contentVideoUrl || (obj.url as string),
      imageUrl: contentImgUrl || (obj.imageUrl as string),
      publishNow: form.get('publishNow') === 'on'
    });
    if (ok) {
      e.currentTarget.reset();
      setContentImgUrl('');
      setContentVideoUrl('');
    }
  }

  async function createProfessional(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const ok = await action({
      action: 'create-professional',
      ...obj,
      photoUrl: proPhotoUrl || (obj.photoUrl as string)
    });
    if (ok) {
      e.currentTarget.reset();
      setProPhotoUrl('');
    }
  }

  async function createFormer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const ok = await action({
      action: 'create-former-councillor',
      ...obj,
      photoUrl: formerPhotoUrl || (obj.photoUrl as string)
    });
    if (ok) {
      e.currentTarget.reset();
      setFormerPhotoUrl('');
    }
  }

  async function createNearest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const obj = Object.fromEntries(form.entries());
    const ok = await action({
      action: 'create-nearest',
      ...obj,
      logoUrl: nearestLogoUrl || (obj.logoUrl as string)
    });
    if (ok) {
      e.currentTarget.reset();
      setNearestLogoUrl('');
    }
  }

  function openQuickAdd(targetTab: AdminTab, presetContent?: string) {
    setTab(targetTab);
    if (presetContent) setNewContentType(presetContent);
    setShowAdd(true);
    setTimeout(() => {
      document.getElementById('admin-add-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  const galleryEntries = data.content.filter((c) => c.type === 'gallery');
  const nonGalleryContent = data.content.filter((c) => c.type !== 'gallery');

  const tabMeta: { key: AdminTab; label: string; count: number; addLabel?: string; summary: string }[] = [
    { key: 'gallery', label: 'Gallery Photos & Videos', count: galleryEntries.length, addLabel: 'Add Gallery Photo / Video', summary: 'Upload photos or MP4/YouTube/Facebook videos directly to the public /gallery page, or edit existing posts.' },
    { key: 'listings', label: 'Listings', count: data.listings.length, addLabel: 'Add Directory Listing', summary: 'Approve pending submissions or directly add local businesses, auto drivers, and services to Hello Uliyil.' },
    { key: 'content', label: 'Projects / News / History', count: nonGalleryContent.length, addLabel: 'Add Project / News / History', summary: 'Add or edit Development Projects, Announcements, Uliyil History articles/videos, Institutions, and Meetings.' },
    { key: 'professionals', label: 'Professionals', count: data.professionals.length, addLabel: 'Add Ward Professional', summary: 'Add, edit, or approve Ward Professionals profiles shown on /professionals.' },
    { key: 'formerCouncillors', label: 'Former Councillors (Max 8)', count: data.formerCouncillors.length, addLabel: 'Add Former Councillor', summary: 'Manage photos and service years for up to 8 Former Councillors.' },
    { key: 'nearestPlaces', label: 'Nearest & Iritty Logos', count: data.nearestPlaces.length, addLabel: 'Add Nearest Shop / Logo', summary: 'Add or edit Iritty & nearby shops with large logos, Call & WhatsApp numbers.' },
    { key: 'requests', label: 'Requests', count: data.requests.length, summary: 'Review complaints, ideas, and appointment requests and update status.' }
  ];

  const visibleItems =
    tab === 'gallery'
      ? galleryEntries
      : tab === 'content'
      ? contentFilter === 'all'
        ? nonGalleryContent
        : nonGalleryContent.filter((c) => c.type === contentFilter)
      : data[tab];

  const activeMeta = tabMeta.find((t) => t.key === tab);
  const isEditableTab = tab !== 'requests';

  return (
    <main>
      <section className="inner-hero dark-hero">
        <div className="container">
          <span className="eyebrow">✳ &nbsp; AUTHORISED ACCESS ONLY</span>
          <h1>
            Community
            <br />
            <em>control room.</em>
          </h1>
          <p>Review submissions, edit gallery posts, upload videos/logos, and publish verified community updates.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          {!logged ? (
            <div className="form-card" style={{ maxWidth: 470, margin: 'auto' }}>
              <LockKeyhole size={29} />
              <h2 className="page-title" style={{ marginTop: 18 }}>
                Admin sign in
              </h2>
              <p className="page-lead">
                Access requires the ADMIN_PASSWORD environment variable. Public visitors cannot approve or edit content.
              </p>
              <form onSubmit={login}>
                <div className="field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button className="btn btn-forest" style={{ marginTop: 19 }}>
                  Sign in <ArrowUpRight size={16} />
                </button>
                {error && <p className="form-message error">{error}</p>}
              </form>
            </div>
          ) : (
            <>
              <div className="admin-heading">
                <div>
                  <span className="eyebrow">
                    <ShieldCheck size={15} /> SECURE MODERATION
                  </span>
                  <h2 className="page-title">Review, Edit &amp; Publish Dashboard</h2>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    await action({ action: 'logout' });
                    setLogged(false);
                  }}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>

              <div className="admin-quick-add" aria-label="Quick add shortcuts">
                <span className="admin-quick-label">Quick Add:</span>
                <button type="button" className="btn btn-forest admin-btn-sm" onClick={() => openQuickAdd('gallery')}>
                  <Plus size={14} /> Gallery Photo / Video
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('content', 'project')}>
                  <Plus size={14} /> Project
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('content', 'announcement')}>
                  <Plus size={14} /> Announcement
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('content', 'history')}>
                  <Plus size={14} /> History
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('listings')}>
                  <Plus size={14} /> Directory Listing
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('professionals')}>
                  <Plus size={14} /> Professional
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('nearestPlaces')}>
                  <Plus size={14} /> Nearest Shop
                </button>
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => openQuickAdd('formerCouncillors')}>
                  <Plus size={14} /> Former Councillor
                </button>
              </div>

              <div className="admin-tabs">
                {tabMeta.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className={tab === t.key ? 'active' : ''}
                    onClick={() => {
                      setTab(t.key);
                      if (t.key === 'gallery') setShowAdd(true);
                    }}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>
              <div className="admin-summary-row">
                <p className="admin-tab-summary">{activeMeta?.summary}</p>
                {activeMeta?.addLabel && (
                  <button
                    type="button"
                    className={`btn ${showAdd ? 'btn-outline' : 'btn-forest'} admin-btn-sm`}
                    onClick={() => setShowAdd((v) => !v)}
                  >
                    {showAdd ? (
                      <>
                        <X size={14} /> Hide Add Form
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> {activeMeta.addLabel}
                      </>
                    )}
                  </button>
                )}
              </div>

              {tab === 'content' && (
                <div className="category-cloud" style={{ marginTop: 0, marginBottom: 18 }}>
                  {['all', 'project', 'history', 'announcement', 'institution', 'organisation', 'meeting'].map((f) => {
                    const count = f === 'all' ? nonGalleryContent.length : nonGalleryContent.filter((c) => c.type === f).length;
                    return (
                      <button
                        key={f}
                        type="button"
                        className={contentFilter === f ? 'selected' : ''}
                        onClick={() => setContentFilter(f)}
                      >
                        {f === 'all' ? 'All Content' : f} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {notice && (
                <p
                  className={`form-message ${
                    notice.toLowerCase().includes('fail') || notice.toLowerCase().includes('max') || notice.toLowerCase().includes('under')
                      ? 'error'
                      : ''
                  }`}
                  style={{ marginBottom: 18, fontWeight: 700 }}
                >
                  {notice}
                </p>
              )}

              {/* Add Forms Placed Directly At Top Above Existing Entries */}
              {showAdd && tab === 'gallery' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Camera size={24} /> Add Photo or Video to Community Gallery
                  </h2>
                  <p className="page-lead">
                    Upload a ward photo or video (MP4/WebM/MOV up to 4 MB), or paste a YouTube / Facebook link to publish directly to <strong>/gallery</strong>.
                  </p>
                  <form className="form-grid" onSubmit={createGallery}>
                    <div className="field">
                      <label>Title / Event Name *</label>
                      <input name="title" required minLength={2} placeholder="e.g. Uliyil Grama Sabha 2026" />
                    </div>
                    <div className="field">
                      <label>Media Type</label>
                      <select
                        name="category"
                        value={galleryMediaType}
                        onChange={(e) => setGalleryMediaType(e.target.value as 'Photo' | 'Video')}
                      >
                        <option value="Photo">Photo</option>
                        <option value="Video">Video</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Upload Photo or Video File (max 4 MB)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            handleFileUpload(f, 'gallery-file', (u) => {
                              if (f.type.startsWith('video/')) {
                                setGalleryVideoUrl(u);
                                setGalleryMediaType('Video');
                              } else {
                                setGalleryImgUrl(u);
                                setGalleryMediaType('Photo');
                              }
                            });
                          }}
                        />
                        <small>
                          {uploadingField === 'gallery-file'
                            ? 'Uploading media...'
                            : galleryVideoUrl
                            ? `Video ready (${galleryVideoUrl})`
                            : galleryImgUrl
                            ? `Photo ready (${galleryImgUrl})`
                            : 'Supports JPG, PNG, WebP photos and MP4/WebM/MOV clips.'}
                        </small>
                      </div>
                    </div>
                    <div className="field">
                      <label>Locality / Place Tag</label>
                      <input name="locality" defaultValue="Uliyil Ward 19" placeholder="e.g. Kulikkadavu, Uliyil" />
                    </div>
                    <div className="field">
                      <label>Or Video Link (YouTube / Facebook / MP4)</label>
                      <input
                        name="url"
                        value={galleryVideoUrl}
                        onChange={(e) => {
                          setGalleryVideoUrl(e.target.value);
                          if (e.target.value.trim()) setGalleryMediaType('Video');
                        }}
                        placeholder="https://youtube.com/... or https://facebook.com/..."
                      />
                    </div>
                    <div className="field">
                      <label>Or Direct Photo Image URL</label>
                      <input
                        name="imageUrl"
                        value={galleryImgUrl}
                        onChange={(e) => setGalleryImgUrl(e.target.value)}
                        placeholder="https://... or /api/media/..."
                      />
                    </div>
                    <div className="field full">
                      <label>Caption / Description</label>
                      <textarea name="body" style={{ minHeight: 80 }} placeholder="Write short details about this photo or video..." />
                    </div>
                    <div className="field full">
                      <label className="check-row">
                        <input type="checkbox" name="publishNow" defaultChecked /> Publish immediately to /gallery
                      </label>
                    </div>
                    <div className="field full">
                      <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                        <Upload size={16} /> Publish to Gallery <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showAdd && tab === 'listings' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Plus size={24} /> Add Directory Listing (Hello Uliyil)
                  </h2>
                  <p className="page-lead">
                    Listings added by admin go live immediately under approved Hello Uliyil results.
                  </p>
                  <form className="form-grid" onSubmit={createListing}>
                    <div className="field">
                      <label>Business / Service Name *</label>
                      <input name="name" required minLength={2} placeholder="e.g. Uliyil Bakers & Cafe" />
                    </div>
                    <div className="field">
                      <label>Listing Type *</label>
                      <select name="listingType" defaultValue="business">
                        <option value="business">Local Business / Shop</option>
                        <option value="individual">Skilled Worker / Individual Service</option>
                        <option value="institution">Institution / Public Office</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Category *</label>
                      <select name="category" required defaultValue={categories[0]}>
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Locality *</label>
                      <input name="locality" defaultValue="Uliyil" required />
                    </div>
                    <div className="field">
                      <label>Phone Number *</label>
                      <input name="phone" type="tel" required placeholder="e.g. 9497530282" />
                    </div>
                    <div className="field">
                      <label>WhatsApp Number (optional)</label>
                      <input name="whatsapp" type="tel" placeholder="e.g. 9497530282" />
                    </div>
                    <div className="field">
                      <label>Working Hours / Availability</label>
                      <input name="availability" placeholder="e.g. 8:00 AM – 8:00 PM" />
                    </div>
                    <div className="field">
                      <label>Google Maps Link (optional)</label>
                      <input name="mapUrl" type="url" placeholder="https://maps.google.com/..." />
                    </div>
                    <div className="field full">
                      <label>Upload Cover Photo (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], 'listing-img', setListingImgUrl)}
                      />
                      <small>{uploadingField === 'listing-img' ? 'Uploading photo...' : listingImgUrl ? `Image ready: ${listingImgUrl}` : 'Optional JPG/PNG/WebP cover.'}</small>
                    </div>
                    <div className="field full">
                      <label>Services &amp; Description *</label>
                      <textarea name="description" required minLength={5} placeholder="Describe services, products, or landmarks..." />
                    </div>
                    <div className="field full">
                      <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                        <Plus size={16} /> Publish Listing <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showAdd && tab === 'content' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Plus size={25} /> Add Project, Announcement, or Uliyil History
                  </h2>
                  <p className="page-lead">
                    Choose <strong>project</strong> for Ward Projects, <strong>announcement</strong> for notices, or <strong>history</strong> for Uliyil History Articles &amp; Videos.
                  </p>
                  <form className="form-grid" onSubmit={createContent}>
                    <div className="field">
                      <label>Content type *</label>
                      <select value={newContentType} onChange={(e) => setNewContentType(e.target.value)} required>
                        <option value="project">project (Development Project)</option>
                        <option value="announcement">announcement (Ward Notice)</option>
                        <option value="history">history (History Article / Video)</option>
                        <option value="meeting">meeting (Grama Sabha / Meeting)</option>
                        <option value="institution">institution</option>
                        <option value="organisation">organisation</option>
                        <option value="gallery">gallery (Photo / Video)</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Category / Tag</label>
                      <input name="category" placeholder="e.g. Ongoing Project, Road Work, History Article" />
                    </div>
                    <div className="field full">
                      <label>Title *</label>
                      <input name="title" required minLength={2} />
                    </div>
                    <div className="field full">
                      <label>Description / Article Body</label>
                      <textarea name="body" placeholder="Write caption, article body, or description..." />
                    </div>
                    <div className="field">
                      <label>Locality / Author Note</label>
                      <input name="locality" placeholder="e.g. Uliyil / Era 1980s" />
                    </div>
                    <div className="field">
                      <label>Upload Photo or Video (direct from device)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            handleFileUpload(f, 'content-file', (u) => {
                              if (f.type.startsWith('video/')) setContentVideoUrl(u);
                              else setContentImgUrl(u);
                            });
                          }}
                        />
                        <small>
                          {uploadingField === 'content-file'
                            ? 'Uploading media...'
                            : contentVideoUrl
                            ? `Video ready (${contentVideoUrl})`
                            : contentImgUrl
                            ? `Image ready (${contentImgUrl})`
                            : 'Images or MP4 videos up to 4 MB.'}
                        </small>
                      </div>
                    </div>
                    <div className="field">
                      <label>Or Video / Original Post URL</label>
                      <input
                        name="url"
                        value={contentVideoUrl}
                        onChange={(e) => setContentVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/... or https://facebook.com/..."
                      />
                    </div>
                    <div className="field">
                      <label>Or Cover / Project Image URL</label>
                      <input
                        name="imageUrl"
                        value={contentImgUrl}
                        onChange={(e) => setContentImgUrl(e.target.value)}
                        placeholder="https://... or /api/media/..."
                      />
                    </div>
                    <div className="field full">
                      <label className="check-row">
                        <input type="checkbox" name="publishNow" defaultChecked /> Publish immediately to live site
                      </label>
                    </div>
                    <div className="field full">
                      <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                        <Upload size={16} /> Save Content <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showAdd && tab === 'professionals' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Plus size={25} /> Add Ward Professional
                  </h2>
                  <p className="page-lead">
                    Professionals added here are published immediately to the <strong>/professionals</strong> showcase.
                  </p>
                  <form className="form-grid" onSubmit={createProfessional}>
                    <div className="field">
                      <label>Full Name (English) *</label>
                      <input name="name" required placeholder="e.g. Dr. Anjali Menon" />
                    </div>
                    <div className="field">
                      <label>Name in Malayalam (optional)</label>
                      <input name="nameMl" placeholder="ഡോ. അഞ്ജലി മേനോൻ" />
                    </div>
                    <div className="field">
                      <label>Profession / Role *</label>
                      <input name="profession" required placeholder="e.g. Civil Engineer, Advocate, Doctor" />
                    </div>
                    <div className="field">
                      <label>Field / Category *</label>
                      <select name="category" required>
                        {professionalCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Qualification</label>
                      <input name="qualification" placeholder="e.g. B.Tech, M.Tech / MBBS" />
                    </div>
                    <div className="field">
                      <label>Locality *</label>
                      <input name="locality" defaultValue="Uliyil" required />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input name="phone" type="tel" />
                    </div>
                    <div className="field">
                      <label>WhatsApp</label>
                      <input name="whatsapp" type="tel" />
                    </div>
                    <div className="field full">
                      <label>Upload Portrait Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], 'pro-photo', setProPhotoUrl)}
                      />
                      <small>{uploadingField === 'pro-photo' ? 'Uploading photo...' : proPhotoUrl ? `Photo ready: ${proPhotoUrl}` : 'Optional JPG/PNG/WebP portrait.'}</small>
                    </div>
                    <div className="field full">
                      <label>Short Bio / Introduction *</label>
                      <textarea name="bio" required placeholder="Describe experience and specialization..." />
                    </div>
                    <div className="field full">
                      <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                        Publish Professional <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showAdd && tab === 'formerCouncillors' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Plus size={25} /> Add Former Councillor ({data.formerCouncillors.length} / 8)
                  </h2>
                  <p className="page-lead">
                    Maximum 8 former councillors with photo and tenure years (e.g., <strong>2015 – 2020</strong>).
                  </p>
                  {data.formerCouncillors.length >= 8 ? (
                    <div className="empty-state">
                      <h3>Maximum 8 Profiles Reached</h3>
                      <p>Edit existing entries below, or delete one if you need to add another.</p>
                    </div>
                  ) : (
                    <form className="form-grid" onSubmit={createFormer}>
                      <div className="field">
                        <label>Name (English) *</label>
                        <input name="name" required placeholder="e.g. Sri. K. Krishnan" />
                      </div>
                      <div className="field">
                        <label>Name (Malayalam)</label>
                        <input name="nameMl" placeholder="ശ്രീ. കെ. കൃഷ്ണൻ" />
                      </div>
                      <div className="field">
                        <label>Service Years *</label>
                        <input name="yearSpan" required placeholder="e.g. 2015 – 2020" />
                      </div>
                      <div className="field">
                        <label>Display Order (0 = First)</label>
                        <input name="sortOrder" type="number" defaultValue={data.formerCouncillors.length} min={0} max={20} />
                      </div>
                      <div className="field full">
                        <label>Upload Councillor Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files?.[0], 'former-photo', setFormerPhotoUrl)}
                        />
                        <small>{uploadingField === 'former-photo' ? 'Uploading photo...' : formerPhotoUrl ? `Photo ready: ${formerPhotoUrl}` : 'Upload clear portrait photo.'}</small>
                      </div>
                      <div className="field full">
                        <label>Brief Note (optional)</label>
                        <input name="note" placeholder="e.g. Served two terms · Development Pioneer" />
                      </div>
                      <div className="field full">
                        <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                          Save Former Councillor <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {showAdd && tab === 'nearestPlaces' && (
                <div id="admin-add-card" className="form-card admin-add-highlight" style={{ marginBottom: 22 }}>
                  <h2 className="page-title">
                    <Plus size={25} /> Add Nearest Shop / Landmark Logo (Iritty &amp; Nearby)
                  </h2>
                  <p className="page-lead">
                    Add major shops, supermarkets, hospitals, and showrooms in Iritty or around Uliyil with their shop logo.
                  </p>
                  <form className="form-grid" onSubmit={createNearest}>
                    <div className="field">
                      <label>Shop / Brand Name *</label>
                      <input name="name" required placeholder="e.g. Iritty Hypermarket" />
                    </div>
                    <div className="field">
                      <label>Town / Area *</label>
                      <select name="town" required defaultValue="Iritty">
                        {nearestTowns.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Category *</label>
                      <select name="category" required>
                        {nearestCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Distance / Location Note</label>
                      <input name="distanceNote" placeholder="e.g. 3 km from Uliyil · Main Road, Iritty" />
                    </div>
                    <div className="field">
                      <label>Phone Number</label>
                      <input name="phone" type="tel" placeholder="e.g. 9497530282" />
                    </div>
                    <div className="field">
                      <label>WhatsApp Number</label>
                      <input name="whatsapp" type="tel" placeholder="e.g. 9497530282 or +91 94975..." />
                      <small>Optional — adds a direct WhatsApp chat button on Nearest page.</small>
                    </div>
                    <div className="field">
                      <label>Google Map URL</label>
                      <input name="mapUrl" type="url" placeholder="https://maps.google.com/..." />
                    </div>
                    <div className="field">
                      <label>Website URL (optional)</label>
                      <input name="websiteUrl" type="url" placeholder="https://..." />
                    </div>
                    <div className="field full">
                      <label>Upload Shop Logo *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], 'nearest-logo', setNearestLogoUrl)}
                      />
                      <small>{uploadingField === 'nearest-logo' ? 'Uploading logo...' : nearestLogoUrl ? `Logo ready: ${nearestLogoUrl}` : 'Upload PNG, JPG, WebP, or SVG logo (displays prominently on Nearest page).'}</small>
                    </div>
                    <div className="field full">
                      <label>Short Note</label>
                      <textarea name="description" style={{ minHeight: 80 }} placeholder="Products, timings, or landmarks..." />
                    </div>
                    <div className="field full">
                      <button className="btn btn-forest" disabled={busy || uploadingField !== null}>
                        Publish to Nearest Page <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Items List */}
              <div className="form-card">
                {visibleItems.length ? (
                  visibleItems.map((item) => {
                    const thumb = item.photoUrl || item.logoUrl || item.imageUrl;
                    return (
                      <div className="admin-item" key={item.id}>
                        <div className="admin-item-info">
                          {thumb ? (
                            <img src={thumb} alt="" className="admin-thumb" />
                          ) : item.url ? (
                            <div className="admin-thumb video-badge">
                              <Film size={20} />
                            </div>
                          ) : null}
                          <div style={{ minWidth: 0 }}>
                            <strong>
                              {item.name || item.title || `${item.kind} · ${item.category}`}
                              {item.yearSpan ? ` (${item.yearSpan})` : ''}
                              {item.profession ? ` — ${item.profession}` : ''}
                              {item.town ? ` · ${item.town}` : ''}
                            </strong>
                            <small>
                              {item.id} · {item.type || item.kind || item.category || ''} {item.status ? `· ${item.status}` : ''} ·{' '}
                              {new Date(item.createdAt).toLocaleDateString('en-IN')}
                            </small>
                            <p>
                              {item.description || item.bio || item.note || item.body || item.locality || item.distanceNote}{' '}
                              {item.phone && ` · Call: ${item.phone}`}
                              {item.whatsapp && ` · WA: ${item.whatsapp}`}
                            </p>
                            {item.url && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                Open attached video / link ↗
                              </a>
                            )}
                            {item.photoMime && (
                              <a href={`/api/admin/photo?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                                View private photo ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="admin-item-actions">
                          {tab !== 'formerCouncillors' && (
                            <select
                              value={item.status}
                              disabled={busy}
                              aria-label={`Change status for ${item.name || item.title || item.id}`}
                              onChange={(e) =>
                                action({
                                  action:
                                    tab === 'listings'
                                      ? 'listing'
                                      : tab === 'requests'
                                      ? 'request'
                                      : tab === 'professionals'
                                      ? 'professional'
                                      : tab === 'nearestPlaces'
                                      ? 'nearest'
                                      : 'content',
                                  id: item.id,
                                  status: e.target.value
                                })
                              }
                            >
                              {(tab === 'listings'
                                ? ['pending', 'approved', 'rejected', 'removed']
                                : tab === 'requests'
                                ? ['received', 'reviewing', 'resolved', 'closed', 'approved', 'rejected']
                                : tab === 'professionals'
                                ? ['pending', 'approved', 'rejected']
                                : tab === 'nearestPlaces'
                                ? ['published', 'draft']
                                : ['draft', 'published', 'archived']
                              ).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          )}

                          {isEditableTab && (
                            <button
                              type="button"
                              className="btn btn-outline admin-btn-sm"
                              disabled={busy}
                              onClick={() => openEdit(tab === 'gallery' ? 'content' : (tab as EditKind), item)}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                          )}

                          {(tab === 'gallery' || tab === 'content' || tab === 'professionals' || tab === 'formerCouncillors' || tab === 'nearestPlaces') && (
                            <button
                              type="button"
                              className="btn btn-outline admin-btn-sm admin-btn-danger"
                              disabled={busy}
                              aria-label="Delete item"
                              onClick={() => {
                                if (!confirm('Delete this entry permanently?')) return;
                                action({
                                  action:
                                    tab === 'gallery' || tab === 'content'
                                      ? 'delete-content'
                                      : tab === 'professionals'
                                      ? 'delete-professional'
                                      : tab === 'formerCouncillors'
                                      ? 'delete-former-councillor'
                                      : 'delete-nearest',
                                  id: item.id
                                });
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <h3>Nothing here yet</h3>
                    <p>Use the form above or Quick Add shortcuts to publish entries here.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Rich In-Page Edit Modal */}
      {editing && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit entry">
          <div className="admin-modal-card">
            <div className="admin-modal-head">
              <h3>
                <Pencil size={18} /> Edit{' '}
                {editing.kind === 'content'
                  ? 'Gallery / Content Entry'
                  : editing.kind === 'listings'
                  ? 'Directory Listing'
                  : editing.kind === 'professionals'
                  ? 'Ward Professional'
                  : editing.kind === 'formerCouncillors'
                  ? 'Former Councillor'
                  : 'Nearest Shop / Logo'}
              </h3>
              <button type="button" className="icon-control" onClick={() => setEditing(null)} aria-label="Close editor">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveEdit} className="form-grid">
              {editing.kind === 'content' && (
                <>
                  {(editing.form.imageUrl || editing.form.url) && (
                    <div className="field full admin-edit-preview">
                      {editing.form.imageUrl && (
                        <img src={editing.form.imageUrl} alt="Current preview" />
                      )}
                      {editing.form.url && (
                        <small style={{ overflowWrap: 'anywhere' }}>Attached URL: {editing.form.url}</small>
                      )}
                    </div>
                  )}
                  <div className="field">
                    <label>Content Type</label>
                    <select value={editing.form.type} onChange={(e) => updateEditField('type', e.target.value)}>
                      <option value="gallery">gallery</option>
                      <option value="history">history</option>
                      <option value="announcement">announcement</option>
                      <option value="project">project</option>
                      <option value="meeting">meeting</option>
                      <option value="institution">institution</option>
                      <option value="organisation">organisation</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Status</label>
                    <select value={editing.form.status} onChange={(e) => updateEditField('status', e.target.value)}>
                      <option value="published">published</option>
                      <option value="draft">draft</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label>Title *</label>
                    <input value={editing.form.title} onChange={(e) => updateEditField('title', e.target.value)} required minLength={2} />
                  </div>
                  <div className="field">
                    <label>Category / Tag</label>
                    <input value={editing.form.category} onChange={(e) => updateEditField('category', e.target.value)} placeholder="Photo, Video, History Article..." />
                  </div>
                  <div className="field">
                    <label>Locality / Note</label>
                    <input value={editing.form.locality} onChange={(e) => updateEditField('locality', e.target.value)} />
                  </div>
                  <div className="field full">
                    <label>Caption / Description / Body</label>
                    <textarea value={editing.form.body} onChange={(e) => updateEditField('body', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Replace Photo from Device</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'edit-img', (u) => updateEditField('imageUrl', u))}
                    />
                    <small>{uploadingField === 'edit-img' ? 'Uploading photo...' : 'Replaces Photo URL below automatically.'}</small>
                  </div>
                  <div className="field">
                    <label>Replace Video from Device (up to 4 MB)</label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'edit-vid', (u) => updateEditField('url', u))}
                    />
                    <small>{uploadingField === 'edit-vid' ? 'Uploading video...' : 'Or paste YouTube / FB link below.'}</small>
                  </div>
                  <div className="field">
                    <label>Photo URL</label>
                    <div className="admin-inline-input">
                      <input value={editing.form.imageUrl} onChange={(e) => updateEditField('imageUrl', e.target.value)} placeholder="https://... or /api/media/..." />
                      {editing.form.imageUrl && (
                        <button type="button" onClick={() => updateEditField('imageUrl', '')}>Clear</button>
                      )}
                    </div>
                  </div>
                  <div className="field">
                    <label>Video or Original Post URL</label>
                    <div className="admin-inline-input">
                      <input value={editing.form.url} onChange={(e) => updateEditField('url', e.target.value)} placeholder="https://youtube.com/... or /api/media/..." />
                      {editing.form.url && (
                        <button type="button" onClick={() => updateEditField('url', '')}>Clear</button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {editing.kind === 'listings' && (
                <>
                  <div className="field">
                    <label>Display Name *</label>
                    <input value={editing.form.name} onChange={(e) => updateEditField('name', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Phone Number *</label>
                    <input value={editing.form.phone} onChange={(e) => updateEditField('phone', e.target.value)} required />
                  </div>
                  <div className="field full">
                    <label>Description *</label>
                    <textarea value={editing.form.description} onChange={(e) => updateEditField('description', e.target.value)} required />
                  </div>
                </>
              )}

              {editing.kind === 'professionals' && (
                <>
                  <div className="field">
                    <label>Full Name (English) *</label>
                    <input value={editing.form.name} onChange={(e) => updateEditField('name', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Name (Malayalam)</label>
                    <input value={editing.form.nameMl} onChange={(e) => updateEditField('nameMl', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Profession *</label>
                    <input value={editing.form.profession} onChange={(e) => updateEditField('profession', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select value={editing.form.category} onChange={(e) => updateEditField('category', e.target.value)}>
                      {professionalCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Qualification</label>
                    <input value={editing.form.qualification} onChange={(e) => updateEditField('qualification', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Locality</label>
                    <input value={editing.form.locality} onChange={(e) => updateEditField('locality', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input value={editing.form.phone} onChange={(e) => updateEditField('phone', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>WhatsApp</label>
                    <input value={editing.form.whatsapp} onChange={(e) => updateEditField('whatsapp', e.target.value)} />
                  </div>
                  <div className="field full">
                    <label>Replace Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'edit-pro-photo', (u) => updateEditField('photoUrl', u))}
                    />
                    <input style={{ marginTop: 8 }} value={editing.form.photoUrl} onChange={(e) => updateEditField('photoUrl', e.target.value)} placeholder="Photo URL" />
                  </div>
                  <div className="field full">
                    <label>Bio *</label>
                    <textarea value={editing.form.bio} onChange={(e) => updateEditField('bio', e.target.value)} required />
                  </div>
                </>
              )}

              {editing.kind === 'formerCouncillors' && (
                <>
                  <div className="field">
                    <label>Name (English) *</label>
                    <input value={editing.form.name} onChange={(e) => updateEditField('name', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Name (Malayalam)</label>
                    <input value={editing.form.nameMl} onChange={(e) => updateEditField('nameMl', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Service Years *</label>
                    <input value={editing.form.yearSpan} onChange={(e) => updateEditField('yearSpan', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Display Order</label>
                    <input type="number" value={editing.form.sortOrder} onChange={(e) => updateEditField('sortOrder', e.target.value)} />
                  </div>
                  <div className="field full">
                    <label>Replace Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'edit-fc-photo', (u) => updateEditField('photoUrl', u))}
                    />
                    <input style={{ marginTop: 8 }} value={editing.form.photoUrl} onChange={(e) => updateEditField('photoUrl', e.target.value)} placeholder="Photo URL" />
                  </div>
                  <div className="field full">
                    <label>Note</label>
                    <input value={editing.form.note} onChange={(e) => updateEditField('note', e.target.value)} />
                  </div>
                </>
              )}

              {editing.kind === 'nearestPlaces' && (
                <>
                  {editing.form.logoUrl && (
                    <div className="field full admin-edit-preview">
                      <img src={editing.form.logoUrl} alt="Current shop logo" style={{ background: '#fff', padding: 8 }} />
                    </div>
                  )}
                  <div className="field">
                    <label>Shop / Place Name *</label>
                    <input value={editing.form.name} onChange={(e) => updateEditField('name', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Town / Area</label>
                    <select value={editing.form.town} onChange={(e) => updateEditField('town', e.target.value)}>
                      {nearestTowns.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select value={editing.form.category} onChange={(e) => updateEditField('category', e.target.value)}>
                      {nearestCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Distance / Location Note</label>
                    <input value={editing.form.distanceNote} onChange={(e) => updateEditField('distanceNote', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input value={editing.form.phone} onChange={(e) => updateEditField('phone', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>WhatsApp Number</label>
                    <input value={editing.form.whatsapp} onChange={(e) => updateEditField('whatsapp', e.target.value)} placeholder="e.g. 9497530282" />
                  </div>
                  <div className="field">
                    <label>Google Map URL</label>
                    <input value={editing.form.mapUrl} onChange={(e) => updateEditField('mapUrl', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Website URL</label>
                    <input value={editing.form.websiteUrl} onChange={(e) => updateEditField('websiteUrl', e.target.value)} />
                  </div>
                  <div className="field full">
                    <label>Replace Shop Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'edit-logo', (u) => updateEditField('logoUrl', u))}
                    />
                    <input style={{ marginTop: 8 }} value={editing.form.logoUrl} onChange={(e) => updateEditField('logoUrl', e.target.value)} placeholder="Logo URL" />
                  </div>
                  <div className="field full">
                    <label>Short Note</label>
                    <textarea value={editing.form.description} onChange={(e) => updateEditField('description', e.target.value)} style={{ minHeight: 80 }} />
                  </div>
                </>
              )}

              <div className="field full" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-forest" disabled={busy || uploadingField !== null}>
                  {busy ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
