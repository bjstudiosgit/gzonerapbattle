import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, RefreshCw } from "lucide-react";
import { getMyGingahooMessages, type GingahooMessage } from "../lib/backstage";

export default function BackstageComments() {
  const [messages, setMessages] = useState<GingahooMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const active = useRef(false);
  const busy = useRef(false);

  useEffect(() => {
    let cancelled = false;
    active.current = true;
    busy.current = true;
    setLoading(true);
    setError("");
    getMyGingahooMessages().then(page => {
      if (!cancelled) { setMessages(page.messages); setHasMore(page.hasMore); }
    }).catch(() => {
      if (!cancelled) setError("Your comments couldn’t load. Please try again.");
    }).finally(() => {
      if (!cancelled) { setLoading(false); busy.current = false; }
    });
    return () => { cancelled = true; active.current = false; };
  }, [refresh]);

  async function loadMore() {
    if (busy.current || !hasMore) return;
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const page = await getMyGingahooMessages(messages[messages.length - 1]);
      if (active.current) {
        setMessages(previous => [...previous, ...page.messages]);
        setHasMore(page.hasMore);
      }
    } catch {
      if (active.current) setError("Older comments couldn’t load. Please try again.");
    } finally {
      if (active.current) { setLoading(false); busy.current = false; }
    }
  }

  return <aside className="backstage-account-card backstage-comments" aria-labelledby="your-comments-title">
    <div className="backstage-account-card-top"><MessageSquare size={22} aria-hidden="true" /><span className="backstage-account-kicker">YOUR GINGAHOO HISTORY</span><button type="button" className="backstage-comments-refresh" aria-label="Refresh your comments" disabled={loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={16} /></button></div>
    <h2 id="your-comments-title">YOUR COMMENTS</h2>
    <p>Everything you’ve said in Gingahoo. Newest first.</p>
    {messages.length > 0 && <ol className="backstage-comments-list">{messages.map(message => <li key={message.id}>
      <div><strong>@{message.user_name}</strong><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div>
      <p>{message.text}</p>
    </li>)}</ol>}
    {loading && <p className="backstage-comments-note" role="status">Loading your comments…</p>}
    {!loading && !error && !messages.length && <div className="backstage-comments-empty"><MessageSquare size={28} aria-hidden="true" /><p>No comments yet.<br />Your first take belongs in Gingahoo.</p><Link to="/backstage">JOIN THE CHAT <span aria-hidden="true">↗</span></Link></div>}
    {error && <div className="backstage-comments-note"><p className="backstage-account-error" role="alert">{error}</p><button className="backstage-secondary" disabled={loading} onClick={() => messages.length ? void loadMore() : setRefresh(value => value + 1)}>TRY AGAIN</button></div>}
    {hasMore && !error && <button className="backstage-secondary backstage-comments-more" disabled={loading} onClick={loadMore}>{loading ? "LOADING…" : "LOAD OLDER COMMENTS"}</button>}
  </aside>;
}
