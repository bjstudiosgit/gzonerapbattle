import type { ReactNode } from "react";

const rounds = [
  [
    "Round 1 — Marni Gramz",
    "Pop Smoke homage, Edna Mode and takeaway schemes",
    "Marni Gramz opens with a tribute to Pop Smoke before turning 'It's incredible' into a barrage of appearance roasts. He targets Btizz's rounded trim—comparing him to Edna Mode from The Incredibles ('no capes, no pressure')—and mocks his early elimination from the Royal Rumble. An elaborate Asian heritage and Chinese takeaway scheme follows, weaponising egg fried rice, dim sum, and soy sauce into recurring punchlines."
  ],
  [
    "Round 1 — Btizz",
    "Crystal Palace skills and the Melon prop reveal",
    "Btizz counters by revealing Gramz allegedly ducked the clash for months before launching into a high-octane rhythmic sequence ('burn, scorch, incineration'). He weaves Crystal Palace and Yannick Bolasie five-star rainbow-flick wordplay with bank card balance jokes. Btizz then summons Deeno to present his physical prop—a melon—which host Ginga Jay jokes matches his jacket before collecting it for the official GZone archive."
  ],
  [
    "Round 2 — Marni Gramz",
    "Ethnic ambiguity, street credibility and market drip",
    "Gramz targets Btizz's hair-sheen addiction, unfulfilled street threats toward CJ Zino, and alleged excuses regarding rigged audio. He builds a wide-ranging heritage breakdown questioning whether Btizz is Pakistani, Chinese, Arab, or Nigel Farage's son, before dismissing his wardrobe as bargain-market drip."
  ],
  [
    "Round 2 — Btizz",
    "Football strikes, veteran stagnation and the pen chant",
    "After demanding a microphone volume adjustment, Btizz hits his stride with an Andy Cole versus Darren Fletcher comparison. He directly challenges Gramz's veteran status ('How are you 35? For the past 10 years you've been screaming next up') before conducting the entire room through a 15-repetition anthem of 'Marnie, I'm bad with this pen.' He closes with an Ed Gein callback to Tapped24."
  ],
  [
    "Round 3 — Marni Gramz",
    "The funeral prayer ritual, funeral props and Ouija boards",
    "Gramz commands the room into silence, instructing everyone to bow their heads and raise their hands for a mock memorial. He pulls out a funeral bouquet of flowers and purple balloons to stage Btizz's commemoration, portraying him as a morbid figure trapped in a haunted house with Death Note, Ouija board, and psychic angles. When Gramz lays the props down on the canvas, Btizz promptly picks them up and turns the gimmick on its head, debunking the morbid angle before technical sound delays prompt Ginga Jay to joke that the spirits choked Gramz up."
  ],
  [
    "Round 3 — Btizz",
    "Grime cadence, domestic angles and final verdict",
    "Btizz locks firmly into Muzzy's production with an aggressive grime flow ('Christ me verse you, don't know I'm despicable / In six years your hair ain't grew / You hit women, remix round / Cause I'm winning this one, not you'). He lands Flintstone and Fred Perry wordplay, flips Jamaican cadence against formal speech, and dismisses Gramz's standing to close the battle with unrelenting energy."
  ]
];

const callbacks = [
  [
    "The Melon Prop",
    "Btizz introduces a physical melon into the ring, brought out by Deeno. Host Ginga Jay halts the action to spotlight the fruit, remarks that it matches his jacket, and officially commands Lou to store it in the GZone archive for the season-end museum and auction, continuing the league's fruit-prop tradition."
  ],
  [
    "The 'It's Incredible' / Edna Mode Scheme",
    "Gramz ingeniously subverts Pop Smoke's catchphrase into a multi-layered appearance roast. Comparing Btizz's rounded haircut and lack of capes to fashion designer Edna Mode from The Incredibles provides one of the clash's most memorable visual punches."
  ],
  [
    "The 15-Repetition 'Bad With This Pen' Anthem",
    "Btizz transforms a simple declaration into the defining crowd-participation moment of the night. Repeating 'Marnie, I'm bad with this pen' over fifteen times across Muzzy's beat rallies the room behind his cadence, turning a potential audio hiccup into a dominant display of stage control."
  ],
  [
    "The Funeral Flowers, Balloons & Debunked Memorial",
    "Gramz stages an elaborate funeral prayer ritual in Round 3, commanding the venue to bow their heads and unveiling physical commemoration props—a bouquet of flowers and purple balloons—to mark Btizz's battle demise. Rather than being unnerved by the occult Death Note and Ouija board schemes, Btizz picks the flowers and balloons up directly from the canvas, smiling and flipping the joke into romantic comedy ('Any single lady shout me man... trying to get married bruv!') to completely debunk Gramz's morbid angle."
  ],
  [
    "Stage Technicals & Audio Banter",
    "Both artists navigated multiple microphone adjustments, beat level changes, and sound delays with DJ Swae Lee and engineer Louis. Rather than dampening the battle, both battlers incorporated the delays into their routines, blending competitive tension with crowd-pleasing comedy."
  ],
  [
    "The Four-to-Six Month Backstory",
    "Ginga Jay reveals in the pre-fight introduction that Marni Gramz had pursued Btizz for nearly half a year, with Btizz repeatedly declining until personal remarks brought him out of the woods to take the clash."
  ]
];

const performances = [
  {
    name: "Btizz",
    paragraphs: [
      "Btizz demonstrated exceptional ring command, adaptability, and rhythmic stamina. When audio levels were uneven, he recalibrated the room through direct audience engagement, Premier League football analogies (Yannick Bolasie, Andy Cole vs Darren Fletcher), sharp physical comedy with his melon prop, and his quick-witted rebuttal picking up Gramz's funeral flowers and balloons to completely defuse the morbid seance scheme.",
      "His second-round pen chant turned a technical restart into the battle's loudest unison moment, proving how charisma and delivery can outshine intricate writing. In the third round, his mastery of grime tempo and rapid multi-rhyme schemes overwhelmed Gramz's momentum, securing an unambiguous decision from the Canning Town crowd."
    ]
  },
  {
    name: "Marni Gramz",
    paragraphs: [
      "Gramz brought inventive concept writing, theatrical risk-taking, and distinct pop-culture schemes. His 'Incredible' Edna Mode routine in Round 1 was sharp and visually evocative, while his mock funeral and commemoration props (balloons and flowers) in Round 3 showcased rare creative staging within the league.",
      "His rounds were packed with creative imagery—from Chinese takeaway banter to manga and occult lore. However, pacing stumbles and microphone interruptions disrupted his rhythm in the later rounds, leaving his darker material vulnerable to Btizz's relentless pace and vocal authority."
    ]
  }
];

const notableBars = [
  {
    name: "Btizz",
    bars: [
      [
        "He's from Crystal Palace, I rainbow flick, five-star like Yannick.",
        "A sharp South London football comparison referencing Yannick Bolasie's famous five-star skill moves to assert effortless technical superiority."
      ],
      [
        "Put your bank card onto the seesaw, but you can't see more balance.",
        "A witty playground seesaw double entendre contrasting physical balance with financial insolvency."
      ],
      [
        "Who I've called Deeno to come bring the melon.",
        "Delivered as Deeno brings Btizz a whole melon into the ring, weaponising the physical fruit prop as live evidence before Ginga Jay takes it for the GZone archive."
      ],
      [
        "I'm a striker like Cole and I make man realise that he's worse than Fletcher.",
        "A classic Premier League comparison using Manchester United's Andy Cole and Darren Fletcher to rank their respective tiers in battle rap."
      ],
      [
        "How are you 35? For the past 10 years you've been screaming next up.",
        "A ruthless reality check targeting Gramz's age and a decade-long wait for a definitive breakthrough in the UK scene."
      ],
      [
        "Marnie, I said I'm bad with this pen.",
        "Delivered with escalating conviction over fifteen times, converting a straightforward boast into an inescapable crowd chant."
      ],
      [
        "You said Taps gonna find all our body like Ed Gein, but I'm here today dog, I'm taking the win.",
        "A callback dismissing Tapped24 and previous horror-themed threats while reasserting his claim on the Season 1 standings."
      ],
      [
        "Christ me verse you, don't know I'm despicable / In six years your hair ain't grew / You hit women, remix round / Cause I'm winning this one, not you.",
        "Btizz's relentless Round 3 grime hook that completely locked the audience into his cadence."
      ],
      [
        "You're not Fred like Flintstone... you're washed up coming like Fred and Perry.",
        "A dual-Fred comparison linking cartoon prehistory to the British heritage sportswear brand to mock Gramz's age."
      ],
      [
        "Are you Jamaican speaking Caucasian?",
        "A pointed linguistic flip critiquing Gramz's shifting cadence between UK road vernacular and formal enunciation."
      ]
    ]
  },
  {
    name: "Marni Gramz",
    bars: [
      [
        "It's incredible... looking like your forehead came with a censor.",
        "A quick-witted physical jab using Pop Smoke's signature ad-lib to mock Btizz's prominent brow."
      ],
      [
        "Trim that you got got him looking like Edna. No capes, no pressure.",
        "A standout pop-culture punchline comparing Btizz's rounded haircut to fashion designer Edna Mode from The Incredibles."
      ],
      [
        "You was first out in the Royal Rumble, keep it humble, you got no flows.",
        "Weaponising GZone's recent 9-MC Royal Rumble clash to highlight Btizz's early elimination."
      ],
      [
        "Shroom top, tell us your hat size... half of a head but you still got a mop.",
        "A visual insult ridiculing Btizz's distinct silhouette and hair proportions."
      ],
      [
        "Feel like you order an egg fried rice when you're getting your fish, not normal, you ain't getting the chips.",
        "The opening line of Gramz's Chinese takeaway scheme, using takeaway ordering habits as an absurdity punch."
      ],
      [
        "Smash man's head with a black bean pot, drop soy sauce in his eyes then what? Is soy sauce your trigger word?",
        "Absurdist culinary battle bars that created one of the most quotable comedic exchanges of round one."
      ],
      [
        "We don't even know what Asian you are... are you Pakistan Chinese or are you Arab?",
        "Gramz questions Btizz's heritage through rapid cultural and geographical juxtaposition."
      ],
      [
        "Facing the Grams ain't smart for a man, no one beat the don one time in the history.",
        "A bold declaration of personal pedigree, framing himself as an unbeatable veteran opponent."
      ],
      [
        "Got an abnormal obsession for death by this mushroom head boy, you're so morbid, you got the Death Note.",
        "An anime-inspired scheme connecting Btizz's morbid imagery to the supernatural thriller Death Note."
      ],
      [
        "Don't play with the Astral Plane, but to chat to his mummy you gotta back out the Ouija.",
        "A chilling, boundary-crossing line from the mock funeral scheme introducing occult divination into the ring."
      ]
    ]
  }
];

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
      <h2 className="text-3xl font-display uppercase text-white mb-8 flex items-center gap-4">
        <span className="w-8 h-1 bg-brand" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function MarniGramzVsBtizzSummary({
  props,
}: {
  props?: { name: string; user: string; icon: string }[];
}) {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
          <p>
            Gramz sets the tone in Round 1 with an inventive Pop Smoke &lsquo;Incredible&rsquo; scheme, famously likening Btizz&apos;s haircut to Edna Mode from <em>The Incredibles</em> (&ldquo;no capes, no pressure&rdquo;) before rolling into an elaborate Chinese takeaway routine. Btizz retaliates with Yannick Bolasie five-star football wordplay, calls Deeno into the ring to reveal his official <strong>Melon</strong> prop (which Ginga Jay notes matches his jacket before sending it to the GZone archive), and seizes control of the venue&apos;s energy.
          </p>
          <p>
            Their second and third rounds intensified the contrast. Gramz challenged Btizz&apos;s heritage and street credibility before staging a full mock-funeral prayer ritual complete with <em>Death Note</em> and Ouija board imagery. Btizz met technical audio delays head-on, orchestrating the entire room through a 15-repetition chant of &ldquo;Marnie, I&apos;m bad with this pen,&rdquo; questioning Gramz&apos;s 10-year veteran status, and closing with a blistering Round 3 grime flow.
          </p>
          <p>
            Host Ginga Jay joined the battlers and crowd for a dance celebration to Muzzy&apos;s beat before checking the room: the Canning Town audience overwhelmingly cheered for Btizz in the blue corner, awarding him the official Season 1 victory.
          </p>
        </div>
        {props && props.length > 0 && (
          <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
            <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">
              Evidence: Props Used
            </h3>
            <div className="space-y-4">
              {props.map((prop) => (
                <div key={prop.name} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                    <span className="text-2xl" aria-hidden="true">
                      {prop.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{prop.name}</p>
                    <p className="text-zinc-400 text-sm">Used by {prop.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

      <SummarySection title="Props, Callbacks & Rebuttals">
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
                {paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
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
                    <blockquote className="border-l-2 border-brand pl-4 text-white italic leading-relaxed mb-3">
                      “{quote}”
                    </blockquote>
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
