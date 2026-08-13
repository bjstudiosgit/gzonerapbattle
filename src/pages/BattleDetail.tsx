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
                  {battle.winner
                    ? battle.slug === 'zk-vs-cj-zino'
                      ? "Official Audience Decision"
                      : "Official Judges' Decision"
                    : "Awaiting Decision"}
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
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Episode 1 opened the official Season 1 record with a main event between former friends. Tapped24 and Deeno did not treat the booking as a neutral introduction: shared homes, partners, children, private disputes, other scene names and messages were all used as battle material. That history gives the clash a narrative spine, but the serious allegations throughout remain claims made in performance rather than independently verified facts.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Tapped&apos;s first needed several starts because of microphone handling, a technical reset and a commentary reload. The repeated version established his method: medical and appearance shock, family attacks, &ldquo;who ate all the pies,&rdquo; racist-past and Skamz allegations, California cannabis language, boxing references and the name flip &ldquo;No D—no, I&apos;m your dad.&rdquo; It was hostile and recognisable, but its strongest ideas competed with the length and disorder.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Deeno answered by explaining why the friendship had ended: Tapped had allegedly spoken about his children and crossed a boundary. Paternity and parenting attacks, a claim that Tapped&apos;s son preferred Deeno, former visits to the flat and messages from Tapped&apos;s partner all supported that retaliation frame. When Deeno said &ldquo;check the screenshots&rdquo; and physically presented the messages, the argument changed from spoken accusation into alleged visual evidence and produced the round&apos;s defining reaction.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Tapped&apos;s second repeated &ldquo;Deeno&apos;s friend is dead&rdquo; and used the former friendship to attack family, health, partner and credibility. Deeno&apos;s reply returned to authorship, alleged bad-man behaviour, apologies to other figures and the fact that Tapped had slept on his sofa. &ldquo;Cap 24,&rdquo; &ldquo;shit dad 24,&rdquo; &ldquo;act 24&rdquo; and &ldquo;bad 24&rdquo; then converted the stage name into a reusable accusation structure. The room&apos;s &ldquo;this is my house&rdquo; reaction begins language Deeno later makes central to his GZone authority.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Tapped&apos;s third moved quickly through Crohn&apos;s and food, alleged debts, Pen Game, family, postcode and appearance references. Deeno closed by returning to the strongest case: alleged ghostwriting, time spent with other people&apos;s children, &ldquo;do you know what&apos;s tapped?&rdquo; repetitions, a list of people said to have pressured Tapped, child support, council tax and the claim that Deeno was the better father. GOAT and sheep, ship and plank, then Rob Van Dam gave the final a technical exit.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The video checks the blue corner for Tapped24 and then the red corner, but transcript text cannot encode the comparative volume and the red battler&apos;s name is not spoken in the surviving close. The official GZone archive awards Deeno the win. His clearer betrayal narrative, screenshot prop and returning fatherhood case created the larger complete story; Tapped established the relentless pressure style that remains active across his later season.
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
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Tapped24", "The first-show chaos becomes pressure", "Mic requests, a technical reset and a commentary reload force repeated openings. Medical and appearance shock, family, food, alleged racism, California cannabis, boxing, Skamz and 'No D, I'm your dad' establish the aggression even when the construction becomes crowded."],
                      ["Round 1 — Deeno", "Betrayal turns into alleged evidence", "The former friendship and comments about Deeno's children justify the retaliation frame. Paternity, parenting, son-preference and partner-message claims lead to physical screenshots, making alleged private communication the visual climax of the opening exchange."],
                      ["Round 2 — Tapped24", "The friendship is declared dead", "Tapped repeatedly says Deeno's friend is dead, then uses family, health, partner, hospitality and former access to Deeno's home as personal attack surfaces. Live interruptions and an eventual restart keep the round emotionally heated but structurally loose."],
                      ["Round 2 — Deeno", "The name becomes an accusation template", "Alleged ghostwriting, scene figures, bad-man credibility, apologies, children and sleeping on Deeno's sofa become the setup. Cap 24, shit dad 24, act 24 and bad 24 then turn the stage name into the round's memorable repeated format."],
                      ["Round 3 — Tapped24", "Density, food and wider-scene status", "Crohn's, burgers, chicken, fries, doughnuts, alleged debt, Pen Game, family, postcode, Barney, Michael Jackson and Bruce Willis arrive at speed. The breadth creates pressure but gives no single route enough time to dominate the close."],
                      ["Round 3 — Deeno", "Parenthood becomes the verdict", "Ghostwriting and other-people's-children claims lead into repeated 'what's tapped?' questions, a pressure list, child support, council tax and better-dad language. GOAT and sheep, ship and plank, and Rob Van Dam finish a round organised around responsibility."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The screenshots establish the visual-evidence tactic", "Deeno physically shows messages after saying Tapped's partner contacts him. The room can inspect an object rather than only hear a claim, although the page does not independently authenticate the messages or their interpretation."],
                      ["Tapped later says he has done a Deeno", "Against Roman in Episode 9, Tapped answers printed-message pressure with his own screenshot and explicitly describes the move as doing a Deeno. A tactic used against him becomes a named part of his own battle vocabulary."],
                      ["The screenshot returns against Grams", "In Episode 15 Tapped again uses visual phone evidence while widening the clash into a Pen Game-versus-GZone argument. The Episode 1 reveal therefore evolves from personal retaliation into a repeatable performance method."],
                      ["Fatherhood becomes Deeno's long-form identity", "Deeno frames this battle around comments on his children and whether Tapped provides for his. Against Grams he expands the role into being a father figure around GZone; against BTizz he presents adoption papers and offers to father the opponent."],
                      ["My house begins as room language", "The phrase 'this is my house' is heard during the reaction to Deeno's second. Deeno later makes GZone ownership explicit against Grams and Badee Harz, while TymeLess and BTizz turn house and throne language into rebuttals."],
                      ["Crohn's remains inherited attack material", "Tapped uses Deeno's illness in the opening and returns to it in the third. TymeLess later builds a complete fake-stomach, Crohn's, IBS, toilet, plunger and throne sequence, developing a shock reference into a battle-long concept."],
                      ["Pen Game pressure starts before Episode 15", "Tapped says Pen Game did not cover Deeno's travel, placing platform value inside the opening battle. When Tapped faces Grams, that scene reference expands into a full loyalty and legacy conflict."],
                      ["The 24 structure becomes reusable writing", "Deeno's cap 24, shit dad 24, act 24 and bad 24 sequence demonstrates how a stage-name number can organise multiple accusations. The repetition makes the opponent's brand carry the criticism itself."],
                      ["Ghostwriting enters the season immediately", "Deeno alleges that SM wrote Tapped's bars. Later battles repeatedly question ownership—Deluxx compares BTizz with Tapped, CJ challenges BTizz's flow, and BTizz alleges Mikez wrote Deluxx—without the archive treating any claim as proven."],
                      ["Shared hospitality sharpens the betrayal", "Tapped says he stayed at Deeno's home; Deeno says Tapped slept on his sofa. The same fact is used from opposite directions: Tapped claims insider knowledge, while Deeno says a former dependent betrayed the person who helped him."],
                      ["Technical reloads are carefully separated", "The first show has mic problems, host-directed restarts, a commentary reload and crowd reactions. The page distinguishes those causes rather than calling every repeated verse an earned crowd reload."],
                      ["The official winner settles an incomplete text close", "The blue-corner Tapped call and red-corner call are preserved, but text cannot compare volume. Deeno's official archive win supplies the result, while the analysis explains the narrative and prop reasons it fits the complete performance."]
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
                  Performance Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Tapped24 establishes the character later battles call Mr Disrespectful. Health, appearance, family, partner, children, racism and private-history allegations arrive without a neutral warm-up. The bluntness is strategic: the room understands immediately that former friendship offers Deeno no protection.
                      </p>
                      <p>
                        His first has useful recurring anchors despite the disruption. &ldquo;Who ate all the pies&rdquo; gives body material a crowd hook; California and breaking down create a cannabis pocket; &ldquo;No D, I&apos;m your dad&rdquo; turns the opponent&apos;s name into hierarchy. Mic handling, technical stops and a commentary reload force him through the opening several times.
                      </p>
                      <p>
                        The second has stronger emotional continuity than technical organisation. &ldquo;Deeno&apos;s friend is dead&rdquo; makes the relationship itself the refrain, while having stayed in Deeno&apos;s home supports claims of insider knowledge. The final is fast and reference-heavy—Crohn&apos;s, food, Pen Game, postcode, Barney, Michael Jackson and Bruce Willis—but the density buries several setups.
                      </p>
                      <p>
                        Tapped&apos;s lasting achievement is pressure and an archive of surfaces other battlers can revisit. His weaknesses are clarity and selection: serious allegations and stacked shock can overwhelm the cleaner California, father-name and friendship writing. The loss does not erase the identity; he later adopts Deeno&apos;s screenshot method, explicitly names the callback and carries the same intensity through Roman, AJNA and Grams.
                      </p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>
                        Deeno answers pressure with motive. Former friendship, comments about his children and the crossed boundary explain why he is revealing private material. That narrative does not make the content less extreme, but it makes the rounds feel like one retaliation case rather than three unrelated attack lists.
                      </p>
                      <p>
                        The screenshot is the decisive performance invention. Deeno claims Tapped&apos;s partner messaged him, tells the room to check, then gives people something physical to examine. Its importance is not independent proof—the messages and interpretation are not authenticated here—but the conversion of words into a visible stage event.
                      </p>
                      <p>
                        Round two shows his repeatable structural skill. Authorship and credibility claims lead into sofa and hospitality history, then cap 24, shit dad 24, act 24 and bad 24 make the opponent&apos;s name carry each accusation. The third returns to parenthood through other people&apos;s children, pressure names, child support and council tax before declaring Deeno the better father.
                      </p>
                      <p>
                        The performance also creates future vulnerabilities. Illness, disability, self-harm, children and partners are used with little restraint, and later opponents answer those same private surfaces. Yet Deeno&apos;s strongest tools—visual props, fatherhood authority, repeated name structures and ownership of the room—become the through-line of his Season 1 character. The official opening win gives that identity its first result.
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
                    Episode 8 placed Ryno&apos;s GZone debut against 2MWAD, who was returning from an official loss to LDN Mikez in Episode 4. Ryno opened beyond the immediate booking by warning every MC in the room, then turned 2MWAD&apos;s social-media clips, dancing, camera performance and sound effects into a credibility attack. 2MWAD answered by refusing that wider status claim and making Ryno&apos;s alleged living conditions the battle&apos;s main story.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The first round establishes both identities clearly. Ryno predicts homelessness jokes, denies living with his mother and recasts himself as 2MWAD&apos;s stepfather, while Jigglypuff and mortar imagery add more recognisable punches. 2MWAD uses a sleeping bag by a pond, change outside a bank, stained clothes, substance use and employment to make the housing claim visual rather than abstract. A mic failure forces him to restart much of the round.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Ryno&apos;s second is the technical centre but also the most disrupted passage. &ldquo;Main objective: break down you&rdquo; keeps restarting around sound trouble before Pen Zeppelin, lead, rock and roll and Stairway to Heaven produce the cleanest connected scheme. Banking, bedding, music, clothing and the &ldquo;roadman Jackson 5&rdquo; image extend the attack from 2MWAD alone to his presentation and crew.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    2MWAD&apos;s second turns from housing into politics, alleged racism, bailiffs and a serious allegation concerning sexual conduct. Ryno begins the third off the dome, directly answering the Britain and pond language before saying he expected the allegation and producing an NFA document. The document is used as his defence inside the clash; the page records that exchange without treating either battler&apos;s legal claim as independently verified fact.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    After the document sequence, Ryno returns to prepared writing through fathers, pawn and checkmate, Katt Williams, performance criticism and a request for Deeno next. 2MWAD closes through snake, sheep, insect and fruit language, then returns to money, KFC, housing, professional status and alleged conduct. His &ldquo;GZone traveller, 3-0 massacre&rdquo; line turns the visitor role into the final argument for a complete win.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The official GZone record awards 2MWAD the victory. Ryno produced the sharper isolated technical sequence and the battle&apos;s most consequential live defence, but 2MWAD sustained one opponent-specific portrait across all three rounds and repeatedly restored it after Ryno&apos;s rebuttals. The same housing, racism and NFA routes continue against Ryno in Episodes 11 and 18, showing that a result can improve a record without closing the angles used inside it.
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

            {battle.slug === '2mwad-vs-ryno' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Ryno", "A platform-wide debut becomes persona criticism", "Ryno first addresses every possible GZone opponent, then questions who 2MWAD is and attacks his clips, dancing, camera presence and comedy. He predicts the homelessness route, denies living with his mother and uses stepfather, Jigglypuff, mortar and parenting language to establish aggression and rebuttal readiness."],
                      ["Round 1 — 2MWAD", "Housing becomes a visual battle story", "A sleeping bag beside a pond, begging outside a bank, stains, hygiene, alcohol, drugs, care and unemployment turn alleged instability into concrete scenes. A mic problem forces a restart, after which 2MWAD repeats the core images so the main angle survives the interruption."],
                      ["Round 2 — Ryno", "Technical peak under repeated restarts", "Main objective: break down you is attempted several times while the audio is corrected. Ryno attacks sound effects, music, relationships and finances before Pen Zeppelin, lead, rock and roll and Stairway to Heaven form the battle's cleanest scheme; roadman Jackson 5 closes on crew image."],
                      ["Round 2 — 2MWAD", "Politics, bailiffs and a serious allegation", "2MWAD calls Ryno right-wing and racist, returns to unstable housing through friends' homes and furniture taken by bailiffs, then raises an allegation concerning sexual conduct. Family, appearance and nationality language keep the long round confrontational after another requested reload."],
                      ["Round 3 — Ryno", "Live defence before prepared writing", "Ryno freestyles on Britain, the pond and 2MWAD's preceding angle, says he knew the allegation would be used and produces an NFA document. He then moves back into dead-father anticipation, pawn and checkmate, appearance, flow and status, ending by requesting Deeno next."],
                      ["Round 3 — 2MWAD", "The original narrative is restored", "Snake, sheep, insects, partner and animal language lead into the GZone traveller and 3-0 declaration. Fruit idioms, KFC spare change, housing, robbery, professional fees and alleged conduct return the close to the money-and-stability case that began in round one."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["2MWAD arrives from the Mikez loss", "LDN Mikez officially beat 2MWAD in Episode 4. Ryno's who-is-2Mad status question therefore attacks a battler still looking for his first recorded win; Episode 8 changes that record when 2MWAD takes the official decision."],
                      ["Ryno predicts the homelessness route", "Before 2MWAD begins, Ryno names homeless jokes as the expected attack and denies living with his mother. The prebuttal identifies the route but does not prevent 2MWAD making it the dominant image across all three rounds."],
                      ["The pond becomes a live callback", "2MWAD's sleeping-bag-by-the-pond image opens his case. Ryno starts the third off the dome by saying he does not live in a pond, proving that he has tracked the exact wording even though the broader housing narrative remains active."],
                      ["Housing survives into Episode 11", "TymeLess inherits homelessness directly from Episode 8, and Ryno eventually produces property keys. The response evolves from a spoken denial here into a new physical proof object, while TymeLess answers with a whole kit of household supplies."],
                      ["Housing is refined again in Episode 18", "Roman later uses sofa-surfing, a shed, Leicester accommodation, roads and proof of residence against Ryno. The same core claim becomes less comic and more biographical as later opponents add locations and alleged chronology."],
                      ["2MWAD establishes the racism dispute", "The take-back-Britain sequence labels Ryno right-wing and racist. TymeLess explicitly says in Episode 11 that 2MWAD made the accusation, turning this round into named archive material rather than presenting the route as a new discovery."],
                      ["NFA changes documents from attack to defence", "Earlier props such as Deeno's screenshots were used to expose an opponent. Ryno produces an NFA document to answer an allegation about himself, making paperwork a rebuttal object rather than only an offensive reveal."],
                      ["The NFA wording remains contested", "Ryno says the document prevents the allegation being used again. TymeLess and Roman later return to NFA language anyway, arguing over what no further action means. The page preserves the battle dispute and does not issue its own legal conclusion."],
                      ["The document evolves into keys", "Ryno's Episode 8 proof is legal paperwork; his Episode 11 proof is a set of property keys. Both attempt to settle a recurring claim through a visible object, but later opponents respond by changing the allegation or overwhelming one object with several."],
                      ["Ryno's sound-effect criticism targets identity", "2MWAD is introduced through whoosh sounds, and Ryno repeatedly tells him to stop the effects. The attack is not incidental heckling: it argues that a recognisable performance cue is a gimmick separating online clips from battle control."],
                      ["Send Deeno next expands the debut", "Ryno ends by asking Jay for Deeno. He instead faces TymeLess and later Roman, but the callout positions Episode 8 as an entrance into the wider roster rather than a self-contained contest with 2MWAD."],
                      ["The official loss does not kill Ryno's material", "Ryno loses here, but Pen Zeppelin, chess language and live rebuttal show enough technical identity to carry into later clashes. Conversely, 2MWAD's winning housing case remains available to later opponents, proving that useful angles and official outcomes can travel separately."]
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
                    Episode 9 joined two early-season records. Roman arrived from an official win over PR1NC3 in Episode 2, while Tapped24 was trying to recover from his opening defeat to Deeno. Roman went first in every round and made that advantage part of the pressure: Tapped was presented as a loud personality whose confidence, family image and league status could be tested under direct confrontation.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Roman&apos;s first moved from pack and softness imagery into bloodline, parenting and bereavement. Crucially, he predicted that Tapped would mention his deceased former partner and acknowledged the death before the angle could be presented as a reveal. Tapped answered with the clash&apos;s densest entertainment writing: Roman Reigns, Roman script, romance, Fergie time, Dobby, football and roster references turned Roman&apos;s name and appearance into a chain of accessible punches.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Round two became an evidence exchange. Roman addressed allegations concerning Tapped&apos;s former partner and Georgie, then produced printed message screenshots as receipts. Tapped opened with an intentionally brutal contrast between Roman&apos;s bereavement and his own relationship, before producing his own screenshot about Roman allegedly rating AJ. His announcement that he had &ldquo;done a Deeno&rdquo; made the prop a direct callback to the screenshot tactic Deeno had used against him in Episode 1.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Roman&apos;s third challenged originality around PR1NC3, attacked Tapped&apos;s partner, mother, tattoos, stage name and depth, and kept the performance physically close. Tapped disputed most of Roman&apos;s claims but continued the deceased-partner route at length, then widened the round through chemistry, Jack the Ripper, X-Men and fairy-tale imagery. Sound interruptions and restarts disrupted both sides, but neither abandoned the three-round structure.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The screenshot symmetry is more important than either allegation in isolation. Roman used a document to make a serious character case look verifiable; Tapped mirrored the method to defend status and attack Roman&apos;s private opinion. These remain claims made inside a battle, not independently verified facts, but the objects changed how the room received the writing.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The closing crowd check was close enough to be repeated, before Roman received the stronger final reaction and was announced as the winner. The official GZone record also awards Roman the win. Tapped supplied more reference-heavy comedy and several of the clash&apos;s most quotable name flips; Roman&apos;s steadier pressure, prebuttal and more controlled final round secured the recorded decision.
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

            {battle.slug === 'tapped24-vs-roman' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Roman", "Prebuttal before pressure", "Roman opens with room interaction, pack and softness imagery, then escalates through parenting, bloodline and family attacks. By naming the deceased-partner angle before Tapped can use it, he converts a likely attack into an acknowledged fact and limits its surprise value."],
                      ["Round 1 — Tapped24", "Name flips and reference density", "Roman Reigns, Roman script, romance, Fergie time, Dobby, football and local-roster references create a faster, more comic reply. Repeated sound restarts interrupt the flow, but Tapped keeps returning to the central idea that Roman's name and image can be rewritten."],
                      ["Round 2 — Roman", "Allegation becomes printed evidence", "Roman addresses claims involving Tapped's former partner and Georgie, develops Kate Bush and egg imagery, then produces printed message screenshots. The prop changes the round from accusation alone into a staged receipt and gives the personal angle a visual payoff."],
                      ["Round 2 — Tapped24", "The screenshot is mirrored", "Tapped opens with the harsh contrast between Roman's bereavement and his own partner, builds GZone versus G-string status language, and presents a screenshot alleging Roman privately rated AJ. Calling it doing a Deeno identifies the tactic's Episode 1 source in the room."],
                      ["Round 3 — Roman", "Originality, depth and control", "Roman challenges PR1NC3's originality before turning back to Tapped's partner, mother, tattoos, size, stage name and parenting. Sink-or-swim and out-of-depth language give the round one sustained frame, while close physical delivery keeps the pressure consistent through restarts."],
                      ["Round 3 — Tapped24", "Denial followed by maximum disrespect", "Tapped says Roman's claims are untrue apart from the known death, cites a private compliment, and then extends the bereavement angle through Kerry, chemistry, Jack the Ripper, X-Men and fairy-tale references. The range is ambitious, although the long route is less controlled than Roman's close."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Tapped enters with the Episode 1 loss", "Deeno officially beat Tapped in the season opener. Roman's confident-in-every-defeat and status attacks therefore work from an existing record, and Roman adds the second official loss that AJNA later extends in Episode 10."],
                      ["Roman enters with the Episode 2 win", "Roman's claim that he has already faced warriors is rooted in his victory over PR1NC3. The résumé language sounds expansive here, but Ryno later quotes the idea in Episode 18 and reduces those warriors to PR1NC3 and Tapped24."],
                      ["The bereavement angle is prebutted", "Roman says Tapped is going to mention that his former partner died and confirms it himself. Tapped still uses the subject across later rounds, but it is no longer a fresh reveal; the contest becomes whether repetition can overpower Roman's preparation."],
                      ["Episode 18 repeats Roman's defence", "Against Ryno, Roman again predicts that his opponent will blame him for his former partner's death. Episode 9 establishes the defensive method: identify the most damaging personal route early so the opponent has to attack through an answer already on record."],
                      ["Roman introduces the first screenshot", "The printed messages are used as receipts for claims involving Tapped's relationships. The prop is not proof outside the battle, but inside the performance it gives Roman a physical sequence, a reading moment and a visible object around which the crowd can react."],
                      ["Tapped mirrors the evidence tactic", "Tapped answers with another screenshot, this time about Roman allegedly complimenting AJ. The symmetry prevents Roman from owning the evidence format and turns round two into a contest over whose private messages damage the opponent more."],
                      ["Done a Deeno names the original source", "Deeno had used screenshots and documents against Tapped in Episode 1. Tapped explicitly credits that method while deploying it against Roman, showing a bar and prop evolving from something used on him into part of his own battle toolkit."],
                      ["Screenshots return against Grams", "In Episode 15 Tapped announces that he is bringing screenshots back and presents an Instagram image during his first official win. The prop develops from defensive mirroring here into a planned offensive reveal with a cleaner visual payoff."],
                      ["Georgie becomes recurring Tapped material", "Roman brings Tapped's partner Georgie into the evidence and relationship angles. AJNA targets Georgie directly in Episode 10, and Grams makes the home and parenting route central in Episode 15, turning one name into an accumulating season narrative."],
                      ["AJ enters before her own debut", "Tapped's screenshot alleges that Roman rated AJ before she battles in Episode 10. Tapped then faces AJ immediately next, so a private-opinion angle in Episode 9 becomes part of the context surrounding the First Lady's arrival."],
                      ["Toughest warriors is later dismantled", "Roman's first-round claim elevates his prior opposition. Ryno returns to the wording in Episode 18, names PR1NC3 and Tapped as the résumé behind it, and calls the claim cap; the boast becomes archived evidence for a later rebuttal."],
                      ["The close anticipates judging disputes", "The room is checked more than once before Roman receives the louder final response. That uncertainty foreshadows later GZone clashes where crowd noise, commentary preference and the official record must be separated rather than treated as one verdict."]
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
                    Episode 10 introduced AJNA as the First Lady of GZone against Tapped24, who already carried official losses to Deeno and Roman. Tapped entered as the experienced &ldquo;Mr Disrespectful&rdquo; figure and treated the debut as a test of whether a new woman on the platform could survive exactly the same hostile room he gave every opponent. AJ answered by matching the hostility rather than seeking a protected debut.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Tapped&apos;s first attacked parenting, children, appearance, weight, music, relationships, money and race before sound trouble forced a long restart. Dumbledore and Juggernaut made the forehead route visual; the larger purpose was to deny AJ the queen and artist status announced around her entrance. AJ&apos;s response changed the room immediately through alleged drug use, sexuality, masculinity, 2MWAD and repeated &ldquo;bad man / mad man / sad man&rdquo; phrasing.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Round two widened both arsenals. Tapped used AJ&apos;s sister, children, hygiene, James and the Giant Peach, Austin Powers, TARDIS, eyebrows and an extended audience &ldquo;run train&rdquo; section. AJ made Georgie central, turning Tapped&apos;s relationship into the round&apos;s live pressure point, then developed sniffing and line-counting language before challenging alleged violence toward women and telling him to fight men instead.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Tapped&apos;s third moved through High School Musical, appearance, age, children, bereavement, Wiley, periods and housing. AJ closed with a repeated &ldquo;set some levels&rdquo; structure, boxing-ring violence, masculinity, drugs, police, the playground and serious alleged conduct. Both rounds needed reloads and mic corrections, but AJ&apos;s delivery kept turning interruptions into renewed energy rather than lost momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The initial room calls were close enough to create open disagreement. Some commentators personally preferred Tapped, but they acknowledged that the room had leaned AJ; the live comments then repeatedly selected AJ. The host announced AJNA as the winner, and the official record agrees. The page should preserve that distinction: a disputed technical opinion is not the same as the recorded verdict.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light">
                    The result becomes active material in Episode 15. Grams uses AJ as proof that Tapped was already beaten; Tapped answers that GZone made him lose and argues that he did not really lose. Georgie also develops from AJ&apos;s targeted second-round pressure into one of Grams&apos; main parenting and home angles, so Episode 10 supplies both the disputed record and the personal route for Tapped&apos;s eventual first win.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'tapped24-vs-ajna' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Tapped24", "Veteran pressure and denial of debut status", "Tapped attacks AJNA's parenting, children, appearance, weight, music, relationships, finances and claim to queen status. Dumbledore and Juggernaut create quick visual anchors, but sound trouble forces a near-complete restart."],
                      ["Round 1 — AJNA", "The First Lady matches Mr Disrespectful", "AJ answers with alleged drug use, sexuality, masculinity, 2MWAD and the repeated bad-man, mad-man and sad-man chain. Reloads show that the new battler has immediately changed the room's expectations."],
                      ["Round 2 — Tapped24", "Expanded character attack and room participation", "AJ's sister, children, hygiene, Giant Peach, Austin Powers, TARDIS, eyebrows and the extended run-train audience section make the round broader and more interactive, though less tightly focused."],
                      ["Round 2 — AJNA", "Georgie becomes the pressure point", "AJ speaks through Tapped's relationship, counts drug lines, attacks masculinity and alleged violence toward women, then tells him to fight men instead. Georgie reloads make the partner angle part of the live room."],
                      ["Round 3 — Tapped24", "Veteran résumé and darkest escalation", "High School Musical, age, children, bereavement, Wiley, periods, housing and appearance support the claim that AJ is new and not ready for GZone. Mic corrections and reloads fragment the intended closing run."],
                      ["Round 3 — AJNA", "Levels, boxing and the deciding close", "AJ's repeated 'set some levels' opening leads into the ring, masculinity, drugs, police, the playground and serious alleged conduct. She converts each restart into renewed delivery and keeps the room involved through the finish."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand font-display uppercase text-sm mb-2">{round}</p><h3 className="text-white font-bold mb-3">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Tapped enters with two official losses", "Deeno beat Tapped in Episode 1 and Roman beat him in Episode 9. Calling himself the veteran is accurate about experience, but the record lets AJ redefine that experience as repeated failure."],
                      ["AJ refuses a protected first-lady role", "The hosts introduce AJ as GZone's First Lady. Her response is not ceremonial: she matches Tapped's graphic disrespect immediately, making equality of aggression the argument for belonging."],
                      ["Mr Disrespectful is mirrored back", "Tapped tries to prove that no opponent receives special treatment. AJ adopts the same sexual, family and image pressure, so his established persona becomes the performance standard used to judge him."],
                      ["Georgie becomes shared league material", "AJ's second repeatedly addresses Georgie and draws reloads from the room. Grams later makes Georgie, home life and parenting central in Episode 15, expanding a live relationship angle into a three-round responsibility case."],
                      ["The drug-line scheme develops from image into count", "AJ says Tapped looks wired and counts one, two and three more lines while shifting between cocaine and written bars. The sequence turns a credibility allegation into a structured sound pattern."],
                      ["Tapped's veteran claim is reversed by the verdict", "Tapped closes by telling AJ she is new and asking what she is doing on GZone. The official debut win answers that status question directly: experience does not protect him from the newcomer."],
                      ["The first room call exposes a judging problem", "Initial reactions are close and some commentators personally prefer Tapped while admitting the room leaned AJ. The live comments are then used as additional evidence, revealing how unstable crowd-only judging could become."],
                      ["Episode 12 announces the response", "Two episodes later, the host says future battles will have celebrity judges. That format announcement follows clashes like this one, where room, commentators and live chat did not initially agree."],
                      ["Grams treats AJ as official evidence", "In Episode 15 Grams says Tapped was beaten or harassed by AJ. The line converts this decision into record pressure rather than revisiting every round technically."],
                      ["Tapped disputes his own loss in real time", "Against Grams, Tapped says GZone made him lose but that he did not really lose. He preserves the minority technical opinion from Episode 10 while acknowledging the official result he wants to escape."],
                      ["The disputed loss gives Tapped's first win more weight", "Tapped enters Episode 15 with losses to Deeno, Roman and AJNA. Beating Grams is therefore not just another booking; it is the first official result that lets him answer the accumulating record."],
                      ["Serious allegations remain battle claims", "Both battlers use accusations about drugs, violence, sexuality and conduct. The page explains their strategic role and does not present the claims as independently verified facts."]
                    ].map(([title, detail]) => (
                      <article key={title} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><h3 className="text-brand font-display uppercase text-base mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>
              </>
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
                    Episode 12 introduced NattyEBK to GZone against a returning PR1NC3, whose first appearance had ended in an official loss to Roman. Natty treated the debut as an immediate takeover. PR1NC3 treated it as redemption, so the battle opposed a new name trying to create fear with an existing battler trying to repair his record.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Natty&apos;s first round moved instantly into Prince&apos;s wife, children, bereavement, money and credibility. The writing prioritised emotional damage and intimidation over layered punch construction. Prince&apos;s opening response was a prebuttal: he said the barber, dancer, wife and family routes were common knowledge and that he already knew what Natty would say, then redirected the clash toward lying, snitching, 999 and false danger.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Natty&apos;s second relied on age, masculinity, transport, money, music, partner and wider family disrespect. Pluto and Mars supplied a compact status comparison, while the bicycle and car material made the financial route visual. PR1NC3 answered with the round&apos;s clearest prop sequence: bad breath led to Listerine, soap and salt, breaking the hostility with physical comedy while continuing his claim that Natty&apos;s image was dirty and manufactured.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The third became a test of stamina and control. Natty used drugs, cowardice, the boxing-ring setting, friends and family before a restart and repeated passage; he still declared the round and battle already won. PR1NC3 closed with roster-wide defiance, redemption, levels, boxing threats and his royal stage name, but his answer did not erase the pressure Natty had established from the first minute.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The transcript&apos;s final crowd-call names are unclear, but the official Season 1 record awards the win to NattyEBK. The earlier page sentence saying the crowd favoured PR1NC3 was incorrect. Natty later treats this verdict as his first body against Z.K in Episode 20, making the result part of his continuing character rather than an isolated debut win.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light">
                    The host also announces a format change after the decision: this is the last show left only to the room, with celebrity judges promised from the next event onward. Episode 12 therefore closes an early crowd-only phase of GZone at the same moment Natty enters the roster.
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

            {battle.slug === 'pr1nc3-vs-nattyebk' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — NattyEBK", "Debut through emotional damage", "Natty opens on Prince's wife, children, bereavement, finances and danger image. The lack of a gradual introduction is the strategy: maximum personal pressure establishes the debut character immediately."],
                      ["Round 1 — PR1NC3", "Prebuttal and credibility defence", "Prince says he expected the barber, dancer, wife and family routes because they were already public. He then calls Natty a liar and snitch, using 999 and vermin imagery to move the judgement from private pain to public credibility."],
                      ["Round 2 — NattyEBK", "Age, money and status comparison", "Double the age but half the man, bicycle transport, Mars and Pluto, music prospects, partner and family material keep the round direct. A restart makes the construction rougher without reducing the hostility."],
                      ["Round 2 — PR1NC3", "Redemption with a prop-led hygiene scheme", "PR1NC3 returns to fake-danger and snitch angles, then presents Listerine, soap and salt. The objects turn bad-breath and washing jokes into the most visually organised sequence of his performance."],
                      ["Round 3 — NattyEBK", "Boxing-ring challenge and claimed finish", "Drug allegations, the literal ring, fighting, robbery, deceased friends and family continue the intimidation case. A repeated passage interrupts the flow, but Natty finishes by saying he has already won."],
                      ["Round 3 — PR1NC3", "Roster defiance and levels close", "Prince says he is here for redemption, attacks Natty's posture and service, uses boxing threats and finishes through hierarchy: an opponent should never try to compete with a Prince because there are levels to it."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand font-display uppercase text-sm mb-2">{round}</p><h3 className="text-white font-bold mb-3">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["PR1NC3 enters in redemption mode", "Roman officially beat PR1NC3 in Episode 2. Prince's repeated redemption language therefore has a real record behind it: he is trying to turn a second appearance into a correction."],
                      ["Natty uses a debut to skip the introduction stage", "The host announces Natty as new, but the first lines go straight to the most severe family material. Shock is used as instant identity, ensuring the room has a clear idea of him before one round is complete."],
                      ["Prince prebuttals the expected personals", "Rather than denying each claim, PR1NC3 says he already knew Natty would mention his barber work, dancing, wife and family. Naming the routes after they have been used reduces their discovery value, even if it cannot undo their emotional force."],
                      ["Mickey Mouse survives into Natty's next battle", "PR1NC3 calls Natty a Mickey Mouse-looking figure. Z.K reuses the comparison in Episode 20 through Natty's haircut, making Prince's visual read inherited pressure rather than a forgotten one-off."],
                      ["Hygiene changes from weakness to weapon", "PR1NC3 uses Natty's breath, Listerine, soap and salt as a visible embarrassment. Against Z.K, Natty redirects hygiene pressure outward through breath, plaque, teeth, washing and dating material."],
                      ["The evidence tactic escalates by Episode 20", "Here everyday products act as proof of smell and poor hygiene. Natty later stops the beat against Z.K and presents a screenshot and photograph, moving the same visible-evidence tactic from comedy into alleged online exposure."],
                      ["Prince becomes Natty's first recorded body", "Natty opens Episode 20 by referring to what he did to Prince and closes with 'just killed Prince, now Z.K's next.' The official Episode 12 result becomes the first step in an announced sequence."],
                      ["The Pluto and Mars contrast compresses the status route", "Natty's longer age, money and music attack is reduced to two planets: Mars carries war and importance, while Pluto suggests distance and demotion. It is one of his cleanest written comparisons amid the shock material."],
                      ["The props are relief and argument at once", "Listerine, soap and salt briefly change the room's emotional temperature after severe family attacks. They also support Prince's larger claim that Natty's dangerous image is unclean, false and in need of correction."],
                      ["The ring turns threats into local imagery", "Both battlers use boxing language while physically standing in a ring. Natty proposes dropping the mic to fight; Prince answers with a one-two, slip and crack, so the setting supplies a shared scheme rather than decoration."],
                      ["The official record corrects the ambiguous transcript", "The closing transcription preserves 'I think it's clear' without clearly identifying both crowd calls. The archive supplies the authoritative outcome: NattyEBK won."],
                      ["Episode 12 closes the crowd-only format", "After the verdict, the host says future battles will have celebrity judges. The battle is therefore a structural callback point for later disputed results and judge-led decisions across the season."]
                    ].map(([title, detail]) => (
                      <article key={title} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><h3 className="text-brand font-display uppercase text-base mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Clash Summary for PR1NC3 vs Roman */}
            {battle.slug === 'pr1nc3-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Episode 2 gave PR1NC3 and Roman their first official Season 1 result and established a contrast that remains useful across the archive: PR1NC3 attacked through direct grime energy, youth and physical consequence; Roman used the opponent&apos;s name, age, height and music identity to build stranger, more layered passages. The room repeatedly intervened through mic changes, requests for energy and an audience-demanded reload.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    PR1NC3&apos;s first introduced the crown claim through a clipped appearance list—size, clothes, trim and bars—before using Roman&apos;s personal name, a 99-percent body image, bacon, pen precision, left and right punches, GOAT sacrifice and veteran-versus-young-battler pressure. Roman answered by reducing Prince to &ldquo;Princess,&rdquo; calling himself a real don and claiming experience since 2006, then moved through family allegations, royal bars, upper class, Buckingham Palace and the distinctly British Big John Prescott right-hand punch.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The post-round panel repeatedly called the first close and then said &ldquo;one nil,&rdquo; but the transcript does not identify reliably which battler received that score. PR1NC3&apos;s second made his case easier to follow: Roman became an old voice, cat, clown and finally a goldfish trapped in a tank while Prince occupied the ocean. A fake forgotten-bars moment, free throw, weighted angles and Kevin and Perry gave the round short, visible payoffs.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Roman&apos;s second produced the battle&apos;s strongest technical identity. A mic-level restart led into walking and talking sounds, team and let-down language, &ldquo;written in the stars&rdquo; and Times New Roman, then a height scheme in which removing PR1NC3&apos;s knees still would not make him fall in half. Electricity, extended objects, gel pens, school-age framing, doughnuts and a melted candle widened the round. When time was called, the audience demanded a reload and Roman performed it again.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    PR1NC3&apos;s third used cold roads, Dark Knight, ring training, crown language, punchline and hook, a GRM-flow switch and a slowed explanation of &ldquo;PR1NC3 to the three&rdquo; to reassert his name. Roman answered by revealing Mason, converting birth year 2001 into an exaggerated loss count, dismissing Prince&apos;s songs as dance music, then using ink and toner before declaring himself top dog and the battle space his wing and cell.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The final video checks the red corner for PR1NC3 and the blue corner for Roman, but transcript text alone cannot measure which response is louder and the host does not preserve a clear spoken winner&apos;s name. The official GZone record awards Roman the win. That decision sends Roman into later victories over Tapped24 and Ryno, while PR1NC3 returns against NattyEBK explicitly needing redemption from this opening loss.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'pr1nc3-vs-roman' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — PR1NC3", "Youth declares war on a veteran", "A clipped appearance opening leads into Ferg, body-bag pressure, the 99-percent body, bacon, ring imagery, pen precision, left and right punches, GOAT sacrifice and an explicit old-veteran frame. The crown is asserted through force rather than a long royal scheme."],
                      ["Round 1 — Roman", "Princess is replaced by the real don", "Roman feminises the stage name, claims experience since 2006, then builds through serious family allegations, Mars, royal bars, upper class, Buckingham Palace, dungeons, wine and Big John Prescott. Several starts and pauses stretch the turn."],
                      ["Round 2 — PR1NC3", "A fish tank defines the status gap", "Mask and glove threats, Roman's age and voice, cat and clown images lead to the cleanest comparison: Roman is a goldfish in a tank while Prince is in the ocean. A fake choke, free throw, kilos and Kevin and Perry keep the second punch-led."],
                      ["Round 2 — Roman", "Typography, height and school age", "After a mic restart, Times New Roman makes the battler's own name a writing device. Huge shins, removed knees, electricity, gel pens, school, growing up, doughnut and melted-candle images turn Prince's height and youth into one theatrical round."],
                      ["Round 3 — PR1NC3", "The grime identity fights back", "Cold roadside, Dark Knight, ring training, crown, book, punchline and hook lead into a modern GRM-flow switch. PR1NC3 slows down to spell his name concept and demands that the room remember it before returning to rapid aggression."],
                      ["Round 3 — Roman", "Mason and 2001 close the hierarchy", "Roman removes the stage identity with Mason, turns the birth year 2001 into an exaggerated battle-loss count, dismisses Prince's songs, uses ink and toner, then declares himself top dog and the room his wing and cell."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Prince's crown becomes Roman's material", "PR1NC3 uses Prince as status and asks how Roman can war with him. Roman answers through Princess, royal bars, upper class and Buckingham Palace, appropriating the opponent's branding rather than leaving it uncontested."],
                      ["Times New Roman evolves inside the clash", "Roman's second makes his name the famous typeface. In the third he returns to printing through ink man and toner, so a one-line name flip develops into a cross-round writing identity."],
                      ["Youth and experience attack each other", "PR1NC3 repeatedly calls Roman old, outdated and a veteran. Roman says he has been active since 2006, attacks school-age imagery and gel pens, then uses Prince's 2001 birth year as the final-round payoff."],
                      ["The fake choke is controlled theatre", "PR1NC3 says he has forgotten all his bars, then immediately reveals the pause as a psych. It is a deliberate performance trick, unlike the genuine technical stops and microphone resets elsewhere in the battle."],
                      ["The reload belongs to the audience", "Time is called during Roman's second, but the room repeatedly asks for a reload and the host returns the performance to him. The replay is crowd-demanded evidence of impact, not simply another accidental restart."],
                      ["The first-round score remains unattributed", "Commentary calls the first very close and repeats one nil, but the transcript does not preserve the beneficiary clearly. The page does not reverse-engineer a round score from the eventual official winner."],
                      ["Roman's win becomes Episode 9 status", "When Roman faces Tapped24, he arrives with this official victory and later describes having faced the toughest warriors. The early result supplies real résumé weight even before the claim is challenged."],
                      ["Ryno later reduces the warrior claim", "In Episode 18, Ryno quotes Roman's toughest-warriors boast and says the record behind it was only Prince and Tapped. The Episode 2 win remains valid; Ryno attacks the value Roman assigns to it."],
                      ["PR1NC3 returns in redemption mode", "Episode 12 presents PR1NC3 against debuting NattyEBK after this official loss. Prince's redemption language therefore has a specific result behind it rather than being a generic comeback slogan."],
                      ["Mason removes the royal shield", "Roman opens his final by using PR1NC3's personal name. The move converts Prince from a title of status into an ordinary young opponent before the 2001 age scheme begins."],
                      ["Song performance becomes a format attack", "PR1NC3 uses grime flow and artist branding as strengths. Roman tells him to dance to his songs because battle rap is not for him, separating recording performance from direct clash ability."],
                      ["The final vote and official record are separate evidence", "The video checks both corners but the transcript cannot encode volume reliably. The official archive awards Roman the battle, so the page states the result without pretending the text contains an audible margin."]
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

            {/* Clash Summary for Btizz vs 1Flaymr */}
            {battle.slug === 'btizz-vs-1flaymr' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />

                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>

                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 16 was a two-round clash between 1Flaymr, making his formal GZone debut, and Btizz, returning after an official win over Deluxx and a loss to CJ-Zino. The new character had already been previewed at the end of Episode 13 through &ldquo;One Flamer,&rdquo; &ldquo;everything burn,&rdquo; and &ldquo;fire for that.&rdquo; Here those phrases became a complete performance identity built around fire, Jamaican cadence, a balaclava, and the claim that no opponent could extinguish him.</p>
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
                      ["Btizz needs to recover from the CJ loss", "Btizz enters after an official win over Deluxx and a loss to CJ-Zino. Facing a debutant gives him a different role: he must show that experience can expose a new character before the previous defeat becomes a losing run."],
                      ["Fire for that changes ownership", "1Flaymr used fire for that in the Episode 13 preview. Btizz turns it into call-and-response for punches against him, making the newcomer's own slogan generate reaction for the opponent."],
                      ["Cold answers heat inside the battle", "Btizz says his bars are cold and places himself in an ice zone. 1Flaymr later returns with hot flow, snowman, December, and firebender language. The elemental contrast develops through answer and counter rather than isolated metaphors."],
                      ["The balaclava becomes shared evidence", "1Flaymr first tells the room that why he hides his face is none of their business, then removes the bally and owns the appearance joke himself. Btizz attacks the concealment; CJ later reuses the revealed face as evidence against the rebrand."],
                      ["Friction survives every rebrand", "Btizz identifies the earlier Friction name in round one. Episode 19 CJ repeats it, while 1Flaymr replies that the reason for changing his name is private. One short reveal becomes a continuing authenticity angle."],
                      ["Jamaican identity creates both style and vulnerability", "1Flaymr's cadence, Jamaican declaration, Fire Nation energy, and food language make the debut distinct. Btizz responds through plantain, rice and beans, Sizzla, flag colours, Magnum, and cornmeal, arguing that the presentation is imitation rather than identity."],
                      ["The mask defence evolves into self-awareness", "I cover my ugly face, that's why I wear the bally concedes the visible attack before Btizz can present it as discovery. In Episode 19 the same self-awareness is no longer enough: CJ says taking it off fooled everyone."],
                      ["Roster names make the debut immediately local", "PR1NC3, Natty, AJ, CJ-Zino, Deeno, Darren, and other GZone figures appear throughout. The fire character is introduced as part of an existing league world, not as a detached performance imported from elsewhere."],
                      ["Fully extinguished becomes the official memory", "Btizz's closing phrase compresses two rounds of cold, authenticity, hygiene, and crowd-control writing into a verdict the room can repeat. The official win gives that slogan authority beyond the individual bar."],
                      ["Episode 19 reopens the verdict", "CJ adopts fully extinguished against 1Flaymr and adds Friction and the exposed face. 1Flaymr explicitly says Btizz originated the phrase, calls CJ a helper, and argues that the flame's return proves the earlier ending was not permanent."],
                      ["The result restores Btizz after CJ", "After beating Deluxx and losing to CJ, Btizz wins by defining the newcomer's identity more effectively than the newcomer can protect it. That recovered status is what later lets 1Flaymr challenge CJ's Btizz win and connect Episodes 13, 16, and 19."]
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
                    Episode 13 matched two battlers at different points in their first-season stories. CJ-Zino arrived after losing to Proty in Episode 5; BTizz had beaten Deluxx in Episode 7. BTizz therefore treated CJ&apos;s previous performance as proof that he was not a genuine challenger, while CJ tried to remove the originality and credibility behind BTizz&apos;s momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    BTizz&apos;s first built the &ldquo;GZone massacre&rdquo; opening through violence, disease, relationships, road credibility, Mickey Mouse, NPC, UFC and MVP language. The repeated MVP refrain worked as an audience hook, but the opening also needed several restarts while the beat and delivery were settled. CJ&apos;s reply was less chant-driven: snitching, work, alcohol, clothes, sexuality, family and a descending number sequence were used to make BTizz look exposed rather than dangerous.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    In the second, BTizz introduced the repeatable &ldquo;CJ-Zino / three rounds / 3-0&rdquo; pattern and moved through Nemo, Dory, Kermit, malaria, the clean-up crew, Leon Edwards and the surface-area punch. CJ answered with the battle&apos;s clearest technical accusation: he called to Tapped24 in the room and said BTizz had stolen his flow. Job loss, rum, cars, hygiene and the Listerine prop then made the originality attack feel like a wider character breakdown.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    BTizz&apos;s third returned to postcode, race, medication, relationships, relegation, cartoons, dust and contract status. CJ&apos;s final widened beyond BTizz: fatherhood, the stolen-flow claim, a TARDIS and Doctor Who pocket, clothes, alleged cocaine spending and league names all lead to &ldquo;give me Prince next.&rdquo; The material is uneven in places, but the round has a clear purpose—CJ is using the current opponent to demand a larger position on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The crowd call clearly favoured CJ-Zino and the official Season 1 record awards him the win. That outcome makes the &ldquo;3-0&rdquo; prediction rebound against BTizz and converts CJ&apos;s loss to Proty into a recovery rather than a continuing decline.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light">
                    The post-battle footage is part of the clash&apos;s larger importance. OneFlaymr appears and repeats flame, burning, cooking and smoke language while asking for a future battle. BTizz later faces him in Episode 16 and claims to have left him &ldquo;fully extinguished&rdquo;; CJ then inherits that exact phrase in Episode 19 and argues that he, not BTizz, is the one who can finish the fire angle. Episode 13 is therefore the visible start of a three-battle material chain.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'btizz-vs-cj-zino' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — BTizz", "Massacre framing and crowd hooks", "BTizz attacks CJ's Episode 5 loss, road credibility, relationships, health and hygiene before the MVP refrain turns the opening into call-and-response. Beat adjustment and repeated starts make the performance energetic but visibly unstable."],
                      ["Round 1 — CJ-Zino", "Character file and numerical close", "CJ counters with snitching, employment, alcohol, clothing, sexuality and family pressure. His countdown from nine through one gives a sprawling attack a recognisable closing structure."],
                      ["Round 2 — BTizz", "3-0 prediction and clean-up scheme", "The repeated CJ-Zino hook predicts a sweep, then Nemo, Dory, Kermit, malaria, the clean-up crew, surface area, Leon Edwards and UFC references keep the writing immediately readable."],
                      ["Round 2 — CJ-Zino", "Originality becomes the central charge", "CJ directly addresses Tapped24 and accuses BTizz of stealing his flow. Job loss, rum, cars, digging for information and the Listerine prop extend that charge into an argument that BTizz's whole presentation is borrowed or poorly maintained."],
                      ["Round 3 — BTizz", "Postcode, cartoons and contract pressure", "01907, Alien Roger, medication, relegation, race, relationships, Disney, dust and a scraped contract form a final attempt to make CJ look geographically, professionally and personally displaced."],
                      ["Round 3 — CJ-Zino", "Roster expansion and next-opponent close", "Fatherhood, flow theft, TARDIS, doctors, clothes, alleged cocaine spending and wider roster names end with a direct PR1NC3 callout. CJ treats the round as both a reply and an audition for a higher-stakes booking."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand font-display uppercase text-sm mb-2">{round}</p><h3 className="text-white font-bold mb-3">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["CJ's Proty loss becomes BTizz's opening evidence", "BTizz's 'flopped last time' route points back to CJ-Zino's official Episode 5 loss. It is not a generic insult: the season archive supplies the record behind the challenger argument."],
                      ["BTizz enters with a win already behind him", "BTizz had officially beaten Deluxx in Episode 7. The massacre and MVP posture therefore builds on an existing result, even though CJ overturns that momentum here."],
                      ["Tapped24 is used as a live witness", "CJ does not merely say the flow is copied; he calls to Tapped in the room and asks why BTizz is stealing it. Involving the alleged source turns a technical criticism into a live credibility test."],
                      ["The 3-0 prediction is reversed by the result", "BTizz repeatedly promises three rounds and a 3-0. The crowd and official record choose CJ, so the simplest recurring hook becomes an unintended rebuttal once the decision is called."],
                      ["Cleaning language changes ownership", "BTizz says he will leave the stage squeaky clean and tells the clean-up crew to handle the surface area. CJ answers through breath and hygiene pressure, including Listerine, redirecting cleanliness from dominance to embarrassment."],
                      ["CJ expands fatherhood beyond one opponent", "The final says men on the stage mention his name while having fatherhood to address and applies the line to 'all of you dads.' The same season increasingly treats parenting as shared roster currency rather than a one-clash personal."],
                      ["PR1NC3 is the demanded next step", "CJ closes by asking for PR1NC3 and repeats the challenge to camera after the result. The archive does not present that callout as the next CJ battle, so the page records it as an ambition rather than implying the booking happened."],
                      ["OneFlaymr's fire persona begins in the aftermath", "After the verdict, OneFlaymr repeats flame, burning, cooking and smoke language. The appearance establishes the vocabulary before he becomes BTizz's Episode 16 opponent."],
                      ["BTizz later claims 'fully extinguished'", "Against OneFlaymr in Episode 16, BTizz develops the preview's fire language into the claim that the flame has been fully extinguished. The phrase converts an opponent's self-branding into a result narrative."],
                      ["CJ inherits the extinguishing claim in Episode 19", "When CJ later faces OneFlaymr, he explicitly recalls BTizz saying 'fully extinguished' and argues that he will complete the job himself. The bar evolves from preview, to opponent rebuttal, to a third battler's inherited proof."],
                      ["The live tissue interruption becomes performance material", "CJ pauses his third to ask for a tissue after the room reacts to spitting. The restart is messy, but it shows the same GZone habit of allowing a live incident to enter the round instead of hiding it."],
                      ["The decision restores CJ's season position", "The crowd response and official CJ-Zino win answer BTizz's Episode 5 attack. CJ immediately uses the recovery to name a future opponent, turning result into matchmaking pressure."]
                    ].map(([title, detail]) => (
                      <article key={title} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><h3 className="text-brand font-display uppercase text-base mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                  <div className="mt-8 rounded-2xl border border-brand/30 bg-zinc-950/80 p-6">
                    <p className="text-brand font-display uppercase text-sm mb-2">Evidence: Prop Used</p>
                    <p className="text-white font-bold mb-2">Bottle of Listerine — CJ-Zino</p>
                    <p className="text-zinc-400 leading-relaxed font-light">The mouthwash turns the breath and hygiene angle into a physical object, making the insult readable even before every word is caught.</p>
                  </div>
                </section>
              </>
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
                    Episode 7 introduced BTizz against Deluxx, who was returning from an official loss to LDN Mikez in Episode 3. The event also foregrounded GZone&apos;s direct YouTube livestream, so the battle&apos;s repeated references to cameras, performance and public identity belonged to a room conscious that the clash was being watched beyond the venue.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Deluxx opened with battle-scar, Lion King, family and school material, trying to make experience and aggression outweigh the previous defeat. BTizz answered with the first complete version of his performance identity: Skepta&apos;s &ldquo;Shutdown,&rdquo; Jamaican and Asian authenticity questions, Imran Khan, crowd-facing repetition and the clipped &ldquo;B&rdquo; branding made the debut easy to recognise immediately.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Deluxx&apos;s second contained his clearest writing argument. Bill and Ben, flowerpot, Barbie and Ken, the admitted loss to a veteran, pen killing, crosses, posts and ghosts all positioned him as a writer who could survive one defeat. BTizz replied through physical-presence jokes, stamina, the 0121 area code and an attack on authorship: saying Deluxx&apos;s bars were written by London Mikez turned Deluxx&apos;s former opponent into alleged evidence against his pen.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The originality dispute works in both directions. Deluxx says BTizz is trying to &ldquo;tap&rdquo; into Tapped24&apos;s style without matching it; BTizz says Deluxx is using London Mikez&apos;s writing. Neither accusation is independently proved by the clash, but both establish pen ownership and borrowed performance as recurring questions around BTizz&apos;s season.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The third was the least controlled section. Deluxx returned to family, poverty, drugs, Dragon Ball Z and the Tapped24 comparison, while BTizz answered through trauma, GTA, Renzo, rhythm, name spelling and repeated performance phrases. Mic levels, reloads, hosting confusion and interruptions made the final round harder to follow than the first two.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The commentary table awarded BTizz the first two rounds and Deluxx the third, producing a 2–1 decision. The official GZone record also gives BTizz the win. That debut result becomes important in Episode 13, where BTizz uses the Deluxx victory as status against CJ-Zino before CJ directly revives the copied-Tapped24-flow allegation.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'deluxx-vs-btizz' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Deluxx", "Experience after defeat", "Battle scar, Lion King, family, school, death and appearance attacks attempt to make Deluxx's return feel dangerous rather than damaged by the Mikez loss. The round establishes shock pressure but moves across targets faster than it builds one case."],
                      ["Round 1 — BTizz", "A debut identity arrives fully branded", "Skepta and Shutdown, Jamaican authenticity, Imran Khan, Asian jokes, hair, relationships and crowd-directed repetition introduce a clear performance character. The repeated B sound and willingness to restart for reaction make the name itself part of the delivery."],
                      ["Round 2 — Deluxx", "The pen becomes the defence", "Bill and Ben, flowerpot, Barbie and Ken, the admitted veteran loss, pen killing, crosses, posts and ghosts frame Deluxx as a writer who has learned from defeat. The verse is more connected than the opening, despite mic-level interruptions."],
                      ["Round 2 — BTizz", "Stamina, locality and authorship", "Physical movement, weak knees, clash-not-slaughter, water and stage-removal language attack composure. The 0121 king-of-the-mic line fixes BTizz in Birmingham before the London Mikez ghostwriting accusation directly challenges who owns Deluxx's bars."],
                      ["Round 3 — Deluxx", "Maximum disrespect, less control", "Family, poverty, drugs, appearance, Dragon Ball Z and the claim that BTizz cannot match Tapped24 create the closing assault. Repeated starts and compressed delivery make the round harder to follow, even as the commentary table later gives Deluxx this third."],
                      ["Round 3 — BTizz", "Rhythm and branding through disruption", "Trauma, GTA, Renzo, family and repeated rhythm and name sounds continue the debut character. Hosting confusion and an uneven transcript obscure individual setups, leaving the already-won first two rounds more decisive than the close."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Deluxx names the Episode 3 loss", "Deluxx says he lost to a veteran but cannot be removed. Instead of denying the LDN Mikez result, he presents surviving it as experience and makes recovery the basis of his authority against a debutant."],
                      ["BTizz's first result creates later status", "The official win gives BTizz evidence when he faces CJ-Zino in Episode 13. His later massacre and MVP posture is not debut confidence anymore; it is built on the recorded Deluxx decision."],
                      ["Tapped24 enters as a style source", "Deluxx's trying-to-tap-but-can't-match-it line alleges that BTizz is borrowing from Tapped24. The wording is brief, but it establishes the originality route that becomes central six episodes later."],
                      ["CJ turns the suspicion into a live test", "Against BTizz, CJ-Zino calls directly to Tapped24 in the room and asks why BTizz is stealing his flow. Episode 13 upgrades Deluxx's comparison by involving the alleged source as a visible witness."],
                      ["Deeno later prebutts the copied cadence", "By Episode 22 the borrowed-flow criticism is known archive material. BTizz openly imitates Deeno, Deeno acknowledges the imitation and says he expected it, converting a former credibility weakness into a deliberate tactic and an anticipated rebuttal."],
                      ["BTizz reverses the authorship charge", "Deluxx questions whether BTizz owns his style; BTizz says London Mikez wrote Deluxx's bars. Both battlers therefore attack originality, but one targets performance cadence while the other targets the pen itself."],
                      ["London Mikez remains active after the clash", "Mikez beat Deluxx in Episode 3 and is now invoked as a possible writer. The earlier opponent becomes an invisible third figure whose dominance is used to reduce Deluxx even when he is not booked."],
                      ["Authenticity policing becomes a BTizz method", "Jamaican, Asian and yard identity dominate the debut attack on Deluxx. Against 1Flaymr in Episode 16, BTizz again enters an opponent's Jamaican presentation through food, flag colours, Sizzla and language, refining the same method around a more complete character."],
                      ["B spelling begins the performance brand", "B-to-the-I and repeated name sounds make identity audible when individual bars are crowded or interrupted. The technique returns in later BTizz clashes as a reliable way to reset the room and reassert ownership of a passage."],
                      ["0121 anchors local authority", "BTizz's king-of-the-mic claim connects the debut to Birmingham rather than generic battle status. The same area code circulates through other early GZone performances, making locality part of how rankings and rivalries are voiced."],
                      ["Water turns a choke into opponent material", "BTizz repeatedly tells Deluxx to get water after visible disruption. A practical pause becomes a stamina and preparation angle, allowing live performance trouble to count as evidence inside the written attack."],
                      ["The official 2-1 separates rounds from memory", "The commentary table gives BTizz rounds one and two and Deluxx round three. Later summaries often remember BTizz's overall control, but the recorded split preserves that Deluxx recovered late rather than being erased across all three."]
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

            {/* Clash Summary for LDN Mikez vs Deluxx */}
            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Episode 3 gave both LDN Mikez and Deluxx their first official Season 1 result. The broadcast introduced the clash as a Christmas present, but the performance quickly became a contrast between Mikez&apos;s written, confrontational pressure and Deluxx&apos;s faster cadence, repeated hook and Birmingham identity. Technical stops affected both, so the battle is as much about rebuilding momentum as delivering uninterrupted rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Mikez&apos;s first was stopped early because of a timing misunderstanding, then restarted around water and microphone disruption. Its cleaner writing moved through PowerPoint, Excel and words; GOATs and a shepherd; Roman and Fergs; a Universal Credit sanction; gig and landlord money; Beckham; grass and decking; then Wi-Fi and &ldquo;connecting.&rdquo; Extreme family and identity attacks created hostility, but the everyday financial and technology references supplied the sharper craft.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Deluxx answered with the repeated contrast &ldquo;you&apos;re from London, I&apos;m king of the mic&rdquo; and an 0121 Birmingham marker. The refrain gave his first a recognisable identity even when the faster internal writing became difficult to follow. The on-camera breakdown explicitly awarded the round to Mikez, crediting his aggression while saying Deluxx&apos;s clarity disappeared when he accelerated.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Round two made Mikez&apos;s approach more opponent-specific. Deluxx became Devonte, a thumb-shaped double of his mother and a battler Mikez claimed to have inspired. Supercell, Superman, Tinkerbell, locks, rocks, Christmas, a shark and a barking dog gave the verse visible reference points, although repeated beat and microphone resets made Mikez perform much of it several times. Deluxx replied through trap posture, music and album criticism, DVD, barber language and Renzo flow comparisons, but the host again challenged the energy level.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Mikez&apos;s third was interrupted by an attempted wheel-up before he restarted. A Bar Mitzvah and German sequence, shoes and laces, fire and smoke, turn, earn and learn, G, germ, snake, worm and perm, then judge, case, adjourned, academy and term created the round&apos;s connected pockets. Deluxx closed through Mikez&apos;s appearance, his own DFN-to-Deluxx rebrand, A1J1, rent, Aquaman, Atlantis, Lockjaw, language switching and freestyle rhythm.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The host asked the audience to be honest, asked who had won, then treated the answer as obvious before calling for noise for London Mikez. The official GZone record agrees. Mikez&apos;s greater projection and clearer written destinations survived the restarts; Deluxx&apos;s flow had flashes but lost too much language at speed. The result immediately becomes Mikez&apos;s first W in his Episode 4 &ldquo;two W&apos;s&rdquo; prediction and Deluxx&apos;s acknowledged loss when he returns against BTizz.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — LDN Mikez", "Shock pressure finds technical anchors", "An early timing stop and later water interruption force restarts. Family and identity attacks surround the stronger connected writing: Microsoft Office, GOAT and shepherd, Roman and Fergs, benefits, rent, Beckham, grass, decking and Wi-Fi."],
                      ["Round 1 — Deluxx", "A local refrain carries the flow", "London Mikez is contrasted with king of the mic and Birmingham's 0121. Deluxx repeatedly returns to the hook, using pace and rhythm as structure, but the on-camera analysis says his words became unclear when he accelerated and awards Mikez the round."],
                      ["Round 2 — LDN Mikez", "Devonte replaces the premium name", "The stage identity is stripped back to Devonte before appearance, family and severe mental-health material. Power Punch, Supercell, Superman, Tinkerbell, locks, rocks, Christmas, debut and creator language give the round its clearer landmarks through several restarts."],
                      ["Round 2 — Deluxx", "Music credibility becomes the reply", "Trap posture, sexual and family insults, DVD, album-scamming, money, barber language and Renzo flow comparisons attack Mikez as an artist rather than only a battler. Faster delivery again outruns some setups, and commentary asks for greater stage energy."],
                      ["Round 3 — LDN Mikez", "Connected rhyme pockets close the case", "After an attempted wheel-up stops the opening, Mikez restarts through picture, Bar Mitzvah, shoes and laces, fire and smoke, turn and learn, G and germ, snake and worm, then judge, case, adjourned, academy and term."],
                      ["Round 3 — Deluxx", "Rebranding and freestyle form the exit", "Appearance attacks lead into the former DFN identity, the Deluxx rebrand, A1J1, rent, Aquaman, Atlantis and Lockjaw. Language-switching and freestyle rhythm create motion, but time is called without a final argument strong enough to reverse the room."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The result begins Mikez's two-W run", "Episode 3 is Mikez's first official Season 1 victory. One episode later he flips 2MWAD into two W's, so the Deluxx decision is the first half of a prediction the room then fulfils."],
                      ["Deluxx later names this loss", "Against BTizz in Episode 7, Deluxx says he lost to a veteran but cannot be removed. He does not erase the Mikez result; he reframes surviving it as experience before facing a debutant."],
                      ["The creator claim becomes an authorship dispute", "Mikez says he inspired Deluxx to rap and is the one who made him. In Episode 7, BTizz pushes that hierarchy further by alleging that London Mikez wrote Deluxx's bars; neither authorship claim is independently verified."],
                      ["Devonte survives beneath Deluxx", "Mikez repeatedly replaces the premium stage name with Devonte. BTizz later attacks Deluxx's identity and originality from a different direction, so the question of who owns the Deluxx presentation continues after this result."],
                      ["0121 appears before later Birmingham branding", "Deluxx's opening refrain includes 0121 as a local marker. Renzo and BTizz later make the Birmingham area code a more explicit identity hook, showing a shared location code developing into repeated league language."],
                      ["Renzo is named before his official debut", "Both sides refer to Renzo in Episode 3, while Renzo's first recorded battle arrives in Episode 6. Mikez uses him inside a severe personal, and Deluxx compares flow to Renzo, placing the future winner in the season's vocabulary early."],
                      ["Mikez carries music into Episode 4", "Here Mikez contrasts battling in the ring with singing on Spotify. Against 2MWAD he returns to songs, ringtone, energy and melody, developing the artist identity instead of abandoning it after one clash."],
                      ["Roman receives an immediate archive callback", "Mikez says Deluxx cannot battle like a Roman and points to Fergs as the only Roman on the stage. The line follows Episode 2's official Roman victory, making the previous battle's name available for wordplay without changing its result."],
                      ["Deluxx's rebrand is self-authored", "In the third, Deluxx says he was DFN and is now Deluxx. That gives his stage identity an origin from his own mouth, which matters when later opponents question whether the name, style or bars are genuinely his."],
                      ["The GOAT hierarchy arrives early", "Mikez answers the claim that everyone is a GOAT by appointing himself the shepherd controlling the herd. The pattern—turning a crowded roster into one hierarchy—later becomes central to GZone status and house arguments."],
                      ["Technical disruption is part of the evidence", "Timer confusion, water, beat levels, mic levels and an attempted wheel-up cause repeated starts. The repetitions increase familiarity with Mikez's hooks, but the page does not mislabel every restart as a planned reload."],
                      ["The final decision is not ambiguous", "Unlike later transcripts where crowd volume is difficult to infer, this close includes the host asking if the result is obvious and then naming London Mikez. The official archive confirms the same winner."]
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

            {/* Clash Summary for LDN Mikez vs 2mwad */}
            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Episode 4 returned LDN Mikez immediately after his official win over Deluxx and introduced 2MWAD to the Season 1 record. Before the first round settled, 2MWAD said the pair had clashed before and accused Mikez of reusing old bars. The supplied season archive does not list that earlier encounter, so it operates here as an on-stage history claim rather than a previous official result.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    2MWAD&apos;s opening had the clash&apos;s clearest extended concept. He turned an attack on Mikez&apos;s role as a stepfather into gaming language: the biological father earns XP, lives rent-free in Mikez&apos;s head, and controls the main mission while Mikez becomes DLC, an NPC, a side quest and the second controller. The route is personal, but its strength is structural—every gaming term advances the same argument about who is &ldquo;player one&rdquo; in the household.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Mikez answered in the next turn through his own game vocabulary—Warzone and the Gulag—before using 2MWAD&apos;s alleged real name, Lance Pennant, Apollo Creed, ropes, smoke and league status to make the response more directly opponent-specific. &ldquo;Two W&apos;s like 2MWAD&rdquo; also carried two meanings: a flip of the stage name and a prediction that the Deluxx victory would be followed by another official win. Sound checks and repeated starts interrupted the passage, but they also let its central phrases land several times.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The middle exchange compressed the same contrast. 2MWAD used Mike and mic, a mother comparison, Héctor Bellerín being &ldquo;sent right back&rdquo; and the time Mikez had to prepare. Mikez built the longer sequence: plug and sync, wave and ship, set five and extinct, then a run through stinks, instincts, Miss Inks and NSYNC before ringtone, Undertaker, WrestleMania and The Rock. Repetition caused by the audio made his construction less seamless, but the linked sounds and recognisable references gave the room clear destinations.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    2MWAD&apos;s final began with an extended ugly-to-rusty insult chain and moved into online banking, McFlurry money and council-housing allegations. A McDonald&apos;s sandwich exchange drew live interruption and reaction, but the round became less organised than his opening. Mikez closed with the EastEnders scheme: East End, Frank and Butcher opened a chain through Ben, Heather, New Era, Tracy, Shirley and Bianca, before a Tapped24 information reference and the melody, cemetery and entity rhyme gave him a defined finish.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The first audience comparison was close enough for the host to call it the same and repeat the vote. On the second check, the room response was described clearly as &ldquo;all Mikez,&rdquo; and the official GZone record also awards LDN Mikez the win. It completed the two-W prediction after Episode 3; 2MWAD later turned this debut loss into his own recovery by beating Ryno in Episode 8.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — 2MWAD", "A household becomes a game map", "Mikez raising another man's children is translated through missions, XP, rent-free headspace, side quests, DLC, NPCs, DNA and two controllers. Each image returns to the same player-one argument, making this 2MWAD's most complete round."],
                      ["Round 1 — LDN Mikez", "The stage name predicts a second win", "Two W's, Warzone and Gulag answer the gaming surface before Lance Pennant, smoke, Apollo Creed, ropes, league and sleep pressure target the opponent more directly. Multiple sound resets force Mikez to run much of the opening again."],
                      ["Round 2 — 2MWAD", "Short flips replace the long scheme", "Mike and mic connect Mikez to his mother, while being sent right back becomes Héctor Bellerín's football position. Preparation time and an accusation about interviewing children close a brief round; the allegation remains battle material, not verified fact."],
                      ["Round 2 — LDN Mikez", "Sound chains create forward motion", "Plug, sync, waves, ships, academy sets, history, extinct, stinks, instincts, Miss Inks and NSYNC make the verse move through linked sounds. Ringtone, Undertaker, WrestleMania and The Rock then change the chain into artist-status and wrestling punches."],
                      ["Round 3 — 2MWAD", "Money pressure and live interruption", "An ugly-to-rusty adjective run establishes rhythm before online banking, McFlurry money, council housing and family attacks. The McDonald's sandwich exchange creates crowd participation, but repeated restarts leave the round looser than his gaming opener."],
                      ["Round 3 — LDN Mikez", "EastEnders supplies the closer", "East End, Frank, Butcher, Ben, Heather, New Era, Tracy, Shirley and Bianca organise family attacks through one soap vocabulary. Tapped24 enters as an alleged information source before energy, melody, cemetery and entity provide a clean final cadence."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["The earlier clash is claimed, not recorded", "2MWAD says they had already clashed and tells Mikez to admit it, then accuses him of old bars. No separate Mikez-versus-2MWAD result appears in the supplied Season 1 archive, so the exchange documents rivalry without inventing another record."],
                      ["Episode 3 makes the two-W flip measurable", "Mikez enters from beating Deluxx and opens by promising two W's like 2MWAD. The Episode 4 decision completes the prediction, turning a name flip into an early two-battle winning run."],
                      ["The game language changes hands immediately", "2MWAD builds missions, XP, side quests, DLC, NPC and player-one writing. Mikez follows with Warzone and the Gulag. The second use is not proven to be improvised, but it answers the vocabulary active in the room."],
                      ["Lance becomes shared archive knowledge", "Mikez names 2MWAD as Lance Pennant here. Ryno repeatedly uses Lance against him in Episode 8, showing private-name material moving from an early opponent into a later official clash."],
                      ["2MWAD develops narrative case-building", "The debut's strongest passage makes one family-role allegation support an entire gaming system. Against Ryno, 2MWAD expands that method into a three-round case about housing, money, work, hygiene and public image."],
                      ["The loss becomes the setup for Episode 8", "Episode 4 gives 2MWAD his first official defeat. His later win over Ryno is therefore a recorded recovery rather than an undefeated continuation, and the Mikez result remains part of his standing."],
                      ["Mikez remains present in the Deluxx story", "Mikez had just beaten Deluxx in Episode 3. When BTizz faces Deluxx in Episode 7, he alleges that London Mikez wrote Deluxx's bars, turning the winner of the earlier clash into an invisible authorship angle."],
                      ["Tapped24 appears as an information route", "Mikez answers a snitch accusation by saying Tapped gave 2MWAD the information, then turns Tap into Tiny Dancer. The claim is unverified, but it places Tapped inside the network of opponents and shared personals before later clashes make those links explicit."],
                      ["The EastEnders material belongs to Mikez", "Frank, Butcher, Ben, Heather, New Era, Tracy, Shirley and Bianca are delivered in Mikez's final round. Assigning the scheme to 2MWAD reverses the transcript and obscures the winner's most connected closing construction."],
                      ["Personal claims remain performance material", "Custody, drug use, family conduct, sexuality and other serious allegations appear throughout the rounds. The analysis records how they function as attacks; it does not present them as independently established facts."],
                      ["Restarts reshape what the room remembers", "Mikez repeats much of rounds one and two after sound and energy interventions, while 2MWAD also restarts his final. Repetition strengthens several hooks but weakens the appearance of uninterrupted control."],
                      ["The repeated vote has a clear final call", "The host initially describes the responses as the same and checks both corners again. The final 'that's all Mikez' statement and official archive agree, so the result is clear even though the first comparison was close."]
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
                    Episode 6 matched debuting Renzo with Proty, who arrived from an official win over CJ-Zino in Episode 5. The host presented them as two of the league&apos;s youngest battlers, and the contrast formed quickly: Renzo used fast grime pressure, movement and repeated self-branding, while Proty used slower visual jokes and a more consistent money-and-drug portrait.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Renzo&apos;s first moved through Proty&apos;s appearance, status, family and ability before short images such as four-eyed gremlin and Rubik&apos;s Cube gave the speed something visible. Proty answered by attacking low-quality cannabis, exposing &ldquo;UK Cali&rdquo; as contradictory branding, then building through Muhammad Ali, Tails, sleep and nap language, phones, television and social image. A requested repeat made the first longer without changing its central routes.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Round two sharpened both styles. Renzo&apos;s 0121, 3–0 Trident, TikTok credibility, vape-and-Croc humiliation and quick cadence made the performance feel like a live grime set aimed at one opponent. Proty answered with likes and followers, wasted out-of-town profit, Rizla, checklist, Pennywise, prison-cell and ash comparisons. Commentary split between a Renzo 2–0 and a 1–1 score, showing that performance and cleaner punches were being judged differently.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Renzo&apos;s third produced the material that travelled furthest: controller-button inputs became a cheat code, 0121 became town identity, and &ldquo;Renzo / friend zone&rdquo; turned the name into a repeatable self-brand. Proty opened his answer with the battle&apos;s clearest live rebuttal. After Renzo made a sexual boast concerning Proty&apos;s sister, Proty immediately revealed that she was one year old, collapsing the boast and forcing the room to reconsider the preceding line.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Proty then built his own cheat-code and 0121 material before moving through Lorenzo clothing, Benzos, Cali, Sacramento, prepaid clothes and a claimed TKO. The mirroring matters: Renzo&apos;s local and gaming language was not merely endured but reused in the reply. Renzo had the louder identity; Proty often supplied the cleaner single images.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The final room call and host announcement awarded the battle to Renzo, matching the official GZone record. Proty&apos;s individual jokes and sister rebuttal kept the clash close, but Renzo&apos;s energy, recurring 0121 identity and friend-zone closer produced the stronger live memory. Badee Harz later repurposes that Renzo/friend-zone sound against Deeno in Episode 17.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'renzo-vs-proty' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Renzo", "Speed, appearance and veteran posture", "Renzo goes first and treats the debut as an established MC facing somebody beneath him. Appearance, family, social status and battle ability arrive rapidly, with four-eyed gremlin, Rubik's Cube and hearse language giving the flow visible anchors."],
                      ["Round 1 — Proty", "UK Cali becomes the opening case", "Proty questions low-quality cannabis and the contradiction in UK Cali, then moves through Muhammad Ali, Tails, sleep, nap, phones, television and social image. A restart repeats the core sequence and makes the cleaner visual punches easier for the room to retain."],
                      ["Round 2 — Renzo", "0121 pressure and a predicted sweep", "Fast grime pockets, BTEC comparison, 0121, TikTok, Trident and the promised 3-0 join location, platform credibility and scoring. Vape, Croc and clothing details try to make Proty look less dangerous than his Episode 5 result suggests."],
                      ["Round 2 — Proty", "Money and drug imagery answer the momentum", "Likes, followers, out-of-town profit, Rizla, checklist, Pennywise, prison cells, ash and intoxication continue the lifestyle portrait. Commentary divides between Renzo 2-0 and 1-1, confirming a real split between live energy and punch clarity."],
                      ["Round 3 — Renzo", "Cheat code and friend-zone branding", "Controller inputs, G-code, 0121 and Renzo/friend zone create the most reusable identity sequence. Renzo keeps moving through appearance, family and status, but a sexual boast about Proty's sister gives the opponent an immediate opening."],
                      ["Round 3 — Proty", "A live rebuttal followed by mirrored language", "Proty reveals that the sister Renzo referenced is one year old, instantly reversing the boast. He then answers through his own cheat code, 0121, Lorenzo, Benzo, Cali, Sacramento, prepaid clothes and TKO, mirroring Renzo's surfaces while retaining the financial case."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Proty brings an Episode 5 win", "Proty officially beat CJ-Zino immediately before this clash. Renzo therefore is not dismissing an untested opponent; his status pressure is an attempt to make an existing win look irrelevant beside live grime performance."],
                      ["Proty's visual method continues", "Against CJ, Proty used Pixar, Ratatouille, Tic Tac and Flushed Away to turn appearance into cartoon scenes. Tails and Pennywise continue the same readable method here, but attach it to hair colour, clowning and money."],
                      ["The drug route shifts opponents", "Proty's earlier CJ material included intoxication, hygiene and appearance. Against Renzo, UK Cali, sniff, ash, fried language and keys create a more connected drug-and-money case rather than merely repeating generic substance insults."],
                      ["Renzo attacks TikTok credibility", "Renzo argues that rapping on TikTok does not prove ring ability. Proty answers the online-status route through likes and followers, turning platform visibility back into a measurable engagement question."],
                      ["The sister line is rebutted immediately", "Renzo makes a sexual boast about Proty's sister. Proty reveals she is one year old before starting his written close, converting the boast into self-damage without needing a prepared scheme."],
                      ["Proty mirrors the cheat code", "Renzo uses controller inputs as G-code for his attack sequence. Proty answers with the zone as a cheat code, showing that a recognisable surface can be taken from the preceding round and redirected rather than simply denied."],
                      ["Proty mirrors 0121 too", "Renzo uses Birmingham's area code as personal authority. Proty incorporates the same digits into a numerical run and a 2-1 suggestion, temporarily borrowing the local stamp to score the battle against its owner."],
                      ["The 3-0 claim meets a close battle", "Renzo's Trident predicts a straight three-round win. Mid-battle commentary explicitly splits between 2-0 and 1-1, so the live scoring challenges the clean-sweep claim even though Renzo eventually wins."],
                      ["Friend zone becomes portable writing", "Renzo turns his name into where the gal get friend-zoned. In Episode 17 Badee Harz joins D-E-N-O, Renzo and friend zone, applying the established sound to Deeno rather than using it as Renzo's self-promotion."],
                      ["0121 becomes shared league vocabulary", "Renzo's town claim sits beside other Birmingham area-code bars from early GZone battlers. Repetition across opponents makes 0121 less like one private slogan and more like a common way of asserting local legitimacy."],
                      ["The commentary split explains the result debate", "One voice has Renzo 2-0 after the second; another has it 1-1. The disagreement is technical evidence of the style contrast: Renzo controls momentum while Proty's individual concepts are easier to isolate on paper."],
                      ["The official result fixes the archive", "The host calls for Renzo and the room celebrates; the official record agrees. Proty's sister rebuttal remains a strong live moment, but a rebuttal can win an exchange without automatically changing the full battle decision."]
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
                    Episode 5 was CJ-Zino&apos;s first GZone appearance and Proty&apos;s return after the host described an earlier disputed showing. CJ entered through direct grime pressure; Proty answered with visual roast writing. From the opening, the battle therefore asked whether force and platform energy could outweigh cleaner, more cartoon-led punch construction.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    CJ&apos;s first used a numbered warning, &ldquo;dead man walking,&rdquo; overseas-family material, Muhammad Ali, percentages and the repeated instruction to &ldquo;get grimy again.&rdquo; Proty converted CJ&apos;s appearance into animation: Pixar design, a lion&apos;s mane, a fired designer, Remy from Ratatouille and a Tic Tac head joined alleged drinking and drug use into an instantly readable character.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    In the second, CJ made grime a territorial standard. Doctor and germs, clothing, the previous dispute, adoption, &ldquo;you ain&apos;t welcome here,&rdquo; bars versus flu and predator versus prey all argued that Proty did not belong at CJ&apos;s level. Proty answered with his most repeatable section: Flushed Away, MDMA, a quick replay and 3–0, polluted breath, bacteria, prison bars and the prediction that a CJ win would be the wrong decision.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    CJ&apos;s third moved from online talk and big-dog status into the clash&apos;s best connected technical scheme. Chromecast and Roku became Fire Stick and broken Chrome, letting streaming devices, fire, metal and physical impact share one sequence. Family, champion status and a claim involving Renzo widened the close, although restarts and mic requests again interrupted momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Proty closed by returning to the visual method rather than matching CJ&apos;s aggression. Linguini and Ratatouille, peddling and two wheels, a contaminated wristband, money spent on drugs, dead bars needing a rewrite, Dizzee Rascal and &ldquo;Fix Up, Look Sharp&rdquo; turned CJ into a character who looked vivid but lacked control of his pen and life.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The crowd checks were repeated and the transcript is not reliable enough to compare their volume from text alone, but the closing announcement appears to name Proty and the official GZone record awards him the win. That result sends Proty into Episode 6 with momentum and gives BTizz an official loss to use against CJ in Episode 13, where CJ&apos;s grime identity becomes the basis of his recovery.
                  </p>
                </div>
              </section>
            )}

            {battle.slug === 'cj-zino-vs-proty' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — CJ-Zino", "A grime debut built as a warning", "Dead man walking and a one-two-three warning introduce CJ through consequence and escalation. Family, Europe, Muhammad Ali, percentages and repeated grime language create pressure, though mic adjustments force part of the opening to be repeated."],
                      ["Round 1 — Proty", "CJ is redesigned as a cartoon", "Pixar, lion mane, a fired designer, Remy from Ratatouille and a Tic Tac head turn appearance into one visual system. Drinking, alleged drug use, music and IQ extend the roast into a wider character portrait."],
                      ["Round 2 — CJ-Zino", "GZone territory and contamination", "Doctor and germs, clothes, the disputed earlier result, adoption, bars versus flu and predator versus prey make Proty sound unhealthy and unwelcome. CJ defines grime and the platform as standards the opponent cannot meet."],
                      ["Round 2 — Proty", "A repeated 3-0 prediction", "Flushed Away, MDMA, quick replay, polluted breath, bacteria, Windows, prison bars, alleged drug use and wrong-decision language form Proty's most crowd-ready passage. Restarts repeat the hook until it becomes the round's dominant memory."],
                      ["Round 3 — CJ-Zino", "Streaming devices become impact writing", "Online status and big dogs lead into Chromecast, Roku, Fire Stick and Chrome. The sequence joins platform control, fire, metal and physical damage before champion language, family attacks and a Renzo reference close the debut."],
                      ["Round 3 — Proty", "Ratatouille returns as a complete closer", "Linguini, Ratatouille, peddling and two wheels restart the cartoon route. A dirty wristband, drug spending, dead bars, rewriting, Dizzee Rascal and Fix Up, Look Sharp develop the attack into hygiene, money and pen criticism."]
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
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Proty returns after an earlier dispute", "The host says there was bullshit around Proty's previous battle and opponent and presents this as redemption. The transcript does not define that earlier result clearly enough to turn the introduction into a formal record claim."],
                      ["CJ's loss becomes Episode 13 evidence", "BTizz later says CJ flopped last time and uses the official Proty defeat to deny challenger status. The Episode 5 result therefore remains active even after CJ develops a stronger performance identity."],
                      ["CJ's grime phrase becomes a stable identity", "Let me get grimy again is more than a genre reference: CJ repeatedly uses grime as the measure of danger and belonging. Against BTizz and 1Flaymr, that darker performance mode returns as part of his established GZone character."],
                      ["Proty carries the win into Renzo", "Episode 6 places Proty against a debuting Renzo immediately after this result. Renzo's veteran and status pressure therefore answers a battler with a recorded win, while Proty's visual writing arrives already validated by the archive."],
                      ["Pixar develops into a cartoon method", "Pixar, Remy, Ratatouille, Tic Tac and Flushed Away make animation the main route here. Against Renzo, Proty changes the characters to Tails and Pennywise but keeps the method of turning appearance into instantly readable cartoons."],
                      ["Drug material becomes more connected next time", "CJ's alleged drinking and drug use is spread across Pixar, Ratatouille and hygiene jokes. Against Renzo, Proty concentrates the route through UK Cali, sniff, ash, fried language and money, refining a recurring target into a clearer battle story."],
                      ["The 3-0 forecast is supported by the record", "Proty repeatedly predicts a quick-replay 3-0 and says a CJ win would be wrong. The archive awards Proty the battle, but it does not record a round-by-round sweep; the winning prediction and exact score should remain separate claims."],
                      ["CJ builds his own device rebuttal", "Proty uses Windows and buffering to make CJ technically weak. CJ answers the broader technology surface in round three through Chromecast, Roku, Fire Stick and Chrome, turning devices from an insult into his strongest connected scheme."],
                      ["Cleanliness changes sides during the clash", "CJ uses doctor, germs and flu to make Proty contaminated. Proty responds through breath pollution, facial bacteria and the dirty wristband, showing a hygiene route being exchanged rather than owned by one battler."],
                      ["Renzo enters before Episode 6", "CJ ends with a serious allegation involving Renzo. Renzo is booked in the next episode, so his name reaches the Season 1 narrative before his own official result; the allegation remains unverified battle material."],
                      ["Repeated crowd calls require careful reading", "The host asks for both corners more than once. Transcript text cannot measure volume reliably, so the archive should separate audible crowd procedure from the official winner rather than inventing a precise room margin."],
                      ["CJ's recovery later reverses this result", "After the loss, CJ officially beats BTizz and calls for PR1NC3, then later faces 1Flaymr. Episode 5 becomes the low point from which the grime identity, originality arguments and wider roster ambitions develop."]
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
                    Episode 11 placed Ryno, returning from an official win over 2MWAD, against debuting TymeLess. The earlier victory did not remove the material attached to Ryno: housing instability, alleged conduct and racism accusations all travelled from Episode 8 into this clash. TymeLess arrived without a GZone record but with a prepared case built from that shared history.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Ryno&apos;s first round used TymeLess&apos; real name William, ADHD, family, children, sunglasses, women, racism and an extended time vocabulary. Time travel, clock faces, stopwatch, cremation, life check and expiry language made the attack visibly opponent-specific. TymeLess answered by questioning who Ryno was challenging, then returned to homelessness, allegations, the 2MWAD racism dispute and family trauma.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The second exposed the difference between technical organisation and room control. Ryno built past, present, future, timelines, stopwatch and recorded-timestamp writing, but the host mistook a timestamp line for the end of the round and the resulting argument fractured his momentum. TymeLess used that space for a longer character case involving alleged racism, Ryno&apos;s friends, sexuality, family bereavement and claimed inside information.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Ryno&apos;s third recovered with marination, William, &ldquo;fire at Will,&rdquo; homelessness denial, keys and a live clock check that became &ldquo;recording time of death.&rdquo; TymeLess then turned the housing angle into theatre: a photograph, ashes, socks, toothbrush, Pot Noodle, soap, packing tape and other everyday items made alleged hardship visible. Ryno&apos;s keys supplied the direct counter-prop, but TymeLess&apos; sequence controlled the closing image.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The room vote and official record award TymeLess the win. Ryno produced the denser name-flip writing and the sharper improvised clock payoff; TymeLess connected previous battle history, live rebuttal energy, extreme personals and physical evidence into the larger three-round performance.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light">
                    Both arsenals continue later. Roman inherits Leicester, housing and NFA pressure against Ryno in Episode 18. Deeno inherits William, time travel, parenting and racism routes against TymeLess in Episode 21, while TymeLess explicitly brings the Ryno clash back into that room and evolves this battle&apos;s household-prop method into the plunger, fruit and three-lemon structure.
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

            {battle.slug === 'ryno-vs-tymeless' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Round Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — Ryno", "William and the time-flip engine", "Ryno combines the real name William with ADHD, family, children, sunglasses, women and racism claims. Time, time travel, clock faces, stopwatch, expiry and cremation keep the personal routes attached to TymeLess's identity."],
                      ["Round 1 — TymeLess", "Episode 8 history becomes a debut case", "TymeLess questions Ryno's league status, then imports homelessness, allegations and the racism dispute already raised by 2MWAD. Family trauma and chant-like sound chains make the inherited material feel immediate."],
                      ["Round 2 — Ryno", "Technical time scheme disrupted live", "Past, present, future, dimensions, stopwatch and timestamp language create Ryno's densest written sequence. The host mistakes the recorded-timestamp line for the finish, and the dispute breaks the round's intended shape."],
                      ["Round 2 — TymeLess", "Character exposure and inside-information reveal", "TymeLess answers the racism exchange, addresses people around Ryno, alleges private information and moves into sexuality and family bereavement. The round relies on emotional escalation more than a single wordplay scheme."],
                      ["Round 3 — Ryno", "Keys, William and live time of death", "Ryno denies being homeless, displays property keys, returns to William through 'fire at Will' and asks the room for the actual time. The phone check makes the recording-time-of-death closer visibly live."],
                      ["Round 3 — TymeLess", "Everyday objects become a closing narrative", "A photograph, ashes, socks, toothbrush, Pot Noodle, soap and packing tape turn Leicester, housing and hygiene allegations into physical scenes. The items overwhelm Ryno's single counter-prop through sequence and repetition."]
                    ].map(([round, focus, detail]) => (
                      <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand font-display uppercase text-sm mb-2">{round}</p><h3 className="text-white font-bold mb-3">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />Rebuttals, Callbacks &amp; Evolving Material</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Ryno's Episode 8 win does not erase the angles", "Ryno officially beat 2MWAD, but alleged homelessness and racism remained usable. TymeLess shows that winning a clash can preserve the opponent's material even when it improves the record."],
                      ["TymeLess explicitly invokes 2MWAD", "The first round says 2MWAD called Ryno racist. Naming the earlier opponent makes the accusation inherited league evidence rather than a discovery claimed solely by the debutant."],
                      ["Ryno tries to reverse the racism charge", "Ryno repeatedly calls TymeLess racist and references alleged lyrics and conduct. TymeLess asks where the racist material is and redirects attention to the accusation already attached to Ryno."],
                      ["William becomes reusable opponent access", "Ryno's use of TymeLess's real name supports 'fire at Will' and personal address. Deeno returns to William in Episode 21, treating the earlier name reveal as shared roster knowledge."],
                      ["Time travel survives into the Deeno clash", "Ryno makes time travel one of the first clean name flips here. Deeno later uses time, no reverse, William and related identity writing, expanding rather than rediscovering the same surface."],
                      ["Parenting pressure is inherited too", "Ryno says TymeLess needs less time on the mic and more for his children. Deeno revisits parenting in Episode 21, while TymeLess reverses it by addressing Deeno's son and casting himself as a stepfather."],
                      ["The timestamp interruption creates the final payoff", "The room prematurely treats Ryno's recorded-timestamp line as time on the round. In the third he asks for the actual clock and turns the earlier confusion into a live recording-time-of-death moment."],
                      ["Keys answer the homelessness props", "Ryno says he is not homeless anymore and presents keys. TymeLess does not ignore the rebuttal; he overwhelms it with multiple low-cost household items designed to keep the alleged hardship visually present."],
                      ["Roman later inherits Leicester and NFA", "Episode 18 returns to Leicester, sofas, roads, keys, housing proof and NFA language against Ryno. Roman refines TymeLess's long prop-led portrait into a written three-round case."],
                      ["The NFA exchange remains an allegation", "TymeLess says no further action does not prove innocence; Ryno disputes the wider claims. The page records how the legal phrase is used in the battle and does not treat either side as independently verified fact."],
                      ["TymeLess carries Ryno into Episode 21", "Against Deeno, TymeLess explicitly invokes Ryno while changing flow, and Deeno dismisses earlier TymeLess material through Ryno's dance. The previous opponent becomes cadence reference and status evidence."],
                      ["Prop performance evolves from supplies to three-round structure", "Socks, toiletries, food and tape make one closing household scene here. Against Deeno, the plunger, photograph and three lemons distribute visual objects across the whole battle and reserve the final fruit for the closing payoff."]
                    ].map(([title, detail]) => (
                      <article key={title} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><h3 className="text-brand font-display uppercase text-base mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>
                    ))}
                  </div>
                </section>
              </>
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
                      <p>Tapped24 arrived as the known GZone battler but not a proven winner. The official losses to Deeno and Roman make his veteran posture double-edged: he has more room experience than AJNA, yet that same history gives the newcomer a record to attack.</p>
                      <p>His writing uses immediate visual access. Dumbledore, Juggernaut, Giant Peach, Austin Powers, TARDIS, High School Musical, Wiley, eyebrows, weight and clothing keep the punches readable, while parenting, relationships and money attempt a deeper character case.</p>
                      <p>The performance repeatedly loses clean shape to sound resets, reloads and crowd involvement. The extended run-train passage creates participation but also spreads the second round across too many targets. The third grows darker without producing a single closing structure as memorable as AJ&apos;s repeated levels opening.</p>
                      <p>Tapped&apos;s minority technical case is preserved in the aftermath—some commentators say they preferred him—but the room and live comments select AJNA. His later claim that GZone made him lose is therefore a rebuttal to the verdict, not the official outcome of this battle.</p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">AJ / AJNA</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>AJNA converts the First Lady introduction into competitive authority. Matching Tapped&apos;s sexual, family and appearance pressure removes any novelty framing and makes the room judge her through the same hostile standard as the established battler.</p>
                      <p>Her most effective sequences have simple repeatable spines: bad man, mad man and sad man; one, two and three lines; Georgie Porgie; and &ldquo;set some levels.&rdquo; The patterns keep aggressive material intelligible even when the performance is loud and chaotic.</p>
                      <p>Georgie is the sharpest opponent-specific route because it involves someone present and produces live reloads. Drug use, masculinity, alleged violence toward women and the boxing-ring challenge then combine into the claim that Tapped&apos;s public toughness is misdirected.</p>
                      <p>The writing can be raw and the most serious allegations remain unverified battle material, but AJ controls recovery after interruptions and owns the final reaction. The room and live comments lead to the announced and official AJNA win, making the debut a recorded upset rather than only a strong showing.</p>
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
                      <p>Ryno arrived from an official Episode 8 win and performed like the technically established battler. William, time travel, clocks, timelines, timestamps, past, present, future, expiry and time of death give all three rounds an opponent-specific language system.</p>
                      <p>The writing is strongest when one term does several jobs. Clock is a timepiece, an act of noticing and a punch; stopwatch becomes an instruction; &ldquo;fire at Will&rdquo; reaches TymeLess through his real name. Family, children, ADHD, women and racism accusations are tied into those structures rather than delivered only as lists.</p>
                      <p>Control is the weakness. Repetitions, room arguments and the mistaken time call during round two prevent the densest sequence from completing cleanly. Ryno nevertheless adapts: the third-round phone check converts the earlier timestamp confusion into the battle&apos;s sharpest live rebuttal.</p>
                      <p>The keys are a direct answer to homelessness, but a single proof object cannot control the closing image once TymeLess begins producing a whole household-survival kit. Ryno leaves with the clearer technical highlights but not the official decision.</p>
                    </div>
                  </article>

                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">TymeLess</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>TymeLess treats Ryno&apos;s earlier clash as research material. Homelessness, 2MWAD&apos;s racism accusation, allegations, Leicester, friends and family history are assembled into one credibility portrait rather than presented as unrelated shocks.</p>
                      <p>His rebuttal instinct matters more than traditional polish. Ryno calls him racist; TymeLess asks for the evidence and returns to the charge already attached to Ryno. Ryno presents keys; TymeLess answers with more objects. Every defence is made to compete with an immediate live image.</p>
                      <p>The prop sequence is the winning technical choice. A photograph and ashes create severe exposure, while socks, toothbrush, Pot Noodle, soap and packing tape make housing and hygiene claims tangible. The objects are ordinary, which makes the alleged situation easier for the room to visualise.</p>
                      <p>The content is frequently extreme and the accusations remain unverified battle claims, but TymeLess controls the emotional temperature and closing memory. The room and official archive award him the win; later battles confirm that his prop timing and inherited-angle strategy became central parts of his GZone style.</p>
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
                      <p>NattyEBK constructed his debut around immediate pressure. Wife, children, bereavement, finances and danger were introduced before the room had any softer version of the character, making emotional risk itself the first impression.</p>
                      <p>The second and third broadened that pressure through age, masculinity, transport, money, music, Mars and Pluto, drugs, the boxing-ring setting, fighting and deceased friends. His clearest writing compresses a larger route into a visual comparison; his most effective performance choice is refusing to lower the intensity after the first round.</p>
                      <p>The weakness is technical cleanliness. Several passages are crude lists rather than developing schemes, and the restarts and repeated third-round material expose uneven control. The threats and family attacks also depend far more on discomfort than wordplay.</p>
                      <p>The official record nevertheless gives Natty the win. Episode 20 confirms how he understood the performance: Prince becomes the first recorded body in a continuing run, while the hygiene pressure used against Natty is studied and redirected onto Z.K.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">PR1NC3</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>PR1NC3 correctly anticipated the available personal routes. Saying he already expected barber, dancer, wife and family material is a prebuttal rather than a denial: it asks the room to judge Natty on invention after the shock has already landed.</p>
                      <p>His strongest counterargument is credibility. Lies, snitching, 999, vermin and false danger turn Natty's aggression into alleged performance, while the boxing language lets Prince claim technical control inside the literal ring.</p>
                      <p>Listerine, soap and salt produce the cleanest organised sequence. The objects give the room a visible joke, cool the emotional temperature and continue the same inauthenticity argument through hygiene. Redemption and &ldquo;levels&rdquo; then connect the battle to Prince's Episode 2 loss and royal name.</p>
                      <p>The prior result text was wrong: the official archive awards NattyEBK the victory, not PR1NC3. Prince shows composure and several clearer devices, but they do not outweigh Natty's sustained room pressure on the recorded decision.</p>
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
                      <p>BTizz entered with the stronger recent result and used it. The &ldquo;GZone massacre&rdquo; opening treated CJ-Zino&apos;s Episode 5 loss as proof that the challenger could talk but could not perform, then layered road, relationship, health, hygiene and credibility pressure over that record.</p>
                      <p>His best writing was simple enough to organise the room. MVP became call-and-response; &ldquo;CJ-Zino / three rounds / 3-0&rdquo; worked as a repeatable hook; Nemo and Dory, the clean-up crew and surface area, Leon Edwards and UFC, Alien Roger and relegation gave each passage a clear image.</p>
                      <p>The weakness was round control. The first required several restarts around sound and delivery, and later passages packed disease, sex, race, clothes, cartoons and violence together faster than the strongest concepts could settle. High energy prevented a collapse, but it did not create a single developing argument as strong as CJ&apos;s flow-theft route.</p>
                      <p>The official result also changes how the performance reads in sequence. The repeated 3-0 forecast is directly contradicted by the crowd call, and the next chapter of BTizz&apos;s story begins in the post-battle footage when OneFlaymr introduces the fire persona BTizz will later try to extinguish.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ Zino</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>CJ-Zino built a more opponent-specific credibility case. Employment, alcohol, clothes, relationships, snitching, sexuality and family were separate routes, but the central claim was technical: BTizz did not own the style he was using.</p>
                      <p>Calling to Tapped24 made that accusation unusually effective. The alleged source was treated as a live witness, after which &ldquo;go find your own flow&rdquo; became the plain-language summary of the battle. The Listerine prop performed a similar function for the hygiene material by converting explanation into an instantly visible joke.</p>
                      <p>His rounds were not perfectly smooth. The tissue interruption, repetitions and some loosely connected passages show the same live-room disorder affecting BTizz. CJ nevertheless recovered with clearer destination points: the number sequence in the first, flow theft and personal evidence in the second, then TARDIS, fatherhood and PR1NC3 in the third.</p>
                      <p>The crowd clearly favoured CJ and the archive records the win. More importantly for the season narrative, he immediately turned the result into future matchmaking pressure; the later Episode 19 clash with OneFlaymr then lets him reuse BTizz&apos;s &ldquo;fully extinguished&rdquo; phrase as inherited evidence.</p>
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
                      <p>PR1NC3's debut is built for immediate comprehension. The opening list, Roman and Ferg naming, 99-percent body, bacon, left and right punches, GOAT sacrifice and veteran language create short destinations rather than one complicated narrative. Youth, directness and the crown supply the identity.</p>
                      <p>The second is his strongest complete turn. The old voice, cat and clown route leads logically into goldfish, tank and ocean, his cleanest status comparison. The fake forgotten-bars moment briefly converts the possibility of a choke into confidence theatre, then free throw, kilos and Kevin and Perry keep the punches visible.</p>
                      <p>Round three shows why his music identity is both strength and vulnerability. Cold roadside, Dark Knight, ring, book, punchline and hook move into a rapid GRM pocket before he slows down to explain PR1NC3 to the three. The flow generates energy, but it also lets Roman argue that songs and dancing are where Prince belongs.</p>
                      <p>The main limitation is opponent specificity across the full battle. Roman is old, large and allegedly fake, but many threats could face any veteran. PR1NC3's clearer moments keep the contest live; Roman's name flips and cross-round schemes create the more distinctive archive. The loss becomes the reason Prince enters Episode 12 in redemption mode.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Roman's first turns the opponent's royal identity against him. Princess removes authority, real don replaces it, and upper class, royal bars and Buckingham Palace let Roman occupy Prince's vocabulary. Experience since 2006 answers the youth-versus-veteran criticism without denying his age.</p>
                      <p>The second is the technical centre of the battle. Times New Roman converts the stage name into typography; huge shins and knees create a consistent height cartoon; gel pens and school frame Prince as young. Finger pointing, engine sounds, pauses and the audience-demanded reload make the writing theatrical rather than only textual.</p>
                      <p>His third pays off information introduced across the battle. Mason removes the crown, 2001 becomes both birth year and exaggerated loss count, songs become evidence that Prince belongs outside battle rap, and toner revives the printing surface from Times New Roman. Top dog, wing and cell close on territorial authority.</p>
                      <p>The performance is not perfectly clean: the mic restart, extended family passages and long reload expose their own excess. Roman nevertheless connects more of his material to this opponent and lets the room recognise recurring ideas. The official victory starts the unbeaten run he later extends against Tapped24 and Ryno.</p>
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
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">LDN Mikez</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Mikez debuts by treating force as a delivery system for connected writing. The first moves from PowerPoint and Excel to words, GOATs to a shepherd, Roman to Fergs, then benefits, rent, Beckham, grass, decking and Wi-Fi. The ordinary references are more precise than the surrounding shock material because each gives the room a concrete consequence or double meaning.</p>
                      <p>The second becomes more opponent-specific by replacing Deluxx with Devonte. Thumb, mum, Power Punch, Supercell, Superman, Tinkerbell, Christmas locks and rocks, debut and &ldquo;made you&rdquo; status language create visible landmarks. Several attempts are needed because of beat, mic and room interruptions, but Mikez keeps recovering without surrendering the verse.</p>
                      <p>His third contains the strongest extended rhyme organisation. Fire, smoke, turn, earn and learn lead into G and germ, snake and worm, then judge, case, adjourned, academy and term. Some passages use disability, sexuality, family and other severe subjects primarily for shock; the analysis records those choices without validating the allegations behind them.</p>
                      <p>The winning advantage is intelligibility under disruption. Mikez projects the setups, lets recognisable references punctuate long rounds and ends with a complete hierarchy claim. The host's commentary gives him the first, the final room decision names him clearly, and the result becomes the foundation of his Episode 4 two-W boast.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Deluxx</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Deluxx's first has a strong performance identity even where the transcript is difficult to recover. &ldquo;You're from London, I'm king of the mic&rdquo; is a simple opponent-name reversal, and 0121 gives the refrain a Birmingham base. Returning to it repeatedly provides a hook when the faster internal passages become less audible.</p>
                      <p>The second attacks Mikez as an artist and public figure. Trap credibility, DVD, the album-scamming accusation, money, barber sounds and repeated Renzo comparisons all argue that Mikez's music and flow are not authentic. The route is relevant, but accelerated phrasing makes several setups disappear before their payoffs can register.</p>
                      <p>His final supplies the clearest self-definition. Deluxx names DFN as the earlier identity and presents Deluxx as the development, then uses A1J1, rent, Aquaman, Atlantis, Lockjaw, Spanish and freestyle motion. That gives him more character than the family insults, but the verse finishes without a decisive closing punch.</p>
                      <p>The loss is not the end of Deluxx's season story. When he returns against BTizz, he acknowledges losing to a veteran and uses survival as status. BTizz then attacks the very issue raised here—who created Deluxx—by alleging Mikez wrote his material, turning Episode 3's winner and &ldquo;made you&rdquo; claim into later battle evidence.</p>
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
                      <p>2MWAD begins with the strongest single angle in the battle. Missions, XP, rent-free headspace, a side quest, DLC, NPCs, DNA and two controllers all translate the same step-parenting attack into a consistent game system. The concepts do not merely share a topic: each one changes Mikez&apos;s alleged household position into a different kind of secondary player.</p>
                      <p>The second is shorter and more economical. Mike and mic, the mother comparison and Bellerín being sent right back are simple enough to survive a noisy room, while the preparation-time criticism keeps the earlier old-bars challenge active. It has fewer layers than the first but clearer isolated punches.</p>
                      <p>His final is driven by cadence and grounded humiliation. The ugly-to-rusty chain, online banking, McFlurry and council-housing images make financial pressure visible, and the McDonald&apos;s sandwich interruption briefly becomes a live crowd moment. The structure then fragments, leaving less of a closing argument than the gaming round promised.</p>
                      <p>The debut shows a battler already capable of building a researched character case, but not yet sustaining that organisation across every turn. The official loss becomes useful context for Episode 8: against Ryno, housing, money and public-image routes expand into the complete three-round narrative that gives 2MWAD his first recorded win.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-brand/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">LDN Mikez</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Mikez arrives with a result to convert into status. &ldquo;Two W&apos;s like 2MWAD&rdquo; ties the opponent&apos;s name to the possibility of consecutive victories, while Warzone and Gulag meet the gaming vocabulary already active in the clash. Naming Lance Pennant then strips away the stage identity and makes the remaining attacks feel more targeted.</p>
                      <p>His second has the most sustained sound writing. Plug and sync lead into wave and ship, set five and extinct, then extinct, stinks, instincts, Miss Inks and NSYNC. Not every connection is equally clean, but the chain gives Mikez a route through a long passage before ringtone and the wrestling references provide recognisable payoffs.</p>
                      <p>The final corrects the earlier page&apos;s main attribution error: Mikez, not 2MWAD, performs the EastEnders scheme. East End, Frank, Butcher, Ben, Heather, New Era, Tracy, Shirley and Bianca let him organise harsh family material around a single cultural frame, and the Tapped24-to-Tiny-Dancer turn links alleged information sharing to wordplay.</p>
                      <p>Mikez&apos;s advantage is force and finishing shape rather than flawless execution. Sound problems and restarts repeatedly disturb the rounds, and serious unverified allegations often replace cleaner craft. Even so, he rebuilds momentum, ends on melody, cemetery and entity, then receives the clearer repeated audience call and the official win—his second after Deluxx.</p>
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
                      <p>Live-room command was the winning difference. Btizz simplified, paused, repeated, involved the crowd, and ended with &ldquo;fully extinguished,&rdquo; a phrase concise enough to become the official memory of the battle. The result gave him his second Season 1 win after beating Deluxx and losing to CJ-Zino.</p>
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
                      <p>CJ-Zino uses his first GZone appearance to establish grime as both sound and status. The numbered warning, dead-man-walking frame and repeated &ldquo;get grimy again&rdquo; make the debut feel confrontational before the more personal routes fully develop.</p>
                      <p>The second has the clearest opponent case. Doctor and germs, clothing, disputed history, adoption, flu and predator/prey language all argue that Proty is contaminated and does not belong on the platform. Force sometimes substitutes for structure, but the destinations are unmistakable.</p>
                      <p>His third supplies the strongest connected writing. Chromecast and Roku move into Fire Stick and Chrome, so streaming, heat, metal and impact all occupy the same technology scheme. It is the first passage where CJ&apos;s aggression and technical organisation fully align.</p>
                      <p>Mic resets and crowded family attacks reduce control, while Proty&apos;s repeated hooks are easier to remember. CJ loses the official decision, but the grime identity and stronger closing construction become the tools he later uses to beat BTizz and challenge 1Flaymr.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Proty</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Proty&apos;s return is organised around visual translation. CJ becomes a Pixar design, lion, Ratatouille character, Tic Tac, Flushed Away rat, Yanko variant and buffering screen. Those comparisons make a dense, aggressive opponent feel cartoonish and controllable.</p>
                      <p>The second is his strongest performance section because repetition supplies structure. Quick replay and 3-0 return around breath, bacteria, Windows, prison bars and intoxication, while the &ldquo;wrong decision&rdquo; forecast turns the eventual verdict into part of the writing.</p>
                      <p>Hygiene changes from a reciprocal insult into a full visual ecosystem: polluted breath, competing bacteria and a contaminated wristband. Alleged drinking and drug use similarly connect Remy, the previous event, MDMA, lines and weekly finances.</p>
                      <p>Some long passages depend more on roasting than layered argument, but Proty&apos;s images and hooks remain easier to isolate through the live disorder. The closing announcement and official archive award him the win, which immediately becomes his status entering Episode 6.</p>
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
                      <p>Renzo performs the debut through speed, movement and grime pressure. He rarely waits for a single punch to settle; instead, repeated flow cues, direct crowd address and constant forward motion make the round feel like a live set being converted into a clash.</p>
                      <p>The opponent-specific material is strongest when a compact image survives that pace. Four-eyed gremlin and Rubik&apos;s Cube, BTEC, Trident, TikTok, the stolen vape and Croc and controller buttons let listeners locate the attack inside the faster pockets.</p>
                      <p>Self-branding gives the third its enduring value. 0121 fixes Renzo in Birmingham, the cheat code turns performance movement into a sequence, and Renzo/friend zone makes the name repeatable enough for Badee Harz to repurpose eleven episodes later.</p>
                      <p>Clarity remains the main weakness, and Proty&apos;s sister reveal turns one boast decisively against him. Renzo nevertheless sustains more live momentum, receives the final room call and is the official winner.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Proty</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Proty arrives from the CJ-Zino win with the clearer single-punch method. UK Cali, Muhammad Ali, Tails, Pennywise, Rizla and prepaid clothes turn intoxication, money, appearance and credibility into images that remain legible after the beat moves on.</p>
                      <p>The case develops rather than resets each round. Cannabis quality expands into sniff, ash and fried language; money expands from likes and followers into lost profit, pennies, credit and cheap brands. The repeated details make Renzo&apos;s public image the object of the battle.</p>
                      <p>His best live moment occurs before the written third. Revealing that the sister in Renzo&apos;s sexual boast is one year old instantly reverses the preceding attack. Proty then mirrors the cheat-code and 0121 language, showing active listening rather than returning untouched to preparation.</p>
                      <p>Some long rhyme chains become repetitive, and the cleaner concepts do not consistently equal Renzo&apos;s room control. Proty keeps the battle close and may win individual exchanges, but the final call and official record favour Renzo.</p>
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
                      <p>Deluxx makes the previous Mikez loss part of the performance instead of avoiding it. Saying that a defeat to a veteran cannot remove him gives the return a recovery frame, while battle scar and Lion King attempt to restore status from the opening.</p>
                      <p>His second is the clearest technical round. Bill and Ben, flowerpot, Barbie and Ken, killing with a pen, crosses, posts and ghosts join writing language to accessible references. The material sounds more deliberate when it stays on craft rather than stacking unrelated shock attacks.</p>
                      <p>The Tapped24 comparison is the most important future-facing line. By saying BTizz is trying to tap into a style he cannot match, Deluxx establishes the borrowed-flow question that CJ-Zino later turns into a live confrontation with Tapped in Episode 13.</p>
                      <p>Mic problems, repeated starts and compressed delivery limit control, especially in the third. The commentary table credits Deluxx with that final round, but the recovery arrives after BTizz has already built the two-round lead that decides the battle.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">BTizz</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>BTizz debuts with a recognisable room-control system already in place. Skepta&apos;s &ldquo;Shutdown,&rdquo; clipped B sounds, name spelling, crowd repetition and willingness to restart around reactions make the performance easy to identify even when the transcript becomes noisy.</p>
                      <p>Authenticity is the main opponent-specific route. Jamaican and Asian identity, yard language, appearance and public presentation are tested repeatedly, while 0121 supplies BTizz with a clear Birmingham identity against which Deluxx&apos;s image can be measured.</p>
                      <p>The London Mikez line is the sharpest counter to Deluxx&apos;s originality attack. Deluxx says BTizz copies Tapped24; BTizz says Deluxx&apos;s former opponent writes his bars. Turning Mikez&apos;s Episode 3 victory into an authorship allegation lets BTizz attack both record and pen at once.</p>
                      <p>The third is disrupted and less coherent, but BTizz&apos;s first two rounds have the clearer destinations and stronger live control. The commentary table awards him those two rounds, and the official archive records his debut as a 2–1 win.</p>
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
                      <p>Ryno performs his debut as a platform-wide challenge. Addressing the whole room before 2MWAD makes the booking sound like the first step in a larger run, while the online clips, dancing, comedy and sound-effects attack gives him a clear argument against the opponent&apos;s public character.</p>
                      <p>His strongest prepared writing joins multiple meanings without losing readability. Pen becomes the writing tool, lead becomes ammunition, Led Zeppelin supplies the sound, and rock and roll leads naturally to Stairway to Heaven. The pawn and checkmate pair repeats that technical clarity in the third.</p>
                      <p>Ryno also demonstrates live defensive thinking. He predicts homelessness in the first, freestyles on Britain and the pond in the third, anticipates the serious allegation and produces an NFA document. The document is a major room moment, although it does not prevent later battlers reusing the underlying legal language.</p>
                      <p>Audio restarts repeatedly damage rhythm, especially in the second, and the attack sometimes becomes a list of hostility rather than one sustained portrait. Ryno leaves with sharper isolated peaks but loses the official decision to 2MWAD.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">2Mad</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>2MWAD builds the more complete three-round case. Housing, money, hygiene, work, bailiffs, sleeping arrangements and public image all support the same claim that Ryno&apos;s dominant persona is unstable away from the microphone.</p>
                      <p>The strength is concrete imagery. A sleeping bag by a pond, asking for change beside a bank, stained clothing, missing furniture and KFC spare change give the room scenes it can picture and repeat. Returning to those details after rebuttals makes the narrative persistent.</p>
                      <p>Round two broadens the case through politics, alleged racism and an allegation concerning sexual conduct. These are claims made during a clash, not independently verified findings. Their battle function is to force Ryno out of prepared writing and into the live document defence that opens his third.</p>
                      <p>The long rounds and repeated passages can sacrifice precision, but the best lines remain opponent-specific and the final GZone-traveller declaration summarises his position cleanly. The official record awards 2MWAD the win, his first after the Episode 4 loss to LDN Mikez.</p>
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
                      <p>Roman approached the battle through pressure, proximity and certainty. The pack, bloodline and parenting material is often plainer than Tapped&apos;s reference writing, but his physical conviction makes direct threats function as performance moments rather than filler.</p>
                      <p>His most important strategic move comes before the screenshots: Roman predicts the deceased-partner angle and acknowledges the death himself. That prebuttal does not stop Tapped using it, but it removes the shock of disclosure and lets Roman appear prepared when the subject returns.</p>
                      <p>Round two supplies the clearest staging. Roman moves from allegation to a printed screenshot, reads the messages and uses the object to organise the room&apos;s attention. In the third, out-of-depth and sink-or-swim language gives a sprawling personal attack a consistent frame.</p>
                      <p>Restarts affect his continuity, and some extreme family attacks substitute hostility for layered writing. Even so, Roman is steadier at the close, receives the stronger final crowd response and is announced as the winner; the official record agrees.</p>
                    </div>
                  </article>
                  <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-display uppercase text-brand mb-6">Tapped24</h3>
                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                      <p>Tapped24 supplies the higher reference density. Roman Reigns, Roman script, Fergie time, Dobby, chemistry, X-Men and fairy tales let him move quickly between name flips, appearance jokes and personal attacks without abandoning his comic voice.</p>
                      <p>His best live adjustment is structural rather than improvised: after Roman produces messages, Tapped reveals his own screenshot and announces that he has &ldquo;done a Deeno.&rdquo; The phrase acknowledges the Episode 1 tactic while showing that he can absorb a method previously used against him.</p>
                      <p>The performance is strongest when a reference compresses the point into one crowd-readable contrast, especially GZone versus G-string and rock versus pebble. The longer bereavement sequence is more contentious: Roman had already prebutted it, and continued repetition creates shock without always advancing the argument.</p>
                      <p>Tapped remains competitive through humour, room interaction and memorable phrasing, but repeated sound interruptions and the looser third round weaken his finish. He earns substantial crowd support without overturning Roman&apos;s official decision.</p>
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

            {battle.slug === 'zk-vs-cj-zino' && (
              <>
                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Clash Summary
                  </h2>
                  <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">Episode 23 put Z.K into his second GZone battle after the official loss to NattyEBK in Episode 20. CJ-Zino arrived with a longer platform record: a loss to Proty, a win over Btizz, and a loss to 1Flaymr. Z.K was trying to convert a competitive debut into his first recorded win, while CJ was looking to restore momentum after the 1Flaymr result.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">CJ opened through direct status and credibility pressure. The repeated &ldquo;Mr Robinson&rdquo; entrance moved through Liverpool and Suarez, Grimsby, health and hygiene, family and bereavement material before reaching the clearest argument: Z.K had allegedly rapped for fourteen years without turning that experience into comparable visibility. The JDZ and birthday view-count comparison made reach the round&apos;s closing measure.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">After a sound restart, Z.K answered through CJ&apos;s Instagram reach, Gollum and other appearance jokes, CJ&apos;s GZone record, home-condition imagery, and a football run through Scholes, Gerrard, and Paolo Di Canio. He brought out a mini football to make the claim that he could volley CJ-Zino visible in the room. The first round established the battle&apos;s main contrast: CJ used blunt confrontation and personal pressure, while Z.K stacked visual comedy and recognisable references.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">The middle rounds widened those approaches. CJ raised an unclear allegation about other people preparing Z.K&apos;s rounds, used &ldquo;PC Robinson&rdquo;, disputed the credibility behind Z.K&apos;s image, and closed through a partly unclear Roman-numeral and X sequence. Z.K began answering the season&apos;s picture tactic before it could control him, then used cheap food, clothes, CJ&apos;s previous results, football-kit imagery, and sustained appearance jokes to question CJ&apos;s status.</p>
                    <p className="text-zinc-300 leading-relaxed font-light mb-8">CJ&apos;s third used the Peacock&apos;s boxing setting through gloves, sparring, kicks, knocks, and a crowd-facing &ldquo;Pow&rdquo; passage, but repeated mic and sound resets broke its progression. Z.K&apos;s final was the clearest rebuttal round: he answered the repeated Grimsby and GY pressure by saying CJ mentioned his home so often that he wanted to live there, contrasted the seaside with a London box house, then ran through Peter Parker, darts, Dwayne Carter, Keir Starmer, fish and tartar, Palmer, Pollock, teeth, and the anticipated-photo close.</p>
                    <p className="text-zinc-300 leading-relaxed font-light">Ginge checked both sides of the room before deferring the close result to the live YouTube audience. YouTube selected Z.K, and the official GZone record confirms him as the winner. The video gives no judge panel or round score. Z.K&apos;s sustained final run and stronger late adjustment left the cleaner last impression, while CJ&apos;s view-count argument and &ldquo;Pow&rdquo; participation kept the clash competitive. Serious personal accusations on both sides remain statements made in performance, not independently verified facts.</p>
                  </div>
                </section>

                {battle.props && (
                  <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10">
                    <h2 className="text-3xl font-display uppercase text-white mb-8">Evidence: Props Used</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {battle.props.map((prop) => (
                        <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                          <div className="w-16 h-16 shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
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
                )}

                <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-brand" />
                    Round Structure
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["Round 1 — CJ-Zino", "Longevity becomes underachievement", "Mr Robinson, Liverpool and Suarez, Grimsby, contamination and germs, personal and bereavement attacks, and fourteen years versus three build toward the view-count comparison. The opening is repeated after a sound adjustment."],
                      ["Round 1 — Z.K", "Online reach and visual roast writing", "Slipknot and TikTok, Instagram followers, Gollum, roster-record pressure, the 1-0 scoreboard claim, floorboards and bando imagery, then a mini-football prop turns the Scholes, Gerrard, and Paolo Di Canio half-volley sequence into a physical claim that Z.K could volley CJ-Zino. He also restarts after asking for his level to be changed."],
                      ["Round 2 — CJ-Zino", "Credibility, seriousness, and the X close", "An unclear suggestion that Z.K's rounds are paid for or prepared by others leads into direction writing, smell, PC Robinson, alleged lies, serious name-checks, severe deceased-friend material, and a partly unclear Z.K, Roman-numeral, and X sequence."],
                      ["Round 2 — Z.K", "Pictures, class, and record pressure", "Facebook deletion and opponents producing pictures establish a prebuttal before shoes, family and poverty imagery, Rustlers and Worcester flavouring, BMX and wheelie, CJ's prior defeats, football-kit staging, clothes, dancing, and sustained appearance jokes."],
                      ["Round 3 — CJ-Zino", "The boxing setting becomes performance", "GY and Fishpatrick lead into running an opponent down, sparring, gloves, kicking, knocks, tea and mug language, leprechaun and rainbow imagery, relationships, the cold GZone ring, and a Lethal B-style Pow call-and-response. The passage requires several starts."],
                      ["Round 3 — Z.K", "Territory reversal and the longest connected run", "Z.K says CJ mentions his home so often that he wants to be from GY, contrasts a London box house with living near the seaside, then moves through Peter Parker, one-clash progress, darts, Dwayne Carter, farmer, Starmer, fish and tartar, Palmer, Pollock, teeth, and the photo-clone prebuttal."]
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
                      ["Live rebuttal: GY changes ownership", "CJ repeatedly attacks Grimsby and Z.K's home area. Z.K opens his next round by saying CJ mentions the place so often that he wants to be from GY, then prefers his five-minute walk from the seaside to CJ's claimed London box house. The sequencing makes this an immediate answer, although the transcript cannot prove whether it was improvised."],
                      ["Prebuttal: the photograph tactic is anticipated", "Natty stopped Episode 20 to present a screenshot and photograph against Z.K. Here Z.K begins round two with Facebook deletion and opponents whipping out pictures, then closes the battle by saying he expected CJ to come with a photo, had cloned it, and warned him to watch who he trusted. Because CJ's transcript contains no clear photo reveal, this is labelled a prepared prebuttal or claimed countermeasure, not a confirmed live prop rebuttal."],
                      ["CJ inherits the fourteen-year argument", "Natty had already turned Z.K's fourteen years of rapping into evidence that his profile should be larger. CJ repeats that experience-versus-reach pressure and develops it through the JDZ and birthday view comparisons. It is inherited opponent history, not a new factual finding."],
                      ["Football changes sides immediately", "CJ identifies Z.K as a Liverpool supporter and puts himself in a Suarez bag. Z.K answers in the following turn with Scholes, Gerrard, and Paolo Di Canio imagery, bringing out a mini football to show that he could volley CJ-Zino. The football subject clearly changes hands, although the prop reinforces a prepared performance sequence rather than a confirmed live rebuttal."],
                      ["CJ disputes the 1Flaymr result", "CJ refers back to his previous clash and argues that the crowd misunderstood or misjudged the outcome. The official GZone archive still records 1Flaymr as the winner, so CJ's statement is documented as a performance rebuttal to his record rather than a revised result."],
                      ["CJ's official losses become Z.K's pressure", "Z.K says CJ has been spun by much of the roster and later appears to reference Proty and 1Flaymr, both official CJ defeats. The speech-to-text wording around the names is imperfect, and 'bodied' is Z.K's battle claim rather than an official margin."],
                      ["Live rebuttal: the level claim is reversed", "CJ says he cannot see Z.K levelling with a level like his. Z.K answers in the next round that CJ is stuck at the level he passed in one clash and that he beat the marker. Repeating the key word and reversing the hierarchy makes this the clearest opponent-to-opponent rebuttal, although the transcript cannot prove it was freestyled."],
                      ["Grimsby develops from travel pressure into territory", "Z.K's debut already used Grimsby-to-London movement as part of his identity. CJ attacks Grimsby here, but Z.K's final turns the seaside into something preferable and worth defending. Location changes from vulnerability into owned territory."],
                      ["Hygiene pressure keeps changing hands", "Natty used teeth, plaque, breath, and washing against Z.K. CJ now returns to germs and smell, while Z.K redirects the same surface through CJ's home, partner, clothes, hair, and teeth. The subject is exchanged across battles rather than belonging to one performer."],
                      ["Darren the dentist is redirected", "Natty told Z.K to visit a dentist and said Darren could not save him in Episode 20. Z.K now says everyone knows Darren is a dentist before telling CJ that his teeth need checking. A bar previously aimed at Z.K becomes part of his closing attack on somebody else."],
                      ["No more dropping the mic is a live self-callback", "CJ first says he will drop the mic and start with a kick. After the mic and sound interruptions, he says there will be no more dropping it before the Pow sequence. The adjustment responds to what has just happened on stage rather than answering an opponent's angle."],
                      ["The result confirms progression, not a rewritten debut", "Z.K says he passed CJ's level in one clash, and Ginge later says it took a couple of battles for this version of Z.K to arrive. The official NattyEBK loss remains unchanged; Episode 23 records the improvement by giving Z.K his first GZone win."]
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
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">Z.K</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>Z.K remains a visual and reference-led writer, but this performance is more opponent-specific than his debut. Instagram reach, CJ&apos;s record, London versus GY, clothes, teeth, and the anticipated photograph all build from material attached either to CJ or to Z.K&apos;s previous GZone experience.</p>
                        <p>His opening uses quick images to resist CJ&apos;s direct aggression. Slipknot, TikTok, Gollum, Foster&apos;s, a cartoon character, Dixy Chicken, Nando&apos;s, Scholes, Gerrard, and Di Canio give the room frequent destinations even when the sound forces repetition.</p>
                        <p>The third is the clearest step forward. The location reversal supplies an argument before darts, Dwayne Carter, farmer, Starmer, tartar, Palmer, and Pollock create sustained movement. Ginge&apos;s interruption that Z.K had finally arrived and was an &ldquo;encyclopedia of jokes&rdquo; is the strongest explicit reaction preserved by the transcript.</p>
                        <p>Control remains imperfect: Z.K needs multiple starts, repeats long passages, and sometimes extends sound chains beyond their clearest meaning. Some severe personal material also competes with the cleaner visual writing. He nevertheless produces the more memorable closing run and wins the official livestream-audience decision.</p>
                      </div>
                    </article>
                    <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ-Zino</h3>
                      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                        <p>CJ performs through direct pressure, grime cadence, and confrontation. His first has the most coherent status argument: fourteen years becomes underachievement, and the view-count comparison gives the claim a measurable finish.</p>
                        <p>&ldquo;Mr Robinson&rdquo;, Liverpool and Suarez, PC Robinson, GY, the gym, tea and mug language, and the Z.K and X material show attempts to tailor the writing beyond general hostility. His record rebuttal also makes the previous 1Flaymr decision part of the current battle.</p>
                        <p>His strongest performance device is the third-round &ldquo;Pow&rdquo; section. Repetition turns a straightforward threat sequence into crowd participation, while the boxing setting makes sparring, gloves, kicks, and punches locally relevant. &ldquo;No more dropping the mic&rdquo; also shows awareness of the live disruption.</p>
                        <p>CJ&apos;s weakness is shape and clarity. Long allegation packages, harsh family and bereavement attacks, mic trouble, and repeated attempts at the final passage interrupt progression. He creates energy and several reactive moments but does not leave as complete a final written sequence as Z.K&apos;s third.</p>
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
                      ["Z.K", [
                        ["Sits in his bedroom smoking bongs while punching walls, listening to Slipknot. Spent his whole life on TikTok; skinny MC will die from a rib shot.", "Slipknot, TikTok, physical build, and a rib shot create an immediate portrait of online aggression that Z.K presents as fragile in person."],
                        ["I checked your Insta: nobody follows you, nobody bothered to watch. When I bother you, you'll be a sorry you.", "Follow, watch, bother, and sorry-you keep the social-media reach attack moving through a simple internal sound chain."],
                        ["Looking like Gollum too ... spun by most of the GZone roster.", "The Lord of the Rings image makes the appearance joke visible before Z.K joins it to CJ's official losing record. Any claim about the margin remains battle rhetoric."],
                        ["Easy for me, 1-0 on the scoreboards.", "Z.K closes the opening section by judging it himself, making the football-influenced scoreboard part of the performance."],
                        ["Never in your life have you been my calibre. Swear you look like a cartoon character.", "Calibre states the status gap while cartoon character converts it immediately into a visual roast."],
                        ["Got a half-volley like Scholes and Gerrard ... now I'm coming like Paolo Di Canio.", "Three famous footballers connect the half-volley threat to CJ's earlier Liverpool and Suarez material. Z.K's mini-football prop makes the claim that he could volley CJ-Zino physically visible to the room."],
                        ["You're Dixy Chicken, not Nando's. You don't rap, you love chilling at pantos.", "A lower-status chicken shop and pantomime reduce CJ's music and image through recognisable British references."],
                        ["These lot are all scared, deleting Facebook. Out with my lyrics and they're whipping out pictures.", "Z.K turns the picture tactic used against him by Natty into an expected part of facing GZone opponents, beginning the prebuttal before CJ's later round."],
                        ["Come to the clash, full kit in my boots, shin pads and the armband too.", "The football clothing turns Z.K's preparation into a complete match-day image rather than a single kick reference."],
                        ["Fully grown bloke but your hair's in a pony ... Primark goods, chinos, Crocs and a rainbow T-shirt.", "Hair and inexpensive clothing create a sustained visual character attack that the audience can recognise without accepting the personal claims around it."],
                        ["Mention the place that I live so much, you'd think that he wanted to be from GY ... Z.K's a five-minute walk from the seaside. I think I know what I'd rather.", "This is the clearest immediate answer of the battle. Z.K takes CJ's location pressure and makes Grimsby a preferable territory rather than an embarrassment."],
                        ["Spent so long throwing darts at your face, won't be surprised if I got a nine-darter. This one I wrote is way off the chart; you look like a crack version of Dwayne Carter.", "Darts, nine-darter, chart, and Dwayne Carter sustain the end sounds while moving through precision, writing, and appearance."],
                        ["Talk about Grimsby and fish ... I'll serve him like fish and tartar for starter.", "The coastal attack is reclaimed through a fish, tartar, and starter food chain, extending rather than abandoning the GY rebuttal."],
                        ["We all know that Darren's a dentist, but we all need your tooth to be checked.", "Natty previously told Z.K that dentist Darren could not save his teeth. Z.K now redirects the same GZone reference toward CJ."],
                        ["I had a feeling you'd come with a photo, so I cloned it. Now watch who you trust.", "The photo tactic that damaged Z.K's debut becomes a prepared counter. The line questions image reliability; it does not independently prove that any picture was genuine or manipulated."]
                      ]],
                      ["CJ-Zino", [
                        ["I'm Mr Robinson. Everybody you spit's diluted. Keep on breathing, GZone's polluted. When I walked in, all your boys saluted.", "The repeated opener uses Robinson, diluted, polluted, and saluted to give CJ an immediately recognisable entrance cadence."],
                        ["I know you're a Liverpool fan ... little man, I'm in my Suarez bag.", "Luis Suarez supplies an opponent-specific football reference before the round moves into kicking and confrontation."],
                        ["I said, K, don't let me find out. You're claiming badness ... fuck around, find out.", "CJ isolates the final letter of Z.K's name and repeats find out to challenge whether the opponent's image survives scrutiny."],
                        ["You've been rapping for fourteen years; I've been rapping for three, and your views ain't banging.", "Longevity is reversed into underachievement: the longer career is presented as a weakness because CJ claims to have reached a larger audience more quickly."],
                        ["Your JDZ got 8K views; my birthday, I had 9K views.", "Specific figures make the wider career comparison concrete. They are claims made in the round and are not independently audited by this page."],
                        ["If I rap like you, that's a punch in the mouth. If I rap like you, man will quit right now.", "Repetition makes imitation sound unacceptable and frames Z.K's approach as beneath CJ's own standard."],
                        ["See a Black man, ask what he sells; PC Robinson fits too well.", "CJ turns Robinson into a police title and uses it inside a serious character accusation. The allegation remains battle material, not a verified fact."],
                        ["Everybody you spat was lie after lie after lies.", "The simple repeated phrase condenses CJ's second-round credibility case into an easy crowd hook."],
                        ["I'm raising a Z.K to carve out Roman numerals ... don't get to the X, bro's gonna need consumables.", "The transcription around the setup is imperfect, but Z.K, Roman numerals, X, and consumables are the clear anchors of an ambitious letter, number, and game-resource sequence."],
                        ["You can't bar with a kid, let alone war with a kid. I need some gloves and I'm sparring a kid.", "Bar, war, and spar connect writing, conflict, and boxing while reducing Z.K to a child inside the Peacock's gym setting."],
                        ["We're in Peacock's gym ... we're raising fighters ... I'll start with a knock.", "CJ uses the actual venue to make the gloves, kick, knock, and fighter language feel local to the room."],
                        ["Click-clack-bang when I ride with the squad; even on my Jack Jones, I'm booming off your back door.", "Jack Jones means being alone, so CJ contrasts arriving with a squad and remaining dangerous without one."],
                        ["No more dropping the mic ... coming like a Lethal B beat: pow. You can get a punch in your teeth: pow.", "CJ absorbs the live mic problem into the setup, then uses the recognisable Pow rhythm as a call-and-response performance close."]
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

            {battle.slug !== 'deeno-vs-tapped24' && battle.slug !== 'nattyebk-vs-zk' && battle.slug !== 'zk-vs-cj-zino' && (
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
                            ["He's going to say that my BM died, and yes she did, so RIP", "Roman pre-empts the most damaging personal angle before Tapped reaches it. Acknowledging the death turns a possible reveal into known information and makes the later repetitions fight against an answer already delivered."],
                            ["Tapped her nerve like closing drawers", "The stage name is folded into a compact physical image: something being tapped is made to close, joining wordplay to Roman's controlling performance."],
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
                            ["Any MC that wants to clash with me on G's, I guarantee they're getting slew", "A GZone-wide warning that frames Ryno as ready for every name in the building."],
                            ["You prance and dance around like a clown for the camera", "One of Ryno's cleanest angles turns 2Mad's social-media visibility into evidence of unserious performance."],
                            ["Homeless jokes, that's the route that you wanna use / Truth is that I don't live with my mam", "Ryno identifies 2MWAD's likely main angle before the reply begins and answers it directly. The preparation is clear even though the denial cannot stop the later visual story."],
                            ["I hate the sound effects that you do, so stop doing them, you nerd", "A direct live-performance critique attacking one of 2Mad's recognisable habits."],
                            ["Pen Zeppelin, lead gets him, and he'll rock and roll on the stairways to heaven", "Ryno's strongest technical scheme connects pen, lead, Led Zeppelin, rock and roll, and Stairway to Heaven."],
                            ["Your bank's in debit, you don't own bedding", "Money and housing instability are compressed into one grounded insult."],
                            ["Roadman Jackson 5", "The famous family group becomes a funny image for a cheap, coordinated street crew."],
                            ["Rape allegation, I knew that you'd use it / I brought the document today to prove it", "Ryno abandons the prepared verse to answer a serious allegation with an NFA document. It is the battle's clearest example of rebuttal becoming physical evidence, without establishing an independent legal conclusion."],
                            ["If you mention my dead dad, that's calm / When was the last time you seen yours?", "Ryno anticipates another family route, accepts the fact of his own bereavement and immediately redirects the absence toward 2MWAD's father."],
                            ["King of this game? You're more like a pawn", "Chess hierarchy makes 2Mad expendable rather than powerful."]
                          ]
                        },
                        {
                          mc: "2Mad",
                          entries: [
                            ["At the end of the night, you might catch this guy in a sleeping bag right next to the pond", "A vivid outdoor-sleeping image turns the general housing claim into a memorable visual."],
                            ["He begs for change by the bank", "The location creates irony: money is inside the bank while Ryno stands outside asking for it."],
                            ["Go apply for a job / Ruff, ruff, you look rough", "Employment advice moves into the bark sound that Ryno criticises elsewhere, joining the financial case to a short appearance punch."],
                            ["This right-wing cunt wants to take back Britain / This little nerd right here is a racist", "2MWAD makes politics and alleged racism central to the second. TymeLess explicitly inherits this accusation in Episode 11, but it remains a battle claim rather than a verified label."],
                            ["Your furniture gets took by the bailiff", "Debt and financial instability become a strong grounded image of possessions being removed."],
                            ["She says no, he perceived it as yes", "A grave allegation is compressed into a consent contrast. Its performance consequence is Ryno's immediate document rebuttal; the claim itself is not independently verified here."],
                            ["You're a sheep, no leader, you're not someone to rely on", "Ryno's dominant self-image is reversed into follower status and personal unreliability in one linked character attack."],
                            ["It's the GZone traveller, 3-0 massacre", "2Mad brands himself as the visiting battler who believes he has taken every round."],
                            ["When you go bananas, things get pear-shaped", "Two familiar fruit idioms connect losing control with a situation going badly wrong."],
                            ["You're in KFC begging for spare change", "The final round relocates the opening money image to a familiar public setting, keeping the housing narrative active through a new visual."]
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
                            ["Dragon Ball Z", "Anime fighting imagery gives the attack a recognisable powered-up combat visual."],
                            ["I don't smoke that flower pot, but now I'm Bill and Ben", "The children's television flowerpot characters lead into Deluxx's pen-killing line, giving the second round a connected reference rather than an isolated name-drop."]
                          ]
                        },
                        {
                          mc: "BTizz",
                          entries: [
                            ["When I shut down, something like Skepta", "Skepta's famous grime track supplies a strong UK-music reference for taking control of the room."],
                            ["How you gonna say you're Jamaican? Faking", "BTizz's main authenticity angle argues that Deluxx's public identity is performed rather than genuine."],
                            ["You can't run any Asian jokes", "BTizz blocks a potential angle in advance and turns the expected criticism back onto Deluxx."],
                            ["Left to the right, and you got the ring shaking", "Deluxx's live movement is turned into an immediate physical roast that the room can visualise."],
                            ["B to the I to the Z-Z", "A repeated identity stamp that helps BTizz control the crowd and keep his name memorable."],
                            ["This is clash, not slaughter", "BTizz frames the contest as so one-sided that it no longer resembles a fair battle."],
                            ["Please go get your water", "A visible stamina and composure attack suggesting Deluxx is struggling to keep pace."],
                            ["0121, king of the mic", "Birmingham's area code connects local pride with BTizz's claim to microphone dominance."],
                            ["Your bars were written by London Mikez", "One of the strongest battle-specific shots because it directly questions Deluxx's authorship and pen."],
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
                            ["3-0 straight like a Trident", "A Trident has three points, creating a clean visual for winning all three rounds."],
                            ["Got robbed for a vape and a Croc", "A street-status humiliation angle claiming Proty lost small, embarrassing possessions."],
                            ["Same old rhymes, same old grime, same old pain", "Repetition is used to portray Proty's writing and style as stale and unchanged."],
                            ["You think you're good cause you rap on the TikTok ting", "An online-versus-live credibility angle suggesting TikTok visibility does not equal ring ability."],
                            ["Up, down, left, right, square, triangle", "Controller-button language turns Renzo's movements and attacks into a recognisable cheat-code combo."],
                            ["Renzo, where the gal get friendzone", "His cleanest self-branding line flips Renzo into friendzone for a memorable name punch."],
                            ["I came from town, 0121", "The Birmingham area code gives Renzo a clear local identity and regional pride."],
                            ["You look like Stephen Hawking if Stephen Hawking was walking and talking", "An ableist appearance comparison using the famous scientist as disability-based disrespect."]
                          ]
                        },
                        {
                          mc: "Proty",
                          entries: [
                            ["What the fuck is UK Cali? / Grown in UK, blood, it's not Cali", "Proty exposes UK Cali as fake premium branding because genuine Cali refers to cannabis from California."],
                            ["Lyrically shuffle like Muhammad Ali", "Muhammad Ali's footwork and rhythm become a metaphor for moving around Renzo in the battle ring."],
                            ["Orange hair, coming like Tails", "The orange fox from Sonic the Hedgehog supplies a clear appearance comparison."],
                            ["You sound like you're sleeping when you rap / Are you spitting or having a nap?", "A connected performance angle attacking Renzo's delivery as sleepy and flat."],
                            ["How did you end up with less likes than followers?", "Weak social engagement becomes evidence that Renzo's public support may be inflated or inactive."],
                            ["You went OT, then spent all your profit on sniff", "A real-world money angle claims Renzo wasted out-of-town earnings on cocaine."],
                            ["Like Rizla, man's head get twist", "Twisting rolling paper becomes a threat to twist Renzo's head."],
                            ["You're not Pennywise, but I know you're a clown / You're not wise with a penny", "The It villain's name connects a clown insult to Renzo's alleged poor money management."],
                            ["Got your shoes on credit, pre-paid clothes", "A financial and image attack claiming Renzo's outfit is low-status and not properly owned."],
                            ["She's one years old", "Proty's immediate response reveals the age of the sister Renzo has just referenced. The short factual correction collapses the preceding boast and becomes the battle's clearest live rebuttal."]
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
                            ["I brought you a dead man walking / One man's done with a verbal warning", "Doomed-opponent language joins a numbered disciplinary sequence, making CJ's debut sound like the punishment following an earlier warning."],
                            ["Fly like a butterfly, sting like a bee", "Muhammad Ali's famous boxing phrase places CJ in fight mode inside the GZone ring."],
                            ["Let me get grimey again", "CJ switches into grime mode and uses the genre as a marker of darker, harder credibility."],
                            ["Dad told you to become a doctor and you're just spreading your germs", "A clean concept contrasting a doctor's duty to treat illness with Proty allegedly spreading it."],
                            ["You think you won? Must have lost it", "CJ uses controversy around Proty's previous battle to portray him as delusional."],
                            ["I've got the bars and you've got the flu", "A simple contrast linking CJ's rap ability to the wider illness and hygiene angle."],
                            ["We know you're a pred. I ain't your prey", "An extreme predator-and-prey character shot that reverses the intended power dynamic."],
                            ["Google Chromecast and then my Roku", "Streaming-device references begin a tech scheme about controlling formats and screens."],
                            ["Fuck your Chromecast, I'm a Fire Stick", "Fire Stick completes the device scheme while fire also means lyrical heat."],
                            ["I bust your Chrome and bust your lip", "Chrome moves from browser or device language into metal and physical-impact imagery, completing CJ's strongest connected scheme."]
                          ]
                        },
                        {
                          mc: "Proty",
                          entries: [
                            ["What's this Disney character trying to be? / Designed by Pixar", "Proty immediately turns CJ's dark image into an exaggerated cartoon appearance."],
                            ["I'm a king, fur on my head like a mane", "A lion's mane supplies self-branding around dominance and status."],
                            ["CJ when he's got Remy in his hat", "Ratatouille's Remy controls Linguini from beneath his hat, making CJ look controlled and cartoonish."],
                            ["His head shape is a Tic Tac", "The small oval sweet becomes an instantly recognisable head-shape comparison."],
                            ["Rat from Flushed Away doing MDMA", "An animated-rat comparison combines CJ's appearance with the repeated drug-use angle."],
                            ["Quick replay, 3-0, then I watch CJ", "Battle-scoring language lets Proty claim a clear round sweep."],
                            ["When he breathes, the room gets polluted", "A strong hygiene punch exaggerating CJ's breath into environmental damage."],
                            ["Bacteria on his face argues about which one will spread and survive", "Proty's most creative hygiene image personifies bacteria competing across CJ's face."],
                            ["If CJ wins, that is the wrong decision", "Proty makes the eventual verdict part of the round before it is called. The official archive supports the winner prediction without proving the claimed 3-0 score."],
                            ["Linguini with a bit of melanin / You ain't got a car, I saw you pedalling / I'll get two wheels so I can level him", "Ratatouille appearance writing develops into transport wordplay: pedalling implies both a bicycle and selling, while two wheels become the tool for drawing level."]
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
                            ["Blue waffle", "An internet shock reference used as a sexual-health insult. Its purpose is disgust rather than intricate writing, so it is best understood as shock material."],
                            ["Ugly, period / Stop that period / It's not that period", "Tapped develops 'period' through finality, menstruation and a school lesson. The route is crude, but the repeated word changes function across the sequence rather than remaining one visual insult."],
                            ["I'm Tapped24, not anyone / I could call war with anyone", "The repeated 'anyone' sound turns his stage name into a status claim: Tapped is presented as a singular battler ready to take any booking."],
                            ["I'm a vet, remember you're new in it / This is GZone, what are you doing in it?", "Tapped makes experience the closing standard and tries to transform AJNA's debut status into proof that she does not belong. Her official win ultimately reverses the argument."]
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
                            ["You look like a pedo", "This is a severe reputation attack rather than technical wordplay. It should be understood as an extreme character insult, not a factual claim."],
                            ["Set some levels / Breville / medal / champagne showers / flowers / powers / hours", "AJ's third begins from 'levels' and runs through a long linked rhyme pocket. The Breville appliance and champagne-shower images are less important than the cadence holding several threats together."],
                            ["Laying hands on your chick isn't the right way to go / Swing hands with a bloke, then watch as you choke", "AJ joins the alleged violence-toward-women route to the literal boxing-ring setting, challenging Tapped to direct his toughness toward an adult male opponent."],
                            ["I'm dark and I'm cold / I've cut out my own damn soul", "A compact self-character statement explaining why Tapped's graphic attacks have not changed her delivery. The cold and soulless image turns emotional resistance into identity."]
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
                            ["Big tip, fat brick, no drip, dead trim, shit bars, can't spit", "The debut starts as a clipped catalogue. Size, clothing, haircut and ability are reduced to short internal sounds so the room understands the target before any longer setup."],
                            ["Trying to clash Prince? / I came here to put Ferg in a body bag", "Prince makes the royal stage name the source of status, then using Ferg makes the threat personal. Roman's response is to seize that same royal vocabulary."],
                            ["My pen is precise / Loading it up and letting it fly / Send him to sleep with a left and a right", "Pen writing changes into a loaded weapon and then boxing hands. The progression joins lyrical and physical danger instead of treating them as separate boasts."],
                            ["A GOAT to a GOAT is a sacrifice", "PR1NC3 does not need to deny Roman greatness. A goat can literally be sacrificed, so equal status becomes the reason Roman can be offered up rather than protected."],
                            ["I know that I'm clashing a vet / This old prick's getting murdered", "The direct age framing defines PR1NC3's side of the matchup: youth presents itself as current force while veteran status is recast as decline."],
                            ["If Roman keeps talking, grab my mask and gloves and go on a glide", "The opponent's name begins the conditional threat, while mask, gloves and glide use UK street vocabulary to turn battle talk into a planned movement."],
                            ["You are a goldfish / You're in a fish tank while I'm in the ocean", "Roman is small and contained; PR1NC3 is placed in a far larger environment. The repeated water scale makes this Prince's cleanest status comparison."],
                            ["I just forgot all my bars—psych, I bet you thought I was joking", "A deliberate fake choke creates a second of uncertainty before revealing control. It contrasts with the battle's genuine microphone stops and requested restart."],
                            ["I'm sending shots like a free throw / My angles weigh like kilos", "A free throw is an uncontested basketball attempt, while angles move from battle strategy into measurable weight. Both lines claim his attacks are clean and heavy."],
                            ["Prince on the beat, remember my name / That's PR1NC3 to the three", "The third-round flow switch pauses for explicit branding. The numeral in the stage name becomes something the audience is taught to repeat, even though Roman later removes it with Mason."]
                          ]
                        },
                        {
                          mc: "Roman",
                          entries: [
                            ["Princess, listen / I'm a real don", "Adding an ending to Prince removes the authority of the royal name. Real don then supplies Roman's replacement hierarchy before the more detailed royal scheme arrives."],
                            ["I've been doing these things since '06", "Roman accepts the experience gap and makes it evidence of longevity. PR1NC3 calls him old; Roman argues that the same timeline proves veteran authority."],
                            ["Royal bars, upper class / Buckingham Palace", "Roman appropriates the opponent's defining theme. Prince should own royalty, but Roman is the battler who supplies palace, class and royal-bar language."],
                            ["My right hand is Big John Prescott", "The former UK deputy prime minister famously punched a protester. Roman uses a recognisably British political image to name the power of one hand."],
                            ["It's written in the stars—the Times New Roman", "Times New Roman is a typeface, so Roman's name becomes evidence of writing. Written and typeface make the identity itself part of the pen claim."],
                            ["Your shins are enormous / Take his knees out, he still wouldn't fall in half", "The height roast uses impossible cartoon anatomy: even removing the middle of Prince's long legs would not reduce him to ordinary size."],
                            ["Your girl bunks off school / Your girl thinks gel pens are cool", "School absence and gel pens extend the youth angle from PR1NC3 to his partner. The stationery image is simple enough to puncture the royal presentation immediately."],
                            ["He was born 2001 / Battles he lost: 2001", "One number performs two jobs: documented birth year and an absurd loss tally. It is Roman's most concise final-round conversion of personal information into a punch."],
                            ["Go dance to your songs, my G / Battle rap ain't really for you", "PR1NC3's musical flow becomes evidence against him. Roman separates recording and dance performance from opponent-specific battle writing."],
                            ["Mason, you're done now / Ink man, call me toner / I'm top dog and this is my wing", "Mason removes the crown, toner revives the Times New Roman printing surface, and wing turns the venue into a prison territory Roman controls. The final gathers identity, writing and status."]
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
                            ["I'm about to hit him with a PowerPoint to Excel / I guess I'm good with words", "PowerPoint, Excel and words form a Microsoft Office chain, with Word implied by the writing boast. It briefly turns Mikez's aggression into a clear pen-focused scheme."],
                            ["If everyone's a GOAT, you need a shepherd to control the herd", "GOAT is the greatest-of-all-time acronym, but literal goats form a herd. Mikez places himself above competing status claims as the person controlling them."],
                            ["You can't battle like a Roman / The only Roman on this stage is Fergs", "Roman is both an ancient identity and the battler who won Episode 2. Mikez points to the host on stage to make the previous episode's name part of a live comparison."],
                            ["I hope you wake up to a sanction on your Universal Credit", "A benefits sanction is a specific loss of income. The grounded administrative consequence gives the poverty attack more precision than a general claim that Deluxx is broke."],
                            ["I'm doing gigs to pay my landlord / I ain't never lived in Peckham", "Mikez uses his own work and rent obligations as a credibility contrast. Peckham prepares the Beckham, decking and connecting sounds that follow."],
                            ["I was trying to sort the Wi-Fi / Me and your mum started connecting", "Connecting describes both establishing internet service and forming a personal relationship. The technology double meaning completes the longer Peckham and Beckham sound run."],
                            ["Your name's Devonte, not Deluxx / Your body's shaped like a thumb", "The personal name removes the premium connotations of Deluxx, then the thumb comparison creates an immediate visual roast."],
                            ["Power punch like Supercell / Thought you were Superman, I'll make you fly like Tinkerbell", "Supercell develops power into the creator of mobile games, then Superman and Tinkerbell share flight while representing a deliberate downgrade from hero to fairy."],
                            ["I inspired this kid to rap / I'm the one that made you", "Mikez claims creative seniority rather than only winning the room. BTizz later evolves that claim into an unverified allegation that Mikez actually wrote Deluxx's bars."],
                            ["Take this L, hope you learn / You ain't no G, you're a germ / You ain't no snake, you're a worm", "A sequence of short reversals connects turn, earn and learn to G and germ, then snake and worm. Each step reduces Deluxx's claimed threat into something smaller."]
                          ]
                        },
                        {
                          mc: "Deluxx",
                          entries: [
                            ["Say that you're London Mikez / You're from London, I'm king of the mic", "Deluxx breaks the opponent's stage name into location and function. Mikez may represent London, but Deluxx claims authority over the actual microphone."],
                            ["0121 / I'll sever your head—like, how many times?", "The Birmingham area code supplies local identity inside the repeated hook. The second phrase turns repetition itself into a challenge about how often Mikez needs to be cut down."],
                            ["You've been an artist, bro / Can't sing", "Mikez presents himself as a recording artist as well as a battler. Deluxx attacks that wider identity by denying the basic skill on which it depends."],
                            ["Back to the trap, don't wanna hear chat / All my life, I know you're capping", "Trap and chat establish street credibility as the standard, while capping accuses Mikez's performance of being fictional."],
                            ["Just like a DVD", "The surrounding passage uses spinning and wheeling language. A DVD provides the physical rotation image while a wheel-up is also a live performance restart."],
                            ["Mikez, your album's scamming people", "A blunt music-value accusation claiming listeners do not receive what Mikez's artist branding promises. It remains an opponent's claim rather than a verified account of the album."],
                            ["Top charter, you're a bad barber / Look like a barber, need me a barber", "Charting and barber sounds create momentum across music status, appearance and grooming. The phrasing is loose, but the repeated sound holds the pocket together."],
                            ["That flow's like Renzo / I know I'm a veteran", "Renzo is named before his Episode 6 official debut. Deluxx uses the comparison to challenge Mikez's originality while presenting his own experience as the contrast."],
                            ["I was DFN / Now I'm Deluxx", "Deluxx states the rebrand directly. It is important archive context because later opponents question whether the Deluxx identity and writing genuinely belong to him."],
                            ["Not Aquaman, but I'm king of Atlantis / Move like Lockjaw", "Aquaman and Atlantis create a water-and-ruler image, while Lockjaw changes the route into restricted speech and movement. The references show Deluxx's preference for quick cultural flashes over a long case."]
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
                            ["Why you raising the next man's kids, trying to act like that ain't lame?", "The opening question establishes the household-role angle before the gaming metaphors begin. It is a battle accusation about Mikez's family situation, not an independently verified account."],
                            ["Doing the missions while he gets the XP / Baby dad lives in your head rent-free", "Missions normally earn the player experience points. 2MWAD says Mikez performs the work while the biological father receives the value and remains psychologically present."],
                            ["The side quest is the main / You're the DLC", "A side quest is secondary and DLC is additional content. Reversing side quest and main story makes Mikez's alleged supporting role the defining problem of his life."],
                            ["You play in people's lives like an NPC / Work for an ex-man's legacy", "An NPC occupies somebody else's playable world. The following legacy line explains the metaphor: Mikez is said to maintain a story belonging to a previous partner."],
                            ["Your girlfriend's got two controllers and you're not player one", "The scheme's payoff turns the family into a two-controller game and denies Mikez primary status. Player-one language gathers the earlier XP, side-quest, DLC and NPC references into one conclusion."],
                            ["You and your mum both picked up mics when you shouldn't have", "Picked up Mikez and picked up mics share the same sound. The mother-and-birth setup allows 2MWAD to turn the battler's name into a performance criticism."],
                            ["Today you're getting sent right back like Bellerín", "Héctor Bellerín played at right-back. Being sent straight back becomes a football-position punch about removing Mikez from the stage."],
                            ["You had a whole year to write that", "A direct preparation attack that keeps the pre-round old-bars argument active. Rather than answering only a punch, 2MWAD questions how much new work Mikez produced with extended time."],
                            ["Ugly, fugly, bummy, scummy, crusty, musty, dusty, rusty", "The long adjective chain prioritises cadence over complexity. Repeated internal sounds make a basic appearance attack memorable enough to reset the final round."],
                            ["Look into your online banking—you can't even afford a McFlurry", "The low-cost dessert gives the poverty claim an everyday scale. It is more immediately visible than a general broke insult, although it remains exaggerated battle material."]
                          ]
                        },
                        {
                          mc: "LDN Mikez",
                          entries: [
                            ["I'm getting two W's like 2MWAD / Different kind of Warzone—send him to the Gulag", "Two W's flips the opponent's name and predicts consecutive official victories after Deluxx. Warzone and Gulag then answer the gaming language used immediately before Mikez's turn."],
                            ["Your name's Lance Pennant / Put you on the ropes like Apollo Creed", "Using the alleged real name removes the stage persona, while Apollo Creed turns the clash into a boxing contest. Ryno later reuses Lance throughout Episode 8."],
                            ["I told you I'm the plug already / I won't stop until we're in sync", "Plug can describe a connection or supplier, while in sync means coordinated. The phrase also prepares the later NSYNC and Justin Timberlake reference."],
                            ["Everybody's on a wave, so it's only right I make your ship sink", "Wave changes from popular momentum into literal water. Mikez extends the image to a ship so he can turn an opponent's rise into destruction."],
                            ["In this academy you're set five / Fail a history test, 'cause I just made him extinct", "Set five suggests a low school grouping; history and extinct then move the opponent from poor academic status into something that only exists in the past."],
                            ["Extinct, your balaclava stinks like Miss Inks / I feel it in my instincts / Get Justin like he's NSYNC", "A long chain carries the repeated ink and sync sounds through extinction, smell, instinct, an apparent name reference and Justin Timberlake's former group. The technique values phonetic momentum over one isolated punch."],
                            ["You said you don't know my songs, but you got me as your ringtone", "Mikez frames public dismissal as secret fandom. The ringtone makes the alleged contradiction concrete and supports his identity as a performer as well as a battler."],
                            ["Send you to the Undertaker / Family in shock / This ain't WrestleMania / Your mother spent her money on The Rock", "Undertaker, WrestleMania and The Rock form a WWE sequence, while rock also carries a serious drug allegation. The analysis preserves that accusation only as battle material."],
                            ["I'm from the East End, so I keep it Frank / Send you to your Butcher early", "East End leads into EastEnders, and Frank Butcher supplies both a character name and the ordinary meaning of someone who cuts meat. It opens Mikez's final connected scheme."],
                            ["Dying over a Ben, she's the new Heather / New Era / Where's Tracy? / Take the mic like Shirley / Drag her down, Bianca", "Ben, Heather, Tracy, Shirley and Bianca continue the EastEnders cast list, while New Era sounds like a new era and a cap brand. The breadth of the chain makes this Mikez's most organised closer."]
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
                "Tapped24 established relentless pressure and the character later recognised as Mr Disrespectful. Medical, appearance, family, food, scene-history and Pen Game attacks made the battle immediately hostile, but repeated technical stops and extreme density weakened clarity.",
                "Deeno built the clearer complete case. Broken friendship and comments about his children supplied motive; the screenshot made alleged messages visible; cap 24 and related name flips structured the second; parenting, pressure, child support and council tax returned in the final.",
                "The close checks the blue corner for Tapped24 and then the red corner, but transcript text cannot compare their volume and does not preserve the red battler's spoken name. The official GZone archive awards Deeno the opening Season 1 win.",
                "The result creates the season's longest continuities: Tapped later says his own screenshot tactic is doing a Deeno, Deeno develops fatherhood into platform authority and adoption papers, Crohn's becomes TymeLess material, and the GZone house claim grows across later clashes."
              ]],
              ["pr1nc3-vs-roman", [
                "PR1NC3 brought direct grime pressure, youth and the cleaner isolated status comparison. The GOAT sacrifice, fish tank versus ocean, fake choke, free throw and explicit PR1NC3 branding made his best moments immediately readable.",
                "Roman produced the more opponent-specific complete performance. Princess, royal bars, Buckingham Palace, Times New Roman, the height scheme, gel pens, Mason, 2001 and toner repeatedly turned Prince's own name, age, build and music identity into material.",
                "The first-round panel calls the contest close and says one nil without a reliably identified beneficiary. The final video checks both corners but transcript text cannot measure their volume; the official GZone archive awards Roman the win.",
                "The result begins Roman's later résumé against Tapped24 and Ryno. PR1NC3 returns against NattyEBK needing redemption, while Ryno eventually quotes Roman's toughest-warriors boast and attacks the value of a record built first on Prince."
              ]],
              ["ldn-mikez-vs-deluxx", [
                "Mikez delivered the clearer written architecture. Microsoft Office, GOAT and shepherd, benefits, Wi-Fi, the Devonte name attack, Supercell, the connected third-round rhyme pockets and stronger projection gave the room identifiable destinations through repeated technical stops.",
                "Deluxx established a recognisable cadence and local identity through the London-versus-king-of-the-mic refrain and 0121. Music criticism, Renzo comparisons, DFN-to-Deluxx branding, Aquaman, Atlantis and Lockjaw showed ideas, but too many words disappeared when the delivery accelerated.",
                "The on-camera breakdown explicitly gives Mikez the first round. At the close, the host asks who won, treats the response as obvious and calls for noise for London Mikez; the official GZone record confirms LDN Mikez as the winner.",
                "The result becomes Mikez's first W before his two-W prediction against 2MWAD. Deluxx later acknowledges losing to a veteran against BTizz, while BTizz converts Mikez's 'I made you' status claim into an unverified ghostwriting allegation."
              ]],
              ["ldn-mikez-vs-2mwad", [
                "2MWAD produced the battle's clearest single concept. Missions, XP, side quests, DLC, NPCs, DNA, two controllers and player one turned the alleged step-parenting situation into a complete gaming narrative rather than a list of unrelated personals.",
                "Mikez built the broader three-round performance. Two W's, Warzone, the Gulag and Lance Pennant gave the first opponent-specific direction; sync, ships, extinct, instincts and NSYNC linked the second; the correctly attributed EastEnders scheme gave the final a recognisable closing frame.",
                "The first audience comparison was close enough for the host to call the response the same and repeat it. The second check ended with the clear statement that it was 'all Mikez,' and the official GZone record also awards LDN Mikez the win.",
                "The decision completes Mikez's prediction of consecutive wins after Deluxx. 2MWAD later recovers by beating Ryno in Episode 8, while Mikez remains present in Episode 7 when BTizz alleges that he wrote Deluxx's material."
              ]],
              ["tapped24-vs-ajna", [
                "Tapped24 brought the broader visual and pop-culture attack, using his established Mr Disrespectful style to test whether GZone's first woman battler could withstand the same pressure as every other opponent.",
                "AJNA matched the hostility and produced the clearer repeatable structures through bad-man phrasing, counted drug lines, Georgie Porgie and the final levels sequence.",
                "The initial room response was close and some commentators personally preferred Tapped, but they acknowledged that the crowd leaned AJ; the live comments also repeatedly chose AJNA. The host announced AJNA as the winner and the official record agrees.",
                "Grams later uses the loss against Tapped in Episode 15, while Tapped disputes it by saying GZone made him lose. Georgie also evolves from AJNA's live second-round target into a major Grams angle."
              ]],
              ["ryno-vs-tymeless", [
                "Ryno produced the denser opponent-specific writing through William, clocks, time travel, timelines, timestamps and the live recording-time-of-death payoff.",
                "TymeLess built the larger three-round case from Ryno's Episode 8 history, live rebuttals, family and credibility pressure, then closed with a multi-object housing and hygiene sequence.",
                "The room vote and official Season 1 record award TymeLess the win. Ryno's property keys answer the homelessness claim directly, but they do not replace the closing image created by TymeLess's photograph, ashes and household supplies.",
                "The material continues through the season: Roman inherits Leicester, housing and NFA pressure against Ryno, while Deeno inherits William, time and parenting routes against TymeLess."
              ]],
              ["deeno-vs-tymeless", [
                "Deeno made the clash competitive through home-platform confidence, tailored time flips, gaming references, and status pressure. The Big Smoke / CJ scheme, no-replay concept, William flip, and Thriller attack were his clearest technical peaks.",
                "TymeLess produced the more complete three-round identity. The toilet and throne scheme established an opening narrative, while the lemon props, silver-fox contrast, ginger-reference run, and visual comedy created the battle's most memorable recurring moments.",
                "The deciding difference was room control. Deeno projected authority, but TymeLess controlled timing, callbacks, reloads, props, and audience involvement more consistently. His material was easier for the room to follow and each repeated theme gained impact as the battle progressed.",
                "The final crowd call went to TymeLess. Deeno defended his GZone position with strong individual ideas, but TymeLess connected those ideas into the larger performance and earned the official win through structure, reaction, and main-event presence."
              ]],
              ["pr1nc3-vs-nattyebk", [
                "NattyEBK made his debut through sustained emotional pressure, using family, bereavement, money, status and physical-threat material to control the battle's tone from the opening minute.",
                "PR1NC3 anticipated several personal routes, built a coherent liar-and-snitch response and created the clash's clearest visual sequence with Listerine, soap and salt.",
                "The closing transcript does not clearly label both crowd calls, but the official Season 1 record awards NattyEBK the win. The previous page claim that PR1NC3 was clearly favoured was incorrect.",
                "Natty later calls Prince his first body against Z.K, while the host uses the aftermath to announce that future events will move from room-only decisions toward celebrity judges."
              ]],
              ["nattyebk-vs-zk", [
                "NattyEBK made the battle part of a continuing run, naming his official win over PR1NC3 in the opening and returning to it with 'just killed Prince, now Z.K's next' in the third.",
                "Z.K produced the cleaner debut writing. Mickey Mouse, BBK, CCJs, Grimsby, grime, gaming, football, technology, and hygiene created a researched portrait, while round two gave him the clearest technical passage of the clash.",
                "Natty created the larger moments through direct confrontation, the screenshot and photograph, the Z.K weapon flip, twins, the throne claim, a stronger flow change, and the Prince-to-Z.K progression. Those elements gave his third round the more decisive shape.",
                "The crowd call and official archive record award NattyEBK the win, 2-1. Z.K's clarity kept the contest competitive, but Natty's escalation, physical evidence, room command, and stronger close carried the result."
              ]],
              ["zk-vs-cj-zino", [
                "CJ-Zino built his strongest case through direct pressure: Mr Robinson, Liverpool and Suarez, fourteen years versus three, view counts, PC Robinson, GY, and the Peacock's boxing setting all aimed to make Z.K's experience look unproductive.",
                "Z.K answered with the clearer visual writing and a more opponent-specific record attack. Instagram, Gollum, football, CJ's previous results, clothing, London versus GY, teeth, and the photograph tactic turned his second GZone appearance into a progression from the Natty clash.",
                "The decisive stretch was Z.K's third. He reversed CJ's level and location claims, sustained the darts, Carter, Starmer, tartar, Palmer, and Pollock run, redirected Darren the dentist, and closed with the prepared photo-clone counter. CJ's Pow sequence kept the room involved but repeated restarts weakened its shape.",
                "Ginge checked the room, then deferred the close decision to the live YouTube audience. YouTube selected Z.K, and the official GZone record confirms the result. No judge panel or round score is given, so the battle is recorded as an audience win without inventing a margin."
              ]],
              ["deeno-vs-btizz", [
                "Btizz made the clash competitive through flow changes, record rebuttals, TymeLess callbacks and deliberate mirroring of Deeno's cadence. His résumé defence and use of Deeno's previous loss stopped the clash becoming a simple veteran-versus-challenger story.",
                "Deeno built the larger opponent-specific case through Btizz's record, clothing and originality callbacks, father-and-son framing, the Google Maps screenshot, the photograph of a headstone inscribed with 'Btizz' and the adoption papers used to say he would father his opponent.",
                "The first audience comparison was close enough to repeat. The official GZone archive awards Deeno the win after the stronger third-round prop sequence and the more complete conversion of between-round banter into a structured fatherhood narrative.",
                "The result also closes several season threads: TymeLess's lemons and Simon Pegg material are inherited, CJ-Zino and Deluxx's originality criticism is revisited, and the father-figure posture Deeno developed across earlier clashes reaches its physical adoption-paper payoff."
              ]],
              ["btizz-vs-cj-zino", [
                "BTizz entered from an Episode 7 victory and attacked CJ-Zino's earlier loss, using the MVP chant and repeated 3-0 prediction to create the louder immediate hooks.",
                "CJ gave the clash the clearer opponent-specific spine. Calling to Tapped24 while accusing BTizz of stealing his flow, then reinforcing hygiene pressure with Listerine, made originality and credibility the deciding narrative.",
                "The crowd call visibly favoured CJ-Zino and the official Season 1 record awards him the win. The verdict also reverses BTizz's repeated promise that CJ would be beaten 3-0.",
                "CJ used the decision to call for PR1NC3. The post-battle OneFlaymr fire talk then opens a separate thread that runs through BTizz vs OneFlaymr in Episode 16 and CJ-Zino vs OneFlaymr in Episode 19."
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
                "The closing crowd response and official GZone record awarded Btizz the win, his second after beating Deluxx and losing to CJ-Zino. Fully extinguished became the result's shorthand and later the central inherited phrase in 1Flaymr versus CJ-Zino."
              ]],
              ["2mwad-vs-ryno", [
                "Ryno produced the cleaner isolated technical peaks. Pen Zeppelin and Stairway to Heaven, pawn and checkmate, the pond freestyle and the dead-father reversal show prepared wordplay and live response operating in the same performance.",
                "2MWAD built the more complete three-round narrative. Housing, money, hygiene, bailiffs, employment, politics and public image repeatedly returned to one argument about whether Ryno's forceful stage identity matched his life outside the clash.",
                "Ryno's NFA document directly answered a serious allegation raised by 2MWAD and became the battle's central prop moment. The page documents how both sides used the allegation and legal wording in performance; it does not independently verify either interpretation.",
                "The official GZone archive awards 2MWAD the win, his first recorded victory after losing to LDN Mikez. Ryno's loss did not close the story: homelessness, racism and NFA language all became inherited material in his later battles with TymeLess and Roman."
              ]],
              ["deluxx-vs-btizz", [
                "Deluxx treated his loss to LDN Mikez as experience and produced his strongest writing through battle-scar, Bill and Ben, Barbie and Ken, pen, crossbar and ghost language. His late recovery was strongest when it stayed on craft rather than general shock material.",
                "BTizz established a complete debut identity through Skepta, Jamaican and Asian authenticity tests, clipped B sounds, crowd repetition and 0121 Birmingham branding. Those devices gave the first two rounds clearer destinations and stronger room control.",
                "The central dispute concerned ownership: Deluxx linked BTizz's style to Tapped24, while BTizz alleged that London Mikez wrote Deluxx's bars. Neither claim is independently established here, but both become important archive material for later clashes.",
                "The commentary table awarded BTizz rounds one and two and Deluxx round three, producing a 2–1 decision. The official GZone record agrees, giving BTizz a debut win that he later uses as status against CJ-Zino."
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
                "Renzo produced the stronger live performance identity through pace, movement, grime pressure, 0121 Birmingham branding, controller-button language and the Renzo/friend-zone sound that later becomes reusable league material.",
                "Proty supplied cleaner isolated jokes and the more consistent lifestyle portrait. UK Cali, Tails, likes and followers, lost profit, Rizla, Pennywise and prepaid clothes join intoxication, money and public image across the three rounds.",
                "Proty's immediate revelation about his one-year-old sister is the battle's clearest live rebuttal, turning Renzo's preceding boast against him. Mid-battle commentary also split between Renzo leading 2-0 and the score being 1-1, confirming how close the style comparison felt.",
                "The final crowd call and host announcement awarded the clash to Renzo, and the official GZone record agrees. Renzo's connected identity and room momentum outweighed Proty's cleaner individual punches over the complete battle."
              ]],
              ["cj-zino-vs-proty", [
                "CJ-Zino established the grime identity that defines his later Season 1 run. The numbered warning, territorial second and Chromecast, Roku, Fire Stick and Chrome scheme gave the debut aggression and a strong technical close.",
                "Proty produced the more repeatable complete performance. Pixar, Ratatouille, Tic Tac, Flushed Away, the quick-replay 3-0 hook, polluted breath and competing bacteria turned CJ into one consistent cartoon and hygiene portrait.",
                "The crowd procedure was repeated and transcript text cannot reliably compare the volume of each call. The closing announcement appears to name Proty, and the official GZone archive records Proty as the winner; the page follows that record without inventing a precise margin.",
                "The result creates two immediate storylines: Proty enters the Renzo clash with an official win, while CJ's loss becomes BTizz's status argument in Episode 13 before CJ reverses his momentum through a recorded victory of his own."
              ]],
              ["tapped24-vs-roman", [
                "Roman established the battle's strategic frame by going first, maintaining close physical pressure and prebutting the deceased-partner angle before Tapped24 could present it as new information.",
                "Tapped24 produced the denser reference writing and several of the clash's most immediate punches. His mirrored screenshot and explicit done-a-Deeno callback also show him turning a tactic used against him in Episode 1 into part of his own approach.",
                "Roman's printed messages, Tapped's answering screenshot and the long personal exchanges remain allegations and performance material rather than independently verified evidence. Their importance to the decision is how they structured reaction inside the room.",
                "The audience was checked repeatedly because both battlers drew support. Roman received the stronger final call, was announced as the winner on camera, and is awarded the win in the official GZone record."
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
                {slug === 'zk-vs-cj-zino' || slug === 'nattyebk-vs-zk' || slug === 'cj-zino-vs-1flaymr' || slug === 'ryno-vs-roman' || slug === 'deeno-vs-badee-harz' || slug === 'btizz-vs-1flaymr' || slug === 'tapped24-vs-grams' || slug === 'deeno-vs-grams' || slug === 'btizz-vs-cj-zino' || slug === 'pr1nc3-vs-nattyebk' || slug === 'ryno-vs-tymeless' || slug === 'tapped24-vs-ajna' || slug === 'tapped24-vs-roman' || slug === '2mwad-vs-ryno' || slug === 'deluxx-vs-btizz' || slug === 'renzo-vs-proty' || slug === 'cj-zino-vs-proty' || slug === 'ldn-mikez-vs-2mwad' || slug === 'ldn-mikez-vs-deluxx' || slug === 'pr1nc3-vs-roman' || slug === 'deeno-vs-tapped24' || slug === 'deeno-vs-tymeless' || slug === 'deeno-vs-btizz' ? (
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
                      ["Immediate grudge framing", "Violent pen and the blunt rejection of Deeno remove any friendly interpretation before the private history is explained."],
                      ["Medical and appearance exposure", "Hair loss, Crohn's, weight and food use known or visible traits for shock; TymeLess later develops the illness surface into a complete concept."],
                      ["Crowd-hook repetition", "Who ate all the pies gives the body angle a chant, while the third-round fast-food list returns to it as a callback."],
                      ["Connected cannabis pocket", "Smoking Deeno, California, breaking down and reloads join victory, cannabis preparation and battle reaction."],
                      ["Name-based hierarchy", "No D and I'm your dad split Deeno phonetically and introduce fatherhood before Deeno takes control of that route."],
                      ["Insider-history posture", "Skamz, Pen Game and staying at Deeno's home let Tapped claim that former friendship gives him access to credible personal surfaces."],
                      ["Technical persistence", "Mic handling, a first-show reset, commentary reloads and interruptions force repetition, but Tapped continues every round."],
                      ["Main weakness", "Stacked allegations and very fast third-round references often bury the cleaner name, cannabis, friendship and scene-status writing."]
                    ]
                  },
                  {
                    mc: "Deeno",
                    highlights: [
                      ["Betrayal narrative", "Former friendship and alleged comments about Deeno's children supply a cause-and-consequence structure across the battle."],
                      ["Visual evidence performance", "Screenshots make alleged private messages physically inspectable in the room and establish a tactic Tapped later copies and names."],
                      ["Fatherhood case", "Paternity, son preference, time with children, provision and better-dad language keep responsibility central rather than using it once."],
                      ["Hospitality reversal", "Tapped staying at Deeno's home becomes evidence that a former guest betrayed someone who had helped him."],
                      ["Reusable 24 framework", "Cap, shit dad, act and bad are each attached to 24, making the opponent's own brand carry the accusation."],
                      ["Question-and-answer hook", "Do you know what's tapped repeatedly introduces alleged conduct, letting Deeno redefine the stage name through examples."],
                      ["Pressure escalation", "Named opponents lead to child support and council tax, changing street confrontation into unavoidable adult responsibility."],
                      ["Main weakness", "Illness, disability, self-harm, family and relationship material often crosses from structured character analysis into extreme shock."]
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
                      ["Prebuttal strategy", "Roman predicts the deceased-partner angle and acknowledges the death before Tapped can frame it as a reveal."],
                      ["Evidence staging", "Printed messages give round two a physical centre, reading sequence and visible reaction point."],
                      ["Aggressive presence", "Close positioning and direct confrontation give simple threats more weight than their wording alone."],
                      ["Personal architecture", "Tapped's family, relationships, parenting, body, tattoos and status are attacked as parts of one credibility case."],
                      ["Sustained third-round frame", "Sink, swim and out-of-depth language holds the final round together while Roman widens the personals."],
                      ["Archive vulnerability", "The toughest-warriors boast sounds authoritative here but supplies Ryno with a precise résumé rebuttal in Episode 18."],
                      ["Best quality", "Preparation and steadier closing control let Roman absorb Tapped's most predictable personal route."],
                      ["Main weakness", "Extreme hostility and straightforward threats sometimes replace the layered writing found in Tapped's strongest passages."]
                    ]
                  },
                  {
                    mc: "Tapped24",
                    highlights: [
                      ["Name-flip system", "Roman Reigns, Roman script, romance and roll-man constructions keep the opponent's name active across the first round."],
                      ["Reference density", "Football, Harry Potter, chemistry, X-Men and fairy tales make attacks visual and immediately recognisable."],
                      ["Mirrored prop", "Tapped answers Roman's printed messages with a screenshot of his own instead of allowing one-sided ownership of evidence."],
                      ["Explicit lineage", "Saying he has done a Deeno identifies the Episode 1 origin of the screenshot tactic and makes reuse part of the bar."],
                      ["Contrast punches", "GZone versus G-string and rock versus pebble reduce broad status arguments to short, crowd-readable oppositions."],
                      ["Room engagement", "Humour and direct audience address repeatedly recover energy after technical interruptions."],
                      ["Best quality", "Tapped can convert serious personal material into memorable language without losing his established comic character."],
                      ["Main weakness", "The bereavement route continues after Roman's prebuttal and becomes longer and less strategically focused in the third."]
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
                        ["Platform-wide debut", "Addressing every possible GZone opponent makes the first appearance sound like the beginning of a roster campaign."],
                        ["Persona deconstruction", "Clips, dancing, camera antics, comedy and sound effects are treated as evidence that 2MWAD performs for social media rather than controls clashes."],
                        ["Prebuttal instinct", "Ryno predicts homelessness before 2MWAD's first and anticipates the serious allegation before producing his document."],
                        ["Live third-round response", "Britain, the pond and the preceding allegation are answered off the dome before Ryno returns to written material."],
                        ["Multi-layered music scheme", "Pen, lead, Led Zeppelin, rock and roll and Stairway to Heaven create the battle's strongest connected technical passage."],
                        ["Physical rebuttal", "The NFA document turns a spoken legal defence into an object around which the room reaction and later archive debate can organise."],
                        ["Best quality", "Prepared wordplay and live defensive awareness give Ryno several clear peaks even while the main narrative moves against him."],
                        ["Main weakness", "Audio restarts and lists of hostility prevent the isolated peaks from becoming one consistent three-round case."]
                      ]
                    },
                    {
                      mc: "2Mad",
                      highlights: [
                        ["Battle-long narrative", "Housing, money, hygiene, employment, debt and public image support the same credibility argument across all three rounds."],
                        ["Concrete visual writing", "The sleeping bag, pond, bank, stains, bailiffs and KFC turn a general claim into scenes the room can picture."],
                        ["Persistence after rebuttal", "Ryno's spoken denials and pond freestyle do not end the route; 2MWAD keeps restoring it with new locations and details."],
                        ["Political expansion", "Take-back-Britain and alleged-racism language broadens the case beyond money and becomes named source material for TymeLess."],
                        ["Pressure that forces adaptation", "The serious allegation compels Ryno to pause the prepared round and answer through a document and extended live explanation."],
                        ["Identity close", "GZone traveller and 3-0 massacre summarise 2MWAD's outsider status and claimed sweep in one line."],
                        ["Best quality", "A single opponent-specific story survives mic trouble, rebuttals and the opponent's strongest technical passages."],
                        ["Main weakness", "Long rounds and repetition sometimes reduce precision, while serious claims require careful separation from verified fact."]
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
                        ["Record acknowledgement", "Deluxx names the previous loss to a veteran and reframes continued presence as resilience rather than pretending the defeat did not happen."],
                        ["Pen-centred second round", "Bill and Ben, flowerpot, killing with a pen, crosses, posts and ghosts give the middle round its clearest connected writing."],
                        ["Style-authorship attack", "The Tapped24 comparison questions whether BTizz owns the cadence and performance identity presented on debut."],
                        ["Accessible references", "Lion King, Barbie and Ken and Dragon Ball Z make parts of the heavier attack immediately visual."],
                        ["Late-round recovery", "The commentary table gives Deluxx the third, preserving that he recovered even though the overall result was already lost."],
                        ["Archive consequence", "The copied-Tapped route is later developed by CJ-Zino and deliberately confronted by BTizz and Deeno."],
                        ["Best quality", "Deluxx is most effective when experience, writing and one recognisable reference serve the same point."],
                        ["Main weakness", "Shock material, mic trouble and compressed delivery prevent individual ideas from forming one stable three-round case."]
                      ]
                    },
                    {
                      mc: "BTizz",
                      highlights: [
                        ["Debut branding", "B sounds, name spelling and short repeated phrases make BTizz immediately recognisable through a disrupted live recording."],
                        ["Authenticity case", "Jamaican, Asian and yard identity are repeatedly tested against Deluxx's appearance and public presentation."],
                        ["Local authority", "0121 and king-of-the-mic language anchor status in Birmingham rather than leaving it as a generic boast."],
                        ["Grime reference", "Skepta's Shutdown gives the opening a familiar UK-music frame for taking control of a room."],
                        ["Counter-authorship attack", "The London Mikez allegation reverses Deluxx's style-copying claim by questioning whether Deluxx owns his written bars."],
                        ["Live stamina pressure", "Water, weak knees, movement and stage-removal language convert visible performance difficulty into material."],
                        ["Best quality", "Clear identity cues and crowd timing give BTizz the first two rounds despite frequent technical disruption."],
                        ["Main weakness", "The third becomes harder to follow as hosting confusion, repetition and dense delivery weaken individual setups."]
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
                        ["Grime-led pressure", "Pace, repetition, movement and crowd address make the performance feel like a live set directed at one opponent."],
                        ["Compact visual anchors", "Rubik's Cube, BTEC, Trident, a stolen vape and Croc help individual attacks survive the faster cadence."],
                        ["0121 identity", "Birmingham's area code turns regional origin into a recurring source of status and crowd recognition."],
                        ["Name branding", "Renzo and friend zone creates a portable sound pattern that Badee later repurposes against Deeno."],
                        ["Gaming structure", "Up, down, left, right, square and triangle make performance movement read as a cheat-code combination."],
                        ["Scoring prediction", "The three-pronged Trident supports a 3-0 forecast, even though commentary and the close make the decision more contested."],
                        ["Best quality", "A distinct identity is established strongly enough to outlast individual counterpunches and later enter league vocabulary."],
                        ["Main weakness", "Speed obscures some setups, and Proty's sister correction turns one third-round boast into a clear live defeat."]
                      ]
                    },
                    {
                      mc: "Proty",
                      highlights: [
                        ["Visual punch writing", "Tails, Pennywise, Rizla and Muhammad Ali turn appearance, movement, money and threat into readable images."],
                        ["Connected drug route", "UK Cali, sniff, ash and intoxication expand one credibility argument rather than functioning only as isolated insults."],
                        ["Money architecture", "Likes, followers, lost profit, pennies, credit and prepaid clothing test Renzo's status through concrete measures."],
                        ["Immediate rebuttal", "The one-year-old-sister reveal changes the preceding boast before Proty begins his written third."],
                        ["Mirrored surfaces", "Cheat-code and 0121 language are taken from Renzo's round and redirected rather than ignored."],
                        ["Clearer pacing", "Individual setups and punch destinations are generally easier to isolate than Renzo's fast grime pockets."],
                        ["Best quality", "Proty combines prepared visual jokes with the battle's sharpest unplanned response."],
                        ["Main weakness", "Long rhyme strings and lower room momentum prevent the cleaner single moments from controlling the complete decision."]
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
                        ["Numbered debut warning", "Dead man walking and the one-two-three sequence frame the first appearance as consequence rather than introduction."],
                        ["Grime identity", "Get grimy again makes genre, darkness and danger the standards by which CJ judges the opponent and himself."],
                        ["Territorial second round", "You ain't welcome here, doctor, germs, flu and predator/prey language make GZone belonging part of the attack."],
                        ["Reciprocal hygiene pressure", "CJ begins the contamination route, but Proty answers strongly enough that cleanliness becomes a contested rather than owned angle."],
                        ["Streaming-device scheme", "Chromecast, Roku, Fire Stick and Chrome join media control, fire, metal and physical impact in CJ's clearest technical passage."],
                        ["Future-facing character", "The grime mode and opponent-specific directness become the basis of CJ's later wins and archive arguments."],
                        ["Best quality", "Aggression is most effective when it is organised through a clear word family or territorial claim."],
                        ["Main weakness", "Mic resets and stacked family attacks sometimes let force outrun clarity and make Proty's shorter hooks easier to retain."]
                      ]
                    },
                    {
                      mc: "Proty",
                      highlights: [
                        ["Cartoon architecture", "Pixar, Remy, Ratatouille, Tic Tac and Flushed Away create one sustained way of redesigning CJ's appearance."],
                        ["Hook repetition", "Quick replay, 3-0 and wrong decision organise longer passages and make the score prediction audible through restarts."],
                        ["Hygiene ecosystem", "Polluted breath, competing bacteria and the wristband turn contamination into a visible world rather than a single smell joke."],
                        ["Connected intoxication route", "The previous event, Remy, MDMA, lines and weekly finances link alleged substance use to behaviour and money."],
                        ["Technology counter-surface", "Windows, lagging and buffering let Proty attack CJ's logic and pace before CJ answers with his own device scheme."],
                        ["Pen criticism", "Dead bars, rewriting and working on the pen treat CJ as an unfinished artist rather than only an ugly opponent."],
                        ["Best quality", "Short visual images and recurring hooks remain legible during a technically messy live battle."],
                        ["Main weakness", "Some passages extend the roast without advancing the argument, leaving CJ with the cleaner isolated technical scheme."]
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
                      ["Experience-versus-record tension", "Tapped is the recognised veteran but enters with official losses to Deeno and Roman, allowing AJNA to separate room familiarity from winning authority."],
                      ["Visual-angle speed", "Dumbledore, Juggernaut, Giant Peach, Austin Powers, eyebrows, body shape and clothing make separate attacks immediately readable."],
                      ["Pop-culture switching", "TARDIS, High School Musical, Wiley and Fergie keep the reference field moving while Tapped returns to appearance and status."],
                      ["Parenting and home pressure", "Children, partners, money and housing aim to give the graphic insults a wider responsibility argument."],
                      ["Audience recruitment", "The run-train passage calls multiple people in the room by name, turning an allegation into a public participation test."],
                      ["Veteran-status close", "Calling AJ new and questioning why she is on GZone tries to make experience the final judging standard."],
                      ["Best quality", "He can find fast, obvious visual surfaces and sustain aggression through repeated sound and crowd interruptions."],
                      ["Main weakness", "Reloads, mic resets and overpacked graphic routes prevent the rounds from building one decisive opponent-specific narrative."]
                    ]
                  },
                  {
                    mc: "AJ / AJNA",
                    highlights: [
                      ["Identity established in one response", "Matching Mr Disrespectful's tone immediately turns the First Lady introduction from ceremony into competitive proof."],
                      ["Repeatable sound chains", "Bad man, mad man and sad man give the opening a simple spine the room can follow through explicit content."],
                      ["Counted-line scheme", "One, two and three lines connect alleged drug use, written bars and escalating relationship pressure."],
                      ["Live-person involvement", "Georgie Porgie brings Tapped's partner into the room and produces reloads that make the angle feel shared rather than remote."],
                      ["Masculinity reversal", "Sexuality, alleged violence toward women and the instruction to fight men challenge where Tapped directs his toughness."],
                      ["Closing structure", "The repeated 'set some levels' opening gives the third a clear return point through ring, drug, police and playground material."],
                      ["Best quality", "AJ converts interruptions into renewed delivery and matches the room's energy without losing the identity of each major route."],
                      ["Main weakness", "Some passages are raw lists and the most serious allegations rely on shock rather than demonstrated evidence or layered wordplay."]
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
                      ["Name-flip architecture", "Time, timing, timelines, clocks, timestamps, past, present, future and time of death give all three rounds one opponent-specific vocabulary."],
                      ["Real-name extension", "William enables personal address and the 'fire at Will' phrase, adding a second linguistic route beyond the stage name."],
                      ["Parenting through the name", "TymeLess's children allegedly seeing him less converts a familiar fatherhood attack into a grammatical stage-name flip."],
                      ["Moral counter-case", "Family, women, racism and alleged behaviour attempt to stop TymeLess presenting himself only as the accuser."],
                      ["Counter-prop", "Property keys are presented as direct physical evidence against the homelessness narrative rather than a spoken denial alone."],
                      ["Live-room payoff", "Asking for the actual time turns the earlier timestamp dispute into an improvised recording-time-of-death closer."],
                      ["Best quality", "His strongest terms perform several jobs at once, joining punch, opponent identity and live circumstance."],
                      ["Main weakness", "Repetitions, reloads and the mistaken round ending prevent the densest second-round writing from retaining full momentum."]
                    ]
                  },
                  {
                    mc: "TymeLess",
                    highlights: [
                      ["Inherited-angle research", "Episode 8 supplies homelessness and racism pressure, which TymeLess expands through Leicester, friends, allegations and family history."],
                      ["Live rebuttal instinct", "He answers the racism reversal and later treats Ryno's keys as something that must be countered rather than ignored."],
                      ["Character-case continuity", "Housing, credibility, family trauma, race, sexuality and alleged conduct all support the claim that Ryno's public image is unstable."],
                      ["Prop escalation", "A photograph and ashes lead into socks, toothbrush, Pot Noodle, soap and tape, turning one reveal into a closing sequence."],
                      ["Ordinary-object readability", "Cheap food and household supplies allow the room to understand the alleged living conditions without a long explanation."],
                      ["Future-style foundation", "The same method evolves into plunger and three-lemon payoffs against Deeno, now distributed across a full battle."],
                      ["Best quality", "He controls emotional temperature and closing memory, using repetition and physical evidence when technical density is unnecessary."],
                      ["Main weakness", "Extremely dark trauma and allegation-based material can divide viewers, and the claims should not be read as independently verified fact."]
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
                      ["Debut by shock", "Family, child loss, Prince's partner and personal history create an identity immediately, without a gradual introduction to the room."],
                      ["Pressure continuity", "Natty sustains the hostile tone across all three rounds instead of letting PR1NC3's calmer rebuttal reset the battle."],
                      ["Status comparison", "Age, manhood, money, bicycle transport, music prospects and a Mars-versus-Pluto image present Prince as older yet smaller."],
                      ["Setting-aware threats", "Because the clash occurs in a boxing ring, Natty's proposal to drop the mic and fight turns the physical space into part of the writing."],
                      ["Royal-name erosion", "Prince is reduced from royalty to a minor room figure, so the stage name becomes evidence of inflated status rather than authority."],
                      ["Future material seed", "The official victory becomes Natty's 'first body' when he returns against Z.K in Episode 20."],
                      ["Best quality", "He establishes and maintains emotional pressure strongly enough that even rough writing keeps the room focused on his terms."],
                      ["Main weakness", "Restarts, repeated passages and lists of severe insults often prioritise cruelty over clean setups, schemes and payoffs."]
                    ]
                  },
                  {
                    mc: "PR1NC3",
                    highlights: [
                      ["Prebuttal response", "Prince names the barber, dancer, wife and family routes as expected public information, reducing their discovery value without pretending they were never said."],
                      ["Credibility framework", "Lying, snitching, 999, vermin and false-danger language give three rounds a consistent alternative reading of Natty's aggression."],
                      ["Prop progression", "Listerine, soap and salt form a three-object hygiene sequence rather than one disconnected reveal."],
                      ["Emotional-temperature control", "The physical comedy gives the room relief after severe personal material while keeping the counterattack active."],
                      ["Boxing mechanics", "A one-two, slip and crack uses recognisable technique and answers Natty's fight challenge inside the ring setting."],
                      ["Redemption framing", "Prince's language points back to the official Roman loss in Episode 2 and treats this return as record repair."],
                      ["Best quality", "He remains composed and creates clearer individual structures while facing the most emotionally aggressive material of the battle."],
                      ["Main weakness", "Mic issues, interruptions and a less forceful overall room narrative prevent those clearer devices from converting into the official win."]
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
                      ["Record-based opening", "The massacre framing starts from CJ's official loss to Proty, giving the challenger insult an identifiable Season 1 source."],
                      ["Crowd-chant construction", "The repeated MVP section gives round one a call-and-response pulse and lets energy compensate for the early restarts."],
                      ["Hook writing", "The CJ-Zino and three-round 3-0 pattern is memorable enough to return across the performance, even though the eventual verdict reverses it."],
                      ["Clean-up word family", "Stage cleaning, squeaky clean, the clean-up crew and surface area link opponent identity to a repeated action rather than isolated hygiene punches."],
                      ["Pop-culture range", "Nemo, Dory, Kermit, Leon Edwards, UFC, GSP, American Dad, Roger, Disney and the Ouija board supply quick visual changes."],
                      ["Shock-angle density", "Disease, STDs, HIV, malaria, relationships, race and violence generate aggression but sometimes compete instead of building toward one payoff."],
                      ["Best quality", "BTizz can turn plain repeated phrases into room participation and keep performance energy high while the written route changes."],
                      ["Main weakness", "Restarts and overpacked passages weaken round shape, leaving the copied-flow accusation as the clearest narrative remembered from the clash."]
                    ]
                  },
                  {
                    mc: "CJ Zino",
                    highlights: [
                      ["Flow-theft thesis", "CJ repeatedly argues that BTizz is copying Tapped24, making originality the battle's most sustained opponent-specific question."],
                      ["Live-witness technique", "Addressing Tapped24 in the room gives the accusation a second participant and makes the crowd watch for the borrowed delivery."],
                      ["Visual hygiene evidence", "The Listerine bottle converts breath material into a prop-led moment that can land before the full explanation is processed."],
                      ["Personal detail chain", "Job loss, alcohol, clothes, relationships, cars, alleged information gathering and confidence all support the broader inauthenticity claim."],
                      ["Structural destinations", "A numerical countdown closes the first, flow theft anchors the second, and TARDIS, fatherhood and the PR1NC3 callout give the third identifiable endpoints."],
                      ["Future-opponent framing", "The final does not stop at BTizz; CJ turns an official win into a direct request for a larger next booking."],
                      ["Best quality", "His sharpest moments translate complex character pressure into plain summaries such as 'go find your own flow.'"],
                      ["Main weakness", "The tissue interruption, repetitions and loosely joined later bars interrupt polish, although CJ recovers without losing the round's destination."]
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
                      ["Clipped opening cadence", "Size, clothes, trim, bars and ability arrive as a short internal-sound list that makes the debut instantly direct."],
                      ["Youth-versus-veteran frame", "Old, outdated and veteran language turns Roman's experience into the central weakness PR1NC3 claims to expose."],
                      ["Pen-to-punch movement", "A precise pen is loaded and fired before left and right hands return the image to the boxing ring."],
                      ["Royal self-branding", "Prince is treated as a crown and war status, giving Roman a clear identity to appropriate through Princess and Buckingham Palace."],
                      ["Scale comparisons", "GOAT sacrifice and goldfish, tank and ocean let PR1NC3 concede Roman a category before placing himself above it."],
                      ["Controlled fake choke", "The forgotten-bars pause is immediately revealed as a psych, distinguishing performance theatre from genuine technical interruption."],
                      ["Third-round flow switch", "Dark Knight and ring writing move into a rapid GRM pocket before PR1NC3 slows down to explain and brand the numeral in his name."],
                      ["Main weakness", "Direct threats and broad age attacks create energy, but fewer passages are tied specifically to Roman than Roman's material is tied to Prince."]
                    ]
                  },
                  {
                    mc: "Roman",
                    highlights: [
                      ["Royal counter-writing", "Princess, real don, royal bars, upper class and Buckingham Palace seize the vocabulary PR1NC3's stage name should control."],
                      ["Experience reversal", "Activity since 2006 answers old and veteran criticism by making the same age gap evidence of longevity."],
                      ["Name-based typography", "Times New Roman turns the battler's own name into a writing claim, while toner revives the printing surface in the final."],
                      ["Height cartoon", "Shins, knees, standing, folding and growing up repeatedly use PR1NC3's build to support the youth angle."],
                      ["Audience-directed performance", "Finger points, engine sounds, pauses and room address make the schemes theatrical rather than leaving their effect to text alone."],
                      ["Earned reload", "The crowd asks for Roman's second to be run again after time is called, preserving a genuine reaction moment amid technical restarts."],
                      ["Final-round information payoff", "Mason removes the crown and 2001 converts the birth year into an exaggerated loss record before song criticism closes the character case."],
                      ["Main weakness", "Long family passages and multiple starts dilute the cleanest royal, typography, height and age writing even within the winning performance."]
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
                      ["Office wordplay", "PowerPoint, Excel and the implied Word turn software names into an early claim of writing control."],
                      ["Status metaphor", "GOAT becomes a literal herd so Mikez can appoint himself the shepherd above the roster's competing greatness claims."],
                      ["Grounded consequences", "Universal Credit sanctions, gigs, landlord payments and Wi-Fi make financial and domestic disrespect more specific than the surrounding threats."],
                      ["Personal-name reduction", "Replacing Deluxx with Devonte removes the premium stage identity and prepares the later creator and authorship narrative."],
                      ["Cultural reference chains", "Supercell, Superman, Tinkerbell, Christmas, locks, rocks, Green Street and a hammer give long passages visible anchors."],
                      ["Third-round rhyme control", "Turn, earn, learn, G, germ, snake, worm, judge, case, adjourned, academy and term build connected pockets rather than isolated punches."],
                      ["Recovery under disruption", "Timing confusion, water, beat levels, mic levels and an attempted wheel-up cause restarts, but Mikez repeatedly restores the verse and projection."],
                      ["Main weakness", "Severe identity, disability, mental-health and family shock often obscures the cleaner wordplay, and repetition makes the performance less technically seamless."]
                    ]
                  },
                  {
                    mc: "Deluxx",
                    highlights: [
                      ["Opponent-name reversal", "London Mikez is divided into city and microphone so Deluxx can concede the location while claiming to be king of the mic."],
                      ["Local identity hook", "0121 brings Birmingham into the repeated first-round refrain before later battlers make the area code a larger GZone brand."],
                      ["Cadence as structure", "Repeated openings and quick internal sounds keep the performance moving even where individual words become difficult to isolate."],
                      ["Artist-credibility case", "Singing, album value, charting, trap activity and flow originality attack Mikez's identity beyond the battle stage."],
                      ["Renzo pre-debut reference", "Comparing Mikez's flow to Renzo places the future Episode 6 winner in the archive and alleges stylistic borrowing."],
                      ["Self-authored rebrand", "DFN to Deluxx supplies a concise identity history that later originality and ghostwriting attacks must answer."],
                      ["Reference flashes", "DVD, A1J1, Aquaman, Atlantis, Lockjaw and Spanish switching show range but do not develop into one sustained opponent narrative."],
                      ["Main weakness", "The on-camera commentary identifies the central problem: increased speed reduces clarity, so rhythm survives while setups and payoffs disappear."]
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
                      ["Connected gaming scheme", "Missions, XP, rent-free headspace, side quests, DLC, NPCs, DNA, two controllers and player one all advance one household-role argument."],
                      ["Semantic progression", "Each gaming term changes Mikez's alleged position—from worker, to optional content, to background character, to secondary controller—rather than simply repeating one metaphor."],
                      ["Compact second-round flips", "Mike and mic make the name part of a mother comparison, while sent right back becomes Héctor Bellerín's football position."],
                      ["Preparation framing", "The claimed earlier clash, old-bars accusation and whole-year line question whether Mikez's material is new without creating an unofficial result in the archive."],
                      ["Cadence chains", "Ugly, fugly, bummy, scummy, crusty, musty, dusty and rusty use repeated sound to make a simple final-round attack memorable."],
                      ["Grounded money imagery", "Online banking, a McFlurry and council housing give financial insults ordinary UK reference points that the room can picture immediately."],
                      ["Live crowd exchange", "The McDonald's sandwich line becomes an interruption-and-repeat moment, showing 2MWAD responding to room energy even when it disrupts his written path."],
                      ["Main weakness", "The first is fully organised, but the later turns fragment into allegations and insult lists, leaving Mikez with the more defined final-round close."]
                    ]
                  },
                  {
                    mc: "LDN Mikez",
                    highlights: [
                      ["Two-W status frame", "The 2MWAD name becomes a prediction of consecutive official victories after Mikez's Episode 3 win over Deluxx."],
                      ["Immediate vocabulary answer", "Warzone and Gulag meet 2MWAD's game-world attack in the next turn, keeping Mikez inside the opponent's strongest conceptual surface."],
                      ["Personal name targeting", "Lance Pennant removes the stage-name shield and creates archive material Ryno later inherits in Episode 8."],
                      ["Extended sound writing", "Sync, ship sink, set five, extinct, stinks, instincts, Miss Inks and NSYNC sustain movement through linked sounds across the second."],
                      ["Pop-culture architecture", "Apollo Creed, Undertaker, WrestleMania and The Rock give the first two rounds familiar fight and spectacle references."],
                      ["Correct EastEnders attribution", "Mikez's final owns Frank, Butcher, Ben, Heather, New Era, Tracy, Shirley and Bianca—the page previously assigned this scheme to the wrong battler."],
                      ["Closing cadence", "Energy, melody, cemetery, meant to be and different entity bring the final to a clear performance-based conclusion."],
                      ["Main weakness", "Audio resets and repeated starts interrupt control, while severe unverified allegations often crowd out the cleaner name, sound and television writing."]
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

            {battle.slug === 'zk-vs-cj-zino' && (
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-display uppercase mb-6 text-white">
                  Key Technical Highlights by MC
                </h3>
                {[
                  {
                    mc: "Z.K",
                    highlights: [
                      ["Visual comedy", "Slipknot, TikTok, Gollum, footballers, clothing brands, Peter Parker, Dwayne Carter, Palmer, and Phineas keep the writing easy to picture."],
                      ["Physical football payoff", "Z.K brings out a mini football during the Scholes, Gerrard, and Paolo Di Canio half-volley sequence, using the prop to show the room that he could volley CJ-Zino."],
                      ["Live location rebuttal", "CJ's repeated Grimsby and GY pressure is reversed into a claim that he wants to live there, followed by the seaside-versus-box-house comparison."],
                      ["Level reversal", "CJ's claim that Z.K cannot reach his level comes back as CJ being stuck at a level Z.K says he passed in one clash."],
                      ["Prepared photo counter", "Facebook and picture language in round two develops into the closing claim that Z.K expected a photo, cloned it, and could challenge who supplied it."],
                      ["Archive awareness", "CJ's losses, Natty's previous evidence tactic, Darren the dentist, and Z.K's own debut all become material without changing the official results."],
                      ["Sustained third-round chain", "Darts, nine-darter, chart, Carter, farmer, Starmer, tartar, Palmer, and Pollock give the final the battle's longest connected sound run."],
                      ["Main weakness", "Restarts, repeated passages, harsh personals, and some overextended rhyme chains reduce clarity around the cleaner jokes."],
                      ["Winning edge", "The stronger final-round adjustment, clearest Ginge reaction, and more memorable closing sequence support the livestream audience decision."]
                    ]
                  },
                  {
                    mc: "CJ-Zino",
                    highlights: [
                      ["Opening identity", "The repeated Mr Robinson, diluted, polluted, and saluted cadence gives CJ an immediate performance anchor."],
                      ["Career-status case", "Fourteen years versus three and the JDZ and birthday view comparisons turn experience into a measurable relevance argument."],
                      ["Opponent naming", "K, Zach, Robinson, PC Robinson, Grimsby, and GY keep important parts of the writing attached to this matchup."],
                      ["Record rebuttal", "CJ disputes how the 1Flaymr result was received, making his most recent official loss part of the current performance without altering the archive verdict."],
                      ["Venue writing", "Bar, war, spar, gloves, kicks, knocks, and fighters use the Peacock's boxing-gym setting instead of relying only on generic threats."],
                      ["Crowd device", "The repeated Pow section converts punch language into call-and-response and gives CJ his clearest participatory moment."],
                      ["Live self-callback", "No more dropping the mic acknowledges the interruption that has just affected the round and folds it back into the performance."],
                      ["Main weakness", "Sound problems, multiple complete restarts, severe allegation packages, and a less connected final structure weaken the finish against Z.K's closing run."]
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

            {battle.slug !== 'zk-vs-cj-zino' && battle.slug !== 'nattyebk-vs-zk' && battle.slug !== 'deeno-vs-tapped24' && battle.slug !== 'cj-zino-vs-1flaymr' && battle.slug !== 'tapped24-vs-roman' && battle.slug !== 'tapped24-vs-ajna' && battle.slug !== 'tapped24-vs-grams' && battle.slug !== 'ryno-vs-tymeless' && battle.slug !== 'pr1nc3-vs-nattyebk' && battle.slug !== 'btizz-vs-cj-zino' && battle.slug !== 'btizz-vs-1flaymr' && battle.slug !== 'cj-zino-vs-proty' && battle.slug !== 'renzo-vs-proty' && battle.slug !== 'ryno-vs-roman' && battle.slug !== 'deluxx-vs-btizz' && battle.slug !== '2mwad-vs-ryno' && battle.slug !== 'deeno-vs-grams' && battle.slug !== 'deeno-vs-badee-harz' && battle.slug !== 'pr1nc3-vs-roman' && battle.slug !== 'ldn-mikez-vs-deluxx' && battle.slug !== 'ldn-mikez-vs-2mwad' && (
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
