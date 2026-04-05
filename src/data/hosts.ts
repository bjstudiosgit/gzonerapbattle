export interface Host {
  id: string;
  name: string;
  role: string;
  image: string;
  listImage?: string;
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
  displayTag?: string;
}

export const hosts: Host[] = [
  {
    id: "ginga-jay",
    name: "Ginga Jay",
    role: "Main Host / Co Owner",
    image: "/gingajay.png",
    bio: "The main voice of Ginga Entertainment and the Gzone. Ginga Jay brings unmatched energy and charisma to the stage, keeping the crowd engaged and the battles flowing. As an entertainer first and foremost, he knows exactly how to set the mood for a high-stakes clash.",
    fields: ["Entertainer"],
    instagram: "https://instagram.com/gingajay",
    tiktok: "https://www.tiktok.com/@the.gzone.rbl"
  },
  {
    id: "darren-stewart",
    name: "Darren Stewart",
    role: "Co-Host",
    image: "/darrenstewart.png",
    nickname: "The Dentist",
    height: "6 ft",
    location: "East London",
    bio: "A veteran of the UFC and one of the UK’s most respected MMA competitors, Darren “The Dentist” Stewart brings elite combat sports experience to the Gzone. Known for his knockout power and relentless fighting style inside the Octagon, Stewart built his reputation competing against some of the toughest fighters in the world.",
    fields: ["UFC VETERAN"],
    leagueRoleDescription: "Now stepping into the battle rap arena, Darren delivers the same intensity and competitive insight that defined his fighting career. His background at the highest level of combat sports gives him a unique perspective on the psychology of head-to-head competition—making him a natural presence on the Gzone stage.",
    instagram: "https://instagram.com/darrenstewartmma",
    tiktok: "https://www.tiktok.com/@darren_mma"
  },
  {
    id: "louis-bowers",
    name: "Louis Bowers",
    role: "Production / Co Owner",
    displayTag: "Production",
    image: "/louisbowers.png",
    listImage: "/louisbowerslist.png",
    bio: "Louis “Reason” is the founder of Muscle Memory Musik and Ladder Records, a London-based space that brings together a recording studio, label, and artist collective.\n\nHe’s spent years working across artist development, production, and live performance, helping emerging artists find their footing and develop their sound in a practical, supportive environment.\n\nAlongside this, Louis is a working artist himself—writing, producing and performing across multiple styles as a singer, rapper, and multi-instrumentalist.\n\nHe is the frontman of Dishy Tangent, with collaborations including UB40, Big Narstie and Cockney Rejects. His work has taken him from local stages to international tours, TV appearances, and major venues such as the O2 Arena and Rebellion Festival.\n\nLouis has also been closely involved with Ginga Jay over the years, helping run events like The Sesh, which gives a platform to a wide range of artists. More recently, he’s contributed to the sound and production behind Gzone battles and content, working alongside his team to support events and recordings.\n\nBefore all of this, he came up through grime and battle rap, regularly clashing in school and college. With family ties to Peacock Gymnasium, stepping into a battle environment has always felt natural.\n\nWhether it’s creating music, supporting artists, or helping run events, Louis focuses on building a space where people can develop, collaborate, and put their work out properly.",
    fields: ["Production"],
    instagram: "https://instagram.com/louisbowers",
    tiktok: "https://www.tiktok.com/@the.gzone.rbl"
  },
  {
    id: "passive",
    name: "Passive",
    role: "Co-Host",
    image: "/passive.png",
    listImage: "/passivelist.png",
    bio: "Passive is a UK battle rapper known for his sharp delivery, dry humour, and calculated approach in the ring.\n\nComing up through the battle scene, he’s built a reputation for staying composed under pressure—letting his writing and timing do the damage rather than relying on noise. His clashes across platforms like PenGame have shown a consistent ability to break opponents down with clean structure and subtle punches rather than over-the-top theatrics.\n\nAway from the stage, Passive’s style leans into replay value—bars that land on first listen but hit harder the second time round. Whether it’s controlled aggression or laid-back confidence, his approach reflects a battler who understands pacing just as much as penmanship.\n\nNow stepping into the Gzone, Passive brings that same energy into a rawer setting—where precision matters, and every line has to count.",
    fields: ["Lyricist"],
    leagueRoleDescription: "As a co-host in the Gzone, Passive brings his sharp delivery and calculated approach to the stage, providing insightful commentary and keeping the energy high.",
    nickname: "The Specialist",
    instagram: "https://instagram.com/passivemc",
    tiktok: "https://www.tiktok.com/@the.gzone.rbl"
  }
];
