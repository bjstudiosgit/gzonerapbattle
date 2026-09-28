import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, ArrowRight, ExternalLink, Eye, Play } from "lucide-react";
import { initialStreetEpisodes } from "./GzoneStreetFreestyles";
import { initialCypherEpisodes } from "./GzoneCyphers";

type Series = "freestyles" | "cyphers";
type Session = {
  id: string;
  series: Series;
  label: string;
  title: string;
  detail: string;
  videoId: string;
  videoUrl: string;
  views: string;
  startTime?: number;
};

const seriesNames = { freestyles: "GStreet Freestyles", cyphers: "Cyphers" };
const sessions: Session[] = [
  ...[...initialStreetEpisodes].reverse().map((episode) => ({
    ...episode, series: "freestyles" as const, label: episode.episode,
    title: episode.artist, detail: episode.location,
  })),
  ...[...initialCypherEpisodes].reverse().map((episode) => ({
    ...episode, series: "cyphers" as const, label: episode.month, detail: episode.lineup,
  })),
];
const countViews = (views: string) => parseFloat(views) * (views.endsWith("K") ? 1000 : 1);

export default function Outside() {
  const [params, setParams] = useSearchParams();
  const [viewCounts, setViewCounts] = useState<Record<string, string>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const playerRef = useRef<HTMLElement>(null);
  const seriesParam = params.get("series");
  const active = sessions.find((session) => session.videoId === params.get("video"))
    ?? sessions.find((session) => session.series === seriesParam)
    ?? sessions[0];
  const activeIndex = sessions.indexOf(active);
  const isPlaying = playingId === active.videoId;

  useEffect(() => {
    const controller = new AbortController();
    sessions.forEach(async (session) => {
      try {
        const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${session.videoId}`, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!Number.isFinite(data.viewCount) || data.viewCount < countViews(session.views)) return;
        const views = data.viewCount >= 1000 ? `${(data.viewCount / 1000).toFixed(1)}K` : String(data.viewCount);
        setViewCounts((previous) => ({ ...previous, [session.videoId]: views }));
      } catch {
        // Saved counts remain available when the provider cannot be reached.
      }
    });
    return () => controller.abort();
  }, []);

  function selectSession(session: Session) {
    setParams({ video: session.videoId }, { preventScrollReset: true });
    setPlayingId(session.videoId);
    playerRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-20 md:pt-44 md:pb-28">
      <Helmet>
        <title>Outside | GStreet Freestyles & Cyphers | Gzone</title>
        <meta name="description" content="Gzone Outside. Watch every GStreet Freestyle and Gzone Cypher in one place, from solo sessions to the full circle." />
        <link rel="canonical" href="https://www.gzonerapbattle.co.uk/outside" />
        <meta property="og:title" content="Outside | GStreet Freestyles & Cyphers" />
        <meta property="og:description" content="GStreet Freestyles and Gzone Cyphers, together in one place on Outside." />
        <meta property="og:url" content="https://www.gzonerapbattle.co.uk/outside" />
        <meta property="og:image" content={`https://img.youtube.com/vi/${active.videoId}/hqdefault.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "ItemList", name: "Gzone Outside",
          itemListElement: sessions.map((session, index) => ({
            "@type": "ListItem", position: index + 1, url: session.videoUrl,
            name: `${seriesNames[session.series]} — ${session.label} — ${session.title}`,
          })),
        })}</script>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <header className="mb-10 text-center lg:mb-16 lg:text-left">
          <h1 className="font-display text-[clamp(3rem,9vw,5rem)] uppercase leading-[0.95] tracking-tighter text-white">
            OUT<span className="text-brand">SIDE</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-sm font-medium leading-relaxed tracking-tight text-zinc-400 md:text-lg lg:mx-0">
            GStreet Freestyles and Gzone Cyphers, together in one place. Explore solo performances and full-circle sessions from across the Gzone.
          </p>
        </header>

        <section ref={playerRef} aria-label="Featured video" className="scroll-mt-32 overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
          <div className="border-b border-white/10 px-4 py-3 sm:px-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">On screen <span className="ml-2 text-brand">{seriesNames[active.series]}</span></p>
          </div>
          <div className="relative aspect-video bg-black">
            {isPlaying ? (
              <iframe key={active.videoId} src={`https://www.youtube-nocookie.com/embed/${active.videoId}?autoplay=1&rel=0&playsinline=1${active.startTime ? `&start=${active.startTime}` : ""}`}
                title={`${seriesNames[active.series]} — ${active.label} — ${active.title}`}
                className="absolute inset-0 h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            ) : (
              <button type="button" onClick={() => setPlayingId(active.videoId)} aria-label={`Play ${active.label} — ${active.title}`} className="group absolute inset-0 h-full w-full overflow-hidden focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-brand">
                <img src={`https://img.youtube.com/vi/${active.videoId}/maxresdefault.jpg`} alt=""
                  onLoad={(event) => { if (event.currentTarget.naturalWidth <= 120 && event.currentTarget.src.endsWith("/maxresdefault.jpg")) event.currentTarget.src = `https://img.youtube.com/vi/${active.videoId}/hqdefault.jpg`; }}
                  onError={(event) => { if (event.currentTarget.src.endsWith("/maxresdefault.jpg")) event.currentTarget.src = `https://img.youtube.com/vi/${active.videoId}/hqdefault.jpg`; }}
                  className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-95" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black shadow-xl transition-transform group-hover:scale-110 md:h-20 md:w-20"><Play className="ml-1" size={28} fill="currentColor" /></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Press play</span>
                </span>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0" aria-live="polite">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">{active.label}</p>
              <h2 className="font-display text-2xl uppercase leading-tight sm:text-3xl">{active.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{active.detail}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <a href={active.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs text-zinc-300 hover:text-brand">Watch on YouTube <ExternalLink size={14} /></a>
              <div className="flex gap-2">
                <button type="button" aria-label="Previous session" disabled={activeIndex === 0} onClick={() => selectSession(sessions[activeIndex - 1])} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={18} /></button>
                <button type="button" aria-label="Next session" disabled={activeIndex === sessions.length - 1} onClick={() => selectSession(sessions[activeIndex + 1])} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-25"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        <section id="sessions" aria-label="Session library" className="mt-12 scroll-mt-32 md:mt-16">
          {(["freestyles", "cyphers"] as const).map((series) => (
            <section key={series} aria-labelledby={`${series}-heading`} className="mb-12 last:mb-0">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h2 id={`${series}-heading`} className="font-display text-3xl uppercase sm:text-4xl">{series === "freestyles" ? <>GStreet <span className="text-brand">Freestyles</span></> : <>Gzone <span className="text-brand">Cyphers</span></>}</h2>
                <span className="hidden text-[10px] font-bold uppercase tracking-widest text-zinc-500 sm:block">{series === "freestyles" ? "One mic. One MC." : "Back to back."}</span>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.filter((session) => session.series === series).map((session) => (
                  <button key={session.id} type="button" aria-label={`Play ${seriesNames[series]} ${session.label} — ${session.title}`} aria-pressed={active.videoId === session.videoId} onClick={() => selectSession(session)} className="group min-w-0 text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <div className={`relative aspect-video overflow-hidden rounded-lg border ${active.videoId === session.videoId ? "border-brand" : "border-white/10 group-hover:border-white/40"}`}>
                      <img src={`https://img.youtube.com/vi/${session.videoId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">{session.label}</span>
                      <span className={`absolute right-3 top-3 rounded px-2 py-1 text-[10px] font-bold ${active.videoId === session.videoId ? "bg-brand text-black" : "bg-black/70 text-white"}`}>{active.videoId === session.videoId ? "On screen" : <Play size={14} fill="currentColor" />}</span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h3 className={`min-w-0 font-display text-xl uppercase leading-snug line-clamp-2 ${active.videoId === session.videoId ? "text-brand" : "text-white group-hover:text-brand"}`}>{session.title}</h3>
                      <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[11px] text-zinc-400"><Eye size={12} />{viewCounts[session.videoId] ?? session.views}<span className="sr-only"> views</span></span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
