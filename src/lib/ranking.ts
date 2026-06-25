import { Battle } from '../data/battles';
import { mcs, type MC } from '../data/mcs';

export interface MCRanking {
  id: string;
  battles: number;
  wins: number;
  losses: number;
  baseScore: number;
  totalScore: number;
  rank: number;
}

export function getRankStars(rank: number): number {
  if (rank <= 0) return 0;
  return Math.max(0, 6 - rank);
}

export function generateMCs(battles: { mc1: string; mc2: string }[]): string[] {
  const mcs = new Set<string>();
  for (const battle of battles) {
    if (battle.mc1) mcs.add(battle.mc1);
    if (battle.mc2) mcs.add(battle.mc2);
  }
  return Array.from(mcs);
}

export function calculateRankings(
  allBattles: Battle[],
  mcsList: MC[] = mcs
): MCRanking[] {
  const isTeamBattle = (battle: Battle) =>
    battle.mc1.includes("&") || battle.mc2.includes("&");

  const singlesBattles = allBattles.filter((battle) => !isTeamBattle(battle));
  const scoredBattles = singlesBattles.filter((battle) => !battle.isPlaceholder && Boolean(battle.winner));
  const mcsIds = generateMCs(singlesBattles);
  const statsMap = new Map<string, MCRanking>();

  for (const mcId of mcsIds) {
    statsMap.set(mcId, {
      id: mcId,
      battles: 0,
      wins: 0,
      losses: 0,
      baseScore: 0,
      totalScore: 0,
      rank: 0,
    });
  }

  for (const battle of scoredBattles) {
    const mc1Stats = statsMap.get(battle.mc1);
    const mc2Stats = statsMap.get(battle.mc2);

    if (mc1Stats) {
      mc1Stats.battles += 1;
    }

    if (mc2Stats) {
      mc2Stats.battles += 1;
    }

    if (battle.winner) {
      if (battle.winner === battle.mc1 && mc1Stats && mc2Stats) {
        mc1Stats.wins += 1;
        mc1Stats.baseScore += 3;
        mc2Stats.losses += 1;
        mc2Stats.baseScore += 1;
      } else if (battle.winner === battle.mc2 && mc2Stats && mc1Stats) {
        mc2Stats.wins += 1;
        mc2Stats.baseScore += 3;
        mc1Stats.losses += 1;
        mc1Stats.baseScore += 1;
      }
    }
  }

  for (const stat of statsMap.values()) {
    stat.totalScore = stat.baseScore;
  }

  const finalRanking = Array.from(statsMap.values()).sort((a, b) => {
    const mcA = mcsList.find(m => m.id === a.id);
    const mcB = mcsList.find(m => m.id === b.id);
    
    // Explicit priority for active MCs
    const isAActive = mcA?.isActive !== false;
    const isBActive = mcB?.isActive !== false;
    
    if (isAActive && !isBActive) return -1;
    if (!isAActive && isBActive) return 1;
    
    // If both have same activity status, sort by score
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.id.localeCompare(b.id);
  });

  let previousKey = "";
  let previousRank = 0;

  finalRanking.forEach((stat, index) => {
    const mc = mcsList.find(m => m.id === stat.id);
    const isActive = mc?.isActive !== false;
    const key = `${isActive ? "1" : "0"}:${stat.totalScore}:${stat.wins}`;

    if (key !== previousKey) {
      previousKey = key;
      previousRank = index + 1;
    }

    stat.rank = previousRank;
  });

  return finalRanking;
}
