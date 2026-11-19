import type { ReactNode } from "react";

const rounds = [
  ["Round 1 — Ryno", "The returning provocateur", "Ryno opens by questioning the league’s recent standard before turning to Mello’s earlier clash with Tapped24. He presents himself as the performer who brought viral attention to GZone, using the repeated ‘cause of me’ construction to organise his threats and status claims. Appearance jokes sit alongside deliberately severe family insults. The reloads repeat and extend this opening rather than forming separate rounds."],
  ["Round 1 — Mello", "Rhino versus Black Panther", "Mello answers with an animal-name contrast: Ryno’s rhino becomes the opponent to his Black Panther, completed by the Wakanda reference. He then builds a character attack around allegations of racism and criminal behaviour. Those are accusations within the performance, not established facts. His closing passage becomes more conversational, addressing the family material Ryno has introduced."],
  ["Round 2 — Ryno", "Spelling out the opponent", "Ryno turns Mello’s name-spelling introduction into an extended alliteration scheme. The letters supply successive clusters about melody, employment, lyrical limitations and being overrated. Star Wars references move through Yoda, a lightsaber, Vader, Anakin, Chewbacca and Han Solo, linking the size jokes to a recognisable fictional world. He returns to the initials and contrasts his own writing with what he calls Mello’s lack of difference."],
  ["Round 2 — Mello", "Family allegations and a recurring hook", "Mello escalates the personal material through allegations about family, substance use and criminal accusations. His recurring collapse warning gives the round a hook, while the coke, meth and maths language carries the same angle into wordplay. The later prison sequence extends his argument that Ryno should not be on the platform. These claims remain battle material; the transcript does not substantiate them."],
  ["Round 3 — Ryno", "One target, multiple pictures", "Ryno explicitly announces a round about Mello’s forehead and builds the sequence around scale. Four-by-four, four beds, a warhead and a sniper’s dream repeatedly enlarge the same visual target. Rastamouse on helium shifts the attack to voice, and the high/medium joke brings height back into the construction. A chain of questions about appearance and behaviour closes the round."],
  ["Round 3 — Mello", "Questions for the platform", "Mello returns to his character attack, then changes from rapping into direct address to the room. He argues that the allegations he raises should exclude Ryno from the platform. A repeated question-and-answer routine about neighbours, appointments and school pickups drives the closing stretch and receives a reload. The repeated criminal label is an allegation used in the battle, not a finding established by this summary."],
];

const connections = [
  ["The name becomes a structure", "Mello repeatedly spells his name as a performance signature. Ryno makes that spelling the framework of round two, using alliteration to turn the introduction against him. The connection is clear, although the transcript cannot establish when the material was written."],
  ["A battle of repeated hooks", "Ryno’s first-round ‘cause of me’ section claims influence over both the league and his opponent. Mello’s collapse warning in round two and question-and-answer routine in round three give his own longer attacks recurring anchors."],
  ["Comedy against confrontation", "Ryno’s final round narrows the target to a visual feature and keeps changing the image around it. Mello’s final round instead broadens his attack into an argument about who deserves a platform. The contrast is between sustained caricature and direct condemnation."],
  ["Reloads and room energy", "Both performers repeat substantial passages after reactions and restarts. The hosts repeatedly call for energy, and Mello’s final refrain gets a reload. Those reactions describe the performance’s reception; they do not establish the truth of the allegations or provide a numerical round score."],
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden"><div className="absolute top-0 left-0 w-1 h-full bg-brand" /><h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4"><span className="w-8 h-1 bg-brand" />{title}</h2>{children}</section>;
}

export function MelloVsRynoSummary() {
  return <>
    <Section title="Clash Summary"><div className="space-y-6 text-zinc-300 leading-relaxed font-light">
      <p>Mello versus Ryno is a three-round clash built on two distinct approaches: Ryno’s extended comedy schemes and name-based writing against Mello’s direct character attacks and repeated hooks. Ryno goes first in each round, returning to the ring with a statement about the league before immediately testing how personal the exchange can become.</p>
      <p>The opening sets the temperature. Ryno revisits Mello’s earlier Tapped24 clash and claims a central role in GZone’s viral appeal. Mello answers with the rhino-versus-Black-Panther comparison before making allegations about Ryno’s character. The second round gives Ryno his clearest structural device: spelling Mello’s name through successive alliterative passages. Mello responds with an increasingly severe family angle and a recurring collapse refrain.</p>
      <p>Ryno’s third round commits to a single visual target, turning forehead jokes into vehicles, beds, weapons and a sniper’s target. Mello’s last round takes the opposite route, moving from insults into direct address and a repeated series of questions. Reloads run through the performance, giving both MCs opportunities to repeat and develop their material.</p>
      <p>The room was closely split, with both MCs receiving equally strong cheers. Ginga Jay then turned to the YouTube audience, whose preference for Ryno backed the room’s response and confirmed the decision. Ryno took the win.</p>
    </div></Section>
    <Section title="Round Structure"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{rounds.map(([round, title, detail]) => <article key={round} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">{round}</p><h3 className="text-xl font-display uppercase text-white mb-4">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>)}</div></Section>
    <Section title="Callbacks & Rebuttals"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{connections.map(([title, detail]) => <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6"><h3 className="text-xl font-display uppercase text-brand mb-3">{title}</h3><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></article>)}</div></Section>
    <Section title="Performance Analysis"><div className="space-y-8 text-zinc-400 leading-relaxed font-light"><article><h3 className="text-2xl font-display uppercase text-brand mb-3">Ryno</h3><p>Ryno’s most distinctive writing gives a round an organising rule. The second-round spelling scheme develops through linked sounds and letters, while the final round keeps finding new pictures for one physical comparison. His first-round influence claim supplies a repeatable hook. The harshest personals raise the temperature, but the alliteration, themed references and sustained visual comedy provide the clearest technical identity.</p></article><article><h3 className="text-2xl font-display uppercase text-brand mb-3">Mello</h3><p>Mello’s strongest performance devices are direct and easy to recognise: the Black Panther contrast, the collapse hook and the final sequence of questions. His last round changes register by speaking to the room, turning the contest into an argument about the platform itself. The transcript records engagement and a reload, but its unclear passages make precise quotation unreliable. His approach depends more on forceful repetition and confrontation than Ryno’s extended comic imagery.</p></article></div></Section>
    <Section title="Evidence: Props Used"><div className="flex items-center gap-4"><span className="text-3xl" aria-hidden="true">📝</span><div><h3 className="text-xl font-display uppercase text-white">Mello word card</h3><p className="text-brand text-sm mt-1">Used by Ryno · Round 2</p></div></div><p className="text-zinc-400 leading-relaxed mt-5">Ryno uses a large card spelling out MELLO as a visual guide to his second-round alliteration scheme. Pointing to the letters turns the name breakdown into a physical routine, letting the room follow the progression through M, E, L, L and O as he delivers each cluster.</p><a className="inline-block text-brand mt-5 hover:underline" href="/museum?item=mello-vs-ryno-1">View the word card in the museum →</a></Section>
    <MelloRynoNotableBars />
  </>;
}

const notableBars = [
  {
    "name": "Mello",
    "bars": [
      [
        "What’s a rhino to a Black Panther?",
        "An opponent-name flip turns the animal in Ryno’s name into a matchup, with Black Panther giving Mello a heroic identity."
      ],
      [
        "Scream out Wakanda.",
        "The short follow-up completes the Black Panther reference and gives the opening a recognisable crowd cue."
      ],
      [
        "You remind me of David Duke.",
        "A named comparison establishes the racism angle as Mello’s accusation within the battle."
      ],
      [
        "The team never needed your feature.",
        "Rejecting a supposed collaboration request becomes a status reversal: Mello presents his circle as the gatekeepers."
      ],
      [
        "You was outside sweeping parks with Malfoy.",
        "Draco shifts from firearm slang into the Harry Potter character, with Malfoy completing the reference."
      ],
      [
        "Ginge, you really put me down for a grave shift?",
        "The graveyard-shift idea connects the booking to the death imagery already running through the exchange."
      ],
      [
        "Why am I battling a sadist?",
        "A direct question turns the opponent’s severe personals into the subject of Mello’s response."
      ],
      [
        "I swear to God I’ll start praising the station.",
        "Mello reverses the usual anti-police stance within his personal angle, presenting police approval as the punchline."
      ],
      [
        "Watch out, Ryno’s about to collapse.",
        "A recurring warning becomes a hook, allowing the audience to recognise the return before the next variation."
      ],
      [
        "Your father’s favourite type of drink was coke.",
        "The double meaning of coke supplies the bridge between drink imagery and the round’s substance-use allegations."
      ],
      [
        "I don’t think that meth is gonna bang, my bro.",
        "Meth echoes maths, turning the preceding money-and-family angle into a sound-based payoff."
      ],
      [
        "This Ryno’s a literal caged animal.",
        "The rhino-name motif returns through confinement imagery inside the prison sequence."
      ],
      [
        "You’re in love with anything that’s crack.",
        "Repeated uses of crack in different senses organise the opening of the final round around one word."
      ],
      [
        "I’m not even rapping, I’m talking to the room.",
        "Mello explicitly changes register, moving from rhythmic delivery to a direct appeal to the audience."
      ],
      [
        "Ryno, I’ve got some questions.",
        "The introduction frames the closing question-and-answer routine, making its repeated response predictable and participatory."
      ]
    ]
  },
  {
    "name": "Ryno",
    "bars": [
      [
        "Matchstick strike him, get set alight.",
        "The compact fire image turns a small everyday action into a threat, supported by the strike/alight sound."
      ],
      [
        "You look like Bob Marley crossed with Megamind.",
        "Two contrasting cultural images combine dreadlocks and an exaggerated head shape into one visual caricature."
      ],
      [
        "The league went viral, yeah, cause of me.",
        "The repeated cause-of-me phrase lets Ryno claim influence while giving the next sequence a common ending."
      ],
      [
        "You look seventeen, but your hairline’s like seventy.",
        "The seventeen/seventy sound contrast compresses the age and appearance joke into a simple numerical reversal."
      ],
      [
        "Dreads all mouldy and yellow.",
        "A colour-and-condition image keeps the appearance angle immediately visible rather than abstract."
      ],
      [
        "You’re the same size as Fredo.",
        "The named comparison supplies another compact stature joke inside the opening character sketch."
      ],
      [
        "Me on the melody, I’m moving maliciously.",
        "Repeated M sounds start the name-spelling scheme and connect musical vocabulary with aggression."
      ],
      [
        "Eradicate enemy efforts.",
        "The E cluster continues the same structural rule, making the alliteration part of the round’s architecture."
      ],
      [
        "Lyrically lacking, left looking like a losing, lying, limited learner.",
        "The extended L sequence uses sound repetition to portray Mello as technically outclassed."
      ],
      [
        "Overrated, opinionated, outclassed.",
        "The O-led closing cluster completes the movement through the opponent’s name."
      ],
      [
        "You ain’t got a forehead … a four-by-four head.",
        "Forehead/four-head becomes an enlarged vehicle image, setting up the final round’s escalating scale jokes."
      ],
      [
        "To sleep I think he needs four beds.",
        "The number motif continues, exaggerating the same physical target through an ordinary domestic object."
      ],
      [
        "Alien cranium would be a sniper’s dream.",
        "The exaggerated target image turns the forehead theme into a threat with a clear visual payoff."
      ],
      [
        "Sound like Rastamouse on helium.",
        "A cartoon voice and helium create an audible caricature, briefly shifting attention from head shape to delivery."
      ],
      [
        "When you smoke a draw, don’t get high, get medium.",
        "High changes from intoxication to height; medium undercuts both the stature and the implied effect."
      ]
    ]
  }
];
function MelloRynoNotableBars() { return <Section title="Notable Bars"><div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">{notableBars.map(mc => <article key={mc.name} className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6"><h3 className="text-2xl font-display uppercase text-brand mb-6">{mc.name}</h3><ol className="space-y-6">{mc.bars.map(([bar, detail], index) => <li key={bar} className="border-t border-white/10 pt-5"><p className="text-brand text-xs mb-2">{String(index + 1).padStart(2, "0")}</p><blockquote className="text-white font-semibold leading-relaxed mb-3">“{bar}”</blockquote><p className="text-zinc-400 leading-relaxed font-light">{detail}</p></li>)}</ol></article>)}</div></Section>; }
