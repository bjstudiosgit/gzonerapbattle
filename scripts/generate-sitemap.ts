import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { battles } from "../src/data/battles";
import { hosts } from "../src/data/hosts";
import { judges } from "../src/data/judges";
import { mcs } from "../src/data/mcs";

const siteUrl = "https://www.gzonerapbattle.co.uk";
const lastModified = new Date().toISOString().slice(0, 10);

type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/battles", changefreq: "daily", priority: "0.9" },
  { path: "/freestyle", changefreq: "weekly", priority: "0.8" },
  { path: "/royal-rumble", changefreq: "weekly", priority: "0.9" },
  { path: "/gzone-street-freestyles", changefreq: "weekly", priority: "0.8" },
  { path: "/cyphers", changefreq: "weekly", priority: "0.8" },
  { path: "/league", changefreq: "weekly", priority: "0.9" },
  { path: "/events", changefreq: "weekly", priority: "0.8" },
  { path: "/battles/mc", changefreq: "weekly", priority: "0.8" },
  { path: "/staff", changefreq: "monthly", priority: "0.7" },
  { path: "/photos", changefreq: "weekly", priority: "0.7" },
  { path: "/map", changefreq: "monthly", priority: "0.6" },
  { path: "/flyers", changefreq: "weekly", priority: "0.7" },
  { path: "/promo", changefreq: "monthly", priority: "0.6" },
  { path: "/merch", changefreq: "monthly", priority: "0.6" },
  { path: "/apply", changefreq: "monthly", priority: "0.6" },
  { path: "/vote", changefreq: "weekly", priority: "0.6" },
  { path: "/lost-property", changefreq: "weekly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

const publishedBattles = battles.filter(
  (battle) => battle.videoUrl && !battle.isUnreleased && !battle.isPlaceholder,
);

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const urlEntry = ({ path, changefreq, priority }: SitemapEntry) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const battleEntry = (battle: (typeof publishedBattles)[number]) => {
  const videoId = battle.videoUrl?.split("/").pop() ?? "";
  const publicationDate = new Date(battle.releaseDate ?? battle.date ?? lastModified).toISOString();

  return `  <url>
    <loc>${siteUrl}/battle/${battle.slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${videoId}/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>${escapeXml(`${battle.title} - Gzone Rap Battle`)}</video:title>
      <video:description>${escapeXml(`Full battle between ${battle.title.replace(" vs ", " and ")} from Gzone Rap Battle League.`)}</video:description>
      <video:player_loc>${escapeXml(battle.videoUrl ?? "")}</video:player_loc>
      <video:content_loc>https://www.youtube.com/watch?v=${videoId}</video:content_loc>
      <video:publication_date>${publicationDate}</video:publication_date>
    </video:video>
  </url>`;
};

const profileEntries: SitemapEntry[] = [
  ...mcs.map((mc) => ({ path: `/mc/${mc.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
  ...hosts.map((host) => ({ path: `/host/${host.id}`, changefreq: "monthly" as const, priority: "0.6" })),
  ...judges.map((judge) => ({ path: `/judge/${judge.id}`, changefreq: "monthly" as const, priority: "0.6" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[
  ...staticEntries.map(urlEntry),
  ...publishedBattles.map(battleEntry),
  ...profileEntries.map(urlEntry),
].join("\n")}
</urlset>
`;

writeFileSync(resolve("public/sitemap.xml"), sitemap, "utf8");
console.log(
  `Generated sitemap with ${staticEntries.length} pages, ${publishedBattles.length} battles, and ${profileEntries.length} profiles.`,
);
