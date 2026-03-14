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
    id: "passive",
    name: "Passive",
    role: "Veteran MC",
    image: "https://picsum.photos/seed/judge1/400/400",
    bio: "A true veteran of the battle rap scene, Passive brings years of experience and a sharp ear for lyricism to the judging panel. Having competed at the highest levels, he knows exactly what it takes to win over a crowd and dismantle an opponent. His critiques are known for being direct, insightful, and uncompromising.",
    fields: ["Veteran MC", "Lyricist"],
    leagueRoleDescription: "As a judge in the G Zone, Passive is responsible for evaluating the bars, delivery, and stage presence of the competitors. He looks for authenticity and raw talent, ensuring that only the best MCs advance in the league.",
    nickname: "The Veteran"
  },
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
