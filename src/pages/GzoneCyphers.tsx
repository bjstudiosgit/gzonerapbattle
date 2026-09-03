import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet";
import { Eye, ExternalLink, Users, Mic2, Calendar } from "lucide-react";

export interface CypherEpisode {
  id: string;
  month: string;
  shortMonth: string;
  title: string;
  lineup: string;
  videoId: string;
  videoUrl: string;
  views: string;
  startTime?: number;
}

const initialCypherEpisodes: CypherEpisode[] = [
  {
    id: "nov-2025",
    month: "November 2025",
    shortMonth: "NOV 2025",
    title: "Passive, Silva Rose, Uncle Dizz",
    lineup: "Passive • Silva Rose • Uncle Dizz",
    videoId: "I4ieQV35pdk",
    videoUrl: "https://www.youtube.com/watch?v=I4ieQV35pdk",
    views: "12.1K",
  },
  {
    id: "dec-2025",
    month: "December 2025",
    shortMonth: "DEC 2025",
    title: "Passive, Deeno, Lurks + More",
    lineup: "Passive • Deeno • Lurks + More",
    videoId: "LwiRdIpkwNs",
    videoUrl: "https://www.youtube.com/watch?v=LwiRdIpkwNs&t=34s",
    startTime: 34,
    views: "8.1K",
  },
  {
    id: "feb-2026",
    month: "February 2026",
    shortMonth: "FEB 2026",
    title: "Reapz, Flawzz, Whoosh + More",
    lineup: "Reapz • Flawzz • Whoosh + More",
    videoId: "qANdhQ1otLc",
    videoUrl: "https://www.youtube.com/watch?v=qANdhQ1otLc&t=39s",
    startTime: 39,
    views: "3.4K",
  },
  {
    id: "aug-2026-pt1",
    month: "August 2026 (Part 1)",
    shortMonth: "AUG 2026 (PT 1)",
    title: "Passive, Afrodon, Mercedes, Foxamous, Btizz, CJ-Zino, Redzman, ZK, Lincz",
    lineup: "Passive • Afrodon • Mercedes • Foxamous • Btizz • CJ-Zino • Redzman • ZK • Lincz",
    videoId: "oDqjEXwyUy0",
    videoUrl: "https://www.youtube.com/watch?v=oDqjEXwyUy0",
    views: "3.0K",
  },
  {
    id: "aug-2026-pt2",
    month: "August 2026 (Part 2)",
    shortMonth: "AUG 2026 (PT 2)",
    title: "The GZone Cypher (Part 2)",
    lineup: "GZone Roster Cypher",
    videoId: "tG9HfUmEAnQ",
    videoUrl: "https://www.youtube.com/watch?v=tG9HfUmEAnQ",
    views: "718",
  },
];

export default function GzoneCyphers() {
  const [episodes, setEpisodes] = useState<CypherEpisode[]>(initialCypherEpisodes);
  const [activeEpisode, setActiveEpisode] = useState<CypherEpisode>(initialCypherEpisodes[0]);

  useEffect(() => {
    initialCypherEpisodes.forEach(async (ep) => {
      try {
        const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${ep.videoId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && typeof data.viewCount === "number") {
          const count =
            data.viewCount >= 1000
              ? `${(data.viewCount / 1000).toFixed(1)}K`
              : data.viewCount.toString();
          setEpisodes((prev) =>
            prev.map((item) => (item.id === ep.id ? { ...item, views: count } : item))
          );
        }
      } catch {
        // Fallback to initial static views
      }
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gzone Cyphers",
    description:
      "Official Gzone Cyphers series featuring UK underground battle rap MCs and lyricists in raw cypher sessions.",
    itemListElement: episodes.map((ep, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: `Gzone Cypher - ${ep.month} (${ep.title})`,
        description: `Gzone Cypher ${ep.month} featuring ${ep.lineup}.`,
        thumbnailUrl: `https://img.youtube.com/vi/${ep.videoId}/maxresdefault.jpg`,
        uploadDate: "2026-08-11T12:00:00+01:00",
        contentUrl: ep.videoUrl,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ep.videoId}`,
      },
    })),
  };

  return (
    <div className="min-h-screen pt-32 md:pt-44 pb-16 md:pb-24 relative overflow-hidden bg-[#050505]">
      <Helmet>
        <title>Gzone Cyphers | UK Rap & Grime Cyphers | Gzone RBL</title>
        <meta
          name="description"
          content="Watch official Gzone Cyphers featuring Passive, Deeno, Afrodon, Btizz, CJ-Zino, Silva Rose, Uncle Dizz, ZK, and more. Raw UK rap cyphers from the Gzone arena."
        />
        <meta
          name="keywords"
          content="Gzone Cyphers, Gzone Rap Battle League, UK Cypher, Passive, Deeno, Btizz, Afrodon, CJ Zino, Silva Rose, Grime Cypher, UK Rap"
        />
        <link rel="canonical" href="https://www.gzonerapbattle.co.uk/cyphers" />

        {/* Open Graph */}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content="Gzone Cyphers | UK Rap & Grime Cyphers | Gzone RBL" />
        <meta
          property="og:description"
          content="Watch official Gzone Cyphers series featuring top UK underground MCs trading bars in live cypher sessions."
        />
        <meta property="og:url" content="https://www.gzonerapbattle.co.uk/cyphers" />
        <meta
          property="og:image"
          content={`https://img.youtube.com/vi/${activeEpisode.videoId}/maxresdefault.jpg`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gzone Cyphers | UK Rap & Grime Cyphers" />
        <meta
          name="twitter:description"
          content="Official Gzone Cyphers with Passive, Deeno, Afrodon, Btizz, CJ-Zino, and more."
        />
        <meta
          name="twitter:image"
          content={`https://img.youtube.com/vi/${activeEpisode.videoId}/maxresdefault.jpg`}
        />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-brand/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-brand/5 blur-[120px] rounded-full" />
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* TOP HERO / HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left mb-10 md:mb-14"
        >
          {/* Main Title */}
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-display uppercase tracking-tight text-white leading-[0.92] mb-5">
            Gzone <span className="text-brand">Cyphers</span>
          </h1>

          {/* Atmospheric Blurb */}
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed tracking-tight font-medium opacity-90 mx-auto md:mx-0">
            Raw underground cyphers, unscripted penmanship, and heavy rotation. Watch the official Gzone Cypher series featuring the UK scene&apos;s sharpest lyricists going back-to-back.
          </p>
        </motion.div>

        {/* MAIN FEATURED VIDEO PLAYER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full mb-12 md:mb-16"
        >
          <div className="flex items-center justify-between gap-4 mb-3 text-xs font-black uppercase tracking-wider px-1">
            <div className="flex items-center gap-2 text-zinc-400 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">
                Playing:{" "}
                <span className="text-brand font-mono text-xs mr-1 font-bold">{activeEpisode.month}</span>
                <span className="text-white font-display text-base tracking-normal">
                  — {activeEpisode.title}
                </span>
              </span>
            </div>
            <a
              href={activeEpisode.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand transition-colors inline-flex items-center gap-1 text-[11px] shrink-0"
            >
              Watch on YouTube <ExternalLink size={12} />
            </a>
          </div>

          <div className="relative group">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand via-orange-600 to-brand rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none" />

            {/* Video Box */}
            <div className="relative aspect-video w-full bg-zinc-950 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <iframe
                key={activeEpisode.id}
                src={`https://www.youtube-nocookie.com/embed/${activeEpisode.videoId}?rel=0${activeEpisode.startTime ? `&start=${activeEpisode.startTime}` : ''}`}
                title={`Gzone Cyphers - ${activeEpisode.month} - ${activeEpisode.title}`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* EPISODES TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Mobile View */}
          <div className="sm:hidden p-4">
            <div className="grid gap-4">
              {episodes.map((ep) => {
                const isActive = ep.id === activeEpisode.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setActiveEpisode(ep)}
                    className={`block w-full text-left rounded-2xl p-5 shadow-xl transition-all cursor-pointer border ${
                      isActive
                        ? "bg-zinc-800/90 border-brand/50 ring-1 ring-brand/30"
                        : "bg-zinc-900/80 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-brand font-mono text-xs font-black tracking-wide opacity-90 flex items-center gap-1.5">
                        <Calendar size={12} className="opacity-70" />
                        {ep.month}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">
                          Playing Now
                        </span>
                      )}
                    </div>
                    <div className="font-display text-xl leading-none uppercase text-white mb-3">
                      <span className="hover:text-brand transition-colors">
                        {ep.title}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs font-medium flex items-center gap-1.5 mb-3">
                      <Users size={13} className="text-brand shrink-0" />
                      <span className="line-clamp-1">{ep.lineup}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs font-black tracking-widest uppercase mt-4 pt-3 border-t border-white/5">
                      <div className="text-zinc-500 flex items-center gap-1.5">
                        <Mic2 size={13} className="text-brand/60 shrink-0" />
                        <span>Cypher Series</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-zinc-200 text-xs font-bold">
                        <Eye size={14} className="text-brand" />
                        <span>{ep.views} Views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-0">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap min-w-[170px]">
                    Month
                  </th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    The Cypher
                  </th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap min-w-[260px]">
                    Lineup
                  </th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 text-right md:text-left whitespace-nowrap min-w-[120px]">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {episodes.map((ep) => {
                  const isActive = ep.id === activeEpisode.id;
                  return (
                    <tr
                      key={ep.id}
                      onClick={() => setActiveEpisode(ep)}
                      className={`group transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-brand/10 hover:bg-brand/15"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-6 py-6 md:px-10 md:py-8 whitespace-nowrap min-w-[170px]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-brand opacity-80 shrink-0" />
                          <span
                            className={`font-mono text-xs md:text-sm font-black tracking-wide transition-opacity ${
                              isActive
                                ? "text-brand opacity-100"
                                : "text-brand opacity-75 group-hover:opacity-100"
                            }`}
                          >
                            {ep.shortMonth}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-8">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-display uppercase text-lg md:text-xl transition-colors ${
                              isActive
                                ? "text-brand"
                                : "text-zinc-100 group-hover:text-brand"
                            }`}
                          >
                            {ep.title}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/30 px-2.5 py-0.5 rounded-full shrink-0">
                              Now Playing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-8 min-w-[260px]">
                        <div className="flex items-center gap-2 text-zinc-300 text-xs md:text-sm font-medium tracking-wide">
                          <Users size={15} className="text-brand opacity-80 shrink-0" />
                          <span className="line-clamp-1">{ep.lineup}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-8 text-right md:text-left whitespace-nowrap min-w-[120px]">
                        <div className="inline-flex items-center gap-2 font-mono text-sm md:text-base font-bold text-zinc-200 group-hover:text-brand transition-colors whitespace-nowrap">
                          <Eye size={16} className="text-brand opacity-80 shrink-0" />
                          <span>{ep.views}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
