import { lazy, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { guestMcs, mcs } from "../data/mcs";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";

const MCProfile = lazy(() => import("./MCProfile"));
const HostProfile = lazy(() => import("./HostProfile"));
const JudgeProfile = lazy(() => import("./JudgeProfile"));

function GuestInstagramRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);
  return <a href={url} className="block pt-40 text-center text-brand">Open Instagram</a>;
}

export default function PersonProfile() {
  const { slug } = useParams<{ slug: string }>();
  if ([...mcs, ...guestMcs].some(person => person.slug === slug)) return <MCProfile />;
  if (hosts.some(person => person.id === slug)) return <HostProfile />;
  const guest = judges.find(person => person.id === slug && person.role === "Celebrity Guest");
  if (guest) return guest.instagram ? <GuestInstagramRedirect url={guest.instagram} /> : <Navigate to="/whoswho" replace />;
  if (judges.some(person => person.id === slug)) return <JudgeProfile />;
  return <main className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center text-white">
    <Helmet><title>Page not found | Gzone</title><meta name="robots" content="noindex" /></Helmet>
    <p className="font-display text-8xl text-brand">404</p>
    <h1 className="font-display text-4xl uppercase">Page not found</h1>
    <p className="text-zinc-300">That page doesn't exist. Explore the latest battles or find the next event.</p>
    <div className="flex flex-wrap justify-center gap-4">
      <Link to="/battles" className="rounded-xl bg-brand px-5 py-3 font-bold text-black">Battles</Link>
      <Link to="/events" className="rounded-xl border border-white/30 px-5 py-3 font-bold text-white">Events</Link>
    </div>
  </main>;
}
