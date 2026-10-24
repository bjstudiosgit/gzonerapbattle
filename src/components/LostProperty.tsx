import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, X, Gavel, UserRound, RefreshCw, Check, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { museumItems, type MuseumItem } from '../data/museum';
import { getBackstageSession, watchBackstageSession, type BackstageSession } from '../lib/backstage';
import { auctionOpen, getMuseumAuctions, minimumBid, money, placeMuseumBid, rememberMuseumItem, type MuseumAuction } from '../lib/museumAuctions';
import MuseumArt, { gravePhotos, revisionSheetPhotos } from './MuseumArt';
import './museum.css';

const restricted = (item: MuseumItem) => /\bcrack\b/i.test(item.name);
const dateLabel = (date: string) => new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });

export default function LostProperty() {
  const [params, setParams] = useSearchParams();
  const selected = museumItems.find(item => item.id === params.get('item'));
  const [session, setSession] = useState<BackstageSession | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');
  const [auctions, setAuctions] = useState<MuseumAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [photoIndex, setPhotoIndex] = useState(0);
  const offset = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    const apply = (next: BackstageSession | null) => { if (active) { setSession(next); setAuthChecking(false); setAuthError(''); } };
    const stop = watchBackstageSession(apply);
    getBackstageSession().then(apply).catch(() => { if (active) { setAuthChecking(false); setAuthError('We couldn’t check your membership. Refresh the page to try again.'); } });
    return () => { active = false; stop(); };
  }, []);

  useEffect(() => {
    let active = true;
    let inFlight = false;
    setLoading(true);
    setAuctions([]);
    async function refresh() {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const next = await getMuseumAuctions();
        if (active) {
          if (next[0]) offset.current = Date.parse(next[0].server_time) - Date.now();
          setNow(Date.now() + offset.current); setAuctions(next); setLoadError('');
        }
      } catch (cause) { if (active) setLoadError(cause instanceof Error ? cause.message : 'Bids couldn’t load.'); }
      finally { inFlight = false; if (active) setLoading(false); }
    }
    void refresh();
    const interval = window.setInterval(refresh, 15000);
    const tick = window.setInterval(() => setNow(Date.now() + offset.current), 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => { active = false; window.clearInterval(interval); window.clearInterval(tick); document.removeEventListener('visibilitychange', refresh); };
  }, [session?.user.id, retry]);

  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
    if (!selected && dialog.current?.open) dialog.current?.close();
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; opener.current?.focus(); };
  }, [selected?.id]);

  const close = useCallback(() => setParams(current => { const next = new URLSearchParams(current); next.delete('item'); return next; }, { preventScrollReset: true }), [setParams]);
  function open(item: MuseumItem, button: HTMLElement) {
    opener.current = button;
    setPhotoIndex(0);
    setParams({ item: item.id }, { preventScrollReset: true });
  }
  const activeAuction = auctions.find(auction => auction.item_id === selected?.id);
  const detailPhotos = selected?.name === 'Key Stage 2 English Revision Sheets' ? revisionSheetPhotos : selected?.name === 'Mock headstone photograph bearing Btizz’s name' ? gravePhotos : null;
  const availableItems = museumItems.filter(item => !restricted(item));
  const unavailableItems = museumItems.filter(restricted);
  function renderItem(item: MuseumItem) {
    const auction = auctions.find(entry => entry.item_id === item.id);
    const openNow = !restricted(item) && auctionOpen(auction, now);
    return <button key={item.id} className="gbay-item" onClick={event => open(item, event.currentTarget)} aria-label={`View ${item.name}${openNow ? ' and bid' : ''}`}>
      <MuseumArt item={item} photo={auction?.image_url} />
      <div className="gbay-item-meta">{!openNow && <span>{restricted(item) ? 'Archive only' : loading ? 'Loading bids…' : loadError ? 'Bids unavailable' : auction?.status === 'cancelled' ? 'Withdrawn' : auction ? 'Bidding closed' : 'Opening soon'}</span>}</div>
      <h3>{item.name}</h3><p className="gbay-owner">Used by <strong>{item.user}</strong></p><p className="gbay-battle">{item.battleTitle}</p>
      <div className="gbay-item-price">{restricted(item) ? <strong className="gbay-archive-label">In the archive</strong> : <><strong>{money(auction?.current_pence ?? auction?.starting_pence ?? 99)}</strong><span>{auction?.current_pence != null ? `${auction.bid_count} ${auction.bid_count === 1 ? 'bid' : 'bids'}` : 'Starting bid'}</span></>}<ArrowRight size={18} /></div>
      {auction?.is_leading && <p className="gbay-leading"><Check size={13} /> {openNow ? 'You’re leading' : 'Your bid is highest'}</p>}
      {openNow && auction?.ends_at && <p className="gbay-ending">Ends {dateLabel(auction.ends_at)} UK</p>}
    </button>;
  }
  return <main className="gbay-page">
    <Helmet><title>gingaBay — Gzone Museum BETA | The Gzone</title><meta name="description" content="The props. The punchlines. Bid on a piece of Gzone history from 99p. Sign in with your Gzone membership and track your bids in settings." /><link rel="canonical" href="https://www.gzonerapbattle.co.uk/gingabay" /><meta property="og:url" content="https://www.gzonerapbattle.co.uk/gingabay" /></Helmet>
    <div className="gbay-shell">
      <header className="gbay-header">
        <div className="gbay-brand"><h1>ginga<span>Bay</span><span className="gbay-dot">.</span></h1><span className="gbay-beta">BETA</span></div>
        <div className="gbay-intro"><h2>FIND IT. BID ON IT. EXPLAIN IT LATER.</h2><p>Welcome to gingaBay — bid on the props used in Gzone battles. Fancy Tymeless’s fake beard? Get involved from <strong>99p</strong>, with bids going up just <strong>20p</strong> at a time. Sign in, pick your prop and give your mates something to bid against.</p></div>
      </header>
      <div className="gbay-members-strip"><Gavel size={19} /><p>{session ? 'Your bids are saved to your Gzone account.' : 'Bidding requires a Gzone membership. Join with Google; no payment details are collected.'}</p><Link to="/backstage/settings">{session ? 'View my bids' : 'Sign in / join Gzone'} <ArrowRight size={15} /></Link></div>
      <section aria-labelledby="gbay-items-title" className="gbay-catalogue">
        <div className="gbay-section-title"><h2 id="gbay-items-title">FROM THE BATTLES</h2><span>{availableItems.length} props · Season 1</span></div>
        <p className="gbay-photo-note">Explore the props from Gzone battles. Select one for its story and bidding details.</p>
        {loadError && <div className="gbay-notice" role="status"><span>Live bidding is unavailable right now. You can still explore the museum.</span><button onClick={() => setRetry(value => value + 1)}><RefreshCw size={14} /> Retry</button></div>}
        <div className="gbay-grid">{availableItems.map(renderItem)}</div>
      </section>
      {unavailableItems.length > 0 && <section aria-labelledby="gbay-unavailable-title" className="gbay-catalogue gbay-unavailable">
        <div className="gbay-section-title"><h2 id="gbay-unavailable-title">UNAVAILABLE</h2></div>
        <p className="gbay-photo-note">These props are kept in the archive and cannot be bid on.</p>
        <div className="gbay-grid">{unavailableItems.map(renderItem)}</div>
      </section>}
    </div>
    <dialog ref={dialog} onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }} className="gbay-dialog" aria-labelledby="gbay-lot-title">
      <button className="gbay-close" aria-label="Close item" onClick={close}><X size={22} /></button>
      {selected && <div className="gbay-detail"><div><MuseumArt item={selected} photo={activeAuction?.image_url} imageIndex={photoIndex} />{detailPhotos && !activeAuction?.image_url && <div className="gbay-sheet-gallery" role="group" aria-label={`${selected.name} photos`}>{detailPhotos.map((photo, index) => <button key={photo.src} type="button" className={index === photoIndex ? 'is-selected' : ''} aria-pressed={index === photoIndex} onClick={() => setPhotoIndex(index)}><img src={photo.src} alt="" /><span>{photo.label}</span></button>)}</div>}<p className="gbay-photo-note">{activeAuction?.image_url ? 'See the condition details before bidding.' : selected.name === 'Key Stage 2 English Revision Sheets' ? 'Battle photos showing the sheets in use. See condition details before bidding.' : selected.name === 'Mock headstone photograph bearing Btizz’s name' ? 'Battle and close-up views of the print. See condition details before bidding.' : selected.name === 'Fake Beard' || selected.name === 'Tymeless Lime' || selected.name === 'Key Stage 2 Mathematics Sheet' || selected.name === 'K.I.M.E Sheet' || selected.name === 'K.I.M.E baby shoes' || selected.name === 'Trojan Condom' || selected.name === 'A jar of Marmalade' || selected.name === 'Pink handbag' || selected.name === "Google Maps screenshot of Btizz's modest family home" || selected.name === 'Adoption papers presented to prove Deeno was going to “father” Btizz' ? 'Battle photo showing the prop in use. See condition details before bidding.' : 'Illustration, not a photograph of the actual item.'}</p><Link className="gbay-watch" to={`/battle/${selected.battleSlug}`}>Watch the battle <ExternalLink size={14} /></Link></div><div className="gbay-detail-copy"><p className="gbay-kicker">GZONE MUSEUM BETA</p><h2 id="gbay-lot-title">{selected.name}</h2><p className="gbay-owner">Used by <strong>{selected.user}</strong></p><p className="gbay-battle">{selected.battleTitle}</p>
        <BidPanel key={`${selected.id}:${session?.user.id ?? 'guest'}`} item={selected} auction={activeAuction} session={session} checking={authChecking} unavailable={Boolean(loadError) || loading} now={now} onRefresh={() => setRetry(value => value + 1)} />
        {authError && <p role="alert" className="gbay-error">{authError}</p>}
        <dl className="gbay-facts"><div><dt>Condition</dt><dd>{activeAuction?.condition_note ?? 'Condition details to be confirmed by Gzone.'}</dd></div><div><dt>From the battle</dt><dd>{selected.battleDate ?? 'Season 1'}{selected.episode && ` · ${selected.episode}`}</dd></div></dl>
      </div></div>}
    </dialog>
  </main>;
}

function BidPanel({ item, auction, session, checking, unavailable, now, onRefresh }: { item: MuseumItem; auction?: MuseumAuction; session: BackstageSession | null; checking: boolean; unavailable: boolean; now: number; onRefresh: () => void }) {
  const [review, setReview] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const request = useRef<{ amount: number; id: string } | null>(null);
  const open = auctionOpen(auction, now) && !restricted(item);
  const min = auction ? minimumBid(auction) : 99;
  const timingMessage = auction?.status === 'cancelled' ? 'This listing has been withdrawn.' : auction && !open ? Date.parse(auction.starts_at) > now ? `Opens ${dateLabel(auction.starts_at)} UK` : 'Bidding has ended.' : auction?.ends_at ? `Ends ${dateLabel(auction.ends_at)} UK` : null;
  async function submit() {
    if (busy || review === null || !open || unavailable || review !== min) return;
    setBusy(true); setError('');
    if (request.current?.amount !== review) request.current = { amount: review, id: crypto.randomUUID() };
    try {
      await placeMuseumBid(item.id, review, request.current.id);
      setSuccess(`Your ${money(review)} bid has been saved to your account.`);
      setReview(null); request.current = null; onRefresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Your bid couldn’t be confirmed. Please try again.'); onRefresh(); }
    finally { setBusy(false); }
  }
  if (restricted(item)) return <div className="gbay-bid-panel"><strong>Archive only</strong><p>This exhibit is not offered for sale.</p></div>;
  return <div className="gbay-bid-panel">
    <p>{auction?.current_pence != null ? 'Current bid' : 'Starting bid'}</p><div className="gbay-big-price">{money(auction?.current_pence ?? auction?.starting_pence ?? 99)}<span>{auction ? `${auction.bid_count} bids` : 'From 99p'}</span></div>
    {timingMessage && <p className="gbay-ending">{timingMessage}</p>}
    {success && <p className="gbay-success" role="status"><Check size={17} /> {success} <Link to="/backstage/settings">View my bids</Link></p>}
    {!auction && !unavailable ? <p>Bidding on this item is opening soon.</p>
      : !session ? <><p className="gbay-signin-copy">Sign in with your Gzone membership to place a bid and keep track of it in your account.</p><Link className="gbay-primary" to="/backstage" onClick={() => rememberMuseumItem(item.id)}><UserRound size={17} /> {checking ? 'Checking membership…' : 'Sign in / join to bid'} <ArrowRight size={17} /></Link></>
      : unavailable ? <p role="status">Live bidding is unavailable. Please retry from the museum page.</p>
      : !open ? <Link className="gbay-text-link" to="/backstage/settings">View your bidding history <ArrowRight size={14} /></Link>
      : auction.is_leading ? <p className="gbay-leading"><Check size={17} /> You hold the highest bid. Follow it in <Link to="/backstage/settings">your settings</Link>.</p>
      : review !== null ? <div className="gbay-confirm"><h3>CONFIRM YOUR BID</h3><p>You’re bidding <strong>{money(review)}</strong> for <strong>{item.name}</strong>. This bid will be registered against your Gzone account.</p><p>Just for fun — no commitment to buy and no payment taken.</p><button className="gbay-primary" disabled={busy || review !== min} onClick={submit}>{busy ? 'Saving your bid…' : `Confirm ${money(review)} bid`}</button>{review !== min && <p role="alert" className="gbay-error">The next bid is now {money(min)}. Go back to use the updated amount.</p>}<button className="gbay-text-link" disabled={busy} onClick={() => setReview(null)}>Back</button></div>
      : <div><p className="gbay-small">Just for fun. No commitment to buy. Each new bid goes up by 20p.</p><button className="gbay-primary" onClick={() => { setError(''); setReview(min); }}>Bid {money(min)} <ArrowRight size={17} /></button></div>}

    {error && <p className="gbay-error" role="alert">{error}</p>}
  </div>;
}
