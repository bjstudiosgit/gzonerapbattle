import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet";
import { MapPin, Eye, ExternalLink } from "lucide-react";

const initialStreetEpisodes = [
  {
    id: "ep1",
    episode: "EP1",
    title: "EP1 - Mars",
    artist: "Mars",
    location: "Peacocks Gym, Canning Town",
    videoId: "Vxk1x9BKPUs",
    videoUrl: "https://www.youtube.com/watch?v=Vxk1x9BKPUs",
    views: "438",
  },
  {
    id: "ep2",
    episode: "EP2",
    title: "EP2 - Passive",
    artist: "Passive",
    location: "Peacocks Gym, Canning Town",
    videoId: "sKrMgvf3IBI",
    videoUrl: "https://www.youtube.com/watch?v=sKrMgvf3IBI",
    views: "46",
  },
];

export default function GzoneStreetFreestyles() {
  const [episodes, setEpisodes] = useState(initialStreetEpisodes);
  const [activeEpisode, setActiveEpisode] = useState(initialStreetEpisodes[0]);

  useEffect(() => {
    initialStreetEpisodes.forEach(async (ep) => {
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
        // Fallback to static views
      }
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gstreet Freestyles",
    description:
      "Gstreet Freestyles series recorded live on the concrete at Peacocks Gym, Canning Town London.",
    itemListElement: episodes.map((ep, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: `Gstreet Freestyles - ${ep.title}`,
        description: `Gstreet Freestyle ${ep.title} recorded live at ${ep.location}.`,
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
        <title>Gstreet Freestyles | EP1 Mars & EP2 Passive | Gzone RBL</title>
        <meta
          name="description"
          content="Watch Gstreet Freestyles featuring EP1 Mars and EP2 Passive recorded live at Peacocks Gym, Canning Town London. Raw UK underground battle rap and street performances."
        />
        <meta
          name="keywords"
          content="Gstreet Freestyles, Gzone Street Freestyles, Gzone, UK Battle Rap, Street Freestyles, Mars, Passive, Peacocks Gym, Canning Town, Underground Rap"
        />
        <link rel="canonical" href="https://www.gzonerapbattle.co.uk/gzone-street-freestyles" />
        
        {/* Open Graph */}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content="Gstreet Freestyles | EP1 Mars & EP2 Passive" />
        <meta
          property="og:description"
          content="Taking raw Gzone penmanship out of the gym and onto the streets. Watch EP1 Mars and EP2 Passive live on the concrete at Peacocks Gym."
        />
        <meta property="og:url" content="https://www.gzonerapbattle.co.uk/gzone-street-freestyles" />
        <meta
          property="og:image"
          content={`https://img.youtube.com/vi/${activeEpisode.videoId}/maxresdefault.jpg`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gstreet Freestyles | EP1 Mars & EP2 Passive" />
        <meta
          name="twitter:description"
          content="Watch Gstreet Freestyles EP1 Mars & EP2 Passive recorded live at Peacocks Gym, Canning Town."
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
            Gstreet <span className="text-brand">Freestyles</span>
          </h1>

          {/* Atmospheric Blurb */}
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed tracking-tight font-medium opacity-90 mx-auto md:mx-0">
            Taking the raw penmanship of Gzone directly out of the gym and onto the streets. Unfiltered freestyle performances recorded live across UK cities and boroughs.
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
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Playing:{" "}
                <span className="text-white font-display text-base tracking-normal">
                  {activeEpisode.title}
                </span>
              </span>
            </div>
            <a
              href={activeEpisode.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand transition-colors inline-flex items-center gap-1 text-[11px]"
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
                src={`https://www.youtube-nocookie.com/embed/${activeEpisode.videoId}?rel=0`}
                title={`Gstreet Freestyles - ${activeEpisode.title}`}
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
                      <span className="text-brand font-mono text-sm font-black opacity-90">
                        #{ep.episode}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">
                          Playing Now
                        </span>
                      )}
                    </div>
                    <div className="font-display text-2xl leading-none uppercase text-white mb-3">
                      <span className="hover:text-brand transition-colors">
                        {ep.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs font-black tracking-widest uppercase mt-4">
                      <div className="text-zinc-400 flex items-center gap-1.5">
                        <MapPin size={13} className="text-brand shrink-0" />
                        <span>{ep.location}</span>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap w-24">
                    ID
                  </th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    The Freestyle
                  </th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap min-w-[220px]">
                    Location
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
                      <td className="px-6 py-6 md:px-10 md:py-8">
                        <span
                          className={`font-mono text-sm md:text-lg font-black transition-opacity ${
                            isActive
                              ? "text-brand opacity-100"
                              : "text-brand opacity-70 group-hover:opacity-100"
                          }`}
                        >
                          {ep.episode}
                        </span>
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/30 px-2.5 py-0.5 rounded-full">
                              Now Playing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-8 whitespace-nowrap min-w-[220px]">
                        <div className="flex items-center gap-2 text-zinc-300 text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                          <MapPin size={15} className="text-brand opacity-80 shrink-0" />
                          {ep.location}
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
