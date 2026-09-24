import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const rounds = [
  ["Round 1 — Badee Harz", "Attack the image before the slogans", "Badee opens on the uncovered face, clothing, height and delivery. Feet hanging beyond a hospital bed become six foot seven turning into six foot deep. She invokes Flaymah's treatment of CJ-Zino, challenges his patois and tries to separate the intimidating fire character from the performer standing in front of her."],
  ["Round 1 — 1Flaymah", "Questions, prebuttals and a recurring hook", "Who told Badee to rap becomes the repeated opening question. Microphone-to-cooking-pot insults and snapback/cap wordplay lead into anticipated Jamaican stereotypes and family accusations. Rum and sobriety reverse an attraction claim before the more-man refrain stretches the round into a song-like finish. The repeated starts belong to this turn, not additional rounds."],
  ["Round 2 — Badee Harz", "Demonstrate the format, then question its value", "Badee announces that Flaymah keeps making tracks in the ring and that it is now her turn. She adopts a hook-led dancehall delivery, spells out W-A-R, makes him her son through a childbirth image and repeats the gunshot hook. Her hooks-and-tracks versus bars-and-flows criticism makes the stylistic imitation part of the argument."],
  ["Round 2 — 1Flaymah", "Connected images and a reply to Deeno", "The Scott-or-Paddy question restarts a sequence containing the football-net image, attraction reversals and makeup as a disguise. Flaymah explicitly disputes a no-suction line attributed to Deeno. His claim that the clash was cancelled twice becomes two lyrical killings; side-girl and food-side language, body count and the paid contract-killer finish add further connected punches."],
  ["Round 3 — Badee Harz", "Reclaim the 125 and challenge the attraction story", "Badee salutes Deeno, says she is taking this beat and returns to hooks not bars. She says Flaymah tried to recruit Deeno for the 125 routine, then redirects the number into a conditional joke about Flaymah being unable to satisfy her. His flame cannot match hers; alleged earlier praise, group-chat complaints and follower-count taunts support her claim that his dismissive act is inconsistent."],
  ["Round 3 — 1Flaymah", "Make the inherited joke audible again", "Somebody, nobody, anybody and Badee create a repeated name pattern. Flaymah brings back the motorbike voice, calls to Deeno and makes the impression a recurring performance cue. The date-to-the-gym reversal and meat/buns/Whopper image lead toward another motorbike return, then Badee/body/body bag and the repeated bad-name finish."],
];

const callbacks = [
  {
    title: "Where the 125 comes from",
    detail: "In Episode 17, Deeno connected Badee's deep voice to a motorbike, then followed you look like a 125 with you ride man like a 125. The original already combined a voice caricature with sexual riding wordplay. Episode 24 gives both battlers a familiar joke to dispute without rebuilding that setup.",
    source: ["deeno-vs-badee-harz", "1x17 — Deeno vs Badee Harz"],
  },
  {
    title: "Badee challenges the proposed Deeno cameo",
    detail: "Badee says Flaymah tried to call Deeno into their battle to do the one-two-five. That turns the callback into an authorship attack: she portrays her current opponent as seeking help from the man who first made the routine memorable. The attempted arrangement is her account, not independently established backstage history.",
  },
  {
    title: "The proposed cameo is disputed during the round",
    detail: "After Badee raises the attempted Deeno appearance, an interjection says Deeno beg me first, by the way. That contests who approached whom. The raw transcript does not label the speaker securely, so the exchange supports a live dispute over the proposed help, not a settled account of an arrangement. Badee then restarts and continues her 125 counter.",
  },
  {
    title: "The number is turned against Flaymah",
    detail: "If you was my man, I would need that one-two-five changes who the joke embarrasses. Deeno's original already included a sexual riding image; Badee now directs the sexual-satisfaction taunt at Flaymah. The transcript supports that reversal, but not a more precise explanation of what needing the 125 means.",
  },
  {
    title: "Flaymah restarts the motorbike in his last round",
    detail: "After Badee has addressed the routine, Flaymah says the motorbike starts when she gets ready to talk and calls to Deeno: that is how she talks. He returns to the comparison near the finish. This preserves the old voice caricature through imitation rather than directly answering every part of her new sexual counter. The exchange is clear; its wording being improvised is not established.",
    source: ["deeno-vs-badee-harz", "The earlier motorbike comparison"],
  },
  {
    title: "No suction is a separate argument with Deeno",
    detail: "Deeno's Episode 17 second round linked skinny lips to wouldn't have no suction. Flaymah invokes that phrase, names Deeno and calls the claim a lie before offering his own obscene boast. He answers the earlier appearance-based assumption with a claimed experience. This is a separate callback from the motorbike sequence; the boast is not evidence of a real encounter.",
    source: ["deeno-vs-badee-harz", "1x17 — Deeno's second-round angle"],
  },
  {
    title: "She copies the song structure to expose it",
    detail: "After Flaymah's first round, Badee announces my turn and performs in the hook-led style she has criticised. The point is demonstrative: she can make a track too, but argues that doing so is not the same as landing opponent-specific bars. Her third returns to bare hooks not bars, connecting the imitation to an explicit criticism rather than leaving it as a flow change.",
  },
  {
    title: "The hooks debate has an earlier history",
    detail: "The Episode 16 and Episode 19 write-ups already distinguish Flaymah's recurring slogans and dense delivery from his opponents' counter-writing. Badee develops that established tension into this battle's central formal argument. The connection is a continuing criticism of his approach, not proof that she is quoting a specific Btizz or CJ punch.",
    source: ["cj-zino-vs-1flaymr", "1x19 — CJ-Zino vs 1Flaymr"],
  },
  {
    title: "The removed mask remains usable material",
    detail: "Flaymah removed his balaclava during the Btizz battle; CJ later attacked the uncovered face as part of the constructed persona. Badee's opening question about taking the bally off revisits that established exposure. She is reopening a known weakness in the character rather than unveiling a new identity.",
    source: ["btizz-vs-1flaymr", "1x16 — Btizz vs 1Flaymr"],
  },
  {
    title: "Patois criticism meets an anticipated stereotype",
    detail: "Badee gives his patois zero ratings and questions his claimed origin. Flaymah's answer identifies himself as a yard man and anticipates stereotypes. The earlier Btizz and CJ clashes also challenged the Jamaican presentation. These are attacks on his battle persona; the accusation that his nationality is false is not a verified fact.",
    source: ["btizz-vs-1flaymr", "The earlier authenticity angle"],
  },
  {
    title: "She might say is a prebuttal",
    detail: "Flaymah forecasts accusations involving women and children, then supplies his own answers. His repeated she-might construction matters: it is an attempt to control possible material before Badee uses it. It should not be retold as evidence that she has already delivered every accusation, or that the underlying allegations are true.",
  },
  {
    title: "Attraction and rejection keep changing sides",
    detail: "Flaymah alternates desire with rejection and qualifies one attraction claim through rum and sobriety. Badee answers that he wants her but cannot get her, then points back to his praise during the Btizz clash. The earlier transcript contains a garbled body comparison involving Badee, supporting the link without supplying a reliable word-for-word quotation or proof of his real intentions.",
    source: ["btizz-vs-1flaymr", "1x16 — The earlier Badee reference"],
  },
  {
    title: "Flame becomes something Badee can outdo",
    detail: "Flaymah explicitly names everything-bun as his ad-lib and fully-flame as his slogan. Badee later says his flame could never be as hot as hers. That takes the opponent's own measure of power and claims the stronger version. Earlier opponents tried to extinguish him; here she argues that she can exceed his heat.",
    source: ["cj-zino-vs-1flaymr", "The fully-extinguished argument in 1x19"],
  },
  {
    title: "Killing claims are reduced to tiny targets",
    detail: "Badee repeatedly promises to kill him lyrically and send him to a hospital bed. Flaymah answers in round two that she could not kill a fly, mosquito or bee. The threat is made ridiculous by shrinking its target, before his next insult escalates back into sexual and health-related shock material.",
  },
  {
    title: "The guest identifies the deciding performance tool",
    detail: "The post-battle feedback specifically praises Flaymah's creativity, sound effects and coughing, while also crediting Badee's confidence, wordplay and direct eye contact. That gives the vocal impressions a documented role in one guest's preference. The later room vote is a separate step; the transcript does not give a scored round-by-round breakdown.",
  },
];

const notableBars = [
  {
    name: "Badee Harz",
    bars: [
      ["Don't press my buttons ... you're getting diced / And cooked like mutton", "Being provoked becomes a cut-and-cook threat. Diced and mutton keep the second image connected, rather than changing subjects after the buttons setup."],
      ["Your feet will hang at the hospital bed / You lanky fuck", "The threat of putting him in hospital is tailored to his height: even the bed cannot contain him. That prepares the more compact height reversal which follows."],
      ["Six foot seven / But right now you're six foot deep", "Flaymah's height becomes burial depth. The repeated six-foot measurement makes the transformation immediate and keeps it specific to the tall opponent."],
      ["And I'm giving his patois / Zero ratings", "Badee makes delivery itself a target, challenging a recognisable part of Flaymah's performance identity. Her surrounding nationality accusations remain taunts, not biographical evidence."],
      ["And just make bare tracks in this ring ... My turn", "This is the announced premise of round two. Her following hook-led performance demonstrates the style she is criticising, so its musicality is also an argument about what should count as battle writing."],
      ["Never get a gal like me you need practice", "Badee rejects Flaymah's control of the attraction story. Rather than accept his ability to choose or reject her, she casts access to her as something beyond him."],
      ["Easy to make them hooks and tracks / You ain't got no bars and flows", "The critique separates a memorable song structure from opponent-specific writing. It also creates a tension in her own round: she has deliberately adopted the very format she says is easy."],
      ["You're my son", "The surrounding childbirth image turns lyrical superiority into motherhood. Badee places Flaymah below her as someone she could have produced, reversing the domestic role his first-round cooking insults tried to impose."],
      ["You try and call Deeno / To come in our battle / Do the one, two, five", "She identifies both the routine and its earlier performer. The alleged request for help makes the inherited 125 bar an argument about dependence on Deeno's material, not just another voice joke."],
      ["If you was my man / I would need that one, two, five / Can't satisfy her", "This is Badee's central reclamation of the number. Her conditional setup redirects the embarrassment toward Flaymah's alleged inadequacy. The exact meaning of needing the number remains unclear, so the explanation should not invent an extra punchline."],
      ["Your flame can never be as hot as mine", "His stage identity supplies the comparison and she claims to surpass it. Heat becomes a contest she can win rather than a quality belonging exclusively to the battler named Flame."],
      ["You know you can't take that back", "In the surrounding passage Badee invokes alleged earlier praise of her appearance. The line makes his present insults answerable to a previous position she attributes to him; it is a consistency challenge, not independent confirmation of that conversation."],
    ],
  },
  {
    name: "1Flaymah",
    bars: [
      ["Put down the mic and take up the pot", "A single object swap turns dismissal from the battle into a sexist demand that Badee return to domestic work. Its brevity helps it function as a hook, though the premise relies on a stereotype rather than a detailed rebuttal."],
      ["Me feel like fi give me snap back ... A cap", "The snapback sets up cap as both headwear and an accusation of lying. The transcript garbles the surrounding grammar, but the hat-to-falsehood mechanism is preserved."],
      ["But me change me mind when me sober man", "The preceding attraction claim is immediately withdrawn through a drinking-versus-sobriety switch. It becomes part of the position Badee challenges when she later says he wants her and has praised her before."],
      ["Everything bun that a my adlib man / Fully flame that a my slogan", "Flaymah names the two devices that organise his persona. The explicit ownership claim matters when Badee adopts his performance style and later declares her own flame hotter."],
      ["Now you look like a football net", "The gunshot setup makes the holes in a net the visual result of the threat. Body also sounds close to the name he keeps addressing, beginning a pattern that becomes the final body-bag sequence."],
      ["No suction ... Deeno come say she have no suction brother", "Flaymah names Deeno and calls the old claim a lie. Deeno's Episode 17 second round inferred a sexual inadequacy from her lips; Flaymah counters with an obscene claim of experience, while keeping Badee inside the same insulting sexual frame."],
      ["Don't take off your makeup ... That's a perfect disguise", "Makeup is reframed as concealment instead of enhancement. The concealed-face motif also echoes the mask criticism being directed at Flaymah, although the transcript does not explicitly announce that connection."],
      ["A two time the clash ya cancel / Bro, lyrically me fi kill Badee twice", "He converts his claim that the clash was cancelled twice into a pair of lyrical killings. The repeated two gives the scheduling complaint a punchline; the cancellation history is being reported by him."],
      ["Me body counter increase", "Body count is linked directly to the opponent's name and the idea of a lyrical kill. It prepares the repeated Badee/body language which becomes more elaborate in his final round."],
      ["She not kill a fly, mosquito or bees", "Badee's repeated killing boasts are answered with a scale reduction: he says she cannot even manage tiny insects. The contrast attacks the credibility of her threats before the round changes direction again."],
      ["Me a contract killer", "The closing threat becomes paid work. Contract and the following bread line frame the clash as an assignment and a fee rather than personal hatred, giving the violent performance a final transactional punch."],
      ["Badee think she a somebody / Badee me a tell you say you a nobody", "Somebody and nobody turn status into a repeatable name pattern. The surrounding anybody/Badee repetitions make the sounds do much of the performance work, even where the argument itself is simple."],
      ["The motorbike just start / Deeno / That is how she talk", "Flaymah turns the old 125 image back into a voice impression and explicitly brings Deeno into the moment. It arrives after Badee has addressed the number, keeping the original caricature alive rather than accepting her attempt to redirect it."],
      ["Me wan take you out pan a date / Pan a date to the ... gym", "The offer of a date sets up apparent attraction, then the destination changes it into a body insult. It repeats the round's wider tactic of offering intimacy only to withdraw it."],
      ["Put the meat in her buns / And call it a real life Whopper", "Meat, buns and Whopper keep the sexual double meaning inside one burger image. The surrounding claim about Marni Gramz is part of Flaymah's performance, not a verified relationship or encounter."],
      ["When you talk you sound like motorbike", "The late return makes the voice joke a recurring thread rather than a single mid-round impression. It reconnects his finish to Deeno's original image and Badee's earlier 125 counter."],
      ["It's ironic your name Badee / Cause me a put Badee body in a body bag", "The opponent's name, body and body bag accumulate into the finishing construction. The following bad/look-bad/dress-bad repetition extends the same sound through the closing threats."],
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

export function BadeeHarzVs1FlaymahSummary() {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="prose prose-invert prose-zinc max-w-none prose-lg space-y-8 text-zinc-300 leading-relaxed font-light">
          <p>Episode 24 brings Badee Harz back after her clash with Deeno and 1Flaymah back after his win over CJ-Zino. Their history is part of the writing from the start: the removed balaclava, Jamaican presentation, repeating hooks and fire identity are already familiar targets. The most important inherited material, though, is Deeno&apos;s comparison of Badee&apos;s deep voice to a 125cc motorbike in <Link className="text-brand underline underline-offset-4" to="/battle/deeno-vs-badee-harz">Episode 17</Link>.</p>
          <p>Badee goes first and attacks the man beneath the image. The hospital bed that cannot fit his feet leads into six foot seven becoming six foot deep. The uncovered face and patois criticism revisit vulnerabilities already explored by Btizz and CJ. Flaymah answers with a different kind of organisation: repeated questions, a cooking-pot dismissal, snapback/cap wordplay and anticipated accusations, all built to return to recognisable rhythmic cues.</p>
          <p>Round two makes the disagreement about form explicit. Badee announces that Flaymah comes to the ring making tracks and now it is her turn. She demonstrates the hook-led style, then says hooks and tracks do not amount to bars and flows. Her son/childbirth image and repeating gunshot hook put her inside his musical approach while challenging its value as battle writing. Flaymah&apos;s reply combines repeatable openings with clearer individual constructions: football-net holes, two cancelled clashes becoming two lyrical killings, and the contract-killer finish.</p>
          <p>Deeno is present in the argument before the 125 returns by name. Flaymah&apos;s second round invokes no suction, addresses Deeno and calls the claim a lie. It answers Deeno&apos;s Episode 17 second-round inference from Badee&apos;s lips with an obscene claim of experience. The sexual, family, nationality and health accusations throughout this clash remain performance material; what matters here is how each battler redirects them.</p>
          <p>Badee&apos;s third is the clearest attempt to reclaim the old motorbike joke. She salutes Deeno, says she is taking this beat and accuses Flaymah of trying to bring him into the battle for the one-two-five. Deeno&apos;s original already joined the bike image to sexual riding wordplay; her answer redirects the sexual joke. If Flaymah were her man, she says, she would need that 125 because he could not satisfy her. She follows it with his flame never being as hot as hers and a reminder of the praise she attributes to him in the Btizz clash.</p>
          <p>Flaymah&apos;s last round refuses to let that end the routine. Badee getting ready to speak becomes a motorbike starting; he calls to Deeno, performs the voice comparison and returns to it near the close. The response preserves the audible caricature rather than supplying a detailed answer to her sexual reversal. Somebody/nobody/Badee repetition, the date-to-the-gym switch and a final Badee/body/body-bag chain give the impression a wider round to sit inside.</p>
          <p>The finish makes the performance distinction unusually clear. The guest feedback praises Badee&apos;s confidence, wordplay and eye contact, but prefers Flaymah&apos;s creativity and sound effects, specifically mentioning the coughing. The hosts then run the room vote twice, asking more people to participate, and announce 1Flaymah as the winner. The existing official record agrees. No numerical round score is established by this transcript.</p>
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
        <p className="text-zinc-400 text-sm leading-relaxed mt-6">Repeated passages, requests to hear the beat and reloads sit inside these six turns. Their presence does not establish that every callback or reply was written on the spot.</p>
      </SummarySection>

      <SummarySection title="Rebuttals, Callbacks & Evolving Material">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {callbacks.map(({ title, detail, source }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
              <h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
              {source && <Link to={`/battle/${source[0]}`} className="inline-block mt-4 text-sm text-brand underline underline-offset-4 hover:text-white">{source[1]}</Link>}
            </article>
          ))}
        </div>
      </SummarySection>

      <SummarySection title="Performance Analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">Badee Harz</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Badee&apos;s strongest writing changes the direction of an existing idea. Six foot seven becomes six foot deep; Flaymah&apos;s heat becomes something hers can exceed; the old 125 routine becomes a taunt about his inadequacy. These moments need the opponent or the earlier battle to make full sense.</p>
              <p>Her second-round imitation is a deliberate formal response. Announcing my turn before the dancehall-style hook makes the switch part of her argument that he is producing tracks inside a battle. She then returns to hooks not bars in the third, so the critique has continuity across her turns.</p>
              <p>The third is her most connected argument: her salute to Deeno and use of the beat, the alleged request for a cameo, the 125 flip, the hotter flame and the earlier compliment she invokes all challenge Flaymah&apos;s independence or consistency. The guest&apos;s praise for her eye contact and confidence supports the impression of someone willing to address him directly while delivering those lines.</p>
              <p>The weakness is that the chosen imitation also exposes her to her own criticism. Repeated hooks, restarts and more general appearance or sexual insults can delay the next specific punch. The 125 reply is pointed, but it does not stop Flaymah from reviving the older vocal joke in the last turn.</p>
            </div>
          </article>
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">1Flaymah</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Flaymah builds his rounds around things the room can recognise quickly: a recurring question, a short slogan, a gunshot cue or an impression. Who told Badee to rap, the Scott-or-Paddy opening and somebody/nobody each give a long turn a repeatable entry point.</p>
              <p>There is connected punchline writing inside that repetition. Snapback/cap, the football net, the two-cancellations/two-killings line, the gym-date reversal and meat/buns/Whopper all make their setup pay off within one image. The final body-bag sequence keeps the opponent&apos;s name central to the close.</p>
              <p>His strongest use of history is performative. He can disagree with Deeno&apos;s no-suction claim in one round and recruit Deeno&apos;s motorbike caricature in the next. After Badee tries to reclaim the 125, Flaymah makes the original idea audible again. The guest explicitly credits creativity, sound effects and coughing when choosing him.</p>
              <p>The trade-off is repeated setup and reliance on sexual humiliation, body insults and stereotypes. Those passages are not evidence about Badee&apos;s life, and some rehearse the same premise without a new turn. His recorded win comes with specific praise for performance; it does not require claiming that every line was more intricate or every round was decisively his.</p>
            </div>
          </article>
        </div>
      </SummarySection>

      <SummarySection title="Notable Bars">
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">Excerpts follow the supplied transcript, with light punctuation and clear name corrections. Unclear wording is omitted rather than completed with an invented punchline.</p>
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

export function BadeeHarzVs1FlaymahResult() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
      <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
        <p>Badee&apos;s best case was adaptation. She used Flaymah&apos;s height, demonstrated the song format she criticised and redirected the inherited 125 joke toward her current opponent. Her hotter-flame counter and challenge to his attraction story kept the final round personal to this matchup.</p>
        <p>Flaymah kept recognisable hooks and impressions active across the battle. His connected visual punches gave those repetitions destinations, while the motorbike return ensured that Badee&apos;s attempt to reclaim the old number did not remove the original voice caricature from the room.</p>
        <p>The guest feedback praises Badee&apos;s confidence, wordplay and eye contact, then chooses Flaymah for his creativity and sound effects, including the coughing. The hosts subsequently ask the audience to choose, repeat the noise vote after calling for more participation, and announce 1Flaymah.</p>
        <p>The official GZone record also awards 1Flaymah the win, following his earlier victory over CJ-Zino. The transcript supports that winner and voting sequence, but supplies no reliable numerical round scores or panel split. The result rewards the performance without making the battle&apos;s personal allegations factual.</p>
      </div>
    </div>
  );
}

export function BadeeHarzVs1FlaymahHighlights() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
      {[
        ["Badee Harz", [
          ["Measured height flips", "Hospital-bed length leads into six foot seven becoming six foot deep."],
          ["Deliberate style imitation", "My turn introduces the hook-led round that supports her hooks-versus-bars argument."],
          ["125 reclamation", "She names Deeno's routine, challenges the alleged request for help and redirects the number toward Flaymah."],
          ["Opponent's identity reversed", "Your flame can never be as hot as mine competes using his own branding."],
          ["Main weakness", "Repetition and generic insults interrupt her more specific counters."],
        ]],
        ["1Flaymah", [
          ["Repeatable openings", "Questions and somebody/nobody patterns make the turns easy to re-enter after restarts."],
          ["Connected punchlines", "Snapback/cap, football net, cancelled twice/killed twice and the gym date maintain clear setup-to-payoff links."],
          ["Vocal callbacks", "He disputes no suction, then brings back the motorbike impression with an explicit address to Deeno."],
          ["Name-based finish", "Badee/body/body bag gives the last round a sustained closing sound."],
          ["Recorded winning strength", "The guest specifically credits creativity and sound effects before the audience decision."],
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
