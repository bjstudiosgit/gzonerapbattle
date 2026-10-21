import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import GingerifyCamera from "../components/GingerifyCamera";
import { getBackstageSession, watchBackstageSession, type BackstageSession } from "../lib/backstage";

export default function GingerifyPage() {
  const [session, setSession] = useState<BackstageSession | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    const unsubscribe = watchBackstageSession(next => { if (active) { setSession(next); setChecking(false); } });
    getBackstageSession().then(next => { if (active) { setSession(next); setChecking(false); } }).catch(() => { if (active) setChecking(false); });
    return () => { active = false; unsubscribe(); };
  }, []);
  if (checking) return <main className="pt-40 pb-16 text-center" role="status">Checking your Backstage pass…</main>;
  if (!session) return <Navigate to="/backstage" replace />;
  return <main className="pt-24 md:pt-40 pb-6 md:pb-12 px-2 md:px-4 bg-[#0a0a0a] text-white min-h-screen">
    <Helmet><title>Fifty Shades of Jay | Gzone Backstage</title><meta name="robots" content="noindex" /></Helmet>
    <div className="max-w-4xl mx-auto mb-3 md:mb-6 px-2">
      <Link to="/backstage" className="inline-block text-orange-400 hover:text-orange-200 mb-2 md:mb-4">← Back to Backstage</Link>
    </div>
    <GingerifyCamera />
    <p className="max-w-4xl mx-auto mt-4 px-2 text-xs md:text-sm text-zinc-400">Gingerify yourself with the Ginga Cam. Your camera stays on your device. Nothing is recorded or uploaded.</p>
  </main>;
}
