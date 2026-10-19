import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { getMyGingahooMessages, deleteMyGingahooMessage, type GingahooMessage } from "../lib/backstage";

export default function BackstageComments() {
  const [messages, setMessages] = useState<GingahooMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteNotice, setDeleteNotice] = useState("");
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


  async function removeComment(id: string) {
    if (busy.current) return;
    busy.current = true;
    setDeleting(id);
    setDeleteError("");
    setDeleteNotice("");
    try {
      await deleteMyGingahooMessage(id);
      if (active.current) {
        setMessages(previous => previous.filter(message => message.id !== id));
        setConfirmDelete(null);
        setDeleteNotice("Comment deleted.");
      }
    } catch (cause) {
      if (active.current) setDeleteError(cause instanceof Error ? cause.message : "Your comment couldn’t be deleted.");
    } finally {
      if (active.current) { setDeleting(null); busy.current = false; }
    }
  }

  return <aside className="backstage-account-card backstage-comments" aria-labelledby="your-comments-title">
    <div className="backstage-account-card-top"><MessageSquare size={22} aria-hidden="true" /><span className="backstage-account-kicker">YOUR GINGAHOO HISTORY</span><button type="button" className="backstage-comments-refresh" aria-label="Refresh your comments" disabled={loading || deleting !== null} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={16} /></button></div>
    <h2 id="your-comments-title">YOUR COMMENTS</h2>
    <p>Everything you’ve said in Gingahoo. Newest first.</p>
    {messages.length > 0 && <ol className="backstage-comments-list">{messages.map(message => <li key={message.id}>
      <div><strong>@{message.user_name}</strong><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div>
      <p>{message.text}</p>
      <div className="backstage-comment-actions">{confirmDelete === message.id ? <>
        <span>Delete this comment?</span>
        <button type="button" disabled={loading || deleting !== null} onClick={() => removeComment(message.id)}>{deleting === message.id ? "DELETING…" : "YES, DELETE"}</button>
        <button type="button" disabled={deleting !== null} onClick={() => { setConfirmDelete(null); setDeleteError(""); }}>CANCEL</button>
      </> : <button type="button" disabled={loading || deleting !== null} onClick={() => { setConfirmDelete(message.id); setDeleteError(""); setDeleteNotice(""); }}><Trash2 size={13} aria-hidden="true" /> DELETE</button>}</div>
      {confirmDelete === message.id && deleteError && <p className="backstage-account-error" role="alert">{deleteError}</p>}
    </li>)}</ol>}
    {deleteNotice && <p className="backstage-account-success" role="status">{deleteNotice}</p>}
    {loading && <p className="backstage-comments-note" role="status">Loading your comments…</p>}
    {!loading && !error && !messages.length && !hasMore && <div className="backstage-comments-empty"><MessageSquare size={28} aria-hidden="true" /><p>No comments yet.<br />Your first take belongs in Gingahoo.</p><Link to="/backstage">JOIN THE CHAT <span aria-hidden="true">↗</span></Link></div>}
    {error && <div className="backstage-comments-note"><p className="backstage-account-error" role="alert">{error}</p><button className="backstage-secondary" disabled={loading || deleting !== null} onClick={() => messages.length ? void loadMore() : setRefresh(value => value + 1)}>TRY AGAIN</button></div>}
    {hasMore && !error && <button className="backstage-secondary backstage-comments-more" disabled={loading || deleting !== null} onClick={loadMore}>{loading ? "LOADING…" : "LOAD OLDER COMMENTS"}</button>}
  </aside>;
}
