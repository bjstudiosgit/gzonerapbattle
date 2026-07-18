import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Helmet } from "react-helmet";
import { battles as allBattles, deenoNotableBars, tapped24NotableBars } from "../data/battles";
import { mcs } from "../data/mcs";
import { ArrowLeft, Play, Share2, Trophy, Clock, AlertCircle } from "lucide-react";

const RESULT_CHARACTER_LIMIT = 310;

const limitResultCopy = (paragraphs: readonly string[]) => {
  const copy = paragraphs.join(" ");
  if (copy.length <= RESULT_CHARACTER_LIMIT) return copy;

  const shortened = copy.slice(0, RESULT_CHARACTER_LIMIT + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : RESULT_CHARACTER_LIMIT).trimEnd()}...`;
};

export default function BattleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const battle = allBattles.find(b => b.slug === slug);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Battle not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  const mc1 = mcs.find(m => m.id === battle.mc1);
  const mc2 = mcs.find(m => m.id === battle.mc2);

  // Helper to extract YouTube ID from embed URL
  const getYouTubeId = (url: string | undefined) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // Helper to format date for schema (YYYY-MM-DD)
  const formatDateForSchema = (dateStr: string | undefined) => {
    if (!dateStr) return "2025-12-25";
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return "2025-12-25";
    }
  };

  const videoId = getYouTubeId(battle.videoUrl);
  const socialImage = battle.videoUrl
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : battle.flyer
      ? `https://www.gzonerapbattle.co.uk${battle.flyer}`
      : undefined;
  const schemaData = battle.videoUrl ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${battle.title} - Gzone Rap Battle`,
    "description": `Full battle between ${mc1?.name} and ${mc2?.name} from Gzone Rap Battle League.`,
    "thumbnailUrl": `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    "uploadDate": formatDateForSchema(battle.date),
    "contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
    "embedUrl": battle.videoUrl
  } : null;

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const shareBattle = async () => {
    const title = `${battle.title} | Gzone Rap Battle`;
    const text = `Watch ${battle.title} on Gzone Rap Battle League.`;
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

    try {
      if (typeof navigator !== "undefined" && typeof (navigator as any).share === "function") {
        await (navigator as any).share({ title, text, url });
        return;
      }
    } catch {
      // User cancelled share sheet, or share failed; fall back to copy.
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(url);
      } else if (typeof document !== "undefined") {
        const temp = document.createElement("textarea");
        temp.value = url;
        temp.setAttribute("readonly", "true");
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }

      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      // If even copy fails, there's not much else we can do silently.
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 lg:pb-24 relative overflow-hidden">
      <Helmet>
        <title>{battle.title} | Gzone Rap Battle</title>
        <meta name="description" content={`Watch ${mc1?.name} vs ${mc2?.name} from Gzone Rap Battle League Season 1.`} />
        <meta property="og:title" content={`${battle.title} | Gzone Rap Battle`} />
        <meta property="og:description" content={`Watch ${mc1?.name} vs ${mc2?.name} from Gzone Rap Battle League Season 1.`} />
        {socialImage && <meta property="og:image" content={socialImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/battles" 
          aria-label="Back to Battles"
          className="inline-flex items-center gap-3 text-zinc-500 hover:text-brand transition-all mb-6 md:mb-12 uppercase tracking-[0.4em] text-[10px] font-black group/back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to battles
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 lg:space-y-12">
            {/* Battle Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-7xl font-display uppercase leading-tight mb-5 md:mb-8">
                {battle.title}
              </h1>

              {(battle.isUnreleased || battle.isMainEvent) && (
                <div className="flex justify-center gap-4 mb-8">
                  {battle.isMainEvent && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-black font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(242,125,38,0.4)]">
                      Main Event
                    </div>
                  )}
                  {battle.isUnreleased && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand border border-brand/20 font-bold uppercase tracking-[0.2em] text-xs">
                      <Clock size={16} /> Unreleased Battle
                    </div>
                  )}
                </div>
              )}
              
              <div className="aspect-video bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden relative group">
                {battle.videoUrl ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title={battle.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                  />
                ) : battle.flyer ? (
                  <div className="relative h-full w-full bg-black">
                    <img
                      src={battle.flyer}
                      alt={`${battle.title} event flyer`}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur-sm md:bottom-6 md:left-6 md:right-6">
                      <div>
                        <h3 className="font-display text-xl uppercase text-white md:text-2xl">Video Coming Soon</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">1 August 2026</p>
                      </div>
                      <Clock size={24} className="shrink-0 text-brand" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 relative">
                    <img 
                      src={`https://picsum.photos/seed/${battle.id}/1280/720`} 
                      alt="Battle Thumbnail" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 text-center p-8">
                      <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 border border-brand/20">
                        <Play size={32} className="ml-1" />
                      </div>
                      <h3 className="text-3xl font-display uppercase text-white mb-2">Video Coming Soon</h3>
                      <p className="text-zinc-400 tracking-[0.2em] text-sm">The Gzone is processing the bars...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Battle Result */}
            <section className="bg-zinc-900/50 p-5 md:p-8 rounded-3xl border border-white/5 lg:min-h-[320px]">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl font-display uppercase text-white">Battle Result</h2>
                <p className="text-zinc-400 text-sm mt-2 tracking-widest">
                  {battle.winner ? "Official Judges' Decision" : "Awaiting Decision"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center font-display text-zinc-400 z-10">
                  VS
                </div>

                {/* MC1 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-4 md:p-8 text-center ${battle.winner === mc1?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-2 md:ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc1?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc1?.id ? 'mt-8' : ''}`}>
                    <Link to={`/mc/${mc1?.slug}`} aria-label={`View ${mc1?.name}'s profile`} className="text-xl md:text-3xl font-display uppercase hover:text-brand transition-colors">{mc1?.name}</Link>
                  </div>
                </div>

                {/* MC2 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-4 md:p-8 text-center ${battle.winner === mc2?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-2 md:ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc2?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc2?.id ? 'mt-8' : ''}`}>
                    <Link to={`/mc/${mc2?.slug}`} aria-label={`View ${mc2?.name}'s profile`} className="text-xl md:text-3xl font-display uppercase hover:text-brand transition-colors">{mc2?.name}</Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Clash Summary for Deeno vs Tapped24 */}
            {battle.slug === 'deeno-vs-tapped24' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The main event between Tapped24 and Deeno was built around personal history, broken friendship, family disrespect, screenshots, rebuttals, crowd reaction, and public humiliation. This was not a clean technical spar. It was a grudge match with microphones.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Both MCs crossed into extremely personal territory. Tapped24 opened with shock-value disrespect and heavy family angles, while Deeno responded by framing the battle around betrayal, fatherhood, screenshots, and Tapped's credibility. The most memorable parts of the battle were not just punchlines, but moments where the room reacted to real-life accusations and visual evidence.
                  </p>
                </div>

                {/* Props Used Section */}
                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">Screenshots of text messages</p>
                      <p className="text-zinc-400 text-sm">Used by Deeno to expose Tapped24</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {battle.slug === 'deeno-vs-tapped24' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Tapped24 came into the battle with a high-pressure, disrespect-heavy approach. His performance was built around shock value, personal exposure, family attacks, and trying to overwhelm Deeno from the opening round. He did not ease into the battle; he immediately made it ugly.
                      </p>
                      <p>
                        His strongest weapon was relentless pressure. Even with the early sound and reload issues, Tapped kept restarting and pushing through, which gave his round a chaotic but intense feel. He attacked Deeno's appearance, health, family, partner, children, and credibility. The style was less about clean technical writing and more about making the room react through extreme disrespect.
                      </p>
                      <p>
                        Tapped's issue was control. Some of his strongest ideas were buried inside messy delivery, restarts, and overstacked personal shots. When he landed clearly, he looked dangerous. When the round became too chaotic, the writing lost some impact. Still, his aggression set the tone for the entire battle.
                      </p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Deeno's performance was more narrative-driven. Rather than simply matching Tapped insult for insult, he framed the battle around betrayal, broken friendship, fatherhood, screenshots, and real-life credibility. His opening made the clash feel personal rather than random.
                      </p>
                      <p>
                        His biggest strength was angle construction. He repeatedly returned to the idea that Tapped crossed a line by speaking on his children, then used that as permission to expose personal information. The screenshot reveal was the major turning point because it gave Deeno a visual moment, not just a lyrical one.
                      </p>
                      <p>
                        Deeno also had stronger thematic control. His "Tapped24" flips, fatherhood angles, responsibility attacks, and pressure list gave his material a clearer shape. He was still extremely disrespectful, but his best work felt more purposeful than random. He made the battle feel like a case being built, not just a shouting match in a tracksuit graveyard.
                      </p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {/* Clash Summary for Deeno vs TymeLess */}
            {battle.slug === 'deeno-vs-tymeless' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Deeno entered the main event with home-platform confidence, using TymeLess&apos; name, age, appearance, and GZone history to build time flips, gaming references, and status attacks. His strongest moments came through the Big Smoke and CJ scheme, the no-replay concept, the William name flip, and the Thriller reference.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    TymeLess created the stronger overall performance through comic timing, the running toilet and throne scheme, lemon props, visual comparisons, and crowd control. The battle became a performance piece rather than a standard exchange, and the final crowd call awarded the win to TymeLess.
                  </p>
                </div>

                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {battle.props?.map((prop) => (
                      <div key={prop.name} className="flex items-center gap-4">
                        <div className="w-16 h-16 shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div>
                          <p className="text-white font-bold">{prop.name}</p>
                          <p className="text-zinc-400 text-sm">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {battle.slug === 'deeno-vs-tapped24' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Notable Bars
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  {[
                    { mc: "Tapped24", bars: tapped24NotableBars },
                    { mc: "Deeno", bars: deenoNotableBars }
                  ].map(({ mc, bars }) => (
                    <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                      <div className="space-y-4">
                        {bars.map((bar) => (
                          <div key={bar.quote} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                            <blockquote className="text-white font-bold leading-relaxed mb-3">
                              &ldquo;{bar.quote}&rdquo;
                            </blockquote>
                            <p className="text-zinc-400 leading-relaxed font-light">{bar.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Clash Summary for Deeno vs Grams */}
            {battle.slug === 'deeno-vs-grams' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The main event at the G-Zone Rap Battle League saw Deeno and Grams step into the arena for a high-pressure and deeply personal clash. With Grams entering from the sidelines in a surprise moment, the battle immediately carried the weight of something bigger than a standard matchup, quickly becoming one of the standout moments on the platform.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both MCs leaned heavily into direct confrontation, with sharp personals, lifestyle angles, and constant back-and-forth pressure. Deeno positioned himself as the home-grown presence, using crowd energy and platform control to his advantage, while Grams responded with relentless attacks on identity, image, and authenticity.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the battle progressed, the intensity continued to build, with neither side backing off. The clash stayed consistent in energy throughout, driven by strong crowd reactions and a clear sense of rivalry between both battlers.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the atmosphere in the room was fully locked in, with the decision ultimately left to the crowd. While no formal judges’ ruling closed the battle, it stood out as a defining and highly talked-about moment within the G-Zone arena.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Deeno vs Badee Harz */}
            {battle.slug === 'deeno-vs-badee-harz' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between Deeno &ldquo;The Viking&rdquo; and Badee Harz at The GZone Rap Battle League unfolded as a volatile and deeply personal main event, defined less by layered lyricism and more by outright character destruction. From the outset, the tone was hostile and unfiltered, with both MCs abandoning subtlety in favour of direct, often uncomfortable confrontation.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, the battle leaned heavily into personals, with each artist dissecting the other&apos;s private life in brutal detail. Deeno&apos;s approach centred on relentless attacks toward Badee&apos;s family, children, and background, while also targeting her appearance and credibility within the scene. In response, Badee mirrored this intensity, focusing on Deeno&apos;s upbringing, mental state, and alleged behaviour, creating a back-and-forth that rarely strayed from deeply personal accusations.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A dominant feature of the clash was the sheer level of escalation. What began as typical battle rap insults quickly spiralled into allegations of misconduct, substance abuse, and moral failings from both sides. This pushed the battle into a space that felt less performative and more confrontational, with each round raising the stakes in terms of severity and shock value rather than technical complexity.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Stylistically, the contrast was less about delivery and more about persistence. Deeno maintained a loud, commanding presence, attempting to overwhelm through repetition and directness, while Badee relied on sharp rebuttals and sustained pressure, frequently calling out perceived weaknesses and inconsistencies. The clash wasn&apos;t clean or polished, it was messy, raw, and at times chaotic, amplified further by technical issues and a noticeable stumble from Deeno during the second round.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had reached peak intensity, with both MCs fully committed to their angles despite the disorder surrounding the performance. The crowd remained engaged throughout, though reactions hinted at division, particularly as accusations and personal digs continued to dominate over structured writing.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    In the end, the decision was handed to Deeno by the host and crowd, despite his mid-battle lapse. The result reflected not a flawless performance, but a combination of presence, experience, and control of the room. The clash stands as one of the more extreme examples within The GZone catalogue, remembered for its raw hostility, escalating tension, and unapologetically personal tone.
                  </p>
                </div>

                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-6">Evidence: Props Used</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.props?.map((prop) => (
                      <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4 md:col-span-2">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold md:whitespace-nowrap">{prop.name}</p>
                          <p className="text-zinc-400 text-xs">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Clash Summary for 2MWAD vs Ryno */}
            {battle.slug === '2mwad-vs-ryno' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between 2MWAD and Ryno at The Gzone Rap Battle League saw both MCs step into the ring for an intense and highly charged clash. From the very beginning, the tension was obvious, with both battlers taking an aggressive approach that gave the contest a hostile and unpredictable energy throughout all three rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both artists relied heavily on direct confrontation and personal angles, creating a relentless back-and-forth from start to finish. 2MWAD focused on sharp attacks aimed at Ryno’s character, lifestyle, and public image, using detailed setups and crowd-focused delivery to keep the pressure on. Ryno responded with a forceful and combative style of his own, pushing back with direct rebuttals, strong reactions, and an attempt to challenge the narratives being built against him.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the clash was the intensity of the material and the way both MCs tried to unsettle each other with highly personal content. The atmosphere in the room stayed charged throughout, helped by strong host involvement and crowd engagement that kept the energy high as each round escalated. As the battle unfolded, the exchanges became more heated, giving the matchup a raw and confrontational edge that stood out on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, it was clear that the clash had become one of the more explosive and discussion-heavy performances in the Gzone setting. While the focus remained on the battle itself rather than a clear formal result, the contest stood out for its intensity, its crowd reaction, and the no-holds-barred style both MCs brought to the stage.
                  </p>
                </div>

                {/* Props Used Section */}
                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">NFA Document from Police</p>
                      <p className="text-zinc-400 text-sm">Shown by Ryno in defense</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Clash Summary for Tapped24 vs Roman */}
            {battle.slug === 'tapped24-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Tapped 24 and Roman at The Gzone Rap Battle League saw both MCs step into the ring for a fierce and emotionally charged clash. From the opening moments, the tension was unmistakable, with both battlers bringing a level of hostility and direct confrontation that quickly made the matchup feel like one of the biggest moments on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both artists delivered highly aggressive performances built around personal angles, sharp rebuttals, and relentless pressure. Tapped 24 came with an intense, forceful style, using direct attacks and commanding delivery to keep the battle on edge. Roman responded with a more layered approach, mixing personal angles, crowd reaction, and calculated moments designed to shift momentum in his favour.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major moment in the battle came when Roman introduced printed messages and visual material as part of his round, creating one of the standout reactions of the clash. That move added another level of tension to the contest and helped turn the atmosphere in the room even more charged. Despite technical interruptions and repeated pauses around sound and timing, both MCs continued to push the intensity higher as the battle unfolded.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the hosts turned to the crowd to measure the reaction, with both battlers receiving strong support from the room. While no formal judged result was given on camera, the battle was widely treated as one of the standout performances of the night, remembered for its intensity, dramatic moments, and the raw energy both MCs brought to the Gzone stage.
                  </p>
                </div>

                {/* Props Used Section */}
                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">Screenshots of text messages</p>
                      <p className="text-zinc-400 text-sm">Used by Roman to expose Tapped24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">Screenshots of text messages</p>
                      <p className="text-zinc-400 text-sm">Used by Tapped24 to expose Roman</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Clash Summary for Tapped24 vs AJNA */}
            {battle.slug === 'tapped24-vs-ajna' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Tapped 24 and AJ at The Gzone Rap Battle League saw both MCs step into the ring for a fierce and emotionally charged clash. From the very start, the tension was clear, with AJ making an immediate statement as the First Lady of the Gzone and Tapped 24 bringing the kind of aggressive energy expected from a seasoned battler, making it one of the standout matchups on the platform.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with a highly personal and confrontational style, pushing deep into direct attacks and sharp rebuttals. Tapped 24 focused on relentless pressure, using hard-hitting angles and dismissive punchlines aimed at AJ’s image and credibility. AJ responded with a forceful and high-energy performance of her own, mixing crowd reaction, direct callouts, and repeated themes that gave her rounds strong momentum and presence.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the battle was the contrast between Tapped 24’s veteran style and AJ’s hunger to make her mark. As the clash unfolded, AJ’s energy and delivery appeared to connect more and more with the room, while Tapped 24 continued to press with aggressive material and direct confrontation. That dynamic kept the battle intense throughout and helped build one of the strongest crowd reactions of the event.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the hosts turned to the crowd and the live chat to help determine the outcome. While there was some discussion around the technical side of the decision, the reaction in the room and online ultimately gave AJ the edge. With that, AJ secured a memorable win and strengthened her position as one of the most talked-about performers on the Gzone platform.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Tapped24 vs Grams */}
            {battle.slug === 'tapped24-vs-grams' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The main event at The GZone Rap Battle League saw Marni Gramz and Tapped 24 step into the ring for one of the most volatile and emotionally charged clashes in league history. With genuine tension between both MCs from the opening seconds, the battle carried the energy of a real grudge match and quickly became one of the most talked-about moments the platform has produced.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with an aggressive and highly personal approach, pushing well beyond standard battle rap disrespect into deeply targeted angles and direct confrontation. Marni Gramz applied relentless pressure with personal attacks aimed at Tapped 24's home life, relationships, and credibility, while Tapped 24 responded with explosive crowd-control, sharp rebuttals, and heavy personal material of his own.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout moment came in the later rounds when Tapped 24 introduced printed screenshots and visual props to strengthen his angle, drawing one of the loudest reactions of the night and visibly frustrating his opponent. The battle also saw surprise involvement from Badee Harz during one of the rounds, adding to the theatre and chaos inside the room.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the clash escalated, the atmosphere became increasingly hostile, eventually boiling over into a physical altercation that forced security and the hosts to intervene. Proceedings were halted and a ten-minute break was called to restore order before the event could continue.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the host turned to the crowd for the verdict, leaving the decision to audience reaction. Guest judge Denzel Bentley praised Tapped 24 for "ripping the room," but regardless of result, the battle went down as one of the rawest, most explosive, and most unforgettable clashes in GZone history.
                  </p>
                </div>

                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-6">Evidence: Props Used</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.props?.map((prop) => (
                      <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4 md:col-span-2">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold md:whitespace-nowrap">{prop.name}</p>
                          <p className="text-zinc-400 text-xs">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Clash Summary for PR1NC3 vs NattyEBK */}
            {battle.slug === 'pr1nc3-vs-nattyebk' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Prince and Natty EBK at the Gzone Rap Battle League saw both MCs step into a tense and highly confrontational clash. From the opening round, Natty EBK set the tone with direct and deeply personal angles, immediately putting pressure on Prince and establishing a hostile atmosphere that carried through all three rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both artists took contrasting approaches. Natty EBK leaned into shock-driven material, focusing on personal attacks and uncomfortable subject matter to disrupt his opponent and control attention. In response, Prince delivered with a more measured strategy, repeatedly questioning Natty’s credibility and image while using consistent themes around behaviour and presentation to build his rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A defining feature of the clash was this difference in style. Natty’s approach centred on impact and reaction through intensity, while Prince relied on structure, delivery, and calculated counters to regain momentum. This created a steady back-and-forth dynamic, with both MCs landing moments that drew strong reactions from the room as the tension continued to build.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, both sides had fully committed to their angles, closing with direct and aggressive material aimed at leaving a final impression. The hosts turned to the crowd to decide the outcome, and based on the reaction in the room, the result appeared clear on the night. While no formal judged decision was announced, the battle stood as a raw and divisive clash that reflects the uncompromising style of the Gzone platform.
                  </p>
                </div>

                {/* Props Used Section */}
                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-6">Evidence: Props Used</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">💧</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Listerine</p>
                        <p className="text-zinc-400 text-xs">Used by PR1NC3 to mock NattyEBK's alleged bad breath</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🧼</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Luxury Brand Bar of Soap</p>
                        <p className="text-zinc-400 text-xs">Used by PR1NC3 to mock NattyEBK's hygiene</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🧂</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Salt</p>
                        <p className="text-zinc-400 text-xs">Used by PR1NC3 to allege NattyEBK was "stinking"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Clash Summary for PR1NC3 vs Roman */}
            {battle.slug === 'pr1nc3-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between Prince and Roman at the Gzone Rap Battle League New Year’s Day Special 2026 saw both MCs step into the ring for a high-energy and competitive showdown. From the opening moments, the tension was clear, with both battlers setting a confrontational tone that carried through all three rounds and made the battle a standout performance early in the year.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the rounds, both artists brought contrasting but equally impactful styles. Prince leaned into a direct and aggressive approach, applying constant pressure with sharp delivery and confident presence. Roman, in response, delivered a more layered performance, using wordplay, structure, and narrative angles to challenge Prince’s position and control the momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key feature of the battle was the back-and-forth dynamic, with both MCs landing moments that drew strong reactions from the crowd. Roman’s use of creative wordplay and extended schemes stood out, while Prince’s commanding delivery and clear-cut attacks ensured the intensity never dropped. The energy in the room built steadily as each round escalated the confrontation.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the battle reached its conclusion, the hosts once again turned to the crowd to determine the outcome, relying on audience reaction rather than a formal judged decision. While no official winner was declared on camera, the clash between Prince and Roman cemented itself as a memorable and hard-fought contest within the Gzone catalogue.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Btizz vs 1Flaymr */}
            {battle.slug === 'btizz-vs-1flaymr' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>

                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between 1Flama and BTizz at The GZone Rap Battle League marked a high-energy encounter between a bold newcomer and a more calculated, sceptical opponent. From the opening moments, the battle carried a tense but competitive atmosphere, driven by two completely different styles and approaches to the craft.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both MCs leaned into direct confrontation and personal angles. 1Flama delivered an aggressive, fire-themed performance built on intensity, repetition, and presence, using his masked identity and Jamaican-influenced persona to create a sense of danger and unpredictability. In contrast, BTizz took a more analytical route, focusing on dismantling his opponent’s image with mockery, wordplay, and repeated challenges to his authenticity.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key dynamic throughout the battle was BTizz’s continued questioning of 1Flama’s persona, particularly the mask and claimed background, which became a central talking point in the clash. Meanwhile, 1Flama relied on energy and intimidation, escalating his delivery as the rounds progressed and keeping pressure on through constant verbal attacks and crowd-directed moments.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the battle moved into the final round, the intensity peaked, with both MCs fully committing to their angles—1Flama doubling down on raw aggression and presence, while BTizz closed with a series of direct rebuttals and dismissive “cap” accusations. The contrast in styles made for a back-and-forth contest that kept the room engaged throughout.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, no clear decision was declared on the spot, with the hosts leaving the outcome to audience reaction and online voting. The battle stood out as a strong showcase of contrasting approaches, making it one of the more debated and talked-about performances within The GZone lineup.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Btizz vs CJ Zino */}
            {battle.slug === 'btizz-vs-cj-zino' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between BTizz and CJ-Zino at The GZone Rap Battle League delivered a raw, high-intensity showdown that quickly turned into a deeply personal war of words. From the opening moments, both MCs came in with clear intent, not just to out-rap each other, but to break down their opponent’s image in front of the room.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, the battle was driven by direct confrontation and relentless pressure. BTizz leaned heavily into personal angles, questioning CJ-Zino’s credibility, past performances, and overall presence, while maintaining an aggressive, attack-first approach throughout. CJ-Zino fired back with his own counter strategy, focusing on character breakdowns, accusations around authenticity, and sharp challenges to BTizz’s reputation.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the rounds progressed, the tone only escalated. Both battlers abandoned any restraint, doubling down on disrespect and crowd engagement, creating a tense and unpredictable atmosphere. The energy in the room reflected this, with reactions shifting throughout as each MC tried to seize control of the momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had fully evolved into a grudge-style exchange, with both sides refusing to step back and continuing to push their narratives. Like many GZone clashes, the decision was left to the crowd, with audience reaction acting as the final measure of impact on the night.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Deluxx vs Btizz */}
            {battle.slug === 'deluxx-vs-btizz' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Deluxx and Btizz at The Gzone Rap Battle League marked a standout moment for the platform, as one of the first events to be live streamed directly to YouTube. From the outset, both MCs entered the ring with high energy, setting the tone for a competitive and confrontational three-round clash.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both competitors leaned heavily into personal angles and direct attacks, creating a tense back-and-forth dynamic. Deluxx focused on shock-factor material and bold accusations, aiming to unsettle his opponent and control the narrative. In response, Btizz delivered a more structured approach, combining direct punches with angles around identity, presence, and lyrical credibility.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key feature of the clash was the contrast in styles, with Deluxx pushing intensity through aggressive content, while Btizz maintained clarity and consistency in his delivery. Despite several technical interruptions affecting the flow at points, both MCs continued to engage the crowd and build momentum as the rounds progressed.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the performances across the first two rounds proved decisive. While the final round saw some disruption, the overall consistency and control shown by Btizz gave him the edge. The result was reflected in the final call, with Btizz taking the win in a competitive 2–1 decision, making the battle a memorable moment in Gzone’s early live-streamed events.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for LDN Mikez vs Deluxx */}
            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between LDN Mikez and Deluxx at the Gzone Rap Battle League Christmas Day event saw both MCs step into the ring for a tense and hard-hitting clash. From the beginning, the matchup carried a strong contrast in styles, with Mikez bringing a dark, aggressive approach while Deluxx leaned more into flow, rhythm, and repetition, making it one of the more distinctive battles on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with very different tactics. LDN Mikez applied constant pressure through direct attacks, sharp punches, and a more intense lyrical style that aimed to control the battle from start to finish. Deluxx responded with a performance built around cadence, delivery, and recurring phrases, trying to match the energy with momentum and presence of his own.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the battle was the contrast between Mikez’s dense, confrontational writing and Deluxx’s more flow-driven performance. As the rounds progressed, Mikez’s pressure and clarity appeared to give him the edge, while Deluxx continued to rely on rhythm and crowd-facing moments to keep himself in the contest. Even with interruptions and restarts during the battle, the intensity remained high and the atmosphere stayed charged throughout.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the crowd reaction made the outcome clear, with LDN Mikez emerging as the winner on audience consensus. While the battle remained rooted in the raw, hostile energy that defines the Gzone setting, it also stood out as a memorable performance because of the clear stylistic contrast between the two MCs and the strong reaction it generated on the day.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for LDN Mikez vs 2mwad */}
            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between LDN Mikez and 2mwad at the Gzone Rap Battle League saw both MCs step into the ring for a high-intensity and confrontational clash. From the opening moments, there was clear tension, with 2mwad immediately challenging Mikez’s material and questioning its originality, setting a sharp tone that carried throughout all three rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both artists leaned heavily into personal angles and direct attacks, creating a relentless back-and-forth dynamic. 2mwad focused on breaking down Mikez’s personal life and positioning, using structured setups and layered references to frame his opponent in a negative light. In response, LDN Mikez delivered with aggressive energy, combining sharp punchlines and recognisable references to maintain pressure and control the pace of the clash.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout feature of the battle was the use of extended themes and creative wordplay. 2mwad incorporated gaming-style metaphors and narrative angles to build his rounds, while Mikez countered with bold cultural references and consistent delivery that connected strongly with the crowd. As each round progressed, the intensity continued to build, with both MCs landing moments that drew strong reactions from the room.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had reached its peak, with both sides delivering their strongest material in an attempt to close the contest. The hosts ultimately turned to the crowd to decide the outcome, and based on the reaction, LDN Mikez appeared to edge the decision. While no formal judged ruling was given on camera, the clash stood out as a competitive and hard-fought battle that reinforced the high-energy, no-holds-barred style of the Gzone platform.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Renzo vs Proty */}
            {battle.slug === 'renzo-vs-proty' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <h2 className="text-3xl font-display uppercase text-white flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  
                  {/* Warning/Advisory Badge */}
                  <div className="flex items-center gap-3 px-5 py-3 bg-orange-500/10 border border-orange-500/30 rounded-full">
                    <AlertCircle className="text-orange-500" size={18} />
                    <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Battle Advisory: Technical Issues & Personal Content</span>
                  </div>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between Renzo and Proty at The Gzone Rap Battle League brought two of the platform’s youngest MCs face to face in a high-energy, back-and-forth contest that quickly turned personal. Framed as a showcase of emerging talent, the battle carried a competitive edge from the opening moments, with both rappers determined to prove who really belonged on the stage.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both MCs leaned into direct confrontation, mixing sharp insults with challenges to each other’s credibility, lifestyle, and lyrical ability. Renzo pushed a more aggressive and performance-driven approach, focusing on personal angles and asserting his status as the more seasoned battler, while Proty countered with pace, ridicule, and constant attacks on Renzo’s relevance, pen, and public image.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key moment in the battle came when Proty flipped one of Renzo’s personal angles, exposing it mid-round and shifting the energy in the room. Combined with his fast delivery and consistent pressure, this helped create some of the strongest reactions of the clash. The battle was also impacted by technical issues and a reload, adding an extra layer of tension and debate around momentum and round control.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the final round closed, both MCs continued to press their styles, with Renzo leaning into performance and concept-driven material, while Proty maintained tempo and direct breakdowns of his opponent. The energy remained high throughout, with neither side backing down.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the decision was left to the crowd and viewers, reflecting the competitive nature of the clash. With strong reactions on both sides and no clear consensus, the battle stood out as a lively and contested matchup, adding another intense moment to the Gzone stage.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for CJ Zino vs Proty */}
            {battle.slug === 'cj-zino-vs-proty' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between CJ Zino and Proty at the Gzone Rap Battle League saw both MCs step into the ring for a high-energy and confrontational clash. From the opening moments, the tone was set with sharp exchanges and a strong contrast in styles, making it one of the more entertaining and dynamic battles on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers delivered aggressive performances built around personal angles and direct attacks. CJ Zino came with a commanding and forceful presence, focusing on dominance, confidence, and dismissive punchlines aimed at controlling the battle. In response, Proty took a more layered and creative approach, blending humour, wordplay, and cultural references to break down his opponent and win over the crowd.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout element of the clash was the clear stylistic contrast between the two. CJ Zino’s direct, high-pressure delivery kept the intensity high, while Proty’s mix of comedic timing and intricate schemes created memorable moments that resonated strongly with the audience. As the rounds progressed, the back-and-forth exchanges built momentum, with both MCs landing impactful lines and drawing strong reactions.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had reached its peak, with both sides delivering their strongest material in an effort to close the contest. The hosts ultimately turned to the crowd to determine the outcome, and based on the reaction in the room, Proty edged the decision, the battle stands out as a lively and competitive clash that highlighted both entertainment and performance within the Gzone.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Ryno vs Tymeless */}
            {battle.slug === 'ryno-vs-tymeless' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Rhino and Timeless at The Gzone Rap Battle League saw both MCs step into the ring for a fierce and highly charged clash. From the opening moments, the atmosphere was intense, with both battlers bringing direct confrontation, sharp delivery, and a level of hostility that made the contest feel tense from start to finish.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both artists relied on aggressive personal angles and relentless attacks, creating a battle that stayed confrontational throughout. Rhino brought a forceful and technical approach, mixing direct pressure with structured rebuttals and moments of sharp timing. Timeless responded with a more theatrical style, using performance, crowd-facing delivery, and visual moments to keep the attention of the room and build momentum in his favour.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout feature of the battle was the contrast between Rhino’s technical style and Timeless’s dramatic presentation. While Rhino delivered moments that highlighted his ability to think quickly and control the structure of his rounds, Timeless created memorable crowd reactions through a more performative approach that gave his material extra impact. As the battle progressed, the exchanges became more heated, with both MCs continuing to raise the intensity.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the crowd reaction appeared to give Timeless the edge, and he was ultimately treated as the winner on the day. While both battlers had strong moments across the contest, the battle stood out as one of the more intense and theatrical performances in the Gzone catalogue, driven by high energy, strong reactions, and a clear sense of rivalry throughout.
                  </p>
                </div>

                {/* Props Used Section */}
                <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                  <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-6">Evidence: Props Used</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">📸</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Alleged photo of Ryno kissing a man</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to expose Ryno</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">⚱️</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">A bag of ashes</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless as a shock reveal to expose Ryno</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🧦</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">A pair of socks</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to reinforce a homelessness angle</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🪥</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">A toothbrush</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to mock hygiene and living conditions</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🍜</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Chicken & Mushroom Pot Noodle</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to suggest Ryno might be hungry</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🧼</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">A bar of soap</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to attack personal hygiene</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🩹</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">A roll of packing tape</p>
                        <p className="text-zinc-400 text-xs">Used by Tymeless to suggest patching up worn-out clothes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                        <span className="text-2xl">🔑</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Keys to a property</p>
                        <p className="text-zinc-400 text-xs">Used by Ryno to reject claims of being homeless</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {battle.slug === 'tapped24-vs-ajna' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Tapped24 came into the battle as the known GZone name and leaned heavily into his established "Mr Disrespectful" style. His performance was built around shock value, body-shaming, family insults, sexual accusations, and relentless personal disrespect. From the first round, he made it clear he was not going to treat AJ differently because she was the first woman to battle on the GZone platform.
                      </p>
                      <p>
                        His delivery had aggression and confidence, but the battle also exposed the downside of his style. Several sections needed reloads because of sound issues, crowd reaction, or the room talking over him. When the material landed clearly, he was direct and dangerous, but some of his writing became overloaded with crude insults and graphic imagery rather than sharp punch structure.
                      </p>
                      <p>
                        Tapped's strongest moments came when he used obvious visual angles: AJ's forehead, body shape, eyebrows, lazy eye, and appearance. He also used name and pop-culture references like Dumbledore, Juggernaut, James and the Giant Peach, Austin Powers, TARDIS, High School Musical, and Wiley. The crowd reacted, but AJ's response energy made the battle much closer than expected.
                      </p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">AJ / AJNA</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        AJ entered as the first lady of the GZone and immediately proved she was not there to be treated like a novelty act. Her round one shocked the room because she came with a level of aggression and disrespect that matched Tapped's energy directly. The crowd reaction showed people were not expecting her to go that hard.
                      </p>
                      <p>
                        Her strongest quality was fearlessness. She attacked Tapped's sexuality, masculinity, appearance, alleged behaviour, girlfriend, drug use, and character. She did not try to soften the material or play safe. Instead, she matched the room's hostile energy and forced several reloads from reaction.
                      </p>
                      <p>
                        AJ's writing was raw and graphic, but she had clear moments of structure. She repeatedly used "not a bad man / mad man / sad man" style phrasing, attacked his "Tapped24" name, and later built schemes around lines, sniffing, "Georgie Porgie," and Tapped allegedly being fake or predatory. Her delivery was intense enough that even when some lines were messy, the room stayed locked in.
                      </p>
                      <p>
                        AJ won because the crowd and live-stream reaction ultimately favoured her. Some people in the room felt Tapped may have edged it technically, but the final verdict went to AJ after the crowd and stream leaned her way. That matters historically because she became the first woman to win on GZone in this format.
                      </p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'ryno-vs-tymeless' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Ryno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Ryno came into the battle with serious intent and a very aggressive first round. His opening set the tone immediately, mixing personal angles, family disrespect, mental-health references, time-based wordplay, and accusations aimed at TymeLess' character. He was direct, loud, and clearly wanted to establish himself as the more dangerous battler in the ring.
                      </p>
                      <p>
                        His strongest writing came when he built around TymeLess' name. The "time" concept gave him plenty to work with: time travel, timelines, timing, timestamps, expiry dates, and time of death. When those bars landed cleanly, they gave his rounds structure and made the attacks feel tailored rather than generic.
                      </p>
                      <p>
                        Ryno's biggest issue was control. He had strong material, but the battle became chaotic in places, with interruptions, restarts, and moments where the room energy overtook the writing. His second round also got affected by confusion around whether the round had ended, which disrupted his momentum. Still, his third round had a strong closer with the live time-of-death moment, showing he could freestyle and adapt in the room.
                      </p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">TymeLess</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        TymeLess won the battle by crowd reaction, and the reason is clear: he controlled the emotional temperature of the room. His material was extremely personal, direct, and built around attacking Ryno's credibility, family history, homelessness, allegations, race-related accusations, and relationships.
                      </p>
                      <p>
                        He was less polished in a traditional technical sense than Ryno at times, but he had the bigger room-shaking moments. TymeLess repeatedly turned Ryno's own angles back on him, especially around racism accusations, family tragedy, and personal hardship. He also used props in the third round, bringing out items like socks, underwear, toothbrush, and Pot Noodle to mock Ryno's living situation. That gave his round a visual punch the crowd could not ignore.
                      </p>
                      <p>
                        TymeLess' strongest quality was battle instinct. He knew when to simplify a bar for reaction, when to repeat a line, and when to drag the room into the moment. The material was dark, sometimes extremely uncomfortable, but in the GZone environment it landed hard enough for the crowd to edge the battle his way.
                      </p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'pr1nc3-vs-nattyebk' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Natty EBK</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Natty EBK opened the battle with a brutal, highly personal round that immediately pushed the clash into dark territory. His style was built around shock pressure, family disrespect, dead-child angles, attacks on Prince's partner, and repeated attempts to make Prince react emotionally rather than just rap.</p>
                      <p>His delivery had raw aggression and confidence. Natty did not waste time feeling out the room; he attacked straight away and made it clear he wanted to bully the battle through disrespect. He repeatedly framed Prince as old, broke, fake, weak, and unable to protect his own image.</p>
                      <p>His biggest strength was pressure. Even when the bars were crude or messy, the intensity made the room listen. His biggest weakness was that some material leaned so heavily on shock value that the actual punch craft got buried. Still, in a GZone crowd setting, that level of disrespect creates momentum quickly.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">PR1NC3</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Prince came into the battle looking more measured. He knew Natty would bring personal angles, so he tried to neutralise them early by saying the obvious attacks did not affect him. That was smart because Natty had gone straight for Prince's family, wife, children, and known background.</p>
                      <p>Prince's strongest moments came when he focused on Natty's credibility. He repeatedly called him fake, accused him of lying in his rhymes, attacked him as a snitch, and mocked his breath, hygiene, image, and stage presence. His Listerine and Dove prop section gave him a visual moment and helped break up the aggression with humour.</p>
                      <p>Prince was not as wild as Natty, but he had clearer moments of structure. He framed the battle as redemption, positioned himself as a proper artist, and closed with a strong "levels" angle. The crowd decision appears to favour Prince clearly at the end, with the hosts suggesting the verdict was obvious before calling for the shake-hand moment.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'btizz-vs-cj-zino' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">BTizz</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>BTizz came in with strong energy and tried to set the tone early by framing the battle as a "GZone massacre." His performance was aggressive, physical, and built around direct disrespect. He repeatedly attacked CJ Zino's previous performance, image, health, hygiene, credibility, and stage presence.</p>
                      <p>His strongest moments came when he used simple crowd-readable lines. The "MVP" chant, the "CJ Zino / three rounds / 3-0" pattern, and the Nemo/Dory scheme were easy for the room to catch. He also used battle language around cleaning up the stage, violence, sickness, and being the stronger performer.</p>
                      <p>The issue was consistency. BTizz had energy, but some sections became messy and overpacked. He threw many angles at CJ Zino: STDs, HIV, pills, malaria, hair, lack of credibility, and his previous loss. Some landed, while others blurred together. He started strongly, but CJ Zino's later rounds created bigger moments and stronger room control.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ Zino</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>CJ Zino took a more composed but disrespectful approach. His writing attacked BTizz's image, job, hygiene, flow, credibility, sexuality, family tree, confidence, and originality. He also repeatedly suggested that BTizz was borrowing flows from Tapped24, which became one of the stronger undermining angles in the battle.</p>
                      <p>CJ's biggest strength was control. His rounds had sharper personal direction, making BTizz look nervous, fake, dirty, and derivative. The "stole your flow" moment, the Listerine and hygiene angle, the TARDIS and doctor scheme, and the final callout toward Prince gave his performance a stronger narrative.</p>
                      <p>He also handled the crowd well. By the end, the room reaction clearly leaned toward CJ Zino, and he used the win to set up his next target. The post-battle Prince callout helped his performance feel like part of a wider GZone storyline rather than a one-off clash.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'deeno-vs-grams' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Grams</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Grams entered as a surprise opponent, immediately changing the energy of the episode. The battle was originally introduced as Deeno the Viking versus 2 Man, but Grams appeared instead, turning the clash into a surprise main-event-style moment.</p>
                      <p>His performance was confident, disrespectful, and built around making Deeno look out of place. Grams attacked Deeno's weight, image, speech, drinking, parenting, race identity, Viking persona, and credibility. He also used fantasy and pop-culture imagery, linking Deeno to Vikings, Odin, Arthur, Harry Potter, Shrek, Scooby-Doo, and Ed Sheeran.</p>
                      <p>Grams' biggest strength was presence. He came in like he had planned the ambush, controlled the surprise, and made the battle feel like a takeover. His material kept returning to a clear argument: Deeno is not really a Viking, not really dangerous, and not built for the platform he claims to run.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Deeno had the harder job because he was clearly thrown off by the surprise. He admitted the situation rattled him slightly, but still came back with a strong freestyle-heavy response. The room could see he had not prepared for Grams specifically, yet he still created several sharp angles.</p>
                      <p>His best material attacked Grams as an outsider to GZone, someone overlooked elsewhere, and someone using GZone for a comeback. He also flipped Grams' name through weight, weed, and weighing imagery. His third round widened the target, calling out multiple names from the wider scene and framing himself as the father figure of the platform.</p>
                      <p>Deeno's biggest issue was the room. GZone is clearly his home, but Grams' surprise entrance created a novelty moment that Grams used well. Deeno fought back strongly, but Grams had the stronger room control and took the crowd decision.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'pr1nc3-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">PR1NC3</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>PR1NC3 came in with strong confidence and direct aggression. His performance tried to make Roman look old, washed, overweight, outdated, and below his level. He attacked Roman's appearance, age, flow, family, partner, and credibility while presenting himself as the younger, sharper battler.</p>
                      <p>His best material kept things simple and punchy. The "big tip / fat brick / no drip" opening was blunt but clear. The fish tank versus ocean comparison was one of his better status bars, making Roman look trapped and small while PR1NC3 placed himself in a bigger world. He also had a good fake-out where he pretended to forget his bars.</p>
                      <p>The weakness was consistency. PR1NC3 had energy and some strong punches, but Roman's writing felt more layered and more comfortable in the room. PR1NC3 was dangerous in bursts, while Roman had better crowd control and more memorable schemes.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Roman won because he sounded like the more experienced battler. His writing was sharper, stranger, and more layered. He attacked PR1NC3's age, height, family, girlfriend, stage name, background, and credibility with more technical variety than simple shouted insults.</p>
                      <p>His biggest strength was personality. Roman had a strange, confident, theatrical delivery that made the room react. He used finger-pointing, crowd interaction, reload-worthy setups, and layered references. The Times New Roman bar, Buckingham Palace and royal-bars angle, and the 2001 scheme gave his rounds a stronger identity.</p>
                      <p>Roman handled the battle like he knew when a line had landed. He let the crowd breathe, got reloads, and kept pushing. PR1NC3 had good aggression, but Roman felt like the man controlling the battle rather than merely surviving it.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">LDN Mikez</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>LDN Mikez came in determined to make the first GZone battle feel dangerous immediately. His performance was aggressive, personal, and built around shock value, but had enough structure to stop it becoming pure chaos.</p>
                      <p>His strongest weapon was delivery. He performed with confidence, pushed through reloads, and repeatedly made the room react. He attacked Deluxx's name, family, sexuality, appearance, mental health, finances, and credibility, escalating until the battle felt one-sided.</p>
                      <p>His best material mixed disrespect with grounded angles: Universal Credit, landlord money, Christmas, Wi-Fi, depression, and being "made" as an artist. Those everyday references felt sharper than the most extreme shock lines, and Mikez clearly won the room.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deluxx</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Deluxx had moments where the ideas were present, but he struggled to match Mikez's pressure. His delivery was less clear, and some material lost impact when he accelerated.</p>
                      <p>His best work attacked Mikez as fake, dusty, broke, awkward, and less sharp than he claimed. He used name flips, hairline jokes, mum insults, Renzo references, and water and Atlantis imagery. The problem was command: Mikez sounded like he owned the moment, while Deluxx sounded like he was trying to survive it.</p>
                      <p>By round three, Deluxx moved toward a more freestyle-style delivery, but it was not enough to turn the battle. He showed flashes, while Mikez produced the clearer impact and deserved the crowd verdict.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">2MWAD</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>2MWAD came into the battle with a clear plan: attack LDN Mikez through fatherhood, step-parenting, family background, money, drugs, and credibility. His opening built a strong angle around Mikez raising another man's children, using gaming language such as DLC, NPC, XP, side quest, and player one to turn parenting into a full scheme.</p>
                      <p>His best moments came when he stayed structured. The stepdad and gaming scheme was personal, modern, and easy to follow. He also produced a stronger third round, especially when using EastEnders references and grounded insults about family, money, and online banking.</p>
                      <p>The weakness was that Mikez kept stealing the room back. 2MWAD had good material, but Mikez had stronger performance control, bigger reaction moments, and more confidence under pressure. He fought back properly without dominating the room enough to overcome Mikez's momentum.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">LDN Mikez</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>LDN Mikez entered already looking like one of GZone's strongest early names. After beating Deluxx in Episode 3, he returned with the same aggressive, personal style and even more confidence.</p>
                      <p>Mikez's approach was built around escalation. He attacked 2MWAD's family, mother, partner, mental health, appearance, children, and personal history while using grounded references such as Universal Credit, EastEnders, nursery, Spotify, and adult financial pressure. His delivery was louder, more commanding, and more crowd-ready.</p>
                      <p>His biggest advantage was control. Even when 2MWAD landed, Mikez responded as if he owned the stage. He brought more energy, reload moments, and stronger closers. The crowd reaction was close, but the repeat vote leaned toward Mikez.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'btizz-vs-1flaymr' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">1Flaymr</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>1Flaymr came in as a newcomer with a clear identity: fire, smoke, Jamaican energy, patois delivery, and chaos. His performance used Avatar, burning, heat, smoke, and Fire Nation language to make the flame concept feel fully branded.</p>
                      <p>His strongest quality was character. He was loud, animated, unpredictable, and committed to the fire persona, while his rhythm and accent pattern gave him a different sound from most of the roster.</p>
                      <p>The weakness was clarity. Some material lost impact through delivery, mic level, and repetition. His clearest moments were the Fire Nation, forest fire, firebender, Red Sea and Moses, landlord and eviction notice, and snowman ideas.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">BTizz</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>BTizz responded like the more experienced GZone battler. He used stronger crowd control, sharper insults, and direct attacks to undermine the flame persona, questioning 1Flaymr&apos;s authenticity, image, hygiene, and credibility.</p>
                      <p>His performance was clearer and more controlled. Crowd chants, name spelling, food references, scene callouts, and repeated fire flips kept pressure on 1Flaymr while turning the newcomer&apos;s central identity against him.</p>
                      <p>BTizz&apos;s biggest advantage was live-room command. He knew when to simplify, repeat, and involve the crowd. The closing &ldquo;fully extinguished&rdquo; framing supported the crowd&apos;s decision in his favour.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'cj-zino-vs-proty' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ-Zino</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>CJ-Zino entered his first GZone appearance with confidence, grime influence, and direct personal attacks. He tried to make Proty look dirty, strange, fake, unhealthy, and unsuited to the platform.</p>
                      <p>His material targeted Proty&apos;s family, appearance, hygiene, clothes, breath, and reputation. Even when the phrasing became rough, he kept returning to grime, darkness, pressure, and GZone energy.</p>
                      <p>CJ&apos;s biggest strength was aggression and momentum. His third round felt like a closer, using streaming-device wordplay, big-dog status, and reputation attacks to finish strongly.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Proty</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Proty returned with more control than in his previous disputed appearance and gave CJ a genuine battle. His style was more joke-heavy and visual, repeatedly attacking CJ&apos;s appearance, breath, face, alleged drug use, family, and hygiene.</p>
                      <p>His strongest material made CJ look physically strange or cartoonish. Pixar, Ratatouille, Tic Tac, Flushed Away, bacteria, and Yanko comparisons produced his most memorable images.</p>
                      <p>The weakness was that the performance sometimes felt more like a roast than a takeover. The jokes landed, but CJ&apos;s aggression and platform energy appeared to carry more weight in the room.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'renzo-vs-proty' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Renzo</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Renzo entered with a fast, aggressive style and constant movement. His performance relied on pressure, rhythm, and speed rather than slow punch-by-punch writing.</p>
                      <p>Energy was his strongest quality. He attacked Proty&apos;s image, family, social status, clothes, flow, and credibility through quick switches and direct disrespect that felt closer to a grime cypher turning into a battle.</p>
                      <p>The weakness was clarity. Some ideas became buried in fast pockets, but the Trident and 3-0, cheat-code sequence, 0121 branding, and Renzo and friendzone material gave the crowd cleaner moments to hold onto.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Proty</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Proty brought cleaner joke writing and more visual punchlines. His approach made Renzo look drugged, broke, unhygienic, fake, and physically awkward.</p>
                      <p>The UK Cali bar, likes-versus-followers angle, Pennywise scheme, Rizla twist, Tails comparison, and credit-clothes material produced his most memorable moments. Drug use and poor money management became his central narrative.</p>
                      <p>Proty&apos;s concepts were easier to follow, but Renzo&apos;s pace and crowd presence appeared to carry more weight in the room, making the contest feel close despite Proty&apos;s cleaner punches.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'ryno-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Roman entered with cleaner structure and more controlled angle work. His performance framed Ryno as fake, unstable, homeless, morally questionable, and far less dangerous than his image suggests.</p>
                      <p>His biggest strength was making the battle personal without losing shape. Ryno&apos;s name, housing, family, children, allegations, and public image became repeated pressure points, supported by deliberate pacing and strong crowd control.</p>
                      <p>The best material mixed character attacks with wordplay. Rhino facts, Romans arriving squad-deep, relegation, Heady One and sofa imagery, hotel allegations, and the zero risk, zero gain, one million views sequence made the round feel like a case being built.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Ryno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Ryno brought aggression, intensity, and direct personal retaliation. His material was darker and more chaotic, targeting Roman&apos;s ex, family, mother, size, relationships, grief, and allegations.</p>
                      <p>Emotional pressure was his strongest weapon. When focused, especially after the first-round restart and through parts of the later rounds, his writing had bite and was clearly intended to make Roman uncomfortable.</p>
                      <p>The issue was control. Ryno had moments, but Roman sounded more prepared and composed. Some delivery felt rushed or unstable, leaving Roman with the cleaner structure and stronger overall command.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'tapped24-vs-grams' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Grams</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Grams entered with confident, bouncy delivery and a clear plan: attack Tapped24&apos;s image, parenting, relationship, money, platform loyalty, and appearance. His strongest later work built fuller angles around Georgie, Tapped&apos;s children, clothes, finances, footwear, and Pen Game history.</p>
                      <p>His biggest strength was turning Tapped&apos;s real-life image into a connected case. Clothes, freebies, CSA debt, work, tube travel, and image investment supported the money angle, while Georgie became the emotional centre of the relationship narrative.</p>
                      <p>The weakness was control. Reloads, interruptions, props, crowd noise, and tension disrupted the structure. Grams looked most dangerous when the writing stayed focused rather than being pulled into the room&apos;s chaos.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Tapped24 responded like someone defending his GZone position. He targeted Grams&apos; Pen Game history, age, family structure, relationship, mother, platform loyalty, and allegations, repeatedly framing him as a rejected outsider.</p>
                      <p>Escalation was his strongest weapon. Each round became more personal, culminating in a Pen Game versus GZone platform war that gave the performance a larger narrative than individual insults.</p>
                      <p>Tapped produced the bigger shock moments and appeared to take the room with the final round. The guest judge awarded him the battle, and the heated closing reaction supported the official result.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'deluxx-vs-btizz' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deluxx</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Deluxx entered looking to rebuild momentum after his earlier GZone appearances. His performance was direct and aggressive, with a clear aim of proving he still belonged on the platform.</p>
                      <p>His cleanest angle argued that BTizz was less original and established than he appeared, especially when Deluxx suggested he was borrowing energy from Tapped24 rather than developing a complete identity of his own.</p>
                      <p>The strongest material focused on pen work, comeback energy, and performance status. Battle scar, Lion King, killing with the pen, and crossing bars on the spot were the clearest moments, but uneven structure limited the overall impact.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">BTizz</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>BTizz looked more comfortable and controlled the room more effectively. His timing, crowd reaction, and live confidence were stronger throughout the battle.</p>
                      <p>His central argument was that Deluxx&apos;s public image did not add up. He challenged Deluxx&apos;s authenticity, style, and identity while reinforcing his own branding through the name-spelling moments and 0121 king-of-the-mic claim.</p>
                      <p>The London Mikez ghostwriting shot directly attacked Deluxx&apos;s pen and gave BTizz a sharper battle-specific angle. By the end, BTizz had the clearer narrative and took the commentary-table decision 2-1.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === '2mwad-vs-ryno' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Ryno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Ryno opened confidently and addressed the whole room before focusing on 2Mad. His aggressive style positioned him as ready for anyone on GZone, not only the opponent in front of him.</p>
                      <p>His strongest angle made 2Mad look more like a social-media personality than a serious battler. Dancing, camera energy, clips, sound effects, and performance habits became evidence that 2Mad chased reactions rather than controlled clashes.</p>
                      <p>Jigglypuff, Pen Zeppelin and Stairway to Heaven, and the pawn and checkmate sequence gave Ryno cleaner writing moments. The weakness was that the heated, messy atmosphere sometimes pulled focus away from those bars.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">2Mad</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>2Mad built the sharper and more damaging performance narrative. Housing, money, hygiene, work, bailiffs, sleeping arrangements, and living conditions were used to make Ryno look unstable and exposed outside the ring.</p>
                      <p>His strongest writing used specific visual images: a sleeping bag by the pond, begging by the bank, stains, KFC spare change, and furniture taken by bailiffs. Those grounded details made the attacks easy for the room to follow.</p>
                      <p>2Mad also showed stronger crowd command than expected. The homelessness and political-image angles drove the battle story, and the final room reaction appeared to favour him.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'tapped24-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Roman approached the battle like a street clash, relying on aggression, intimidation, and conviction. He attacked every part of Tapped24&apos;s life and made even simple threats feel heavier through presence.</p>
                      <p>His strongest angle portrayed Tapped as vulnerable behind the jokes and personality. Roman repeatedly challenged his image and pushed into personal territory that gave the rounds a genuine sense of danger.</p>
                      <p>Roman&apos;s aggression, pressure, and conviction gave him the stronger overall performance and carried him to the official win.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Tapped24 delivered one of his strongest performances of the season, combining jokes, personal angles, wordplay, crowd interaction, and direct rebuttals.</p>
                      <p>His greatest strength was turning almost anything into a punchline. Family, appearance, relationships, wrestling, football, fantasy, gaming, and local-scene references blended naturally into the attack.</p>
                      <p>Tapped also controlled the room more effectively. Humour and well-timed reaction bars repeatedly shifted momentum back toward him, and the crowd clearly connected with his style.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'cj-zino-vs-1flaymr' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    CJ-Zino and 1Flaymr delivered a clash built around two sharply different identities. 1Flaymr brought Jamaican-influenced cadence, repeated fire slogans, aggression, and performance energy, while CJ answered with more structured counter-writing aimed directly at dismantling the flame persona.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    1Flaymr&apos;s strongest moments came through character and delivery. Fire, smoke, burning, and gunshot imagery gave his rounds a consistent sound and made phrases such as everything burn function as crowd hooks. CJ&apos;s clearest material challenged the old Friction name, the mask, online toughness, and the claim that the flame could not be extinguished.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle&apos;s strongest technical sequence came from CJ&apos;s Hunger Games scheme, connecting Katniss, Mockingjay, Snow, fire, and the arena. In contrast, 1Flaymr relied on force, repetition, and a distinctive persona to keep the room engaged even when individual punches were less clearly structured.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The crowd call in the available footage is unclear, but the official battle record awards the win to 1Flaymr. The clash remains a clear contrast between stronger performance identity and cleaner direct counter-writing.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'cj-zino-vs-1flaymr' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">1Flaymr</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>1Flaymr arrived with a fully branded performance built around fire, smoke, burning, gunshot-style delivery, Jamaican cadence, and high-energy repetition. His identity was clear from the opening: the flame could not be extinguished.</p>
                      <p>Character was his greatest strength. Patois-style delivery, repeated slogans, and fire imagery gave him a sound unlike the rest of the roster and turned phrases such as everything burn into crowd hooks.</p>
                      <p>The weakness was clarity. Some sections became repetitive or difficult to catch through the delivery and mic levels. His strongest moments simplified the concept and let the persona carry it.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ-Zino</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>CJ-Zino brought the more structured battle writing and attacked 1Flaymr&apos;s entire fire identity directly. His central argument was that the flame had already been fully extinguished and he was there to finish the job.</p>
                      <p>The Hunger Games, Katniss, Mockingjay, and Snow sequence gave CJ the cleanest technical section. He also challenged the old Friction name, mask image, authenticity, delivery, and online toughness.</p>
                      <p>Direct counter-writing was his biggest strength. Rather than trying to out-shout 1Flaymr, CJ repeatedly returned to the idea that fire branding means little if the opponent can put it out.</p>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {battle.slug === 'nattyebk-vs-zk' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">NattyEBK returned for his second GZone battle against debutant Z.K from Grimsby. The clash created a clear contrast between Natty&apos;s aggression, disrespect, shock value, and direct attacks and Z.K&apos;s more controlled, researched, and structured writing.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Natty produced the more explosive moments and grew stronger as the battle progressed. Z.K kept his material clearer and used references around image, finances, music, hygiene, social media, and Grimsby pride to make the contest competitive.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">The result was decided by crowd reaction rather than a formal panel. Z.K&apos;s cleaner second round kept the battle close, but Natty&apos;s room control and stronger third round secured the crowd decision.</p>
                  </div>

                  <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
                    <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-6">Evidence: Props Used</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {battle.props?.map((prop) => (
                        <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                            <span className="text-2xl">{prop.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold">{prop.name}</p>
                            <p className="text-zinc-400 text-xs">Used by {prop.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Performance Analysis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">NattyEBK</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Natty performed with aggression and confidence from the start, framing Z.K as an opponent he had been assigned to eliminate. His first round attacked Z.K&apos;s name, travel, money, teeth, religion, and image while using the previous Prince battle to establish momentum.</p>
                        <p>The second round introduced social-media research and darker family material. His third was the strongest performance round, combining the twins angle, EBK identity, accusations presented as battle material, and faster flow pockets that earned larger reactions.</p>
                        <p>Impact and room control were Natty&apos;s main strengths. Some material was extremely harsh and loosely structured, but his presence and stronger finish carried the crowd.</p>
                      </div>
                    </article>
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">Z.K</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Z.K delivered a strong, controlled debut built around direct research. He attacked Natty&apos;s image, haircut, girlfriend, finances, music, home life, and name through references including BBK, CCJs, Mickey Mouse, Dimzy, and Grimsby.</p>
                        <p>His second round was his strongest, using cultural, football, gaming, and grime references to build connected themes. The third continued the image and hygiene pressure with varied pop-culture and technology references.</p>
                        <p>Structure and clarity were Z.K&apos;s strengths. His writing was often easier to follow, but it did not create the same room-shaking impact as Natty&apos;s closing round.</p>
                      </div>
                    </article>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Notable Bars
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    {[
                      ["NattyEBK", [
                        ["Ginger J is irritating, gave me Z.K to eliminate him.", "Natty frames the matchup as an assignment and immediately places Z.K beneath him."],
                        ["What I done to Prince, man's doing to you.", "His previous GZone win becomes evidence that Z.K is the next opponent in a continuing run."],
                        ["Z.K, you need to go get a car, 'cause I heard that you came here bumping train.", "A simple travel and money angle used to question whether Z.K carries himself like a serious opponent."],
                        ["Z.K, why is your name Z.K? When have you ever swung that blade?", "Natty challenges the authenticity of Z.K's stage name and the dangerous image it suggests."],
                        ["If you scrape your teeth with your finger, all that we see is plaque.", "A direct visual hygiene punch that supports Natty's wider appearance attack."],
                        ["You're like a dog on the Fourth of July, tucking your tail when things go boom.", "Fireworks imagery presents Z.K as someone who panics when pressure becomes real."],
                        ["You got twins, so do I, but our twins ain't alike.", "A dark third-round flip turns family language into threat imagery."],
                        ["I got all the G's up on my side, but none of us might even like this guy.", "Natty uses crowd-control writing to isolate Z.K and claim the GZone room as his territory."]
                      ]],
                      ["Z.K", [
                        ["You think I come to GZone to lose? You must be confused.", "Z.K opens his debut by rejecting the idea that he has arrived as an easy opponent."],
                        ["Got a haircut like Mickey Mouse.", "An instantly recognisable visual comparison makes Natty's appearance look cartoonish."],
                        ["Not EBK, you're not levels like BBK.", "The Boy Better Know reference questions the level and credibility of Natty's EBK identity."],
                        ["Kicked out his house for his CCJs after CCJs.", "County Court Judgments sharpen Z.K's wider angle about Natty's finances and stability."],
                        ["Turkey dinosaurs and chips, because you don't know about peas and rice.", "A cultural food comparison questions the authenticity of the image Natty presents."],
                        ["I believe in Ginger Jesus, but after the clash you'll be needing Christ.", "A local GZone reference becomes a religious punch about Natty needing rescue after the battle."],
                        ["I typed his name on YouTube. What did I see? This lemon was playing on Tekken.", "Z.K uses Natty's online content to contrast gaming with the dangerous image he presents."],
                        ["I grew up listening to Wiley, you grew up listening to them.", "Z.K invokes a foundational grime figure to claim deeper musical roots and credibility."],
                        ["Saturday night, your girl's looking like Cher Lloyd, Sunday morning, Sirius Black.", "A pop-culture comparison creates one of Z.K's clearest comic appearance punches."],
                        ["You still send porn over Bluetooth.", "An outdated technology reference makes Natty appear immature and behind the times."]
                      ]]
                    ].map(([name, bars]) => (
                      <article key={name as string} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-display uppercase text-brand mb-6">{name as string}</h3>
                        <div className="space-y-4">
                          {(bars as string[][]).map(([quote, explanation]) => (
                            <div key={quote} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                              <blockquote className="text-white font-bold leading-relaxed mb-3">
                                &ldquo;{quote}&rdquo;
                              </blockquote>
                              <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {battle.slug !== 'deeno-vs-tapped24' && battle.slug !== 'nattyebk-vs-zk' && (
              <>
                {battle.slug !== 'nattyebk-vs-zk' && battle.slug !== 'cj-zino-vs-1flaymr' && battle.slug !== 'tapped24-vs-roman' && battle.slug !== 'tapped24-vs-ajna' && battle.slug !== 'tapped24-vs-grams' && battle.slug !== 'ryno-vs-tymeless' && battle.slug !== 'pr1nc3-vs-nattyebk' && battle.slug !== 'btizz-vs-cj-zino' && battle.slug !== 'btizz-vs-1flaymr' && battle.slug !== 'cj-zino-vs-proty' && battle.slug !== 'renzo-vs-proty' && battle.slug !== 'ryno-vs-roman' && battle.slug !== 'deluxx-vs-btizz' && battle.slug !== '2mwad-vs-ryno' && battle.slug !== 'deeno-vs-grams' && battle.slug !== 'deeno-vs-badee-harz' && battle.slug !== 'pr1nc3-vs-roman' && battle.slug !== 'ldn-mikez-vs-deluxx' && battle.slug !== 'ldn-mikez-vs-2mwad' && (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Performance Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(battle.slug === 'deeno-vs-tymeless' ? [
                        ["Deeno", "Deeno entered as the GZone regular with the bigger home-platform presence. He immediately framed the clash as a test of whether TymeLess belonged at the centre of the platform, attacking his age, image, battle history, and public persona.|His most effective writing was tailored. The repeated time flips gave the rounds a clear route, while the no-replay, no-reverse, William and Thriller ideas connected the opponent's identity directly to the punches. GTA, Big Smoke, CJ, Michael Jackson, The Simpsons, and Smithers added recognisable reference points.|Deeno's delivery stayed forceful even when the room became noisy. He performed like someone defending home territory, widened individual bars into GZone status claims, and kept enough authority to make every round competitive.|The weakness was selection. Some heavier personal material pulled attention away from the cleaner name flips and character writing. At his best, Deeno was concise, specific, and confident; when he overextended an angle, TymeLess had room to turn it into comedy."],
                        ["TymeLess", "TymeLess built the stronger complete performance. Rather than treating the clash as a sequence of isolated punches, he created running stories around the venue, Deeno's throne claim, ginger imagery, and the lemon props.|The toilet scheme gave round one an immediate identity. Taking a live situation and extending it through locked toilets, taking the piss, the GZone chair, and throne imagery showed strong angle control and gave the crowd an easy narrative to follow.|His visual writing was the decisive contrast. Keith Lemon, Prince Harry, Paul Scholes, Weasley, Simon Pegg, the Sugar Puff Monster, the leprechaun, and the silver-fox comparison turned Deeno into a recurring comic character. The references were simple, fast, and highly performable.|TymeLess also controlled reaction better. He knew when to pause, repeat, involve Ginger Jay, return to a prop, or let an image sit. That combination of structure, humour, and room awareness gave him the larger moments and ultimately carried the crowd decision."]
                      ] : [[mc1?.name || battle.mc1, ""], [mc2?.name || battle.mc2, ""]]).map(([name, analysis]) => (
                        <article key={name} className="min-h-40 bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
                          {analysis ? <div className="space-y-5 text-zinc-300 leading-relaxed font-light">{analysis.split("|").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div> : <p className="text-zinc-600 text-sm uppercase tracking-widest">Coming soon</p>}
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {battle.slug === 'deeno-vs-badee-harz' && (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Performance Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
                        <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                          <p>Deeno opened with the confidence of someone treating GZone as his own house. He immediately attacked Badee as a newcomer, questioning why she was rapping and framing her as a groupie rather than a serious battler.</p>
                          <p>His performance used body, family, partner, and baby-dad angles alongside platform-status pressure. He repeatedly argued that there were levels between them and positioned himself as the established name.</p>
                          <p>His strongest angle was home-platform authority. The writing was most effective when the personal attacks connected to status, platform history, or name flips; some of the graphic shock material overpowered those cleaner ideas.</p>
                        </div>
                      </article>
                      <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-display uppercase text-brand mb-6">Badee Harz</h3>
                        <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                          <p>Badee entered as the newcomer but did not perform like someone intimidated by the moment. She went directly at Deeno&apos;s image, appearance, record against women, family, jail claims, and platform reputation.</p>
                          <p>Her best strength was directness. She attacked recognisable details and created a clear self-branding moment by calling herself the baddest on GZone, turning the battle into an arrival statement.</p>
                          <p>Her strongest narrative challenged Deeno&apos;s history with female opponents. That made the clash feel bigger than a debut: Badee presented herself as another woman capable of giving him problems in the ring.</p>
                        </div>
                      </article>
                    </div>
                  </section>
                )}

                {battle.slug === 'cj-zino-vs-1flaymr' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "1Flaymr",
                          entries: [
                            ["CJ don't run", "A simple pressure opener telling CJ that he cannot hide, dodge, or escape the clash."],
                            ["1Flaymr, everything burn", "The core slogan of his identity: his presence turns the whole room into fire."],
                            ["Kick like Heung-min Son", "The Tottenham forward's sharp finishing and powerful strike become an impact comparison."],
                            ["Rather spill your blood than spill my rum", "Caribbean drinking imagery is converted into a memorable battle threat that fits his persona."],
                            ["This time me have a full clip", "A weapon metaphor saying he arrived fully loaded with material rather than incomplete rounds."],
                            ["CJ get burn up, Roman get burn up, Ryno get burn up", "The attack expands beyond CJ and presents the flame as a threat to the wider GZone roster."],
                            ["Turn CJ into a DJ, cause Zino head get spin", "DJs spin records, while 1Flaymr says his opponent's head will spin. A clean role and name-based visual."],
                            ["This flame can't get extinguished", "His strongest rebuttal to the recurring fully extinguished narrative: he is still present and battling."],
                            ["Take off the top like a bottle of Guinness", "A recognisable product image turns opening a bottle into a direct threat."],
                            ["CJ full of chat, no action", "A concise character attack arguing that CJ's confidence is stronger online or verbally than in reality."]
                          ]
                        },
                        {
                          mc: "CJ-Zino",
                          entries: [
                            ["Fully extinguished", "CJ immediately attacks the foundation of 1Flaymr's fire persona by declaring that the flame is already out."],
                            ["Real name Friction", "The previous stage name is used to strip away the current rebrand and question its authenticity."],
                            ["Catching fire, I got Katniss Everdeen", "Katniss and the title Catching Fire begin CJ's strongest connected Hunger Games scheme."],
                            ["Mockingjay", "The next Hunger Games reference extends the sequence while also allowing CJ to mock his opponent."],
                            ["Burn out the flame, let Snow just rain", "President Snow and literal cold weather combine to extinguish the fire theme cleanly."],
                            ["We're in the heart of the Hunger Games", "CJ turns the battle ring into the fictional arena, completing the scene around the reference chain."],
                            ["Lay off the trees if you can't see potential", "Trees can mean weed, while clouded judgement explains why 1Flaymr cannot recognise CJ's ability."],
                            ["You took off that bally and everyone's fooled", "The balaclava and mystery image are attacked as visual branding that lost its intimidation once revealed."],
                            ["I don't need to get a flow to get a reload", "CJ claims he can earn a crowd pull-up without depending on a particular flow pattern."],
                            ["You're only bad when you're typing", "A modern credibility punch arguing that 1Flaymr's online toughness does not transfer to the live room."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'tapped24-vs-roman' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Roman",
                          entries: [
                            ["You run in a pack like wolves, but the wool's just soft like dairy", "Roman starts with dangerous pack imagery before undercutting Tapped's crew as soft. The strength comes from the immediate contrast rather than intricate wordplay."],
                            ["You speak for a kid that hardly speaks", "A spokesman angle that makes Tapped look like somebody else's mouthpiece rather than the central figure."],
                            ["I went to war with the toughest of warriors, next to them you look fairy", "Roman elevates his previous opposition and presents Tapped as lightweight by comparison."],
                            ["Your neck can easily snap", "A simple threat whose impact depends almost entirely on Roman's conviction and delivery."],
                            ["I hope your bloodline dies through painful times", "One of the battle's darkest family attacks, showing Roman's willingness to cross into extreme personal territory."],
                            ["I'll personally put you to sleep", "The boxing phrase becomes a direct threat and reinforces Roman's face-to-face intimidation style."],
                            ["King of this game? You're more like a pawn", "A clean chess comparison that reduces Tapped from the board's most valuable piece to its most expendable."],
                            ["Get checkmated and thrown off the board", "Roman extends the chess scheme by presenting the battle as a complete strategic defeat."],
                            ["Why's this Tapped here think he's hard?", "A direct stage-name attack questioning whether Tapped's persona carries any genuine danger."],
                            ["You're out of your depth, you flannel", "A blunt British dismissal arguing that Tapped has entered a contest beyond his ability."]
                          ]
                        },
                        {
                          mc: "Tapped24",
                          entries: [
                            ["Why you give me this Roman prick? When you come against Tapped, better roll man quick", "Tapped immediately bends Roman's name into a command to move aside, establishing the name-flip approach."],
                            ["It's me against Roman Reigns, you can't read man like a Roman script", "WWE and written-language references combine into one of Tapped's strongest layered name schemes."],
                            ["There's no Fergie time round here, but I take your legs, I'm finishing Manny", "Sir Alex Ferguson's famous late-goal period supplies a football frame for a finishing threat."],
                            ["Your girlfriend kinda looks like Dobby", "The Harry Potter house-elf creates an instantly recognisable visual comparison and a straightforward crowd joke."],
                            ["You think he's blessed when he beat up his ex?", "Tapped shifts from comedy into a serious character attack, challenging Roman's reputation rather than his physical toughness."],
                            ["Take his hat off, look at them eggs", "A simple visual roast about Roman's head shape that landed because the room could immediately inspect the comparison."],
                            ["I only just clocked you've got a clash with GZone's best", "A confidence claim presented as a casual observation, allowing Tapped to crown himself without a long setup."],
                            ["I am the GZone, he's the G-string", "Tapped elevates himself into the whole platform while reducing Roman to underwear. The contrast is simple and highly crowd-readable."],
                            ["You're a thirsty dog. Did your girlfriend know how you feel about AJ?", "Outside information becomes a relationship angle that forces Roman's private image into the centre of the clash."],
                            ["I'm a rock, you're a pebble", "A concise size-and-importance comparison presenting Tapped as solid and significant while Roman is disposable."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === '2mwad-vs-ryno' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Ryno",
                          entries: [
                            ["Let me start off by addressing the room", "Ryno speaks beyond 2Mad and announces himself as a threat to the entire platform."],
                            ["Any MC that wants to clash with me on G's, I guarantee they're getting slew", "A GZone-wide warning that frames Ryno as ready for every name in the building."],
                            ["Who the fuck is 2Mad?", "A direct status reduction that questions why the opponent deserves recognition."],
                            ["You prance and dance around like a clown for the camera", "One of Ryno's cleanest angles turns 2Mad's social-media visibility into evidence of unserious performance."],
                            ["Seen your clips, seen your vids, you think you're a funny dude?", "The content-creator angle continues by contrasting online comedy with battle credibility."],
                            ["Truth is, I don't live with my mam", "Ryno directly rebuts the housing and living-situation angle before 2Mad can fully establish it."],
                            ["I'm your stepdad here, now sonning you", "Family language becomes a dominance claim in which Ryno treats 2Mad as an inferior child."],
                            ["Jigglypuff", "The singing Pokémon supplies a recognisable sound and cartoon reference inside a voice-based setup."],
                            ["I'm letting off bombs like a mortar", "A straightforward war metaphor presenting Ryno's bars as explosive heavy-impact shots."],
                            ["Go back to Tapped, that's one more boss for you", "Tapped24 is used to place 2Mad lower in the GZone hierarchy."],
                            ["Main objective: break down you", "A mission-style round opener gives the verse a clear purpose of dismantling 2Mad."],
                            ["I hate the sound effects that you do, so stop doing them, you nerd", "A direct live-performance critique attacking one of 2Mad's recognisable habits."],
                            ["Pen Zeppelin, lead gets him, and he'll rock and roll on the stairways to heaven", "Ryno's strongest technical scheme connects pen, lead, Led Zeppelin, rock and roll, and Stairway to Heaven."],
                            ["Your raps ain't shelling", "A craft attack saying 2Mad's performance is not landing or shutting down the room."],
                            ["Your bank's in debit, you don't own bedding", "Money and housing instability are compressed into one grounded insult."],
                            ["Roadman Jackson 5", "The famous family group becomes a funny image for a cheap, coordinated street crew."],
                            ["King of this game? You're more like a pawn", "Chess hierarchy makes 2Mad expendable rather than powerful."],
                            ["Get checkmated and thrown off the board", "The chess scheme continues to a clear strategic defeat."],
                            ["You look like Katt Williams on a helicopter", "A strange but memorable comedian-based visual comparison."],
                            ["I'm a guru", "A concise self-status line claiming greater knowledge and mastery."],
                            ["Be good to yourself for having a go", "A patronising closer treating 2Mad as someone who tried but was never a real threat."]
                          ]
                        },
                        {
                          mc: "2Mad",
                          entries: [
                            ["This battle rapper is currently homeless", "2Mad opens with the housing angle that becomes the foundation of his whole performance."],
                            ["At the end of the night, you might catch this guy in a sleeping bag right next to the pond", "A vivid outdoor-sleeping image turns the general housing claim into a memorable visual."],
                            ["He begs for change by the bank", "The location creates irony: money is inside the bank while Ryno stands outside asking for it."],
                            ["Came to the clash with stains on his pants", "A visible hygiene and status insult making Ryno look unprepared and unclean."],
                            ["Your DNA's made of coke and beer", "Substance use is exaggerated into something fundamental to Ryno's identity."],
                            ["Go apply for a job", "Blunt real-life advice makes Ryno look unemployed and directionless."],
                            ["Ruff, ruff, you look rough", "Dog-bark sound play turns rough appearance into a quick crowd-readable punch."],
                            ["Your furniture gets took by the bailiff", "Debt and financial instability become a strong grounded image of possessions being removed."],
                            ["You're a sheep, no leader", "Ryno's dominant self-image is challenged by presenting him as a follower."],
                            ["You're not someone to rely on", "A character attack questioning Ryno's dependability outside battle performance."],
                            ["It's the GZone traveller, 3-0 massacre", "2Mad brands himself as the visiting battler who believes he has taken every round."],
                            ["Ryno with a shotgun, I leave no passenger", "A battle-violence line tied directly to Ryno's name and the idea of no survivors."],
                            ["When you go bananas, things get pear-shaped", "Two familiar fruit idioms connect losing control with a situation going badly wrong."],
                            ["KFC begging for spare change", "A specific public location extends the homelessness and money narrative."],
                            ["Run your pockets", "A robbery and status line portraying Ryno as someone who can be pressured."],
                            ["I rap for a fee, I'm not gonna get a freelance", "2Mad presents himself as a paid professional rather than someone performing without value."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'deluxx-vs-btizz' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Deluxx",
                          entries: [
                            ["I made my mark and leave him with a battle scar", "Made my mark and battle scar frame Deluxx's impact as something lasting beyond the night."],
                            ["No Simba, I'm the Lion King", "The familiar Disney reference claims the top role rather than that of a young challenger."],
                            ["I'm the devil in disguise", "Dark persona imagery presents Deluxx as dangerous and unpredictable."],
                            ["You're his Barbie, he's your Ken", "Barbie and Ken imagery questions BTizz's independence by making him secondary or controlled."],
                            ["I lost the battle to a vet, there's no way you're getting rid of me", "Deluxx admits a previous loss but reframes it as useful experience rather than an ending."],
                            ["I can kill him with a pen", "A clean writing-focused claim that the pen alone is enough to defeat BTizz."],
                            ["I cross bars on the spot", "The line focuses on quick MC skill, sharp delivery, and the ability to create impact in the moment."],
                            ["Trying to tap, but he can't even match it", "Deluxx's strongest tailored angle accuses BTizz of copying Tapped24 without reaching the original level."],
                            ["Dragon Ball Z", "Anime fighting imagery gives the attack a recognisable powered-up combat visual."]
                          ]
                        },
                        {
                          mc: "BTizz",
                          entries: [
                            ["When I shut down, something like Skepta", "Skepta's famous grime track supplies a strong UK-music reference for taking control of the room."],
                            ["How you gonna say you're Jamaican? Faking", "BTizz's main authenticity angle argues that Deluxx's public identity is performed rather than genuine."],
                            ["Looking like Imran Khan", "A public-figure appearance comparison used to undercut Deluxx's chosen presentation."],
                            ["You can't run any Asian jokes", "BTizz blocks a potential angle in advance and turns the expected criticism back onto Deluxx."],
                            ["Why did you sign this?", "Addressing the platform directly makes Deluxx sound like a poor booking rather than a dangerous opponent."],
                            ["You're not Jamaican or Asian", "The clearest version of the identity critique presents Deluxx's image as inconsistent and unconvincing."],
                            ["Left to the right, and you got the ring shaking", "Deluxx's live movement is turned into an immediate physical roast that the room can visualise."],
                            ["B to the I to the Z-Z", "A repeated identity stamp that helps BTizz control the crowd and keep his name memorable."],
                            ["This is clash, not slaughter", "BTizz frames the contest as so one-sided that it no longer resembles a fair battle."],
                            ["Please go get your water", "A visible stamina and composure attack suggesting Deluxx is struggling to keep pace."],
                            ["0121, king of the mic", "Birmingham's area code connects local pride with BTizz's claim to microphone dominance."],
                            ["Your bars were written by London Mikez", "One of the strongest battle-specific shots because it directly questions Deluxx's authorship and pen."],
                            ["I spit bars, they say that I'm odd", "BTizz turns being unusual into a positive claim of individuality and memorability."],
                            ["If you're from yard, say wah gwaan", "A cultural credibility check testing whether Deluxx's claimed image can withstand direct scrutiny."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'tapped24-vs-grams' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Grams",
                          entries: [
                            ["You're not Tapped, you're saying 24", "A direct stage-name flip arguing that the dangerous Tapped persona is only a number and not a reality."],
                            ["I put him in a headlock, his pen game's desktop", "Physical dominance is mixed with a critique that Tapped's writing is static, basic, or better suited to a computer than a live room."],
                            ["You can't even do ten press-ups", "A simple physical-readiness attack questioning whether Tapped can support his aggressive persona."],
                            ["You bring your girl every battle, she's fed up", "Georgie's visible presence begins a running relationship angle in which the room itself becomes evidence."],
                            ["Crap babies crack under pressure", "A dark family and parenting punch suggesting instability beneath Tapped's tough image."],
                            ["Tapped, you are not tapped in", "Tapped in means connected or active, so Grams uses the phrase to undermine his status and identity."],
                            ["If it ain't sickle cell, then I'm intrigued", "Medical-condition disrespect used to make Tapped look depleted or unhealthy."],
                            ["You don't really see your kids, you desert them", "The central fatherhood attack claims Tapped is not sufficiently present for his children."],
                            ["Raise my cats into queens", "Grams turns care for his pets into a responsibility flex against Tapped's parenting."],
                            ["You and your girl Georgie got nits", "A combined hygiene and relationship insult presenting the couple as dirty and low-status."],
                            ["Get your white girlfriend, I'm a black Will Smith, I'm Hitch", "Will Smith's dating-consultant character becomes a relationship flex aimed at Georgie."],
                            ["You got free use, now that's awesome, but we ain't seen any pics", "A social-media-era parenting angle questioning the visible evidence of active fatherhood."],
                            ["Repeat offender, you better thank the Jobcentre", "Benefits and unemployment language connect Tapped's family responsibilities to state support."],
                            ["You're not Tapped no more, that's Tiny T", "A replacement nickname shrinks the persona and makes Tapped sound childish and less threatening."],
                            ["How you use freebies for a drip check?", "Promotional clothing is contrasted with real fashion investment to attack Tapped's creator image."],
                            ["Jay needs to have a chat with you about image", "GZone management is brought into the insult, implying that Tapped is poor branding for the platform."],
                            ["How you gonna get addressed and you can't even dress?", "Addressed and dress create clean wordplay that neatly closes the clothing angle."],
                            ["Fuck music, you're more Zac Efron", "The High School Musical actor is used to frame Tapped as a performer or actor rather than a credible musician."],
                            ["Georgie, stop wasting time with this plum", "Grams speaks directly to Georgie to embarrass Tapped and pull his relationship into the performance."],
                            ["He ain't the kind of white boy copping that mortgage", "Property ownership becomes a grounded test of financial stability and adult status."],
                            ["Look at what Tapped is doing to you", "The repeated line forms the emotional core of Grams' relationship narrative around Georgie."],
                            ["Might rap fast, but you speak no truth", "A clean craft attack conceding Tapped's speed while dismissing the honesty of his content."],
                            ["Last time you got harassed by AJ", "A previous GZone result is used to present a pattern of Tapped struggling against women and relationship angles."]
                          ]
                        },
                        {
                          mc: "Tapped24",
                          entries: [
                            ["Didn't you fuck up your Pen Game legacy?", "Tapped opens by claiming Grams already damaged his own reputation on another platform."],
                            ["Death after death... now you're going back to the cemetery", "Repeated battle losses become burial imagery that frames Grams as already finished."],
                            ["You are not me or Deeno", "Tapped places himself and Deeno above Grams inside the GZone hierarchy."],
                            ["Stop blaming all of the engineers", "A battle-meta angle dismissing sound-engineer excuses for performances that fail to land."],
                            ["You got no wife and no kids", "Tapped uses Grams' age and family structure to make him look stalled in life."],
                            ["No guap, no bands, no job, no fam", "A stacked list overwhelms Grams with alleged absences in money, employment, family, and status."],
                            ["How you living like this when you're older than man?", "The cleanest age-and-status comparison says Grams is older but has less to show for it."],
                            ["You got shook on the Birmingham youths", "Tapped attacks Grams' courage by claiming younger Birmingham battlers intimidated him."],
                            ["I'm not Lion King... your mum looks like Rafiki", "The Lion King character becomes a harsh but recognisable appearance insult aimed at Grams' mother."],
                            ["John Cena, you can't see me", "The wrestler's famous catchphrase becomes a major performance and surprise-attack moment."],
                            ["Levels above, you can't reach me", "A direct status punch placing Grams beneath Tapped on the platform."],
                            ["GZone made me lose to a fat bitch, but we know Tapped didn't actually lose", "Tapped attempts to rewrite the narrative of his loss to AJ before Grams can fully weaponise it."],
                            ["I don't like those cats... fry those cats", "Grams' pets become a strange but memorable recurring personal attack."],
                            ["Call me Darren the dentist, I'll knock your teeth out", "A dentist's connection to teeth supplies a direct, ring-friendly threat."],
                            ["Your gaff is covered in rats all because of them cats", "The pet and home angles combine into a vivid image of a dirty, ineffective household."],
                            ["Keep trying to move to Badee Harz", "Badee is brought into a wider GZone relationship and scene-drama angle."],
                            ["You lost to everybody on Pen Game facts", "Grams' old record is used as evidence that he should not enter GZone acting superior."],
                            ["Pen Game reject, don't come to G's", "The central platform attack presents Grams as an outsider seeking relevance after rejection elsewhere."],
                            ["Fuck Pen Game", "The final's largest narrative moment turns the battle into a direct statement of GZone loyalty."],
                            ["Pen Game kind of falling off like Tottenham", "Tottenham Hotspur becomes a football comparison for decline and underachievement."],
                            ["How are you in both group chats? You little snake", "Membership in both platform chats is framed as divided loyalty and sneaky scene politics."],
                            ["Screenshot and underage-photo allegation", "Tapped uses alleged screenshots as evidence-style character ammunition; the claim is presented as an allegation, not verified fact."],
                            ["Everyone here start hiding your sister", "A warning-style line designed to portray Grams as unsafe around women or girls."],
                            ["Your whole life she was your anchor", "The anchor metaphor makes Grams' mother a source of lifelong stability before the angle turns darker."],
                            ["Chemo... thanks for exposing her", "Illness-based family disrespect aimed at Grams' mother's cancer treatment and hair loss."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'ryno-vs-roman' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Roman",
                          entries: [
                            ["Your tendencies to force yourself on people go unnoticed, but I clocked it", "A serious character accusation that establishes Roman's morally focused attack from the opening."],
                            ["You get hands on, put them hands back in your pockets", "Hands on is turned into a direct warning to keep his hands to himself."],
                            ["You sausage-looking Wotsit", "Orange snack imagery makes Ryno look soft, strange, and cartoonish."],
                            ["Homeless rhinos hate the sun, they put mud on them to block it", "A real rhino behaviour fact is linked to Ryno's name and Roman's recurring housing angle."],
                            ["Rhinos tend to walk alone, but Romans always turn up squadded", "Both identities are flipped at once: the solitary rhino against an organised Roman force."],
                            ["This clash is over. Take your pen and pad, you joker", "Roman dismisses Ryno like a teacher ending a student's lesson while keeping the focus on writing."],
                            ["We should call him Heady One, caught he sleeps on Marge's sofa", "A UK-rap reference supports the sofa-surfing and unstable-housing narrative."],
                            ["I upgraded my revolver", "Weapon imagery doubles as a claim that Roman has improved his ammunition and writing."],
                            ["He plays doctors with his victims", "A dark allegation-style character attack rather than casual wordplay."],
                            ["You just got your keys to a brown shed", "Roman minimises Ryno's housing progress by reducing the claimed home to a cheap shed."],
                            ["You should stay at the Keepers in Leicester, you ain't housed yet", "A specific place reference gives the repeated homelessness angle a researched feel."],
                            ["Watch Roman relegate him", "Football relegation imagery says Roman is dropping Ryno to a lower competitive level."],
                            ["Fuck Ryan Winfield, I'll put him on a windshield", "Ryno's real surname is flipped into windshield for a clear impact image."],
                            ["Your dad's dead, cop out", "Deceased-family shock material intended for emotional damage rather than technical writing."],
                            ["You're a grown man living on the road now", "Roman returns to housing instability as one of the battle's central narratives."],
                            ["I heard you force youngers to try your vape", "A serious youth and vape allegation used as character pressure, not a verified claim."],
                            ["You laid on a leash in a hotel room", "An allegation-style exposure bar designed to damage Ryno's image."],
                            ["All these man try catching a case", "A meta-line commenting on how accusation-heavy the battle has become."],
                            ["Zero risk. Zero gain. One million views, where's your fame?", "Roman questions why viral attention did not become real career progress or platform value."],
                            ["Where's your bookings? Where's your stage?", "Views are contrasted with actual demand, bookings, and performance opportunities."],
                            ["You do not attempt like David Blaine", "The magician's risky endurance stunts become a warning not to attempt a challenge Ryno cannot survive."],
                            ["Your face is ageing, it's flaking, mate", "A visual appearance attack following the broader status and career pressure."],
                            ["Your ego is 5'3", "Ryno's projected confidence is reduced to a deliberately small measurement."],
                            ["Slap on the wrist like a timepiece", "A watch sits on the wrist, while a slap on the wrist means receiving only light punishment."],
                            ["Show me your keys if you've really got a house", "A grounded challenge asking for visual proof against the recurring housing claims."],
                            ["Where's your sunflower lanyard?", "A disability-coded insult referencing the UK's hidden-disability sunflower scheme."],
                            ["Cross lines like a hashtag", "Hashtag lines create a modern visual for crossing boundaries, written lines, and other line-based meanings."],
                            ["Your ex-girl is SDL, but she looks like an STD", "An acronym is crudely flipped into a disease insult aimed at Ryno's relationship."],
                            ["He only loves English teams / English tea", "Football and tea become evidence inside Roman's closing nationalism and racism angle."]
                          ]
                        },
                        {
                          mc: "Ryno",
                          entries: [
                            ["You think he's blessed when he killed off his ex", "Ryno opens with a heavy accusation-style angle around Roman's deceased former partner."],
                            ["Where's your new girl? She's next for death", "Death-related partner disrespect designed to shock and destabilise Roman."],
                            ["I know you got AIDS on your breath", "A crude disease and hygiene insult aimed at Roman's image."],
                            ["You smell like you piss in the bed", "A hygiene and humiliation bar making Roman sound childish and dirty."],
                            ["Gold links Deeno just so you can buy bras for your breasts", "Body-shaming and dependency are combined in an attack on Roman's size and status."],
                            ["R to the O, M-M-A to the N", "Spelling Roman's name gives the round a rhythmic, chant-like performance device."],
                            ["Body with bars", "A concise claim that Ryno lyrically bodies opponents rather than merely insulting them."],
                            ["I write bars and you write bars, but my bars rip you apart", "A cleaner craft comparison arguing that Ryno's writing carries greater destructive impact."],
                            ["Your kids are locked in the back of your car", "A serious parenting and neglect attack, not a verified factual claim."],
                            ["Why your kids have broken hearts?", "The family angle portrays Roman as emotionally damaging to his children."],
                            ["Change your name, don't change the blame", "Roman may alter branding or identity, but Ryno says responsibility remains."],
                            ["It's the drinking that tore her apart", "Ryno links Roman's alleged drinking to relationship damage and tragedy."],
                            ["Dead that. Rapist bars. Better dead that", "A rebuttal telling Roman to stop the allegation package driving his rounds."],
                            ["Homeless not anymore", "Ryno directly rejects Roman's repeated housing angle as outdated."],
                            ["Why is your hat at half past six?", "Clock-hand imagery makes Roman's crooked hat into a lighter visual roast."],
                            ["The truth is, I didn't go from this to that", "A direct rebuttal denying Roman's visual or status downgrade comparison."],
                            ["Smoking Roman like roaches", "A roach is the end of a spliff, turning the opponent into something smoked down completely."],
                            ["Focused on Roman like a no-scope", "Gaming terminology suggests Ryno can hit Roman quickly without needing a scoped setup."],
                            ["With precision, I bin him", "Controlled accuracy is connected to disposing of Roman like rubbish."],
                            ["You're not marking, you're slurping and burning your words", "A performance critique accusing Roman of stumbling and failing to articulate clearly."],
                            ["This verse is worse than third-degree burns", "Severe burn imagery becomes a scale for the damage caused by Ryno's verse."],
                            ["I should have been clashing with Deens", "Ryno presents Roman as a lower-value opponent than the matchup he believes he deserves."],
                            ["There's more deceased on your family tree", "Grief-based family disrespect continuing the battle's extremely dark direction."],
                            ["Who's this boring, awkward-talking, falcon-warring prick?", "A clustered opener attacking Roman's delivery and presenting him as strange and stiff."],
                            ["If I draw him, it'll floor him", "Draw can mean pulling a weapon, with floor him supplying the physical payoff."],
                            ["All of your kids wear Umbro", "A distinctly British clothing-status insult aimed through Roman's family."],
                            ["I'm not gay, rapist, homeless, you faked this", "Ryno directly rejects the central accusation package used throughout Roman's rounds."],
                            ["Lines through ROM like I'm paving roads", "ROM from Roman's name is crossed with road-marking lines for a cleaner name punch."],
                            ["Maximus Decimus Meridius", "The Gladiator character supplies a Roman Empire reference tailored to Roman's name."],
                            ["Looking like Sid at a toy store", "Toy Story's destructive child becomes a creepy visual comparison for Roman."],
                            ["I hope that your mum gets cancer", "Pure illness-based family shock material rather than technical writing."],
                            ["You ain't been artist, bro, you're not out on the roads", "A closing identity attack claiming Roman lacks credibility as both an artist and street figure."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'renzo-vs-proty' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Renzo",
                          entries: [
                            ["You don't wanna start with a man like me", "An intimidation opener designed to make Proty sound outmatched before the round develops."],
                            ["You look like a BTEC Passive", "BTEC means a cheaper or lower-level version, so Proty is framed as a budget copy of Passive."],
                            ["I'm the better MC", "Renzo keeps the clash focused on energy, rhythm, and delivery as measures of MC ability."],
                            ["3-0 straight like a Trident", "A Trident has three points, creating a clean visual for winning all three rounds."],
                            ["Acting bison", "Bison imagery suggests a heavy, forceful charge that matches Renzo's physical delivery."],
                            ["Got robbed for a vape and a Croc", "A street-status humiliation angle claiming Proty lost small, embarrassing possessions."],
                            ["Same old rhymes, same old grime, same old pain", "Repetition is used to portray Proty's writing and style as stale and unchanged."],
                            ["You think you're good cause you rap on the TikTok ting", "An online-versus-live credibility angle suggesting TikTok visibility does not equal ring ability."],
                            ["Up, down, left, right, square, triangle", "Controller-button language turns Renzo's movements and attacks into a recognisable cheat-code combo."],
                            ["Renzo, where the gal get friendzone", "His cleanest self-branding line flips Renzo into friendzone for a memorable name punch."],
                            ["I came from town, 0121", "The Birmingham area code gives Renzo a clear local identity and regional pride."],
                            ["You look like Stephen Hawking if Stephen Hawking was walking and talking", "An ableist appearance comparison using the famous scientist as disability-based disrespect."],
                            ["You look like a pedo", "An extreme reputation-style character insult rather than a factual claim or technical bar."]
                          ]
                        },
                        {
                          mc: "Proty",
                          entries: [
                            ["This guy blazes dog under haze", "The opener presents Renzo as constantly smoking low-quality or questionable cannabis."],
                            ["What the fuck is UK Cali? / Grown in UK, blood, it's not Cali", "Proty exposes UK Cali as fake premium branding because genuine Cali refers to cannabis from California."],
                            ["Lyrically shuffle like Muhammad Ali", "Muhammad Ali's footwork and rhythm become a metaphor for moving around Renzo in the battle ring."],
                            ["Too sharp like Spike", "A short sharpness punch using a pointed spike as the visual comparison."],
                            ["Orange hair, coming like Tails", "The orange fox from Sonic the Hedgehog supplies a clear appearance comparison."],
                            ["You sound like you're sleeping when you rap / Are you spitting or having a nap?", "A connected performance angle attacking Renzo's delivery as sleepy and flat."],
                            ["Green recycling box, where I bin him", "Recycling and bin imagery presents Renzo as something Proty can throw away."],
                            ["How did you end up with less likes than followers?", "Weak social engagement becomes evidence that Renzo's public support may be inflated or inactive."],
                            ["You went OT, then spent all your profit on sniff", "A real-world money angle claims Renzo wasted out-of-town earnings on cocaine."],
                            ["Like Rizla, man's head get twist", "Twisting rolling paper becomes a threat to twist Renzo's head."],
                            ["Renzo off my checklist", "Renzo is reduced to another routine task rather than a special opponent."],
                            ["You're not Pennywise, but I know you're a clown / You're not wise with a penny", "The It villain's name connects a clown insult to Renzo's alleged poor money management."],
                            ["You won't endure a cell like double A", "A AA battery is a cell, while a prison cell supports the jail-credibility angle."],
                            ["My ash is all white, your ash is dark grey", "Cannabis ash colour becomes a quality and status comparison continuing the UK Cali scheme."],
                            ["I look Chinese when I'm fried like rice", "Fried means intoxicated and connects to fried rice in a rough food-and-appearance line."],
                            ["She does keys up like when you type", "Keys means both keyboard keys and cocaine, creating a concise drug double meaning."],
                            ["TKO", "Technical knockout language frames Proty's performance as stopping Renzo in the ring."],
                            ["Got your shoes on credit, pre-paid clothes", "A financial and image attack claiming Renzo's outfit is low-status and not properly owned."],
                            ["Red Bull / VK / BK", "Cheap drink and fast-food references create a low-budget final image around Renzo's lifestyle."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'cj-zino-vs-proty' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "CJ-Zino",
                          entries: [
                            ["I brought you a dead man walking", "CJ frames Proty as already doomed before the result is made official."],
                            ["One man's done with a verbal warning", "Disciplinary language presents the battle as the consequence following an earlier warning."],
                            ["CJ's landed back to get scorching", "An arrival line using heat imagery to announce that CJ intends to burn Proty down."],
                            ["Fly like a butterfly, sting like a bee", "Muhammad Ali's famous boxing phrase places CJ in fight mode inside the GZone ring."],
                            ["Why is your family still overseas? They've been blocked from Europe", "Immigration and border imagery become a harsh family-based exclusion angle."],
                            ["I'm 44% unleashed", "A power-level line suggesting that even a partially unleashed CJ remains dangerous."],
                            ["Let me get grimey again", "CJ switches into grime mode and uses the genre as a marker of darker, harder credibility."],
                            ["Dad wants smoke... bring him on stage", "Smoke means conflict, and CJ expands the pressure to Proty's father."],
                            ["Dad told you to become a doctor and you're just spreading your germs", "A clean concept contrasting a doctor's duty to treat illness with Proty allegedly spreading it."],
                            ["Look at the state of his clothes", "A visible clothing and status attack the live crowd can assess immediately."],
                            ["You think you won? Must have lost it", "CJ uses controversy around Proty's previous battle to portray him as delusional."],
                            ["That ain't your dad, you're adopted", "A crude family-identity attack intended to disconnect Proty from his background."],
                            ["You ain't welcome here", "CJ makes the clash territorial and presents GZone as a space where Proty does not belong."],
                            ["I've got the bars and you've got the flu", "A simple contrast linking CJ's rap ability to the wider illness and hygiene angle."],
                            ["We know you're a pred. I ain't your prey", "An extreme predator-and-prey character shot that reverses the intended power dynamic."],
                            ["Try to level with the big dogs, not happening", "A status bar saying Proty cannot reach the platform's stronger names."],
                            ["Google Chromecast and then my Roku", "Streaming-device references begin a tech scheme about controlling formats and screens."],
                            ["Fuck your Chromecast, I'm a Fire Stick", "Fire Stick completes the device scheme while fire also means lyrical heat."],
                            ["I bust your Chrome and bust your lip", "Chrome moves from browser or device language into metal and physical-impact imagery."],
                            ["Don't ever try and talk to a champion", "CJ closes the status argument by placing Proty below champion level."],
                            ["Mum is a catfish", "Catfish becomes an appearance and deception insult aimed at Proty's family."],
                            ["CJ never miss", "A concise confidence stamp claiming every shot lands."],
                            ["You beat girls like Renzo", "A serious accusation-style character attack using another scene name; it is not presented as fact."]
                          ]
                        },
                        {
                          mc: "Proty",
                          entries: [
                            ["What's this Disney character trying to be? / Designed by Pixar", "Proty immediately turns CJ's dark image into an exaggerated cartoon appearance."],
                            ["I'm a king, fur on my head like a mane", "A lion's mane supplies self-branding around dominance and status."],
                            ["Whoever designed this prick needs to get fired", "The Pixar concept continues by blaming CJ's supposedly poor visual design on its creator."],
                            ["Your face looks expired", "Expiry-date imagery makes CJ look old, spoiled, or past his best."],
                            ["You snort way too much, you look wired", "A drug-use angle explains CJ's energy as stimulant-driven rather than natural."],
                            ["Trust me, I'm gonna cook like an oven", "Cooking imagery presents Proty's attack as controlled heat and destruction."],
                            ["CJ when he's got Remy in his hat", "Ratatouille's Remy controls Linguini from beneath his hat, making CJ look controlled and cartoonish."],
                            ["His head shape is a Tic Tac", "The small oval sweet becomes an instantly recognisable head-shape comparison."],
                            ["Last event, CJ could hardly walk / hardly talk", "A scene-history angle suggesting CJ was drunk or out of control at the previous event."],
                            ["Same IQ as a brick", "A familiar visual intelligence insult portraying CJ as dense and slow."],
                            ["Rat from Flushed Away doing MDMA", "An animated-rat comparison combines CJ's appearance with the repeated drug-use angle."],
                            ["Quick replay, 3-0, then I watch CJ", "Battle-scoring language lets Proty claim a clear round sweep."],
                            ["When he breathes, the room gets polluted", "A strong hygiene punch exaggerating CJ's breath into environmental damage."],
                            ["His breath's more loud than when I brought the peng in", "Calling smell loud makes the bad-breath angle feel overwhelming and unavoidable."],
                            ["Got no logic like Windows", "A technology joke comparing CJ's reasoning to buggy or frustrating software."],
                            ["Bacteria on his face argues about which one will spread and survive", "Proty's most creative hygiene image personifies bacteria competing across CJ's face."],
                            ["More grimy than grime, but you don't make grime", "CJ's grime identity is flipped into a cleanliness attack rather than musical credibility."],
                            ["Get off the white, stop snorting the lines", "Lines means both cocaine and lyrics, connecting alleged behaviour to CJ's writing."],
                            ["I've got more bars than prison", "A classic double meaning between prison bars and lyrical bars."],
                            ["Looks like Yanko, but this isn't the edition", "The UK drill artist becomes an appearance comparison, with CJ framed as the inferior version."],
                            ["This guy lags, I'm watching him buffer", "Lagging and buffering portray CJ as slow and struggling during the live performance."],
                            ["Linguini with a bit of melanin", "The Ratatouille scheme returns with a tailored comparison to the film's human chef."],
                            ["You ain't got a car, I saw you pedalling", "A transport and status attack that also hints at peddling goods."],
                            ["Ginge, don't shake back his wristband, you'll get viruses", "The event wristband becomes another route for the recurring germs and disease angle."],
                            ["Your bars are all dead, please rewrite", "A clean, direct craft criticism telling CJ that his material is not good enough."],
                            ["You got potential, just work on your pen", "A backhanded mentor line treating CJ as a student rather than an equal."],
                            ["Fix up, look sharp", "Dizzee Rascal's grime classic becomes advice about CJ's image and performance."],
                            ["Walking STD", "A crude closing disease and hygiene insult consistent with Proty's central angle."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'btizz-vs-1flaymr' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "1Flaymr",
                          entries: [
                            ["You can't extinguish forest fires", "The opening identity bar presents 1Flaymr as a blaze too large for BTizz to control."],
                            ["If I was in Avatar, I would be the Fire Nation", "Avatar's Fire Nation supplies instantly recognisable firebending and military-power imagery."],
                            ["I don't need no lighter, I don't need no spray can", "He claims the flame comes naturally from him rather than from tools or props."],
                            ["Tell them, see me, I'm Jamaican", "His Jamaican identity becomes part of the delivery and later gives BTizz a central authenticity angle."],
                            ["You are imitation", "A simple credibility attack presenting BTizz as copied or fake while the newcomer claims originality."],
                            ["Treat him like a pig and fry this pagan like bacon", "Cooking a pig into bacon supplies violence imagery while keeping the writing inside the heat theme."],
                            ["You're ginger in my croff... you can't out my flame", "BTizz's ginger appearance is connected to fire, but 1Flaymr argues that looking fiery cannot match the real flame."],
                            ["My gun lullaby", "A dark contrast between a soothing song and weapon imagery turns violence into a sleep metaphor."],
                            ["Split you in two like the Red Sea, like Moses", "The biblical image of Moses parting the Red Sea becomes one of his clearest visual threats."],
                            ["Lyrically, your body is decomposing", "A battle-damage line claiming BTizz is already decaying under the pressure of the writing."],
                            ["I'm the new landlord... take your eviction notice", "A landlord controls property, so the eviction notice frames 1Flaymr as taking over the room and removing BTizz."],
                            ["If you're the best, then leave one", "A confident newcomer challenge inviting the strongest names on the roster to test him."],
                            ["Slice and dice, lyrically, physically, spiritually, mentally and intellectually", "The repeated list creates rhythm and makes the attack sound total rather than limited to bars."],
                            ["I cover my ugly face, that's why I wear the bally", "A self-aware line that owns the balaclava angle before BTizz can fully control it."],
                            ["My flow hot, make you like snowman", "A simple heat-versus-cold comparison in which BTizz melts under 1Flaymr's performance."],
                            ["I'm the fire bender", "The Avatar concept returns as repeated branding: he presents himself as someone who naturally controls fire."],
                            ["You could have cold like December", "December supplies the cold side of the battle's recurring heat-versus-cold contrast."],
                            ["CJ-Zino or Deeno cannot help you", "Scene names widen the battle and suggest BTizz cannot rely on the wider GZone roster."],
                            ["You don't have a girl, just remember", "A direct relationship and status attack used to limit BTizz's ability to make partner angles."],
                            ["Fuck your mother", "More performance chant than technical bar, using repetition and aggression to drive the room."]
                          ]
                        },
                        {
                          mc: "BTizz",
                          entries: [
                            ["Who's this walking, talking portion of plantain?", "A Caribbean food and appearance joke that immediately answers 1Flaymr's Jamaican branding."],
                            ["You drink piss and live in a dustbin", "A vivid hygiene and lifestyle insult designed to make 1Flaymr look dirty and low-status."],
                            ["Watch man get boxed like Dustin", "A fight image that may reference MMA fighter Dustin Poirier while continuing the dustbin sound pattern."],
                            ["He got bagged with a box of Legos", "The childish Lego image undercuts the newcomer's dangerous persona and makes him look unserious."],
                            ["I know your name was Friction", "Bringing up an older identity makes the current 1Flaymr persona feel like a costume."],
                            ["Fire for that", "A call-and-response device that uses 1Flaymr's own fire theme to hype attacks against him."],
                            ["Bars cold, I'm in the ice zone", "BTizz directly counters the flame persona with cold imagery capable of cooling or extinguishing it."],
                            ["Kill a man on cam like Darren on GTA", "A platform-specific gaming reference connecting the battle to GZone's GTA and roleplay culture."],
                            ["Did you do it when she said no?", "A severe consent-based character attack intended as reputational damage, not a factual claim."],
                            ["B to the I to the Z-Z", "A simple name-spelling chant that reinforces BTizz's identity and room control."],
                            ["Maggi on deck", "The Caribbean and African seasoning reference continues the cultural food scheme."],
                            ["Are you gonna say you're Jamaican? Faking", "One of BTizz's strongest character attacks because it challenges the identity at the foundation of 1Flaymr's performance."],
                            ["Rice and Heinz beans", "A cheap UK food comparison used to mock and diminish the Jamaican presentation."],
                            ["Fix up your hygiene", "A recurring cleanliness angle that is simple, direct, and easy for the room to catch."],
                            ["That's the one that cheated on AJ", "An AJ scene reference turns alleged relationship history into local GZone ammunition."],
                            ["B for the bar, T for the teacher", "An acronym-style name scheme presenting BTizz as both the writer and the person giving the lesson."],
                            ["Gangnam Style", "The viral dance reference turns 1Flaymr's movement into a silly pop-culture visual."],
                            ["Rasta man... Sizzla", "The Jamaican artist reference attacks the opponent's rasta and cultural presentation."],
                            ["Your teeth come black, green, yellow, the flag that he reps", "Jamaican flag colours become a combined hygiene and cultural-image punch."],
                            ["You're a six-foot-six little bitch", "The contradiction makes a physically tall opponent sound small in courage and threat."],
                            ["My Magnum don't have a red lid", "The Jamaican tonic-wine reference is flipped into impact imagery tailored to 1Flaymr's cultural branding."],
                            ["Your mum's milkshake brings the guys to the yard", "Kelis's recognisable lyric becomes a crude mother-based insult."],
                            ["My seed in your mum planting", "A sexual family attack using seed in both its literal and biological meanings."],
                            ["One shot leave you dead on the floor eating cornmeal", "Violence and Caribbean food imagery combine to continue the battle's cultural-reference pattern."],
                            ["Spawn kills", "A gaming term for eliminating a player immediately after they reappear, suggesting the debut ends before it begins."],
                            ["They got me battling Postman Pat", "The children's television comparison makes the masked newcomer look cartoonish rather than dangerous."],
                            ["All of this shit that man says is cap", "BTizz closes by summarising his main argument: the Jamaican, badman, and flame personas are exaggerated or fake."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'deeno-vs-badee-harz' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Deeno",
                          entries: [
                            ["Who let Badee Harz think that she's active?", "An opening status attack questioning whether the newcomer is credible enough to be on the platform."],
                            ["You're 32, but so is your waistline", "A crude but structured number flip that connects age to a body measurement."],
                            ["You could've gave me an extra clash and I would've run with a hat trick", "Deeno presents Badee as an easy fixture and claims he could complete three wins without difficulty."],
                            ["Instead I battled this GZone groupie", "A credibility shot suggesting Badee is around the scene for attention rather than ability."],
                            ["I heard this girl's called Jasmine / One of them kinda looks like Jafar", "Jasmine and Jafar connect through Aladdin, turning her name and a baby-dad angle into a linked Disney scheme."],
                            ["You think you're a GZone star? / We're levels apart", "The clearest summary of Deeno's central argument: Badee may feel important, but he considers the skill and status gap decisive."],
                            ["She must think that I'm AJ", "A wider GZone-history reference comparing Badee's challenge with another woman connected to Deeno's battles."],
                            ["I'll get my sister to step on the stage and swing her by her hair / Doing up Tarzan", "The threat extends into a Tarzan visual, using the familiar swinging image as the pop-culture payoff."],
                            ["You told Marnie that you don't like her", "A scene-specific personal angle that connects Badee to existing tension around the platform."],
                            ["I'm not Epstein, but it's peaking island", "A dark Jeffrey Epstein reference designed for shock and discomfort rather than clean technical writing."],
                            ["This is my home, but still I run this", "One of Deeno's strongest narrative bars, framing GZone as his territory and Badee as the visitor."],
                            ["I'll put you straight inside a blunt", "A conventional smoke bar meaning that Deeno intends to dominate or 'smoke' Badee in the clash."],
                            ["Nobody knows this battle rap hoe", "A harsh profile attack supporting his claim that Badee has not earned comparable status."],
                            ["This is the way that battle rap goes", "A framing line used to justify the personal level of disrespect once someone enters the format."]
                          ]
                        },
                        {
                          mc: "Badee Harz",
                          entries: [
                            ["Oi Deeno, why do you look like a pedo?", "An extreme character insult intended to damage Deeno's image, not a factual claim or technical piece of wordplay."],
                            ["You will lose this battle like you lose bread to the casino / Don't be gambling with your life", "A connected gambling scheme that moves from losing money to risking himself in the battle."],
                            ["You're losing your hair", "A direct, visible appearance attack targeting Deeno's hairline."],
                            ["How many Ls have you had against girls? / Kusha, Shami and me as well / I'mma just make this a hat trick", "Badee uses named opponents as evidence and presents herself as completing a pattern of women defeating Deeno."],
                            ["You look like your brother", "A family and appearance shot whose impact relies on the room recognising the comparison."],
                            ["AJ don't wanna clash, 2Mad don't wanna clash", "Badee names scene figures to position herself as the person willing to step into the matchup."],
                            ["I got them shook in the ring without throwing a hook", "A clean ring-and-music double meaning: a hook can be a boxing punch or a section of a song."],
                            ["Your sister's name's Megan. Shut up Meg", "A named family shot that also functions as an attempt to control side comments in the room."],
                            ["JJJ had to pay to get you to Spain", "A specific travel and money angle designed to make Deeno look dependent rather than established."],
                            ["All you do is put dirt on your name", "A reputation angle arguing that Deeno's own actions damage his image more than an opponent can."],
                            ["Battling Grams, your mind went blank", "A battle-history attack referencing a previous performance to question Deeno's reliability."],
                            ["Don't believe you went jail", "A direct challenge to the authenticity of Deeno's claimed backstory and street credibility."],
                            ["I'm able to say your bro's unstable", "A harsh family and disability-based attack built around the able/unstable wording."],
                            ["I'm the baddest bitch on GZone / Time for them to know about Harz", "Badee's central branding moment turns the debut into a declaration that she belongs on the platform."],
                            ["This ginger prick talking shit, he don't know about bars", "An appearance insult combined with a direct challenge to Deeno's writing ability."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'tapped24-vs-ajna' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Tapped24",
                          entries: [
                            ["Appearance and body angles", "Tapped's main visual attack was that AJ looked physically out of place in the battle. Lines about her forehead, belly, eyebrows, body shape, and seatbelt not fastening worked as a repeated body-shaming scheme. The Dumbledore and Juggernaut sequence was the strongest version because the big-head setup connects to a wall-breaking image."],
                            ["James and the Giant Peach / AJ the Giant Plum", "Tapped flips the familiar children's story into a body insult. It is simple, recognisable, and easy for the room to catch."],
                            ["Austin Powers / Goldmember / Fat Bastard", "The memorable Austin Powers characters create another body and sex-based scheme that the audience can understand immediately."],
                            ["Half eyebrows", "This visual punch flips the familiar unibrow idea into a joke about missing or incomplete eyebrows. Its simplicity makes it sharper than the more graphic material."],
                            ["She can't keep her head in the game", "Tapped references High School Musical and East High, turning \"head in the game\" into both a musical reference and adult wordplay."],
                            ["Run train crowd section", "Tapped turns the audience into part of the insult through direct call-and-response. The interactive performance gives the section impact beyond the written line."],
                            ["Blue waffle", "An internet shock reference used as a sexual-health insult. Its purpose is disgust rather than intricate writing, so it is best understood as shock material."]
                          ]
                        },
                        {
                          mc: "AJ / AJNA",
                          entries: [
                            ["You give me the ick", "\"The ick\" is modern slang for sudden disgust. AJ makes Tapped himself the source of revulsion, framing the rest of her material as rejection rather than fear."],
                            ["Drug-use / sniffing scheme", "AJ links sniffing, jaw movement, nostrils, and being \"wired.\" The one more line, two more lines, three more lines structure works because \"line\" means both a lyric and a drug line."],
                            ["You're not a bad man...", "AJ rhythmically breaks down Tapped's image through labels such as bad man, mad man, sad man, cat man, and twat fam. Her argument is that his dangerous persona is fake."],
                            ["Definitely not Tapped", "Her cleanest stage-name attack. Because \"tapped\" can mean crazy, dangerous, or unstable, saying he is not tapped directly undermines the persona."],
                            ["Georgie Porgie", "AJ uses the nursery rhyme inside a sexual and humiliating sequence. The contrast between a childish rhyme and adult disrespect makes it strange but memorable."],
                            ["Paracetamol thinking it's raw", "Paracetamol is an ordinary painkiller, while \"raw\" suggests cocaine or stronger drugs. AJ says Tapped is so desperate or clueless that he would sniff the wrong substance."],
                            ["You look like a pedo", "This is a severe reputation attack rather than technical wordplay. It should be understood as an extreme character insult, not a factual claim."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'ryno-vs-tymeless' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Ryno",
                          entries: [
                            ["Your mum looks like Bruce Buffer / You wear shades inside", "Ryno opens with quick visual comparisons. Bruce Buffer connects the insult to fight-night culture, while the indoor-shades angle suggests TymeLess is hiding something awkward about his appearance."],
                            ["Only called yourself TymeLess / countless times", "Ryno turns the stage name into a dark family-trauma angle. The writing works technically because repeated events become \"countless times,\" even though the subject matter is deliberately cruel."],
                            ["If I hit him with a right, you'll fly and see time travel", "A clean name flip connecting physical impact to time travel. The punch feels tailored to TymeLess rather than transferable to any opponent."],
                            ["Clock for his faces / Stopwatch how time gets bodied", "\"Clock\" means both a timepiece and a punch, while \"stopwatch\" becomes an instruction to watch TymeLess get beaten. These are among Ryno's clearest fighting-and-time combinations."],
                            ["Past time, wrote for the future, to tell him what he's present", "One of Ryno's strongest technical schemes, using past, future, and present in one structure to exploit the opponent's name."],
                            ["Recorded timestamp / Look at the time... recording time of death", "Ryno links the video recording, the live clock, and TymeLess' defeat. Checking the actual time makes the closer feel improvised and gives it strong room impact."],
                            ["Cooking up beef... now I've got time, let me marinate it", "\"Beef\" means conflict and meat, while marinating requires time. The food metaphor and name flip connect cleanly."],
                            ["If I fire at Will / Call William, I'm spinning him", "Using TymeLess' real name enables the military phrase \"fire at will\" and makes the threat feel more personal."],
                            ["They see time less / You need less time on a mic and more for your kids", "Ryno turns the stage name into a fatherhood criticism: TymeLess' children allegedly see him less because he spends his time elsewhere."],
                            ["You've got a tune called Lynch Him / I've heard what you say to the ladies", "These are serious character attacks built around alleged racism and behaviour toward women. They function as reputation damage rather than conventional punchlines."]
                          ]
                        },
                        {
                          mc: "TymeLess",
                          entries: [
                            ["He's challenging who? / He said he'll murk everyone on GZone", "TymeLess opens with a status check, positioning himself as the opponent who disproves Ryno's claim that he can beat the whole platform."],
                            ["Homeless, hopeless, domeless, topless, soulless", "A chant-like chain of matching sounds that creates rhythm and crowd reaction while presenting Ryno as degraded and broken."],
                            ["One thing that I won't stand is a rapist / NFA don't prove you didn't do it", "TymeLess answers serious accusations with a legal and reputation angle. NFA means no further action; he argues that absence of charges is not necessarily proof of innocence. These remain allegations within battle material."],
                            ["Too Mad called you a racist / At least I didn't call a black man a gorilla", "TymeLess brings in outside scene history and states the racism accusation plainly so the room understands the moral case he is making against Ryno."],
                            ["Funny how he puts all blacks in a box", "\"Putting people in boxes\" means stereotyping, while a box can also suggest a coffin. The line turns the accusation into battle imagery."],
                            ["Ryan Winnie the Pooh / Soft like a teddy bear", "A clear Ryno/Ryan name flip that uses a familiar children's character to make Ryno seem harmless and weak."],
                            ["This whole time I was talking to your friend / Why are you out here kissing our men?", "TymeLess reveals alleged inside information from someone close to Ryno, creating a betrayal setup before attacking his masculinity and sexuality."],
                            ["Kenko ground coffee / Rigor mortis / smoke his ash", "A grouped sequence of exceptionally dark death and cremation imagery aimed at Ryno's father. Its force comes from emotional cruelty rather than technical subtlety."],
                            ["I bought an extra pair / A toothbrush / Pot Noodle when you wanna eat", "The third-round props turn the homelessness and hygiene angle into a visual performance. Socks, toiletries, and cheap food give the crowd physical objects to react to."],
                            ["You don't have no kettle / Take my bars for the heat", "TymeLess completes the Pot Noodle prop joke with a double meaning: Ryno allegedly lacks a kettle, so the heat must come from TymeLess' bars."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'pr1nc3-vs-nattyebk' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Natty EBK",
                          entries: [
                            ["Child and family attack opening", "Natty immediately targets Prince through his child and family situation. The purpose is emotional destabilisation rather than a conventional joke, setting the battle's dark tone."],
                            ["Rude boy Prince / Tuesday night, he's the king of the room", "Natty sarcastically turns Prince's royal name into a small-status insult, suggesting he only looks important in minor rooms."],
                            ["Name one guy that's better than me in this room", "A direct dominance claim that invites the crowd to compare Natty with everyone present."],
                            ["You look double my age / You ain't half of the man that I am", "Natty combines a visible age angle with a masculinity attack, presenting Prince as older but still weaker and less authoritative."],
                            ["You're a rookie / All of us know you ain't gonna go far in music", "These lines attack Prince's competitive experience and wider future as an artist, not just his performance in this battle."],
                            ["Are you taking your kids to school on a pushy?", "\"Pushy\" means bicycle. Natty turns everyday transport into a financial and status insult by suggesting Prince cannot afford a car."],
                            ["You're like Pluto, I'm like Mars", "Mars carries war and power associations, while Pluto is distant and was downgraded from full planet status. Natty uses that contrast to call Prince irrelevant."],
                            ["Your mum looks like a transit van / Demi's too fat, won't fit in a car", "A grouped set of immediate, visual body insults aimed at people close to Prince. The impact comes from recognisable size imagery rather than intricate writing."],
                            ["All the mandem know you do sniff / If I robbed him, he wouldn't fight back", "Natty combines drug-use and cowardice allegations to challenge Prince's composure and real-world credibility."],
                            ["We can drop the mic and go fight / Fuck your friend, he's dead and he's gone", "Natty pushes the clash beyond rap through a physical challenge and deceased-friend disrespect. These are intimidation and emotional-damage lines rather than technical punches."]
                          ]
                        },
                        {
                          mc: "PR1NC3",
                          entries: [
                            ["I already knew what this prick was saying / That stuff there just don't affect me", "Prince tries to neutralise Natty's personal material by saying the obvious family, wife, barber, and dancing angles were expected and ineffective."],
                            ["You're not bad / Not one body here is scared of you", "Prince attacks Natty's dangerous image and brings the room into the judgement, arguing that the intimidation act has failed."],
                            ["I'm a real rap artist / I'm here for redemption", "Prince gives his performance a narrative: he is proving his musical ability and earning back status after earlier appearances."],
                            ["You just cap and lie in your rhymes / I can never take no chat from a snitch", "His central credibility angle frames Natty as dishonest and disloyal, directly undermining claims of street authenticity."],
                            ["You get scared and call 999", "The UK emergency number supports the snitch angle by suggesting Natty would involve police when genuinely pressured."],
                            ["Hit him with a one-two, slip then crack it", "Prince uses recognisable boxing mechanics to make the threat feel controlled and technically grounded."],
                            ["Your new name's vermin", "A concise rat and snitch image that makes Natty sound dirty, unwanted, and beneath respect."],
                            ["Croydon version of Diddy / Mickey Mouse looking", "Prince uses celebrity and cartoon comparisons to make Natty's image look cheap, local, childish, and unserious."],
                            ["Your breath smells... here's Listerine / Dove soap", "The mouthwash and soap props turn a hygiene scheme into a visual performance moment, giving the crowd relief from the darker personal material."],
                            ["There's levels to this / This guy here can't fuck with a Prince", "Prince closes through hierarchy and his royal stage name, arguing that Natty is simply not in the same competitive league."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'btizz-vs-cj-zino' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "BTizz",
                          entries: [
                            ["Welcome to the GZone massacre / This guy thinks he's a challenger", "BTizz frames the clash as total destruction and immediately positions CJ Zino as an unprepared challenger beneath his level."],
                            ["Flopped last time, so let me take a breather / Talk is cheap", "He uses CJ's previous footage as evidence and argues that confident talk is unsupported by performance."],
                            ["Pepper this unit more than spice", "\"Pepper\" means both seasoning and attacking someone. The linked food language makes this one of BTizz's cleaner concepts."],
                            ["Clean up the stage, squeaky clean / Clean up your surface area", "A repeated cleaning scheme presents BTizz as wiping CJ out while giving the room a lighter, visual phrase to react to."],
                            ["Winning this clash, MVP / Three rounds and you're gonna get 3-0", "The MVP chant creates call-and-response energy, while the 3-0 line directly predicts a clean sweep in the battle format."],
                            ["You're not GSP, I'm a champion like UFC / Leon Edwards, headshot", "Combat-sports references give the clash a fight-night feel. Leon Edwards' famous knockout supplies a recognisable finishing image."],
                            ["Fish not Dory, lost like Nemo", "The Finding Nemo characters support a simple argument that CJ is confused, lost, and not controlling the battle."],
                            ["Mickey Mouse / Look like NPC / Alien Roger from American Dad", "BTizz groups cartoon, gaming, and television references into an appearance scheme that makes CJ look generic, strange, and unserious."],
                            ["I won't talk about his STDs / Dying slowly from the HIV / You look like you've done malaria", "A grouped health-shaming angle built for shock and embarrassment rather than intricate writing."],
                            ["One in a mill and you're one in a mob", "BTizz contrasts being one in a million with being merely one person in a crowd, making CJ sound ordinary and replaceable."]
                          ]
                        },
                        {
                          mc: "CJ Zino",
                          entries: [
                            ["There's only one king that stood in this ring", "CJ establishes authority through simple king-and-ring imagery, directly challenging BTizz's confidence."],
                            ["Next time he can't flow, do it right / Why you stealing flows off Tapped?", "CJ turns the battle into a rapper-to-rapper critique, arguing that BTizz lacks technical control and borrows Tapped24's identity."],
                            ["Go find your own flow", "The cleanest version of the originality angle: BTizz needs an individual style rather than a borrowed performance pattern."],
                            ["Your number one snitch / You get brave when you've had some rum", "CJ attacks loyalty and courage, claiming BTizz is only confident under the influence and cannot sustain a credible tough image."],
                            ["How'd you lose your job? / We know you love serving fish", "A grounded employment angle uses alleged real-life work details to make BTizz look unstable and exposed."],
                            ["Next time you go digging for info / You want treasure but won't find treasure", "CJ attacks BTizz's preparation through an extended digging metaphor, saying his search for damaging material produced nothing valuable."],
                            ["Three, four rings in my Audi / You're the type to get licked by a Ford", "The Audi logo's rings support a car-status flex, while Ford becomes the lower-status contrast and \"licked\" also means beaten."],
                            ["Your breath smells... here's Listerine", "A hygiene punch with a visible prop. The physical mouthwash makes the insult immediately readable to the room."],
                            ["I'm a TARDIS / Doctors confused", "CJ uses Doctor Who imagery to present himself as bigger or more complex than he appears, then extends the reference through doctor language."],
                            ["All that money you spend on coke, get a new trackie instead / You just lost to the youngest / Give me Prince next", "CJ closes with drug, clothing, age, and status attacks before converting the win into a callout that advances the wider GZone storyline."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'deeno-vs-grams' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "Grams",
                          entries: [
                            ["How you gonna verse me? You're dirty, nerdy / Need to bang gym, cause you're way too curvy", "Grams immediately attacks hygiene, threat level, and body shape, establishing the physical-disrespect angle that runs through his rounds."],
                            ["You don't wanna battle when you can't do a burpee / Go flying like Kirby", "A fitness punch connects Deeno's battle readiness to a full-body exercise, then uses Nintendo's floating pink character to make him look soft and cartoonish."],
                            ["I come from the shadows / Anytime I enter the room, I'm smoking", "The surprise appearance makes the shadow line feel literal, while smoking links pressure to Grams' weed-related stage name."],
                            ["You're a Viking, I'm gonna dethrone him / You ain't a Viking, you're not Arthur", "Grams directly dismantles Deeno's warrior persona through royal and legendary imagery, presenting himself as the person taking away Deeno's status."],
                            ["Only white boy chatting about melanin / You want an M-word pass", "A race-and-language credibility angle accusing Deeno of claiming cultural language and positioning that do not belong to him."],
                            ["Stop running your gum, just go for a run / Test Deeno to see if he's drunk", "Grams connects excessive talking to physical running, then extends his earlier slurring angle by questioning Deeno's composure."],
                            ["On a mic you might get a reload, but on a bike you can't get a wheel up", "A strong contrast between musical crowd reaction and physical balance: Deeno may earn reloads, but Grams says he lacks real athletic control."],
                            ["In a Defender, you ain't in the field / Even with an A-Team against me", "Land Rover and action-team imagery attack Deeno's rugged image, arguing that neither the vehicle nor a supporting crew makes him genuinely active."],
                            ["Ed Sheeran / Ron Weasley / Daphne Blake", "Recognisable red-haired figures become a connected appearance scheme. The Weasley reference is strongest because it also links to Grams calling Deeno a weasel."],
                            ["Big kid in Matilda / Princess Fiona", "Children's-film and fairy-tale characters turn the repeated body angle into specific, instantly recognisable visual comparisons."]
                          ]
                        },
                        {
                          mc: "Deeno",
                          entries: [
                            ["I don't care if you call me fat / You're built like a stick", "Deeno anticipates the obvious weight angle and immediately reverses it, trading Grams' body attack for a visible skinny-body insult."],
                            ["If it's a war you want, self-defence, I suppose I'm Iran", "A geopolitical war reference frames Deeno's attack as retaliation rather than aggression, giving the threat more structure than a generic violence bar."],
                            ["You lost to Bangkok, but I've never been to Thailand / Bombs I drop will mess up your flight plan", "Deeno uses Grams' battle history to build a Thailand, China, bombing, and travel scheme that connects past performance to geography."],
                            ["You got punched and knocked out by your cousin / Not a single platform you're the best on", "Real-life credibility and career-status attacks present Grams as vulnerable personally and undistinguished across battle platforms."],
                            ["I'm half your age but double the man / Raised two kids and provided properly", "Deeno turns the age gap into a maturity argument, grounding masculinity in parenting and responsibility rather than years."],
                            ["I get paid to blaze on Grams / I'm smoking Grams like flavour", "The opponent's name becomes a weed quantity, allowing Deeno to describe winning the battle as smoking Grams."],
                            ["Your name is Grams, I'll lift my hand and weigh him in", "A clean measurement flip: grams are units of weight, so weighing him in becomes both a name punch and a physical threat."],
                            ["You live in Crystal Palace... glass house", "The place name supplies crystal and glass imagery, which Deeno connects to the idiom about throwing stones from a glass house."],
                            ["On Pen Game you were known as a dunce / Other platforms had you bumped", "A platform-history angle arguing that Grams needed GZone to revive an image that had stalled elsewhere."],
                            ["Let me introduce you to my sons / Pro is the youngest, Grams the oldest, Roman the coldest", "Deeno widens the battle into a scene statement, positioning himself as GZone's father figure and ranking the wider roster around him."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'pr1nc3-vs-roman' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "PR1NC3",
                          entries: [
                            ["Big tip, fat brick, no drip, dead trim", "A rapid appearance attack. \"No drip\" means no style, while \"dead trim\" targets Roman's haircut and immediately sets a blunt tone."],
                            ["Trying to clash Prince? / I came to put Ferg in a body bag", "PR1NC3 uses his royal stage name as status and Roman's personal name to make the threat feel direct."],
                            ["Your flow's outdated / You're getting fried like bacon", "The youth-versus-veteran angle presents Roman as behind the times before moving into simple food-and-violence imagery."],
                            ["A goat to a goat is a sacrifice", "PR1NC3 accepts Roman's possible GOAT status but argues that even a great opponent can become the sacrifice."],
                            ["You're a goldfish, I'm in the ocean", "His cleanest comparison: Roman is small and contained, while PR1NC3 operates in a larger, freer environment."],
                            ["I forgot all my bars... psych", "A performance fake-out that briefly imitates a choke before turning it into a confidence trick."],
                            ["I'm sending shots like a free throw", "A basketball reference suggesting PR1NC3 can land clean, uncontested attacks with ease."],
                            ["Angles weigh like kilos", "Battle angles become something with physical weight, with kilos also carrying drug and street associations."],
                            ["Higher than Kevin and Perry", "The British comedy reference supports a height and elevation punch, connecting sending Roman flying with being high."],
                            ["Crazy GRM flow / PR1NC3 to the free", "A name-branding and modern UK-rap moment that presents PR1NC3's style as current, platform-ready, and memorable."]
                          ]
                        },
                        {
                          mc: "Roman",
                          entries: [
                            ["Princess, listen / I'm a real don", "Roman immediately feminises PR1NC3's royal name and contrasts it with his own claim to authentic boss status."],
                            ["I've been doing this since 06", "Experience becomes a weapon, framing PR1NC3 as a younger battler entering a veteran's territory."],
                            ["Royal bars, upper class / Buckingham Palace", "Roman takes control of the royal theme and turns PR1NC3's own branding into a layered upper-class scheme."],
                            ["Big John Prescott", "The former British politician is remembered for punching a protester, making him a distinctly British right-hand reference."],
                            ["Times New Roman / Ink man, call me toner", "Roman links his name to the famous font, then extends the writing theme through printer ink and toner."],
                            ["Your shins are enormous / Take his knees out and he still won't fall in half", "A cartoonish height scheme that makes PR1NC3's tall build itself into the punchline."],
                            ["Your girl thinks gel pens are cool", "Gel pens evoke school-age stationery, supporting Roman's argument that PR1NC3 and his partner are young or immature."],
                            ["He was born 2001, battles he lost 2001", "One of Roman's strongest number flips, using PR1NC3's birth year as an exaggerated tally of battle losses."],
                            ["Go dance to your songs, battle rap ain't really for you", "A format-specific attack arguing that PR1NC3 belongs in music performance rather than direct battle competition."],
                            ["Mason, you're done now / I'm top dog and this is my wing", "Roman strips away the stage name with PR1NC3's personal name, then closes by presenting the battle space as territory he controls."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'ldn-mikez-vs-deluxx' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "LDN Mikez",
                          entries: [
                            ["Opening identity and family attack", "Mikez begins with extreme identity-based and family disrespect. Its function is immediate shock pressure, designed to unsettle Deluxx before the battle settles."],
                            ["Your mother's on the stove, mixing up coke and magic", "A vivid drug-and-household image that turns Deluxx's home into a grim criminal setting rather than relying on abstract abuse."],
                            ["PowerPoint to Excel... good with words", "Microsoft Office becomes a writing scheme: PowerPoint and Excel lead naturally toward Word, showing pen control amid the heavier disrespect."],
                            ["If everyone's a GOAT, you need a shepherd", "GOAT means greatest of all time, but goats also form a herd. Mikez presents himself as the person controlling everyone else's claims to greatness."],
                            ["Universal Credit sanction / landlord money", "A grounded financial angle using benefits sanctions, gig income, and rent pressure. Everyday adult consequences make the insult more cutting than a generic threat."],
                            ["I was sorting the Wi-Fi... started connecting", "\"Connecting\" works as both establishing Wi-Fi and forming a personal or sexual connection, creating a clean modern double meaning."],
                            ["Devonte, not Deluxx / Your body's shaped like a thumb", "Mikez strips away the premium stage name with Deluxx's personal name, then adds an immediate and memorable visual comparison."],
                            ["Thought you were Superman, I'll make you fly like Tinkerbell", "Two flying characters create a downgrade from powerful superhero to small fairy, turning flight into humiliation."],
                            ["I inspired this kid to rap... I'm the one that made you", "A mentor and status angle claiming Deluxx only exists in this lane because Mikez created or inspired him."],
                            ["I caught a murder on my debut / Green Street... rolling with a hammer", "Mikez frames the clash as a debut body, then uses the British hooligan film and West Ham imagery to close with local violence culture."]
                          ]
                        },
                        {
                          mc: "Deluxx",
                          entries: [
                            ["You're London Mikez, I'm king of the mic", "Deluxx flips Mikez's stage name into a direct claim that he is the true ruler of the microphone."],
                            ["Bromtile 0121", "Birmingham's 0121 area code becomes a location and identity bar, contrasting Deluxx's city representation with London Mikez."],
                            ["Can't sing, get no girls / Your album's scamming people", "A combined artist attack arguing that Mikez lacks vocal ability, audience appeal, and music worth paying for."],
                            ["Back to the trap, don't wanna hear chat", "Deluxx attempts to reset the tone through direct street aggression, rejecting Mikez's talk and claiming greater activity."],
                            ["That flow's like Renzo", "An originality attack suggesting Mikez borrows another MC's style. Flow-copying accusations directly challenge artistic identity."],
                            ["Bro's too white, can't catch tans / Hairline, go get a trim", "Simple visible appearance punches aimed at complexion and grooming, designed for immediate live-room recognition."],
                            ["DFN and now I'm Deluxx", "An identity-branding moment that presents the Deluxx name as development from an earlier stage persona."],
                            ["A1J1 latest trend", "The viral UK rap duo supplies a modern music reference, positioning Deluxx around contemporary branding and trends."],
                            ["Aquaman / king of Atlantis", "Water and kingdom imagery lets Deluxx present himself as a ruler in his own environment, though the concept needed stronger room command."],
                            ["Lockjaw", "A concise delivery and physical-condition attack suggesting Mikez's mouth, speech, or flow is awkwardly restricted."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : battle.slug === 'ldn-mikez-vs-2mwad' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {[
                        {
                          mc: "2MWAD",
                          entries: [
                            ["Why you raising the next man's kids? / Those kids don't share DNA", "The central fatherhood angle attacks Mikez as a secondary figure in his household, with the blunt DNA line making the scheme's accusation unmistakable."],
                            ["You're the DLC / You're not player one", "DLC is optional game content and player one is the primary figure. Together, the lines frame Mikez as an add-on rather than the central parent."],
                            ["You play in people's lives like an NPC / Side quest is the main", "An NPC is a background character and a side quest is normally optional. 2MWAD uses both to say Mikez lives inside another man's main storyline."],
                            ["Son of Mick Foley from TNA", "The veteran wrestler's battered appearance becomes a visual comparison intended to make Mikez look worn and physically strange."],
                            ["Your mother wants her kids back through the court system", "A serious family and legal angle designed to portray instability around custody and home life."],
                            ["Ugly, fugly, bummy, scummy, crusty, musty, dusty, rusty", "A rhythmic chain of simple insults. The writing is basic, but repetition and delivery create a memorable performance moment."],
                            ["Can't even afford a McFlurry", "A grounded money punch: the low price of the dessert makes the claim of poverty deliberately extreme and easy to understand."],
                            ["Your mum trapped your dad for a council house", "A UK-specific class and housing angle that turns Mikez's family background into a relationship and financial accusation."],
                            ["I keep it Frank... send you to your Butcher", "Frank Butcher is an EastEnders character, while butcher also means someone who cuts meat. The character name becomes a direct threat."],
                            ["Frank / Butcher / Heather / Tracy / Shirley / Bianca", "A wider EastEnders scheme turns the family drama into soap-opera imagery built around recognisable characters and public embarrassment."]
                          ]
                        },
                        {
                          mc: "LDN Mikez",
                          entries: [
                            ["Two W's like 2MWAD", "Mikez flips the opponent's number-based name into a claim of consecutive GZone wins."],
                            ["Different kind of Warzone... send him to the gulag", "A Call of Duty reference countering 2MWAD's gaming scheme. Defeat sends a player to the gulag, making elimination part of the punch."],
                            ["Your name's Lance Pennant / Put you in a spliff", "Mikez strips away the stage persona with a personal name, then uses a standard smoke bar to describe the battle result."],
                            ["Apollo Creed", "The Rocky boxer supplies fight-night imagery, presenting Mikez as putting 2MWAD on the ropes in the GZone ring."],
                            ["I told you I'm the plug already / Stop taking coke", "Mikez combines supplier status with a drug-use accusation, presenting himself as the connection while portraying 2MWAD as unstable."],
                            ["I won't stop until we're in sync / Trying to get Justin like he's NSYNC", "\"In sync\" becomes the pop group's name, with Justin Timberlake completing the celebrity reference."],
                            ["Everybody's on a wave, so I'll make your ship sink", "A clean water metaphor: while others ride momentum, Mikez says he will destroy 2MWAD's ability to stay afloat."],
                            ["You said you don't know my songs, but you got me as your ringtone", "An artist-status punch claiming 2MWAD secretly listens to Mikez while publicly denying familiarity."],
                            ["Undertaker / WrestleMania / The Rock", "A WWE scheme using iconic names and spectacle to turn the battle into a dramatic wrestling-style destruction."],
                            ["I brought the energy, kill him with this melody / This clash weren't meant for you", "Mikez closes through performance identity, reminding the room that he carries melody and energy before declaring 2MWAD unsuited to the level."]
                          ]
                        }
                      ].map(({ mc, entries }) => (
                        <article key={mc} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{mc}</h3>
                          <div className="space-y-4">
                            {entries.map(([bar, explanation]) => (
                              <div key={bar} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                                <blockquote className="text-white font-bold leading-relaxed mb-3">
                                  &ldquo;{bar}&rdquo;
                                </blockquote>
                                <p className="text-zinc-400 leading-relaxed font-light">{explanation}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {((battle.slug === 'deeno-vs-tymeless' ? [
                        ["Deeno", [
                          ["You've only had one clash three times.", "A status angle arguing that TymeLess' career feels repetitive rather than progressive."],
                          ["I can't bark like TymeLess.", "Deeno acknowledges TymeLess' loud delivery while mocking the persona."],
                          ["Young Pete and Bas rapping with grey hairs.", "A clean UK rap comparison targeting TymeLess' age and appearance."],
                          ["Outside the GZone, Tyme is broke.", "A simple time-name flip turned into a money and status attack."],
                          ["They gave me TymeLess like he's someone to worry about.", "Deeno dismisses the booking as less threatening than advertised."],
                          ["It's game over for you, no replay.", "Gaming language says TymeLess gets no second attempt."],
                          ["GTA, it's a final mission — Big Smoke or CJ.", "A Grand Theft Auto: San Andreas reference that frames the clash as a boss-level ending."],
                          ["Beans and Universal Credit he's living off.", "A grounded low-income and survival-mode status attack."],
                          ["When it's my time, there is no reverse.", "A clean TymeLess name flip: Deeno's moment cannot be undone."],
                          ["Put William in a spliff, bill it up.", "TymeLess' real name becomes a direct piece of smoking wordplay."],
                          ["TymeLess ain't no Thriller.", "The Michael Jackson reference says TymeLess is neither frightening nor iconic."],
                          ["You look like Smithers.", "The Simpsons character supplies an instantly recognisable comic comparison."],
                          ["Who wants a war with me?", "Deeno widens the challenge beyond TymeLess and reinforces his GZone status."],
                          ["Country side is where I build a country line.", "Location and hustle imagery are joined through a countryside/county-line flip."],
                          ["Most Wanted, spin him, then replay.", "Deeno connects the season branding to a replay command, making the attack feel built for the platform."],
                          ["Which one dies: Big Smoke or CJ?", "The San Andreas characters turn the final-mission scheme into a direct choice between two outcomes."],
                          ["Got shit bars, no flows and clichés.", "A concise technical dismissal of TymeLess' writing and delivery."],
                          ["Trying to call shots when you know I run this shit.", "Deeno converts the battle into a platform-authority argument."],
                          ["Are we gonna keep to the raps, or are we gonna keep to the facts?", "The line sets up a switch from performance claims to real-world credibility pressure."],
                          ["With your bars, you're not fighting back.", "A direct assessment that frames TymeLess' material as unable to answer Deeno's pressure."],
                          ["Call yourself TymeLess — how silly. If you've got time, drop it quickly.", "A tailored name flip that turns having time into an instruction to deliver immediately."],
                          ["TymeLess is in a Beta Squad — Yung Filly.", "A UK pop-culture reference linking Beta Squad and Yung Filly. It acts as the setup for Deeno's following bread and status line."],
                          ["Yung Filly, see I've got the most bread in city.", "Deeno carries the Yung Filly reference into a money boast, claiming greater status through having the most bread."],
                          ["I'll pay for your funeral, bro — no pity.", "Deeno extends the death framing with a cold financial punchline."],
                          ["Time means everything about life.", "The setup broadens the opponent's name into a larger concept before Deeno claims his own moment."],
                          ["Cheerio mate, I'm a serial killer.", "A playful greeting sound is flipped into a violent character claim."],
                          ["That explains why you look like Smithers.", "The Simpsons comparison supplies a clear visual payoff."],
                          ["You've been dropped like a hundred times.", "Battle history and repeated defeats become evidence for Deeno's status argument."],
                          ["You're on thin ice — drop the lines.", "Thin-ice danger is combined with the demand to deliver bars."],
                          ["Who wants work?", "A short open challenge that widens Deeno's target to the rest of the roster."],
                          ["When I drop this Tyme.", "The opponent's name is folded into a compact finishing threat."],
                          ["Why don't you see your kids on weekdays?", "Deeno shifts into a parenting angle, questioning TymeLess' presence and responsibility away from the stage."],
                          ["Why do you spell okay with three K's?", "The spelling becomes a KKK-style accusation aimed at TymeLess' character and alleged views."],
                          ["Your bars are dead like Rhino's dance.", "A local GZone reference compares TymeLess' writing to a memorable Rhino moment and dismisses both as ineffective."],
                          ["Your baby mum looks like Miss Rachel.", "Deeno uses the recognisable children's presenter as a visual comparison inside his family angle."]
                        ]],
                        ["TymeLess", [
                          ["Do I look like the one with Crohn's disease?", "TymeLess flips the stomach and toilet situation onto Deeno to launch his opening scheme."],
                          ["You went and got all the toilets locked off.", "An embarrassing moment is exaggerated into a venue-wide logistical crisis."],
                          ["Ginga Jay, is he taking the piss?", "A double meaning that works as both an accusation of joking and part of the running toilet scheme."],
                          ["The chair at GZone isn't your throne.", "The toilet imagery becomes a platform-status attack: Deeno may act like royalty, but GZone is not solely his kingdom."],
                          ["This is my house and I won't leave again.", "TymeLess claims territory on Deeno's home platform."],
                          ["I came here to tell Tapped, 'back off.'", "The bar connects this clash to a wider GZone storyline."],
                          ["Who brought Keith Lemon in?", "TymeLess compares Deeno's ginger hair and pale appearance to Keith Lemon. The visual insult also launches the lemon-prop theme that runs through the battle."],
                          ["I brought another lemon in.", "The repeated prop turns a visual joke into a memorable motif."],
                          ["You're a ginger fox with fleas and ticks; I'm a silver fox.", "A clean visual contrast that recasts TymeLess' grey hair as confidence while making Deeno look scruffy."],
                          ["Both ginger men… came to GZone.", "A room-specific comparison links Deeno and Ginger Jay through the platform."],
                          ["Ginger Jay giving himself a reload.", "After comparing Deeno and Ginga Jay as two ginger GZone figures, TymeLess jokes that the host is reloading a bar about himself. It turns the host's reaction into part of the punch."],
                          ["Prince Harry from Uber Eats.", "Royal ginger imagery is downgraded into a low-status visual insult."],
                          ["Paul Scholes.", "The famous footballer supplies another immediate UK ginger comparison."],
                          ["Weasley.", "The Harry Potter family provides an obvious red-hair reference."],
                          ["Leprechaun on a booster seat.", "A compact visual punch combining Deeno's hair, height, and cartoonish appearance."],
                          ["Simon Pegg and Shaun of the Dead.", "British film imagery keeps the attack comic and recognisable."],
                          ["Sugar Puff Monster.", "The cereal mascot comparison makes Deeno look exaggerated and cartoonish."],
                          ["If you get lemons, you'll get squeezed.", "The lemon prop becomes a simple pressure punchline and the clearest payoff to the running theme."],
                          ["You ain't got a gun, Deeno, when your belly starts rumbling.", "TymeLess contrasts street claims with the live stomach angle that drives his opening round."],
                          ["It's the only time you're known to squeeze.", "Toilet imagery and pressure language combine in a tailored punch."],
                          ["You're full of shit — don't think you're a boss.", "The toilet scheme becomes a direct attack on Deeno's platform authority."],
                          ["There's a big-ass turd and it won't flush.", "The venue problem is exaggerated into a crude but highly visual punchline."],
                          ["It's a plunger — go clear the toilet you blocked off.", "The physical prop completes the opening scheme and gives the crowd a visual payoff."],
                          ["Tried to aim at the frame and he missed.", "A simple accuracy attack says Deeno's writing fails to hit its intended target."],
                          ["Best believe I came for the win.", "TymeLess states his competitive intent directly inside the opening sequence."],
                          ["Go back to the toilet, sit on your own.", "The recurring toilet angle isolates Deeno and sets up the throne punch."],
                          ["Don't ever bring a melon in again.", "Melon and lemon sounds extend the fruit motif through repetition."],
                          ["How is that not a cheat code?", "The comparison between Deeno and Ginga Jay is presented like an obvious character duplication."],
                          ["You look like Jay if Jay was a bit slow.", "TymeLess sharpens the host comparison into a direct appearance and character insult."],
                          ["The real reason I brought lemons in the clash.", "The final-round setup calls back to every earlier lemon appearance before the squeezing payoff."],
                          ["Dino, your mum's name's Kelly — this one's a kill shot, he's not ready: Machine Gun Kelly.", "TymeLess uses Deeno's mother's name to build a Machine Gun Kelly name flip and introduce the final-round Kelly scheme."],
                          ["Hope you're hearing these bars, Kelly.", "Addressing Kelly directly keeps the name scheme active and makes the family angle feel theatrical."],
                          ["That's why everyone says R. Kelly.", "The repeated Kelly name is turned into an R. Kelly reference, completing the celebrity-name sequence."],
                          ["She looks like Miss Trunchbull from Matilda.", "A recognisable film character supplies a direct visual comparison aimed at Deeno's mother."],
                          ["Lemon number three.", "TymeLess reveals the third individual lemon and signals the final callback before the closer."]
                        ]]
                      ] : [[mc1?.name || battle.mc1, []], [mc2?.name || battle.mc2, []]]) as [string, string[][]][]).map(([name, bars]) => (
                        <article key={name} className="min-h-40 bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
                          {bars.length ? <div className="space-y-4">{bars.map(([quote, explanation]) => <div key={quote} className="rounded-xl border border-white/10 bg-white/[0.025] p-5"><blockquote className="text-white font-bold leading-relaxed mb-3">&ldquo;{quote}&rdquo;</blockquote><p className="text-zinc-400 leading-relaxed font-light">{explanation}</p></div>)}</div> : <p className="text-zinc-600 text-sm uppercase tracking-widest">Coming soon</p>}
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-display uppercase mb-6 text-white">Battle Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-400 text-xs uppercase tracking-widest">Date</span>
                  <span className="text-zinc-100 font-bold">{battle.date || "TBD"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-400 text-xs uppercase tracking-widest">Views</span>
                  <span className="text-zinc-100 font-bold">{battle.views || "0"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-400 text-xs uppercase tracking-widest">League</span>
                  <span className="text-orange-500 font-bold">Season 1</span>
                </div>
              </div>
              <button 
                aria-label="Share this battle"
                onClick={shareBattle}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <Share2 size={16} /> {shareStatus === "copied" ? "Copied Link" : "Share Battle"}
              </button>
            </div>

            <div className="bg-brand/10 p-8 rounded-3xl border border-brand/20">
              <h3 className="text-xl font-display uppercase mb-4 text-brand">Support the Zone</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Watch the battles on YouTube and leave your comments there to support the culture.
              </p>
              <a 
                href="https://www.youtube.com/@gingajay" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to the official Gzone YouTube channel"
                className="block text-center bg-brand text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                Subscribe on YouTube
              </a>
            </div>

            {([
              ["deeno-vs-tapped24", [
                "Tapped24 brought relentless pressure and shock-heavy disrespect, but Deeno built the clearer narrative around betrayal, fatherhood, responsibility, and evidence.",
                "The screenshot reveal and stronger thematic control gave Deeno the defining moments. The crowd decision and official record award the opening episode to Deeno."
              ]],
              ["pr1nc3-vs-roman", [
                "PR1NC3 brought direct aggression, youth, and clean status punches, but Roman produced the sharper schemes, stronger royal-name flips, and better room control.",
                "Roman's experience and more memorable writing carried the crowd response. The official battle record gives Roman the win."
              ]],
              ["ldn-mikez-vs-deluxx", [
                "Deluxx used flow and performance rhythm to keep the clash competitive, but LDN Mikez applied clearer pressure and landed the more direct personal writing.",
                "The audience call at the end clearly favoured Mikez. The official battle record confirms LDN Mikez as the winner."
              ]],
              ["ldn-mikez-vs-2mwad", [
                "2MWAD brought structured angles around step-parenting, gaming, money, and family, while Mikez answered with greater aggression and bigger reaction moments.",
                "The vote required a repeat, but the room ultimately leaned toward LDN Mikez. The official record gives Mikez the win."
              ]],
              ["tapped24-vs-ajna", [
                "Tapped24 brought heavier shock material and crowd interaction, while AJNA answered with cleaner character attacks, drug-line schemes, and controlled rebuttal writing.",
                "The transcript confirms that the crowd selected AJNA after a close discussion. The official battle record awards the win to AJNA."
              ]],
              ["ryno-vs-tymeless", [
                "Ryno produced strong time-based writing and direct pressure, but TymeLess created the larger moments through rebuttals, props, personal exposure, and room control.",
                "The closing reaction and official battle record favour TymeLess in one of the season's most chaotic clashes."
              ]],
              ["deeno-vs-tymeless", [
                "Deeno made the clash competitive through home-platform confidence, tailored time flips, gaming references, and status pressure. The Big Smoke / CJ scheme, no-replay concept, William flip, and Thriller attack were his clearest technical peaks.",
                "TymeLess produced the more complete three-round identity. The toilet and throne scheme established an opening narrative, while the lemon props, silver-fox contrast, ginger-reference run, and visual comedy created the battle's most memorable recurring moments.",
                "The deciding difference was room control. Deeno projected authority, but TymeLess controlled timing, callbacks, reloads, props, and audience involvement more consistently. His material was easier for the room to follow and each repeated theme gained impact as the battle progressed.",
                "The final crowd call went to TymeLess. Deeno defended his GZone position with strong individual ideas, but TymeLess connected those ideas into the larger performance and earned the official win through structure, reaction, and main-event presence."
              ]],
              ["pr1nc3-vs-nattyebk", [
                "PR1NC3 brought aggressive delivery and direct attacks, but NattyEBK showed stronger composure, cleaner responses, and the more convincing overall presence.",
                "The closing crowd call was described as clear, and the official battle record gives NattyEBK the win."
              ]],
              ["nattyebk-vs-zk", [
                "NattyEBK brought aggression, shock value, direct personals, and stronger room-commanding moments, while newcomer Z.K answered with clearer structure, researched angles, Grimsby pride, and varied cultural references.",
                "Z.K's cleaner writing kept the battle close, particularly in round two, but NattyEBK's intensity, crowd impact, and stronger closing round carried the audience decision. The archive records NattyEBK as the winner, 2-1."
              ]],
              ["btizz-vs-cj-zino", [
                "BTizz started with high energy and broad attack angles, but CJ-Zino built the clearer narrative through originality, hygiene, credibility, and flow-theft pressure.",
                "CJ's sharper later rounds and stronger room control gave him the decisive momentum. The official record awards CJ-Zino the win."
              ]],
              ["deeno-vs-grams", [
                "Grams used the surprise entrance and anti-Viking schemes effectively, while Deeno recovered with freestyle energy, name flips, and wider GZone status angles.",
                "Deeno's recovery and platform command carried the official result. The battle record gives Deeno the win."
              ]],
              ["deeno-vs-badee-harz", [
                "Badee Harz made a confident debut and attacked Deeno's image, family, history with women, and credibility without looking intimidated.",
                "Deeno's experience, home-platform authority, and room control ultimately gave him the edge. The official battle record awards the win to Deeno."
              ]],
              ["btizz-vs-1flaymr", [
                "1Flaymr made a memorable debut because the fire branding, Jamaican delivery, Avatar references, and repeated flame imagery gave him an immediate identity.",
                "BTizz controlled the battle more effectively. He attacked the flame persona directly, questioned its authenticity, involved the crowd, and landed the clearer insults around hygiene, Jamaican imagery, teeth, and the fire-versus-cold contrast.",
                "The final crowd reaction favoured BTizz, with the closing \"fully extinguished\" framing making the result feel clear: 1Flaymr brought the fire, but BTizz brought the extinguisher and the stronger room control."
              ]],
              ["2mwad-vs-ryno", [
                "Ryno brought aggression, platform-wide confidence, and the cleaner technical peaks through the Pen Zeppelin and chess sequences.",
                "2Mad built the stronger complete story around Ryno's housing, money, hygiene, work, and public image. The final room reaction and corrected battle record favour 2Mad."
              ]],
              ["deluxx-vs-btizz", [
                "Deluxx produced useful comeback and pen-focused moments, particularly when questioning BTizz's originality and relationship to Tapped24's style.",
                "BTizz controlled the room more consistently, built the clearer authenticity narrative, and landed the stronger tailored pen attack. The commentary table and official battle record give BTizz the win 2-1."
              ]],
              ["tapped24-vs-grams", [
                "Grams built stronger connected angles around image, parenting, money, Georgie, and Tapped's public presentation, but the room's interruptions repeatedly disturbed his control.",
                "Tapped escalated more effectively, turned the final into a Pen Game versus GZone statement, and produced the battle's largest shock moments. The guest judge and official battle record awarded the win to Tapped24."
              ]],
              ["ryno-vs-roman", [
                "Ryno brought venom, emotional pressure, and aggressive retaliation, but his material was less controlled and occasionally scattered.",
                "Roman built the clearer case through repeated housing, character, reputation, and status angles, combining them with stronger name flips and crowd control. The official battle record remains a Roman win."
              ]],
              ["renzo-vs-proty", [
                "Proty produced cleaner jokes and more clearly shaped visual punches, particularly through the UK Cali, Pennywise, Tails, Rizla, and social-media angles.",
                "Renzo's speed, grime energy, Birmingham branding, and crowd presence gave him the stronger live momentum. The official battle record remains a Renzo win in a close clash between performance pressure and cleaner joke writing."
              ]],
              ["cj-zino-vs-proty", [
                "CJ-Zino brought stronger aggression, grime identity, and closing momentum, while Proty supplied the cleaner visual jokes and more memorable cartoon comparisons.",
                "The supplied transcript notes that the room appeared to lean toward CJ after repeated crowd checks. The site's recorded result remains Proty, so this close reflects the apparent live reaction without replacing the official battle record."
              ]],
              ["tapped24-vs-roman", [
                "Roman brought aggression, pressure, intimidation, and some of the battle's darkest personal material.",
                "Tapped24 produced clean writing, memorable punchlines, and strong crowd engagement, but Roman's pressure and commanding performance carried the decision. The official battle record awards Roman the win."
              ]],
              ["cj-zino-vs-1flaymr", [
                "1Flaymr brought the stronger character through fire branding, Jamaican cadence, repeated slogans, and performance energy, while CJ-Zino produced the cleaner counter-writing through the extinguished and Hunger Games schemes.",
                "The transcript's crowd call is unclear, but the official battle record awards the win to 1Flaymr."
              ]]
            ] as const).filter(([slug]) => battle.slug === slug).map(([slug, paragraphs]) => (
              <div key={slug} className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
                {slug === 'deeno-vs-tymeless' ? (
                  <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                    {[paragraphs[0], paragraphs[3]].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm leading-relaxed">{limitResultCopy(paragraphs)}</p>
                )}
              </div>
            ))}

            {battle.slug === 'deeno-vs-tapped24' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>

                {[
                  {
                    mc: "Tapped24",
                    highlights: [
                      ["Shock-value opening", "Direct family, health, and appearance attacks instantly set a hostile tone."],
                      ["Identity pressure", "He questioned Deeno's status and credibility."],
                      ["Family disrespect", "His writing targeted relatives, children, partner, and household."],
                      ["Medical and body angles", "Illness, weight, hair loss, and appearance became repeated attack points."],
                      ["Scene history", "Skamz and Pen Game references connected the clash to wider history."],
                      ["Crowd-reload energy", "Crowd and room reaction pulled several moments back."],
                      ["Main weakness", "Too many stacked personals sometimes made the writing messy."]
                    ]
                  },
                  {
                    mc: "Deeno",
                    highlights: [
                      ["Narrative framing", "The former friendship made the battle feel like betrayal."],
                      ["Moral angle", "He framed his attacks as retaliation for comments about his children."],
                      ["Screenshot prop", "Visual evidence created one of the clash's biggest reactions."],
                      ["Fatherhood angle", "Responsibility as a parent became the centre of his argument."],
                      ["Name flips", "\"Cap 24,\" \"shit dad 24,\" and similar flips structured the attack."],
                      ["Scene pressure list", "Real-life pressures were presented as a pattern."],
                      ["Adult-life punchlines", "Child support and council tax gave the writing a real-world edge."],
                      ["Main weakness", "The extreme personal material may divide viewers."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'tapped24-vs-roman' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "Roman",
                    highlights: [
                      ["Aggressive battle style", "Intimidation and direct confrontation drive the performance."],
                      ["Confidence", "Roman maintains conviction with very little hesitation."],
                      ["Personal angles", "Tapped's life, image, relationships, and family become repeated targets."],
                      ["Consistent pressure", "The hostile tone continues from beginning to end."],
                      ["Crowd control", "Roman commands attention through intensity rather than humour."],
                      ["Main weakness", "The writing is less layered and creative than Tapped's."]
                    ]
                  },
                  {
                    mc: "Tapped24",
                    highlights: [
                      ["Crowd engagement", "Tapped repeatedly involves the room and turns reactions into momentum."],
                      ["Character assassination", "Jokes and personal information are used to damage Roman's credibility."],
                      ["Reference game", "Wrestling, football, fantasy, gaming, and pop culture shape the writing."],
                      ["Rebuttal ability", "He reacts quickly to Roman and the room's changing energy."],
                      ["Name flips", "Roman Reigns, Roman script, and GZone versus G-string create memorable punches."],
                      ["Main strength", "Serious angles are consistently converted into entertaining punchlines."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'cj-zino-vs-1flaymr' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "1Flaymr",
                    highlights: [
                      ["Strong fire branding", "Flame, burn, smoke, gunshot, and heat imagery define the performance."],
                      ["Performance identity", "Jamaican-style cadence makes him instantly recognisable."],
                      ["Repetition as crowd tool", "Everything burn and you dead function as performance hooks."],
                      ["Direct callouts", "CJ, BTizz, Roman, Ryno, Tapped24, Darren, Jay, and ZK connect the round to the roster."],
                      ["Best angle", "Nobody can permanently extinguish the flame persona."],
                      ["Main weakness", "Some sections rely more on sound and repetition than clean punch structure."]
                    ]
                  },
                  {
                    mc: "CJ-Zino",
                    highlights: [
                      ["Counter-persona writing", "CJ attacks the flame identity directly rather than avoiding it."],
                      ["Hunger Games scheme", "Katniss, Mockingjay, Snow, fire, and the arena create a connected reference chain."],
                      ["Old-name angle", "The previous Friction name is used to challenge the rebrand."],
                      ["Stage-control angle", "CJ frames 1Flaymr as loud but insufficiently controlled."],
                      ["Top-five claim", "He positions himself among GZone's stronger names."],
                      ["Main strength", "The writing has cleaner structure and stronger rebuttal direction."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'btizz-vs-1flaymr' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "1Flaymr",
                      highlights: [
                        ["Strong character branding", "Everything revolves around flames, smoke, fire, heat, and burning."],
                        ["Patois delivery", "His Jamaican-style delivery gives him a different sound from most of the roster."],
                        ["Fire schemes", "Avatar, Fire Nation, firebender, forest fire, snowman, and smoke references build a clear identity."],
                        ["Myth and religion imagery", "Moses and the Red Sea supply one of his strongest visual bars."],
                        ["Threat repetition", "Repeated bang, burn, and death language creates performance rhythm."],
                        ["Main weakness", "The performance has energy, but some bars lose impact because the wording is difficult to catch."]
                      ]
                    },
                    {
                      mc: "BTizz",
                      highlights: [
                        ["Counter-persona attack", "BTizz attacks the flame identity directly and ultimately frames 1Flaymr as extinguished."],
                        ["Crowd involvement", "Call-and-response moments such as fire for that and the name-spelling sections pull in the room."],
                        ["Hygiene and appearance angles", "Teeth, breath, body, face, and general cleanliness become repeated targets."],
                        ["Jamaican authenticity angle", "He questions whether 1Flaymr's Jamaican image is genuine or exaggerated."],
                        ["Scene references", "AJ, CJ-Zino, Deeno, Darren, and other GZone references give the battle wider context."],
                        ["Main strength", "BTizz has more direct control of the room and sounds more comfortable in the format."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === '2mwad-vs-ryno' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "Ryno",
                      highlights: [
                        ["Room-address opener", "Ryno calls out any MC who wants to clash, framing himself as ready for the whole platform."],
                        ["2Mad persona attack", "Social-media image, dancing, camera antics, clips, and sound effects become recurring targets."],
                        ["Name and status pressure", "Ryno treats 2Mad as someone beneath serious battle level."],
                        ["Music and rock references", "The Pen Zeppelin and Stairway to Heaven sequence gives him his strongest structured moment."],
                        ["Chess imagery", "Pawn and checkmate language attacks 2Mad's status in round three."],
                        ["Main weakness", "The intensity is not always matched by the same control or clear battle story."]
                      ]
                    },
                    {
                      mc: "2Mad",
                      highlights: [
                        ["Grounded life angles", "Housing, money, hygiene, employment, debt, and public image drive the attack."],
                        ["Strong visual writing", "Sleeping bag, pond, stains, KFC, bailiffs, and furniture create memorable pictures."],
                        ["Crowd impact", "The rounds repeatedly draw strong reactions from the room."],
                        ["Political and character attack", "Ryno is framed as having backward, unpleasant, or unreliable views."],
                        ["Social-status pressure", "2Mad makes Ryno look stuck in survival mode rather than progressing."],
                        ["Main strength", "The battle has a clearer overall narrative and more memorable crowd moments."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'deluxx-vs-btizz' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "Deluxx",
                      highlights: [
                        ["Comeback framing", "Deluxx presents an earlier loss as experience rather than proof that he is finished."],
                        ["Pen-based attack", "His strongest material focuses on writing, bars, and proving that he can still compete."],
                        ["Style-copying angle", "BTizz is accused of trying to move like Tapped24 without matching that level."],
                        ["Pop-culture touches", "The Lion King, Barbie and Ken, and Dragon Ball Z give the material recognisable shapes."],
                        ["Main weakness", "Useful ideas are limited by uneven structure and inconsistent control."]
                      ]
                    },
                    {
                      mc: "BTizz",
                      highlights: [
                        ["Room control", "BTizz earns stronger crowd reaction and handles live timing more confidently."],
                        ["Identity attack", "He repeatedly questions whether Deluxx's public image is authentic."],
                        ["Grime and music references", "Skepta's Shutdown and Birmingham's 0121 code strengthen the music frame."],
                        ["Ghostwriting angle", "The London Mikez accusation directly challenges Deluxx's pen."],
                        ["Performance branding", "Repeated name spelling stamps BTizz's identity into the battle."],
                        ["Main strength", "BTizz maintains the clearer narrative and stronger live performance."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'tapped24-vs-grams' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "Grams",
                      highlights: [
                        ["Image attack", "Clothes, shoes, freebies, lack of drip, and public presentation become repeated targets."],
                        ["Relationship angle", "Georgie is framed as someone being dragged down by Tapped."],
                        ["Parenting angle", "Children, CSA, food, debt, visibility, and responsibility support the fatherhood attack."],
                        ["Platform-status angle", "Grams argues that Tapped is not truly tapped, connected, or built for pressure."],
                        ["Pet and cat angle", "Grams turns care for his cats into a lifestyle and responsibility comparison."],
                        ["Main weakness", "Strong angles lose some structure amid crowd chaos, props, reloads, and interruptions."]
                      ]
                    },
                    {
                      mc: "Tapped24",
                      highlights: [
                        ["Pen Game legacy", "Tapped attacks Grams' old platform reputation and claims he damaged it himself."],
                        ["Fertility and family", "Grams' lack of a wife, children, and family structure becomes a repeated target."],
                        ["Age and status", "Tapped frames Grams as too old to remain in the same financial and career position."],
                        ["Platform war", "Fuck Pen Game turns the final into a wider statement of GZone loyalty."],
                        ["Screenshot allegations", "Alleged online behaviour and screenshots are used as serious character ammunition."],
                        ["Main strength", "Tapped makes the battle feel like GZone defending its territory against an outsider."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'ryno-vs-roman' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "Roman",
                      highlights: [
                        ["Angle control", "Roman builds repeated narratives around Ryno's housing, image, allegations, family, and credibility."],
                        ["Name and persona flips", "Rhino facts, animal imagery, and Roman squad references attack both identities."],
                        ["Direct character attacks", "He repeatedly frames Ryno as unsafe, fake, desperate, and morally questionable."],
                        ["Crowd control", "Deliberate pacing, repetition, and pauses create major reactions and reload moments."],
                        ["Strongest writing", "The best material links real-world details to battle consequences rather than relying only on shock."],
                        ["Main strength", "Roman makes the performance feel like a controlled takedown rather than a shouting match."]
                      ]
                    },
                    {
                      mc: "Ryno",
                      highlights: [
                        ["Aggressive retaliation", "Ryno responds with heavy personal attacks and tries to match Roman's darkness."],
                        ["Direct name attacks", "Roman's name and spelling patterns create repeated rhythm."],
                        ["Family and relationship angles", "Roman's ex, mother, father, children, and partner become major targets."],
                        ["Physical threat imagery", "Bodying, smoking, folding, drawing weapons, and war language appear throughout."],
                        ["Recovery energy", "He pushes through interruptions and restarts with high intensity."],
                        ["Main weakness", "Some writing feels scattered, while Roman's structure lands more cleanly."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'renzo-vs-proty' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "Renzo",
                      highlights: [
                        ["High-energy delivery", "Renzo relies on pace, repetition, and grime-style movement."],
                        ["Direct aggression", "He keeps attacking Proty's image, family, status, and credibility."],
                        ["0121 and Birmingham pride", "He repeatedly positions himself as representing his area."],
                        ["Name branding", "The Renzo and friendzone flip becomes one of his clearest identity moments."],
                        ["Gaming imagery", "Up, down, left, right, square, and triangle create a recognisable cheat-code sequence."],
                        ["Main weakness", "Some lines are difficult to catch because the delivery moves faster than the punch structure."]
                      ]
                    },
                    {
                      mc: "Proty",
                      highlights: [
                        ["Visual punchlines", "His strongest writing makes Renzo look cartoonish, dirty, broke, or drugged."],
                        ["Drug-use angle", "Sniff, Cali, ash, and being fried become repeated attack points."],
                        ["Money and status", "Social engagement, wasted profit, credit clothes, and cheap brands attack Renzo's image."],
                        ["Pop-culture references", "Muhammad Ali, Pennywise, Tails, Rizla, TKO, Red Bull, VK, and BK appear."],
                        ["Main strength", "The concepts are more clearly shaped and easier for the room to follow."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'cj-zino-vs-proty' && (
              <>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                  {[
                    {
                      mc: "CJ-Zino",
                      highlights: [
                        ["Arrival energy", "CJ performs like he wants to establish himself properly on GZone."],
                        ["Grime identity", "He repeatedly references grime, darkness, and getting grimy again."],
                        ["Family attacks", "Proty's father, mother, adoption angle, and relatives become repeated targets."],
                        ["Hygiene and illness", "Germs, flu, clothes, breath, and body references paint Proty as dirty or sickly."],
                        ["Street and status framing", "CJ treats Proty as someone not welcome or not built for GZone."],
                        ["Main weakness", "Some lines rely more on force than clean structure."]
                      ]
                    },
                    {
                      mc: "Proty",
                      highlights: [
                        ["Visual roast writing", "Pixar, Ratatouille, Tic Tac, Flushed Away, and Yanko shape his best comparisons."],
                        ["Breath and hygiene", "CJ's smell, face, breath, wristband, and bacteria become recurring targets."],
                        ["Drug-use accusations", "MDMA, cocaine, white lines, and wired behaviour are used to make CJ look messy."],
                        ["Comedy rhythm", "Proty uses a more humorous and image-heavy style than CJ."],
                        ["Self-branding", "Proty on the rhythm functions as a repeated identity stamp."],
                        ["Main weakness", "He lands jokes, but CJ sounds more dominant in the room."]
                      ]
                    }
                  ].map(({ mc, highlights }) => (
                    <div key={mc} className="mb-8 last:mb-0">
                      <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                      <div className="divide-y divide-white/10">
                        {highlights.map(([label, detail]) => (
                          <div key={label} className="py-3 first:pt-0 last:pb-0">
                            <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                            <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {battle.slug === 'tapped24-vs-ajna' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "Tapped24",
                    highlights: [
                      ["Veteran presence", "Tapped came in as the recognised battler and clearly understood how to control a hostile room."],
                      ["Disrespect-heavy writing", "His entire approach relied on personal and graphic attacks."],
                      ["Visual angles", "He used AJ's forehead, body, eyebrows, lazy eye, and appearance as repeated targets."],
                      ["Pop-culture references", "Dumbledore, Juggernaut, James and the Giant Peach, Austin Powers, TARDIS, High School Musical, Wiley, and Fergie appeared in his material."],
                      ["Name and status attacks", "He repeatedly tried to frame AJ as not ready for GZone and not on his level."],
                      ["Crowd call-and-response", "He involved the room directly during the \"run train\" section."],
                      ["Main weakness", "Some bars became too crude and overpacked, meaning the shock sometimes replaced actual punchline craft."]
                    ]
                  },
                  {
                    mc: "AJ / AJNA",
                    highlights: [
                      ["Shock debut", "AJ's first response immediately changed the energy of the battle."],
                      ["Aggressive rebuttal tone", "She attacked Tapped as harshly as he attacked her, removing any sense that she was overwhelmed."],
                      ["Sexuality and masculinity angles", "Much of her material tried to undermine Tapped's image as a tough male battler."],
                      ["Name flips", "She attacked the \"Tapped24\" identity directly."],
                      ["Drug-use angle", "She repeatedly referenced sniffing lines and drug imagery to attack his credibility."],
                      ["Crowd impact", "Her lines caused major reloads and visible room shock."],
                      ["Main weakness", "The writing could become raw and chaotic, but the performance energy carried it."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'ryno-vs-tymeless' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "Ryno",
                    highlights: [
                      ["Name-flip structure", "Ryno made heavy use of TymeLess' name through time, timing, timelines, clocks, timestamps, and time-of-death references."],
                      ["Aggressive opening round", "His first round came out with immediate pressure and set a hostile tone."],
                      ["Personal angles", "He attacked TymeLess' family, children, ADHD, public image, and alleged behaviour."],
                      ["Character accusations", "Ryno repeatedly tried to frame TymeLess as fake, unsafe, racist, or morally questionable."],
                      ["Live-room adaptation", "His \"recording time of death\" moment worked because he checked the actual time and made it feel improvised."],
                      ["Main weakness", "Some rounds became disrupted by the room, reloads, and timing confusion, weakening his control."]
                    ]
                  },
                  {
                    mc: "TymeLess",
                    highlights: [
                      ["Rebuttal energy", "TymeLess responded directly to Ryno's claims rather than just performing general material."],
                      ["Character assassination", "He focused on credibility, family trauma, homelessness, accusations, racism angles, and past behaviour."],
                      ["Crowd control", "His biggest moments got heavy room reaction and repeated reloads."],
                      ["Prop work", "The third-round items turned his hardship angle into a visual performance moment."],
                      ["Ryno name attacks", "He used \"Rhino/Ryno\" imagery, including animal and boxing-style references, to make Ryno look beatable."],
                      ["Main weakness", "Some material was extremely dark and trauma-based, meaning it can divide viewers even when it lands in the room."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'pr1nc3-vs-nattyebk' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "Natty EBK",
                    highlights: [
                      ["Shock-value pressure", "Natty attacked Prince's family, child loss, partner, and personal life from the start."],
                      ["Direct aggression", "He kept the tone hostile across all three rounds."],
                      ["Status attacks", "He repeatedly called Prince broke, old, fake, and beneath him."],
                      ["Family and partner angles", "Most of his strongest room pressure came from personal-life disrespect."],
                      ["Name and status flips", "He challenged whether \"Prince\" was really royal, respected, or powerful."],
                      ["Main weakness", "The writing often prioritised cruelty over clean punch structure."]
                    ]
                  },
                  {
                    mc: "PR1NC3",
                    highlights: [
                      ["Composure under attack", "Prince did not collapse after Natty's harsh first round."],
                      ["Credibility angles", "He attacked Natty as fake, lying, unstable, and not really dangerous."],
                      ["Prop work", "Listerine and Dove became a hygiene-based performance moment."],
                      ["Direct rebuttal tone", "Prince dismissed Natty's personal shots as obvious or ineffective."],
                      ["Redemption framing", "He positioned the battle as proof of himself after previous appearances."],
                      ["Main weakness", "Crowd noise and mic issues disrupted some sections, but clearer structure helped him recover."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'btizz-vs-cj-zino' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "BTizz",
                    highlights: [
                      ["High-energy opening", "BTizz started fast and framed the battle as destruction."],
                      ["Crowd chant work", "The repeated \"MVP\" section gave his first round a strong call-and-response feel."],
                      ["Name patterns", "He repeatedly used CJ Zino as a hook for punchlines."],
                      ["Pop-culture references", "Nemo, Dory, Kermit, Leon Edwards, UFC, GSP, American Dad, and Roger appeared in his material."],
                      ["Health and hygiene angles", "Disease, STDs, HIV, malaria, and cleanliness became recurring attacks."],
                      ["Main weakness", "He sometimes packed in too many shock angles without giving the strongest ones space to breathe."]
                    ]
                  },
                  {
                    mc: "CJ Zino",
                    highlights: [
                      ["Flow-theft angle", "CJ repeatedly suggested BTizz was copying Tapped24's flow."],
                      ["Hygiene imagery", "Listerine and cleanliness references created a visual insult package."],
                      ["Status control", "He framed himself as the only king in the ring."],
                      ["Direct personal attacks", "He focused on BTizz's job, relationships, image, confidence, and credibility."],
                      ["Final-round escalation", "CJ attacked multiple people before calling out Prince."],
                      ["Main weakness", "Some bars were loosely structured, but his delivery and room control helped carry them."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'deeno-vs-grams' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "Grams",
                    highlights: [
                      ["Surprise-entry momentum", "Grams weaponised the fact that Deeno did not expect him."],
                      ["Anti-Viking angle", "He repeatedly attacked Deeno's Viking image through Arthur, Odin, and war imagery."],
                      ["Body and stamina angles", "Size became a repeated target linked to running, burpees, bikes, and physical ability."],
                      ["Race and identity shots", "Grams challenged Deeno's use of language and culture he viewed as inauthentic."],
                      ["Pop-culture schemes", "Kirby, Arthur, Caesar, Shrek, Ed Sheeran, Harry Potter, Ron Weasley, Fiona, and Daphne shaped the imagery."],
                      ["Main strength", "He made the surprise feel intentional and controlled rather than like a random interruption."]
                    ]
                  },
                  {
                    mc: "Deeno",
                    highlights: [
                      ["Freestyle recovery", "Deeno responded to an unexpected opponent with battle-ready material."],
                      ["Name flips", "He used Grams for weed, weight, smoking, and weighing punches."],
                      ["Platform-status angle", "Deeno framed GZone as his stage and Grams as someone entering his territory."],
                      ["Scene callouts", "He addressed wider names and positioned himself as a central figure."],
                      ["Age and responsibility angle", "He attacked Grams for being older without children or clear direction."],
                      ["Main strength", "He recovered from the ambush and turned the battle into a wider GZone statement."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'pr1nc3-vs-roman' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "PR1NC3",
                    highlights: [
                      ["Aggressive opener", "PR1NC3 started by attacking Roman's look, size, trim, drip, and bars."],
                      ["Youth versus veteran", "He repeatedly framed Roman as old, outdated, and past his best."],
                      ["Physical threat imagery", "Punches, body bags, hooks, left-rights, and ring language appeared throughout."],
                      ["Royal name branding", "He used \"Prince\" as status and claimed Roman could not war with him."],
                      ["Fake choke moment", "The \"forgot my bars\" fake-out worked as a small performance trick."],
                      ["Main weakness", "Some material leaned generic beside Roman's more developed schemes."]
                    ]
                  },
                  {
                    mc: "Roman",
                    highlights: [
                      ["Sharper wordplay", "Roman's writing used more layered references and stronger setups."],
                      ["Royal counter-angle", "He flipped PR1NC3's name through Buckingham Palace, upper-class bars, and \"Princess\" framing."],
                      ["Crowd control", "Finger-pointing, pauses, and reload moments helped Roman own the room."],
                      ["Age and height attacks", "PR1NC3's youth and tall build became recurring angles."],
                      ["Personal disrespect", "Roman heavily targeted family, girlfriend, and background."],
                      ["Main strength", "He made the battle feel like his stage through more memorable moments."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "LDN Mikez",
                    highlights: [
                      ["Heavy shock opening", "Mikez immediately set a harsh tone with identity, family, and sexuality-based disrespect."],
                      ["Room control", "He earned multiple reloads and held the crowd's attention."],
                      ["Name attack", "He stripped \"Deluxx\" back to \"Devonte,\" making the opponent feel less impressive."],
                      ["Real-world angles", "Universal Credit, landlord payments, Christmas, Wi-Fi, and depression gave the writing grounded bite."],
                      ["Performance confidence", "Even after restarts, he sounded more controlled than Deluxx."],
                      ["Main strength", "Clearer aggression, stronger delivery, and bigger crowd reaction."]
                    ]
                  },
                  {
                    mc: "Deluxx",
                    highlights: [
                      ["Rebuttal attempts", "Deluxx attacked Mikez's look, age, mum, music, and flow."],
                      ["Name and location contrast", "He used \"London Mikez\" against him while claiming to be king of the mic."],
                      ["Flow switches", "He attempted faster pockets and freestyle-style patterns."],
                      ["Pop-culture references", "Atlantis, Aquaman, A1J1, Renzo, Lockjaw, boxing, and trap imagery appeared."],
                      ["Main weakness", "Clarity and projection did not consistently match Mikez's energy."],
                      ["Best angle", "Calling Mikez dusty, fake, and less sharp than he claimed."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "2MWAD",
                    highlights: [
                      ["Stepdad gaming scheme", "DLC, NPC, XP, side quest, and player one attacked Mikez's role raising another man's children."],
                      ["Fatherhood angle", "He repeatedly questioned Mikez's position as a stepfather and provider."],
                      ["Money and status shots", "Online banking, McFlurry money, council housing, and broke-family angles grounded the disrespect."],
                      ["Drug accusations", "Coke and sniffing references portrayed Mikez as unstable or messy."],
                      ["EastEnders scheme", "Frank, Butcher, Heather, Tracy, Shirley, and Bianca shaped the final round."],
                      ["Main weakness", "Strong ideas, but Mikez produced cleaner crowd impact and greater room control."]
                    ]
                  },
                  {
                    mc: "LDN Mikez",
                    highlights: [
                      ["High-pressure delivery", "Mikez sounded more commanding and confident across the battle."],
                      ["Personal retaliation", "He answered family angles with even harsher family and character attacks."],
                      ["Crowd control", "He repeatedly earned reloads and room reaction."],
                      ["Real-world punchlines", "Universal Credit, nursery, ringtone, Spotify, and soap references grounded the material."],
                      ["Name and status framing", "He presented himself as the established GZone figure and 2MWAD as a lesser challenger."],
                      ["Main strength", "He made the battle feel like his stage even when 2MWAD had strong written angles."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'deeno-vs-badee-harz' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
                {[
                  {
                    mc: "Deeno",
                    highlights: [
                      ["Platform authority", "He repeatedly frames GZone as his house and Badee as someone stepping into his space."],
                      ["Newcomer attack", "He questions why she is rapping and whether she belongs on the platform."],
                      ["Body and age angles", "He targets her waistline, age, appearance, and physical image."],
                      ["Family angles", "Her personal life, children, and partners form part of his attack package."],
                      ["Pop-culture references", "Jafar, Tarzan, AJ, Epstein, and Blackpool appear in his material."],
                      ["Main weakness", "Shock-value insults sometimes overpower the cleaner battle-writing ideas."]
                    ]
                  },
                  {
                    mc: "Badee Harz",
                    highlights: [
                      ["Debut pressure", "She responds confidently despite being introduced as a newcomer."],
                      ["Anti-Deeno angle", "She attacks his record against women and casts herself as another loss in that pattern."],
                      ["Family and sibling shots", "Deeno's brother, sister, and family names become direct personal ammunition."],
                      ["Reputation attack", "She questions his jail claims, platform history, and battle credibility."],
                      ["Self-branding", "She clearly positions herself as the baddest woman on GZone."],
                      ["Main strength", "Her material is direct, personal, and designed to show that she is not intimidated."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug === 'nattyebk-vs-zk' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "NattyEBK",
                    highlights: [
                      ["Best round", "Round three."],
                      ["Strongest trait", "Aggression and room control."],
                      ["Best angle", "Z.K being unfit to stand against him in GZone."],
                      ["Biggest reaction", "The third-round flow switch and rising crowd energy."],
                      ["Main weakness", "Some of the harshest material was loosely structured."]
                    ]
                  },
                  {
                    mc: "Z.K",
                    highlights: [
                      ["Best round", "Round two."],
                      ["Strongest trait", "Clear writing and structured references."],
                      ["Best angle", "Natty's image, finances, and credibility."],
                      ["Key references", "BBK, CCJs, Virgil van Dijk, Tekken, Wiley, and Pokemon."],
                      ["Main weakness", "Less explosive than Natty in the live room."]
                    ]
                  }
                ].map(({ mc, highlights }) => (
                  <div key={mc} className="mb-8 last:mb-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-3">{mc}</h4>
                    <div className="divide-y divide-white/10">
                      {highlights.map(([label, detail]) => (
                        <div key={label} className="py-3 first:pt-0 last:pb-0">
                          <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                          <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {battle.slug !== 'nattyebk-vs-zk' && battle.slug !== 'deeno-vs-tapped24' && battle.slug !== 'cj-zino-vs-1flaymr' && battle.slug !== 'tapped24-vs-roman' && battle.slug !== 'tapped24-vs-ajna' && battle.slug !== 'tapped24-vs-grams' && battle.slug !== 'ryno-vs-tymeless' && battle.slug !== 'pr1nc3-vs-nattyebk' && battle.slug !== 'btizz-vs-cj-zino' && battle.slug !== 'btizz-vs-1flaymr' && battle.slug !== 'cj-zino-vs-proty' && battle.slug !== 'renzo-vs-proty' && battle.slug !== 'ryno-vs-roman' && battle.slug !== 'deluxx-vs-btizz' && battle.slug !== '2mwad-vs-ryno' && battle.slug !== 'deeno-vs-grams' && battle.slug !== 'deeno-vs-badee-harz' && battle.slug !== 'pr1nc3-vs-roman' && battle.slug !== 'ldn-mikez-vs-deluxx' && battle.slug !== 'ldn-mikez-vs-2mwad' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {(battle.slug === 'deeno-vs-tymeless' ? [
                  ["Deeno", "Time-name flips::TymeLess' name became a route into time, reverse, replay, death, and pressure writing.|Platform authority::Deeno performed like the established GZone regular defending home territory.|Gaming structure::GTA, Big Smoke, CJ, final-mission, game-over, and replay references created a connected scheme.|Pop-culture attacks::Michael Jackson, Thriller, The Simpsons, Smithers, and Beta Squad imagery gave the rounds recognisable moments.|Status pressure::Age, money, battle history, and career range were used to question TymeLess' position.|Crowd control::Deeno maintained force and presence through noisy, reactive passages.|Best quality::His cleanest material was tailored directly to TymeLess' name and identity.|Main weakness::Some heavier personals obscured the sharper name flips and structured ideas."],
                  ["TymeLess", "Comic performance::Humour, pauses, repetition, and visual delivery turned individual punches into larger moments.|Toilet narrative::The locked toilets, taking-the-piss phrase, chair, and throne developed into a complete opening scheme.|Visual references::Keith Lemon, Prince Harry, Paul Scholes, Weasley, Simon Pegg, and the Sugar Puff Monster built sustained character pressure.|Prop use::The lemons were introduced, repeated, and paid off with the squeezing punchline.|Silver-fox contrast::TymeLess turned his own grey hair into confidence while making Deeno's ginger image look worn and comic.|Room involvement::Ginger Jay, reloads, and local GZone references made the audience part of the performance.|Best quality::Callbacks and running themes gave all three rounds a shared identity.|Winning edge::Stronger structure, bigger memorable moments, and better crowd connection carried the decision."]
                ] : [[mc1?.name || battle.mc1, ""], [mc2?.name || battle.mc2, ""]]).map(([name, highlights]) => (
                  <div key={name} className="mb-6 pb-6 border-b border-white/10 last:mb-0 last:pb-0 last:border-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-2">{name}</h4>
                    {highlights ? <div className="divide-y divide-white/5">{highlights.split("|").map((item) => { const [label, detail] = item.split("::"); return <div key={label} className="py-3 first:pt-0 last:pb-0"><h5 className="text-white text-sm font-bold mb-1">{label}</h5><p className="text-zinc-400 text-xs leading-relaxed">{detail}</p></div>; })}</div> : <p className="text-zinc-600 text-xs uppercase tracking-widest">Coming soon</p>}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
