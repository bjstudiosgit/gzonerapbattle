import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pengameBattles as battles } from "../data/pengameBattles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const battlesFilePath = path.resolve(__dirname, "..", "data", "pengameBattles.ts");
const transcribeDir = path.resolve(__dirname, "..", "..", "transcribe");
const archivedDir = path.resolve(transcribeDir, "archived");

// Create archived folder if it doesn't exist
if (!fs.existsSync(archivedDir)) {
  fs.mkdirSync(archivedDir, { recursive: true });
}

// 7 Battle Reports mapping
const newReports: Record<string, any> = {
  "4x16": {
    "clashSummary": "Grams and Skamz clashed in a highly anticipated match-up that ended up being one-sided. Grams delivered three solid rounds of lyrical performance, utilizing pirate hunter metaphors, anime callbacks, and sharp critiques of Skamz's career. Skamz struggled to match the volume and focus, admitting to a flop in the second round and ultimately dropping the mic in the third round due to lack of preparation. Grams was declared the winner after Skamz's forfeit.",
    "performanceAnalysis": [
      {
        "performer": "grams",
        "overview": "Grams brought premium lyricism and consistent flows, controlling the tempo and building strong narrative angles throughout all three rounds.",
        "lyricalThemes": "Anime references (Zoro/Luffy), street life authenticity, and career longevity.",
        "keyTechnicalHighlights": [
          {
            "title": "Star/Alignment Scheme",
            "description": "Flipping Skamz's star status by threatening to shoot him out of alignment."
          },
          {
            "title": "Melanin Reference",
            "description": "Boasting about physical and presence advantages in the third round."
          },
          {
            "title": "Erling Haaland Metaphor",
            "description": "Highlighting his clinical finishing style on the beat."
          }
        ]
      },
      {
        "performer": "skamz",
        "overview": "Skamz had solid energy in his opening round but completely lost composure, leading to a freestyle attempt in the second round and a forfeit in the third.",
        "lyricalThemes": "Disrespect, personal beef, and name wordplay.",
        "keyTechnicalHighlights": [
          {
            "title": "Amsterdam Travel Line",
            "description": "A clean setup sending Grams 'high' like Amsterdam."
          },
          {
            "title": "Intent to Supply Angle",
            "description": "Threatening to pull Grams out of the boot like a drug charge."
          },
          {
            "title": "Nanny Callback",
            "description": "A repeated warning using family status as pressure."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "grams",
        "theme": "Anime",
        "bar": "Every other line, I'm a pirate hunter. Like Zoro, I'll cut through diamonds, so fuck who's shining.",
        "explanation": "A direct reference to One Piece character Zoro, framing his writing as sharp enough to cut diamonds."
      },
      {
        "performer": "grams",
        "theme": "Status",
        "bar": "You can be a star, I will still shoot you out of alignment.",
        "explanation": "Clever astronomy wordplay used to counter Skamz's status as a headline star."
      },
      {
        "performer": "skamz",
        "theme": "Travel",
        "bar": "Like Amsterdam, I'll send him high, he'll never land.",
        "explanation": "A standard wordplay on getting high in Amsterdam and Neverland."
      },
      {
        "performer": "skamz",
        "theme": "Street",
        "bar": "I'll drag grams out of the boot, like you're getting charged for intent to supply.",
        "explanation": "A clever punchline tying the drug unit grams to the back of a car (the boot)."
      },
      {
        "performer": "grams",
        "theme": "Football",
        "bar": "On attack I'm like Erling Haaland. Commando, my finishing brilliant.",
        "explanation": "Comparing his rapid flow and clinical finishing to Manchester City striker Haaland."
      }
    ],
    "oddMoments": [
      "Skamz openly admitted to flopping his second round and freestyle-ended it.",
      "Skamz forfeited his third round, dropping the mic and walking off."
    ],
    "coolMoments": [
      "Grams' flow switch in the third round on the grime beat was a highlight.",
      "Skamz's opening round had strong delivery before the stumbles."
    ],
    "postBattleContext": "Due to Skamz's forfeit in the third round, Grams was the consensus winner of the battle.",
    "winner": "grams"
  },
  "4x17": {
    "clashSummary": "F-Don faced JC in a battle that highlighted the gap between experienced league veterans and newcomers. JC stepped up first but struggled to construct structured rounds, resorting to short freestyle attempts and forgetting his bars. F-Don capitalized on this with three clean, high-performance rounds, showcasing his technical wordplay, references to Goku and Saitama, and strong South London angles. JC was unable to mount a serious challenge, giving F-Don a dominant victory.",
    "performanceAnalysis": [
      {
        "performer": "f-don",
        "overview": "F-Don showed why he is a top lyricist in the league, dropping layered punches and executing his rounds with supreme confidence.",
        "lyricalThemes": "Pop culture (Goku/Saitama), South London dominance, and high top hair insults.",
        "keyTechnicalHighlights": [
          {
            "title": "Saitama Reference",
            "description": "Using One-Punch Man to frame his punchline efficiency."
          },
          {
            "title": "Ten Years / Hair Scheme",
            "description": "A brutal double-meaning on JC's hair and lack of progress."
          },
          {
            "title": "Transgender/Benders Angle",
            "description": "A shocking personal punchline targeting JC's lifestyle."
          }
        ]
      },
      {
        "performer": "jc",
        "overview": "JC was clearly nervous during his debut, struggling with the beat and failing to deliver prepared material in his second and third rounds.",
        "lyricalThemes": "West London claims, freestyle energy, and simple insults.",
        "keyTechnicalHighlights": [
          {
            "title": "Bunion Metaphor",
            "description": "A comparison about busting F-Don like a bunion."
          },
          {
            "title": "Dover Cliffs Image",
            "description": "A visual description of flying off the cliffs of Dover."
          },
          {
            "title": "Alicia Keys Flip",
            "description": "Addressing F-Don's appearance in his short second round."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "f-don",
        "theme": "Anime",
        "bar": "They call me Saitama. Cause one punch line is all I need to win.",
        "explanation": "A One-Punch Man reference to show he can finish the battle in one line."
      },
      {
        "performer": "f-don",
        "theme": "Anime",
        "bar": "They call me Goku because every season I'm on new levels.",
        "explanation": "Dragon Ball Z reference representing his growth and superiority."
      },
      {
        "performer": "f-don",
        "theme": "Appearance",
        "bar": "You've had the same hairstyle for ten years... you wouldn't win this battle if I gave you ten years.",
        "explanation": "A double-meaning punchline on JC's hair and a prison sentence."
      },
      {
        "performer": "jc",
        "theme": "Energy",
        "bar": "Hopefully I'll be back on pen game, and bust you just like a bunion.",
        "explanation": "A rhyme setup comparing F-Don to a bunion breakout."
      },
      {
        "performer": "f-don",
        "theme": "Status",
        "bar": "You couldn't find somebody more nameless. Margs, you're gonna need to pick up the mic and bring me someone who's famous.",
        "explanation": "Challenging the host to bring him better opponents rather than debutants."
      }
    ],
    "oddMoments": [
      "JC kept stopping and apologizing, asking to freestyle because he forgot his written material.",
      "F-Don started his final round, stopped, wheeled the beat, and restarted to make sure he delivered it perfectly."
    ],
    "coolMoments": [
      "F-Don't rapid flow delivery on the acapella section of his first round.",
      "The crowd's reaction to F-Don's South London line."
    ],
    "postBattleContext": "F-Don won the battle unanimously after JC repeatedly choked and failed to complete his rounds.",
    "winner": "f-don"
  },
  "4x18": {
    "clashSummary": "Skamz and WhoIsOrion went head-to-head in a chaotic and deeply personal battle at a live show in Peckham. Skamz opened with a barrage of weight-related insults and fat jokes, setting an aggressive tone. WhoIsOrion responded with structured, highly disrespectful rounds, focusing on Skamz's nephew and family. In the third round, WhoIsOrion brought out a doll representing 'baby scams' as a prop, using it to mock Skamz's parenting and uncle status. WhoIsOrion won the crowd vote in a very close and dramatic finish.",
    "performanceAnalysis": [
      {
        "performer": "skamz",
        "overview": "Skamz brought his signature high energy and rapid-fire delivery, but relied heavily on weight jokes and simple disrespect.",
        "lyricalThemes": "Weight insults, Big Mac setups, and physical threats.",
        "keyTechnicalHighlights": [
          {
            "title": "Big Mac Scheme",
            "description": "An extended sequence comparing WhoIsOrion to a fast-food order."
          },
          {
            "title": "Amsterdam/High Setup",
            "description": "An aggressive line about sending his opponent to the lord."
          },
          {
            "title": "Samurai Sword Angle",
            "description": "Drawing a sword metaphorically to slice through the competition."
          }
        ]
      },
      {
        "performer": "whoisorion",
        "overview": "WhoIsOrion matched Skamz's disrespect but structured his rounds with superior punchlines, callbacks, and a devastating prop reveal.",
        "lyricalThemes": "Family secrets, the nephew angle, and anime/Top Boy flips.",
        "keyTechnicalHighlights": [
          {
            "title": "Bitch Behind Bars / Remy Scheme",
            "description": "Comparing Skamz's internet presence to Remy Ma behind bars."
          },
          {
            "title": "Epstein/Savile Lines",
            "description": "Dark humor setups targeting Skamz's nephew's safety."
          },
          {
            "title": "Baby Scams Prop",
            "description": "Bringing a doll on stage to physically act out his third-round threats."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "skamz",
        "theme": "Weight",
        "bar": "Can I get a number nine large with extra dip? Type of fat bitch.",
        "explanation": "A GTA Big Smoke reference used to insult Orion's weight."
      },
      {
        "performer": "whoisorion",
        "theme": "Status",
        "bar": "He's only bad in his pen, them pad is strictly rap. He's really a bitch behind bars. Like Remy, we all know that.",
        "explanation": "A double-meaning scheme comparing paper bars to prison bars and Remy Ma."
      },
      {
        "performer": "whoisorion",
        "theme": "Disrespect",
        "bar": "Why did Orion cross the road? To bust in his mother's mouth.",
        "explanation": "A highly offensive joke subverting the classic chicken-crossing-the-road setup."
      },
      {
        "performer": "whoisorion",
        "theme": "Family",
        "bar": "I feel like a victim. I'll bring Jimmy Savile back from the dead, just so we can babysit him.",
        "explanation": "A dark punchline about babysitting Skamz's nephew with a notorious historic figure."
      },
      {
        "performer": "skamz",
        "theme": "Weight",
        "bar": "If he said he got a Mac, look, yeah, a big Mac meal.",
        "explanation": "Flipping Orion's firearm claims into a McDonald's meal joke."
      }
    ],
    "oddMoments": [
      "WhoIsOrion brought a doll representing Skamz's nephew to the stage and threw it on the floor.",
      "Skamz kept interrupting WhoIsOrion's rounds, leading to minor arguments on stage."
    ],
    "coolMoments": [
      "WhoIsOrion's crowd-pulling third round which completely shifted the room's energy.",
      "The maturity shown at the end where both MCs paid respect to each other."
    ],
    "postBattleContext": "WhoIsOrion was declared the winner by crowd noise after a strong third-round performance.",
    "winner": "whoisorion"
  },
  "4x19": {
    "clashSummary": "Ren DMC faced Renaya in a highly anticipated battle that turned out to be a clean sweep. Renaya struggled with nerves and stumbled in all three rounds, failing to complete most of her verses. Ren DMC took advantage of this by delivering three highly polished, aggressive, and creative rounds. He used personal angles about Renaya's parenting, her internet presence, and compared her to Jack from Top Boy. Ren DMC won the battle easily, proving his status as a top contender.",
    "performanceAnalysis": [
      {
        "performer": "ren-dmc",
        "overview": "Ren DMC delivered a masterclass in performance and control, keeping his energy high and adapting to Renaya's chokes with devastating punchlines.",
        "lyricalThemes": "Name flips (Renaya/Oye), parenting angles, and Brixton/Top Boy comparisons.",
        "keyTechnicalHighlights": [
          {
            "title": "Alicia Keys/Brixton Scheme",
            "description": "A smooth opening flow comparing Renaya to a Brixton version of Alicia Keys."
          },
          {
            "title": "Heady One Name-Flip",
            "description": "A witty punchline comparing Renaya's lifestyle to Headie One."
          },
          {
            "title": "Christmas Dinner / Six Man Inner",
            "description": "A holiday-themed double-entendre that hit hard in the room."
          }
        ]
      },
      {
        "performer": "renaya",
        "overview": "Renaya was unable to match Ren DMC's experience, choking repeatedly and leaving most of her rounds unfinished.",
        "lyricalThemes": "Female empowerment, sex insults, and name similarity.",
        "keyTechnicalHighlights": [
          {
            "title": "Cyclical Daddy Issues",
            "description": "An opening angle addressing Ren DMC's role as a father."
          },
          {
            "title": "Stella Artois / Fella Setup",
            "description": "A simple comparison attacking Ren DMC's lifestyle."
          },
          {
            "title": "Teresa / Retard Line",
            "description": "A short setup in her third round addressing Ren DMC's family."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "ren-dmc",
        "theme": "Parenting",
        "bar": "Lift my foot up and sky that kid.",
        "explanation": "Ren DMC explaining how he would deny a child if he had one with Renaya."
      },
      {
        "performer": "ren-dmc",
        "theme": "Identity",
        "bar": "On Pen Game, your name is Renea, but on the road, your name is Oye.",
        "explanation": "A direct name-flip calling out her street rep vs her battle rep."
      },
      {
        "performer": "ren-dmc",
        "theme": "Wordplay",
        "bar": "You give head to everyone, your rap name should have been Heady One.",
        "explanation": "A pun on Headie One's name used as a personal attack."
      },
      {
        "performer": "ren-dmc",
        "theme": "Holiday",
        "bar": "I was in a yard singing Jingle Bells... she was in a yard having Six Man Inner.",
        "explanation": "A Christmas-themed double entendre referencing sexual activity."
      },
      {
        "performer": "ren-dmc",
        "theme": "Disrespect",
        "bar": "Dubai flight getting shitted on... letting some next man tap her.",
        "explanation": "A reference to the Dubai 'porta potty' rumors to demean Renaya."
      }
    ],
    "oddMoments": [
      "Renaya walked off the stage multiple times mid-round after forgetting her bars.",
      "Ren DMC had to repeat sections of his second round due to crowd interruptions."
    ],
    "coolMoments": [
      "Ren DMC's holiday-themed flow in the second round.",
      "Ren DMC's smooth freestyle additions to cover Renaya's stumbles."
    ],
    "postBattleContext": "Ren DMC won the battle unanimously after Renaya choked in every round.",
    "winner": "ren-dmc"
  },
  "4x20": {
    "clashSummary": "Skamz and Kandi battled in a chaotic match-up that was decided in the final round. Kandi got a reload in the first round after an early stumble but recovered to spit highly disrespectful bars, including a line about Dan Dannah. Skamz answered with aggressive punchlines targeting Kandi's girlfriend and street credibility. In the third round, Kandi delivered a fast-paced grime flow that won the room, while Skamz choked and dropped the mic. The host called the battle for Kandi due to Skamz's forfeit.",
    "performanceAnalysis": [
      {
        "performer": "skamz",
        "overview": "Skamz had strong energy in rounds one and two but choked in the third round, dropping the mic and forfeiting the battle.",
        "lyricalThemes": "Girlfriend insults, fake badman claims, and street violence.",
        "keyTechnicalHighlights": [
          {
            "title": "Tasha / Whore Setup",
            "description": "A repeated, aggressive punchline targeting Kandi's girlfriend."
          },
          {
            "title": "PlayStation Theft",
            "description": "A hilarious line about sleeping with Kandi's mother and stealing his console."
          },
          {
            "title": "Mickey Mouse / Boots Metaphor",
            "description": "Mocking Kandi's outfit and appearance."
          }
        ]
      },
      {
        "performer": "kandi",
        "overview": "Kandi overcame an early choke, utilizing his reload to deliver a solid performance and closing with a strong grime verse.",
        "lyricalThemes": "Insiders, feds, street life, and grime flows.",
        "keyTechnicalHighlights": [
          {
            "title": "Dannah Butt Line",
            "description": "A highly controversial bar about Dan Dannah that shocked the room."
          },
          {
            "title": "Epstein Island/Savile setup",
            "description": "A dark setup targeting Skamz's parenting."
          },
          {
            "title": "Surgical / Grime Flow",
            "description": "Slicing through Skamz with high-speed grime delivery in the third round."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "kandi",
        "theme": "Disrespect",
        "bar": "Sniff crack out of Dandana's arsecheeks.",
        "explanation": "An extremely vulgar line targeting league regular Dan Dannah."
      },
      {
        "performer": "skamz",
        "theme": "Humor",
        "bar": "I found out he still lives with his momma, I gave that bitch dick and stole your PlayStation.",
        "explanation": "A classic mom joke combined with game console theft to disarm Kandi."
      },
      {
        "performer": "kandi",
        "theme": "Insult",
        "bar": "You wear panties there that are lacy, tuck your dick in between your legs and pretend you're a lady.",
        "explanation": "A direct attack questioning Skamz's masculinity."
      },
      {
        "performer": "skamz",
        "theme": "Wordplay",
        "bar": "This demon's getting demonetised... I got God on my side.",
        "explanation": "Clever play on 'demon' and 'demonetised' matching the YouTube format."
      },
      {
        "performer": "kandi",
        "theme": "Violence",
        "bar": "With this sword man I'll chop man's face off.",
        "explanation": "An aggressive grime-style delivery closing his final round."
      }
    ],
    "oddMoments": [
      "Kandi had a complete restart in the first round which caused tension.",
      "Skamz dropped the mic in the third round after a bad stumble, leading to his defeat."
    ],
    "coolMoments": [
      "Kandi's transition into a grime beat in the third round.",
      "The high energy and back-and-forth shouting in the room."
    ],
    "postBattleContext": "Kandi was declared the winner after Skamz choked and dropped the mic in his final round.",
    "winner": "kandi"
  },
  "4x21": {
    "clashSummary": "Forever Tapped (FT) and iiiBEREALZ (IB Reels) faced off in a chaotic Christmas-day battle that saw both MCs struggle in the final round. iiiBEREALZ had a solid first two rounds but choked in the third. FT capitalized but then stumbled himself in the third round, attempting to explain a confusing 'pause' setup which led to arguments with the crowd and running over time. FT was declared the winner, but the battle left the room divided.",
    "performanceAnalysis": [
      {
        "performer": "ft",
        "overview": "FT brought strong presence and violent schemes but was let down by a messy third round that devolved into explanations.",
        "lyricalThemes": "Street politics, weapon use, and crowd control.",
        "keyTechnicalHighlights": [
          {
            "title": "Rambo in Hip Line",
            "description": "A sharp flow about carrying a knife and rising glocks."
          },
          {
            "title": "Nightmares/Dreams Setup",
            "description": "A clever punchline about dreams turning into nightmares."
          },
          {
            "title": "Pause/Sperm Scheme",
            "description": "A highly controversial and confusing third-round setup that he tried to explain."
          }
        ]
      },
      {
        "performer": "iiiberealz",
        "overview": "iiiBEREALZ showed good technical writing in the early rounds but was unable to finish his third round, resulting in a stumble.",
        "lyricalThemes": "Short man syndrome, chapped lips, and album sales.",
        "keyTechnicalHighlights": [
          {
            "title": "Neck/Neckless Pun",
            "description": "A quick setup addressing FT's physical build."
          },
          {
            "title": "Heath Ledger / Joker Reference",
            "description": "A pop-culture reference targeting FT's mental state."
          },
          {
            "title": "Chapped Lips / Pigment setup",
            "description": "A funny insult about FT's facial appearance."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "iiiberealz",
        "theme": "Height",
        "bar": "You got short man syndrome. Watch your battles and nah, you ain't win none.",
        "explanation": "Targeting FT's height and his historical win record."
      },
      {
        "performer": "ft",
        "theme": "Wordplay",
        "bar": "Battling me, you're battling nightmares. That's what you get, following dreams.",
        "explanation": "A clean flip of the 'follow your dreams' motivational phrase."
      },
      {
        "performer": "ft",
        "theme": "Disrespect",
        "bar": "I'll pull the rap out the trousers like a dick and bust this nine... and I said pause.",
        "explanation": "The confusing double-entendre that FT spent the rest of his round explaining."
      },
      {
        "performer": "iiiberealz",
        "theme": "Critique",
        "bar": "I saw your video signs... you say don't walk with a knife, then I heard your songs and I'm caught in a bind.",
        "explanation": "Calling out FT's hypocrisy between his anti-knife campaign and his actual lyrics."
      },
      {
        "performer": "ft",
        "theme": "Violence",
        "bar": "Burn you then I'll burn in my spliff... coke get crumbled like cookie bud.",
        "explanation": "Comparing drug prep to destroying his opponent in the clash."
      }
    ],
    "oddMoments": [
      "FT stopped his third round multiple times to explain his 'pause' punchline to a laughing crowd.",
      "The host had to stop FT's third round because it was running way over time."
    ],
    "coolMoments": [
      "FT's aggressive second round flow which gained the crowd's favor.",
      "iiiBEREALZ's smooth delivery in his opening verse."
    ],
    "postBattleContext": "FT was listed as the winner, though both MCs suffered heavy stumbles in their final rounds.",
    "winner": "ft"
  },
  "4x22": {
    "clashSummary": "Cheezee and Smil3z closed the night in a battle that had a controversial finish. Smil3z was consistent across three rounds, delivering sharp personal angles about Cheezee's family and his job at a betting shop. Cheezee had a solid performance but got distracted by Rizzo in the crowd during his third round, leading to stumbles. Despite the crowd's mixed reactions, the host Big Marv explicitly selected Smil3z as the winner to go through to the tournament.",
    "performanceAnalysis": [
      {
        "performer": "cheezee",
        "overview": "Cheezee had good presence and flow but lost his focus in the final round due to crowd interactions.",
        "lyricalThemes": "Energy, Messi comparisons, and direct challenges.",
        "keyTechnicalHighlights": [
          {
            "title": "Messi Comparison",
            "description": "An opening flow comparing his longevity to Lionel Messi."
          },
          {
            "title": "Upside Down Smile",
            "description": "A clean name-flip setup targeting Smil3z."
          },
          {
            "title": "Knifed by a Clown",
            "description": "A sharp insult referencing the name Smil3z."
          }
        ]
      },
      {
        "performer": "smil3z",
        "overview": "Smil3z stayed focused and delivered three clean rounds of personal setups, controlling the stage and securing a tournament spot.",
        "lyricalThemes": "Family secrets, job insults, and gruesome finishes.",
        "keyTechnicalHighlights": [
          {
            "title": "Cardi B Shoes Line",
            "description": "A setup about leaving the scene with bloody shoes."
          },
          {
            "title": "Bookies/Betting Scheme",
            "description": "A personal angle about Cheezee's job and betting on his death."
          },
          {
            "title": "Cooking Cheese Metaphor",
            "description": "A funny, high-temperature grime scheme in the third round."
          }
        ]
      }
    ],
    "notableBars": [
      {
        "performer": "smil3z",
        "theme": "Violence",
        "bar": "Left that scene with bloody shoes like Cardi B.",
        "explanation": "Referencing Cardi B's famous song 'Bodak Yellow' about bloody shoes."
      },
      {
        "performer": "smil3z",
        "theme": "Job",
        "bar": "I heard you work at the bookies... well, I'll place a bet: in 60 seconds, you'll be dead.",
        "explanation": "Flipping Cheezee's occupation at a betting shop into a threat."
      },
      {
        "performer": "cheezee",
        "theme": "Name",
        "bar": "I'll turn that smile straight upside down if you think that you're fucking with me now.",
        "explanation": "A clean play on Smil3z's name and physical expressions."
      },
      {
        "performer": "smil3z",
        "theme": "Cheese",
        "bar": "Cooking cheese... you might smell man through your screen.",
        "explanation": "Using a heat/cooking metaphor based on his opponent's name Cheezee."
      },
      {
        "performer": "cheezee",
        "theme": "Parenting",
        "bar": "Don't pay rent cause he lives with his chick, and he ain't got dough to give to his kids.",
        "explanation": "A sharp third-round personal attack accusing Smil3z of neglecting his children."
      }
    ],
    "oddMoments": [
      "Cheezee got distracted by Rizzo shouting in the crowd and stopped mid-verse to argue.",
      "The host complained about Cheezee's third round interruption but allowed a restart."
    ],
    "coolMoments": [
      "Smil3z's third round grime verse which completely won over the crowd.",
      "Smil3z's surgical setups in the second round."
    ],
    "postBattleContext": "Smil3z was chosen by the host Big Marv as the winner to advance to the Croydon Box Park tournament.",
    "winner": "smil3z"
  }
};

// Update battles array
const updatedBattles = battles.map(battle => {
  if (!battle.customEp) return battle;
  const report = newReports[battle.customEp];
  if (report) {
    console.log(`Updating battle report for ${battle.customEp} (${battle.title})`);
    return {
      ...battle,
      ...report
    };
  }
  return battle;
});

// Construct TypeScript file output
const fileContent = `import type { Battle } from "./battleTypes";

export const lastUpdated = "June 2026";

export const hasBattleArchiveData = (battle: Battle): boolean =>
  Boolean(battle.clashSummary?.trim());

export const pengameBattles: Battle[] = ${JSON.stringify(updatedBattles, null, 2)};

export const getBattlePageStem = (battle: Pick<Battle, "slug">): string =>
  battle.slug
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const getBattleLegacyPageStem = (battle: Pick<Battle, "slug">): string =>
  battle.slug
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/-vs-/g, "vs")
    .replace(/vs-/g, "vs");

export const getBattlePageSlug = (battle: Pick<Battle, "slug">): string =>
  \`\${getBattlePageStem(battle)}.html\`;

export const getBattleHref = (battle: Pick<Battle, "slug">): string =>
  \`/battle/\${getBattlePageSlug(battle)}\`;

export const getBattleRouteHref = (battle: Pick<Battle, "slug">): string =>
  \`/battle/\${getBattlePageStem(battle)}\`;

export const findBattleByRouteSlug = (routeSlug: string): Battle | undefined => {
  const cleanSlug = decodeURIComponent(routeSlug).replace(/\\/+$/g, "");
  const cleanStem = cleanSlug.replace(/\\.html$/i, "");
  const legacyStem = cleanStem.replace(/\\.html$/i, "");

  return pengameBattles.find(
    (battle) =>
      battle.slug === cleanSlug ||
      battle.slug === cleanStem ||
      getBattlePageSlug(battle) === cleanSlug ||
      getBattlePageStem(battle) === cleanStem ||
      getBattleLegacyPageStem(battle) === legacyStem,
  );
};
`;

// Write pengameBattles.ts
fs.writeFileSync(battlesFilePath, fileContent, "utf-8");
console.log("Successfully updated src/data/pengameBattles.ts");

// Archive transcript files
const files = fs.readdirSync(transcribeDir);
files.forEach(file => {
  const filePath = path.join(transcribeDir, file);
  if (fs.statSync(filePath).isFile()) {
    // Only archive if it's one of the files we just processed
    const matchesEp = file.match(/^(4x16|4x17|4x18|4x19|4x20|4x21|4x22)\b/i);
    if (matchesEp) {
      const destPath = path.join(archivedDir, file);
      fs.renameSync(filePath, destPath);
      console.log(`Archived transcript file: ${file} -> transcribe/archived/${file}`);
    }
  }
});
