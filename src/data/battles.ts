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
  episode?: string;
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
    "views": "48.4K",
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
    "views": "22.3K",
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
    "views": "15.0K",
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
    "views": "22.5K",
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
    "views": "9.6K",
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
    "views": "9.3K",
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
    "views": "5.2K",
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
    "views": "21.7K",
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
    "views": "13.7K",
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
    "views": "10.0K",
    "winner": "ajna"
  },
  {
    "id": "13",
    "slug": "ryno-vs-tymeless",
    "mc1": "ryno",
    "mc2": "tymeless",
    "title": "Ryno vs Tymeless",
    "date": "14 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Omge-TNTrhQ",
    "views": "10.1K",
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
    "date": "14 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Rs3kTPbnUm4",
    "views": "6.7K",
    "winner": "nattyebk",
    "episode": "1x12",
    "props": [
      { "name": "Listerine", "user": "PR1NC3", "icon": "💧" },
      { "name": "Luxury Brand Bar of Soap", "user": "PR1NC3", "icon": "🧼" },
      { "name": "Salt", "user": "PR1NC3", "icon": "🧂" }
    ]
  },
  {
    "id": "11",
    "slug": "btizz-vs-cj-zino",
    "mc1": "btizz",
    "mc2": "cj-zino",
    "title": "Btizz vs CJ Zino",
    "date": "14 Mar 2026",
    "videoUrl": "https://www.youtube-nocookie.com/embed/-bKXRy3RxoY",
    "views": "3.4K",
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
    "date": "14 Mar 2026",
    "views": "0",
    "winner": "deeno",
    "isUnreleased": true,
    "isPlaceholder": false,
    "episode": "1x14"
  },
  {
    "id": "15",
    "slug": "tapped24-vs-grams",
    "mc1": "tapped24",
    "mc2": "grams",
    "title": "Tapped 24 vs Grams",
    "date": "26 Apr 2026",
    "isUnreleased": true,
    "isPlaceholder": true,
    "isMainEvent": true,
    "episode": "1x15"
  },
  {
    "id": "16",
    "slug": "ricko-vs-deeno",
    "mc1": "ricko",
    "mc2": "deeno",
    "title": "Ricko vs Deeno",
    "date": "26 Apr 2026",
    "isUnreleased": true,
    "isPlaceholder": true,
    "episode": "1x16"
  },
  {
    "id": "17",
    "slug": "ryno-vs-roman",
    "mc1": "ryno",
    "mc2": "roman",
    "title": "Ryno vs Roman",
    "date": "26 Apr 2026",
    "isUnreleased": true,
    "isPlaceholder": true,
    "episode": "1x17"
  },
  {
    "id": "18",
    "slug": "deeno-vs-badee-harz",
    "mc1": "deeno",
    "mc2": "badee-harz",
    "title": "Deeno vs Badee Harz",
    "date": "26 Apr 2026",
    "isUnreleased": true,
    "isPlaceholder": true,
    "episode": "1x18"
  },
  {
    "id": "19",
    "slug": "btizz-vs-1flaymr",
    "mc1": "btizz",
    "mc2": "1flaymr",
    "title": "Btizz vs 1Flaymr",
    "date": "26 Apr 2026",
    "isUnreleased": true,
    "isPlaceholder": true,
    "episode": "1x19"
  }
];

export const lastUpdated = "Apr 11, 2026";
