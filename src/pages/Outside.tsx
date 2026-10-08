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

        <section ref={playerRef} aria-label="Featured video" className="grid scroll-mt-32 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex min-w-0 flex-col justify-between gap-8 p-5 sm:p-8 lg:p-10">
            <div className="min-w-0" aria-live="polite">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">On screen <span className="ml-2 text-brand">{seriesNames[active.series]}</span></p>
              <p className="mt-10 text-xs font-bold uppercase tracking-widest text-brand">{active.label}</p>
              <h2 className="mt-2 font-display text-4xl uppercase leading-tight sm:text-5xl">{active.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{active.detail}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <a href={active.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs text-zinc-300 hover:text-brand">Watch on YouTube <ExternalLink size={14} /></a>
              <div className="flex gap-2">
                <button type="button" aria-label="Previous session" disabled={activeIndex === 0} onClick={() => selectSession(sessions[activeIndex - 1])} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={18} /></button>
                <button type="button" aria-label="Next session" disabled={activeIndex === sessions.length - 1} onClick={() => selectSession(sessions[activeIndex + 1])} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-25"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
          <div className="relative aspect-video min-w-0 bg-black lg:self-center">
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
        </section>

        <section id="sessions" aria-label="Session library" className="mt-12 scroll-mt-32 md:mt-16">
          {(["freestyles", "cyphers"] as const).map((series) => (
            <section key={series} aria-labelledby={`${series}-heading`} className="mb-12 last:mb-0">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h2 id={`${series}-heading`} className="font-display text-3xl uppercase sm:text-4xl">{series === "freestyles" ? <>GStreet <span className="text-brand">Freestyles</span></> : <>Gzone <span className="text-brand">Cyphers</span></>}</h2>
                <span className="hidden text-[10px] font-bold uppercase tracking-widest text-zinc-500 sm:block">{series === "freestyles" ? "One mic. One MC." : "Back to back."}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                {sessions.filter((session) => session.series === series).map((session) => (
                  <button key={session.id} type="button" aria-label={`Play ${seriesNames[series]} ${session.label} — ${session.title}`} aria-pressed={active.videoId === session.videoId} onClick={() => selectSession(session)} className={`group flex min-w-0 items-center gap-3 rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:gap-4 ${active.videoId === session.videoId ? "border-brand/70 bg-brand/10" : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"}`}>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand">{session.label}</span>
                      <h3 className={`mt-1 truncate font-display text-lg uppercase leading-tight sm:text-xl ${active.videoId === session.videoId ? "text-brand" : "text-white group-hover:text-brand"}`}>{session.title}</h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-zinc-400"><Eye size={12} />{viewCounts[session.videoId] ?? session.views}<span className="sr-only"> views</span></span>
                    </div>
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded sm:w-36">
                      <img src={`https://img.youtube.com/vi/${session.videoId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
                      <span className={`absolute bottom-2 right-2 rounded-full p-2 ${active.videoId === session.videoId ? "bg-brand text-black" : "bg-black/70 text-white group-hover:bg-brand group-hover:text-black"}`} aria-hidden="true"><Play size={14} fill="currentColor" /></span>
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
