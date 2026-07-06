export interface Battle {
  id: string;
  slug: string;
  mc1: string;
  mc2: string;
  title: string;
  date?: string;
  videoUrl?: string;
  views?: string;
  winner?: string;
  isUnreleased?: boolean;
  isPlaceholder?: boolean;
  isMainEvent?: boolean;
  isWanted?: boolean;
  episode?: string;
  summary?: string;
  ticketUrl?: string;
  props?: { name: string, user: string, icon: string }[];
}

export interface NotableBar {
  quote: string;
  explanation: string;
}

export const battles: Battle[] = [
  {
    "id": "1",
    "slug": "deeno-vs-tapped24",
    "mc1": "deeno",
    "mc2": "tapped24",
    "title": "Deeno vs Tapped24",
    "date": "25 Dec 2025",
    "videoUrl": "https://www.youtube-nocookie.com/embed/09ZD_UjdoVw",
    "views": "52.4K",
    "winner": "deeno",
    "isMainEvent": true,
    "props": [
      { name: "Screenshots of text messages", user: "Deeno", icon: "📱" },
      { name: "Document from Police", user: "Deeno", icon: "📄" }
    ]
  },
  {
    "id": "2",
    "slug": "pr1nc3-vs-roman",
    "mc1": "pr1nc3",
    "mc2": "roman",
    "title": "PR1NC3 vs Roman",
    "date": "1 Jan 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/QByqdZAF3L0",
    "views": "23.5K",
    "winner": "roman"
  },
  {
    "id": "3",
    "slug": "ldn-mikez-vs-deluxx",
    "mc1": "ldn-mikez",
    "mc2": "deluxx",
    "title": "LDN Mikez vs Deluxx",
    "date": "8 Jan 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/RhC2D3ftzZo",
    "views": "15.9K",
    "winner": "ldn-mikez"
  },
  {
    "id": "4",
    "slug": "ldn-mikez-vs-2mwad",
    "mc1": "ldn-mikez",
    "mc2": "2mwad",
    "title": "LDN Mikez vs 2MWAD",
    "date": "15 Jan 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/NEiGspeXLYM",
    "views": "23.4K",
    "winner": "ldn-mikez"
  },
  {
    "id": "5",
    "slug": "cj-zino-vs-proty",
    "mc1": "cj-zino",
    "mc2": "proty",
    "title": "CJ Zino vs Proty",
    "date": "15 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/T0zo6YgfxB4",
    "views": "10.6K",
    "winner": "proty",
    "episode": "1x5"
  },
  {
    "id": "6",
    "slug": "renzo-vs-proty",
    "mc1": "renzo",
    "mc2": "proty",
    "title": "Renzo vs Proty",
    "date": "19 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/bZRy8jgPvwk",
    "views": "10.0K",
    "winner": "renzo",
    "episode": "1x6"
  },
  {
    "id": "7",
    "slug": "deluxx-vs-btizz",
    "mc1": "deluxx",
    "mc2": "btizz",
    "title": "Deluxx vs Btizz",
    "date": "25 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Asvv9rzqXDI",
    "views": "5.6K",
    "winner": "btizz",
    "episode": "1x7"
  },
  {
    "id": "8",
    "slug": "2mwad-vs-ryno",
    "mc1": "2mwad",
    "mc2": "ryno",
    "title": "2MWAD vs Ryno",
    "date": "19 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/HfO3UR_Zeyk",
    "views": "24.9K",
    "winner": "2mwad",
    "episode": "1x8",
    "props": [
      { name: "NFA Document from Police", user: "Ryno", icon: "📄" }
    ]
  },
  {
    "id": "9",
    "slug": "tapped24-vs-roman",
    "mc1": "tapped24",
    "mc2": "roman",
    "title": "Tapped24 vs Roman",
    "date": "4 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/OGagI2K6StY",
    "views": "16.2K",
    "winner": "roman",
    "episode": "1x9",
    "props": [
      { name: "Screenshots of text messages", user: "Roman", icon: "📱" },
      { name: "Screenshots of text messages", user: "Tapped24", icon: "📱" }
    ]
  },
  {
    "id": "10",
    "slug": "tapped24-vs-ajna",
    "mc1": "tapped24",
    "mc2": "ajna",
    "title": "Tapped24 vs AJNA",
    "date": "19 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/oUDDrQtoTHM",
    "views": "13.0K",
    "winner": "ajna",
    "props": [
      { "name": "Pack of baby wipes", "user": "Tapped24", "icon": "🧼" }
    ]
  },
  {
    "id": "11",
    "slug": "ryno-vs-tymeless",
    "mc1": "ryno",
    "mc2": "tymeless",
    "title": "Ryno vs Tymeless",
    "date": "26 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Omge-TNTrhQ",
    "views": "13.8K",
    "winner": "tymeless",
    "props": [
      { "name": "Alleged photo of Ryno kissing a man", "user": "Tymeless", "icon": "📸" },
      { "name": "A bag of ashes", "user": "Tymeless", "icon": "⚱️" },
      { "name": "A pair of socks", "user": "Tymeless", "icon": "🧦" },
      { "name": "A toothbrush", "user": "Tymeless", "icon": "🪥" },
      { "name": "Chicken & Mushroom Pot Noodle", "user": "Tymeless", "icon": "🍜" },
      { "name": "A bar of soap", "user": "Tymeless", "icon": "🧼" },
      { "name": "A roll of packing tape", "user": "Tymeless", "icon": "🩹" },
      { "name": "Keys to a property", "user": "Ryno", "icon": "🔑" }
    ]
  },
  {
    "id": "12",
    "slug": "pr1nc3-vs-nattyebk",
    "mc1": "pr1nc3",
    "mc2": "nattyebk",
    "title": "PR1NC3 vs NattyEBK",
    "date": "2 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Rs3kTPbnUm4",
    "views": "8.8K",
    "winner": "nattyebk",
    "episode": "1x12",
    "props": [
      { "name": "Listerine", "user": "PR1NC3", "icon": "💧" },
      { "name": "Luxury Brand Bar of Soap", "user": "PR1NC3", "icon": "🧼" },
      { "name": "Salt", "user": "PR1NC3", "icon": "🧂" }
    ]
  },
  {
    "id": "13",
    "slug": "btizz-vs-cj-zino",
    "mc1": "btizz",
    "mc2": "cj-zino",
    "title": "Btizz vs CJ Zino",
    "date": "9 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/-bKXRy3RxoY",
    "views": "6.2K",
    "winner": "cj-zino",
    "isPlaceholder": false,
    "episode": "1x13"
  },
  {
    "id": "14",
    "slug": "deeno-vs-grams",
    "mc1": "deeno",
    "mc2": "grams",
    "title": "Deeno vs Grams",
    "date": "26 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/OuVeBAU1OQQ",
    "views": "20.4K",
    "winner": "deeno",
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x14"
  },
  {
    "id": "15",
    "slug": "tapped24-vs-grams",
    "mc1": "tapped24",
    "mc2": "grams",
    "title": "Tapped24 vs Grams",
    "date": "26 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/9gkXN1ZJeP8",
    "views": "12.1K",
    "winner": "tapped24",
    "isUnreleased": false,
    "isPlaceholder": false,
    "isMainEvent": true,
    "episode": "1x15",
    "props": [
      { "name": "Screenshot of photo Grams liked on Instagram", "user": "Tapped24", "icon": "📸" },
      { "name": "Badees pink panties", "user": "Badee Harz", "icon": "👙" }
    ]
  },
  {
    "id": "16",
    "slug": "btizz-vs-1flaymr",
    "mc1": "btizz",
    "mc2": "1flaymr",
    "title": "Btizz vs 1Flaymr",
    "date": "26 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/2lFLlylG5NQ",
    "views": "7.5K",
    "winner": "btizz",
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x16"
  },
  {
    "id": "18",
    "slug": "ryno-vs-roman",
    "mc1": "ryno",
    "mc2": "roman",
    "title": "Ryno vs Roman",
    "date": "26 Apr 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/eNusiS3fDhw",
    "views": "10.9K",
    "winner": "roman",
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x18"
  },
  {
    "id": "17",
    "slug": "deeno-vs-badee-harz",
    "mc1": "deeno",
    "mc2": "badee-harz",
    "title": "Badee Harz vs Deeno",
    "date": "23 May 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/yCkMZvg-cUg",
    "views": "26.5K",
    "winner": "deeno",
    "props": [
      { "name": "A bag with 0.1 gram of crack", "user": "Deeno", "icon": "💎" },
      { "name": "A bag of ashes", "user": "Badee Harz", "icon": "⚱️" }
    ],
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x17"
  },
  {
    "id": "21",
    "slug": "deeno-vs-tymeless",
    "mc1": "deeno",
    "mc2": "tymeless",
    "title": "Deeno vs Tymeless",
    "date": "31 May 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/JoW3ZGND5YM",
    "views": "3.9K",
    "winner": "tymeless",
    "props": [
      { "name": "Toilet plunger", "user": "Tymeless", "icon": "🪠" },
      { "name": "Childhood photo of Deeno", "user": "Tymeless", "icon": "📷" },
      { "name": "Lemon 1", "user": "Tymeless", "icon": "🍋" },
      { "name": "Lemon 2", "user": "Tymeless", "icon": "🍋" },
      { "name": "Lemon 3", "user": "Tymeless", "icon": "🍋" }
    ],
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x21"
  },
  {
    "id": "19",
    "slug": "cj-zino-vs-1flaymr",
    "mc1": "1flaymr",
    "mc2": "cj-zino",
    "title": "1Flaymr vs CJ Zino",
    "date": "31 May 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/BKAVkMglg3Q",
    "views": "4.5K",
    "winner": "1flaymr",
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x19"
  },
  {
    "id": "20",
    "slug": "nattyebk-vs-zk",
    "mc1": "nattyebk",
    "mc2": "zk",
    "title": "NattyEBK vs Z.K",
    "date": "31 May 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/ayTTSuKB168",
    "views": "3.2K",
    "winner": "nattyebk",
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x20",
    "props": [
      { name: "Screenshot presented during the clash", user: "NattyEBK", icon: "\u{1F4F1}" },
      { name: "Photograph of nude male", user: "NattyEBK", icon: "\u{1F5BC}\u{FE0F}" }
    ]
  },
  {
    "id": "22",
    "slug": "badee-harz-vs-1flaymr",
    "mc1": "badee-harz",
    "mc2": "1flaymr",
    "title": "Badee Harz vs 1Flaymr",
    "date": "June 2026",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x22",
    "ticketUrl": "/events"
  },
  {
    "id": "23",
    "slug": "grams-vs-btizz",
    "mc1": "grams",
    "mc2": "btizz",
    "title": "Grams vs Btizz",
    "date": "June 2026",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x23",
    "ticketUrl": "/events"
  },
  {
    "id": "24",
    "slug": "cj-zino-vs-zk",
    "mc1": "cj-zino",
    "mc2": "zk",
    "title": "CJ Zino vs Z.K",
    "date": "June 2026",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x24",
    "ticketUrl": "/events"
  },
  {
    "id": "25",
    "slug": "roman-vs-tricky",
    "mc1": "roman",
    "mc2": "tricky",
    "title": "Roman vs Trickyy",
    "date": "June 2026",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x25",
    "ticketUrl": "/events"
  },
];

export const lastUpdated = "20 Jun 2026";

export const tapped24NotableBars: NotableBar[] = [
  {
    quote: "Welcome to the main event... I've got a violent pen. / In fact, fuck Deeno.",
    explanation: "Tapped immediately establishes the headline setting and removes any suggestion that the battle is friendly. The writing-as-a-weapon metaphor is simple, but the blunt follow-up sets the grudge-match tone."
  },
  {
    quote: "Is it alopecia or did you have chemo? / You've got Crohn's disease.",
    explanation: "These lines represent Tapped's medical and appearance angle. He uses visible traits and private health issues for shock and embarrassment rather than intricate wordplay."
  },
  {
    quote: "Who ate all the pies? / He's got the Mackies. / Burgers, chicken, fries, doughnuts...",
    explanation: "Tapped groups familiar football-terrace humour and fast-food imagery into a repeated body angle. The references are immediately understandable, helping the material land live."
  },
  {
    quote: "Smoke Deeno like I smoke California. / Get reloads and I break down all year.",
    explanation: "This is Tapped's strongest connected wordplay. Smoking Deeno means defeating him, while California and breaking down refer to cannabis. Reloads also links the scheme to crowd reaction."
  },
  {
    quote: "No D, no D, no, I'm your dad.",
    explanation: "Tapped breaks Deeno's name into \"D-no\" or \"no D,\" then turns the sound into a status and fatherhood insult that places him above his opponent."
  },
  {
    quote: "When I see Skamz, you let that slide. / Scams had you in a violent stitch.",
    explanation: "The Skamz references form a wider scene-history angle. Tapped argues that Deeno acts aggressively now but failed to respond when previously pressured."
  },
  {
    quote: "You let me stay in your yard. / Deeno's friend is dead.",
    explanation: "Tapped uses their personal history to make the clash more damaging, then declares that the former friendship is permanently finished."
  },
  {
    quote: "Pay for your Ubers, Pen Game didn't. / We don't take man serious.",
    explanation: "This combines status and credibility attacks. Tapped suggests Deeno was not valued by another platform and uses that claim to support his central argument that Deeno is not respected."
  },
  {
    quote: "I was gonna leak your postcode. / Chat shit, get banged.",
    explanation: "These lines move from performance into real-world menace. The simple UK phrasing makes the threat highly readable to the crowd."
  },
  {
    quote: "You went purple like Barney. / MJ treatment. / From Bruce to Willis.",
    explanation: "Tapped closes several appearance ideas through recognisable pop-culture images, using Barney, Michael Jackson, and Bruce Willis as quick visual shorthand."
  }
];

export const deenoNotableBars: NotableBar[] = [
  {
    quote: "Me and Tapp were the best of friends. / Then you spoke on my kids.",
    explanation: "Deeno opens with narrative rather than a random insult. The former friendship and crossed boundary frame everything that follows as retaliation and betrayal."
  },
  {
    quote: "Two of the three kids that are even yours... / You're a shit dad. / Go home and provide for your kids.",
    explanation: "These lines establish Deeno's central fatherhood angle by questioning paternity, responsibility, and Tapped's role as a parent. The cleaner final instruction reduces the whole argument to providing for his children."
  },
  {
    quote: "Your son told me I'm his favourite. / He said this in front of his dad.",
    explanation: "One of Deeno's strongest personal sequences. He claims Tapped's own child prefers him and heightens the humiliation by saying it happened directly in front of Tapped."
  },
  {
    quote: "Check the screenshots. / This is real messages.",
    explanation: "The key prop moment moves the angle from accusation to alleged visual evidence. It creates a major room reaction because the audience is given something tangible to inspect."
  },
  {
    quote: "After this we can never be friends. / You slept on my sofa.",
    explanation: "Deeno closes the friendship narrative with shared personal history. Tapped once relied on his hospitality, but the relationship is now presented as permanently finished."
  },
  {
    quote: "Cap 24. / Shit dad 24. / Act 24. / Bad 24.",
    explanation: "This repeated name-flip scheme turns Tapped24 into a reusable structure for accusations of lying, poor parenting, acting, and false toughness."
  },
  {
    quote: "Never really been tapped in your life. / More time with other people's kids than your own.",
    explanation: "Deeno dismantles the stage name and connects it to his fatherhood argument, claiming Tapped's public image does not match his real responsibilities."
  },
  {
    quote: "Smoking weed with your kids in the flats. / Robbed... with his kid in his hand. / Pressured by JC... Ambu... Drizz...",
    explanation: "Deeno stacks parenting allegations and a pressure list into a claimed pattern, challenging Tapped's responsibility and the tough image presented in his writing."
  },
  {
    quote: "Child support and council tax.",
    explanation: "One of Deeno's best real-world punches. It swaps street pressure for the unavoidable pressures of parenting costs, bills, and local authority debt."
  },
  {
    quote: "Watch man before you finish your sentence. / I'm a GOAT compared to the sheep.",
    explanation: "\"Sentence\" works as both a spoken line and a punishment, while GOAT versus sheep presents Deeno as exceptional and Tapped as an ordinary follower."
  }
];

