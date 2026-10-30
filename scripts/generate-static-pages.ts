import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { battles } from "../src/data/battles";
import { hosts } from "../src/data/hosts";
import { judges } from "../src/data/judges";
import { guestMcs, mcs } from "../src/data/mcs";
import { portraitImage } from "../src/lib/images";
import { defaultDescription, defaultSocialImage, siteOrigin, staticPages, type SitePage } from "../src/data/sitePages";
import { battleDescription } from "../src/lib/battleSeo";

const origin = siteOrigin;
const dist = resolve("dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const pages: SitePage[] = [...staticPages];

for (const battle of battles) {
  const mc1 = [...mcs, ...guestMcs].find((mc) => mc.id === battle.mc1);
  const mc2 = [...mcs, ...guestMcs].find((mc) => mc.id === battle.mc2);
  const winner = [...mcs, ...guestMcs].find((mc) => mc.id === battle.winner)?.name;
  const description = battleDescription(battle, mc1?.name, mc2?.name, winner);
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

function render(page: SitePage) {
  const url = `${origin}${page.canonical || page.path}`;
  const image = page.image || defaultSocialImage;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  html = replaceTag(html, `<meta name="description" content="${defaultDescription}" />`, `<meta data-rh="true" name="description" content="${escape(page.description)}" />`);
  html = html.replace("</head>", `    <meta data-rh="true" property="og:title" content="${escape(page.title)}" />\n    <meta data-rh="true" property="og:description" content="${escape(page.description)}" />\n    <meta data-rh="true" property="og:url" content="${escape(url)}" />\n    <meta data-rh="true" property="og:image" content="${escape(image)}" />\n    <meta data-rh="true" name="twitter:card" content="summary_large_image" />\n    <link data-rh="true" rel="canonical" href="${escape(url)}" />\n    ${page.noindex ? '<meta data-rh="true" name="robots" content="noindex" />\n    ' : ""}</head>`);
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
