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
  const leagueName = battle.league === "freestyle" ? "Freestyle League" : "Season 1";
  const archivePath = battle.league === "freestyle" ? "/freestyle" : "/battles";
  const archiveLabel = battle.league === "freestyle" ? "Freestyle" : "Battles";

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
        <meta name="description" content={`Watch ${mc1?.name} vs ${mc2?.name} from the Gzone ${leagueName}.`} />
        <meta property="og:title" content={`${battle.title} | Gzone Rap Battle`} />
        <meta property="og:description" content={`Watch ${mc1?.name} vs ${mc2?.name} from the Gzone ${leagueName}.`} />
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
          to={archivePath}
          aria-label={`Back to ${archiveLabel}`}
          className="inline-flex items-center gap-3 text-zinc-500 hover:text-brand transition-all mb-6 md:mb-12 uppercase tracking-[0.4em] text-[10px] font-black group/back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to {archiveLabel}
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

            {battle.slug === 'deeno-vs-btizz' && battle.props && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Deeno vs Btizz arrived earlier than the room expected. Btizz was introduced as the roster climber, while Deeno entered under his self-declared GZone-king identity. Across three rounds, the clash became a contest between Deeno&apos;s opponent-specific angle construction and Btizz&apos;s changing flows, live confidence, and attempt to turn GZone history back on the home favourite.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Deeno made round one personal immediately. The Oliver Twist setup linked Btizz&apos;s repeated requests for the battle to the neglected-child and absent-parent angle, while the clothing and hygiene material reused CJ Zino&apos;s earlier criticism as supporting evidence. A mistaken &ldquo;Tap 22&rdquo; call in the room also gave Deeno an opening to reshape the line into a live Catch-22 punch.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Btizz answered by presenting his previous GZone clashes as a climb through the roster. Deluxx, CJ Zino, and 1Flaymr all became part of his résumé before he attacked Deeno&apos;s king claim through the loss to TymeLess. His Mission: Impossible, Benji Dunn, and Simon Pegg sequence also evolved a visual comparison TymeLess had already used against Deeno into a connected film scheme.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Round two made the battle increasingly self-referential. Deeno reversed Btizz&apos;s repeated murder language through &ldquo;red rum&rdquo;, challenged his authenticity, and attacked the flows and gimmicks behind his rise. Btizz changed cadence, deliberately mirrored Deeno&apos;s delivery, revisited the lemon motif from Deeno&apos;s loss to TymeLess, and continued trying to turn Deeno&apos;s home platform into his own territory.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Deeno&apos;s third was the most complete narrative round. He anticipated the copied flow, said he had &ldquo;flipped the script&rdquo;, used a Google Maps screenshot of Btizz&apos;s modest family home and a photograph of a headstone inscribed with &ldquo;Btizz&rdquo;, then presented adoption papers to prove he was going to &ldquo;father&rdquo; Btizz. Ben 10, Blade, Batman, Robin, Bruce Wayne, two-day preparation, and Blu-ray references gave the round a clearer technical route around the visual props.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light">
                      Btizz closed with another flow-heavy round built around taking the crown, making himself comfortable in Deeno&apos;s house, Lego bricks, Family Guy, and rapid internal-rhyme pockets. Repeated restarts and crowd interruptions weakened the shape of the round, while Deeno&apos;s visual sequence left the cleaner final impression. The first audience call was close enough for the host to repeat it; the official battle record awards the win to Deeno.
                    </p>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-display uppercase text-white mb-8">Evidence: Props Used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.props.map((prop) => (
                      <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                        <div className="w-16 h-16 shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div>
                          <p className="text-white font-bold">{prop.name}</p>
                          <p className="text-zinc-500 text-sm uppercase tracking-widest">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Deeno", "Personal framing", "Deeno connects Btizz's repeated requests for the matchup to Oliver Twist, neglect, and absent-parent material. He then uses CJ Zino's earlier clothing criticism and the live Tap 22 mistake to make the round feel researched but still reactive."],
                      ["Round 1 — Btizz", "Résumé and record rebuttal", "Btizz names Deluxx, CJ Zino, and 1Flaymr to present himself as a rising problem, then rejects the Deeno 3-0 and king narrative by pointing to TymeLess. Film, cartoon, disappearance, and territory references keep the round moving through varied pockets."],
                      ["Round 2 — Deeno", "Scheme reversal", "Deeno challenges Btizz's road claims and roster status before turning the repeated murder language into red rum, literally reversing the word. The Jamaican-AI and Rayman Rabbid material then shifts the round toward identity and visual comedy."],
                      ["Round 2 — Btizz", "Cadence switch and inherited angles", "Btizz addresses earlier booking problems, claims the clash as a test against himself, copies Deeno's cadence, and reuses the lemon image from TymeLess's win. The round is designed to show adaptation rather than one fixed flow."],
                      ["Round 3 — Deeno", "Prebuttal, props, and payoff", "Deeno predicts the copied flow and frames his answer as a script flip. The house screenshot, headstone photograph, and adoption papers turn the family, death, and father-son angles into visible evidence. He presents the papers as proof that he will “father” Btizz and becomes someone Btizz can rely on."],
                      ["Round 3 — Btizz", "Crown challenge and extended freestyle energy", "Btizz continues the house takeover, crown, Lego, Family Guy, and appearance schemes through faster internal rhymes. The energy remains high, but several restarts and arguments over wording make the round less controlled than Deeno's closing structure."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Catch-22 from Tap 22", "After the room mistakenly says Tap 22, Deeno returns with Catch-22. The change is small but clearly live, turning an interruption into material."],
                      ["CJ Zino's clothing angle", "Deeno explicitly cites CJ's claim that Btizz never changes clothes. An earlier opponent's angle is reused as corroboration rather than repeated as a standalone insult."],
                      ["Btizz's résumé recap", "Deluxx, CJ Zino, and 1Flaymr are folded into Btizz's opening. He converts the archive into a progress report: two recorded wins, one disputed loss, and a claim that Deeno is the next step."],
                      ["TymeLess as the record rebuttal", "Btizz answers Deeno's king and 3-0 language by reminding the room that TymeLess beat him. The reference attacks status with an official previous result rather than a hypothetical threat."],
                      ["Murder becomes red rum", "Btizz repeatedly uses murder as a signature word. Deeno says he will flip the scheme and spill red rum, using the word written backwards to turn Btizz's own language against him."],
                      ["Borrowed flow becomes deliberate mirroring", "CJ Zino and Deluxx had already challenged Btizz's originality and linked his delivery to Tapped24. Here Btizz openly imitates Deeno's cadence, Deeno acknowledges that he did it well, and then begins round three by saying he knew the copy was coming. A previous weakness becomes an intentional battle tactic and then a prebuttal."],
                      ["The lemon scheme returns", "TymeLess used repeated lemons and a squeezing payoff in his win over Deeno. Btizz brings lemons back and says Deeno can lose to them again, turning the most memorable prop from that clash into inherited pressure."],
                      ["Simon Pegg develops into a film scheme", "TymeLess had used Simon Pegg and Shaun of the Dead as a visual comparison. Btizz keeps the lookalike angle but connects it to Mission: Impossible and Benji Dunn, developing the reference instead of merely repeating the name."],
                      ["House ownership keeps changing hands", "TymeLess previously said Deeno's throne was not secure and claimed the house. Btizz first turns Deeno's yard into a palace, then says he has his feet up and feels cosy. The repeated house language tracks a wider GZone challenge to Deeno's authority."],
                      ["Father-and-son banter becomes structure", "Both men call the other their son between rounds. Deeno physically presents adoption papers to say he will “father” Btizz, so spontaneous banter becomes the organising relationship of the closing round."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

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
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Episode 21 was a main-event contest over who could control GZone itself. Deeno opened as the established home figure, while TymeLess arrived with the official win over Ryno already behind him. Across three rounds, Deeno tried to defend his status through tailored name flips and direct pressure; TymeLess answered by turning live circumstances, earlier clashes, physical props, and the people in the room into one connected performance.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Deeno&apos;s first round declared GZone &ldquo;my house&rdquo; before moving through security, the recent headlock controversy, TymeLess&apos; family, age, grey hair, battle record, and public image. TymeLess began his reply by pretending that his own stomach was hurting, briefly convincing the room before revealing that the complaint was a setup. Crohn&apos;s disease, IBS, locked toilets, taking the piss, the blocked toilet, and a plunger then developed toward the larger claim that Deeno&apos;s chair at GZone was not a throne.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Round two separated their approaches. Deeno built his cleanest connected sequence through GTA, Big Smoke, CJ, a final mission, game over, and no replay, while also revisiting parenting and racism allegations previously used against TymeLess. TymeLess answered through visual character writing: Keith Lemon became a recurring physical motif, his own grey hair became a silver-fox rebuttal, and Deeno was compared with Ginga Jay, Prince Harry, Paul Scholes, Weasley, Simon Pegg, Shaun of the Dead, and the Sugar Puff Monster.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      Deeno&apos;s third returned to TymeLess&apos; identity. Time, no reverse, William, smoking, cereal and serial-killer sounds, Thriller, and Smithers gave the round its strongest tailored writing. He also tried to answer the fruit gimmick with a lemonade line, but the restart weakened the rebuttal. TymeLess then reversed Deeno&apos;s parenting attack by addressing Deeno&apos;s son as a new stepfather, promising to provide for him, and saying that his real father was dead.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">
                      TymeLess extended the closing round through the Kelly, Machine Gun Kelly, R. Kelly, Miss Trunchbull, and 125 sequences before revealing a third lemon. The final &ldquo;get lemon, get squeezed&rdquo; punch paid off a visual idea that had been introduced, repeated, interrupted, and carried through the full battle rather than used for one isolated reaction.
                    </p>
                    <p className="text-zinc-300 leading-relaxed font-light">
                      The crowd awarded the battle to TymeLess. Deeno produced strong individual schemes and defended his platform position with conviction, but TymeLess had the clearer three-round identity: a fake sickness setup became a toilet narrative and throne challenge, the ginger comparisons became a sustained character portrait, and the lemons became the image later opponents would reuse as shorthand for Deeno&apos;s defeat.
                    </p>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-display uppercase text-white mb-8">Evidence: Props Used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.props?.map((prop) => (
                      <div key={prop.name} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                        <div className="w-16 h-16 shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div>
                          <p className="text-white font-bold">{prop.name}</p>
                          <p className="text-zinc-500 text-sm uppercase tracking-widest">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Deeno", "Home advantage and personal pressure", "Deeno begins by claiming GZone as his house. Security, the recent headlock incident, TymeLess's family, age, grey hair, public image, and limited battle history support the argument that the visitor does not belong at the centre of Deeno's platform."],
                      ["Round 1 — TymeLess", "Fake stomach complaint becomes a throne challenge", "TymeLess pretends that his own stomach hurts and lets the room believe him before revealing the trick. Crohn's disease, IBS, locked toilets, taking the piss, the blocked toilet, and the plunger then become a planned narrative about Deeno. The chair and toilet imagery finishes as a status attack: GZone is not Deeno's throne or his exclusive house."],
                      ["Round 2 — Deeno", "Gaming structure and inherited accusations", "Deeno's strongest connected writing moves through GTA, Big Smoke, CJ, the final mission, game over, and no replay. Parenting pressure and the three-K accusation also revisit angles already used against TymeLess in the Ryno clash."],
                      ["Round 2 — TymeLess", "Visual identity and room involvement", "Keith Lemon and the physical fruit props lead into a sustained ginger-comparison run. TymeLess flips grey hair into a silver-fox boast, involves Ginga Jay in the performance, and uses British film, football, royal, fantasy, and cereal references to keep the imagery immediate."],
                      ["Round 3 — Deeno", "Name flips and an attempted fruit rebuttal", "Time, no reverse, William, smoking, cereal, serial killer, Thriller, and Smithers return the focus to TymeLess's identity. Deeno tries to answer the running gimmick with lemonade, but the stumble and restart stop the line from fully reversing the prop pressure."],
                      ["Round 3 — TymeLess", "Parenting reversal and three-round payoff", "TymeLess addresses Deeno's son as a new stepfather and turns Deeno's own parenting attack back on him. Kelly, Machine Gun Kelly, R. Kelly, Miss Trunchbull, and 125 carry the round to the third-lemon reveal and the final squeezing payoff."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["TymeLess tricks the room with a fake complaint", "TymeLess claims that his own stomach is hurting and says he will try his best, allowing the room to accept the apparent weakness. He then reveals the misdirection with the Crohn's disease line and continues through IBS, squeezing, toilets, the plunger, taking the piss, and the GZone chair. The sequence is a performed setup, not a response to Deeno admitting illness."],
                      ["Ryno's TymeLess angles are inherited", "Ryno had already used TymeLess's real name William, time travel, parenting criticism, and racism allegations in Episode 11. Deeno develops those routes through the spliff line, no-reverse writing, the weekday question, and the three-K accusation rather than introducing them as new discoveries."],
                      ["TymeLess brings the Ryno clash back into the room", "TymeLess explicitly invokes Ryno while changing flow, and Deeno later dismisses TymeLess's bars through Ryno's dance. The previous clash therefore supplies both a cadence reference and local evidence inside Episode 21."],
                      ["Prop performance evolves from Episode 11", "Against Ryno, TymeLess used socks, underwear, a toothbrush, soap, and Pot Noodle to make an alleged living situation visible. The plunger, photograph, and three lemons refine the same tactic: physical objects organise the round instead of appearing only at the finish."],
                      ["The Tapped24 and Grams incident remains active", "Both battlers reference the headlock and security controversy from Episode 15. Deeno says he would react if anyone tried it on him; TymeLess addresses Grams and imagines the headlock being applied to Deeno. A recent physical incident becomes shared battle-world context."],
                      ["Deeno's home claim becomes a throne rebuttal", "Deeno had already called GZone his home and said he ran it in the Badee Harz clash. Here he opens with the same house claim, but TymeLess joins the toilet and chair images to argue that Deeno's seat is not a throne before claiming the house for himself."],
                      ["Age pressure is reversed into the silver fox", "Deeno mocks TymeLess for rapping with grey hair. TymeLess concedes the visible fact but changes its meaning: Deeno is a scruffy ginger fox, while he is the silver fox. The rebuttal is stronger because it absorbs the attack instead of denying it."],
                      ["Ginga Jay becomes part of the scheme", "The ginger comparison expands from Deeno to host Ginga Jay. Reloads and live reactions are folded into the material, making the room appear to confirm TymeLess's visual argument rather than simply watch it."],
                      ["Parenting pressure changes direction", "Deeno asks why TymeLess does not see his children on weekdays, echoing the Ryno clash. TymeLess later speaks directly to Deeno's son, casts himself as the new stepfather, promises to provide for him, and declares the real father dead. An inherited angle becomes a direct third-round reversal."],
                      ["The lemon has setup, counter and payoff", "Keith Lemon starts as an appearance comparison, becomes a sequence of physical lemons, survives Deeno's attempted lemonade rebuttal, and finishes with the third-lemon squeezing line. Episode 22 then reuses the fruit as shorthand for the official loss."],
                      ["Simon Pegg develops in Episode 22", "TymeLess uses Simon Pegg and Shaun of the Dead as a visual comparison. Btizz later preserves Simon Pegg but links him to Mission: Impossible and Benji Dunn, turning the inherited image into a connected film scheme."],
                      ["House, throne and result become Btizz's evidence", "Btizz uses TymeLess's official win to challenge Deeno's king claim, brings the lemons back, and develops the house dispute into palace, feet-up, cosy, and crown material. Episode 21 is therefore the source battle for several of Episode 22's strongest callbacks."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
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
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 14 was built around a genuine preparation imbalance. Deeno was introduced for a matchup with 2 Man, but Grams emerged as the surprise opponent. Grams could attack a known target with prepared material; Deeno had to abandon the expected clash, absorb the reveal, and build a large part of his response from live observation, existing scene knowledge, and freestyle recovery.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Grams used the surprise immediately. Deeno&apos;s Viking name, weight, speech, drinking, parenting, treatment of women, race identity, clothes, credibility, and claim to leadership were attacked through Odin, Arthur, Harry Potter, Shrek, Scooby-Doo, Ed Sheeran, glass-house imagery, and the argument that Deeno was being marketed as something he was not.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Deeno acknowledged that the switch had rattled him, but made adaptation the point of his performance. Grams became weed, weight, weighing, age, outsider, Pen Game, and comeback material. Rather than pretending every line was prepared, Deeno repeatedly identified the freestyle process and used the home room as support while he assembled opponent-specific attacks.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">The middle rounds exposed the tradeoff. Grams had the cleaner anti-Viking and image schemes, while Deeno&apos;s stops and moments of uncertainty gave future opponents a visible &ldquo;mind went blank&rdquo; angle. At the same time, recovering in public strengthened a different part of Deeno&apos;s identity: GZone as his home and a place he could still command without a prepared opponent.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">The third widened Deeno&apos;s response beyond Grams. Platform status, other scene names, fatherhood, and the idea that he had helped build or guide GZone became part of the close. That father-figure posture later develops into the adoption-paper performance against Btizz, while the home claim becomes a central dispute with Badee Harz, TymeLess, and Btizz.</p>
                  <p className="text-zinc-300 leading-relaxed font-light">The final crowd check and official GZone record awarded the battle to Deeno; the host reinforced the result by calling GZone his home. Grams created the surprise and landed the cleaner pre-written deconstruction, but Deeno&apos;s adaptation, freestyle recovery, home-room command, and stronger final positioning carried the decision.</p>
                </div>
              </section>
            )}

            {battle.slug === 'deeno-vs-grams' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Grams", "The ambush defines the target", "Grams uses the surprise advantage to attack the Viking identity, weight, speech, drinking, parenting, women, clothes, and credibility through prepared fantasy, celebrity, and visual comparisons."],
                      ["Round 1 — Deeno", "Shock turns into live construction", "Deeno admits the replacement affected him, then starts building from Grams' name, weed, weight, age, outsider status, scene history, and what he can observe in the room rather than hiding the freestyle process."],
                      ["Round 2 — Grams", "Anti-Viking case and image pressure", "Odin, Arthur, Harry Potter, Shrek, Scooby-Doo, Ed Sheeran, glass houses, women, and marketing language argue that Deeno's stage character and leadership image are manufactured."],
                      ["Round 2 — Deeno", "Freestyle recovery and home support", "Stops and uncertainty expose the preparation gap, but Deeno repeatedly restarts through opponent-specific name flips, platform references, and direct acknowledgement that he is creating material live."],
                      ["Round 3 — Grams", "Prepared detail against the comeback", "Grams maintains pressure on image, authenticity, family, and the Viking claim, trying to make the surprise itself proof that Deeno cannot perform when the expected script disappears."],
                      ["Round 3 — Deeno", "Status, fatherhood, and the wider scene", "Deeno broadens from Grams to GZone, other names, outsider status, and a father-figure role, turning survival of the ambush into a claim that his platform position is larger than one prepared clash."]
                    ].map(([round, focus, detail]) => <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p><h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>)}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The opponent switch is the battle's first fact", "Deeno expected 2 Man and received Grams. The preparation gap explains both Grams' cleaner tailored schemes and Deeno's visible stops; it is not merely background to the performance."],
                      ["Freestyling becomes an explicit defence", "Grams tells Deeno that he is not a freestyler; Deeno repeatedly identifies that he is working live. Instead of denying the imbalance, he asks the room to value adaptation as a separate battle skill."],
                      ["The house claim continues Episode 1", "Deeno had already called GZone his house against Tapped24. The host closes Episode 14 by saying this is his home, turning a self-declared slogan into the event's explanation for why the crowd supports his recovery."],
                      ["Grams creates the mind-blank angle", "The stops are visible enough that Badee Harz later says Deeno's mind went blank against Grams and calls his next stumble another choke. A weakness exposed by surprise becomes reusable performance history."],
                      ["The anti-Viking route becomes established", "Grams uses Odin, Arthur, fantasy characters, image, and marketing to argue that Deeno is not a Viking. Later opponents inherit the idea that the name is branding open to authenticity tests."],
                      ["Pen Game and GZone begin to collide", "Deeno treats Grams as an outsider using GZone for a comeback. In Episode 15 Tapped expands the same pressure into a full Pen Game versus GZone loyalty war."],
                      ["Grams carries the result directly forward", "The next episode opens with Tapped accusing Grams of damaging his Pen Game legacy through repeated deaths. Episode 14 is not left as a standalone loss; it becomes the status setup for the following booking."],
                      ["Home ownership changes hands in Episode 15", "After the host calls GZone Deeno's home, Grams tells Tapped that it is his home now. Tapped rejects that claim through go-home and fuck-Pen-Game refrains, showing the territory language evolving immediately."],
                      ["Fatherhood expands from private to platform", "Deeno and Tapped attacked each other's parenting in Episode 1. Against Grams, Deeno widens the posture into being a father figure around GZone, connecting family authority with platform authority."],
                      ["The father role reaches adoption papers", "Against Btizz in Episode 22, Deeno presents adoption papers and says he will father his opponent. The prop is an exaggerated later form of the father-figure status he begins making explicit here."],
                      ["Freestyle recovery becomes part of Deeno's defence", "Badee later cites the stumble, but Deeno again answers disruption by saying he can freestyle and using my house to reset. Episode 14 establishes both the vulnerability and the method used to survive it."],
                      ["The official win preserves two truths", "Grams has the preparation advantage and cleaner anti-character writing; Deeno visibly struggles but adapts and takes the crowd. The archive can acknowledge both without reversing the official Deeno result."]
                    ].map(([title, detail]) => <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6"><h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>)}
                  </div>
                </section>
              </>
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
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 17 placed established GZone figure Deeno &ldquo;The Viking&rdquo; against debutant Badee Harz in the final battle of the event. Deeno framed the booking as an intruder entering his territory, returning repeatedly to &ldquo;my house,&rdquo; &ldquo;this is my home,&rdquo; and the claim that Badee was a groupie rather than a recognised battler. Badee treated the same matchup as an arrival opportunity and promised to take over GZone rather than accept newcomer status.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Deeno&apos;s first round established the hierarchy argument through Badee&apos;s age, body, profile, children, family, alleged scene relationships, and the Jasmine / Jafar baby-father scheme. The most important line was not the harshest personal but &ldquo;this is my home, but still I run this,&rdquo; continuing the house language heard against Tapped24 and around the surprise Grams battle. Badee answered through casino and life gambling, hair loss, Deeno&apos;s record against women, his siblings, Spain, jail claims, the Grams stumble, and her &ldquo;baddest on GZone&rdquo; declaration.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Round two became a clash over who had the right to define the other. Deeno used Viking training, a country-knowledge test, Harley Coleman, human-flag imagery, Finding Nemo&apos;s Darla, family and parenting insults, and an accusation about Badee using the N-word. Repeated restarts and a stumble disrupted the round, but he recovered through freestyle comments and the crowd-facing &ldquo;my house&rdquo; refrain.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Badee&apos;s second attacked Deeno&apos;s relationships, finances, home life, parents, children, alleged conduct, and claimed status as a veteran. She used B-A-D-double-E as audible self-branding and said Deeno&apos;s Grams performance had already shown him choking under pressure. The accusations on both sides remain statements made for a battle, not verified facts about either performer.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">The final round introduced the clearest physical theatre. Deeno produced a bag described in the battle data as a 0.1-gram rock of crack and connected it to Badee&apos;s family; Badee&apos;s bag of ashes entered the exchange around Ryno and a previous event. Deeno moved through Fizz from The Tweenies, Little Mix, nobody call-and-response, Dobby, Honey G, a 125cc motorbike, and the claim that the show was his. Badee then revealed that information used for the N-word angle had been deliberately planted, called the material fake, challenged Deeno&apos;s second-round choke, used D-E-N-O / Renzo / friend-zone sounds, and called for AJ next.</p>
                  <p className="text-zinc-300 leading-relaxed font-light">The final audience checks and host announcement gave the battle to Deeno. Badee made a confident debut and her planted-information rebuttal gave the third a genuine strategic turn, but Deeno&apos;s repeated home-platform framing, wider reference range, prop moment, and stronger familiarity with the room survived the second-round disruption. The official GZone record awards Deeno the win.</p>
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

            {battle.slug === 'deeno-vs-badee-harz' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Deeno", "Newcomer status and home advantage", "Deeno questions why Badee is rapping, calls her a groupie, and uses age, body, children, family, Jasmine, Jafar, Tarzan, alleged scene relationships, and platform profile to argue that the visitor is several levels below him."],
                      ["Round 1 — Badee Harz", "Women's record and debut declaration", "Casino and life gambling lead into hair loss, Deeno's previous female opponents, a promised hat trick, siblings, AJ, 2MWAD, Spain, the Grams stumble, jail claims, and the baddest-on-GZone statement."],
                      ["Round 2 — Deeno", "Viking training, facts, and recovery", "Deeno uses the Viking as trainer, Badee's stage image, parenting, Harley Coleman, country questions, the human flag, Darla, and a racism accusation. Restarts and a stumble break momentum before he recovers through freestyle comments and the my-house refrain."],
                      ["Round 2 — Badee Harz", "Information, finances, and self-branding", "Badee attacks Deeno's relationships, money, furniture, borrowing, parents, children, alleged conduct, status, and the Grams choke, then spells B-A-D-double-E to make the debut identity audible."],
                      ["Round 3 — Deeno", "Shock writing, props, and crowd hooks", "Tweenies, Little Mix, nobody call-and-response, single-mum framing, Dobby, Ryno, ashes, the 0.1-gram crack prop, Honey G, shin pads, scruffy knees, the deep voice, and a 125cc motorbike produce the most theatrical round."],
                      ["Round 3 — Badee Harz", "Planted information and takeover close", "Badee says the N-word information was planted and fake, returns to Deeno's choke, then uses anxiety, grief, family gathering, D-E-N-O, Renzo, friend zone, appearance, status, and AJ next to end on an expansion beyond the current opponent."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The house claim starts at the beginning", "Deeno called GZone his house against Tapped24 in Episode 1, and the host described the Grams clash as his home in Episode 14. In Episode 17 Deeno turns the language into a repeated status argument: this is my home, but still I run this."],
                      ["Grams supplies Badee's performance evidence", "Badee says Deeno's mind went blank against Grams and later says he choked the second round. She does not dispute Deeno's official win; she uses a visible performance weakness from Episode 14 to predict another failure under pressure."],
                      ["Deeno repeats the freestyle recovery", "The surprise Grams booking forced Deeno into freestyle-heavy recovery. When the second round breaks down here, he tells the room he can freestyle and uses the my-house refrain to regain control. The recovery method becomes part of his platform identity."],
                      ["Badee constructs a women's hat trick", "Badee names Kusha and Shami before adding herself as a third woman who will beat Deeno. The transcript preserves the claim as her battle argument; it should not be confused with a complete official record supplied by the Season 1 archive."],
                      ["Planted information creates the strongest rebuttal", "Deeno calls Badee racist over an N-word story in round two. Badee says in the third that she deliberately finessed the information, that the story was fake, and that her child's father wrote the words. The reveal is presented as her explanation inside the battle, not independently verified proof."],
                      ["Physical evidence becomes a two-prop exchange", "Deeno's bag representing 0.1 gram of crack and Badee's bag of ashes turn family and drug imagery into objects the room can see. They continue the season's growing use of documents, screenshots, clothing, hygiene items, and other props as battle evidence."],
                      ["Ryno is pulled into the ash scheme", "Deeno says Ryno was bringing the ash and refers to Badee's previous appearance at an event before producing the crack prop. The exchange uses a person already active in the league to make the object feel like shared room history."],
                      ["Deeno names the recurring single-mum matchup", "In the third Deeno says he is always battling single mothers. The line recognises that parenthood and gender have become recurring routes in his clashes, while Badee reverses the pressure by attacking his own ability as a father."],
                      ["Badee turns debut into future matchmaking", "The first round says AJ and 2MWAD do not want the clash; the third says Badee is ready for AJ next. Naming the next opponent changes the performance from survival against Deeno into a claimed place on the wider roster."],
                      ["Renzo's friend-zone sound is repurposed", "Renzo branded himself through Renzo / friend zone in Episode 6. Badee joins D-E-N-O, Renzo, and friend zone in her final round, applying an established GZone sound pattern to Deeno rather than repeating it as Renzo's self-promotion."],
                      ["Fatherhood remains a two-way vulnerability", "Tapped24 and Deeno attacked each other's parenting in Episode 1. Deeno now targets Badee through her children, while Badee answers through Deeno's children, parents, and father figure. The same authority he claims over the house is tested through responsibility at home."],
                      ["Episode 17 sets up the later territory war", "Deeno's home-and-run-this argument is expanded against TymeLess in Episode 21 and disputed again by Btizz in Episode 22. Those later opponents do not invent the house motif; they answer a claim Deeno has been repeating since the season began."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
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
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 15 matched two battlers trying to reverse difficult records. Grams returned immediately after his official loss to Deeno, while Tapped24 had official losses to Deeno, Roman, and AJNA. The booking therefore carried two simultaneous status questions: whether Grams could move from Pen Game into GZone, and whether Tapped could finally convert an established presence into a recorded win.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Grams&apos; first round attacked Georgie, parenting, the home, physical condition, and Tapped&apos;s relationship to responsibility. Tapped answered through Grams&apos; Pen Game legacy, repeated losses, age, finances, employment, family structure, Birmingham, John Cena, and the claim that Grams was neither him nor Deeno. Frequent sound resets made the opening longer and more fragmented than either written round intended.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Round two produced the line that became league history. The event introduction had already joked about MMA, grappling, headlocks, and elbows; Grams then opened with &ldquo;I put him in a headlock&rdquo; before moving through press-ups, Georgie, children, cats, hygiene, employment, clothes, image, and property. Tapped escalated through the AJ loss dispute, cats, Grams&apos; home, Badee Harz, Pen Game, and wider platform status.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">The final changed from a personal battle into a platform war. Tapped told Grams to go home; Grams answered that GZone was his home now; Tapped repeatedly declared &ldquo;fuck Pen Game&rdquo; and presented himself as defending GZone. He then said he was bringing screenshots back—a direct evolution from the text-message screenshots used against Roman—and displayed an Instagram image as the basis of a serious allegation. Badee&apos;s pink underwear was also used as a physical scene-drama prop.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Special guest Denzel Bentley gave the battle to Tapped24, saying that Tapped had ripped the room while acknowledging that Grams had performed well. A physical altercation followed the decision, prompting security intervention, a host statement against violence, and a ten-minute event break. The confrontation and headlock controversy became material in Episodes 19 and 21, but it happened after Bentley had already announced his choice.</p>
                  <p className="text-zinc-300 leading-relaxed font-light">The host then conducted separate crowd checks, and the official GZone record also awards the win to Tapped24. Grams built the more consistent money, parenting, Georgie, and image case; Tapped created the larger final-round narrative, stronger visual moments, and clearer platform allegiance. Allegations tied to the screenshots are documented as battle claims, not verified facts.</p>
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

            {battle.slug === 'tapped24-vs-grams' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Grams", "Georgie, parenting, and home life", "Grams attacks Tapped's relationship, children, role as man of the house, physical condition, and public image. Bouncy delivery and direct address to Georgie establish responsibility as the standard by which he will judge Tapped."],
                      ["Round 1 — Tapped24", "Pen Game record and adult status", "Tapped uses Grams' old platform legacy, losses, age, money, employment, lack of children, Birmingham tension, John Cena, and the Marnie murder-case refrain to argue that the older opponent has achieved less."],
                      ["Round 2 — Grams", "Headlock line and connected lifestyle case", "I put him in a headlock leads into press-ups, Georgie, parenting, cats, hygiene, employment, benefits, clothes, free products, image management, High School Musical, and mortgage pressure."],
                      ["Round 2 — Tapped24", "AJ rebuttal and GZone hierarchy", "Tapped disputes the AJ loss, attacks Grams' cats and home, brings Badee into the room, returns to age and Pen Game status, and positions himself with Deeno above an outsider trying to transfer platforms."],
                      ["Round 3 — Grams", "Relationship appeal and credibility", "Grams speaks directly to Georgie, returns to parenting and money, contrasts truth with Tapped's fast flow, and cites the AJ battle to argue that Tapped's GZone image has already failed under pressure."],
                      ["Round 3 — Tapped24", "Platform war, screenshots, and shock close", "Fuck Pen Game, both group chats, snake, Tottenham, GZone ownership, the Instagram screenshot, serious unverified allegations, Grams' mother, cancer, and hair form the largest but darkest final-round escalation."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Both records create urgency", "Grams enters after losing to Deeno, while Tapped has official losses to Deeno, Roman, and AJNA. The winner will record a first Season 1 victory; the loser will give future opponents another result to weaponise."],
                      ["Grams' surprise battle becomes a weakness", "Tapped treats the Deeno loss as another death in a damaged Pen Game legacy. Unlike Badee in Episode 17, he focuses less on Deeno's stumble and more on Grams arriving at GZone with an unsuccessful record."],
                      ["AJ's decision is argued in real time", "Grams says Tapped was harassed by AJ. Tapped answers that GZone made him lose but that he did not really lose, attempting to replace the official Episode 10 result with his own technical reading before it can define this matchup."],
                      ["You are not me or Deeno creates a hierarchy", "Tapped places himself beside the man who beat both him and Grams. The statement is not a record comparison; it uses Deeno as the established GZone level against which a Pen Game arrival is measured."],
                      ["The screenshot tactic explicitly returns", "Roman and Tapped both used text-message screenshots in Episode 9. Tapped says he is bringing screenshots back in the third, now using an Instagram image. A previous defensive evidence tactic becomes an offensive allegation."],
                      ["Badee becomes a prop before her own battle", "Tapped references Grams allegedly trying to move to Badee and uses Badee's pink underwear as theatre. Badee later battles Deeno in Episode 17, so the prop places her inside GZone storylines before her formal clash."],
                      ["The headlock is foreshadowed by the introduction", "Before round one the host jokes with fighters about MMA, grappling, headlocks, and elbows. Grams later says I put him in a headlock, and the post-decision altercation turns the word from a bar into a lasting security controversy."],
                      ["The incident travels into Episodes 19 and 21", "CJ uses don't-pass-me-a-Gram, I'll-headlock-on-you against 1Flaymr. Deeno and TymeLess both reference the incident in their clash, debating how Deeno would react and addressing Grams directly. Episode 15 becomes shared league history."],
                      ["Go home becomes a fight over GZone", "Tapped tells Grams to return to Pen Game; Grams answers that GZone is his home now. Tapped's fuck-Pen-Game refrain then reframes the battle as defence of platform territory, anticipating later house and throne disputes."],
                      ["Both-group-chat membership becomes divided loyalty", "Tapped argues that appearing in both Pen Game and GZone chats makes Grams a snake. The personal booking is expanded into a question about whether an artist can transfer scenes without carrying old allegiance."],
                      ["Denzel Bentley decides before the altercation", "The guest explicitly selects Tapped and says he ripped the room while crediting Grams. The physical confrontation follows that choice, so it should be treated as aftermath rather than part of the judging criteria."],
                      ["Tapped's first win changes later status claims", "The official result gives Tapped his first Season 1 win and supplies evidence for later self-ranking. The method also leaves consequences: screenshots, platform loyalty, and the headlock incident all remain available to future opponents."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
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
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 16 was a two-round clash between 1Flaymr, making his formal GZone debut, and Btizz, returning after official losses to Deluxx and CJ-Zino. The new character had already been previewed at the end of Episode 13 through &ldquo;One Flamer,&rdquo; &ldquo;everything burn,&rdquo; and &ldquo;fire for that.&rdquo; Here those phrases became a complete performance identity built around fire, Jamaican cadence, a balaclava, and the claim that no opponent could extinguish him.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">1Flaymr&apos;s first round introduced forest fires, Avatar&apos;s Fire Nation, lighter and spray-can denial, Jamaican identity, imitation, location, bacon, lullaby, and the hidden face. Btizz answered by entering the same cultural and elemental world: plantain, dustbin, Friction, &ldquo;fire for that&rdquo; call-and-response, cold bars, an ice zone, GTA, name spelling, Jamaican food, and crowd participation all made the newcomer&apos;s branding the object of the attack.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">The second round expanded 1Flaymr&apos;s world through bang refrains, Prince and Natty, Moses and the Red Sea, landlord and eviction, smoke, the balaclava reveal, snowman, December, and firebender. Removing the mask was important: he first treated the face as private, then owned the visual himself with &ldquo;I cover my ugly face, that&apos;s why I wear the bally,&rdquo; preventing the reveal from belonging entirely to Btizz.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Btizz&apos;s final reply was the clearer complete counter. Hygiene, claimed Jamaican authenticity, rice and beans, stolen-flow pressure, B-for-bars and T-for-teacher, Gangnam Style, Sizzla, the Jamaican flag, Magnum, cornmeal, spawn kills, Postman Pat, and repeated &ldquo;cap&rdquo; accusations all argued that the mask, accent, fire, and danger were constructed. The contrast was not simply fire against cold; it was character invention against character exposure.</p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Several phrases outlived the result. Btizz&apos;s &ldquo;fully extinguished&rdquo; ending became the accepted summary of the battle, while Friction and the removed balaclava became reusable angles. In Episode 19 CJ adopted the same verdict, and 1Flaymr explicitly named Btizz as its source before arguing that a flame still returning to battle could never have been extinguished.</p>
                  <p className="text-zinc-300 leading-relaxed font-light">The closing reaction and official GZone record awarded the battle to Btizz, his first recorded Season 1 win. 1Flaymr created one of the season&apos;s clearest debut identities, but Btizz controlled the room more consistently, simplified his counters, and supplied the phrase that defined the clash afterward.</p>
                </div>
              </section>
            )}

            {battle.slug === 'btizz-vs-1flaymr' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — 1Flaymr", "A complete character arrives", "Forest fire, everything burn, Avatar's Fire Nation, no lighter, no spray can, Jamaican identity, imitation, location, bacon, lullaby, and the hidden face establish the flame as sound, image, origin story, and threat at once."],
                      ["Round 1 — Btizz", "Cold counters and crowd participation", "Plantain, dustbin, Friction, fire-for-that chants, ice-zone writing, GTA, name spelling, food, family, and hygiene enter 1Flaymr's own cultural and elemental world rather than allowing the debut to define every term."],
                      ["Round 2 — 1Flaymr", "Expansion and mask removal", "Prince and Natty, repeated bangs, Moses and the Red Sea, landlord and eviction, smoke, total attack lists, the balaclava reveal, snowman, December, firebender, CJ-Zino, and Deeno widen the character from one opponent to the roster."],
                      ["Round 2 — Btizz", "Authenticity case and final verdict", "Hygiene, fake-Jamaican pressure, rice and beans, flow criticism, B-for-bars and T-for-teacher, Gangnam Style, Sizzla, flag-colour teeth, Magnum, cornmeal, spawn kills, Postman Pat, cap, and fully extinguished close the case."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The debut begins in Episode 13", "After CJ beat Btizz, 1Flaymr appeared in the closing footage announcing One Flamer, everything burn, and fire for that. Episode 16 converts that preview into full rounds, making the character's origin part of the preceding battle's aftermath."],
                      ["Btizz needs a result of his own", "Btizz enters after official losses to Deluxx and CJ-Zino. Facing a debutant gives him a different role: instead of defending status against an established opponent, he must prove that experience can expose a new character before it gains momentum."],
                      ["Fire for that changes ownership", "1Flaymr used fire for that in the Episode 13 preview. Btizz turns it into call-and-response for punches against him, making the newcomer's own slogan generate reaction for the opponent."],
                      ["Cold answers heat inside the battle", "Btizz says his bars are cold and places himself in an ice zone. 1Flaymr later returns with hot flow, snowman, December, and firebender language. The elemental contrast develops through answer and counter rather than isolated metaphors."],
                      ["The balaclava becomes shared evidence", "1Flaymr first tells the room that why he hides his face is none of their business, then removes the bally and owns the appearance joke himself. Btizz attacks the concealment; CJ later reuses the revealed face as evidence against the rebrand."],
                      ["Friction survives every rebrand", "Btizz identifies the earlier Friction name in round one. Episode 19 CJ repeats it, while 1Flaymr replies that the reason for changing his name is private. One short reveal becomes a continuing authenticity angle."],
                      ["Jamaican identity creates both style and vulnerability", "1Flaymr's cadence, Jamaican declaration, Fire Nation energy, and food language make the debut distinct. Btizz responds through plantain, rice and beans, Sizzla, flag colours, Magnum, and cornmeal, arguing that the presentation is imitation rather than identity."],
                      ["The mask defence evolves into self-awareness", "I cover my ugly face, that's why I wear the bally concedes the visible attack before Btizz can present it as discovery. In Episode 19 the same self-awareness is no longer enough: CJ says taking it off fooled everyone."],
                      ["Roster names make the debut immediately local", "PR1NC3, Natty, AJ, CJ-Zino, Deeno, Darren, and other GZone figures appear throughout. The fire character is introduced as part of an existing league world, not as a detached performance imported from elsewhere."],
                      ["Fully extinguished becomes the official memory", "Btizz's closing phrase compresses two rounds of cold, authenticity, hygiene, and crowd-control writing into a verdict the room can repeat. The official win gives that slogan authority beyond the individual bar."],
                      ["Episode 19 reopens the verdict", "CJ adopts fully extinguished against 1Flaymr and adds Friction and the exposed face. 1Flaymr explicitly says Btizz originated the phrase, calls CJ a helper, and argues that the flame's return proves the earlier ending was not permanent."],
                      ["The result completes Btizz's first recovery", "After losses to Deluxx and CJ, Btizz wins by defining the newcomer's identity more effectively than the newcomer can protect it. That recovered status is what later lets 1Flaymr challenge CJ's Btizz win and connect Episodes 13, 16, and 19."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
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
                      <p>Grams entered with the decisive preparation advantage. The opponent reveal made his first written lines feel like an ambush, and he immediately used Deeno's reaction as evidence that the established home figure could be removed from his preferred conditions.</p>
                      <p>The writing had a coherent anti-character route. Weight, speech, drinking, parenting, treatment of women, race identity, clothes, Odin, Arthur, Harry Potter, Shrek, Scooby-Doo, Ed Sheeran, and glass-house imagery all argued that the Viking and leader presentation was marketing rather than reality.</p>
                      <p>Presence was his strongest quality. Grams made the surprise feel like a takeover and repeatedly challenged Deeno's ability to freestyle. His prepared references were naturally cleaner than the opponent's live construction, especially when he stayed on Viking authenticity and public image.</p>
                      <p>The weakness was conversion. Grams exposed real performance uncertainty but could not stop Deeno turning the preparation imbalance into a resilience test for the home crowd. The official decision went against him, and Tapped used that loss as immediate status pressure in Episode 15.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Deeno had the harder technical task because his prepared opponent did not appear. He admitted being rattled and allowed the room to see the construction process, making the battle partly a test of whether imperfect live adaptation could compete with tailored written rounds.</p>
                      <p>His cleanest recovery routes came from what was immediately available: Grams as weed, weight and weighing; age; Pen Game history; outsider status; the surprise itself; and the idea that GZone was being used for a comeback. Those angles sound less polished but more visibly responsive.</p>
                      <p>The third widened the purpose of the round. Other scene names, home-platform status, and the father-figure position made the battle about Deeno's role in GZone rather than only whether he could outwrite Grams without preparation.</p>
                      <p>The weakness was control: stops and uncertainty created the mind-blank angle Badee later reused. The strength was recovery. The final crowd call and official archive award Deeno the win, with the host explicitly framing GZone as his home; the earlier claim that Grams took the crowd decision was incorrect.</p>
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
                      <p>1Flaymr arrived with more than a theme. Fire controlled the name, slogans, delivery, imagery, posture, and promised effect on the room. Forest fires, everything burn, Fire Nation, firebender, heat, smoke, snowman, and December made the two rounds feel like a designed character introduction.</p>
                      <p>The Jamaican cadence and balaclava added sound and appearance to the writing. This made the debut instantly recognisable but also gave Btizz clear surfaces to attack. Plantain, Sizzla, the flag, rice and beans, Magnum, cornmeal, the hidden face, and Friction could all be aimed at the same presentation.</p>
                      <p>Round two showed useful adaptation. The mask came off, the appearance joke was owned before Btizz could control it, and Moses, landlord, eviction, Prince, Natty, CJ-Zino, and Deeno widened the material beyond generic fire. Hot flow, snowman, and December also answered Btizz's cold and ice-zone framing.</p>
                      <p>The weakness was clarity. Rapid patois-led passages, mic levels, repetition, and threat lists sometimes hid the setups. The character survived the loss and later won against CJ, but on this night Btizz made the room repeat the opponent's defining image as a losing verdict.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">BTizz</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Btizz performed as the sceptic examining a debut in real time. Instead of building a separate persona, he treated every part of 1Flaymr's presentation as evidence: fire could be cooled, Jamaican identity could be tested, a mask could hide insecurity, and a new name could be traced back to Friction.</p>
                      <p>The first reply established the method through plantain, dustbin, Lego, fire-for-that, ice-zone writing, GTA, food, hygiene, and B-to-I-to-Z-Z crowd involvement. The strongest move was appropriation: the opponent's own slogan became the room's reaction cue for Btizz.</p>
                      <p>The final reply expanded the authenticity case through rice and beans, Sizzla, the Jamaican flag, Gangnam Style, Magnum, cornmeal, Postman Pat, spawn kills, and repeated cap accusations. Some material was crude or allegation-led, but the route remained easier to follow than 1Flaymr's denser passages.</p>
                      <p>Live-room command was the winning difference. Btizz simplified, paused, repeated, involved the crowd, and ended with &ldquo;fully extinguished,&rdquo; a phrase concise enough to become the official memory of the battle. The result gave him his first Season 1 win after Deluxx and CJ-Zino.</p>
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
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 18 matched two battlers carrying very different records. Roman had official wins over PR1NC3 and Tapped24, giving him an unbeaten two-battle GZone run. Ryno had beaten 2MWAD before losing to TymeLess, and much of the material used against him in those earlier appearances—housing instability, Leicester, allegations, family, and credibility—returned here in a more concentrated form.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Roman opened by predicting that Ryno would blame him for the death of his former partner, undercutting an angle Tapped24 had already used in Episode 9 before Ryno could deliver it. He then joined serious allegations with rhino facts, mud, solitary animals, Romans arriving as a squad, Heady One, sofa-surfing, a supposed shed, Leicester accommodation, football relegation, and a Ryan Winfield / windshield name flip.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Ryno used the predicted partner angle anyway, then attacked Roman&apos;s breath, hygiene, drinking, body, children, grief, and name. &ldquo;R to the O, M-M-A to the N&rdquo; supplied a repeated cadence, while &ldquo;my bars rip you apart&rdquo; stated the craft comparison directly. Mic adjustment and a false start made the opening feel less controlled than Roman&apos;s already completed case.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Round two pushed Roman&apos;s main narrative hardest. Housing, a claimed move from one partner to another, vaping, a hotel allegation, criminal-case language, views without bookings, and &ldquo;zero risk, zero gain&rdquo; built toward a status question: what had Ryno&apos;s visibility actually produced? Ryno rejected the visual comparison and repeated &ldquo;homeless not anymore,&rdquo; before moving through Roman&apos;s crooked hat, no-scope, precision, delivery criticism, Deeno, family grief, and a deliberately awkward imitation of another flow.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Roman&apos;s third returned to pending-case and NFA language, then moved through GZone names, age and grooming allegations, Bug&apos;s Life, the 5&apos;3&quot; ego, keys, the sunflower lanyard, sat-nav, hashtag, and an English-team / English-tea racism construction. Ryno answered with ROM road lines, Maximus Decimus Meridius, Toy Story&apos;s Sid, a direct rebuttal to Roman&apos;s old &ldquo;toughest warriors&rdquo; claim, family shock material, and an admission that the round was not written as well as he wanted.</p>
                    <p className="text-zinc-300 leading-relaxed font-light">The battle contains repeated allegations about sexual conduct, criminal cases, parenting, race, relationships, and housing. They are documented here as claims and rebuttals made inside a battle, not verified facts. The transcript preserves a final audience check for Ryno but does not provide a complete comparative vote; the official GZone record awards Roman the win. His advantage was not simply darker content, but a clearer three-round case and more reliable control.</p>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Roman", "Prediction, animal facts, and housing", "Roman predicts the deceased-partner attack, then builds through allegations, hands-in-pockets, Wotsit, homeless rhinos using mud, solitary rhinos against squad-deep Romans, Heady One, sofa-surfing, a shed, Leicester, relegation, and the Ryan Winfield / windshield flip."],
                      ["Round 1 — Ryno", "Emotional retaliation and name cadence", "Ryno delivers the partner angle Roman predicted, then moves through breath, hygiene, drinking, body, family, children, grief, R-to-the-O spelling, and the claim that his bars cause more damage. A false start and mic adjustment interrupt the escalation."],
                      ["Round 2 — Roman", "A complete credibility case", "Housing and road life lead into vaping, hotel and case allegations, relationship comparisons, views, fame, bookings, stage presence, David Blaine, and age. The route asks whether Ryno's public attention has produced stability or a real career."],
                      ["Round 2 — Ryno", "Denial, delivery criticism, and disorder", "The photo comparison and homelessness are denied before no-scope, precision, third-degree burns, Roman's articulation, Deeno, family grief, violence, and a mocked flow enter the round. Strong individual ideas are weakened by irregular pacing and an incomplete close."],
                      ["Round 3 — Roman", "NFA language, proof challenge, and status", "Roman returns to allegation and case language, then uses GZone references, Bug's Life, the 5'3 ego, age allegations, timepiece, house keys, sunflower lanyard, sat-nav, hashtag, relationship initials, English teams, and English tea."],
                      ["Round 3 — Ryno", "Roman history and final counterattack", "Ryno uses ROM road-marking, Gladiator's Maximus, Toy Story's Sid, Roman's previous warrior claim, family and illness shock, artistic credibility, and street status. He maintains hostility but openly concedes that the writing is not at the level he wanted."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Roman predicts the Episode 9 attack", "Tapped24 repeatedly attacked Roman over his former partner in Episode 9. Roman opens Episode 18 by saying he already knows Ryno will claim that he killed his ex. The prediction removes surprise from material the room has heard before."],
                      ["Ryno uses the predicted route anyway", "Ryno begins his reply with the former-partner angle Roman has just announced. The content is severe, but the lack of transformation lets Roman's prediction frame it as inherited material rather than a new discovery."],
                      ["The toughest-warriors boast is challenged", "Roman told Tapped that he had gone to war with the toughest warriors. Ryno quotes the idea in round three, reduces the résumé to Prince and Tapped, and calls the boast cap. A status line from Episode 9 becomes evidence against Roman."],
                      ["Homelessness begins before TymeLess", "2MWAD made Ryno's alleged homelessness a central Episode 8 angle. Ryno won that clash, but the subject remained available. Roman's housing case therefore continues pressure that has followed Ryno across most of his GZone run."],
                      ["TymeLess supplies Roman's detailed route", "Episode 11 joined homelessness to Leicester, stairs, absent friends, clothes, hygiene supplies, food, and criminal allegations. Roman returns to Leicester, sofas, roads, keys, housing proof, NFA language, and case claims, refining the same portrait into a three-round argument."],
                      ["Homeless not anymore is reused verbatim", "Ryno told TymeLess he was not homeless anymore and repeats almost the same defence against Roman. Roman anticipates the answer by minimising the claimed new home as a shed and later demanding that Ryno show his keys."],
                      ["The proof tactic changes form", "TymeLess physically presented socks, underwear, a toothbrush, soap, and Pot Noodle in Episode 11. Roman brings no prop, but asks for keys and uses specific locations and a visual relationship comparison. The evidential style remains while the delivery moves back into words."],
                      ["NFA and allegation language is inherited", "TymeLess argued that an NFA did not prove innocence; Roman returns to NFA and pending-case language. Ryno's answers—dead the rapist bars, no case, and you faked this—continue the same defence. None of the claims are independently verified here."],
                      ["Ryno keeps calling beyond the opponent", "After beating 2MWAD, Ryno called for Deeno next. Against Roman he again says he should have been clashing with Deens, preserving a longer attempt to frame the scheduled opponent as below the battle he deserves."],
                      ["Roman's record becomes part of the rebuttal", "Roman enters with wins over PR1NC3 and Tapped24, so the warrior image has an official basis. Ryno does not deny those results; he attacks their value, arguing that the names do not justify Roman's grand description."],
                      ["Roman nameplay develops across the battle", "Ryno starts with rhythmic spelling, then reaches more tailored constructions through ROM road lines and Maximus Decimus Meridius. The material evolves from a chant into Roman Empire and Gladiator references, although the later delivery is less controlled."],
                      ["The official result rewards consolidation", "Most of Roman's central topics existed before Episode 18, but he consolidates them into a clearer case than either earlier opponent. Ryno's rebuttals identify the repetition, yet they rarely replace the old narrative with a stronger new one. The official Roman win preserves that distinction."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
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
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Roman treated the matchup as a character case rather than a collection of unrelated insults. Housing, sexual-conduct allegations, family, online visibility, career progress, age, race, and credibility recur across the rounds, allowing each new reference to reinforce a portrait already established.</p>
                        <p>His opening prediction was strategically important. By announcing the deceased-partner attack before Ryno said it, Roman exposed how much material could be inherited from the Tapped battle. Rhino mud, solitary animals, squad-deep Romans, Heady One, the shed, Leicester, relegation, and windshield then kept the round varied without leaving the central case.</p>
                        <p>Round two was his strongest complete construction. A claimed visual downgrade, unstable housing, vaping, a hotel allegation, views, bookings, stage demand, and David Blaine all served the same question: what measurable progress sits behind Ryno&apos;s public image? The &ldquo;zero risk, zero gain, one million views&rdquo; sequence gave the argument its clearest summary.</p>
                        <p>Roman&apos;s weakness was the reliance on extreme and sometimes ableist allegation material. Several points came from routes already used by 2MWAD or TymeLess, and not every claim became technical writing. His edge was consolidation, pacing, and composure. He made repeated history sound like one prepared three-round prosecution and earned the official win.</p>
                      </div>
                    </article>
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">Ryno</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Ryno&apos;s approach was immediate retaliation. Roman&apos;s former partner, mother, body, drinking, children, grief, delivery, artistic status, and street image became targets, with repeated threats and dark family material intended to prevent Roman from controlling the emotional temperature.</p>
                        <p>His cleanest ideas were usually shorter: R-to-the-O spelling, bars ripping Roman apart, homeless not anymore, hat at half past six, no-scope focus, precision, third-degree burns, ROM road lines, Maximus Decimus Meridius, and the direct challenge to the &ldquo;toughest warriors&rdquo; résumé.</p>
                        <p>Ryno did recognise the inherited case. He told Roman to stop the rapist bars, denied homelessness, rejected the visual comparison, and later listed gay, rapist, and homeless as claims Roman had faked. The problem was development: &ldquo;homeless not anymore&rdquo; repeated the TymeLess defence, while Roman had already advanced to the shed and key-proof counters.</p>
                        <p>Control decided the performance. The opening needed a restart and mic adjustment, round two lost shape, and the third included an admission that the writing was not strong enough. Ryno&apos;s aggression created individual moments, but Roman&apos;s connected case remained easier for the room to follow and harder for the rebuttals to replace.</p>
                      </div>
                    </article>
                  </div>
                </section>
              </>
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
                      <p>Grams built the more consistent lifestyle case. Georgie, children, parenting, cats, employment, benefits, clothing, free products, image, transport, property, and mortgage pressure all measured Tapped's dangerous public character against adult responsibility.</p>
                      <p>Direct address was his strongest device. Speaking to Georgie made the relationship angle visible in the room, while I put him in a headlock, ten press-ups, Tapped/not tapped in, Tiny T, addressed/dress, Zac Efron, and Hitch gave the heavier case short repeatable punches.</p>
                      <p>His Pen Game position created both authority and vulnerability. Grams could argue from longer scene experience, but Tapped used prior losses and the immediate Deeno result to portray that history as decline. Saying GZone was his home now gave the transfer confidence but also opened the platform-loyalty counter.</p>
                      <p>The weakness was control. Reloads, sound problems, crowd debate, props, and rising tension repeatedly interrupted the writing. Grams remained competitive enough for Denzel Bentley to praise his performance, but the guest judge said Tapped had ripped the room and selected him.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Tapped performed as someone defending a GZone position despite entering without an official win. Pen Game legacy, repeated losses, age, money, work, family structure, Birmingham, cats, Badee, and the AJ result all argued that Grams' experience did not make him higher status.</p>
                      <p>Rebuttal and revision were central. Grams cited the AJ loss; Tapped said the platform made him lose but that he had not really lost. Grams claimed GZone as home; Tapped answered through both group chats, snake, defending ours, and the first emphatic fuck-Pen-Game statement on the stage.</p>
                      <p>The third was his strongest complete round. Tottenham made Pen Game's decline visual, the returned screenshot connected to Episode 9, the Instagram image created a claimed evidence sequence, and platform loyalty gave the personal allegations a larger structure. The claims remain unverified battle material.</p>
                      <p>Tapped produced the bigger room swing and Denzel Bentley explicitly chose him before the later altercation. Security involvement and the headlock fallout made the battle infamous, but the official result rests on the performed rounds and the guest decision already announced.</p>
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
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 19 brought together two characters whose previous battles were already connected. 1Flaymr returned from his official loss to Btizz in Episode 16, where the debuting fire persona had been declared &ldquo;fully extinguished.&rdquo; CJ-Zino arrived with an official win over that same Btizz in Episode 13 and treated the new booking as proof that he belonged among the league&apos;s leading names.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">1Flaymr opened by restoring the complete performance identity: &ldquo;CJ, don&apos;t run,&rdquo; &ldquo;everything burn,&rdquo; gunshot sounds, Jamaican cadence, rum, fire, and a widening list of GZone targets. CJ&apos;s reply was built to put that character on trial. &ldquo;Fully extinguished&rdquo; came directly from the Btizz clash, while Katniss, Catching Fire, Mockingjay, President Snow, and the Hunger Games arena turned the inherited verdict into the round&apos;s cleanest connected scheme.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Round two made the battle&apos;s lineage explicit. 1Flaymr answered that the flame could never be extinguished, acknowledged CJ&apos;s win over Btizz, and accused CJ of helping the room blow the flame out in Episode 16. CJ returned to material already visible in that debut—the Friction name, the removed balaclava, Jamaican presentation, and fire branding—while also referencing the recent Grams headlock controversy and claiming he could earn a reload without borrowing a flow.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">The third round sharpened the contrast. 1Flaymr dismissed questions about changing his name as nobody else&apos;s business, then moved through Guinness, rapid internal rhymes, gunshot rhythm, cemetery language, and an &ldquo;in loving memory of CJ&rdquo; finish. CJ immediately mirrored the wording with &ldquo;why I&apos;m battling today—mind your business,&rdquo; before returning to Friction, the uncovered face, online toughness, stamping out fire, and whether 1Flaymr was built for the ring.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">The clash therefore works as more than performance against writing. 1Flaymr argues that survival itself defeats the previous verdict: if he can return, hold the room, and keep the slogans alive, he was never extinguished. CJ argues that repetition proves the opposite: the new name, mask, flame language, and cadence are branding that can be traced, exposed, and dismantled.</p>
                    <p className="text-zinc-300 leading-relaxed font-light">The transcript records separate crowd checks but does not preserve their relative volume clearly enough to reconstruct the room decision from text alone. The official GZone battle record awards the win to 1Flaymr. CJ produced the cleaner counter-writing, but 1Flaymr&apos;s persistence, recognisable character, direct rebuttal to the Episode 16 loss, and stronger performance hooks produced the recorded result.</p>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — 1Flaymr", "The fire identity returns", "CJ-don't-run and everything-burn refrains organise a round built from gunshot sounds, rum, Heung-min Son, Wayans, Satan, empty-bank and empty-house attacks, and threats toward the wider roster. Repetition makes the character immediately readable after the Btizz loss."],
                      ["Round 1 — CJ-Zino", "Inherited verdict becomes a film scheme", "CJ begins from Btizz's fully-extinguished conclusion, then develops Catching Fire, Katniss Everdeen, Mockingjay, President Snow, and the Hunger Games arena. Appearance, attraction, clout, cannabis, and flow criticism broaden the case against 1Flaymr."],
                      ["Round 2 — 1Flaymr", "Rebuttal and league-history argument", "The flame is declared impossible to extinguish. CJ becomes a DJ whose head will spin, his Btizz win is challenged, and CJ's presence during Episode 16 is reframed as assistance in blowing out the flame rather than an independent achievement."],
                      ["Round 2 — CJ-Zino", "Mask, headlock, and status pressure", "CJ says he witnessed 1Flaymr being brought onto the stage, invokes Grams and the headlock controversy, attacks the removed balaclava, presentation, relationships, family, and acting, then closes by claiming he can earn reloads without relying on a flow and belongs in GZone's top five."],
                      ["Round 3 — 1Flaymr", "Name defence and death sequence", "Questions about the former Friction name are dismissed as private business. Guinness, kicking, gunshot rhythm, Freddy, Blackberry, cemetery language, no-action accusations, and the repeated declaration that CJ is dead drive a long performance-led close."],
                      ["Round 3 — CJ-Zino", "Immediate echo and final deconstruction", "CJ mirrors the mind-your-business line, returns to Friction and the uncovered face, calls the danger an online act, and joins Judas, devils, fire, history, the ring, and final physical-threat imagery into one last attempt to end the character rather than merely trade slogans."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Fully extinguished belongs to Episode 16", "Btizz ended the 1Flaymr clash by repeating fully extinguished. CJ adopts that exact verdict in Episode 19, and 1Flaymr explicitly reminds the room that Btizz said it. The phrase is inherited battle history, not a new CJ discovery."],
                      ["Survival becomes 1Flaymr's rebuttal", "Against Btizz, the flame persona ended under an extinguished verdict. Here 1Flaymr repeatedly says it can never be extinguished. Returning with the same identity turns continued presence into the answer, even before an individual punch lands."],
                      ["CJ's Btizz win becomes disputed evidence", "CJ officially beat Btizz in Episode 13 and brings the status of that win into this matchup. 1Flaymr acknowledges it but reframes CJ as a helper who joined Btizz and the room in trying to blow out the flame."],
                      ["Friction is established history, not a reveal", "Btizz already named Friction during Episode 16, and 1Flaymr used the old name openly enough for the room to know it. CJ returns to the identity because it weakens the rebrand, while 1Flaymr answers that the reason for changing it is nobody else's business."],
                      ["The balaclava angle survives its own removal", "1Flaymr removed the balaclava against Btizz and explained the covered face himself. CJ now says taking it off fooled everyone, changing the object from mystery branding into evidence that the intimidating image was constructed."],
                      ["Fire Nation becomes a tighter slogan system", "Episode 16 introduced forest fires, Avatar, Fire Nation, firebender, snowman, and smoke. Episode 19 trims that world into short repeated cues—everything burn, fully active, gunshots, and the flame cannot be extinguished—designed for faster crowd recognition."],
                      ["CJ continues his flow-authorship argument", "CJ accused Btizz of taking Tapped24's flow in Episode 13. Against 1Flaymr he says he does not need a flow to get a reload. The wording changes, but originality and control of cadence remain part of how CJ measures an opponent."],
                      ["The Grams headlock enters another clash", "CJ's don't-pass-me-a-Gram, I'll-headlock-on-you line draws on the physical controversy from Tapped24 versus Grams. As in Episode 21, the incident becomes shared GZone history that later battlers can use without explaining the full event again."],
                      ["The first-round roster list expands the threat", "CJ, Btizz, Roman, Ryno, Tapped24, Darren, Jay, and Z.K are pulled into 1Flaymr's performance. The list makes the battle a public relaunch after Episode 16 rather than a private argument with CJ alone."],
                      ["CJ mirrors the live wording in round three", "1Flaymr says the reason for his name change is none of CJ's business. CJ opens his answer with a closely matched why-am-I-battling-today, mind-your-business construction, immediately taking the opponent's defensive phrase and making it sound like his own setup."],
                      ["CJ's top-five claim advances Episode 13", "After beating Btizz, CJ called for PR1NC3 next. Here he names himself among GZone's top five. The target has evolved from getting the next opponent to defining his position within the whole roster."],
                      ["The official result changes the future meaning", "The site records 1Flaymr as the winner, so fully extinguished can no longer function as a settled ending. Later uses of the fire identity now carry both the Btizz defeat and the CJ comeback, making repetition part of an evolving record rather than static branding."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
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
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">1Flaymr</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>1Flaymr performed as if Episode 16 had not ended the character but made it more necessary. &ldquo;Everything burn,&rdquo; &ldquo;fully active,&rdquo; gunshot noises, patois-led cadence, and repeated commands gave the crowd fixed points to recognise even when the surrounding writing became dense or the sound needed adjustment.</p>
                        <p>The first round was a relaunch. He moved from CJ to Btizz, Roman, Ryno, Tapped24, Darren, Jay, and Z.K, making one opponent the doorway to the whole roster. Heung-min Son, rum, Wayans, Satan, bank-account imagery, empty rooms, and the burn-up list supplied variety without abandoning the core voice.</p>
                        <p>His most important writing came in round two, where he directly confronted &ldquo;fully extinguished.&rdquo; By naming Btizz as the source, acknowledging CJ&apos;s role around that clash, and insisting the flame was still present, 1Flaymr turned a previous losing slogan into the central rebuttal of a new battle. The argument is simple, but it depends on the archive and therefore rewards viewers following the season.</p>
                        <p>The weakness remained clarity and control. Long repeated sections, mic checks, restarts, and sound-led phrasing sometimes made individual punches difficult to separate. His strongest moments used short hooks, direct eye contact, and physical conviction. Those qualities gave the character enough continuity and room impact to support the official win.</p>
                      </div>
                    </article>
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ-Zino</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>CJ-Zino wrote the more explicit deconstruction. Rather than inventing a separate theme, he accepted 1Flaymr&apos;s fire world and filled it with counters: Catching Fire, Katniss, Mockingjay, Snow, the arena, stamping out fire, and the verdict that the flame had already been extinguished.</p>
                        <p>The first round was his clearest technical passage. The Hunger Games chain stayed readable because every reference served the same purpose. Friction, the mask, attraction, cannabis, clout, and flow then widened the argument from the flame itself to the person allegedly hidden behind the branding.</p>
                        <p>CJ also used league continuity well. The Btizz result supplied authority, the Friction and balaclava angles came from 1Flaymr&apos;s debut, and the Grams headlock line used a recent GZone incident as shorthand. His &ldquo;I don&apos;t need to get a flow to get a reload&rdquo; claim continued the concern with borrowed cadences that he had already aimed at Btizz.</p>
                        <p>His weakness was conversion. The writing often exposed more about the opponent than 1Flaymr&apos;s material exposed about him, but some longer personals and broken performance passages diluted the cleaner schemes. The third-round &ldquo;mind your business&rdquo; echo showed fast awareness; the battle as a whole needed more moments that turned that intelligence into an unmistakable room swing.</p>
                      </div>
                    </article>
                  </div>
                </section>
              </>
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
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 20 matched NattyEBK, returning after his official win over PR1NC3, with debutant Z.K from Grimsby. Natty approached the clash as the next stage of an established run, repeatedly presenting Prince as the first body and Z.K as the next. Z.K treated the debut as a chance to prove that longer experience, clearer writing, and grime knowledge could overcome Natty&apos;s aggression and home-room momentum.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Natty&apos;s first round framed the booking as an elimination assignment. Z.K&apos;s name, train journey, money, teeth, breath, religion, image, and claimed danger were attacked through direct statements and abrupt flow pockets. The Prince result supplied continuity, while references to Ryno and Badee Harz pulled wider league tensions into the round as battle allegations rather than verified claims.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Z.K answered with the more controlled opening. Mickey Mouse, Dimzy, BBK, CCJs, social-media bars, floorboards, rats, fleas, food, Natty&apos;s girlfriend, and the Natty/Nathan/Steve identity sequence created a researched character portrait. Several routes came from Natty&apos;s first battle: PR1NC3 had already used Mickey Mouse and hygiene props against Natty, and Z.K returned to the same visual and credibility weaknesses.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Round two moved from insults into claimed evidence. Natty stopped the beat and presented a screenshot and photograph to support allegations about Z.K&apos;s online behaviour, then escalated through family, death, washing, dating, and a Z.K-out-the-case weapon flip. Z.K kept the cleaner technical route through Batman and Robin, Grimsby-to-London movement, food and cultural identity, Virgil van Dijk, Arsenal, Central Cee, Tekken, Wiley, and the lemon comparison.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Natty&apos;s third produced the battle&apos;s largest momentum shift. Twins became both family and weapon language, GZone support became a claim to the throne, the house invasion led into the Canada Goose six, and &ldquo;just killed Prince, now Z.K&apos;s next&rdquo; completed the two-battle progression. Z.K closed with a more controlled sequence around Natty&apos;s flow, Cher Lloyd, Sirius Black, Pokémon, Mewtwo, Bluetooth, Kindle, Pringle, shingles, hygiene, and online relevance.</p>
                    <p className="text-zinc-300 leading-relaxed font-light">The crowd awarded the battle to NattyEBK. Z.K&apos;s second round and clearer construction made the debut competitive, but Natty&apos;s physical evidence sequence, stronger third-round escalation, flow changes, and ability to claim the room produced the more decisive final impression.</p>
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-display uppercase text-white mb-8">Evidence: Props Used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.props?.map((prop) => (
                      <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                          <span className="text-2xl">{prop.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold">{prop.name}</p>
                          <p className="text-zinc-500 text-sm uppercase tracking-widest">Used by {prop.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — NattyEBK", "Elimination framing and direct pressure", "Natty treats Z.K as the opponent assigned after Prince. The stage name, train journey, money, teeth, breath, religion, image, and claimed danger are attacked through short direct pockets designed for immediate room reaction."],
                      ["Round 1 — Z.K", "Research and character construction", "Z.K answers through Mickey Mouse, Dimzy, BBK, CCJs, social-media research, floorboards, rats, fleas, food, Natty's relationship, and the Natty/Nathan/Steve sequence. The approach is less explosive but more consistently connected."],
                      ["Round 2 — NattyEBK", "Physical evidence and escalation", "Natty stops the beat to present a screenshot and photograph connected to allegations about Z.K's online behaviour. Family, death, hygiene, dating, directness, and the Z.K-out-the-case weapon flip then push the round toward shock and confrontation."],
                      ["Round 2 — Z.K", "Cultural references and technical control", "Batman and Robin, Grimsby-to-London movement, food and cultural identity, Virgil van Dijk, Arsenal, Central Cee, Tekken, Wiley, and the lemon comparison give Z.K his clearest and most varied round."],
                      ["Round 3 — NattyEBK", "Twins, throne, and roster progression", "Twins move from family language into paired-weapon imagery. Natty claims the GZone room, refuses to let Z.K take his throne, invades the house, lands the Canada Goose six, and completes the progression from Prince to Z.K."],
                      ["Round 3 — Z.K", "Flow criticism and technology imagery", "Z.K closes through Natty's cadence, AJ Tracey, Cher Lloyd, Sirius Black, Pokémon, Mewtwo, Bluetooth, Kindle, Pringle, shingles, hygiene, and online output. The writing remains controlled but cannot overturn Natty's larger third-round reaction."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                        <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
                        <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Rebuttals, Callbacks &amp; Evolving Material
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Prince becomes Natty's first recorded body", "Natty opens with what he did to Prince and closes with just killed Prince, now Z.K's next. Episode 12 is converted from a past result into the first step of a continuing roster run."],
                      ["Mickey Mouse travels from Prince to Z.K", "PR1NC3 opened against Natty with a Mickey Mouse comparison. Z.K repeats the image through Natty's haircut, using an earlier opponent's visual read as inherited pressure rather than presenting it as a new discovery."],
                      ["Hygiene pressure changes hands", "PR1NC3 used Natty's breath as a major Episode 12 angle and physically presented Listerine. Natty now attacks Z.K's breath, plaque, teeth, washing, and dating, redirecting a weakness previously used against him."],
                      ["The evidence tactic escalates", "Episode 12 used hygiene products as visible proof of an insult. In Episode 20 Natty stops the beat, hands over a screenshot and photograph, and asks the room to inspect them. The physical-object tactic moves from comedy into claimed online evidence."],
                      ["Z.K challenges the EBK identity", "BBK supplies an established grime benchmark against which Z.K measures EBK. The comparison attacks both Natty's initials and the musical level he claims, making the stage name part of the credibility debate."],
                      ["Natty turns Z.K into a weapon", "Natty first asks when Z.K has ever swung the blade suggested by his name. In round two he imagines backing his own Z.K out of a case, changing the opponent from an allegedly false weapon into the weapon Natty controls."],
                      ["The Ryno and Badee allegation enters the archive", "Natty names Ryno and Badee Harz together inside a racism accusation. The page records this as battle material and league-world positioning, not as verified fact about either performer."],
                      ["Directness becomes a style argument", "Natty says Z.K will come with jokes that say nothing while he is more direct. Z.K's clearer references and Natty's confrontational statements make that contrast visible across the battle rather than leaving it as a simple boast."],
                      ["The throne motif appears before Episode 21", "Natty says he will not let Z.K take his throne and claims the GZone side. In the next episode Deeno and TymeLess turn house, chair, and throne into the central territorial dispute. The shared language shows a season-wide status contest, although the transcript does not prove a direct callback."],
                      ["A lemon appears before the three-prop scheme", "Z.K calls Natty a lemon while discussing a Tekken video. TymeLess uses three physical lemons against Deeno in Episode 21. The proximity is notable, but the available transcripts do not establish that TymeLess was deliberately quoting Z.K."],
                      ["Ginga Jay becomes part of successive battles", "Z.K invokes Ginger Jesus as a GZone-specific reference. TymeLess then turns Ginga Jay's appearance and reloads into a larger performance device in Episode 21, developing the host from named reference into active room evidence."],
                      ["The crowd decision preserves the style contrast", "Z.K's cleaner construction keeps the result competitive, especially in round two. Natty's props, confrontation, flow change, and stronger final escalation produce the crowd call, reinforcing impact over technical neatness on the night."]
                    ].map(([title, detail]) => (
                      <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
                        <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
                      </article>
                    ))}
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
                        <p>Natty performed as someone extending an existing run rather than beginning again. Prince was named at the start and finish, allowing Natty to frame Z.K as the second opponent in a sequence he expected to complete. That progression gave the clash a simple competitive story even when individual passages became chaotic.</p>
                        <p>His first round relied on direct pressure: Z.K&apos;s stage name, train journey, finances, teeth, breath, religion, appearance, and claimed danger. The hygiene route is especially important because PR1NC3 had used breath and Listerine against Natty; here Natty redirects the same kind of visible embarrassment toward a new opponent.</p>
                        <p>The second round changed the atmosphere by introducing a screenshot and photograph as claimed evidence. Natty stopped the beat and made the objects part of the confrontation before moving into family, death, washing, dating, and weapon material. The allegations remain claims made inside a battle, not independently verified facts.</p>
                        <p>Round three was his strongest complete performance. Twins, paired weapons, GZone support, the throne claim, house invasion, Canada Goose, the Prince-to-Z.K progression, and a faster flow pocket all moved toward a decisive close. His main weakness was control: repeated stops and extreme personals could obscure the cleaner stage-name and progression writing, but his escalation and room impact carried the vote.</p>
                      </div>
                    </article>
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">Z.K</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Z.K delivered a composed debut built around research and recognisable reference points. Rather than trying to match Natty&apos;s hostility immediately, he constructed a character through Mickey Mouse, Dimzy, BBK, CCJs, social media, alleged home conditions, food, relationships, music, and the Natty/Nathan/Steve identity sequence.</p>
                        <p>Some pressure was inherited intelligently. PR1NC3 had already compared Natty with Mickey Mouse and attacked his hygiene; Z.K repeated the visual comparison while broadening the credibility case through debt, online clips, gaming, grime knowledge, and a claim that Natty&apos;s dangerous presentation did not match his life.</p>
                        <p>Round two was Z.K&apos;s clearest technical round. Batman and Robin, Grimsby-to-London movement, peas and rice, Virgil van Dijk, Arsenal, Central Cee, Tekken, Wiley, and the lemon image moved across culture, sport, games, and grime without losing the opponent-specific thread.</p>
                        <p>The third continued the flow critique through AJ Tracey, Cher Lloyd, Sirius Black, Pokémon, Mewtwo, Bluetooth, Kindle, Pringle, shingles, and hygiene. Z.K&apos;s strength was clarity and range; his weakness was conversion. The references were often easier to follow than Natty&apos;s writing, but they did not become a final narrative or room moment strong enough to overturn Natty&apos;s third.</p>
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
                        ["Ginger J is irritating — gave me Z.K to eliminate him.", "Natty frames the matchup as an assignment from the host and immediately places Z.K beneath him in the roster."],
                        ["What I done to Prince, man's doing to you ... Just killed Prince, now Z.K's next.", "The official Episode 12 result becomes a two-part progression. Natty names Prince in the opening and returns to him in the third to present Z.K as the next recorded body."],
                        ["Z.K, you need to go get a car, 'cause I heard that you came here bumping train. You're broke — let me just fix you change.", "Train, broke, and change connect travel with money. The sound chain makes a basic financial attack more structured."],
                        ["Z.K, why is your name Z.K? When have you ever swung that blade?", "Natty challenges whether the stage name's weapon implication matches Z.K's real image."],
                        ["Ryno's a racist, so is Badee — it's not ironic they made an alliance.", "Natty brings two other GZone artists into a character accusation. It is recorded as battle material and league-world positioning, not a verified claim."],
                        ["If you scrape your teeth with your finger, all that we see is plaque. Go to the dentist — Darren can't save you if he can't fix that.", "The direct hygiene punch also reverses the breath and Listerine pressure PR1NC3 had used against Natty in Episode 12."],
                        ["How you on Facebook talking about your body hurting from taking a shit? Taking pictures of your boy's bum — GZone, please tell me what is this?", "Natty stops the beat and presents physical material to the room. The impact comes from claimed evidence and confrontation; the underlying allegation is not independently verified."],
                        ["You've been rapping for fourteen years; somehow man's still bigger than you.", "Time served is turned against Z.K: longevity means little if the newcomer to GZone has already built the larger profile."],
                        ["If I back my Z.K out of the case, Z.K will be the first out of the room.", "The opponent's name changes into a weapon Natty controls. Backing it out of a case makes both the object and the threatened reaction visible."],
                        ["You're like a dog on the Fourth of July, tucking your tail when things go boom.", "Fireworks imagery presents Z.K as someone who panics when pressure becomes real."],
                        ["You come with jokes, you say nothing — I'm more direct.", "Natty states the battle's stylistic contrast plainly: Z.K builds comic references while Natty aims for confrontation and immediate meaning."],
                        ["You got twins, so do I, but our twins ain't alike. I got twin Z.Ks right on my side.", "Family language is redirected into paired-weapon imagery, making the opponent's name part of Natty's third-round threat structure."],
                        ["I got all the G's on my side ... You think that I'm letting him take my throne?", "Natty turns crowd support into a claim of ownership and status on the GZone platform."],
                        ["I walk in your house like who's going to stop me? Never you ... Man's giving him six like Canada Goose.", "The house-invasion setup establishes Z.K's helplessness before a Canada Goose reference closes the threat. The transcript preserves the brand punch but does not make every part of the numerical connection fully clear."]
                      ]],
                      ["Z.K", [
                        ["You think I come to GZone to lose? You must be confused.", "Z.K opens his debut by rejecting the idea that he has travelled to serve as an easy opponent."],
                        ["Got a haircut like Mickey Mouse.", "PR1NC3 had already called Natty a Mickey Mouse figure in Episode 12. Z.K preserves the visual read but applies it specifically to the haircut."],
                        ["When it gets too close it gets stinky — coming like a wet-wipe version of Dimzy.", "The grime comparison attacks Natty's sound and hygiene at once, presenting him as a weaker imitation rather than an original artist."],
                        ["Not EBK — you're not levels like BBK.", "Boy Better Know supplies an established grime benchmark against which Z.K measures and diminishes Natty's EBK identity."],
                        ["Kicked out his house for his CCJs after CCJs.", "County Court Judgments sharpen Z.K's wider angle about Natty's finances and stability."],
                        ["You don't want to see what's under his floorboards — bare rats and fleas.", "The alleged home condition supports Z.K's larger hygiene, money, and instability portrait."],
                        ["Should I call you Natty or Nathan? You look like a random guy called Steve.", "The name progression strips away the EBK persona and replaces it with deliberately ordinary identities."],
                        ["Turkey dinosaurs and chips, because you don't know about peas and rice.", "A cultural food comparison questions the authenticity of the image Natty presents."],
                        ["I believe in Ginger Jesus, but after the clash you'll be needing Christ.", "Host Ginga Jay becomes a local religious reference before Z.K predicts that Natty will need rescue."],
                        ["You got a haircut like Virgil van Dijk's.", "The footballer's distinctive tied-back hair supplies another immediate visual comparison."],
                        ["I typed his name on YouTube. What did I see? This lemon was playing on Tekken.", "Online research contrasts gaming content with Natty's dangerous image. Lemon marks him as disappointing rather than formidable."],
                        ["I grew up listening to Wiley; you grew up listening to them.", "Z.K invokes a foundational grime figure to claim deeper musical roots and separate his influences from Natty's."],
                        ["This one's called Natty-the-nip flow, 'cause you're coming like a local gigolo.", "Z.K names and imitates a cadence to turn flow criticism into something the room can hear rather than merely accept."],
                        ["Saturday night, your girl's looking like Cher Lloyd; Sunday morning, Sirius Black.", "Two recognisable hair images describe an overnight visual deterioration and give Z.K one of his cleanest comic comparisons."],
                        ["You were at home with Pokémon cards, getting gassed over Mewtwo. You still send porn over Bluetooth.", "Pokémon and outdated file sharing combine childish and technologically dated images to undermine Natty's adult street persona."],
                        ["I'm writing bars while you're reading books on Kindle ... Why is your face the same shape as a Pringle? Music-wise, he ain't got one single — face is fucked from acne and shingles.", "Kindle, Pringle, single, and shingles form a sustained end-rhyme chain across writing, appearance, music output, and skin." ]
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
                      {(battle.slug === 'deeno-vs-btizz' ? [
                        ["Deeno", "Deeno treated the clash as a chance to defend his GZone position against a fast-rising opponent. His material was more battle-specific than general: Btizz's requests for the booking, family history, previous opponents, clothes, claimed road image, copied flows, and place on the roster all fed the same argument that the climb had reached its limit.|Adaptation was Deeno's strongest quality. Catch-22 grew from the live Tap 22 mistake, red rum reversed Btizz's murder language, and the third-round opening predicted the copied cadence before turning it into the flipped-script setup. Those moments made the performance feel responsive rather than sealed inside pre-written rounds.|The third was his clearest complete structure. The Google Maps screenshot, headstone photograph, and adoption papers established visual pressure; presenting himself as Btizz's new father turned the between-round exchange into a complete adoption narrative. The Ben 10, Blade, Batman, Robin, Bruce Wayne, two-day, and Blu-ray references supplied connected technical payoffs around it.|The weakness was excess. Some family and death material was intentionally cruel, and repeated stops around the props interrupted momentum. Even so, Deeno built the stronger closing narrative and left the cleaner final impression for the crowd."],
                        ["Btizz", "Btizz performed like someone trying to prove that climbing the roster was not accidental. He used Deluxx, CJ Zino, and 1Flaymr as résumé markers, rejected Deeno's king status through the TymeLess result, and repeatedly reframed the home platform as territory he could occupy.|Flow variation and self-awareness were his biggest strengths. He moved between direct punches, faster internal-rhyme pockets, crowd-facing repetition, and an explicit imitation of Deeno's cadence. Because CJ and Deluxx had previously criticised him for borrowing flows, making the imitation obvious changed it from a hidden weakness into a deliberate provocation.|His best connected writing came through Mission: Impossible, Benji Dunn, and Simon Pegg; the repeated house takeover; the lemon callback to TymeLess; and the later Lego, Family Guy, and crown material. These references made the clash feel part of an evolving GZone story rather than an isolated battle.|The weakness was control. Several passages were overpacked or hard to follow, and the third round needed repeated restarts after crowd interruptions and disputes over wording. Btizz remained dangerous through energy and adaptability, but his closing material did not resolve as cleanly as Deeno's prop-led third." ]
                      ] : battle.slug === 'deeno-vs-tymeless' ? [
                        ["Deeno", "Deeno treated the main event as a defence of territory. The opening house claim, security language, headlock reference, age pressure, and dismissal of TymeLess's battle record all argued that the visitor did not belong above the established GZone figure.|His best writing was tailored and connected. GTA, Big Smoke, CJ, final mission, game over, and replay formed the clearest second-round scheme, while time, no reverse, William, Froot Loops, Special K, Cheerio and serial killer gave the third a strong opponent-specific route.|Episode 11 supplied part of his research. Ryno had already used William, time concepts, parenting criticism, and racism allegations against TymeLess; Deeno changed the wording but reused those established pressure points. The weekday question also created the opening for TymeLess's later stepfather reversal.|Deeno remained forceful through a noisy battle, but stops and material selection weakened his control. The lemonade line was a genuine attempt to answer the fruit props, yet the stumble prevented it from replacing TymeLess's motif. His clean technical peaks kept the clash competitive, but they did not connect across all three rounds as completely as TymeLess's performance."],
                        ["TymeLess", "TymeLess built the stronger complete performance by treating the clash as one developing story rather than a collection of isolated punches. He first pretended that his own stomach was hurting and let the room believe him, then exposed the complaint as the setup for a toilet scheme about Deeno. The toilet became Deeno's false throne, and the throne became a challenge to ownership of GZone.|His strongest battle instinct was transformation. Grey hair became the silver fox, the recent Tapped24 and Grams incident became headlock material, Ryno's flow became part of the toilet cadence, and Deeno's parenting attack became a third-round stepfather performance aimed directly at Deeno's son.|The visual writing gave every round recognisable anchors. The plunger completed the opening narrative; Keith Lemon expanded into three physical lemons; and Prince Harry, Paul Scholes, Weasley, Simon Pegg, Shaun of the Dead, the Sugar Puff Monster and Ginga Jay turned Deeno's appearance into a recurring character.|TymeLess controlled reaction better through pauses, reloads, repetition, room involvement, misdirection, and delayed payoff. The third lemon resolved material introduced much earlier, while the crowd decision confirmed that the connected performance had outweighed Deeno's stronger individual technical passages."]
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
                          <p>Deeno performed as the established figure policing access to his platform. The first round&apos;s age, body, groupie, children, Jasmine, Jafar, Tarzan, and profile attacks all supported the same hierarchy: Badee had entered his house without earning equal status.</p>
                          <p>The house language was his clearest long-term writing. It had appeared against Tapped24 and around the Grams surprise; here &ldquo;my house&rdquo; becomes a recovery cue as well as a claim. When rounds are restarted or the room interrupts, repeating it lets Deeno reset himself and remind the audience who normally controls the space.</p>
                          <p>His range widened after the stumble. Country facts, human flag, Darla, Tweenies, Little Mix, Dobby, Honey G, the 125cc motorbike, nobody call-and-response, Ryno, the ashes, and the crack prop gave the later rounds more visual anchors than the opening personals.</p>
                          <p>The weakness was excess and reliability. Graphic family, disability, illness, and sexual material often overpowered the cleaner schemes, while round two exposed the same loss of control Badee had cited from Grams. Deeno recovered through freestyling, familiarity with the room, the prop exchange, and repeated territorial framing strongly enough to take the crowd decision.</p>
                        </div>
                      </article>
                      <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-display uppercase text-brand mb-6">Badee Harz</h3>
                        <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                          <p>Badee entered as a newcomer but wrote toward continuation. Deeno&apos;s record with women, AJ, 2MWAD, the baddest-on-GZone declaration, and the final call for AJ next all present this battle as the first step of a roster run rather than a one-off appearance.</p>
                          <p>Her first round was strongest when it used visible or archived material: casino gambling, hair loss, named female opponents, siblings, Spain, the Grams stumble, and jail claims. B-A-D-double-E later supplied a simple identity hook that the room could carry through the heavier personal content.</p>
                          <p>The planted-information reveal was her best strategic moment. After Deeno used an N-word story to call her racist, Badee said she had finessed his information, that the setup was fake, and that her child&apos;s father wrote the words. Whether or not the account can be verified, she turned Deeno&apos;s research into evidence that he could be manipulated.</p>
                          <p>Her weakness was the same escalation that affected Deeno. Long passages of allegations, family material, disability insults, and threats sometimes buried the more crafted gambling, article, family-gathering, Renzo, and friend-zone ideas. She made a forceful debut, but Deeno retained more control of the room and received the official decision.</p>
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
                            ["CJ, don't run — you are going to die when I raise my gun. 1Flaymr, everything burn.", "The opening establishes the two performance anchors: CJ is ordered to stay in front of the attack, while the burn slogan restores the identity that Btizz had supposedly extinguished."],
                            ["Come attack and get shot — kick like Heung-min Son, put the lyrics on a beat like drum.", "Son supplies the kicking image, while shot, Son, and drum move from football impact into musical rhythm."],
                            ["Rather spill your blood than spill my rum.", "A short preference bar connects threat language with the Jamaican and Caribbean presentation at the centre of 1Flaymr's character."],
                            ["Me and them are no brothers like the Wayans them.", "The famous acting family gives 1Flaymr a compact way to reject any alliance with CJ and the people around him."],
                            ["Me no care if you're badder than demon, 'cause me badder than Satan and them.", "The comparison deliberately escalates beyond a demon to the figure presented as commanding them, matching the exaggerated scale of the performance."],
                            ["CJ get burn up, Roman get burn up, Ryno get burn up — everybody get burn up.", "The fire spreads beyond the scheduled opponent and turns the first round into a relaunch aimed at the wider GZone roster."],
                            ["Look at your bank account: nothing in there. Fridge empty, kitchen empty, open up your brain — nothing in there.", "One repeated answer connects finances, living conditions, and intelligence. The structure is simple enough for each new location to create another payoff."],
                            ["Turn CJ into a DJ, 'cause Zino's head will get spin.", "DJ record-spinning becomes the visual for CJ's head. It is one of 1Flaymr's cleanest opponent-specific constructions."],
                            ["You look like the Lord never died on the cross, 'cause your face look like sin.", "The cross and sin supply a religious frame for an appearance attack, with CJ presented as the reason sacrifice failed."],
                            ["You win Btizz, now you feel like you're big.", "CJ's official Episode 13 result is acknowledged and immediately reduced to overconfidence rather than accepted as proof of rank."],
                            ["In the Btizz clash them man said, 'fully extinguished' — and CJ was a helper.", "1Flaymr identifies Btizz as the source of the phrase and recasts CJ as part of a group effort against him, making the previous battle the subject of the rebuttal."],
                            ["This flame can't get extinguished.", "The entire comeback is condensed into one denial. Its force comes from the fact that the room already knows the Btizz verdict being answered."],
                            ["Take off the top like a bottle of Guinness.", "Opening a familiar stout bottle becomes a threat to remove CJ's head, while the drink keeps the bar inside 1Flaymr's established cultural presentation."],
                            ["Hold your head like a ball and kick it.", "The body-part threat is simplified into a football action, returning to the kicking imagery used in the first round."],
                            ["Dead and buried, send all of them into the cemetery ... CJ full of chat, no action.", "The repeated end sounds carry a long death sequence before it resolves into the round's clearest character accusation: CJ's speech is not matched by action."],
                            ["CJ in a funeral bed ... in loving memory of CJ.", "1Flaymr closes by converting the battle into a memorial scene, completing the repeated dead-CJ refrain with a final inscription-like image."]
                          ]
                        },
                        {
                          mc: "CJ-Zino",
                          entries: [
                            ["You unveiled your face last time — let's say you're fully extinguished, catfish.", "CJ joins the balaclava reveal to Btizz's ending. Catfish argues that the face behind the constructed image did not match what the branding promised."],
                            ["Real name Friction.", "The former stage name was already exposed in Episode 16. Repeating it strips the relaunch back to an identity the room knew before One Flame."],
                            ["Catching fire — I got Katniss Everdeen.", "Katniss and the second Hunger Games title begin CJ's strongest connected counter to the flame persona."],
                            ["It's a crazy thing that he's Mockingjay.", "Mockingjay extends the franchise chain while the surface wording also presents 1Flaymr as someone copying or mocking another figure."],
                            ["Burn out the flame, let Snow just rain.", "President Snow becomes literal cold weather capable of putting out the fire, allowing the fictional antagonist to serve CJ's central battle argument."],
                            ["We're in the heart of the Hunger Games.", "The GZone ring becomes the arena, completing a scheme in which both the characters and environment belong to the same fictional world."],
                            ["Lay off the trees if you can't see potential.", "Trees refer to cannabis, while impaired vision explains why 1Flaymr supposedly cannot recognise CJ's ability."],
                            ["How did I lose to a guy that flows like that? ... Fully extinguished, time to die today.", "CJ points back to the official Episode 16 loss and treats Btizz's verdict as already proven, combining technical criticism with battle-record pressure."],
                            ["I swear I was on stage when Tiz brought you.", "CJ places himself at 1Flaymr's GZone introduction, giving the later Friction, mask, and extinguished angles the perspective of an eyewitness."],
                            ["Don't pass me a Gram — I'll headlock on you.", "Gram and Grams connect the line to the Tapped24 and Grams incident, turning recent league controversy into a concise physical callback."],
                            ["Took off that bally and everyone's fooled.", "The balaclava removal is used against 1Flaymr: revealing the face did not authenticate the persona but exposed how much the intimidation depended on concealment."],
                            ["On my mum's life, One Flame is an actor.", "CJ summarises the authenticity case directly, treating the accent, mask, threats, and fire identity as a performed role rather than real character."],
                            ["I don't need to get a flow to get a reload — I do it to give these people a boost.", "After accusing Btizz of borrowed flows in Episode 13, CJ presents crowd response as something he can create without depending on somebody else's cadence."],
                            ["I'm top five in the GZone — best believe it.", "The claim advances CJ's position after the Btizz win: he is no longer only asking for a next opponent but ranking himself within the platform."],
                            ["You're only bad when you're typing, actually.", "Online confidence is separated from live credibility, challenging whether the dangerous presentation survives face-to-face contact."],
                            ["Judas will stamp out fire; devil's at work, but he tried entice us.", "Religious betrayal and devil imagery are redirected toward the flame, giving CJ another route for presenting fire as something corrupt that must be put out."],
                            ["Bare face, no mystery.", "The removed mask no longer creates suspense. CJ argues that the visual reveal has left no hidden danger for the audience to imagine."],
                            ["You want to know why I'm battling today? Mind your business.", "CJ immediately echoes 1Flaymr's answer about changing his name, taking the opponent's phrasing and using it as the opening of his own response."],
                            ["You're a dickhead with no heart; your balls ain't built for the ring.", "The closer reduces the whole persona to a test of live courage: branding and online threats mean nothing if the performer is not suited to direct battle pressure."]
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
                            ["Homeless rhinos hate the sun, they put mud on them to block it", "Roman presents the animal fact as research, then bends homeless into the housing route already used against Ryno by 2MWAD and TymeLess."],
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
                            ["Show me your keys if you've really got a house", "After Ryno repeatedly says he is no longer homeless, Roman demands a visible object as proof. The challenge echoes the evidence-led style TymeLess used in Episode 11."],
                            ["Where's your sunflower lanyard?", "A disability-coded insult referencing the UK's hidden-disability sunflower scheme."],
                            ["Cross lines like a hashtag", "Hashtag lines create a modern visual for crossing boundaries, written lines, and other line-based meanings."],
                            ["Your ex-girl is SDL, but she looks like an STD", "An acronym is crudely flipped into a disease insult aimed at Ryno's relationship."],
                            ["He only loves English teams / English tea", "Football and tea supply the word association Roman uses to construct a closing nationalism and racism accusation; the rhyme is battle material, not evidence of the claim."]
                          ]
                        },
                        {
                          mc: "Ryno",
                          entries: [
                            ["You think he's blessed when he killed off his ex", "Ryno opens with the deceased-partner accusation Roman predicted moments earlier, an angle already used against Roman by Tapped24 in Episode 9."],
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
                            ["Homeless not anymore", "Ryno rejects the housing angle, but the wording closely repeats the defence he gave TymeLess in Episode 11 rather than replacing it with new proof."],
                            ["Why is your hat at half past six?", "Clock-hand imagery makes Roman's crooked hat into a lighter visual roast."],
                            ["The truth is, I didn't go from this to that", "A direct rebuttal denying Roman's visual or status downgrade comparison."],
                            ["Smoking Roman like roaches", "A roach is the end of a spliff, turning the opponent into something smoked down completely."],
                            ["Focused on Roman like a no-scope", "Gaming terminology suggests Ryno can hit Roman quickly without needing a scoped setup."],
                            ["With precision, I bin him", "Controlled accuracy is connected to disposing of Roman like rubbish."],
                            ["You're not marking, you're slurping and burning your words", "A performance critique accusing Roman of stumbling and failing to articulate clearly."],
                            ["This verse is worse than third-degree burns", "Severe burn imagery becomes a scale for the damage caused by Ryno's verse."],
                            ["I should have been clashing with Deens", "Ryno presents Roman as a lower-value opponent and renews the Deeno callout he made after beating 2MWAD in Episode 8."],
                            ["There's more deceased on your family tree", "Grief-based family disrespect continuing the battle's extremely dark direction."],
                            ["Who's this boring, awkward-talking, falcon-warring prick?", "A clustered opener attacking Roman's delivery and presenting him as strange and stiff."],
                            ["If I draw him, it'll floor him", "Draw can mean pulling a weapon, with floor him supplying the physical payoff."],
                            ["All of your kids wear Umbro", "A distinctly British clothing-status insult aimed through Roman's family."],
                            ["I'm not gay, rapist, homeless, you faked this", "Ryno directly rejects the central accusation package used throughout Roman's rounds."],
                            ["Lines through ROM like I'm paving roads", "ROM from Roman's name is crossed with road-marking lines for a cleaner name punch."],
                            ["Maximus Decimus Meridius", "The Gladiator character supplies a Roman Empire reference tailored to Roman's name."],
                            ["Looking like Sid at a toy store", "Toy Story's destructive child becomes a creepy visual comparison for Roman."],
                            ["Thought you went to war with the toughest of warriors — who's that, just Prince and Tapped? That's cap.", "Ryno quotes Roman's Episode 9 boast, reduces the résumé to PR1NC3 and Tapped24, and uses an earlier status claim as the setup for a rebuttal."],
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
                            ["From now, everything burn up", "The slogan previewed after Episode 13 becomes the debut's central promise. It is broad enough to cover the opponent, the room, and later roster callouts."],
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
                            ["All of this shit that man says is cap", "BTizz closes by summarising his main argument: the Jamaican, badman, and flame personas are exaggerated or fake."],
                            ["Fully extinguished", "Two words compress the cold counters, authenticity attacks, and crowd control into a final verdict. CJ and 1Flaymr both return to the phrase in Episode 19 because it became the battle's lasting summary."]
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
                            ["I know Ryno's bringing the ash ... I've got a point-one rock of crack, and this resembles both of your dads", "The two physical bags enter one connected family and drug scheme. The prop makes the punch visible, while the underlying family claim remains battle material."],
                            ["You put on a deep voice way too much, out here sounding like a motorbike ... You look like a 125", "Badee's performed voice becomes the sound of a small 125cc motorcycle, connecting an audible mannerism to an immediate visual and status comparison."],
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
                            ["How many Ls have you had against girls? / Kusha, Shami and me as well / I'mma just make this a hat trick", "Badee cites named opponents and presents herself as completing a pattern of women defeating Deeno. It is her résumé argument, not a complete official record supplied by this archive."],
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
                            ["I finessed your info ... the moment you entered, it was fake", "Badee says she deliberately planted the information behind Deeno's N-word angle. The reveal turns his research into a trap, although her explanation remains a claim made inside the clash."],
                            ["You know you choked that second round and there was no hope", "Badee connects the current stumble to her earlier Grams reference, making performance reliability a repeated case rather than a single interruption."],
                            ["D-E-N-O, why'd you move like Renzo? ... That's why they put you in the friend zone", "The spelling moves into Renzo and friend zone, repurposing the name sound Renzo used for his own branding in Episode 6."],
                            ["I just landed in GZone, promise I'm gonna take over ... I'm ready for AJ next", "Badee closes beyond the current result, treating the debut as entry to the roster and naming the next matchup she wants."],
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
                      {((battle.slug === 'deeno-vs-btizz' ? [
                        ["Deeno", [
                          ["You're the GZone's Oliver Twist; you kept begging and begging and begging.", "Oliver Twist's famous request for more is connected to Btizz repeatedly asking for the battle. The orphan reference also introduces Deeno's wider absent-parent and neglected-child angle."],
                          ["This clash here is a Catch-22.", "The room had just mistakenly said Tap 22. Deeno turns that live wording into Catch-22, making the interruption part of the bar rather than simply restarting."],
                          ["When CJ said you don't change your clothes, we know that it's facts.", "Deeno cites CJ Zino's earlier clothing and hygiene attack on Btizz. The callback presents a previous opponent's material as evidence that the criticism has followed Btizz across clashes."],
                          ["You might be number three on the roster, but outside of here you're an unknown.", "A status attack that concedes Btizz's internal ranking while arguing that his name has not travelled beyond GZone."],
                          ["This guy's always talking about murders; I'll flip your scheme and spill your red rum.", "Red rum is murder written backwards. Deeno literally reverses Btizz's repeated murder language and turns the opponent's signature word into a rebuttal."],
                          ["Btizz wants to be Jamaican so bad he AIs himself with dreadlocks.", "The line attacks Btizz's Jamaican-influenced performance style through an alleged AI image, arguing that the identity is constructed rather than natural."],
                          ["You look like a Rayman Rabbid with rabies.", "The Ubisoft character supplies an exaggerated visual comparison, while Rabbid, rabies, and the repeated R sounds create a compact sound pattern."],
                          ["See, I knew he'd take my flow, but see, I flipped the script.", "Deeno begins round three by claiming he anticipated Btizz's cadence imitation. The line works as a prebuttal and makes the copied flow the setup for Deeno's answer."],
                          ["Family house is also sad — it went from this to this.", "The line was performed with a Google Maps screenshot of Btizz's modest family home. The visual prop makes the lifestyle angle immediate instead of leaving it as an unsupported description."],
                          ["Your name is Ben... show this child is a monster: Ben 10.", "Btizz's first name becomes Ben 10, while the cartoon's transformations supply the child-and-monster payoff."],
                          ["I've got a blade too — Wesley Snipes.", "Wesley Snipes played Blade, so the actor's name completes a direct weapon-and-film reference."],
                          ["I'll batter man or rob him and leave that Bruce Wayne.", "The delivery folds batter man, rob him, and bruised into Batman, Robin, and Bruce Wayne. It is one of Deeno's clearest multi-part phonetic chains."],
                          ["I didn't need no two-week prep; I could have smoked Btizz with less than two days and sold the copies on Blu-rays.", "Two-week, two days, and Blu-ray maintain the same sound while turning short preparation into a boast about how easily the battle could be packaged and sold."],
                          ["Do you want to sign these adoption papers, so you've got someone that you can rely on?", "The between-round son jokes become a complete fatherhood angle. Deeno physically presents adoption papers as proof that he intends to “father” Btizz, paying off the earlier absent-parent material."],
                          ["I don't care if I win or lose, as long as Btizz is a bit suicidal.", "The closer replaces normal judging criteria with emotional damage. Its force comes from cruelty and commitment to the battle's dark family-and-death narrative rather than intricate wordplay."]
                        ]],
                        ["Btizz", [
                          ["Deluxx got murdered, CJ should have got murdered, Flame extinguished — turned my victim.", "Btizz converts his previous GZone opponents into a résumé. Deluxx and 1Flaymr represent recorded wins, while saying CJ should have been murdered disputes the loss and keeps the climb narrative intact."],
                          ["All I hear is Deeno's house and Deeno 3-0. No — TymeLess killed him, bro.", "A direct record rebuttal: Btizz answers Deeno's king language with the official loss to TymeLess rather than accepting the undefeated-home-ruler image."],
                          ["They said my mission's impossible, they said that Benji's done, and you look like Simon Pegg.", "Benji Dunn is Simon Pegg's Mission: Impossible character. Btizz develops the lookalike joke into a connected actor, character, and franchise scheme."],
                          ["This is your yard — turn that into my palace.", "The home advantage is reversed. Btizz does not merely say he can survive in Deeno's space; he claims he can upgrade and rule it."],
                          ["Before you start vanishing, doing like Madeleine; sink or swim, Deeno, start paddling.", "The dark disappearance reference moves into water language, linking vanishing, sinking, swimming, and paddling in one continuous threat."],
                          ["Three times you backed out the clash; two of them times you didn't want war.", "Btizz brings booking history into the round and presents earlier cancellations as avoidance, giving his aggression a real storyline rather than a generic threat."],
                          ["It's not me versus Deeno, it's me versus me.", "A self-competition boast that places Btizz's own ceiling above the opponent and supports his claim that each clash shows a different version of him."],
                          ["Lemons are sour like lime... you will lose it to lemons.", "TymeLess's repeated lemon props were central to his win over Deeno. Btizz reuses the fruit as shorthand for that loss and tries to make the old visual angle active again."],
                          ["Kachow, Kapow, Krakow, crack house.", "Cars, comic-book impact language, the Polish city, and drug-house imagery are linked through a fast multi-syllabic sound chain."],
                          ["This is my house; I keep my feet up, broski, just know that I'm cosy.", "The territory angle progresses from entering Deeno's yard to behaving like the owner. Feet up and cosy make the takeover visual and casual."],
                          ["Can't we flip bricks round here? Deeno, welcome to my Lego land.", "Bricks move from street and construction language into Lego. The scheme makes Btizz the builder and Deeno a figure trapped inside the world he controls."],
                          ["Deeno, no one's afraid of you now... I'm first in the roster, I'm taking the crown.", "Btizz closes his central status argument by moving from contender to number one and treating Deeno's crown as the prize for winning the clash."],
                          ["It's unholy that you look like Sam Smith if he hit roids.", "The song-title cue and celebrity comparison create a simple visual punch, exaggerating Deeno's appearance through a muscular version of Sam Smith."]
                        ]]
                      ] : battle.slug === 'deeno-vs-tymeless' ? [
                        ["Deeno", [
                          ["This is GZone, and this is my house.", "Deeno establishes the central territorial argument immediately. The claim continues his earlier insistence that GZone is his home and gives TymeLess a status position to attack throughout the battle."],
                          ["A headlock's really going to make you crash out? ... Try headlock me — koala ting, I'm letting it rip.", "The recent Tapped24 and Grams incident becomes live league history. Deeno presents himself as harder to restrain and turns clinging in a headlock into a koala comparison."],
                          ["You've only had one clash three times.", "Deeno argues that TymeLess has repeated the same battle identity rather than progressing, attacking experience and variety at once."],
                          ["Young Pete and Bas, rapping with grey hairs.", "The UK rap comparison makes TymeLess's age visible and sets up the grey-hair attack that TymeLess later reverses through the silver-fox line."],
                          ["They gave me TymeLess like he's someone to worry about.", "Deeno dismisses the booking before moving into the more technical second-round material."],
                          ["Why don't you see your kids on weekdays?", "This parenting attack echoes Ryno's Episode 11 argument that TymeLess needs more time for his children. TymeLess later reverses the subject by addressing Deeno's son."],
                          ["Why do you spell OK with three K's?", "Three Ks turns an ordinary spelling into a racism accusation. It develops allegations raised in the Ryno clash; it remains battle material rather than verified fact."],
                          ["Most Wanted, spin him, then replay. GTA, it's the final mission — Big Smoke or CJ. It's game over for you, no replay.", "Season branding, replay language, and the San Andreas characters form Deeno's strongest connected scheme. The final mission presents TymeLess as the last obstacle before completion."],
                          ["Trying to call shots when you know I run this shit.", "The bar returns the second round to the platform-authority argument established by Deeno's opening house claim."],
                          ["Call yourself TymeLess — how silly. If you've got time, drop it quickly.", "A direct stage-name flip turns possession of time into an instruction to deliver it or lose it."],
                          ["When it's my time, there is no reverse.", "Deeno contrasts the opponent's name with his own momentum: once his moment arrives, the result cannot be rewound."],
                          ["Put William in a spliff — bill it up.", "TymeLess's real name supplies Will and William while building a spliff supplies the bill-it-up sound. Ryno previously used William for fire-at-Will writing, making this a developed inherited route."],
                          ["This Froot Loop will get a Special K. Cheerio, mate — I'm a serial killer.", "Froot Loops, Special K, and Cheerios create a cereal chain before Cheerio changes into serial. The playful food references contrast with the violent final meaning."],
                          ["MJ — TymeLess ain't no Thriller.", "Michael Jackson and Thriller are used to say TymeLess is neither frightening nor iconic."],
                          ["For your girl, I know you're a Simpson — that explains why you look like Smithers.", "The Simpsons setup lands on Smithers as a recognisable visual comparison for TymeLess."],
                          ["I'll hit this guy with a l-l-lemonade.", "Deeno attempts a live response to TymeLess's lemon props by converting the fruit into lemonade. The stumble makes it important as a rebuttal attempt even though it does not take control of the motif."],
                          ["Your bars are dead like Ryno's dance.", "The dismissal brings TymeLess's previous GZone opponent into the round and uses a remembered Ryno performance moment as local evidence."],
                          ["Your baby mum looks like Miss Rachel, but can't help their kid with her speech.", "The children's-presenter comparison supports Deeno's family angle through a recognisable image and a parenting accusation."]
                        ]],
                        ["TymeLess", [
                          ["Do I look like the one with Crohn's disease? You ain't got a gun, Deeno — when your belly starts rumbling, it's the only time you're known to squeeze.", "TymeLess has just pretended that his own stomach is hurting and allowed the room to believe him. This line reveals the trick and redirects the illness imagery toward Deeno, beginning the planned toilet sequence."],
                          ["You went and got all the toilets locked off ... There's a big-ass turd and it won't flush. It's a plunger — go clear the toilet you blocked off.", "The embarrassing situation expands into a venue-wide problem before the physical plunger supplies the visual payoff."],
                          ["Go back to the toilet, sit on your own — the chair at GZone isn't your throne.", "TymeLess converts the toilet seat into Deeno's supposed royal seat. The crude opening scheme therefore resolves as a serious attack on platform authority."],
                          ["No security. Don't ever put your hands on me again. This is my house and I won't leave again.", "TymeLess answers Deeno's house and security language in the same round, rejecting the home advantage and claiming permanent space on the platform."],
                          ["Grams, if you put him in another headlock, this time make sure that he don't breathe again.", "The line invokes the physical controversy from Tapped24 vs Grams and imagines the same league incident being redirected toward Deeno."],
                          ["Since his shit can't flow like Ryno, let me take his flow and dump off.", "TymeLess openly brings his Episode 11 opponent's flow into the toilet scheme. The callback is also a cadence change, so the reference is heard as well as named."],
                          ["Who brought Keith Lemon in again? ... I brought another lemon in again — brought the fruit back to bury him again.", "Keith Lemon starts as a visual comparison for Deeno before the real fruit turns the name into a recurring physical motif."],
                          ["You're a ginger fox with fleas and ticks; I'm a silver fox that will beat your chick.", "TymeLess absorbs Deeno's grey-hair attack and changes age into confidence. The fox comparison makes the rebuttal visual and easy to retain."],
                          ["Both ginger men, they both can pen game, they came to GZone ... Ginga Jay giving himself a reload.", "Deeno is compared with the host through hair, platform, and writing. Ginga Jay's live reaction then becomes part of the punch rather than an interruption outside it."],
                          ["Prince Harry from Uber Eats, Paul Scholes, Weasley ... a leprechaun on a booster seat.", "Royalty, football, Harry Potter, and folklore are compressed into a recognisable run of ginger and height comparisons."],
                          ["It's Simon Pegg and Shaun of the Dead ... Who let the Sugar Puff Monster off the box?", "British film and cereal-mascot imagery extend the same visual character attack. Simon Pegg later becomes source material for Btizz's Mission: Impossible scheme."],
                          ["Let me talk to your son real quick. I'm your new stepdad, and I'm going to look after you next.", "TymeLess changes the target from Deeno to his son and reverses the earlier parenting criticism by casting himself as the dependable replacement father."],
                          ["When you ask what happened to your real dad, I'm going to say that your father is dead ... He didn't provide all right for his children.", "The stepfather performance develops into a death and neglect narrative, directly turning Deeno's weekday parenting attack back on him."],
                          ["Deeno, your mum's name's Kelly ... This one's a kill shot: Machine Gun Kelly ... That's why everyone says R. Kelly.", "Kelly is repeated through two celebrity names. The first supports weapon imagery; the second completes the deliberately offensive family sequence."],
                          ["She looks like Miss Trunchbull from Matilda.", "The Matilda character supplies an immediate visual comparison inside the third-round attack on Deeno's mother."],
                          ["Here it is: lemon number three. The real reason I brought lemons in the clash — if you get lemon, then you'll get squeezed.", "The final reveal counts the props, recalls every earlier appearance, and completes the battle-long setup with a simple pressure payoff. The image becomes shorthand for TymeLess's official win."]
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
                  <span className="text-orange-500 font-bold">{leagueName}</span>
                </div>
                {battle.episode && (
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-zinc-400 text-xs uppercase tracking-widest">Battle ID</span>
                    <span className="text-orange-500 font-bold">{battle.episode}</span>
                  </div>
                )}
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
                "NattyEBK made the battle part of a continuing run, naming his official win over PR1NC3 in the opening and returning to it with 'just killed Prince, now Z.K's next' in the third.",
                "Z.K produced the cleaner debut writing. Mickey Mouse, BBK, CCJs, Grimsby, grime, gaming, football, technology, and hygiene created a researched portrait, while round two gave him the clearest technical passage of the clash.",
                "Natty created the larger moments through direct confrontation, the screenshot and photograph, the Z.K weapon flip, twins, the throne claim, a stronger flow change, and the Prince-to-Z.K progression. Those elements gave his third round the more decisive shape.",
                "The crowd call and official archive record award NattyEBK the win, 2-1. Z.K's clarity kept the contest competitive, but Natty's escalation, physical evidence, room command, and stronger close carried the result."
              ]],
              ["deeno-vs-btizz", [
                "Btizz made the clash competitive through flow changes, record rebuttals, TymeLess callbacks, and deliberate mirroring of Deeno's cadence.",
                "The first crowd check was close enough to repeat, but the official record awards Deeno the win after the stronger opponent-specific third round and visual-prop sequence."
              ]],
              ["btizz-vs-cj-zino", [
                "BTizz started with high energy and broad attack angles, but CJ-Zino built the clearer narrative through originality, hygiene, credibility, and flow-theft pressure.",
                "CJ's sharper later rounds and stronger room control gave him the decisive momentum. The official record awards CJ-Zino the win."
              ]],
              ["deeno-vs-grams", [
                "Grams used the surprise reveal and preparation advantage effectively. His anti-Viking, image, drinking, parenting, race, women, fantasy, celebrity, and marketing routes formed the cleaner pre-written deconstruction.",
                "Deeno acknowledged being rattled and made adaptation the counterargument. Grams became weed, weight, weighing, age, outsider, Pen Game, and comeback material, while the final expanded into GZone status and a father-figure role.",
                "The battle therefore separates polish from recovery. Grams exposed stops that later opponents called a blank or choke; Deeno let the room see him construct material live and used the home platform to turn survival of the ambush into the competitive story.",
                "The closing crowd check, host commentary, and official GZone record award Deeno the win. The host's this-is-his-home explanation also advances the house claim that later becomes central against Badee Harz, TymeLess, and Btizz."
              ]],
              ["deeno-vs-badee-harz", [
                "Badee Harz made a confident debut built around Deeno's record against women, the Grams performance, family, finances, relationships, status, and the claim that she had deliberately planted false information for him to use.",
                "Deeno built the clearer battle-long frame. Newcomer, groupie, levels, my house, this is my home, and run this all supported one hierarchy argument, while the crack and ashes exchange, pop-culture references, and crowd hooks gave his third round the larger physical shape.",
                "The weakness on both sides was escalation. Unverified allegations, disability and family attacks, illness material, and sexual shock frequently obscured the cleaner Jasmine and Jafar, gambling, human flag, Darla, 125cc, article, family-gathering, and Renzo writing. Deeno also stumbled in round two, giving Badee's Grams callback visible force.",
                "The final crowd checks and host announcement awarded the battle to Deeno, matching the official GZone record. Badee's planted-information rebuttal made the close competitive, but Deeno's recovery, room familiarity, prop moment, and established home-platform narrative carried the decision."
              ]],
              ["btizz-vs-1flaymr", [
                "1Flaymr created one of Season 1's clearest debut identities. Everything burn, forest fires, Avatar, Fire Nation, Jamaican cadence, the balaclava, Moses, landlord, snowman, and firebender made the two-round performance immediately recognisable.",
                "Btizz won by making that identity the battleground. Plantain, Friction, fire-for-that, cold and ice, hygiene, claimed Jamaican authenticity, Sizzla, flag colours, Magnum, cornmeal, Postman Pat, and cap accusations all argued that the character was constructed and could be dismantled.",
                "The decisive advantage was control. 1Flaymr's denser delivery sometimes hid individual punches; Btizz simplified his counters, involved the crowd, repeated key phrases, and made the opponent's own fire language generate reaction against him.",
                "The closing crowd response and official GZone record awarded Btizz the win, his first after losses to Deluxx and CJ-Zino. Fully extinguished became the result's shorthand and later the central inherited phrase in 1Flaymr versus CJ-Zino."
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
                "Grams built the more consistent lifestyle case through Georgie, parenting, children, cats, money, work, benefits, clothes, free products, image, property, and the gap between Tapped's public character and adult responsibility.",
                "Tapped produced the larger escalation. He used Grams' Pen Game legacy and Deeno loss, disputed his own AJ result, then turned the final into a GZone-versus-Pen-Game loyalty argument supported by the returned screenshot tactic and the battle's largest visual moments.",
                "Special guest Denzel Bentley explicitly chose Tapped24, saying that Tapped ripped the room while still crediting Grams. The choice was announced before the physical altercation, security intervention, host warning, and later crowd checks.",
                "The official GZone record also awards Tapped24 the win, his first of Season 1 after losses to Deeno, Roman, and AJNA. The post-battle headlock controversy became future material, but the judged result reflects Tapped's stronger final-round narrative and room impact."
              ]],
              ["ryno-vs-roman", [
                "Roman converted season history into a single character case. Housing pressure that began with 2MWAD and was expanded by TymeLess returned through Leicester, sofas, roads, a supposed shed, house keys, NFA language, allegations, and questions about what Ryno's visibility had produced.",
                "Ryno identified much of the repetition and answered with homeless not anymore, demands to stop the allegation bars, Roman nameplay, delivery criticism, family attacks, and a direct challenge to Roman's claim that he had fought the toughest warriors.",
                "The difference was development and control. Ryno's housing defence largely repeated his answer to TymeLess, while Roman anticipated it through the shed and key-proof counters. Roman also predicted the deceased-partner angle before Ryno delivered it, reducing the surprise of another inherited route.",
                "The transcript includes a final audience check for Ryno but does not preserve a complete comparative vote. The official GZone record awards Roman the win, extending his run after PR1NC3 and Tapped24. His clearer three-round construction and steadier delivery outweighed Ryno's more scattered retaliation."
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
                "1Flaymr turned Episode 19 into a comeback argument. The same fire identity that Btizz had declared fully extinguished returned through everything-burn hooks, Jamaican cadence, gunshot rhythm, roster callouts, and direct insistence that the flame was still active.",
                "CJ-Zino produced the cleaner counter-writing. The Hunger Games sequence gave him the battle's strongest connected scheme, while Friction, the removed balaclava, online toughness, the Btizz result, and the inherited fully-extinguished phrase created a detailed case against 1Flaymr's authenticity.",
                "The deciding contrast was identity against deconstruction. CJ explained why the character should fail; 1Flaymr made the character persist in the room. His repeated hooks were less intricate, but they were easier to recognise, joined the clash to the wider roster, and made survival after Episode 16 feel like the central rebuttal.",
                "The transcript preserves separate audience checks without enough reliable information to compare their volume from text alone. The official GZone record awards the win to 1Flaymr, giving the flame persona a recorded recovery after the loss to Btizz."
              ]]
            ] as const).filter(([slug]) => battle.slug === slug).map(([slug, paragraphs]) => (
              <div key={slug} className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
                {slug === 'deeno-vs-tymeless' ? (
                  <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                    {[paragraphs[0], paragraphs[3]].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                ) : slug === 'nattyebk-vs-zk' || slug === 'cj-zino-vs-1flaymr' || slug === 'ryno-vs-roman' || slug === 'deeno-vs-badee-harz' || slug === 'btizz-vs-1flaymr' || slug === 'tapped24-vs-grams' || slug === 'deeno-vs-grams' ? (
                  <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
                      ["Battle-long identity", "Fire, burning, full clips, gunshot sounds, rum, and Jamaican cadence make all three rounds sound like parts of the same character."],
                      ["Archive rebuttal", "Naming Btizz as the source of fully extinguished turns the Episode 16 loss into material that 1Flaymr can answer directly."],
                      ["Repetition as structure", "CJ don't run, everything burn, fully active, and CJ dead operate as fixed hooks around looser passages."],
                      ["Roster-wide relaunch", "CJ, Btizz, Roman, Ryno, Tapped24, Darren, Jay, and Z.K expand the battle into a warning to the platform after the previous defeat."],
                      ["Opponent-specific peaks", "CJ-to-DJ, the Btizz-win challenge, the helper accusation, and no-action criticism are strongest when the fire persona is aimed precisely."],
                      ["Cultural and sound writing", "Heung-min Son, rum, Wayans, Guinness, Freddy, and Blackberry are joined by repeated end sounds and percussive delivery."],
                      ["Best quality", "A recognisable character can regain momentum through short cues even when the surrounding transcript is dense or the mic level changes."],
                      ["Main weakness", "Restarts, long repeated sequences, and sound-led phrasing sometimes obscure individual setups and reduce technical clarity."]
                    ]
                  },
                  {
                    mc: "CJ-Zino",
                    highlights: [
                      ["Inherited counter-persona", "CJ deliberately carries Btizz's fully-extinguished verdict into a new clash and builds his own writing around it."],
                      ["Hunger Games structure", "Catching Fire, Katniss, Mockingjay, Snow, flame, and the arena form the battle's clearest connected reference chain."],
                      ["Identity deconstruction", "Friction, the balaclava, the uncovered face, acting, attraction, and online toughness attack the person behind One Flame."],
                      ["League-history awareness", "The Btizz result, 1Flaymr's introduction, and the Grams headlock turn previous episodes into supporting evidence."],
                      ["Flow-authorship continuity", "I don't need a flow to get a reload develops the originality pressure CJ had already applied to Btizz in Episode 13."],
                      ["Immediate echo", "The third-round mind-your-business opening closely mirrors 1Flaymr's preceding name-change defence and gives CJ a visible responsive moment."],
                      ["Best quality", "The writing repeatedly accepts the opponent's imagery and converts it into counters rather than abandoning the established world."],
                      ["Main weakness", "Longer personal passages and disrupted delivery do not always convert the cleaner analysis into the room-defining reaction it needs."]
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
                        ["Character architecture", "The stage name, everything-burn slogan, fire imagery, cadence, balaclava, and movement all communicate the same identity."],
                        ["Preview-to-debut continuity", "One Flamer, fire for that, and everything burn move from the Episode 13 aftermath into complete material here."],
                        ["Elemental schemes", "Forest fire, Avatar, Fire Nation, firebender, snowman, December, smoke, and heat create recurring internal logic."],
                        ["Mask self-rebuttal", "Removing the balaclava and owning the ugly-face joke concedes the visual attack before Btizz can fully control it."],
                        ["Reference expansion", "Moses, Red Sea, landlord, eviction, Prince, Natty, CJ-Zino, and Deeno prevent the debut from remaining only one repeated flame slogan."],
                        ["Live elemental answer", "Hot flow, snowman, and December respond to Btizz's cold-bars and ice-zone counter rather than existing in isolation."],
                        ["Best quality", "A unique and repeatable performance identity is established within a single two-round battle."],
                        ["Main weakness", "Dense delivery, mic level, repetition, and long threat lists reduce the clarity of individual setups and punches."]
                      ]
                    },
                    {
                      mc: "BTizz",
                      highlights: [
                        ["Counter-persona design", "Every major route—cold, Friction, mask, hygiene, culture, and cap—attacks a component of the flame identity."],
                        ["Slogan appropriation", "Fire for that is converted from 1Flaymr's preview phrase into a call-and-response cue for Btizz's own punches."],
                        ["Cultural reference chain", "Plantain, rice and beans, Sizzla, Jamaican flag colours, Magnum, and cornmeal question the claimed authenticity through tailored imagery."],
                        ["Elemental opposition", "Cold bars and the ice zone supply a simple physical answer to forest fire, heat, and firebending."],
                        ["Identity research", "The Friction name and balaclava make the current character look traceable rather than mysterious."],
                        ["Crowd mechanics", "Name spelling, chants, pauses, repetition, and simplified visual punches let the room participate in the deconstruction."],
                        ["Best quality", "Btizz defines what the battle means and leaves the crowd with a concise phrase that survives the event."],
                        ["Winning edge", "Fully extinguished resolves the complete counter-persona case and supports Btizz's first official Season 1 win."]
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
                        ["Connected lifestyle case", "Georgie, children, cats, money, work, benefits, clothing, image, transport, and property test the persona against adult stability."],
                        ["Direct room address", "Speaking to Georgie makes the relationship argument involve visible evidence rather than an absent third party."],
                        ["Headlock motif", "The introduction's MMA joke, I-put-him-in-a-headlock line, and post-decision altercation combine into the incident later battles remember."],
                        ["Stage-name deconstruction", "Not Tapped, saying 24, not tapped in, and Tiny T repeatedly shrink the dangerous identity."],
                        ["Responsibility comparison", "Raising cats into queens becomes a strange but memorable counter-standard to the parenting allegations."],
                        ["Platform-transfer claim", "This is my home now argues that Pen Game history can be converted into a place inside GZone."],
                        ["Best quality", "The strongest rounds return to the same grounded image, relationship, parenting, and money standards."],
                        ["Main weakness", "Sound resets, interruptions, crowd debate, props, and rising tension weaken control of otherwise connected angles."]
                      ]
                    },
                    {
                      mc: "Tapped24",
                      highlights: [
                        ["Record reversal attempt", "Tapped reframes the AJNA loss as a platform decision that did not reflect what happened technically."],
                        ["Pen Game legacy pressure", "Prior losses, damaged reputation, age, money, employment, and family structure make experience evidence against Grams."],
                        ["GZone hierarchy", "You are not me or Deeno places the established home names above a recent Pen Game arrival despite Tapped's own record."],
                        ["Platform-war close", "Go home, both group chats, snake, defending ours, and fuck Pen Game give the final a narrative larger than individual personals."],
                        ["Evidence tactic evolution", "The Episode 9 text-message screenshots return as an Instagram image used for an offensive allegation rather than defence."],
                        ["Physical theatre", "John Cena, Badee's underwear, the displayed screenshot, and direct crowd interaction create the battle's clearest visible moments."],
                        ["Best quality", "Escalation turns three rounds of status pressure into a decisive final and the room swing noted by Denzel Bentley."],
                        ["Winning edge", "The guest selection and official record reward the stronger final-round shape; the later altercation is aftermath, not the judging basis."]
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
                        ["Predictive defence", "Roman announces the deceased-partner angle before Ryno uses it, exposing its Episode 9 lineage and reducing its surprise."],
                        ["Three-round case", "Housing, allegations, public image, family, views, bookings, and status recur often enough to make separate rounds feel connected."],
                        ["Inherited-route development", "Leicester and homelessness come through 2MWAD and TymeLess, but the shed, keys, career questions, and visual comparison extend the argument."],
                        ["Name and persona flips", "Rhino mud, solitary animals, squad-deep Romans, relegation, Ryan Winfield, and windshield attack both the stage name and social position."],
                        ["Status sequence", "Zero risk, zero gain, one million views, fame, bookings, and stage demand convert online reach into a measurable-career challenge."],
                        ["Controlled pacing", "Pauses, reloads, and deliberate delivery help the room separate dense allegations from the cleaner punch structures."],
                        ["Best quality", "Roman consolidates material heard elsewhere into a more coherent and opponent-specific prosecution."],
                        ["Main weakness", "Extreme, ableist, and unverified allegation material can overpower the stronger technical writing and should not be treated as fact."]
                      ]
                    },
                    {
                      mc: "Ryno",
                      highlights: [
                        ["Aggressive retaliation", "Ryno answers Roman's case with partner, family, grief, body, drinking, children, and street-credibility attacks."],
                        ["Direct rebuttal awareness", "Homeless not anymore, dead the rapist bars, and the final list of allegedly faked claims show that Ryno understands the inherited narrative."],
                        ["Roman name progression", "R-to-the-O spelling develops into ROM road markings and Maximus Decimus Meridius, moving from cadence into tailored references."],
                        ["Résumé rebuttal", "Ryno quotes Roman's toughest-warriors claim and reduces the record behind it to Prince and Tapped."],
                        ["Technical peaks", "Hat at half past six, no-scope focus, precision, third-degree burns, and road lines provide cleaner moments inside the darker personal writing."],
                        ["Target escalation", "Calling for Deeno again continues Ryno's effort to present himself as ready for a larger GZone opponent."],
                        ["Best quality", "Short direct counters create bite when the delivery slows enough for the room to catch them."],
                        ["Main weakness", "Restarts, unstable pacing, incomplete passages, and the admission about weak writing prevent the rebuttals from replacing Roman's case."]
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
                      ["Surprise-entry momentum", "Grams weaponised the booking switch immediately: Deeno had prepared for 2 Man, while Grams entered with opponent-specific material."],
                      ["Anti-Viking angle", "Arthur, Odin, war and costume imagery strip Deeno's branding of heroic weight and recast it as dress-up."],
                      ["Body and stamina angles", "Size becomes a repeated target through running, burpees, bikes and physical ability, giving separate punches one coherent route."],
                      ["Race and identity pressure", "Grams challenges language and cultural references he considers inauthentic, widening the attack from appearance into persona."],
                      ["Pop-culture sequencing", "Kirby, Arthur, Caesar, Shrek, Ed Sheeran, Harry Potter, Ron Weasley, Fiona and Daphne keep the imagery changing without abandoning the character attack."],
                      ["Control of Deeno's pauses", "Because Grams is the prepared battler, every Deeno stop reinforces his claim that the ambush has exposed a limit in Deeno's adaptability."],
                      ["Best quality", "He makes the surprise feel intentional and controlled rather than like a random interruption, maintaining the clearer pre-written deconstruction."],
                      ["Main weakness", "The broad spread of image, race, parenting and celebrity angles is polished but does not create as decisive a closing ownership statement as Deeno's final round."]
                    ]
                  },
                  {
                    mc: "Deeno",
                    highlights: [
                      ["Freestyle recovery", "Deeno openly identifies the opponent switch and makes live construction part of the performance rather than pretending every route was pre-written for Grams."],
                      ["Name-flip engine", "Grams becomes weed, weight, smoking and the act of weighing punches, allowing one name to support several connected attack routes."],
                      ["Visible reset", "The stops and restart reveal the risk of improvising under pressure; the recovery keeps the round alive, but the blank remains usable evidence for Badee Harz in Episode 17."],
                      ["Platform-status angle", "Deeno frames GZone as his stage and Grams as an outsider entering his territory, extending the 'my house' claim made against Tapped24 in Episode 1."],
                      ["Scene callouts", "Wider league names turn a one-opponent battle into a statement about Deeno's place in the developing Season 1 hierarchy."],
                      ["Age and responsibility angle", "He attacks Grams for being older without children or direction, then casts himself as a father figure to the platform."],
                      ["Best quality", "He turns the ambush itself into his narrative: the audience watches him recover, build new material and claim ownership of the room."],
                      ["Winning edge", "The official decision rewards adaptation and final-round authority; the host's 'this is his home' remark seals the house motif that continues through later Deeno battles."]
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
                      ["Territory narrative", "My house, this is my home, run this, levels, and newcomer language organise the battle around Deeno's established GZone position."],
                      ["Recovery mechanism", "After restarts and a stumble, Deeno uses freestyle comments and the house refrain to reset himself and reconnect with the room."],
                      ["Opponent-specific schemes", "Jasmine and Jafar, Harley Coleman, country questions, the human flag, Darla, deep voice, and the 125cc motorbike are tailored to Badee."],
                      ["Physical prop writing", "The 0.1-gram crack bag and Badee's ashes turn the third-round family and drug route into a visible exchange."],
                      ["Crowd-hook structure", "Nobody call-and-response, repeated house claims, and short visual comparisons make later material easier to follow than the dense personals."],
                      ["Archive continuity", "The home claim and freestyle recovery develop patterns visible against Tapped24 and Grams and later challenged by TymeLess and Btizz."],
                      ["Best quality", "Experience lets Deeno survive disruption and make platform position part of the writing rather than only an introduction."],
                      ["Main weakness", "A second-round stumble and excessive family, disability, illness, and sexual shock weaken the cleaner technical routes."]
                    ]
                  },
                  {
                    mc: "Badee Harz",
                    highlights: [
                      ["Debut-to-roster structure", "Baddest on GZone, B-A-D-double-E, take over, and AJ next make the appearance an arrival statement with a future target."],
                      ["Women's-record argument", "Kusha and Shami are cited before Badee names herself as the third loss, using a claimed pattern to reduce Deeno's experience advantage."],
                      ["Performance-history pressure", "The Grams mind-blank reference is developed when Deeno stumbles again and Badee calls his second round a choke."],
                      ["Planted-information rebuttal", "Badee says the N-word story was deliberately seeded and fake, turning Deeno's research process into the subject of the counterattack."],
                      ["Name and sound writing", "B-A-D-double-E, D-E-N-O, Renzo, and friend zone create audible identity moments inside the heavier personal material."],
                      ["Opponent-specific routes", "Casino, Spain, the alleged bladed article, family gathering, finances, furniture, and Deeno's next-opponent status keep the writing targeted."],
                      ["Best quality", "She performs without visible newcomer deference and finds a genuine strategic turn in the third-round information reveal."],
                      ["Main weakness", "Long allegation packages and extreme family or disability attacks sometimes bury the clearer gambling, article, naming, and archive callbacks."]
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
                      ["Roster progression", "Prince is named as the first recorded body and Z.K as the next, giving Natty a two-battle narrative rather than an isolated win claim."],
                      ["Direct pressure", "The stage name, travel, money, teeth, breath, religion, family, and claimed danger are delivered for immediate confrontation rather than layered ambiguity."],
                      ["Angle reversal", "Breath and hygiene pressure used against Natty by PR1NC3 is redirected toward Z.K through plaque, teeth, washing, and dating material."],
                      ["Physical evidence", "A screenshot and photograph interrupt the beat and turn the second round into a claimed proof sequence. The allegations remain unverified battle material."],
                      ["Stage-name control", "Natty first questions whether Z.K has ever used the blade implied by his name, then imagines drawing his own Z.K from a case."],
                      ["Best round", "Round three: twins, paired weapons, the GZone throne, house invasion, Canada Goose, Prince, Z.K, and the flow change create his clearest escalation."],
                      ["Main weakness", "Stops, harsh personals, and loosely connected accusations can obscure the stronger wordplay and progression writing."],
                      ["Winning edge", "Greater room command, more decisive visual moments, and a stronger closing narrative carry the audience decision."]
                    ]
                  },
                  {
                    mc: "Z.K",
                    highlights: [
                      ["Debut strategy", "Research, clarity, and recognisable references are used to resist Natty's established room momentum."],
                      ["Inherited pressure", "PR1NC3's Mickey Mouse comparison is reused through Natty's haircut, while the earlier hygiene weakness is broadened into home and appearance material."],
                      ["Grime credibility", "BBK, Dimzy, Wiley, Central Cee, and AJ Tracey give Z.K a musical standard against which to question Natty's EBK identity and output."],
                      ["Best round", "Round two: Batman and Robin, Grimsby-to-London movement, cultural food, Virgil van Dijk, Arsenal, Tekken, Wiley, and lemon imagery form the strongest technical route."],
                      ["Audible flow critique", "The Natty-the-nip section names and performs a cadence rather than leaving the originality criticism as an unsupported statement."],
                      ["Third-round sound chain", "Pokémon, Mewtwo, Bluetooth, Kindle, Pringle, single, and shingles create a clear sequence across immaturity, technology, writing, music, and appearance."],
                      ["Main weakness", "The writing remains easier to follow, but individual references do not resolve into a final narrative strong enough to answer Natty's third."],
                      ["Outcome", "Z.K makes the debut competitive and likely takes the second, but has less room impact and loses the crowd decision 2-1."]
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
                {(battle.slug === 'deeno-vs-btizz' ? [
                  ["Deeno", "Opponent-specific structure::The booking requests, family history, clothes, roster status, copied flow, and previous clashes all support one argument about stopping Btizz's rise.|Live rebuttal::Tap 22 becomes Catch-22, while the murder language is reversed into red rum.|Visual evidence::The Google Maps screenshot, headstone photograph, and adoption papers make the third round readable before every line is fully processed.|Third-round narrative::Flow imitation leads into the flipped script, physical props, and Deeno presenting himself as the father Btizz can rely on before the closing emotional-damage angle.|Pop-culture wordplay::Oliver Twist, Rayman Rabbids, Ben 10, Blade, Batman, Robin, Bruce Wayne, and Blu-ray give the rounds varied reference points.|Best quality::Adaptation and the ability to turn live moments into connected written structure.|Main weakness::Extremely dark family material and repeated prop-related stops sometimes overpower the cleaner technical writing.|Winning edge::The strongest final-round shape and the most decisive visual moments."],
                  ["Btizz", "Flow variation::Btizz changes cadence, uses faster internal-rhyme pockets, and openly mirrors Deeno rather than staying inside one delivery pattern.|Roster continuity::Deluxx, CJ Zino, and 1Flaymr become proof of a climb toward the self-proclaimed GZone king.|Record rebuttal::The TymeLess result directly challenges Deeno's house, crown, and 3-0 claims.|Deliberate mirroring::Earlier accusations of borrowed flows are turned into an obvious imitation designed to provoke Deeno in real time.|Inherited callbacks::Lemons and Simon Pegg reuse memorable TymeLess material but develop it through a new loss reference and Mission: Impossible scheme.|Territory narrative::Yard, palace, house, cosy feet-up imagery, roster position, and crown language create a repeated takeover theme.|Best quality::Energy, adaptability, and the confidence to make wider GZone history part of the performance.|Main weakness::Overpacked passages, unclear wording, and repeated third-round restarts weaken control at the close."]
                ] : battle.slug === 'deeno-vs-tymeless' ? [
                  ["Deeno", "Territory framing::The opening house claim and later run-this language present Deeno as the established GZone figure defending his position.|League callback::The Tapped24 and Grams headlock incident becomes evidence for how Deeno says he would react to physical pressure.|Inherited Episode 11 angles::William, time writing, parenting criticism, and racism allegations develop routes previously used by Ryno against TymeLess.|Gaming structure::Most Wanted, GTA, Big Smoke, CJ, final mission, game over, and replay create his strongest connected scheme.|Third-round sound chain::Froot Loops, Special K, Cheerio and serial killer turn cereal names into violent wordplay.|Live counter attempt::Lemonade directly answers the fruit props, but the stumble stops the rebuttal from taking ownership of the image.|Best quality::His cleanest writing is tailored to TymeLess's name, history, and established vulnerabilities.|Main weakness::Restarts and heavier personals interrupt the stronger technical routes."],
                  ["TymeLess", "Room misdirection::TymeLess pretends that his own stomach hurts, lets the room believe the complaint, and then reveals it as the setup for Crohn's disease, IBS, squeezing, locked toilets, the plunger, and taking-the-piss material about Deeno.|Status transformation::The toilet seat becomes Deeno's false throne before TymeLess claims the GZone house for himself.|Prop evolution::The physical-object style used against Ryno develops into a plunger, photograph, and three lemons that organise whole passages.|Angle reversal::Grey hair becomes the silver fox, while Deeno's parenting attack becomes a stepfather performance addressed to Deeno's son.|Room involvement::Ginga Jay, reloads, reactions, and repeated props make the people around the ring part of the writing.|Battle-long payoff::Keith Lemon becomes real lemons, survives the lemonade counter, and resolves through the third-lemon squeezing punch.|Forward legacy::Episode 22 reuses the official result, lemons, Simon Pegg, and the house dispute against Deeno.|Winning edge::Stronger structure, clearer recurring images, and better crowd connection carry the decision."]
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
