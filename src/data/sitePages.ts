export const siteOrigin = "https://www.gzonerapbattle.co.uk";
export const defaultSocialImage = `${siteOrigin}/gzone-social.jpg`;
export const defaultDescription = "Watch the rawest UK battle rap league. Gzone Rap Battles features uncensored MC clashes, freestyle battles and underground rap events from Peacocks Gym.";

export type SitePage = { path: string; title: string; description: string; image?: string; canonical?: string; noindex?: boolean };

export const staticPages: SitePage[] = [
  { path: "/", title: "Gzone Rap Battle League, Where we don't play!", description: defaultDescription },
  { path: "/battles", title: "Battles | Gzone", description: "Watch Gzone rap battles, Royal Rumble episodes and freestyle clashes." },
  { path: "/outside", title: "Outside | GStreet Freestyles & Cyphers | Gzone", description: "Watch GStreet Freestyles and Gzone Cyphers." },
  { path: "/league", title: "League | Gzone", description: "Follow the Gzone Rap Battle League." },
  { path: "/events", title: "Events | Gzone", description: "See upcoming Gzone battle events and tickets." },
  { path: "/whoswho", title: "Who's Who | Gzone", description: "Meet the battle rappers, artists and Gzone team." },
  { path: "/photos", title: "Photos | Gzone", description: "Explore photos from Gzone rap battle events." },
  { path: "/map", title: "MC Map | Gzone", description: "Discover Gzone MCs on the map." },
  { path: "/flyers", title: "Flyers | Gzone Rap Battle League", description: "Browse and download official Gzone Rap Battle event flyers and clash posters." },
  { path: "/merch", title: "Merch | Gzone", description: "Explore Gzone Rap Battle League merchandise." },
  { path: "/apply", title: "Apply | Gzone", description: "Apply to battle at Gzone." },
  { path: "/backstage", title: "Backstage | The Gzone", description: "The Gzone members’ area. Sign in for exclusive videos, behind-the-scenes footage and updates from the crew." },
  { path: "/gingabay", title: "gingaBay — Gzone Museum BETA | The Gzone", description: "The props. The punchlines. Bid on a piece of Gzone history from 99p. Sign in with your Gzone membership and track your bids in settings." },
  { path: "/privacy", title: "Privacy Policy | Gzone", description: "Read the Gzone privacy policy." },
  { path: "/success", title: "Application received | Gzone", description: "Your Gzone application was received.", noindex: true },
  { path: "/backstage/settings", title: "Backstage Settings | Gzone", description: "Manage your Gzone backstage account.", noindex: true },
  { path: "/backstage/gingerify", title: "Fifty Shades of Jay | Gzone Backstage", description: "Gzone backstage members' content.", noindex: true },
  { path: "/backstage/voting", title: "Voting | Gzone Backstage", description: "Gzone backstage voting.", noindex: true },
  { path: "/vote/live", title: "Live Vote | Gzone", description: "Gzone live voting display.", noindex: true },
];
