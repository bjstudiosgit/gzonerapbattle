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
    id: "judge-2",
    name: "Celebrity to be revealed",
    role: "Lyricist",
    image: "/awaiting-photo.png",
    bio: "A high-profile guest judge to be revealed soon. Stay tuned for the official announcement.",
    fields: ["Lyricist"],
    isMystery: true
  },
  {
    id: "judge-3",
    name: "Celebrity to be revealed",
    role: "Battle Expert",
    image: "/awaiting-photo.png",
    bio: "A high-profile guest judge to be revealed soon. Stay tuned for the official announcement.",
    fields: ["Battle Expert"],
    isMystery: true
  },
  {
    id: "mystery-judge",
    name: "Celebrity to be revealed",
    role: "Celebrity Guest",
    image: "/awaiting-photo.png",
    bio: "A high-profile celebrity guest judge to be revealed soon. Stay tuned for the official announcement.",
    fields: ["Special Guest"],
    isMystery: true
  }
];
