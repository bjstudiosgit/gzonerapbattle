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
}

export const battles: Battle[] = [
  { 
    id: "1", 
    slug: "deeno-vs-tapped24",
    mc1: "deeno",  
    mc2: "tapped24", 
    title: "Deeno vs Tapped24",
    date: "25 Dec 2025",
    videoUrl: "https://www.youtube.com/embed/09ZD_UjdoVw",
    views: "46.3K",
    winner: "deeno"
  },
  { 
    id: "2", 
    slug: "pr1nc3-vs-roman",
    mc1: "pr1nc3", 
    mc2: "roman", 
    title: "PR1NC3 vs Roman",
    date: "1 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/QByqdZAF3L0",
    views: "21K",
    winner: "roman"
  },
  { 
    id: "3", 
    slug: "ldn-mikez-vs-deluxx",
    mc1: "ldn-mikez", 
    mc2: "deluxx", 
    title: "LDN Mikez vs Deluxx",
    date: "8 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/RhC2D3ftzZo",
    views: "14.4K",
    winner: "ldn-mikez"
  },
  { 
    id: "4", 
    slug: "ldn-mikez-vs-2mwad",
    mc1: "ldn-mikez", 
    mc2: "2mwad", 
    title: "LDN Mikez vs 2MWAD",
    date: "15 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/NEiGspeXLYM",
    views: "21.6K",
    winner: "ldn-mikez"
  },
  { 
    id: "5", 
    slug: "cj-zino-vs-proty",
    mc1: "cj-zino", 
    mc2: "proty", 
    title: "CJ Zino vs Proty",
    date: "15 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/T0zo6YgfxB4",
    views: "8.7K",
    winner: "proty"
  },
  { 
    id: "6", 
    slug: "renzo-vs-proty",
    mc1: "renzo", 
    mc2: "proty", 
    title: "Renzo vs Proty",
    date: "19 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/bZRy8jgPvwk",
    views: "8.9K",
    winner: "renzo"
  },
  { 
    id: "7", 
    slug: "deluxx-vs-btizz",
    mc1: "deluxx", 
    mc2: "btizz", 
    title: "Deluxx vs Btizz",
    date: "25 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/Asvv9rzqXDI",
    views: "4,569",
    winner: "btizz"
  },
  { 
    id: "8", 
    slug: "2mwad-vs-ryno",
    mc1: "2mwad", 
    mc2: "ryno", 
    title: "2MWAD vs Ryno", 
    date: "19 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/HfO3UR_Zeyk", 
    views: "19K",
    winner: "ryno"
  },
  { 
    id: "9", 
    slug: "tapped24-vs-roman",
    mc1: "tapped24", 
    mc2: "roman", 
    title: "Tapped24 vs Roman", 
    date: "4 Mar 2026", 
    videoUrl: "https://www.youtube.com/embed/OGagI2K6StY", 
    views: "11K",
    winner: "roman"
  },
  { 
    id: "10", 
    slug: "pr1nc3-vs-nattyebk",
    mc1: "pr1nc3", 
    mc2: "nattyebk", 
    title: "PR1NC3 vs NattyEBK", 
    date: "14 Mar 2026", 
    views: "0",
    winner: "nattyebk",
    isUnreleased: true
  },
  { 
    id: "11", 
    slug: "btizz-vs-cj-zino",
    mc1: "btizz", 
    mc2: "cj-zino", 
    title: "Btizz vs CJ Zino", 
    date: "14 Mar 2026", 
    views: "0",
    winner: "cj-zino",
    isUnreleased: true
  },
  { 
    id: "12", 
    slug: "tapped24-vs-aj",
    mc1: "tapped24", 
    mc2: "aj", 
    title: "Tapped24 vs AJ", 
    date: "14 Mar 2026", 
    views: "0",
    winner: "aj",
    isUnreleased: true
  },
  { 
    id: "13", 
    slug: "ryno-vs-tymeless",
    mc1: "ryno", 
    mc2: "tymeless", 
    title: "Ryno vs Tymeless", 
    date: "14 Mar 2026", 
    views: "0",
    winner: "tymeless",
    isUnreleased: true
  },
  { 
    id: "14", 
    slug: "deeno-vs-grams",
    mc1: "deeno", 
    mc2: "grams", 
    title: "Deeno vs Grams", 
    date: "14 Mar 2026", 
    views: "0",
    winner: "deeno",
    isUnreleased: true
  }
];
