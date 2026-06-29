import type { Battle } from "./battleTypes";

export interface GzoneMc {
  id: string;
  slug: string;
  name: string;
}

export interface GzoneStanding extends GzoneMc {
  battles: number;
  wins: number;
  losses: number;
  unknown: number;
  points: number;
  rank: number;
}

const makeId = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const makeBattle = (
  episode: string,
  mc1Name: string,
  mc2Name: string,
  views: string,
  date: string,
  winnerName = "unknown",
): Battle => {
  const mc1 = makeId(mc1Name);
  const mc2 = makeId(mc2Name);
  const winner = winnerName === "unknown" ? "unknown" : makeId(winnerName);
  const episodeNumber = Number(episode.replace(/^1x0?/i, ""));

  return {
    id: `gz-s01-${episode.toLowerCase()}-${mc1}-vs-${mc2}`,
    slug: `${mc1}-vs-${mc2}`,
    mc1,
    mc2,
    title: `${mc1Name.toUpperCase()} vs ${mc2Name.toUpperCase()}`,
    date,
    views,
    winner,
    theme: "gzone",
    season: 1,
    competition: "Gzone League",
    subGroup: "Season 1",
    customEp: episode,
    seasonOrder: episodeNumber,
    statusNote: "Pending",
  };
};

export const gzoneBattles: Battle[] = [
  makeBattle("1x01", "Deeno", "Tapped24", "52.4K", "2025-12-25", "Deeno"),
  makeBattle("1x02", "PR1NC3", "Roman", "23.5K", "2026-01-01", "Roman"),
  makeBattle("1x03", "LDN MIKEZ", "Deluxx", "15.9K", "2026-01-08", "LDN MIKEZ"),
  makeBattle("1x04", "LDN MIKEZ", "2MWAD", "23.4K", "2026-01-15", "LDN MIKEZ"),
  makeBattle("1x05", "CJ Zino", "Proty", "10.6K", "2026-02-15", "Proty"),
  makeBattle("1x06", "Renzo", "Proty", "10.0K", "2026-02-19", "Renzo"),
  makeBattle("1x07", "Deluxx", "Btizz", "5.6K", "2026-02-25", "Btizz"),
  makeBattle("1x08", "2MWAD", "Ryno", "24.9K", "2026-02-19", "Ryno"),
  makeBattle("1x09", "Tapped24", "Roman", "16.2K", "2026-03-04", "Roman"),
  makeBattle("1x10", "Tapped24", "AJNA", "13.0K", "2026-03-19", "AJNA"),
  makeBattle("1x11", "Ryno", "Tymeless", "13.8K", "2026-03-26", "Tymeless"),
  makeBattle("1x12", "PR1NC3", "NattyEBK", "8.8K", "2026-04-02", "NattyEBK"),
  makeBattle("1x13", "Btizz", "CJ Zino", "6.2K", "2026-04-09", "CJ Zino"),
  makeBattle("1x14", "Deeno", "Grams", "20.4K", "2026-04-26", "Deeno"),
  makeBattle("1x15", "Tapped24", "Grams", "12.1K", "2026-04-26", "Tapped24"),
  makeBattle("1x16", "Btizz", "1Flaymr", "7.5K", "2026-04-26", "Btizz"),
  makeBattle("1x17", "Deeno", "Badee Harz", "26.5K", "2026-05-23", "Deeno"),
  makeBattle("1x18", "Ryno", "Roman", "10.9K", "2026-04-26", "Roman"),
  makeBattle("1x19", "1Flaymr", "CJ Zino", "4.5K", "2026-05-31", "1Flaymr"),
  makeBattle("1x20", "NattyEBK", "Z.K", "3.2K", "2026-05-31", "NattyEBK"),
  makeBattle("1x21", "Deeno", "Tymeless", "3.9K", "2026-05-31", "Tymeless"),
];

export const gzoneMcs: GzoneMc[] = Array.from(
  new Map(
    gzoneBattles
      .flatMap((battle) => [battle.mc1, battle.mc2])
      .map((id) => {
        const battle = gzoneBattles.find((item) => item.mc1 === id || item.mc2 === id);
        const name = battle?.mc1 === id ? battle.title.split(" vs ")[0] : battle?.title.split(" vs ")[1];
        return [id, { id, slug: id, name: name || id.toUpperCase() }];
      }),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name));

export const getGzoneStandings = (): GzoneStanding[] =>
  gzoneMcs
    .map((mc) => {
      const battles = gzoneBattles.filter((battle) => battle.mc1 === mc.id || battle.mc2 === mc.id);
      const wins = battles.filter((battle) => battle.winner === mc.id).length;
      const losses = battles.filter(
        (battle) => battle.winner && battle.winner !== "unknown" && battle.winner !== mc.id,
      ).length;
      const unknown = battles.filter((battle) => battle.winner === "unknown").length;
      const points = wins * 3;

      return {
        ...mc,
        battles: battles.length,
        wins,
        losses,
        unknown,
        points,
        rank: 0,
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      if (b.battles !== a.battles) return b.battles - a.battles;
      return a.name.localeCompare(b.name);
    })
    .map((standing, index) => ({ ...standing, rank: index + 1 }));
