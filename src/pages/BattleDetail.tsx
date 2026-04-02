import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { battles as allBattles } from "../data/battles";
import { mcs } from "../data/mcs";
import { ArrowLeft, Play, Share2, Trophy, Clock, AlertCircle } from "lucide-react";

export default function BattleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const battle = allBattles.find(b => b.slug === slug);

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
    "name": `${battle.title} - GZone Rap Battle`,
    "description": `Full battle between ${mc1?.name} and ${mc2?.name} from GZone Rap Battle League.`,
    "thumbnailUrl": `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    "uploadDate": formatDateForSchema(battle.date),
    "contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
    "embedUrl": battle.videoUrl
  } : null;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950">
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/battles" 
          aria-label="Back to Battles"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Battles
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
              <h1 className="text-5xl md:text-7xl font-display italic uppercase leading-tight mb-8">
                <Link to={`/mc/${mc1?.slug}`} aria-label={`View ${mc1?.name}'s profile`} className="hover:text-brand transition-colors">{mc1?.name}</Link> <span className="text-brand">VS</span> <Link to={`/mc/${mc2?.slug}`} aria-label={`View ${mc2?.name}'s profile`} className="hover:text-brand transition-colors">{mc2?.name}</Link>
              </h1>

              {battle.isUnreleased && (
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand border border-brand/20 font-bold uppercase tracking-[0.2em] text-xs">
                    <Clock size={16} /> Unreleased Battle
                  </div>
                </div>
              )}
              
              <div className="aspect-video bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden relative group">
                {battle.videoUrl ? (
                  <iframe
                    src={battle.videoUrl}
                    title={battle.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
                      <h3 className="text-3xl font-display italic uppercase text-white mb-2">Video Currently in Production</h3>
                      <p className="text-zinc-400 uppercase tracking-[0.2em] text-sm">The G Zone is processing the bars...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Battle Result */}
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display italic uppercase text-white">Battle Result</h2>
                <p className="text-zinc-400 text-sm mt-2 uppercase tracking-widest">
                  {battle.winner ? "Official Judges' Decision" : "Awaiting Decision"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center font-display italic text-zinc-400 z-10">
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
                    <Link to={`/mc/${mc1?.slug}`} aria-label={`View ${mc1?.name}'s profile`} className="text-3xl font-display italic uppercase hover:text-brand transition-colors">{mc1?.name}</Link>
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
                    <Link to={`/mc/${mc2?.slug}`} aria-label={`View ${mc2?.name}'s profile`} className="text-3xl font-display italic uppercase hover:text-brand transition-colors">{mc2?.name}</Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Clash Summary for Deeno vs Tapped24 */}
            {battle.slug === 'deeno-vs-tapped24' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The main event at The GZone Rap Battle League Christmas Launch 2025 saw Tapped24 and Deeno step into the ring for a fierce and emotionally charged clash. With clear tension between both MCs from the start, the battle carried the energy of a real grudge match, making it one of the most talked-about performances of the night.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with an aggressive and highly personal style, pushing deep into direct confrontation and sharp rebuttals. Tapped24 focused on heavy disrespect, personal shots, and relentless pressure, while Deeno responded with a more layered approach, mixing crowd reaction, direct callouts, and angles aimed at credibility and character.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major moment in the battle came when Deeno used props and visual material to strengthen his round, creating one of the standout crowd reactions of the event. As the clash unfolded, the intensity only built further, with both sides refusing to let up and the atmosphere in the room becoming more and more charged.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the hosts turned to the crowd for the verdict, letting the audience reaction decide who had done enough on the night. While no formal on-camera judges’ ruling closed the match, the battle was clearly one of the most memorable and explosive moments from the launch event.
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

            {/* Clash Summary for 2MWAD vs Ryno */}
            {battle.slug === '2mwad-vs-ryno' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between 2MWAD and Ryno at The GZone Rap Battle League saw both MCs step into the ring for an intense and highly charged clash. From the very beginning, the tension was obvious, with both battlers taking an aggressive approach that gave the contest a hostile and unpredictable energy throughout all three rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both artists relied heavily on direct confrontation and personal angles, creating a relentless back-and-forth from start to finish. 2MWAD focused on sharp attacks aimed at Ryno’s character, lifestyle, and public image, using detailed setups and crowd-focused delivery to keep the pressure on. Ryno responded with a forceful and combative style of his own, pushing back with direct rebuttals, strong reactions, and an attempt to challenge the narratives being built against him.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the clash was the intensity of the material and the way both MCs tried to unsettle each other with highly personal content. The atmosphere in the room stayed charged throughout, helped by strong host involvement and crowd engagement that kept the energy high as each round escalated. As the battle unfolded, the exchanges became more heated, giving the matchup a raw and confrontational edge that stood out on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, it was clear that the clash had become one of the more explosive and discussion-heavy performances in the GZone setting. While the focus remained on the battle itself rather than a clear formal result, the contest stood out for its intensity, its crowd reaction, and the no-holds-barred style both MCs brought to the stage.
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
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Tapped 24 and Roman at The GZone Rap Battle League saw both MCs step into the ring for a fierce and emotionally charged clash. From the opening moments, the tension was unmistakable, with both battlers bringing a level of hostility and direct confrontation that quickly made the matchup feel like one of the biggest moments on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both artists delivered highly aggressive performances built around personal angles, sharp rebuttals, and relentless pressure. Tapped 24 came with an intense, forceful style, using direct attacks and commanding delivery to keep the battle on edge. Roman responded with a more layered approach, mixing personal angles, crowd reaction, and calculated moments designed to shift momentum in his favour.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major moment in the battle came when Roman introduced printed messages and visual material as part of his round, creating one of the standout reactions of the clash. That move added another level of tension to the contest and helped turn the atmosphere in the room even more charged. Despite technical interruptions and repeated pauses around sound and timing, both MCs continued to push the intensity higher as the battle unfolded.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the hosts turned to the crowd to measure the reaction, with both battlers receiving strong support from the room. While no formal judged result was given on camera, the battle was widely treated as one of the standout performances of the night, remembered for its intensity, dramatic moments, and the raw energy both MCs brought to the GZone stage.
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
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Tapped 24 and AJ at The GZone Rap Battle League saw both MCs step into the ring for a fierce and emotionally charged clash. From the very start, the tension was clear, with AJ making an immediate statement as the First Lady of the GZone and Tapped 24 bringing the kind of aggressive energy expected from a seasoned battler, making it one of the standout matchups on the platform.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with a highly personal and confrontational style, pushing deep into direct attacks and sharp rebuttals. Tapped 24 focused on relentless pressure, using hard-hitting angles and dismissive punchlines aimed at AJ’s image and credibility. AJ responded with a forceful and high-energy performance of her own, mixing crowd reaction, direct callouts, and repeated themes that gave her rounds strong momentum and presence.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the battle was the contrast between Tapped 24’s veteran style and AJ’s hunger to make her mark. As the clash unfolded, AJ’s energy and delivery appeared to connect more and more with the room, while Tapped 24 continued to press with aggressive material and direct confrontation. That dynamic kept the battle intense throughout and helped build one of the strongest crowd reactions of the event.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the hosts turned to the crowd and the live chat to help determine the outcome. While there was some discussion around the technical side of the decision, the reaction in the room and online ultimately gave AJ the edge. With that, AJ secured a memorable win and strengthened her position as one of the most talked-about performers on the GZone platform.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for PR1NC3 vs Roman */}
            {battle.slug === 'pr1nc3-vs-roman' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The clash between Prince and Roman at the GZone Rap Battle League New Year’s Day Special 2026 saw both MCs step into the ring for a high-energy and competitive showdown. From the opening moments, the tension was clear, with both battlers setting a confrontational tone that carried through all three rounds and made the battle a standout performance early in the year.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the rounds, both artists brought contrasting but equally impactful styles. Prince leaned into a direct and aggressive approach, applying constant pressure with sharp delivery and confident presence. Roman, in response, delivered a more layered performance, using wordplay, structure, and narrative angles to challenge Prince’s position and control the momentum.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key feature of the battle was the back-and-forth dynamic, with both MCs landing moments that drew strong reactions from the crowd. Roman’s use of creative wordplay and extended schemes stood out, while Prince’s commanding delivery and clear-cut attacks ensured the intensity never dropped. The energy in the room built steadily as each round escalated the confrontation.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    As the battle reached its conclusion, the hosts once again turned to the crowd to determine the outcome, relying on audience reaction rather than a formal judged decision. While no official winner was declared on camera, the clash between Prince and Roman cemented itself as a memorable and hard-fought contest within the GZone catalogue.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Deluxx vs Btizz */}
            {battle.slug === 'deluxx-vs-btizz' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Deluxx and Btizz at The GZone Rap Battle League marked a standout moment for the platform, as one of the first events to be live streamed directly to YouTube. From the outset, both MCs entered the ring with high energy, setting the tone for a competitive and confrontational three-round clash.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both competitors leaned heavily into personal angles and direct attacks, creating a tense back-and-forth dynamic. Deluxx focused on shock-factor material and bold accusations, aiming to unsettle his opponent and control the narrative. In response, Btizz delivered a more structured approach, combining direct punches with angles around identity, presence, and lyrical credibility.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A key feature of the clash was the contrast in styles, with Deluxx pushing intensity through aggressive content, while Btizz maintained clarity and consistency in his delivery. Despite several technical interruptions affecting the flow at points, both MCs continued to engage the crowd and build momentum as the rounds progressed.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the battle, the performances across the first two rounds proved decisive. While the final round saw some disruption, the overall consistency and control shown by Btizz gave him the edge. The result was reflected in the final call, with Btizz taking the win in a competitive 2–1 decision, making the battle a memorable moment in GZone’s early live-streamed events.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for LDN Mikez vs Deluxx */}
            {battle.slug === 'ldn-mikez-vs-deluxx' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between LDN Mikez and Deluxx at the GZone Rap Battle League Christmas Day event saw both MCs step into the ring for a tense and hard-hitting clash. From the beginning, the matchup carried a strong contrast in styles, with Mikez bringing a dark, aggressive approach while Deluxx leaned more into flow, rhythm, and repetition, making it one of the more distinctive battles on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers came with very different tactics. LDN Mikez applied constant pressure through direct attacks, sharp punches, and a more intense lyrical style that aimed to control the battle from start to finish. Deluxx responded with a performance built around cadence, delivery, and recurring phrases, trying to match the energy with momentum and presence of his own.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A major feature of the battle was the contrast between Mikez’s dense, confrontational writing and Deluxx’s more flow-driven performance. As the rounds progressed, Mikez’s pressure and clarity appeared to give him the edge, while Deluxx continued to rely on rhythm and crowd-facing moments to keep himself in the contest. Even with interruptions and restarts during the battle, the intensity remained high and the atmosphere stayed charged throughout.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the crowd reaction made the outcome clear, with LDN Mikez emerging as the winner on audience consensus. While the battle remained rooted in the raw, hostile energy that defines the GZone setting, it also stood out as a memorable performance because of the clear stylistic contrast between the two MCs and the strong reaction it generated on the day.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for LDN Mikez vs 2mwad */}
            {battle.slug === 'ldn-mikez-vs-2mwad' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between LDN Mikez and 2mwad at the GZone Rap Battle League saw both MCs step into the ring for a high-intensity and confrontational clash. From the opening moments, there was clear tension, with 2mwad immediately challenging Mikez’s material and questioning its originality, setting a sharp tone that carried throughout all three rounds.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across the battle, both artists leaned heavily into personal angles and direct attacks, creating a relentless back-and-forth dynamic. 2mwad focused on breaking down Mikez’s personal life and positioning, using structured setups and layered references to frame his opponent in a negative light. In response, LDN Mikez delivered with aggressive energy, combining sharp punchlines and recognisable references to maintain pressure and control the pace of the clash.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout feature of the battle was the use of extended themes and creative wordplay. 2mwad incorporated gaming-style metaphors and narrative angles to build his rounds, while Mikez countered with bold cultural references and consistent delivery that connected strongly with the crowd. As each round progressed, the intensity continued to build, with both MCs landing moments that drew strong reactions from the room.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had reached its peak, with both sides delivering their strongest material in an attempt to close the contest. The hosts ultimately turned to the crowd to decide the outcome, and based on the reaction, LDN Mikez appeared to edge the decision. While no formal judged ruling was given on camera, the clash stood out as a competitive and hard-fought battle that reinforced the high-energy, no-holds-barred style of the GZone platform.
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
                  <h2 className="text-3xl font-display italic uppercase text-white flex items-center gap-4">
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
                    The clash between Renzo and Proty at The GZone Rap Battle League brought two of the platform’s youngest MCs face to face in a high-energy, back-and-forth contest that quickly turned personal. Framed as a showcase of emerging talent, the battle carried a competitive edge from the opening moments, with both rappers determined to prove who really belonged on the stage.
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
                    By the end of the battle, the decision was left to the crowd and viewers, reflecting the competitive nature of the clash. With strong reactions on both sides and no clear consensus, the battle stood out as a lively and contested matchup, adding another intense moment to the GZone stage.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for CJ Zino vs Proty */}
            {battle.slug === 'cj-zino-vs-proty' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between CJ Zino and Proty at the GZone Rap Battle League saw both MCs step into the ring for a high-energy and confrontational clash. From the opening moments, the tone was set with sharp exchanges and a strong contrast in styles, making it one of the more entertaining and dynamic battles on the card.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both battlers delivered aggressive performances built around personal angles and direct attacks. CJ Zino came with a commanding and forceful presence, focusing on dominance, confidence, and dismissive punchlines aimed at controlling the battle. In response, Proty took a more layered and creative approach, blending humour, wordplay, and cultural references to break down his opponent and win over the crowd.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout element of the clash was the clear stylistic contrast between the two. CJ Zino’s direct, high-pressure delivery kept the intensity high, while Proty’s mix of comedic timing and intricate schemes created memorable moments that resonated strongly with the audience. As the rounds progressed, the back-and-forth exchanges built momentum, with both MCs landing impactful lines and drawing strong reactions.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the final round, the battle had reached its peak, with both sides delivering their strongest material in an effort to close the contest. The hosts ultimately turned to the crowd to determine the outcome, and based on the reaction in the room, Proty edged the decision, the battle stands out as a lively and competitive clash that highlighted both entertainment and performance within the GZone.
                  </p>
                </div>
              </section>
            )}

            {/* Clash Summary for Ryno vs Tymeless */}
            {battle.slug === 'ryno-vs-tymeless' && (
              <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                
                <h2 className="text-3xl font-display italic uppercase text-white mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand" />
                  Clash Summary
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none prose-lg">
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    The battle between Rhino and Timeless at The GZone Rap Battle League saw both MCs step into the ring for a fierce and highly charged clash. From the opening moments, the atmosphere was intense, with both battlers bringing direct confrontation, sharp delivery, and a level of hostility that made the contest feel tense from start to finish.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    Across three rounds, both artists relied on aggressive personal angles and relentless attacks, creating a battle that stayed confrontational throughout. Rhino brought a forceful and technical approach, mixing direct pressure with structured rebuttals and moments of sharp timing. Timeless responded with a more theatrical style, using performance, crowd-facing delivery, and visual moments to keep the attention of the room and build momentum in his favour.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    A standout feature of the battle was the contrast between Rhino’s technical style and Timeless’s dramatic presentation. While Rhino delivered moments that highlighted his ability to think quickly and control the structure of his rounds, Timeless created memorable crowd reactions through a more performative approach that gave his material extra impact. As the battle progressed, the exchanges became more heated, with both MCs continuing to raise the intensity.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-light mb-8">
                    By the end of the clash, the crowd reaction appeared to give Timeless the edge, and he was ultimately treated as the winner on the day. While both battlers had strong moments across the contest, the battle stood out as one of the more intense and theatrical performances in the GZone catalogue, driven by high energy, strong reactions, and a clear sense of rivalry throughout.
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
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-display italic uppercase mb-6 text-white">Battle Stats</h3>
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
                className="w-full mt-8 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <Share2 size={16} /> Share Battle
              </button>
            </div>

            <div className="bg-brand/10 p-8 rounded-3xl border border-brand/20">
              <h3 className="text-xl font-display italic uppercase mb-4 text-brand">Support the Zone</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Watch the battles on YouTube and leave your comments there to support the culture.
              </p>
              <Link 
                to="/merch" 
                aria-label="Visit the official G Zone merch store"
                className="block text-center bg-brand text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                Visit Merch Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
