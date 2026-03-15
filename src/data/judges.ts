export interface Judge {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fields: string[];
  leagueRoleDescription?: string;
  nickname?: string;
  location?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  quote?: string;
}

export const judges: Judge[] = [
  {
    id: "judge-2",
    name: "Judge Name",
    role: "Lyricist",
    image: "https://picsum.photos/seed/judge2/400/400",
    bio: "An expert in wordplay and complex rhyme schemes.",
    fields: ["Lyricist"]
  },
  {
    id: "judge-3",
    name: "Judge Name",
    role: "Battle Expert",
    image: "https://picsum.photos/seed/judge3/400/400",
    bio: "A battle rap historian and expert analyst.",
    fields: ["Battle Expert"]
  }
];
