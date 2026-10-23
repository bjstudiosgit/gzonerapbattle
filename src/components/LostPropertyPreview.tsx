import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { museumItems } from "../data/museum";
import MuseumArt from './MuseumArt';
import './museum-preview.css';

export default function LostPropertyPreview() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  function updatePosition() {
    const el = track.current;
    if (el) setPosition({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }
  function browse(direction: number) {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      const el = track.current;
      if (!el || document.hidden || el.matches(':hover') || el.contains(document.activeElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth, behavior: 'smooth' });
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);
  if (!museumItems.length) return null;

  return (
    <section aria-labelledby="museum-preview-heading" className="relative z-10 px-4 sm:px-6 lg:px-10 pt-0 pb-10 md:pb-16">
      <div className="museum-storefront mx-auto max-w-[1432px]">
        <div className="museum-storefront-intro">
          <h2 id="museum-preview-heading">ginga<span>Bay.</span><small>BETA</small></h2>
          <p className="museum-storefront-tagline">A Ginga auction.<br />Going, going... Ginga!</p>
          <p className="museum-storefront-description">The props left the battle. Now they're up for a bit of friendly bidding. Sign in with Google to your Gzone account and join in.</p>
          <div className="museum-storefront-price">
            <div><strong>99<span>p</span></strong><span>Starting bids</span></div>
            <div><strong>20<span>p</span></strong><span>Each next bid</span></div>
          </div>
          <Link to="/lost-property" className="museum-storefront-shop">Shop now <ArrowRight size={18} /></Link>
          <p className="museum-storefront-note">Just for fun &mdash; be the proud virtual owner.</p>
        </div>
        <div className="museum-storefront-gallery">
          <div className="museum-storefront-toolbar">
            <div className="museum-storefront-controls">
              <button type="button" aria-label="Previous props" aria-controls="museum-preview-items" disabled={position.start} onClick={() => browse(-1)}><ArrowLeft size={20} /></button>
              <button type="button" aria-label="Next props" aria-controls="museum-preview-items" disabled={position.end} onClick={() => browse(1)}><ArrowRight size={20} /></button>
            </div>
          </div>
          <div id="museum-preview-items" className="museum-storefront-lots" ref={track} onScroll={updatePosition} role="region" aria-label="Battle props carousel" tabIndex={0}>
            {museumItems.map(item => <div key={item.id} className="museum-storefront-lot">
              <MuseumArt item={item} />
            </div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
