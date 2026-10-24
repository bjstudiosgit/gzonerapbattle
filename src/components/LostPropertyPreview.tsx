import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { museumItems } from "../data/museum";
import { getMuseumAuctions, money, type MuseumAuction } from "../lib/museumAuctions";
import MuseumArt from './MuseumArt';
import './museum-preview.css';

const previewItems = museumItems.filter(item => !/\bcrack\b/i.test(item.name));

export default function LostPropertyPreview() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  const [auctions, setAuctions] = useState<MuseumAuction[]>([]);
  function updatePosition() {
    const el = track.current;
    if (el) setPosition({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }
  function browse(direction: number) {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  useEffect(() => {
    let active = true;
    async function refresh() {
      if (document.hidden) return;
      try {
        const next = await getMuseumAuctions();
        if (active) setAuctions(next);
      } catch { /* Keep the preview usable when live bids are unavailable. */ }
    }
    void refresh();
    const interval = window.setInterval(refresh, 15000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => {
      const el = track.current;
      if (!el || document.hidden || el.matches(':hover') || el.contains(document.activeElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth, behavior: 'smooth' });
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);
  if (!previewItems.length) return null;

  return (
    <section aria-labelledby="museum-preview-heading" className="relative z-10 px-4 sm:px-6 lg:px-10 pt-0 pb-10 md:pb-16">
      <div className="museum-storefront mx-auto max-w-[1432px]">
        <div className="museum-storefront-intro">
          <h2 id="museum-preview-heading">ginga<span>Bay.</span><small>BETA</small></h2>
          <p className="museum-storefront-tagline">Props from the battle.<br />Bids from the crowd.</p>
          <p className="museum-storefront-description">Pick a piece of Gzone history and join the bidding. Browse the props, see the latest bids and choose your favourite.</p>
          <p className="museum-storefront-terms">Bids start at <strong>99p</strong> <span aria-hidden="true">·</span> go up by <strong>20p</strong></p>
          <Link to="/gingabay" className="museum-storefront-shop">Explore all props <ArrowRight size={18} /></Link>
          <p className="museum-storefront-note">Virtual ownership, just for fun.</p>
        </div>
        <div className="museum-storefront-gallery">
          <div className="museum-storefront-toolbar">
            <div className="museum-storefront-controls">
              <button type="button" aria-label="Previous props" aria-controls="museum-preview-items" disabled={position.start} onClick={() => browse(-1)}><ArrowLeft size={20} /></button>
              <button type="button" aria-label="Next props" aria-controls="museum-preview-items" disabled={position.end} onClick={() => browse(1)}><ArrowRight size={20} /></button>
            </div>
          </div>
          <div id="museum-preview-items" className="museum-storefront-lots" ref={track} onScroll={updatePosition} role="region" aria-label="Battle props carousel" tabIndex={0}>
            {previewItems.map(item => {
              const auction = auctions.find(entry => entry.item_id === item.id);
              return <div key={item.id} className="museum-storefront-lot">
                <MuseumArt item={item} photo={auction?.image_url} />
                <div className="museum-storefront-caption">
                  <div><p className="museum-storefront-eyebrow">From {item.battleTitle}</p><h3>{item.name}</h3><p>Used by {item.user}</p></div>
                  <div className="museum-storefront-bid">{auction ? <><span>{auction.current_pence === null ? 'Starting bid' : 'Current bid'}</span><strong>{money(auction.current_pence ?? auction.starting_pence)}</strong><small>{auction.bid_count} {auction.bid_count === 1 ? 'bid' : 'bids'}</small></> : <span>See bidding details</span>}<Link to={`/gingabay?item=${encodeURIComponent(item.id)}`} aria-label={`View ${item.name} and bidding details`}>View prop <ArrowRight size={16} /></Link></div>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
