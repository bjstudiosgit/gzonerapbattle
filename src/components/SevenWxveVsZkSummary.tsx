import type { ReactNode } from "react";

const rounds = [
  ["Round 1 — Z.K", "Personal research, visual jokes, and repeated restarts", "Z.K attacks 7wxve's move from Skegness to Sheffield, build, finances, living conditions, online image, and alleged conduct. References to Ryno and Richie place 7wxve inside an existing battle history. Sound adjustments force Z.K to restart the passage several times before he completes the round."],
  ["Round 1 — 7wxve", "Direct character attack and dense rhyme pockets", "7wxve targets Z.K's image, alleged online conduct, home life, teeth, and credibility. Zack, cat, back, dash, fact, rat, gaff, clash, and related end sounds drive a long opening pocket. He also turns Z.K's Grimsby identity into GY and location-based pressure."],
  ["Round 2 — Z.K", "Prior footage, employment, and the handbag accusation", "Z.K says an earlier platform did not want 7wxve back, mocks footage of him rapping into a microphone stand, and uses the K from Another Hood comparison as the round's main visual device. Employment, smell, bedroom, party, prior-battle, and relationship claims build toward the repeated local-victim label."],
  ["Round 2 — 7wxve", "A direct answer that breaks down early", "7wxve immediately addresses the handbag accusation and says he has never robbed women. He begins a flashback and moves into a Preston and Zack sequence, but loses the material, calls time, and does not complete a full reply."],
  ["Round 3 — Z.K", "Status pressure and an extended closing run", "Z.K returns to money, travel, body odour, police, caravan, online-account, prior-platform, and old-lady allegations. The ending moves through YouTube, beats, Skegness, GY, Jet Li, test me, watched MC, technique, and don't stress me before he stops himself."],
];

const callbacks = [
  {
    title: "7wxve answers the handbag accusation",
    detail: "Z.K raises an allegation about stealing pensioners' bags in the first and second rounds. 7wxve opens his second by saying, for the record, that he has never robbed women and tries to explain what happened. It is his clearest direct answer, although the round ends early.",
  },
  {
    title: "Ryno and Richie become shared history",
    detail: "Z.K describes 7wxve as Ryno's former best mate and references Ryno's clash with Richie. The material is used to question loyalty and identity. We treat the relationships and events he describes as battle claims, not independently verified facts.",
  },
  {
    title: "Earlier platforms are used as status evidence",
    detail: "Z.K refers to Don't Flop, prior footage, Talk Is Cheap, and battles in other cities to argue that 7wxve has already been tested and beaten elsewhere. The references create a career-status case without supplying reliable scorecards or official margins for those older appearances.",
  },
  {
    title: "Location changes from biography to attack",
    detail: "Skegness, Sheffield, Grimsby, and GY recur throughout the clash. Z.K uses 7wxve's movement between places to question stability, while 7wxve turns Z.K's home area into part of his own direct attack. Neither battler develops the location exchange into a fully resolved rebuttal sequence.",
  },
  {
    title: "K from Another Hood becomes a visual comparison",
    detail: "Z.K says 7wxve rages in his bedroom while rapping into microphone stands, then asks him to remove his hat before repeating that he looks like K from Another Hood. The comparison joins remembered footage to something visible in the room and gives the second round its clearest recurring image.",
  },
  {
    title: "The live sound problems shape the performance",
    detail: "Both battlers restart material, but Z.K is especially affected early. The beat is lowered, the microphone is raised, and his first passage is delivered three times. Those repeats belong to one round and should not be read as extra material or separate turns.",
  },
];

const notableBars = [
  {
    name: "Z.K",
    bars: [
      ["Week one when he came in the chat, said that he would munch man for a snack. What the fuck you meant to mean by that?", "Z.K opens by taking a line attributed to 7wxve literally. Repeating chat, snack, and that gives the first attack an immediate rhythmic frame."],
      ["I've seen more meat on a chicken breast. My man's built like a stick insect.", "A simple size comparison moves from missing meat to the recognisable shape of a stick insect."],
      ["Saturday night your girl's coming like Kim K; Sunday morning, Cat Slater.", "Two television and celebrity images create an overnight before-and-after joke."],
      ["I test his temper — you look like a Dementor.", "Temper and Dementor connect behaviour to a Harry Potter creature and turn the opponent's appearance into the payoff."],
      ["He keeps raging bad in his bedroom, rapping straight into microphone stands. That's why we call him K from Another Hood.", "Z.K links alleged earlier footage to a recognisable character comparison, making online performance and appearance part of one image."],
      ["One outcome, two MCs, two mics.", "The counted setup briefly simplifies a dense final round and presents the clash as having only one possible result."],
      ["Last year he was getting cheeky on YouTube; this year he's gonna get bodied on beats.", "YouTube activity becomes the setup for a contrast between online talk and performance over a beat."],
      ["You're from GY town. You are not Jet Li — better not test me. You're a watched MC, got technique; don't stress me.", "The closing sequence uses place, a martial-arts reference, and connected end sounds to keep momentum through Z.K's final lines."],
    ],
  },
  {
    name: "7wxve",
    bars: [
      ["Where do I start with Zack?", "The direct-name opening establishes that the round will focus on Z.K rather than begin with a generic introduction."],
      ["If I target Zack, better dart and dash.", "Zack, target, dart, and dash create a compact pursuit image while continuing the opening end-sound pattern."],
      ["You come to a G-Zone event and ask Ginga Jay where the minors are at.", "7wxve brings the host and venue into a severe allegation. It is documented as battle material, not presented as a verified fact."],
      ["Fresh in your Turkish market Vapormax — the way that I shave him fast, you would think I was wearing a Jason mask.", "Brand, speed, and horror-film imagery sit inside the round's extended internal-rhyme pocket."],
      ["For the record, he mentioned handbags, so let me explain what happened. I've never robbed women.", "7wxve directly rejects Z.K's recurring accusation. The response matters even though the attempted explanation that follows is incomplete."],
    ],
  },
];

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
      <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
        <span className="w-8 h-1 bg-brand" />{title}
      </h2>
      {children}
    </section>
  );
}

export function SevenWxveVsZkSummary() {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="prose prose-invert prose-zinc max-w-none prose-lg space-y-8 text-zinc-300 leading-relaxed font-light">
          <p>In Episode 26, we put GZone newcomer 7wxve against Z.K in a clash built around personal research, local identity, online footage, and claims from earlier battles. Z.K takes the first turn and tries to establish control through recognisable images and a large volume of alleged background detail. 7wxve answers with denser rhyme pockets and direct confrontation.</p>
          <p>The opening is heavily affected by sound. Z.K begins his material, stops, restarts, and later delivers the same opening again after the beat is lowered and the microphone is raised. Once the passage settles, he moves through Skegness and Sheffield, build and posture jokes, finances, alleged living conditions, Ryno and Richie, and a short Dementor comparison. The repetition is technical recovery inside one round, not three separate attempts to score the same material.</p>
          <p>7wxve's first is more compressed. Zack becomes the anchor for cat, back, dash, fact, rat, gaff, clash, and related sounds. He attacks Z.K's credibility, appearance, teeth, home life, and alleged online conduct before moving into a Vapormax and Jason-mask sequence. The performance has forward motion, and we treat the harshest allegations as battle claims rather than verified facts.</p>
          <p>Z.K's second is his clearest complete round. He uses alleged earlier footage of 7wxve rapping into a microphone stand, asks him to remove his hat, and repeats the K from Another Hood comparison. Work, smell, the bedroom, handbags, prior battles, relationships, and the repeated local-victim label keep the round focused on a portrait of someone whose online aggression does not match his standing in person.</p>
          <p>7wxve begins his next turn with the battle's clearest direct response. After Z.K has repeated the handbag allegation, he says he has never robbed women and starts to explain what happened. The explanation does not develop into a full round: he loses the material during a Preston and Zack sequence and calls time.</p>
          <p>Z.K closes with another long personal round. Olympic and answer language leads into money, work, body odour, police, travel, caravan, online-account, prior-platform, and old-lady allegations. YouTube, beats, Skegness, GY, Jet Li, test me, watched MC, technique, and don't stress me give the finish its strongest sound chain.</p>
          <p>The crowd awarded Z.K the win. His greater volume, stronger completion, and ability to recover from the early sound problems gave him the clearer overall performance.</p>
        </div>
      </SummarySection>

      <SummarySection title="Round Structure">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rounds.map(([round, focus, detail]) => (
            <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
              <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p>
              <h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3>
              <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
            </article>
          ))}
        </div>
      </SummarySection>

      <SummarySection title="Rebuttals, Callbacks & Evolving Material">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {callbacks.map(({ title, detail }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
              <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
            </article>
          ))}
        </div>
      </SummarySection>

      <SummarySection title="Performance Analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">Z.K</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Z.K's main strength is persistence and volume. He survives multiple sound-related restarts, rebuilds the opening from the beginning, and still completes three substantial turns. That recovery matters because the technical interruptions could easily have ended the first round before its researched material became clear.</p>
              <p>His strongest writing creates immediate pictures: stick insect, Kim K and Cat Slater, Dementor, microphone stands, K from Another Hood, caravan travel, Jet Li, and the closing watched-MC sequence. These images are easier to retain than the long allegation lists surrounding them.</p>
              <p>The main weakness is excess. Severe personal claims, repeated passages, and long strings of alleged background information often compete with the cleaner visual jokes. We treat those claims as performance material rather than verified facts.</p>
              <p>The crowd awarded Z.K the win after he completed more, supplied the clearer recurring images, and produced the stronger finish.</p>
            </div>
          </article>
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">7wxve</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>7wxve's first round shows the outline of a direct, rhyme-led style. Zack supplies a stable sound for an extended sequence, while the references to GY, Ginga Jay, the Turkish market, Vapormax, and Jason keep parts of the writing attached to Z.K and the room.</p>
              <p>His best strategic moment is the immediate handbag response. Rather than letting the accusation remain unanswered, he says he has never robbed women and tries to give an account. We treat both the accusation and response as battle material.</p>
              <p>Control is the decisive problem. The first requires a restart and the second ends after only a short attempted explanation, preventing several potentially strong rhyme pockets from fully developing.</p>
              <p>We saw flashes of pace and directness, but they did not develop into a complete case strong enough to overcome Z.K's greater volume and control.</p>
            </div>
          </article>
        </div>
      </SummarySection>

      <SummarySection title="Notable Bars">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notableBars.map(({ name, bars }) => (
            <article key={name} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
              <div className="space-y-8">
                {bars.map(([quote, explanation]) => (
                  <div key={quote}>
                    <blockquote className="border-l-2 border-brand pl-4 text-white italic leading-relaxed mb-3">“{quote}”</blockquote>
                    <p className="text-zinc-400 text-sm leading-relaxed">{explanation}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SummarySection>
    </>
  );
}

export function SevenWxveVsZkResult() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
      <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
        <p>Z.K supplied the greater volume, the clearest recurring visual comparisons, and the stronger closing turn.</p>
        <p>7wxve showed directness and connected rhyme pockets, but his second response ended early and he could not build the same complete case.</p>
        <p>The crowd awarded Z.K the win for the more complete overall performance.</p>
      </div>
    </div>
  );
}

export function SevenWxveVsZkHighlights() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
      {[
        ["Z.K", [
          ["Technical recovery", "Restarts the opening after beat and microphone changes, then completes three substantial turns."],
          ["Visual comparisons", "Stick insect, Kim K and Cat Slater, Dementor, K from Another Hood, and Jet Li give the long personals clear images."],
          ["Opponent research", "Locations, online footage, earlier appearances, relationships, and alleged conduct keep the material aimed at 7wxve."],
          ["Best round", "Round two has the clearest recurring device through the microphone-stand footage and K from Another Hood comparison."],
          ["Main weakness", "Repeated passages and unverified allegation lists often bury the cleaner jokes and sound chains."],
          ["Winning edge", "Greater completion, clearer recurring images, and the stronger closing turn."],
        ]],
        ["7wxve", [
          ["Direct naming", "Zack anchors the opening and keeps the strongest rhyme pocket attached to the opponent."],
          ["Dense sound pattern", "Cat, back, dash, fact, rat, gaff, and clash create sustained momentum in the first turn."],
          ["Immediate response", "He directly rejects the handbag accusation at the start of his second turn."],
          ["Room-specific writing", "Ginga Jay, GZone, GY, and location references connect the attack to this event."],
          ["Main weakness", "The second turn ends early and his strongest rhyme pockets do not develop into a complete performance."],
          ["Outcome", "Promising pace and directness do not develop into a complete case against Z.K's larger recorded performance."],
        ]],
      ].map(([name, highlights]) => (
        <div key={name as string} className="mb-6 last:mb-0">
          <h4 className="text-brand font-display uppercase text-lg mb-2">{name as string}</h4>
          <div className="divide-y divide-white/5">
            {(highlights as string[][]).map(([label, detail]) => (
              <div key={label} className="py-3">
                <h5 className="text-white text-sm font-bold mb-1">{label}</h5>
                <p className="text-zinc-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
