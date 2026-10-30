import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { battles } from "../src/data/battles";
import { hosts } from "../src/data/hosts";
import { judges } from "../src/data/judges";
import { guestMcs, mcs } from "../src/data/mcs";
import { portraitImage } from "../src/lib/images";

const origin = "https://www.gzonerapbattle.co.uk";
const dist = resolve("dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const defaultImage = `${origin}/gzonebattlemay.png`;
const defaultDescription = "Watch the rawest UK battle rap league. Gzone Rap Battles features uncensored MC clashes, freestyle battles and underground rap events from Peacocks Gym.";

type Page = { path: string; title: string; description: string; image?: string; canonical?: string; noindex?: boolean };
const pages: Page[] = [
  { path: "/", title: "Gzone Rap Battle League, Where we don't play!", description: defaultDescription },
  { path: "/battles", title: "Battles | Gzone", description: "Watch Gzone rap battles, Royal Rumble episodes and freestyle clashes." },
  { path: "/outside", title: "Outside | Gzone", description: "Watch GStreet Freestyles and Gzone Cyphers." },
  { path: "/league", title: "League | Gzone", description: "Follow the Gzone Rap Battle League." },
  { path: "/events", title: "Events | Gzone", description: "See upcoming Gzone battle events and tickets." },
  { path: "/whoswho", title: "Who's Who | Gzone", description: "Meet the battle rappers, artists and Gzone team." },
  { path: "/photos", title: "Photos | Gzone", description: "Explore photos from Gzone rap battle events." },
  { path: "/map", title: "MC Map | Gzone", description: "Discover Gzone MCs on the map." },
  { path: "/flyers", title: "Flyers | Gzone", description: "Download Gzone event artwork and battle flyers." },
  { path: "/merch", title: "Merch | Gzone", description: "Explore Gzone Rap Battle League merchandise." },
  { path: "/apply", title: "Apply | Gzone", description: "Apply to battle at Gzone." },
  { path: "/backstage", title: "Backstage | Gzone", description: "The Gzone members' area." },
  { path: "/gingabay", title: "gingaBay — Gzone Museum BETA | The Gzone", description: "The props. The punchlines. Bid on a piece of Gzone history from 99p." },
  { path: "/privacy", title: "Privacy Policy | Gzone", description: "Read the Gzone privacy policy." },
  { path: "/success", title: "Application received | Gzone", description: "Your Gzone application was received.", noindex: true },
  { path: "/backstage/settings", title: "Backstage Settings | Gzone", description: "Manage your Gzone backstage account.", noindex: true },
  { path: "/backstage/gingerify", title: "Fifty Shades of Jay | Gzone Backstage", description: "Gzone backstage members' content.", noindex: true },
  { path: "/backstage/voting", title: "Voting | Gzone Backstage", description: "Gzone backstage voting.", noindex: true },
  { path: "/vote/live", title: "Live Vote | Gzone", description: "Gzone live voting display.", noindex: true },
];

for (const battle of battles) {
  const upcoming = battle.isUnreleased && !battle.videoUrl && !battle.winner && !battle.resultLabel;
  const league = battle.league === "royal-rumble" ? "Royal Rumble" : battle.league === "freestyle" ? "Freestyle League" : "Season 1";
  const mc1 = [...mcs, ...guestMcs].find((mc) => mc.id === battle.mc1);
  const mc2 = [...mcs, ...guestMcs].find((mc) => mc.id === battle.mc2);
  const description = upcoming
    ? battle.summary || `Upcoming battle: ${battle.title} from the Gzone ${league}.`
    : battle.league === "royal-rumble"
      ? `Watch ${battle.title} from the Gzone Rap Battle League.`
      : `Watch ${mc1?.name ?? battle.mc1} vs ${mc2?.name ?? battle.mc2} from the Gzone ${league}.`;
  const videoId = battle.videoUrl?.split("/").pop();
  pages.push({
    path: `/battle/${battle.slug}`,
    title: `${battle.title} | Gzone Rap Battle`,
    description,
    image: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : battle.flyer ? `${origin}${battle.flyer}` : undefined,
  });
}

for (const mc of [...mcs, ...guestMcs]) {
  const image = portraitImage(mc.image, "profile");
  pages.push({ path: `/${mc.slug}`, title: `${mc.name} | Gzone MC Profile`, description: `Check out ${mc.name}'s battle rap profile, stats, and history at Gzone Rap Battle League.`, image: image.startsWith("http") ? image : `${origin}${image}` });
}
for (const person of [...hosts, ...judges]) {
  pages.push({ path: `/${person.id}`, title: `${person.name} | Gzone`, description: person.bio || `Meet ${person.name} at Gzone.`, image: person.image.startsWith("http") ? person.image : `${origin}${person.image}` });
}

const aliases: Record<string, string> = {
  "/promo": "/flyers", "/staff": "/whoswho", "/battles/mc": "/whoswho", "/vote": "/backstage",
  "/gzone-street-freestyles": "/outside", "/GzoneStreetFreestyles": "/outside", "/gzonestreetfreestyles": "/outside", "/street": "/outside",
  "/cyphers": "/outside", "/gzone-cyphers": "/outside", "/gzonecyphers": "/outside", "/cypher": "/outside",
  "/royal-rumble": "/battles", "/royalrumble": "/battles", "/RoyalRumble": "/battles", "/freestyle": "/battles", "/1flaymr": "/1flaymah",
};
for (const person of [...mcs, ...guestMcs]) aliases[`/mc/${person.slug}`] = `/${person.slug}`;
for (const person of hosts) aliases[`/host/${person.id}`] = `/${person.id}`;
for (const person of judges) aliases[`/judge/${person.id}`] = `/${person.id}`;
for (const [path, target] of Object.entries(aliases)) {
  const page = pages.find((entry) => entry.path === target);
  if (page) pages.push({ ...page, path, canonical: target });
}

const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
const replaceTag = (html: string, tag: string, replacement: string) => {
  if (!html.includes(tag)) throw new Error(`Missing HTML tag: ${tag}`);
  return html.replace(tag, replacement);
};

function render(page: Page) {
  const url = `${origin}${page.canonical || page.path}`;
  const image = page.image || defaultImage;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  html = replaceTag(html, '<meta property="og:title" content="Gzone Rap Battle League" />', `<meta property="og:title" content="${escape(page.title)}" />`);
  html = replaceTag(html, '<meta property="og:description" content="The rawest UK battle rap league." />', `<meta property="og:description" content="${escape(page.description)}" />`);
  html = replaceTag(html, `<meta property="og:image" content="${defaultImage}" />`, `<meta property="og:image" content="${escape(image)}" />`);
  html = replaceTag(html, `<meta property="og:url" content="${origin}/" />`, `<meta property="og:url" content="${escape(url)}" />`);
  html = html.replace("</head>", `    <meta name="description" content="${escape(page.description)}" />\n    <link rel="canonical" href="${escape(url)}" />\n    ${page.noindex ? '<meta name="robots" content="noindex" />\n    ' : ""}</head>`);
  return html;
}

const writtenPaths = new Set<string>();
for (const page of pages) {
  if (!/^\/(?:[A-Za-z0-9-]+\/?)*$/.test(page.path)) throw new Error(`Invalid route: ${page.path}`);
  if (writtenPaths.has(page.path)) throw new Error(`Duplicate route: ${page.path}`);
  writtenPaths.add(page.path);
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, `${page.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}
writeFileSync(join(dist, "404.html"), render({ path: "/404", title: "Page not found | Gzone", description: "That page doesn't exist. Explore Gzone battles and events.", noindex: true }));
console.log(`Generated ${pages.length} route HTML files and 404.html`);
