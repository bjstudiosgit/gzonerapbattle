import type { ReactNode } from "react";
import type { Battle } from "../data/battles";

const rounds = [
  ["Round 1 — Roman", "Aggressive multis and appearance attacks", "Roman opens with a fast, aggressive flow, directly attacking Badee Harz's appearance. He uses comparisons to Uncle Phil and 'Wilf', mocks her hygiene, and directly addresses rumors ('some say that I killed my ex, but if that was true you're next to be killed'), setting a dominant and threatening tone."],
  ["Round 1 — Badee Harz", "Personal disrespect and addiction claims", "Badee Harz immediately targets Roman's personal life and alleged habits, calling him a 'junkie' and a 'pisshead'. She delivers a highly disrespectful angle aimed at his family and role as a father, aiming for maximum shock value."],
  ["Round 2 — Roman", "The 2v1 dropout and weight angles", "Roman addresses the original setup of the battle, revealing it was supposed to be a 2-on-1 handicap match, but claims 1 Flaymah backed out. He then pivots to rapid-fire fat jokes ('lose some weight, go for a run G, go do crunches, stop with the Crunchy') and dismisses her credibility entirely."],
  ["Round 2 — Badee Harz", "Crossing the line", "Badee Harz delivers one of the darkest rounds in GZone history, explicitly disrespecting Roman's deceased partner ('RIP to your BM, that b***h is dead'). She questions Deeno's association with Roman and attacks Roman's legacy in the battle scene, closing with unrelenting shock tactics."],
  ["Round 3 — Roman", "Unlimited bars and explicit angles", "Roman keeps the momentum high with explicit, derogatory claims ('she's a goat for giving throat') and asserts his lyrical dominance ('you're done out unlimited bars'). He matches her disrespect with ruthless character assassination."],
  ["Round 3 — Badee Harz", "Doubling down on addiction", "Badee Harz concludes by dismissing the battle itself as less important than his personal issues ('don't know why you're trying to battle me, go battle your addiction'). She stays committed to the junkie angle until the end, framing him as a broken opponent."]
];

const callbacks = [
  {
    title: "The Trojan Condom Prop",
    detail: "During her first round, Badee Harz physically throws a Trojan condom at Roman to accompany her bar: 'hey Roman your dad should have used a trojan'. The use of the physical prop heightens the disrespect and generates a massive reaction from the crowd.",
  },
  {
    title: "The 2v1 Handicap Match",
    detail: "Roman reveals that the clash was originally scheduled as a 2v1 handicap match featuring Badee Harz and 1 Flaymah against him. Roman uses 1 Flaymah's absence to mock Badee Harz, stating he still turned up despite being outnumbered initially.",
  },
  {
    title: "Roman addresses the allegations",
    detail: "Roman uses the rumors surrounding his past ('some say I killed my ex') and flips them into a direct threat against Badee Harz, taking away the angle before she can use it.",
  },
  {
    title: "Badee Harz's extreme shock value",
    detail: "Badee Harz focuses heavily on Roman's deceased baby mother and wishes severe illness upon him. While battle rap often pushes boundaries, this level of personal disrespect shifts the entire atmosphere of the room.",
  }
];

const notableBars = [
  {
    name: "Roman",
    bars: [
      ["Some say that I killed my ex, but if that was true you're next to be killed. You best run for the hills cause you know you're done in, the Roman's coming.", "Roman brilliantly absorbs real-world controversies and flips them into an active threat, neutralizing the angle before Badee Harz can use it."],
      ["This was meant to be a 2v1, two spastics, one handicap. Baddie still turned up but Flaymah didn't want to clash with man.", "A direct address of the behind-the-scenes booking drama. Roman weaponizes his missing opponent's absence to portray himself as an unshakeable, feared veteran."],
      ["Yuck she's filth she looks like one don called Wilf, I don't think Wil would leave fresh prints on the cake and you're fat like uncle Phil.", "An intricate pop-culture scheme layering Fresh Prince of Bel-Air references to execute a highly visual appearance attack."],
      ["I've had enough of the fake allegations you ain't creative enough to be real.", "Roman preemptively dismisses his opponent's writing ability, asserting that she relies on fabricated drama because she lacks genuine lyrical creativity."],
      ["This is somebody's mom and somebody actually bred this, so I know somebody is dumb.", "A ruthless breakdown of Badee Harz's lineage, stripping away her battle rap persona to attack her intelligence and family tree directly."],
      ["The same night you conceived your baby, dad should have got a gun, click click boom, clear that room, shot through the womb of his baby mom.", "One of the most aggressively violent bars of the clash. Roman matches Badee Harz's shock value with extremely dark, cinematic imagery aimed at her parents."],
      ["First time I met this bird she stunk, her fragrance is a earthy one.", "A blunt hygiene attack intended to completely degrade Badee Harz's credibility and standing in the room."],
      ["Lose some weight, go for a run G. Go do crunches, stop with the Crunchy.", "Roman switches his cadence for a rapid sequence of internal rhymes, blending fitness terminology with a chocolate brand for a direct weight punchline."],
      ["Is it because I'm magic with the wand and I'll turn this place into Azkaban?", "Flexing his technical wordplay, Roman uses a Harry Potter reference to metaphorically describe his lyrical dominance over the venue."],
      ["She's got time off leading the blind but blindly walk straight into a war god.", "An elevation of status. Roman frames the battle not as a competition between peers, but as a fatal mistake against a 'war god'."],
      ["Go make dinner or run me a bath you pussy, time well done.", "A deeply disrespectful and dismissive closing statement meant to assert total authority as the round ends."],
      ["Her prep speed older than tits but she sits on her arse and her tread is sealed.", "A fast-paced rhyme scheme mocking her lifestyle, work ethic, and overall presentation in the scene."],
      ["You lost the plot like a stolen caravan, is keeping track of my wins in the tally man.", "Roman reminds the audience of his formidable winning streak, reinforcing his veteran pedigree within GZone."],
      ["This s**t will stun up and she ain't stunning, I'll go to a son that I've done your mum in.", "A classic battle rap trope combining appearance insults with boastful, exaggerated dominance over her family."],
      ["Why have your flats got a long face you ain't even mad that you're unclaimed and why is she built like a door frame.", "A barrage of heavily descriptive insults aimed at dismantling her physical posture and build."]
    ],
  },
  {
    name: "Badee Harz",
    bars: [
      ["You're a drunk, you're a junkie, you're a pisshead, you smoke funky.", "Badee Harz establishes her core thesis for the battle immediately, attempting to shatter Roman's intimidating veteran aura by framing him simply as an addict."],
      ["RIP to your BM, that b***h is dead, can't even send her a DM.", "An incredibly dark, boundary-crossing line. Badee sacrifices traditional wordplay for pure, unadulterated shock value, instantly shifting the tension in the room."],
      ["You've been battling for 10 years straight up pussy, it's not that deep. Coming into GZone thinking that you're a GOAT, but really you're just one sheep.", "A direct challenge to Roman's veteran legacy, suggesting that his decade-long career holds no weight in the modern GZone era."],
      ["Look at the skeezer there's too many pints of lava, every time he looks in the mirror he wishes that he was longer.", "A multi-layered attack combining criticisms of his drinking habits with a direct insult to his masculinity."],
      ["Drama calm as a b***h and I am your karma, hey Roman your dad should have used a trojan.", "A deeply personal and aggressive insult questioning his very existence and right to be in the ring."],
      ["Naughty professor's potion not gonna save you, like when it's your baby dude this brother's eating all the baby food.", "Badee blends appearance attacks with family disrespect, using a fat joke to claim he deprives his own children."],
      ["They're like maddie why you so rude, because I'm battling another man with big boobs, another one of DJ Khaled.", "A comedic punchline directly targeting his weight and appearance, designed to generate immediate crowd laughter."],
      ["Done your flow when we know that it's basic, basically you don't want to play with me.", "A critique of Roman's technical rapping ability, dismissing his established cadence as simple and uninspired."],
      ["First you made me battle a viking and now it's a roman, you know what rhymes with roman, um harley cooman, now I'm just trolling.", "A rare moment of meta-awareness where Badee breaks the fourth wall to acknowledge the ridiculousness of her opponents' gimmicks."],
      ["How do you sleep at night like reller, how do you look him in his eyes like reller, do better.", "An angle aimed at Roman's moral character and loyalty, attempting to strip away his credibility among his peers."],
      ["Dino how is this your boy, how is he your own model, he's a drunk fat f**k got s**t bars and just waffles.", "Badee boldly calls out the league owner mid-round, questioning the entire foundation of why Roman is held in such high regard."],
      ["Ginger you made the right choice bringing me on GZone, have to buy the couple man up and let them know that this is the queen's home.", "A confident, aggressive claim to the GZone throne, attempting to cement herself as the undisputed top female talent."],
      ["Oi Roman you're done out unlimited bars, you know they can't run out, still throw shade even without the sun out.", "Badee asserts her lyrical stamina, claiming she has an endless supply of material specifically tailored for his downfall."],
      ["How is your baby mom she's turning out of grave looking at your latest one, must hurt when you look at your child damn you must hate your son.", "A relentless continuation of the deceased partner angle, twisting the trauma into a psychological attack on his current family."],
      ["Don't know why you're trying to battle me, go battle your addiction, every time that you pick up a bit I know you're thinking twice.", "The ultimate closing thesis of her performance: framing Roman not as a formidable battle rapper, but as a broken man fighting personal demons."]
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

export interface PropType {
  name: string;
  user: string;
  icon: string;
}

export function BadeeHarzVsRomanSummary({ props }: { props?: PropType[] }) {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="prose prose-invert prose-zinc max-w-none prose-lg space-y-8 text-zinc-300 leading-relaxed font-light">
          <p>The highly anticipated grudge match between Roman and Badee Harz delivered one of the most intense, aggressive, and boundary-pushing battles of the season. Originally booked as a 2v1 handicap match featuring 1 Flaymah, Roman entered the ring alone against Badee Harz to settle their differences in a clash characterized by heavy personal disrespect and contrasting styles.</p>
          <p>Roman opened the battle with a relentless, fast-paced flow. He immediately targeted Badee Harz's appearance, hygiene, and credibility, weaving intricate multis and dark humor. By addressing his own controversies head-on, Roman established a dominant, veteran presence in the room.</p>
          <p>Badee Harz responded by abandoning traditional angles in favor of extreme shock value. She repeatedly attacked Roman's alleged addictions and delivered some of the darkest material seen in the GZone, explicitly disrespecting his deceased partner and family. The sheer disrespect shifted the energy of the room, forcing the audience to react to the raw hostility of her rounds.</p>
          <p>In his second round, Roman addressed the original 2v1 booking, using 1 Flaymah's absence to further belittle Badee Harz. He showcased his experience by controlling his pacing, delivering a rapid sequence of weight jokes, and maintaining his commanding stage presence despite the personal nature of Badee's attacks.</p>
          <p>Badee Harz closed her performance by doubling down on the shock tactics, questioning Roman's legacy in the UK battle scene and challenging his status as a veteran. However, Roman's superior flow, structured writing, and undeniable stage presence proved too much to overcome.</p>
          <p>The official decision awarded the victory to Roman, whose technical ability and crowd control triumphed over Badee Harz's heavy reliance on shock value and personal disrespect.</p>
        </div>

        {props && props.length > 0 && (
          <div className="mt-12 p-6 bg-zinc-950 border-2 border-brand/30 rounded-xl shadow-lg">
            <h3 className="text-brand font-display uppercase tracking-widest text-sm mb-4">Evidence: Props Used</h3>
            <div className="space-y-4">
              {props.map((prop) => (
                <div key={`${prop.user}-${prop.name}`} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 shrink-0">
                    <span className="text-2xl">{prop.icon}</span>
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
            <h3 className="text-2xl font-display uppercase text-brand mb-6">Roman</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Roman demonstrated exactly why he is considered a veteran of the scene. His breath control, rapid delivery, and ability to weave intricate multis gave his rounds a highly polished feel.</p>
              <p>His strongest moments came when he addressed the meta-narrative of the battle, such as the rumors surrounding him and the fact that his opponents backed out of the 2v1 setup. This made him look fearless and in complete control of the narrative.</p>
              <p>By absorbing Badee Harz's extremely personal attacks without losing composure, Roman proved his resilience and maintained his dominant energy from start to finish.</p>
            </div>
          </article>
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">Badee Harz</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Badee Harz opted for a high-risk strategy based entirely on shock value and boundary-crossing disrespect. Her willingness to attack Roman's deceased partner and family created incredibly tense moments in the room.</p>
              <p>While the shock tactics guaranteed a reaction, they often overshadowed her actual rapping ability. The reliance on purely offensive material meant that when the shock wore off, the rounds lacked the structural depth to compete with Roman's writing.</p>
              <p>Despite the loss, Badee Harz established herself as an unpredictable and fearless opponent willing to go anywhere to secure a reaction.</p>
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

export function BadeeHarzVsRomanResult() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-4 text-white">The Result</h3>
      <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
        <p>Roman delivered a highly polished performance with rapid multis, veteran stage presence, and a commanding delivery.</p>
        <p>Badee Harz relied heavily on boundary-pushing disrespect and shock tactics, which created tension but lacked the structural depth of her opponent.</p>
        <p>Roman was awarded the official victory for his superior crowd control, writing, and overall execution.</p>
      </div>
    </div>
  );
}

export function BadeeHarzVsRomanHighlights() {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <h3 className="text-xl font-display uppercase mb-6 text-white">Key Technical Highlights by MC</h3>
      {[
        ["Roman", [
          ["Veteran pacing", "Controlled the rhythm of the battle with rapid, multi-syllabic rhyme schemes."],
          ["Narrative control", "Used the 2v1 dropout and personal rumors to frame himself as fearless and dominant."],
          ["Main weakness", "Some visual appearance attacks were standard for the format, lacking the deep personalization of his opponent's rounds."],
          ["Winning edge", "Superior flow, composure under pressure, and structured writing."],
        ]],
        ["Badee Harz", [
          ["Extreme shock value", "Willingly crossed boundaries to attack Roman's family and deceased partner for maximum room reaction."],
          ["Character assassination", "Focused heavily on framing Roman as an addict rather than a respected veteran."],
          ["Main weakness", "The reliance on dark, offensive material overshadowed the actual technical ability and structure of her rounds."],
          ["Outcome", "Created memorable, tense moments, but was outclassed by Roman's polished delivery."],
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
