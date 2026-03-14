export interface Battle {
  id: string;
  mc1: string;
  mc2: string;
  title: string;
  date?: string;
  videoUrl?: string;
  views?: string;
}

export const battles: Battle[] = [
  { 
    id: "1", 
    mc1: "deeno",  
    mc2: "tapped24", 
    title: "Deeno vs Tapped24",
    date: "25 Dec 2025",
    videoUrl: "https://www.youtube.com/embed/09ZD_UjdoVw",
    views: "46.3K"
  },
  { 
    id: "2", 
    mc1: "pr1nc3", 
    mc2: "roman", 
    title: "PR1NC3 vs Roman",
    date: "1 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/QByqdZAF3L0",
    views: "27.1K"
  },
  { 
    id: "3", 
    mc1: "ldn-mikez", 
    mc2: "deluxx", 
    title: "LDN Mikez vs Deluxx",
    date: "8 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/RhC2D3ftzZo",
    views: "14.4K"
  },
  { 
    id: "4", 
    mc1: "ldn-mikez", 
    mc2: "2mwad", 
    title: "LDN Mikez vs 2MWAD",
    date: "15 Jan 2026",
    videoUrl: "https://www.youtube.com/embed/bZRy8jgPvwk",
    views: "21.6K"
  },
  { 
    id: "5", 
    mc1: "cj-zino", 
    mc2: "proty", 
    title: "CJ Zino vs Proty",
    date: "15 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/T0zo6YgfxB4",
    views: "8.7K"
  },
  { 
    id: "6", 
    mc1: "2mwad", 
    mc2: "ryno", 
    title: "2MWAD vs Ryno",
    date: "19 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/HfO3UR_Zeyk",
    views: "18.4K"
  },
  { 
    id: "7", 
    mc1: "deluxx", 
    mc2: "btizz", 
    title: "Deluxx vs Btizz",
    date: "25 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/Asvv9rzqXDI",
    views: "4,569"
  },
  { 
    id: "8", 
    mc1: "ryno", 
    mc2: "2mwad", 
    title: "Ryno vs 2MWAD", 
    date: "19 Feb 2026",
    videoUrl: "https://www.youtube.com/embed/HfO3UR_Zeyk", 
    views: "18.4K" 
  },
  { 
    id: "9", 
    mc1: "tapped24", 
    mc2: "roman", 
    title: "Tapped24 vs Roman", 
    date: "4 Mar 2026", 
    videoUrl: "https://www.youtube.com/embed/OGagI2K6StY", 
    views: "9,962" 
  }
];
