import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, ArrowUpRight, Check, Clapperboard, LoaderCircle, LockKeyhole, LogOut, Play, Ticket, X } from "lucide-react";
import { BackstageSignInError, backstageConfigured, getBackstageSession, watchBackstageSession, signInBackstage, signOutBackstage, getEmailPreference, saveEmailPreference, getBackstageVideos, getBackstageVideoUrl, type BackstageSession, type BackstageVideo } from "../lib/backstage";
import "./backstage.css";

const pendingUpdatesKey = "gzone.backstage.pending-updates";

export default function BackstagePage() {
  const [session, setSession] = useState<BackstageSession | null>(null);
  const [checking, setChecking] = useState(backstageConfigured);
  const [busy, setBusy] = useState(false);
  const [updates, setUpdates] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const unsubscribe = watchBackstageSession(next => {
      if (active) { setSession(next); setChecking(false); setBusy(false); }
    });
    getBackstageSession().then(next => { if (active) { setSession(next); setChecking(false); } }).catch(() => {
      if (active) { setChecking(false); setError("We couldn’t check your pass. Please try signing in again."); }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  async function enter() {
    setError("");
    if (!backstageConfigured) {
      setError("Backstage sign-in is opening soon. Your pass isn’t available just yet.");
      return;
    }
    setBusy(true);
    try {
      if (updates) sessionStorage.setItem(pendingUpdatesKey, "yes");
      else sessionStorage.removeItem(pendingUpdatesKey);
      await signInBackstage();
    } catch (cause) {
      setError(cause instanceof BackstageSignInError ? cause.message : "We couldn’t open Google sign-in. Please try again.");
      setBusy(false);
    }
  }

  async function leave() {
    setBusy(true);
    setError("");
    try { await signOutBackstage(); setSession(null); }
    catch { setError("Sign-out didn’t finish. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <main className={`backstage-page${session ? " backstage-members" : " backstage-public"}`}>
      <Helmet><title>Backstage | The Gzone</title><meta name="description" content="The Gzone members’ area. Sign in for exclusive videos, behind-the-scenes footage and updates from the crew." /><link rel="canonical" href="https://www.gzonerapbattle.co.uk/backstage" /></Helmet>
      <div className="backstage-shell">
        {session ? <>
          <header className="backstage-member-header">
            <div><h1>WELCOME <em>BACKSTAGE.</em></h1><p>Pull up. Press play. Jay has plenty to say.</p></div>
            <button className="backstage-secondary" onClick={leave} disabled={busy}><LogOut size={16} /> SIGN OUT</button>
          </header>
          {error && <p role="alert" className="backstage-message">{error}</p>}
          <MembersArea key={session.user.id} session={session} />
        </> : <>
          <section className="backstage-entrance" aria-labelledby="backstage-heading">
            <div className="backstage-hero-copy">
              <div className="backstage-hero-portrait" aria-hidden="true"><span>UNFILTERED.</span><img src="/portraits/ginga-jay-updated-2026.png" alt="" width={1320} height={1191} fetchPriority="high" /></div>
              <div className="backstage-hero-intro">
                <p className="backstage-entrance-label">THE GZONE MEMBERS’ AREA</p>
                <h1 id="backstage-heading">BACK<span>STAGE<span className="backstage-period">.</span></span></h1>
                <p className="backstage-hero-description">The battle ends. The reactions don’t.<br />Get inside for raw reactions, exclusive footage and Gzone moments you won’t find anywhere else!</p>
              </div>
            </div>
            <div className="backstage-pass-wrap">
              <span className="backstage-pass-tape" aria-hidden="true">MEMBERS ACCESS ONLY</span>
              <div className="backstage-pass" id="backstage-pass" tabIndex={-1}>
                <div className="backstage-pass-slot" aria-hidden="true" />
                <div className="backstage-pass-top"><span>Ginga Entertainment Ltd</span><Ticket size={25} /></div>
                <h2>ADMIT ONE<br /><span>ADULTS ONLY</span></h2>
                <button className="backstage-google-button" onClick={enter} disabled={busy || checking || !backstageConfigured}>
                  {busy || checking ? <LoaderCircle size={20} className="backstage-spin" /> : <span className="backstage-google-mark" aria-hidden="true">G</span>}
                  {checking ? "CHECKING YOUR PASS…" : busy ? "HEADING TO GOOGLE…" : backstageConfigured ? "SIGN UP / LOG IN WITH GOOGLE" : "GOOGLE SIGN-IN · COMING SOON"}
                  {!busy && !checking && <ArrowUpRight size={18} />}
                </button>
                <PassPreview />
                <label className="backstage-opt-in"><input type="checkbox" checked={updates} onChange={event => setUpdates(event.target.checked)} /><span>Send me Gzone drops, event news and extras.<small>Optional. Unsubscribe whenever you want.</small></span></label>
                {error && <p className="backstage-pass-error" role="alert">{error}</p>}
                <p className="backstage-pass-privacy">You’re in control. Sign in with Google and choose whether to receive emails. Unsubscribe anytime in Backstage — your access stays yours.<br />Read our <Link to="/privacy">privacy policy</Link>.</p>
                <div className="backstage-pass-stub"><div className="backstage-barcode" aria-hidden="true" /><LockKeyhole size={20} aria-hidden="true" /></div>
              </div>
            </div>
          </section>
        </>}
      </div>
    </main>
  );
}

function PassPreview() {
  return (
    <div className="backstage-pass-preview">
      <p>GINGA JAY UNCUT</p>
      <ul>
        <li><Play size={15} aria-hidden="true" /><span>Raw reactions</span></li>
        <li><Clapperboard size={15} aria-hidden="true" /><span>Exclusive videos</span></li>
        <li><Ticket size={15} aria-hidden="true" /><span>Behind the scenes</span></li>
      </ul>
    </div>
  );
}

function MembersArea({ session }: { session: BackstageSession }) {
  const [emailUpdates, setEmailUpdates] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState("");
  const [videos, setVideos] = useState<BackstageVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoError, setVideoError] = useState("");
  const [playing, setPlaying] = useState<{ title: string; url: string } | null>(null);
  const [openingVideo, setOpeningVideo] = useState<string | null>(null);
  const playerRef = useRef<HTMLDialogElement>(null);
  const lastVideoButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let active = true;
    async function loadPreference() {
      try {
        let optedIn = await getEmailPreference();
        if (sessionStorage.getItem(pendingUpdatesKey) === "yes") {
          await saveEmailPreference(true);
          sessionStorage.removeItem(pendingUpdatesKey);
          optedIn = true;
        }
        if (active) setEmailUpdates(optedIn);
      } catch { if (active) setPreferenceMessage("Your email preferences couldn’t load. Please refresh to try again."); }
    }
    loadPreference();
    getBackstageVideos().then(items => { if (active) setVideos(items); }).catch(() => {
      if (active) setVideoError("The video room couldn’t load. Please refresh to try again.");
    }).finally(() => { if (active) setVideosLoading(false); });
    return () => { active = false; };
  }, [session.user.id]);

  useEffect(() => {
    if (playing) playerRef.current?.showModal();
  }, [playing]);

  async function updatePreference() {
    if (emailUpdates === null) return;
    setSaving(true);
    setPreferenceMessage("");
    try {
      await saveEmailPreference(!emailUpdates);
      setEmailUpdates(!emailUpdates);
      setPreferenceMessage(!emailUpdates ? "You’re on the list. Keep an eye on your inbox." : "You’re unsubscribed. Your Backstage access stays yours.");
    } catch { setPreferenceMessage("That change didn’t save. Please try again."); }
    finally { setSaving(false); }
  }

  async function play(video: BackstageVideo, button: HTMLButtonElement) {
    setOpeningVideo(video.id);
    setVideoError("");
    lastVideoButton.current = button;
    try { setPlaying({ title: video.title, url: await getBackstageVideoUrl(video.storage_path) }); }
    catch { setVideoError("We couldn’t open that video. Please try again."); }
    finally { setOpeningVideo(null); }
  }

  function closePlayer() {
    playerRef.current?.close();
    setPlaying(null);
    lastVideoButton.current?.focus();
  }

  return <>
    <section className="backstage-member-videos" aria-labelledby="member-videos-title">
      <div className="backstage-section-heading"><div><h2 id="member-videos-title">Ginga Reactions</h2></div></div>
      <article className="backstage-reaction" aria-labelledby="reaction-title">
        <div className="backstage-reaction-heading"><h3 id="reaction-title">Jay Reacts - Anbu vs DrizzGB</h3></div>
        <div className="backstage-player-viewport"><iframe src="//player.bilibili.com/player.html?isOutside=true&aid=117464134328167&bvid=BV127n76jEXC&cid=42857466864&p=1" title="Jay Reacts - Anbu vs DrizzGB" scrolling="no" frameBorder="0" allowFullScreen /></div>
      </article>
      {videosLoading ? <p role="status" className="backstage-empty">Opening the video room…</p> : videoError ? <p role="alert" className="backstage-message">{videoError}</p> : videos.length ? <div className="backstage-member-video-grid">{videos.map(video => <article className="backstage-member-video" key={video.id}><span className="backstage-section-kicker">MEMBERS’ EXCLUSIVE</span><Clapperboard size={42} /><h3>{video.title}</h3><p>{video.description}</p><button className="backstage-primary" disabled={openingVideo !== null} onClick={event => play(video, event.currentTarget)}>{openingVideo === video.id ? "OPENING…" : "WATCH NOW"}<Play size={16} /></button></article>)}</div> : null}
    </section>
    <section className="backstage-mailing backstage-mailing-wide" aria-labelledby="mailing-title">
      <div className="backstage-mailing-copy">
        <h2 id="mailing-title">FRESH REACTIONS.<br />FIRST IN YOUR INBOX.</h2>
      </div>
      <div className="backstage-mailing-preferences">
        <span className="backstage-email-status">{emailUpdates === null ? "CHECKING YOUR PREFERENCE…" : emailUpdates ? <><Check size={16} /> YOU’RE IN THE LOOP</> : "WANT THE NEXT DROP?"}</span>
        <div className="backstage-email-address">{session.user.email}</div>
        <button className="backstage-primary" disabled={saving || emailUpdates === null} onClick={updatePreference}>{saving ? "SAVING…" : emailUpdates === null ? "LOADING…" : emailUpdates ? "UNSUBSCRIBE FROM EMAILS" : "KEEP ME IN THE LOOP"}{!saving && emailUpdates === false && <ArrowRight size={17} />}</button>
        {preferenceMessage && <p role="status" className="backstage-preference-message">{preferenceMessage}</p>}
      </div>
    </section>
    {playing && <dialog ref={playerRef} className="backstage-player" onCancel={event => { event.preventDefault(); closePlayer(); }} onClick={event => { if (event.target === event.currentTarget) closePlayer(); }} aria-labelledby="backstage-player-title"><div className="backstage-player-top"><h2 id="backstage-player-title">{playing.title}</h2><button autoFocus aria-label="Close video" onClick={closePlayer}><X size={24} /></button></div><video src={playing.url} controls autoPlay playsInline onError={() => setVideoError("Playback stopped. Close the player and open the video again.")} />{videoError && <p role="alert">{videoError}</p>}</dialog>}
  </>;
}
