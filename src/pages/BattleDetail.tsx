import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Helmet } from "react-helmet";
import { battles as allBattles } from "../data/battles";
import { mcs } from "../data/mcs";
import { deenoNotableBars, tapped24NotableBars } from "../data/deenoTapped24Bars";
import { ArrowLeft, Play, Share2, Trophy, Clock, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>{battle.title} | Gzone Rap Battle</title>
        <meta name="description" content={`Watch ${mc1?.name} vs ${mc2?.name} from Gzone Rap Battle League Season 1.`} />
        <meta property="og:title" content={`${battle.title} | Gzone Rap Battle`} />
        <meta property="og:description" content={`Watch ${mc1?.name} vs ${mc2?.name} from Gzone Rap Battle League Season 1.`} />
        {battle.videoUrl && <meta property="og:image" content={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} />}
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
          className="inline-flex items-center gap-3 text-zinc-500 hover:text-brand transition-all mb-12 uppercase tracking-[0.4em] text-[10px] font-black group/back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to battles
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Battle Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-display uppercase leading-tight mb-8">
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
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display uppercase text-white">Battle Result</h2>
                <p className="text-zinc-400 text-sm mt-2 tracking-widest">
                  {battle.winner ? "Official Judges' Decision" : "Awaiting Decision"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center font-display text-zinc-400 z-10">
                  VS
                </div>

                {/* MC1 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${battle.winner === mc1?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc1?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc1?.id ? 'mt-8' : ''}`}>
                    <Link to={`/mc/${mc1?.slug}`} aria-label={`View ${mc1?.name}'s profile`} className="text-3xl font-display uppercase hover:text-brand transition-colors">{mc1?.name}</Link>
                  </div>
                </div>

                {/* MC2 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${battle.winner === mc2?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc2?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc2?.id ? 'mt-8' : ''}`}>
                    <Link to={`/mc/${mc2?.slug}`} aria-label={`View ${mc2?.name}'s profile`} className="text-3xl font-display uppercase hover:text-brand transition-colors">{mc2?.name}</Link>
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

            {battle.slug !== 'deeno-vs-tapped24' && (
              <>
                {battle.slug !== 'tapped24-vs-ajna' && battle.slug !== 'ryno-vs-tymeless' && battle.slug !== 'pr1nc3-vs-nattyebk' && battle.slug !== 'btizz-vs-cj-zino' && (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Performance Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[mc1?.name || battle.mc1, mc2?.name || battle.mc2].map((name) => (
                        <article key={name} className="min-h-40 bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
                          <p className="text-zinc-600 text-sm uppercase tracking-widest">Coming soon</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {battle.slug === 'tapped24-vs-ajna' ? (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                      <span className="w-8 h-1 bg-brand" />
                      Notable Bars &amp; Real-World Explanation by MC
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
                                <h4 className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</h4>
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
                      Notable Bars &amp; Real-World Explanation by MC
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
                                <h4 className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</h4>
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
                      Notable Bars &amp; Real-World Explanation by MC
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
                                <h4 className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</h4>
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
                      Notable Bars &amp; Real-World Explanation by MC
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
                                <h4 className="text-white font-bold leading-relaxed mb-3">&ldquo;{bar}&rdquo;</h4>
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
                      {[mc1?.name || battle.mc1, mc2?.name || battle.mc2].map((name) => (
                        <article key={name} className="min-h-40 bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                          <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
                          <p className="text-zinc-600 text-sm uppercase tracking-widest">Coming soon</p>
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

            {battle.slug !== 'deeno-vs-tapped24' && battle.slug !== 'tapped24-vs-ajna' && battle.slug !== 'ryno-vs-tymeless' && battle.slug !== 'pr1nc3-vs-nattyebk' && battle.slug !== 'btizz-vs-cj-zino' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[mc1?.name || battle.mc1, mc2?.name || battle.mc2].map((name) => (
                  <div key={name} className="mb-6 pb-6 border-b border-white/10 last:mb-0 last:pb-0 last:border-0">
                    <h4 className="text-brand font-display uppercase text-lg mb-2">{name}</h4>
                    <p className="text-zinc-600 text-xs uppercase tracking-widest">Coming soon</p>
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
