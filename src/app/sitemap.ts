import type { MetadataRoute } from "next";
import { getBattleHref, pengameBattles } from "../data/pengameBattles";
import { gzoneBattles } from "../data/gzone";
import { creditPeople } from "../data/credits";
import { allMcs } from "../data/mcs";

const SITE_URL = "https://www.lordofthearchives.co.uk";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/pengame`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/league`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/gzone`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/gzone/league`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/lota-league`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/mcs`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/hosts-judges`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const battlePages: MetadataRoute.Sitemap = [...pengameBattles, ...gzoneBattles].map((battle) => ({
    url: `${SITE_URL}${getBattleHref(battle)}`,
    lastModified: battle.date ? new Date(battle.date) : currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const mcPages: MetadataRoute.Sitemap = allMcs.map((mc) => ({
    url: `${SITE_URL}/mc/${mc.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const creditPages: MetadataRoute.Sitemap = creditPeople.map((person) => ({
    url: `${SITE_URL}/hosts-judges/${person.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...new Map(
    [...staticPages, ...battlePages, ...mcPages, ...creditPages].map((entry) => [entry.url, entry]),
  ).values()];
}
