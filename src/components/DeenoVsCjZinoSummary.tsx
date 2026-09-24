import type { ReactNode } from "react";

const rounds = [
  ["Round 1 — CJ Zino", "Weight insults, shock claims, and a prop threat", "CJ Zino opens by attacking Deeno's weight and appearance. He makes unverified shock allegations involving local parks, children, and Megan. He ends the round by threatening to bring out another lemon, explicitly connecting the threat to Deeno's earlier loss to TymeLess."],
  ["Round 1 — Deeno", "An alphabet breakdown and hierarchical claims", "Deeno begins by critiquing CJ's G-Zone debut and his simplistic counting. He structures his counter-attack around an A-to-F alphabet scheme that attacks CJ's status, family, and credibility. He portrays CJ as nervous and uses the ocean-to-token comparison to establish dominance."],
  ["Round 2 — CJ Zino", "Props, spelling schemes, and crowd interaction", "CJ Zino continues the prop game by bringing out a jar of Marmalade and comparing Deeno to Paddington Bear/Winnie the Pooh. He then adopts a spelling-focused approach with P-A-S-S-I-V-E. He also addresses other battlers in the room, specifically calling out 7wxve, expanding his hostility beyond Deeno to claim dominance over the whole room."],
  ["Round 2 — Deeno", "The childhood cancer revelation and losing streaks", "Deeno completely shifts the tone of the clash. He introduces the fact that CJ had cancer as a child, framing it as the reason CJ gets 'special treatment'. He then systematically breaks down CJ's battle record, pointing out his consecutive losses to 1Flaymr, Z.K, and now Deeno himself."],
  ["Round 3 — CJ Zino", "Defensive answers and a crossed line", "CJ tries to confront the cancer angle but quickly pivots to extreme shock material targeting Deeno's partner. The round breaks down into a live confrontation when Deeno interrupts CJ mid-performance, directly challenging him for disrespecting his partner while she is standing in the room."],
  ["Round 3 — Deeno", "Sustained pressure and an authorship accusation", "Deeno doubles down on the cancer material, claiming the illness is CJ's 'only answer' to everything. He then pivots to a fatal credibility attack: he claims 'HM' (a well-known platform figure) wrote CJ's bars for him, undermining CJ's entire performance and sealing the victory."],
];

const callbacks = [
  {
    title: "The Lemon Prop Threat",
    detail: "CJ Zino threatens to bring a lemon to the battle, a direct callback to TymeLess's iconic use of lemons in his victory over Deeno. By referencing the prop, CJ attempts to summon the memory of Deeno's defeat to undermine his current confidence.",
  },
  {
    title: "The Marmalade / Bear Comparison",
    detail: "CJ Zino introduces a jar of Marmalade, mocking Deeno's size and comparing him to Paddington Bear. It's a visual, prop-based insult attempting to demean Deeno's tough \"Viking\" persona into something softer.",
  },
  {
    title: "Calling out 7wxve",
    detail: "During his second round, CJ directs smoke at 7wxve, another MC in the room. This continues the G-Zone tradition of battlers attacking spectators and future opponents mid-clash to build tension for upcoming matchups.",
  },
  {
    title: "The Losing Streak",
    detail: "Deeno explicitly lists CJ's recent G-Zone history: 'You lost to Flamer, you lost to ZK, Then you lost to me, he loves to lose'. Deeno uses CJ's own record against him to destroy his credibility before the judges even vote.",
  },
  {
    title: "Addressing the Partner",
    detail: "CJ targets Deeno's partner with aggressive, sexually explicit bars. Deeno breaks character to pause the battle, pointing out that his partner is physically in the room. The real-world confrontation breaks the fourth wall of the battle.",
  },
];

const notableBars = [
  {
    name: "CJ Zino",
    bars: [
      ["How the fuck do I get paid less than Maldino? / Weighs in pounds, that's 300 pounds", "CJ opens with a direct attack on Deeno's size and status, questioning the pay hierarchy of the league."],
      ["I was gonna bring another lemon in again / One prop is enough for them", "He acknowledges TymeLess's prop scheme and threatens to use it, wielding its psychological weight against Deeno without needing the physical object."],
      ["So I brought this guy some marmalade / Should've got a red hat too", "CJ uses a jar of marmalade to compare Deeno to Paddington Bear, attempting to diminish his imposing physical presence."],
      ["Dishin' out smoke for all of you cunts / Back to the big fucking viking", "CJ breaks focus to insult the entire room, specifically calling out 7wxve, before snapping back to Deeno."],
      ["I thought you talked about cancer / But I didn't flip the script", "CJ attempts a defensive prebuttal to Deeno's controversial angle but abandons it to pursue shock material."],
    ],
  },
  {
    name: "Deeno",
    bars: [
      ["A stands for annoying little cunt / B stands for I'm gonna bill him in a blunt / C stands for I can't see you winning on G-Zone", "Deeno uses a simple, escalating alphabet scheme to systematically disrespect CJ's presence in the league."],
      ["I'm number one / Goat is three nil / Every time that is my slogan / You're Randy Savage / I am the ocean / You get no views / I've got motion", "A sequence establishing Deeno's dominance, comparing CJ to a token in Deeno's arcade."],
      ["As a baby I was full of the flu / But as a baby CJ had cancer", "The pivotal shock value moment of the battle. Deeno weaponizes CJ's childhood illness to drain the room of any sympathy."],
      ["You lost to Flamer, you lost to ZK / Then you lost to me, he loves to lose", "A factual, devastating summary of CJ's recent G-Zone trajectory that frames CJ as a guaranteed loser."],
      ["I spoke to HM, bars and that / ... / HM wrote your bars / Which means you didn't write your bars", "The final nail in the coffin. Deeno strips CJ of his authenticity by alleging he uses a ghostwriter."],
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

export function DeenoVsCjZinoSummary() {
  return (
    <>
      <SummarySection title="Clash Summary">
        <div className="prose prose-invert prose-zinc max-w-none prose-lg space-y-8 text-zinc-300 leading-relaxed font-light">
          <p>Episode 25 delivers a highly personal and intense grudge match between Deeno "The Viking" and CJ Zino. Both MCs brought extreme disrespect, but the clash is ultimately defined by Deeno's calculated dismantlement of CJ's credibility, culminating in a unanimous victory.</p>
          <p>CJ Zino opened with aggressive attacks on Deeno's weight and appearance, deploying unverified shock allegations and attempting to weaponize Deeno's past defeat by threatening to produce a lemon prop—a direct callback to TymeLess. Deeno answered with a structured A-to-F alphabet scheme, dismissing CJ as an "annoying little cunt" who would never win in G-Zone.</p>
          <p>The tone darkened drastically in round two. After CJ brought out a jar of marmalade to mock Deeno, spelled out P-A-S-S-I-V-E, and threw strays at 7wxve in the crowd, Deeno pivoted to a brutal angle about CJ having cancer as a baby. He used the illness to argue that CJ only receives "special treatment" and followed up by meticulously listing CJ's recent losses to 1Flaymr and Z.K.</p>
          <p>Round three descended into chaos. CJ Zino targeted Deeno's partner with sexually explicit bars, prompting Deeno to break character and interrupt the battle, calling CJ out for disrespecting his partner while she was physically standing in the room. Deeno then closed the battle emphatically, doubling down on the cancer angle and delivering a fatal blow: accusing CJ of using 'HM' as a ghostwriter. The combination of shock value, factual record-checking, and the authorship accusation secured Deeno a unanimous decision from both the hosts and the room.</p>
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
            <h3 className="text-2xl font-display uppercase text-brand mb-6">CJ Zino</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>CJ Zino relied heavily on shock value, props, and crowd interaction. Threatening to bring back the lemon prop was a smart psychological tactic intended to rattle Deeno by reminding him of a past defeat, and actually producing the marmalade prop established his visual-heavy attack. His decision to call out 7wxve mid-round showed his willingness to play the villain against the entire room.</p>
              <p>However, CJ's reliance on unverified shock material about Deeno's partner backfired when it led to a real-world confrontation. Furthermore, he struggled to defend himself against Deeno's factual attacks regarding his losing streak and the devastating ghostwriting accusation at the end of the battle.</p>
            </div>
          </article>
          <article className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-display uppercase text-brand mb-6">Deeno</h3>
            <div className="space-y-6 text-zinc-300 leading-relaxed font-light">
              <p>Deeno delivered a masterclass in dismantling an opponent's credibility. He bypassed basic insults and instead weaponized CJ's real life: his childhood illness, his documented losing streak, and his behind-the-scenes writing process.</p>
              <p>By framing the cancer angle as the only reason CJ gets "special treatment" and then revealing the ghostwriting allegation, Deeno effectively stripped CJ of any authenticity. The live interruption to defend his partner also showcased Deeno's commanding presence and refusal to let disrespect slide in his own arena, cementing a definitive, unanimous victory.</p>
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
