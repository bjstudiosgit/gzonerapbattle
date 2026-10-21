import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, ShieldCheck } from "lucide-react";

export default function BackstageGingerify() {
  return <section className="gingerify-card" aria-labelledby="gingerify-title">
    <div className="gingerify-card-art" aria-hidden="true">
      <span className="gingerify-card-live"><i /> GINGA CAM</span>
      <Camera size={66} strokeWidth={1.2} />
      <div className="gingerify-card-swatches">{["#f7c8a4", "#f08a5d", "#e25822", "#a0522d", "#6b2612"].map(color => <i key={color} style={{ backgroundColor: color }} />)}</div>
      <span className="gingerify-card-art-caption">FIND YOUR GINGER.</span>
    </div>
    <div className="gingerify-card-copy">
      <h3 id="gingerify-title">Fifty Shades <em>of Jay.</em></h3>
      <p>Ever wondered if you could pull off ginger?<br />Step into the Ginga Cam and find your shade.</p>
      <div className="gingerify-card-bottom">
        <Link className="gingerify-card-button" to="/backstage/gingerify">GINGERIFY ME <ArrowUpRight size={19} aria-hidden="true" /></Link>
        <span className="gingerify-card-privacy"><ShieldCheck size={16} aria-hidden="true" /> Only on your device.<br />No recordings. No uploads.</span>
      </div>
    </div>
  </section>;
}
