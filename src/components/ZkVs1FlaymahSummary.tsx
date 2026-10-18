import type { ReactNode } from "react";

const clashSummary = [
  "Z.K and 1Flaymah opened the night at Peacocks Boxing with a clash of two recognisable approaches: Grimsby grime, visual jokes and a point to prove on one side; dancehall delivery, repeated hooks and theatrical aggression on the other. Z.K went first and framed the booking as his chance to make it three wins in a row. Flaymah met that confidence with fully-flame, fully-active energy and made the crowd part of his rounds from the start.",
  "Z.K's opening builds a weekly timetable of insults before moving through Ladbrokes, bingo and the Jackson 5. The Tito comparison is a quick, recognisable picture; his scaffolding lines then switch from mocking Flaymah to explaining his own working identity. He says YouTube viewers thought he beat Natty and presents himself as unbeaten. That is Z.K arguing his own standing inside the clash. A pull-up brings the opening back before he adds further appearance jokes and challenges the value of Flaymah's earlier win over CJ.",
  "Flaymah immediately makes the exchange more personal. His opening care-home and foster-family wordplay prompts a stop and a restart, followed by an attack built around a photograph he describes of Z.K beside a naked man. From there, GY becomes a spelling joke and an order to go back to Grimsby. The round's clearest extended construction moves through ABC, D, BP and E before reaching Muhammad Ali's butterfly-and-bee phrase. Several pull-ups return him to the same opening, with the host explicitly calling out the number of reloads.",
  "Z.K's second begins with a beat-level adjustment before the Uncle Delroy setup leads into Anakin and the Primark mannequin comparison. Film, television and gaming references keep changing the picture: Scary Movie, Shorty and Roblox sit alongside age and appearance attacks. The mutton-and-rice versus nothing-was-nice couplet interrupts the jokes with a compact contrast in upbringing. Later, Z.K recalls Flaymah stamping on a picture in an earlier clash and losing a shoe, then attacks the tie and balaclava as parts of his opponent's presentation.",
  "Flaymah answers with a repeated question about why Z.K raps and talks that way. Punch, snooze and booze give the opening a simple sound pattern; the Bruno Fernandes comparison supplies the round's most immediate repeatable joke. He then insists he will win using his own flow, refusing to rap or act like the others. The fake-yardman challenge turns the clash toward authenticity before Zack and Robinson become the material for his closing name attack.",
  "In the final exchange, Z.K changes the rhythmic approach and announces classic Grimsby flows. Video, Grimsby flows, stinky flow and Pinkies keep the opening connected by sound, while Krabby Patties gives the later stretch another cartoon image. Flaymah closes by turning Z.K into zombie killer, moving through Bambi, brandy and family insults before the repeated pull-it refrain takes over. His sound effects and movements draw a joking interruption from the host; the final passage briefly calls Z.K a nice guy before returning to the exaggerated lyrical attack and a goodbye to GY.",
  "Both MCs completed all three rounds. Z.K supplied a steady run of visual comparisons, local pride and reminders of earlier clashes; Flaymah made his slogans, name flips and repeated passages into a larger performance. At the close, the host checked support for Z.K in the blue corner and Flaymah in the red corner, then announced 1Flaymah as the winner. The decision belongs to the audience vote, without a stated round-by-round score."
];

const rounds = [
  ["Round 1 — Z.K", "A weekly roast and a claim to momentum", "The day-by-day opening leads into Ladbrokes, bingo, Tito and the Jackson 5. Scaffolding and coming from the mud establish Z.K's own identity before he argues for a third straight win, disputes the reception of his Natty battle and diminishes Flaymah's CJ result. A pull-up repeats the opening before the round continues."],
  ["Round 1 — 1Flaymah", "Personal pressure and an alphabet scheme", "The care-home opening and a photograph-based attack lead into GY wordplay, ABC, D, BP and E. Muhammad Ali's butterfly-and-bee phrase closes the clearest letter sequence. Repeated restarts keep bringing back the opening, and the host remarks on the number of reloads."],
  ["Round 2 — Z.K", "Character comparisons and remembered footage", "After the beat is lowered, Uncle Delroy, Anakin, a Primark mannequin, Shorty and Roblox supply a sequence of recognisable images. Mutton and rice becomes a contrast with Z.K's upbringing. He then recalls the picture-stamping and flying-shoe moment from an earlier clash before targeting Flaymah's clothes and persona."],
  ["Round 2 — 1Flaymah", "Delivery criticism, football and identity", "Snooze, booze, nudes and lose organise the opening. Why-you-rap-like-that phrasing attacks Z.K's delivery, while the repeated Bruno Fernandes comparison supplies a clear punch. Flaymah defends his own flow and Jamaican identity, then closes on Zack and Robinson wordplay."],
  ["Round 3 — Z.K", "Grimsby flow and a final run of jokes", "Z.K explicitly changes approach, linking video, Grimsby flows and stinky flow. The round returns to clothing, food and appearance material, including Krabby Patties, before moving through claims about borrowed bars and a reference to 7wxve's stumbling. He completes the turn and calls time."],
  ["Round 3 — 1Flaymah", "Name flips and a theatrical finish", "Zombie killer opens a sequence through Bambi and brandy. Family-directed insults and sound effects prompt a host interruption before Flaymah resumes. Cranberry and Cadbury, Michael Jackson and bad, the pull-it refrain and a final GY dismissal keep the finish moving between punchlines and performance."],
];

const callbacks = [
  ["Z.K argues his own record", "Two wins in a row and the claim that YouTube viewers backed him against Natty make momentum part of Z.K's opening. He also says Flaymah got lucky against CJ. These are competing status claims inside the battle, rather than a new decision on either earlier contest."],
  ["A photograph returns as material", "Flaymah repeatedly asks why Z.K was smiling beside a naked man in a photograph. The image is described in the lyrics; there is no clear indication here that Flaymah produces a new physical prop. Its role is to turn remembered material into another personal angle."],
  ["The shoe becomes the punchline", "Z.K recalls Flaymah stamping on a picture during his first clash and says the shoe flew out of the ring. Instead of arguing about the picture's subject, he mocks the earlier performance itself. The remembered prop action becomes a joke about Flaymah losing control of the moment."],
  ["Grimsby becomes a shared target", "Z.K uses Grimsby and his working life to give the performance a local identity. Flaymah answers that identity with GY spelling and repeated orders to go home. In the final round, Z.K explicitly returns to classic Grimsby flows while Flaymah ends with another GY dismissal."],
  ["Flaymah defends his own voice", "Z.K attacks Flaymah's presentation and later attributes a bar-borrowing claim to Afro. Flaymah's own second-round position is that he will use his own flow and will not rap or act like the others. The shared theme is originality; the third-round accusation comes later, so the second-round defence should not be labelled a live rebuttal to it."],
  ["Reloads and sound adjustments do different jobs", "The host tells Z.K he earned an early pull-up and comments on Flaymah receiving too many reloads. Elsewhere, the beat is explicitly lowered for Z.K and raised for Flaymah. These are repeated sections within the same rounds: some amplify reactions, while others make the performance audible."],
];

const performances = [
  {
    name: "Z.K",
    paragraphs: [
      "Z.K's strongest writing gives the listener a picture quickly. Tito, the Primark mannequin, Shorty, Roblox and Krabby Patties all make the target recognisable without a long explanation. The weekly opening gives the first round a clear structure, and the mutton-and-rice couplet compresses opponent attack and self-description into two connected lines.",
      "His identity is consistent across the rounds. Scaffolding, coming from the mud, Grimsby and the final flow change give the jokes a speaker with a specific background. He also makes earlier battles part of the argument: his own Natty reception, Flaymah's CJ win and the remembered flying shoe each become ways to question who deserves the stronger standing.",
      "He completes three substantial turns and resumes after the sound adjustment. The limitation is that the references sometimes arrive as a list, with severe personal allegations and generic sexual insults interrupting the clearer ideas. His third-round change supplies variety, but the strongest individual comparisons do not become one sustained argument across the whole battle."
    ]
  },
  {
    name: "1Flaymah",
    paragraphs: [
      "Flaymah gives each round a recognisable way back in. Fully flame, fully active, the repeated opening, why you rap like that and the pull-it refrain all work as performance cues. His Jamaican phrasing and dancehall rhythm make repetition part of the delivery rather than simply another list of jokes.",
      "There is connected writing inside that performance. The alphabet sequence links letter sounds and abbreviations, the Fernandes joke repeats the same comparison across two partners, and the final turn makes Z.K's name the setup for zombie killer. Cranberry and Cadbury provide another short sound-and-image connection before the refrain returns.",
      "His weaker passages lean on family insults, stereotypes and broad threat language, while frequent returns to the opening delay fresh material. The host's interruptions and comments show how much the performance draws the room into the exchange, but a reload is not a round score. The final crowd decision awards him the win without establishing that every individual round or punch went his way."
    ]
  }
];

const notableBars = [
  {
    name: "Z.K",
    bars: [
      ["On Monday he's a part time waiter / Tuesday comes he's a white boys skater", "The opening uses the days of the week as a scaffold for changing caricatures. Waiter and skater establish the rhyme before the schedule keeps extending."],
      ["Who invited the Jackson 5 into G-Zone / Why am I clashing with Tito?", "Z.K shifts from the famous group to a named member, making the appearance comparison specific enough to land as one quick image."],
      ["Two wins in a row, let's make it a hattie", "The football shorthand turns his claimed momentum into a hat-trick target. It states how Z.K wants the room to frame the booking."],
      ["I bring the force like Anakin", "The Star Wars reference gives force a second meaning: the power of the fictional character and the pressure Z.K claims to bring to the clash."],
      ["Flamers built like a Primark mannequin", "A familiar shop display becomes the body comparison. The mannequin ending also connects back to Anakin, keeping the reference change inside the same sound pattern."],
      ["If G-Zone was Scary Movie you're Shorty / Get him off Roblox now he's 40", "A film character, a game and an age joke are joined by the Shorty/forty sound. The sequence keeps the opponent inside recognisable popular-culture images."],
      ["You grew up on mutton and rice / I grew up when nothing was nice", "Mutton and rice becomes nothing was nice. The close sound match turns a food reference into a claim about the difference between their upbringings."],
      ["Attitude stinks, I've got the stinky flow", "Z.K carries the same smell idea across attitude and delivery. It belongs to the final round's more explicit focus on flow and connected end sounds."],
      ["You're living underwater eating Krabby Patties", "The SpongeBob reference supplies an immediate cartoon setting. It is a compact visual joke rather than an allegation that needs background research."],
    ]
  },
  {
    name: "1Flaymah",
    bars: [
      ["Fully flame, fully active", "The paired phrase announces his identity in a form that is easy to repeat. Fire and activity remain the performance's recurring promises."],
      ["Why me make your son say ABC / Then after me give your girl the D", "A familiar alphabet lesson becomes the setup for a sexual letter joke. The passage continues through BP and E, extending the letter device beyond its first payoff."],
      ["Punch man up like Muhammad Ali / Fly like Butterfly sting like B", "The familiar Ali phrase completes the letter-sound sequence: B works as both the alphabet letter and the bee in the comparison."],
      ["Why you rap like that? / Tell me why you chat like that?", "The repeated question makes Z.K's delivery the target. Its parallel shape also gives Flaymah a hook that can survive a restart."],
      ["Ex-girl look like Bruno Fernandez / New girl look like Fernandez again", "Both relationships receive the same footballer comparison. Again is the turn: changing partners is presented as failing to change the result."],
      ["Kill ZK with me own a flow / And take the show, me nah go act like them", "The rhyme ties flow to show while the statement defends his own style. The victory claim is built around remaining recognisably Flaymah."],
      ["ZK means zombie killer / Shut your mouth and never kill no zombie", "He expands the initials into an invented title and immediately denies that Z.K has earned it. The opponent's name becomes the premise of the final round."],
      ["Me a go spill your juice like cranberry", "The threat uses a familiar red drink as its visual comparison, setting up the cranberry/Cadbury sound pairing that follows."],
      ["It my fault them love chocolate / That's why them want eat me Cadbury", "The chocolate image turns into a boast through a recognisable brand. Cadbury connects back to cranberry while changing the premise from threat to attraction."],
      ["I'm joking / Yo, you a nice guy", "The sudden friendly aside breaks the threatening character for a moment before the attack resumes. Its value is theatrical timing rather than a complex rhyme."],
    ]
  }
];

const technicalHighlights = [
  {
    name: "Z.K",
    items: [
      ["Structured opening", "The days-of-the-week sequence gives the first set of insults a clear order and recurring rhyme."],
      ["Visual comparisons", "Tito, the Primark mannequin, Shorty and Krabby Patties make the target easy to picture."],
      ["Sound-led contrast", "Mutton and rice/nothing was nice turns a close sound match into a compact statement about upbringing."],
      ["Personal identity", "Scaffolding and Grimsby recur as the ground from which he challenges Flaymah's standing."],
      ["Performance callback", "The remembered flying shoe attacks how an earlier prop routine was delivered."],
      ["Final-round variation", "He announces classic Grimsby flows and moves through a longer connected sound pattern."],
      ["Main limitation", "Lists of comparisons and heavy personal attacks sometimes interrupt the more focused writing."],
    ]
  },
  {
    name: "1Flaymah",
    items: [
      ["Recognisable hooks", "Fully flame, fully active and why you rap like that give repeated passages clear entry points."],
      ["Extended letter device", "ABC, D, BP and E lead toward the butterfly-and-bee phrase."],
      ["Repeated comparison", "The Fernandes-again punch uses repetition as the joke's payoff."],
      ["Name-based opening", "Zombie killer turns Z.K's initials into a claim he can immediately attack."],
      ["Connected images", "Cranberry and Cadbury move between a threat and a boast while keeping the sound linked."],
      ["Theatrical delivery", "Sound effects, refrains and the nice-guy aside give the final turn changes of tone."],
      ["Main limitation", "Frequent restarts and broad family insults sometimes hold up the more specific punches."],
    ]
  }
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

export function ZkVs1FlaymahSummary() {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="prose prose-invert prose-zinc max-w-none prose-lg space-y-8 text-zinc-300 leading-relaxed font-light">
          {clashSummary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
          {callbacks.map(([title, detail]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
              <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
            </article>
          ))}
        </div>
      </SummarySection>

      <SummarySection title="Performance Analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performances.map(({ name, paragraphs }) => (
            <article key={name} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3>
              <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
          ))}
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

export function ZkVs1FlaymahResult() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
      <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
        <p>Z.K completed three rounds built around visual jokes, Grimsby identity and earlier battle references. His strongest contrasts and comparisons kept the contest competitive through the final turn.</p>
        <p>1Flaymah combined letter schemes, name flips and recognisable hooks with a theatrical closing performance. His repeated passages brought the host and audience into the exchange.</p>
        <p>The host called for support for Z.K in the blue corner, then 1Flaymah in the red corner, and announced 1Flaymah as the winner. The audience decision is clear; no numerical round score is given.</p>
      </div>
    </div>
  );
}

export function ZkVs1FlaymahHighlights() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
      {technicalHighlights.map(({ name, items }) => (
        <div key={name} className="mb-6 last:mb-0">
          <h4 className="text-brand font-display uppercase text-lg mb-2">{name}</h4>
          <div className="divide-y divide-white/5">
            {items.map(([label, detail]) => (
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
