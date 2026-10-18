import { lazy, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
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
  return <div className="min-h-screen flex items-center justify-center text-white">Profile not found. <Link to="/whoswho" className="text-brand ml-2">Back to Who's Who</Link></div>;
}
