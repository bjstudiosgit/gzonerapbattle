export interface RingGirl {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fields: string[];
  nickname?: string;
  height?: string;
  location?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export const ringGirls: RingGirl[] = [
  {
    id: "jessica",
    name: "Jessica",
    role: "Ring Girl",
    image: "/jessica.png",
    bio: "Jessica is the first official ring girl of Ginga Entertainment. Bringing elegance and energy to the G Zone, she ensures every round starts with the right vibe. With a background in modeling and a passion for combat sports, Jessica is a key part of the live event experience.",
    fields: ["Model", "Brand Ambassador"],
    location: "London",
    instagram: "https://instagram.com"
  }
];
