import { battles } from "./battles";
import { mcs } from "./mcs";

const catalogueOrder = new Map([
  ["tymeless-vs-kime-4", "31.07"],
  ["tymeless-vs-kime-5", "31.05"],
  ["tymeless-vs-kime-6", "31.06"],
]);

export const museumItems = battles.flatMap((battle) =>
  (battle.props ?? []).map((prop, index) => {
    const artist = mcs.find((mc) => mc.name.toLowerCase() === prop.user.toLowerCase());
    return {
      ...prop,
      id: `${battle.slug}-${index + 1}`,
      number: `${battle.id.padStart(2, "0")}.${String(index + 1).padStart(2, "0")}`,
      user: artist?.name ?? prop.user,
      artistImage: artist?.image,
      battleSlug: battle.slug,
      battleTitle: battle.title,
      battleDate: battle.date,
      episode: battle.episode,
      timestamp: Date.parse(battle.date ?? "") || 0,
    };
  }),
).sort((a, b) => b.timestamp - a.timestamp || (catalogueOrder.get(a.id) ?? a.number).localeCompare(catalogueOrder.get(b.id) ?? b.number));

export type MuseumItem = (typeof museumItems)[number];
export const featuredExhibits = museumItems.slice(0, 4);
