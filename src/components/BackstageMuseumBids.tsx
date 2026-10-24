import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { getMyMuseumBids, getMuseumAuctions, retractMuseumBid, money, type MuseumBid } from '../lib/museumAuctions';
import { museumItems } from '../data/museum';
import MuseumArt from './MuseumArt';
import './museum-account.css';

function bidStatus(bid: MuseumBid) {
  if (bid.status === 'retracted') return 'Retracted';
  if (bid.status === 'cancelled') return 'Withdrawn';
  if (bid.status === 'closed') return bid.is_highest ? 'Ended · highest bid' : 'Ended · outbid';
  return bid.is_highest ? 'Leading' : bid.is_my_lead ? 'Replaced by your newer bid' : 'Outbid';
}
export default function BackstageMuseumBids() {
  const [bids, setBids] = useState<MuseumBid[]>([]);
  const [photos, setPhotos] = useState<Record<string, string | null>>({});
  const visibleBids = bids.filter(bid => bid.status !== 'retracted');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  async function retract(bid: MuseumBid) {
    if (busy) return;
    setBusy(true); setActionMessage('');
    try {
      await retractMuseumBid(bid.id);
      setBids(current => current.map(entry => entry.id === bid.id ? { ...entry, status: 'retracted', is_highest: false } : entry));
      setConfirmId(null); setActionMessage('Bid retracted. It no longer counts towards the item’s price.');
      setRetry(value => value + 1);
    } catch (cause) { setActionMessage(cause instanceof Error ? cause.message : 'Unable to retract your bid.'); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    let active = true;
    let inFlight = false;
    async function refresh() {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const [data, auctions] = await Promise.all([getMyMuseumBids(), getMuseumAuctions().catch(() => null)]);
        if (active) {
          setBids(data); setError('');
          if (auctions) setPhotos(Object.fromEntries(auctions.map(item => [item.item_id, item.image_url])));
        }
      }
      catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Your bids couldn’t load.'); }
      finally { inFlight = false; if (active) setLoading(false); }
    }
    void refresh();
    const interval = window.setInterval(refresh, 15000);
    document.addEventListener('visibilitychange', refresh);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener('visibilitychange', refresh); };
  }, [retry]);
  return <section className="gbay-account-bids" aria-labelledby="museum-bids-heading">
    <div className="gbay-account-heading"><div><h2 id="museum-bids-heading"><span className="gbay-account-brand">gingaBay</span> bidding</h2></div><button type="button" aria-label="Refresh your bids" onClick={() => setRetry(value => value + 1)}><RefreshCw size={18} /></button></div>
    {actionMessage && <p role="status" className="gbay-account-note">{actionMessage}</p>}
    {loading ? <p role="status">Loading your bids…</p> : error ? <p role="alert" className="gbay-account-error">{error} Use refresh to try again.</p> : visibleBids.length === 0 ? <div className="gbay-account-empty"><p>No bids to show. Find a prop from the battles and join in from 99p.</p><Link to="/gingabay">Explore gingaBay <ArrowRight size={15} /></Link></div> : <>
      <p className="gbay-account-note">Your latest bids. Retracted bids are hidden. Prices refresh automatically.</p>
      <div className="gbay-bid-history">{visibleBids.map(bid => <article key={bid.id}>
        <div className="gbay-account-item">{museumItems.find(item => item.id === bid.item_id) && <Link className="gbay-account-thumb" to={`/gingabay?item=${encodeURIComponent(bid.item_id)}`} aria-label={`View ${museumItems.find(item => item.id === bid.item_id)?.name ?? bid.item_name}`}><MuseumArt item={museumItems.find(item => item.id === bid.item_id)!} photo={photos[bid.item_id]} /></Link>}<div><Link to={`/gingabay?item=${encodeURIComponent(bid.item_id)}`}>{museumItems.find(item => item.id === bid.item_id)?.name ?? bid.item_name} <ArrowRight size={13} /></Link><time dateTime={bid.created_at}>{new Date(bid.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div></div>
        <div><span>Your bid <strong>{money(bid.amount_pence)}</strong></span><span>Current <strong>{money(bid.current_pence)}</strong></span></div>
        <div><p className={bid.is_highest && bid.status === 'open' ? 'gbay-account-leading' : ''}>{bidStatus(bid)}</p>
          {bid.status !== 'retracted' && (confirmId === bid.id ? <div className="gbay-retract-confirm"><p>Retract your {money(bid.amount_pence)} bid? The next highest active bid will count, including any earlier bids you made.</p><button disabled={busy} onClick={() => retract(bid)}>{busy ? 'Retracting…' : 'Confirm retraction'}</button><button disabled={busy} onClick={() => setConfirmId(null)}>Keep bid</button></div> : <button className="gbay-retract" disabled={busy} onClick={() => { setConfirmId(bid.id); setActionMessage(''); }}>Retract bid</button>)}
        </div>
      </article>)}</div>
    </>}
  </section>;
}
