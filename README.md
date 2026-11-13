# My Uliyil

A community-first site for Uliyil, Iritty Municipality, Kannur, Kerala. Built with Next.js App Router, TypeScript, Tailwind CSS, Drizzle ORM and PostgreSQL. Public listing submissions, issue reports, ideas, and appointment requests are persistent and moderated.

## Setup

1. `npm install`
2. Create `.env` with `DATABASE_URL=postgresql://...`, `ADMIN_PASSWORD=<long-random-password>`, `ADMIN_SESSION_SECRET=<different-long-random-secret>`, and `NEXT_PUBLIC_SITE_URL=https://your-domain.example`.
3. `npx drizzle-kit push`
4. `npm run dev` for local development. Deploy to a Node-capable host such as Vercel with a persistent PostgreSQL database. Set the same environment variables there and apply the schema before launch.

Admin login: `/admin`. Without `ADMIN_PASSWORD`, admin access is intentionally disabled. Use a long unique password and protect deployment secrets. Public visitors cannot publish content; submissions are pending. Approving a listing is a human review action. Admins can create announcements, meetings, projects, gallery items, institutions, organisations and services as drafts, then publish or archive them. Expired announcements can be configured in the database using `expires_at`.

## Launch checklist

- [x] Place the supplied, unaltered councillor portrait at `public/images/shabna-teacher.jpg` (or edit `site.councillor.portrait` in `src/lib/config.ts`). The site shows an explicit placeholder until it exists.
- [ ] Check and edit the bilingual welcome message in `src/lib/config.ts` with an authorised Malayalam translation.
- [ ] Confirm institutions, organisations, map details, emergency contacts and local service details before publishing. Ward 19, Iritty Municipality, Kannur District and Kerala are the configured public location details. Unknown details are deliberately omitted.
- [ ] Have a moderator review and approve resident listings and all published content. Confirm public phone-number consent with providers.
- [ ] Add only authentic, licensed ward photos to approved gallery entries. The existing landscape and community images are clearly labelled illustrative Pexels photography, not Uliyil events.
- [ ] Set an optional official Google Form URL in `site.googleIdeaFormUrl`; otherwise the local persistent form is used.
- [ ] Confirm all official government portal links and current service eligibility and document requirements. The services hub provides links only, not eligibility decisions or invented official forms.
- [ ] Set `NEXT_PUBLIC_SITE_URL` for correct sitemap URLs.

## Facebook gallery

The provided `facebook.com/share/...` address does **not** identify an API-authorised Facebook Page. Automatic sync is not enabled or claimed. The site uses the official Facebook Embedded Posts plugin fallback: an administrator can add a public post URL as a gallery entry, publish it after checking permissions, and the official plugin displays it where allowed. If the post is unavailable or private, Facebook may not render the embed; the original URL remains accessible. No scraping is used. Instagram links open the supplied official profile.

For future official auto-sync, confirm the underlying account is an eligible Facebook Page, obtain its Page ID and a server-side Page access token with Meta-approved `pages_read_engagement` (and any additional Page feed permissions required by Meta), then implement a background synchronisation process with deduplication, expiry handling, and policy-compliant media references. Never expose tokens in browser code. Meta Pages API docs: https://developers.facebook.com/docs/pages-api/ and https://developers.facebook.com/docs/graph-api/reference/page/feed/ .

## Privacy and constraints

The database is accessed only from server routes; there is no browser database connection and therefore no client-side database role or RLS policy to bypass. API routes enforce public read filters and admin-only mutations. If migrating to Supabase client access, enable RLS before exposing its anon key. Complaints and appointments are never shown publicly. Private tracking requires both the UUID reference and a randomly generated token. Basic in-memory request throttling and a honeypot protect forms; for production scale across multiple serverless instances, add an external rate limiter and CAPTCHA. Issue reports accept private JPG/PNG/WebP photos up to 3 MB, which are compressed server-side and only served through an authenticated admin route. Directory listing images currently accept permitted external URLs rather than raw uploads; use a vetted storage provider with scanning and signed upload URLs before enabling public listing file uploads. Geolocation is opt-in, and coordinates are not stored; the visitor chooses the locality filter. The gallery uses lazy-loaded media. Contact actions open the device dialler or WhatsApp; they do not place calls automatically.
