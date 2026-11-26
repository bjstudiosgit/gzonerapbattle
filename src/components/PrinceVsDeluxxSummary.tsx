const notableBars: [string, [string, string][]][] = [
  [
    "PR1NC3",
    [
      [
        "But he ain't got proof",
        "Challenges the credibility of Deluxx's opening attack."
      ],
      [
        "But when you spaz, the crowd don't move",
        "Contrasts online bravado with the reaction in the room."
      ],
      [
        "Did you do it for free, bro?",
        "Turns the CJ reference into a short question-and-answer setup."
      ],
      [
        "I'm back now, so remember my name",
        "Makes his return the hook before spelling out his name."
      ],
      [
        "I was devil sent",
        "Sets up the darker turn after the first reload."
      ],
      [
        "Everybody knows I'm sick with their wordplay",
        "Uses illness as the setup for the first-aid reference."
      ],
      [
        "He's in need of a first aid",
        "Pays off the medical imagery at the end of the rhyme run."
      ],
      [
        "After this clash, these brothers retiring",
        "Extends the comeback angle into a prediction about his opponent."
      ],
      [
        "Bet he didn't clock the little Roman flow",
        "Draws attention to a cadence change and echoes the earlier flow accusation."
      ],
      [
        "I said why so serious",
        "Uses a familiar Joker phrase to set up a taunt."
      ],
      [
        "Get on a train, get the fuck out of London",
        "Ends the sequence with a direct dismissal grounded in the venue's city."
      ],
      [
        "Load up my pen and I'm filling with corn",
        "Turns writing into the setup for a threat."
      ],
      [
        "Big man pose but the whole team's acting",
        "Makes Deluxx's posture part of an acting comparison."
      ],
      [
        "Look for your team but nobody's there",
        "Follows the missed-punch image with a jab about absent support."
      ],
      [
        "From a packet of Quavers",
        "The crisp-packet image becomes a prop moment the hosts pick up after time."
      ]
    ]
  ],
  [
    "Deluxx",
    [
      [
        "Let me predict what he's going to say",
        "Tries to get ahead of Prince's material from the opening."
      ],
      [
        "How are you stealing flows",
        "Makes originality the first round's central accusation."
      ],
      [
        "Are you even going to answer?",
        "Breaks the attack into a direct question before answering it himself."
      ],
      [
        "And N stands for you're not winning this thing",
        "Uses the last clearly transcribed letter flip to make his prediction."
      ],
      [
        "You went half as hard and that's karma",
        "Frames Prince's earlier performance as a shortfall coming back on him."
      ],
      [
        "Prince is known as a local jester",
        "Uses the name to cast himself above Prince in the round's royal imagery."
      ],
      [
        "I lost 2-0 with the battles I've had",
        "Acknowledges his own record in the setup to the comeback angle."
      ],
      [
        "I'll win this back",
        "Turns that record into the stakes for round two."
      ],
      [
        "You ain't a prince though bro, you're irrelevant",
        "Returns to the name angle after the reload."
      ],
      [
        "G-Zone is my house and this is my saga",
        "Claims the room while extending the Star Wars references."
      ],
      [
        "Go get a barber",
        "Returns to grooming imagery after the beard and razor references."
      ],
      [
        "It's an inhaler",
        "Makes the breathlessness exchange part of the final-round performance."
      ],
      [
        "You ain't even posted one real song",
        "Shifts the final-round attack from battling to Prince's music catalogue."
      ],
      [
        "I don't give a damn if I get no reloads",
        "Addresses the crowd reaction directly, after earlier sections were rewound."
      ],
      [
        "Claim real rap, give up the placebo",
        "Uses the placebo comparison to question the substance of Prince's recorded material."
      ]
    ]
  ]
];

const rounds = [
  {
    title: "Round 1 · The return",
    deluxx: "Deluxx opens by predicting Prince's angles and accusing him of borrowing flows. He flips the letters in Prince's name into insults, then uses the king-and-jester imagery to question his standing in the league.",
    prince: "Prince answers by contrasting Deluxx's online talk with his reception in the room. He spells out his own name as a comeback hook, and the crowd calls for a reload. He returns to the opening before ending on a run of darker punchlines.",
  },
  {
    title: "Round 2 · Reloads on both sides",
    deluxx: "Deluxx acknowledges his previous losses and frames his return as a chance to make them back. The room calls for a rewind. After the restart, he keeps the attack moving through a Star Wars scheme that links Skywalker, the saga and a father reference.",
    prince: "Prince calls attention to a brief imitation of Roman's flow, turning the earlier accusation about borrowed flows into a performance choice. A boxing sequence connects the left-right combination and the hook with his writing, and another reload sends him back through the opening.",
  },
  {
    title: "Round 3 · From props to punchlines",
    deluxx: "Deluxx folds his breathlessness into the round with an inhaler gag. He questions Prince's music catalogue and takes a swipe at his YouTube material, using a real-rap and placebo comparison to challenge his credibility as an artist.",
    prince: "Prince opens by asking why Deluxx was brought back. The line draws an exchange with Ginga Jay before the beat restarts. He then moves into a Princess Diana name flip and a Quavers punchline. The hosts call for both the Quavers and the inhaler to go in the museum.",
  },
];

export default function PrinceVsDeluxxSummary() {
  return (
    <section aria-labelledby="prince-deluxx-summary" className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-8 md:p-10">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand" />
      <h2 id="prince-deluxx-summary" className="mb-6 font-display text-3xl uppercase text-white">Clash Summary</h2>
      <p className="leading-relaxed text-zinc-300">
        Deluxx gets first crack at his fellow GZone original. He takes Prince's name apart letter by letter and calls him the local jester. Prince takes the same letters straight back: he asks what CJ paid Deluxx for that backflip, spells out his own name, and tries to carry on. The crowd wants the beat pulled up anyway.
      </p>
      <p className="mt-4 leading-relaxed text-zinc-300">
        Deluxx gets a wheel of his own when he brings up his past losses. Prince has a cheekier answer to the stolen-flow dig: he slips into Roman's cadence and asks who clocked it. By the time Darren calls for noise, the hosts are asking for an inhaler and a packet of Quavers for the museum. The crowd gives Prince the win.
      </p>
      <div className="mt-8 space-y-6">
        {rounds.map(({ title, deluxx, prince }) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h3 className="mb-4 font-display text-xl uppercase text-white">{title}</h3>
            <div className="grid gap-5 leading-relaxed text-zinc-300 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-display uppercase text-brand">Deluxx</h4>
                <p>{deluxx}</p>
              </div>
              <div>
                <h4 className="mb-2 font-display uppercase text-brand">Prince</h4>
                <p>{prince}</p>
              </div>
            </div>
          </article>
        ))}
      </div>


      <h2 className="mt-10 mb-5 text-3xl font-display uppercase text-white">Callbacks &amp; Rebuttals</h2>
      <p className="leading-relaxed text-zinc-300">Deluxx turns Prince's name into a target in the opener. Prince spells it out again as a comeback hook, then makes the borrowed-flow accusation part of his own performance by pointing out the Roman cadence in round two. In the final round, Prince's question about why Deluxx came back draws Ginga Jay into the exchange before the beat restarts.</p>

      <h2 className="mt-10 mb-5 text-3xl font-display uppercase text-white">Performance Analysis</h2>
      <div className="grid gap-6 leading-relaxed text-zinc-300 md:grid-cols-2">
        <article>
          <h3 className="mb-2 text-xl font-display uppercase text-brand">PR1NC3</h3>
          <p>Prince uses short questions and pauses to give the room time to react. His name-spelling hook, brief Roman cadence and boxing sequence give the first two rounds distinct shapes. In the third, he shifts from challenging Deluxx's return to a story angle that lands on the Quavers gag.</p>
        </article>
        <article>
          <h3 className="mb-2 text-xl font-display uppercase text-brand">Deluxx</h3>
          <p>Deluxx builds his opener around prediction and letter flips, then makes his previous losses part of the second-round comeback pitch. The Skywalker references connect several punches, while the inhaler and the placebo comparison give his final round a physical gag and a clear attack on Prince's music.</p>
        </article>
      </div>

      <h2 className="mt-10 mb-6 text-3xl font-display uppercase text-white">Notable Bars</h2>
      <div className="grid gap-6 items-start xl:grid-cols-2">
        {notableBars.map(([name, bars]) => (
          <article key={name} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h3 className="mb-6 text-2xl font-display uppercase text-brand">{name}</h3>
            <ul className="space-y-6">
              {bars.map(([bar, detail]) => (
                <li key={bar} className="border-t border-white/10 pt-5">
                  <blockquote className="mb-3 font-semibold leading-relaxed text-white">&ldquo;{bar}&rdquo;</blockquote>
                  <p className="leading-relaxed text-zinc-400">{detail}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
