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
  bonusPoints?: number;
  performancePoints?: Record<string, number>;
  props?: { name: string, user: string, icon: string }[];
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
    "views": "51.2K",
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
    "views": "23.3K",
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
    "views": "15.7K",
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
    "views": "23.2K",
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
    "views": "10.3K",
    "winner": "proty"
  },
  {
    "id": "6",
    "slug": "renzo-vs-proty",
    "mc1": "renzo",
    "mc2": "proty",
    "title": "Renzo vs Proty",
    "date": "19 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/bZRy8jgPvwk",
    "views": "9.8K",
    "winner": "renzo"
  },
  {
    "id": "7",
    "slug": "deluxx-vs-btizz",
    "mc1": "deluxx",
    "mc2": "btizz",
    "title": "Deluxx vs Btizz",
    "date": "25 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Asvv9rzqXDI",
    "views": "5.5K",
    "winner": "btizz"
  },
  {
    "id": "8",
    "slug": "2mwad-vs-ryno",
    "mc1": "2mwad",
    "mc2": "ryno",
    "title": "2MWAD vs Ryno",
    "date": "19 Feb 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/HfO3UR_Zeyk",
    "views": "24.4K",
    "winner": "ryno",
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
    "views": "15.9K",
    "winner": "roman",
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
    "views": "12.3K",
    "winner": "ajna",
    "bonusPoints": 1,
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
    "views": "13.0K",
    "winner": "tymeless",
    "bonusPoints": 2,
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
    "views": "8.3K",
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
    "views": "6.1K",
    "winner": "cj-zino",
    "bonusPoints": 0,
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
    "views": "19.4K",
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
    "views": "11.2K",
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
    "views": "6.2K",
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
    "winner": "roman",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x18"
  },
  {
    "id": "17",
    "slug": "deeno-vs-badee-harz",
    "mc1": "deeno",
    "mc2": "badee-harz",
    "title": "Deeno vs Badee Harz",
    "date": "23 May 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/yCkMZvg-cUg",
    "views": "20.0K",
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
    "id": "19",
    "slug": "deeno-vs-tymeless",
    "mc1": "deeno",
    "mc2": "tymeless",
    "title": "Deeno vs Tymeless",
    "date": "31 May 2026",
    "winner": "tymeless",
    "bonusPoints": 2,
    "props": [
      { "name": "Toilet plunger", "user": "Tymeless", "icon": "🪠" },
      { "name": "Childhood photo of Deeno", "user": "Tymeless", "icon": "📷" },
      { "name": "3 Lemons", "user": "Tymeless", "icon": "🍋" }
    ],
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x19"
  },
  {
    "id": "20",
    "slug": "cj-zino-vs-1flaymr",
    "mc1": "cj-zino",
    "mc2": "1flaymr",
    "title": "CJ Zino vs 1Flaymr",
    "date": "31 May 2026",
    "winner": "1flaymr",
    "bonusPoints": 1,
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x20"
  },
  {
    "id": "21",
    "slug": "nattyebk-vs-zk",
    "mc1": "nattyebk",
    "mc2": "zk",
    "title": "NattyEBK vs Z.K",
    "date": "31 May 2026",
    "winner": "nattyebk",
    "bonusPoints": 0,
    "isUnreleased": false,
    "isPlaceholder": false,
    "episode": "1x21"
  },
];

export const lastUpdated = "31 May 2026";

