export interface Host {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fields: string[];
  leagueRoleDescription?: string;
  nickname?: string;
  height?: string;
  location?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  quote?: string;
}

export const hosts: Host[] = [
  {
    id: "ginga-jay",
    name: "Ginga Jay",
    role: "Main Host",
    image: "/gingajay.png",
    bio: "The main voice of Ginga Entertainment and the G Zone. Ginga Jay brings unmatched energy and charisma to the stage, keeping the crowd engaged and the battles flowing. As an entertainer first and foremost, he knows exactly how to set the mood for a high-stakes clash.",
    fields: ["Entertainer"]
  },
  {
    id: "darren-stewart",
    name: "Darren Stewart",
    role: "Co-Host",
    image: "/darrenstewart.png",
    nickname: "The Dentist",
    height: "6 ft",
    location: "East London",
    bio: "A veteran of the UFC and one of the UK’s most respected MMA competitors, Darren “The Dentist” Stewart brings elite combat sports experience to the G Zone. Known for his knockout power and relentless fighting style inside the Octagon, Stewart built his reputation competing against some of the toughest fighters in the world.",
    fields: [
      "UFC VETERAN",
      "Striker / Taekwondo Black Belt"
    ],
    leagueRoleDescription: "Now stepping into the battle rap arena, Darren delivers the same intensity and competitive insight that defined his fighting career. His background at the highest level of combat sports gives him a unique perspective on the psychology of head-to-head competition—making him a natural presence on the G Zone stage."
  }
];
