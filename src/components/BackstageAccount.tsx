import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, LockKeyhole, LogOut, Mail, Settings, UserRound } from "lucide-react";
import { getBackstageProfile, saveBackstageUsername, getEmailPreference, saveEmailPreference, pendingUpdatesKey, type BackstageProfile, type BackstageSession } from "../lib/backstage";
import { normalizeUsername, validateUsername } from "../lib/backstageUsername";
import "../pages/backstage-account.css";
import BackstageComments from "./BackstageComments";

type Props = { session: BackstageSession; busy: boolean; onSignOut: () => void; signOutError: string; children: (profile: BackstageProfile) => ReactNode };

export default function BackstageAccount({ session, busy, onSignOut, signOutError, children }: Props) {
  const settingsOpen = useLocation().pathname === "/backstage/settings";
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BackstageProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [retry, setRetry] = useState(0);
  const [emailUpdates, setEmailUpdates] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailRetry, setEmailRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProfileError("");
    getBackstageProfile().then(next => { if (active) setProfile(next); })
      .catch(() => { if (active) setProfileError("Your profile couldn’t load. Try again to open Backstage."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session.user.id, retry]);

  useEffect(() => {
    let active = true;
    setEmailError("");
    setEmailUpdates(null);
    async function loadPreference() {
      try {
        let saved = await getEmailPreference();
        if (!active) return;
        const pending = sessionStorage.getItem(pendingUpdatesKey);
        // A returning member's saved choice always takes precedence.
        if (saved === null && (pending === "yes" || pending === "no")) {
          await saveEmailPreference(pending === "yes");
          saved = pending === "yes";
        }
        if (active) {
          sessionStorage.removeItem(pendingUpdatesKey);
          setEmailUpdates(saved ?? false);
        }
      } catch {
        if (active) setEmailError("Your email preference couldn’t load. Please try again.");
      }
    }
    void loadPreference();
    return () => { active = false; };
  }, [session.user.id, emailRetry]);

  async function updateEmails() {
    if (emailUpdates === null || emailSaving) return;
    setEmailSaving(true);
    setEmailError("");
    setEmailMessage("");
    try {
      await saveEmailPreference(!emailUpdates);
      setEmailUpdates(!emailUpdates);
      setEmailMessage(emailUpdates ? "You’re unsubscribed. You can still watch everything." : "Email updates are on.");
    } catch {
      setEmailError("That change didn’t save. Your email preference hasn’t changed. Try again.");
    } finally { setEmailSaving(false); }
  }

  function finishSetup(next: BackstageProfile) {
    setProfile(next);
    navigate("/backstage", { replace: true });
  }

  return <>
    <header className="backstage-member-header">
      <div>
        <h1>{settingsOpen ? <>YOUR <em>SETTINGS.</em></> : <>WELCOME <em>BACKSTAGE.</em></>}</h1>
        <p>{profile ? <span className="backstage-identity">@{profile.username}</span> : !settingsOpen && "One last thing. What should we call you?"}</p>
      </div>
      <nav className="backstage-account-actions" aria-label="Member account">
        {profile && (settingsOpen
          ? <Link className="backstage-secondary" to="/backstage"><ArrowLeft size={16} /> BACK TO VIDEOS</Link>
          : <Link className="backstage-secondary" to="/backstage/settings"><Settings size={16} /> SETTINGS</Link>)}
        <button className="backstage-secondary" onClick={onSignOut} disabled={busy}><LogOut size={16} /> SIGN OUT</button>
      </nav>
    </header>
    {signOutError && <p role="alert" className="backstage-message">{signOutError}</p>}
    {loading ? <div className="backstage-account-card backstage-account-loading" role="status"><LoaderCircle size={22} className="backstage-spin" /> Opening your account…</div>
      : profileError ? <div className="backstage-account-card"><p role="alert">{profileError}</p><button className="backstage-primary" onClick={() => setRetry(value => value + 1)}>TRY AGAIN</button></div>
      : !profile ? <section className="backstage-account-card backstage-onboarding" aria-labelledby="choose-username-title">
        <span className="backstage-account-icon"><UserRound size={26} /></span>
        <p className="backstage-account-kicker">MAKE YOURSELF KNOWN</p>
        <h2 id="choose-username-title">PICK YOUR GZONE NAME.</h2>
        <p>This is how you’ll appear around Gzone. Your Google name and email won’t be shown to other members.</p>
        <UsernameForm onSaved={finishSetup} />
        <div className="backstage-account-footnote"><LockKeyhole size={15} /> Google handles sign-in. You choose the name.</div>
      </section>
      : settingsOpen ? <div className="backstage-settings-layout"><BackstageComments key={session.user.id} /><div className="backstage-settings-grid">
        <section className="backstage-account-card" aria-labelledby="username-settings-title">
          <div className="backstage-account-card-top"><UserRound size={22} /><span className="backstage-account-kicker">YOUR GZONE IDENTITY</span></div>
          <h2 id="username-settings-title">YOUR USERNAME</h2>
          <p>A name of your own. Your Google name and email stay private.</p>
          <UsernameForm initialUsername={profile.username} onSaved={setProfile} />
          <div className="backstage-account-footnote"><LockKeyhole size={15} /> Connected with Google</div>
        </section>
        <section className="backstage-account-card" aria-labelledby="email-settings-title">
          <div className="backstage-account-card-top"><Mail size={22} /><span className="backstage-account-kicker">YOUR INBOX</span></div>
          <h2 id="email-settings-title">EMAIL UPDATES</h2>
          <p>New reactions, event news and extras from Gzone. Only if you want them. Turning emails off won’t affect video access.</p>
          <div className="backstage-update-choice">
            <span className="backstage-update-status">{emailUpdates === null ? "Loading your preference…" : emailUpdates ? <><Check size={17} /> Updates are on</> : "Updates are off"}</span>
            <button type="button" role="switch" aria-label="Receive Gzone email updates" aria-checked={emailUpdates === true} disabled={emailUpdates === null || emailSaving} className="backstage-account-switch" onClick={updateEmails}><span /></button>
          </div>
          {emailSaving && <p role="status">Saving your preference…</p>}
          {emailError && <div><p role="alert" className="backstage-account-error">{emailError}</p>{emailUpdates === null && <button className="backstage-secondary" onClick={() => setEmailRetry(value => value + 1)}>TRY AGAIN</button>}</div>}
          {emailMessage && <p role="status" className="backstage-account-success">{emailMessage}</p>}
        </section>
        <p className="backstage-settings-privacy">Google handles sign-in securely. Gzone never sees or stores your Google password. Your Google name and email aren’t shown to other members, and you’re always in control of email updates. <Link to="/privacy">Privacy policy</Link></p>
      </div></div> : children(profile)}
  </>;
}

function UsernameForm({ initialUsername = "", onSaved }: { initialUsername?: string; onSaved: (profile: BackstageProfile) => void }) {
  const [username, setUsername] = useState(initialUsername);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const isNew = !initialUsername;
  const unchanged = normalizeUsername(username) === initialUsername;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const validationError = validateUsername(username);
    setError(validationError);
    setSaved(false);
    if (validationError) return;
    setSaving(true);
    try {
      const profile = await saveBackstageUsername(username);
      setUsername(profile.username);
      setSaved(true);
      onSaved(profile);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your username couldn’t be saved. Please try again.");
    } finally { setSaving(false); }
  }

  return <form className="backstage-username-form" onSubmit={submit}>
    <label htmlFor="backstage-username">{isNew ? "Username" : "Change Username"}</label>
    <div className="backstage-username-input"><span aria-hidden="true">@</span><input id="backstage-username" name="username" value={username} onChange={event => { setUsername(event.target.value); setError(""); setSaved(false); }} placeholder="your_gzone_name" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={24} disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? "username-help username-error" : "username-help"} required /></div>
    <p id="username-help" className="backstage-field-help">3–24 characters. Letters, numbers and underscores. Saved in lowercase.</p>
    {error && <p id="username-error" role="alert" className="backstage-account-error">{error}</p>}
    <button className="backstage-primary" type="submit" disabled={saving || (!isNew && unchanged)}>{saving ? <><LoaderCircle size={16} className="backstage-spin" /> SAVING…</> : isNew ? <>LET ME IN <ArrowRight size={16} /></> : "SAVE USERNAME"}</button>
    {saved && <p role="status" className="backstage-account-success">Username saved.</p>}
  </form>;
}
