import Link from 'next/link';
import { Award, ArrowUpRight, UserRound, BookOpen } from 'lucide-react';
import { T } from './Translated';

export type FormerCouncillorItem = {
  id: string;
  name: string;
  nameMl: string | null;
  yearSpan: string;
  note: string | null;
  photoUrl: string | null;
};

export function FormerCouncillorsGrid({
  items,
  showHistoryLink = true
}: {
  items: FormerCouncillorItem[];
  showHistoryLink?: boolean;
}) {
  return (
    <div id="former-councillors">
      <div className="section-heading" style={{ marginBottom: 32 }}>
        <div>
          <span className="eyebrow">
            <span className="eyebrow-line" /> <T en="OUR LEADERSHIP LEGACY" ml="നമ്മുടെ മുൻ സാരഥികൾ" />
          </span>
          <h2 className="page-title" style={{ marginTop: 12 }}>
            <T en="Former Councillors of Uliyil" ml="ഉളിയിലിലെ മുൻ കൗൺസിലർമാർ" />
          </h2>
          <p className="page-lead" style={{ marginBottom: 0 }}>
            <T
              en="Honouring the past Ward Councillors who served and shaped Uliyil through the years."
              ml="വർഷങ്ങളായി ഉളിയിൽ വാർഡിനെ നയിക്കുകയും സേവിക്കുകയും ചെയ്ത മുൻ കൗൺസിലർമാർക്കുള്ള ആദരം."
            />
          </p>
        </div>
        {showHistoryLink && (
          <Link href="/history" className="btn btn-forest">
            <BookOpen size={17} />{' '}
            <T en="Uliyil History & Videos" ml="ഉളിയിലിന്റെ ചരിത്രവും വീഡിയോകളും" /> <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      {items.length ? (
        <div className="former-grid">
          {items.slice(0, 8).map((c) => (
            <article className="former-card" key={c.id}>
              <div className="former-photo">
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.name} loading="lazy" />
                ) : (
                  <div className="portrait-placeholder">
                    <UserRound size={36} strokeWidth={1.3} />
                  </div>
                )}
              </div>
              <div className="former-body">
                <span className="year-pill">
                  <Award size={13} /> {c.yearSpan}
                </span>
                <h3>
                  <T en={c.name} ml={c.nameMl || c.name} />
                </h3>
                {c.note && <p>{c.note}</p>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Award size={36} />
          <h3>
            <T en="Former Councillor profiles coming soon" ml="മുൻ കൗൺസിലർമാരുടെ വിവരങ്ങൾ ഉടൻ ചേർക്കും" />
          </h3>
          <p>
            <T
              en="Ward moderators can add up to 8 former councillors (with portrait photos and service years) from the Admin portal."
              ml="അഡ്മിൻ പാനൽ വഴി മുൻ കൗൺസിലർമാരുടെ ഫോട്ടോയും സേവന കാലാവധിയും (പരമാവധി 8 പേർ) ഇവിടെ ചേർക്കാവുന്നതാണ്."
            />
          </p>
        </div>
      )}
    </div>
  );
}
