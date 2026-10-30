import type { Battle } from "../data/battles";

export function battleDescription(battle: Battle, mc1?: string, mc2?: string, winner?: string) {
  const upcoming = Boolean(battle.isUnreleased && !battle.videoUrl && !battle.winner && !battle.resultLabel);
  const league = battle.league === "royal-rumble" ? "Royal Rumble" : battle.league === "freestyle" ? "Freestyle League" : "Season 1";
  if (upcoming) return battle.summary || `Upcoming battle: ${battle.title} from the Gzone ${league}.`;

  const intro = battle.league === "royal-rumble"
    ? `Watch ${battle.title} from the Gzone Rap Battle League.`
    : `Watch ${mc1 || battle.mc1} vs ${mc2 || battle.mc2} from the Gzone ${league}.`;
  return [intro, battle.date && `Battle date: ${battle.date}.`, winner && `Winner: ${winner}.`].filter(Boolean).join(" ");
}
