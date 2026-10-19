import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getGingahooMessages, sendGingahooMessage, watchGingahooMessages, type GingahooMessage } from "../lib/backstage";
import "../pages/gingahoo.css";

function latestMessages(items: GingahooMessage[]) {
  return [...new Map(items.map(item => [item.id, item])).values()]
    .sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)).slice(-20);
}

export default function GingahooChat({ username }: { username: string }) {
  const [messages, setMessages] = useState<GingahooMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [retry, setRetry] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const sendingRef = useRef(false);
  const request = useRef<{ text: string; id: string } | null>(null);

  useEffect(() => {
    let active = true;
    let requestNumber = 0;
    setLoading(true);
    setLoadError("");
    async function refresh() {
      const current = ++requestNumber;
      try {
        const items = await getGingahooMessages();
        if (active && current === requestNumber) {
          setMessages(latestMessages(items));
          setLoadError("");
        }
      } catch {
        if (active && current === requestNumber) setLoadError("The room couldn’t load. Try again.");
      } finally {
        if (active && current === requestNumber) setLoading(false);
      }
    }
    const unsubscribe = watchGingahooMessages(
      message => { if (active) { setMessages(previous => latestMessages([...previous, message])); void refresh(); } },
      online => {
        if (!active) return;
        setConnected(online);
        if (online) void refresh(); // Recover messages missed during a reconnect.
      },
      id => {
        if (!active) return;
        setMessages(previous => previous.filter(message => message.id !== id));
        void refresh();
      },
    );
    void refresh();
    // Also recover when returning from a background tab or a dropped connection.
    const refreshVisible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", refreshVisible);
    const timer = window.setInterval(refreshVisible, 15000);
    return () => {
      active = false;
      unsubscribe();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, [retry]);

  useEffect(() => {
    if (nearBottom.current && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, loading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || text.length > 500 || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setSendError("");
    if (request.current?.text !== text) request.current = { text, id: crypto.randomUUID() };
    try {
      const saved = await sendGingahooMessage(text, request.current.id);
      nearBottom.current = true;
      setMessages(previous => latestMessages([...previous, saved]));
      setDraft("");
      request.current = null;
    } catch (cause) {
      setSendError(cause instanceof Error ? cause.message : "Your message didn’t send. Try again.");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  return <section className="gingahoo" aria-labelledby="gingahoo-title">
    <header className="gingahoo-header">
      <div><h2 id="gingahoo-title">GINGAHOO<span>.</span></h2></div>
      <span className={connected ? "gingahoo-connection is-live" : "gingahoo-connection"} role="status"><i aria-hidden="true" />{connected ? "LIVE CHAT" : "CONNECTING…"}</span>
    </header>
    <div className="gingahoo-room-line"><MessageSquare size={17} aria-hidden="true" /><p>Watched it? Have your say.</p></div>
    <div className="gingahoo-log" ref={logRef} role="log" aria-label="Gingahoo messages" aria-live="polite" aria-relevant="additions" tabIndex={0}
      onScroll={() => { const log = logRef.current; if (log) nearBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 80; }}>
      {loading ? <p className="gingahoo-empty">Opening Gingahoo…</p> : !messages.length && !loadError ? <div className="gingahoo-empty"><MessageSquare size={30} aria-hidden="true" /><p>The room’s yours. Who’s got the first take?</p></div> : null}
      {messages.map(message => <article className="gingahoo-message" key={message.id}>
        <div><strong>@{message.user_name}</strong><time dateTime={message.created_at} title={new Date(message.created_at).toLocaleString()}>{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>
        <p>{message.text}</p>
      </article>)}
    </div>
    {loadError && <div className="gingahoo-error" role="alert">{loadError} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button></div>}
    <form className="gingahoo-compose" onSubmit={submit}>
      <div className="gingahoo-compose-label"><label htmlFor="gingahoo-message">Chatting as <strong>@{username}</strong></label><span>{draft.length}/500</span></div>
      <div className="gingahoo-compose-controls"><input id="gingahoo-message" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Drop your take…" maxLength={500} disabled={sending} autoComplete="off" /><button type="submit" aria-label="Send message" disabled={sending || !draft.trim()}><span>{sending ? "SENDING…" : "SEND"}</span><Send size={17} aria-hidden="true" /></button></div>
      {sendError && <p className="gingahoo-error" role="alert">{sendError}</p>}
      <p className="gingahoo-house-rule">Keep it about the battles. No spam, no personal details.</p>
    </form>
  </section>;
}
