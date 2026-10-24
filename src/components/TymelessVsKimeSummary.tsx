import type { ReactNode } from "react";

const rounds = [
  ["Round 1 — K.I.M.E", "Borrowed time", "K.I.M.E opens with a sustained attack on Tymeless's image and standing. Friendship, clothes, housing and money become parts of the same portrait: an opponent he presents as dependent on others. The borrowed-time punch is the strongest link between that angle and Tymeless's name, before the coroner ending turns the opening round into a claimed lyrical body."],
  ["Round 1 — Tymeless", "Impersonation and scale", "Tymeless builds around K.I.M.E's height, voice and Manchester identity. The Walker/Walking Dead connection gives way to an impersonation, the short-offer joke and a speech-therapy routine. The climbing, top-shelf and forearm images keep returning to the same size contrast, giving the round a recognisable theme rather than a series of disconnected insults."],
  ["Round 2 — K.I.M.E", "Character attack and name flips", "K.I.M.E extends his portrayal of Tymeless through money, sobriety and housing allegations. The seashells phrase answers the sound of the earlier speech lesson, while the lemons reference targets Tymeless's established prop identity. The closing stretch brings the writing back to names and status: king, throne, time and typo. These claims function as battle material, not established biography."],
  ["Round 2 — Tymeless", "The classroom routine", "Tymeless turns pronunciation into the organising idea of his round. Time/team and lime/leem contrasts lead into spelling out K.I.M.E, replacing the meaning of the initials and presenting himself as the teacher. The lime makes the vowel joke physical. Curriculum and Key Stage 2 then give the lesson an opponent-specific foundation, before classroom commands and a counting sequence carry the idea to the finish."],
  ["Round 3 — K.I.M.E", "Straight bars and public image", "K.I.M.E explicitly sets his approach against the prop performance with 'I don't need no props'. His round develops the Time is up name flip and financial jokes into a harsher attack on public image, relationships and family. The Jeremy Kyle comparison condenses that character attack into one recognisable television reference. The round's force comes from sustained directness, with some passages relying more on shock than layered construction."],
  ["Round 3 — Tymeless", "Family angles and Manchester wordplay", "Tymeless moves from comedy into severe personal attacks involving family, race and the wider scene. Those allegations remain battle claims. The clearest wordplay comes when 'our kid' shifts between Manchester speech, parentage and 'who you are, kid'. He returns to the height theme with the standing/ducking image, then closes by expanding the challenge beyond K.I.M.E. The reloads build the performance across the round as a whole."],
];

const callbacks = [
  ["Pronunciation becomes a shared angle", "Tymeless's first round uses speech therapy and the seashells tongue-twister. K.I.M.E uses the same phrase in round two before turning it towards begging. That is a clear connection in the exchange, but the wording alone does not establish whether K.I.M.E wrote it in advance or improvised it in the room."],
  ["The classroom is an extended construction", "The pronunciation pairs, initials, teaching commands and educational titles belong to one sustained routine. They should be read together: the vowel jokes establish the lesson, the acronym attacks rename the pupil, and the classroom language gives Tymeless authority within the scene he creates."],
  ["Props become part of the contest", "Tymeless uses a fake beard, lime, Key Stage 2 English revision sheets and K.I.M.E baby shoes. The lime is directly connected to the spoken 'leem/lime' joke. Ginga Jay praises the props as creative, while K.I.M.E later declares that he needs no props and has straight bars. That contrast makes the presentation itself part of the battle."],
  ["Lemons and the lime", "K.I.M.E says Tymeless spent his begging money on lemons, bringing the opponent's prop reputation into his character attack. Tymeless's lime then belongs to his own pronunciation lesson. The connection is noticeable."],
];

const performances = [
  { name: "K.I.M.E", paragraphs: [
    "K.I.M.E's strongest writing compresses an angle into a short, recognisable turn. Borrowed time attaches financial dependency to the opponent's name; typo reduces that name to a mistake; the suspicious bank payment makes poverty the setup for an institutional reaction. Those punches are easy to follow without needing a physical reveal.",
    "He sustains a consistent character attack across three rounds and gives his performance a clear position when he champions straight bars over props. The seashells and lemons passages also show that his material engages with Tymeless's presentation. His less distinctive attacks repeat allegations about poverty, addiction and family; the sharper name flips and comparisons do more technical work than those accusations alone.",
  ] },
  { name: "Tymeless", paragraphs: [
    "Tymeless's most complete construction is the second-round lesson. Pronunciation, spelling, initials and school language develop one idea through several forms. The physical lime lets the audience see the word being discussed, while the teaching commands place K.I.M.E inside the role Tymeless has written for him.",
    "His first-round impersonation and repeated height comparisons establish the comic relationship that the classroom expands. The final round changes the temperature with much harsher personals, but 'our kid' and the standing/ducking image retain the opponent-specific wordplay. The audience decision goes to Tymeless; his props and sustained routines are central features of the performance, without needing to invent a numerical round score.",
  ] },
];

const notableBars = [
  { name: "K.I.M.E", bars: [
    ["You're the weakest link out of all your friends.", "The opening uses the familiar weakest-link idea to rank Tymeless beneath his own circle. It establishes a status attack immediately: K.I.M.E presents him as the vulnerable member of a group, giving the later friendship and dependency material a common starting point."],
    ["You look like a benefit street model.", "The clash between 'model' and 'benefit street' turns an aspirational job into a caricature of poverty. It is an appearance punch that also fits K.I.M.E's wider financial angle. Its effect comes from the compressed contrast, rather than evidence about Tymeless's actual circumstances."],
    ["Even the time that you have is borrowed.", "Borrowed time usually means an uncertain or limited future. Here it also follows the claim that Tymeless owns nothing, so borrowing becomes both a money angle and a threat to his remaining time in the battle. The word 'time' makes the familiar phrase specific to his opponent."],
    ["She sells seashells by the sea shore and he tried begging her for a free spot.", "K.I.M.E takes a pronunciation exercise and turns its seller into someone Tymeless supposedly approaches for a handout. It connects with the earlier speech-therapy material while returning to his own poverty angle. The textual callback is clear; an improvised origin is not established."],
    ["The little change that he made from begging. He ended up spending on lemons.", "The setup makes every coin seem scarce, then the lemon purchase becomes an absurd priority. The object also targets Tymeless's prop identity, making the insult more tailored than a general claim about being broke. It is framed as an allegation within the performance."],
    ["I'm a king.", "The royal image reinforces the King In My Element name. It answers the contest for status by treating K.I.M.E's position as something already held, with Tymeless cast as the challenger. The construction is direct and supports the name material that follows."],
    ["Should have been typo.", "The punch reduces the opponent's chosen identity to an error. Against the name Tymeless, 'typo' also retains a similar opening sound, so the dismissal works as both renaming and a compact insult about whether the persona should exist at all."],
    ["Your new name is Time is up.", "K.I.M.E breaks the opponent's time-based identity into a closing announcement. A name suggesting endurance becomes a deadline. The punch works without a complicated reference because the audience can hear both the original name and the verdict inside the same idea."],
    ["You don't make much bread so when there's money going in his bank they reckon it's fraud.", "Bread establishes the money meaning before the bank becomes the punch's imagined observer. The claim is that a payment would be so unusual for Tymeless that it would look suspicious. That escalation gives the poverty joke a consequence instead of stopping at 'you have no money'."],
    ["The only show you can star on is Jeremy Kyle's.", "The setup denies Tymeless star status and the punch offers a different kind of television exposure. The Jeremy Kyle reference gathers the round's family and relationship attacks into a single public-spectacle image. It is a mocking comparison, not a factual claim that he appeared on the programme."],
  ] },
  { name: "Tymeless", bars: [
    ["Where you walking to with them legs? … This will be the walking dead.", "The Walker name reference turns into the verb 'walking', then into the recognisable Walking Dead phrase. The legs joke ties the name construction to the height angle that dominates the round. The quoted excerpts show the connection without reconstructing the transcript's less clear intervening words."],
    ["Told pen game to give me what I'm worth. But I turned it down cause the offer was short.", "Delivered inside the impersonation, this sounds first like a complaint about payment. 'Short' then redirects the complaint towards K.I.M.E's height. The joke works because the money phrase remains natural while carrying the physical insult underneath it; it does not establish an actual rejected offer."],
    ["You can't even raise yourself.", "The setup concerns raising a baby, where 'raise' means bring up a child. The punch switches to physical elevation and returns to the height theme. That movement between parental responsibility and literal height makes a short line serve the round's continuing angle."],
    ["Your legs the same size of my forearm.", "This gives the height attack a visible unit of comparison. Rather than supplying another adjective for smallness, Tymeless compares two body parts the room can picture immediately. The exaggeration makes his own body part of the joke even without a separate prop."],
    ["This ain't a leem. It's a lime.", "The deliberate vowel contrast makes pronunciation the punch. Bringing a lime into the routine gives the word a physical referent, so the object and the spoken correction land together. It is one of the clearest places where the prop directly carries the writing."],
    ["K is for knowledge … I is for I don't know what you mean. M is for mouth.", "Tymeless breaks K.I.M.E into letters and assigns insulting explanations to them. 'Knowledge' also introduces a silent-K joke into a round about how words sound. The sequence replaces the confident meaning of King In My Element with a lesson about confusion and speech."],
    ["I'm killing incompetent midgets every time.", "The first letters of Killing, Incompetent, Midgets and Every reproduce K.I.M.E, while 'time' points back towards Tymeless. It turns the opponent's initials into a boast for the speaker. The height insult also keeps the acronym attached to the round's established subject."],
    ["Another one called Key Stage 2. How does it feel that I'm teaching you?", "The Key Stage 2 title cited in the round makes the teacher routine specific to K.I.M.E. The final question reverses the authority implied by that title: the person associated with a curriculum becomes the pupil."],
    ["Look up to me when I speak to you.", "Within the classroom routine, 'look up to me' combines a teacher's demand for respect with the literal height difference Tymeless keeps emphasising. The command turns the general teaching concept into an interaction between the performers."],
    ["You standing up looks like you're ducking.", "Standing and ducking normally describe opposite changes in height. Collapsing them into the same appearance creates an immediate visual contradiction. In a final round crowded with severe personals, this line returns to the simple physical comparison that has tied Tymeless's material together."],
  ] },
];

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
    <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />{title}</h2>
    {children}
  </section>;
}

export function TymelessVsKimeSummary({ props }: { props?: { name: string; user: string; icon: string }[] }) {
  return <>
    <SummarySection title="Clash Summary">
      <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
        <p>Tymeless versus K.I.M.E brings two distinct approaches into the main event: K.I.M.E's direct character attacks and compact name flips against Tymeless's impersonation, extended teaching routine and physical props. K.I.M.E goes first in each of the three rounds, with Tymeless answering through a performance built around height, pronunciation and identity.</p>
        <p>K.I.M.E begins by presenting Tymeless as dependent on others, with the borrowed-time line linking that portrayal to his name. Tymeless replies with a comic impression and repeated scale comparisons. Their second rounds develop the contrast: K.I.M.E keeps his pressure on money and credibility, while Tymeless builds a classroom around vowel sounds, initials, educational titles and a lime.</p>
        <p>The final round becomes much more personal on both sides. K.I.M.E champions straight bars over props; Tymeless turns towards family and Manchester identity before broadening his challenge to the scene. Claims about private lives, health, crime and family are allegations and insults within the battle, not verified facts. The positive reloads amplify the material as part of each complete round.</p>
        <p>Ginga Jay asks the audience to respond for K.I.M.E in the blue corner and Tymeless in the red corner, then announces Tymeless as the winner. No numerical round score is given. The closing announcement also welcomes K.I.M.E onto the GZone roster.</p>
      </div>
      {props && props.length > 0 && <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
        <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
        <div className="space-y-4">{props.map(prop => <div key={prop.name} className="flex items-center gap-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0"><span className="text-2xl" aria-hidden="true">{prop.icon}</span></div>
          <div><p className="text-white font-bold">{prop.name}</p><p className="text-zinc-400 text-sm">Used by {prop.user}</p></div>
        </div>)}</div>
      </div>}
    </SummarySection>
    <SummarySection title="Round Structure"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{rounds.map(([round, focus, detail]) => <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
      <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p><h3 className="text-xl font-display uppercase text-white mb-4">{focus}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p>
    </article>)}</div></SummarySection>
    <SummarySection title="Props, Callbacks & Rebuttals"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{callbacks.map(([title, detail]) => <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6"><h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>)}</div></SummarySection>
    <SummarySection title="Performance Analysis"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{performances.map(({ name, paragraphs }) => <article key={name} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8"><h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3><div className="space-y-6 text-zinc-300 leading-relaxed font-light">{paragraphs.map(p => <p key={p}>{p}</p>)}</div></article>)}</div></SummarySection>
    <SummarySection title="Notable Bars"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{notableBars.map(({ name, bars }) => <article key={name} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8"><h3 className="text-2xl font-display uppercase text-brand mb-6">{name}</h3><div className="space-y-8">{bars.map(([quote, explanation]) => <div key={quote}><blockquote className="border-l-2 border-brand pl-4 text-white italic leading-relaxed mb-3">“{quote}”</blockquote><p className="text-zinc-400 text-sm leading-relaxed">{explanation}</p></div>)}</div></article>)}</div></SummarySection>
  </>;
}
