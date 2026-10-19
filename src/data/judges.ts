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
  isCelebrity?: boolean;
}

export const judges: Judge[] = [
  {
    id: "denzel-bentley",
    name: "Denzel Bentley",
    role: "Celebrity Guest",
    image: "/portraits/denzel-bentley-head-cutout.png",
    bio: "Denzel Bentley is a British professional boxer competing at elite level in the middleweight division. Known for his explosive power, composure under pressure, and sharp ring IQ, he’s fought on major stages and held multiple titles, earning respect across the UK boxing scene and beyond.",
    fields: ["Special Guest"],
    isMystery: false,
    instagram: "https://www.instagram.com/2sharp_d/"
  },
  {
    id: "chris-preddie-obe",
    name: "Chris Preddie OBE",
    role: "Celebrity Guest",
    image: "/portraits/chris-preddie-obe-cutout.png",
    bio: "Chris Preddie OBE joins the Gzone as a celebrity guest.",
    fields: ["Special Guest"],
    instagram: "https://www.instagram.com/chrispreddie.obe/"
  },
  {
    id: "icy-jones",
    name: "Icy Jones",
    role: "Celebrity Guest",
    image: "/portraits/icy-jones-cutout.png",
    bio: "Stand-up comedian Icy Jones joins the Gzone as a celebrity guest.",
    fields: ["Special Guest"],
    instagram: "https://www.instagram.com/icykingjones/"
  },
  {
    id: "teeski",
    name: "Teeski",
    role: "Celebrity Guest",
    image: "/portraits/teeski-cutout.png",
    bio: "Teeski joins the Gzone as a celebrity guest.",
    fields: ["Special Guest"]
  },
  {
    id: "tr",
    name: "TR",
    role: "Celebrity Guest",
    image: "/portraits/tr-cutout.png",
    bio: "TR joins the Gzone as a celebrity guest.",
    fields: ["Special Guest"]
  }
];
