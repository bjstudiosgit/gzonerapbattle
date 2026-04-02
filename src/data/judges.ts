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
  isMystery?: boolean;
}

export const judges: Judge[] = [
  {
    id: "denzel-bentley",
    name: "Denzel Bentley",
    role: "Celebrity Guest",
    image: "/denzelbentley.png",
    bio: "Denzel Bentley is a British professional boxer competing at elite level in the middleweight division. Known for his explosive power, composure under pressure, and sharp ring IQ, he’s fought on major stages and held multiple titles—earning respect across the UK boxing scene and beyond.",
    fields: ["Special Guest"],
    isMystery: false,
    tiktok: "https://www.tiktok.com/@the.gzone.rbl"
  }
];
