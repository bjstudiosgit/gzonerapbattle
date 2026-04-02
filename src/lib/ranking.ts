import { Battle } from '../data/battles';

export interface MCRanking {
  id: string;
  battles: number;
  wins: number;
  losses: number;
  baseScore: number;
  bonusScore: number;
  totalScore: number;
  initialRank: number;
  rank: number;
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
  battles: { mc1: string; mc2: string; winner?: string }[]
): MCRanking[] {
  const mcs = generateMCs(battles);
  const statsMap = new Map<string, MCRanking>();

  for (const mc of mcs) {
    statsMap.set(mc, {
      id: mc,
      battles: 0,
      wins: 0,
      losses: 0,
      baseScore: 0,
      bonusScore: 0,
      totalScore: 0,
      initialRank: 0,
      rank: 0,
    });
  }

  for (const battle of battles) {
    const mc1Stats = statsMap.get(battle.mc1);
    const mc2Stats = statsMap.get(battle.mc2);

    if (mc1Stats) {
      mc1Stats.battles += 1;
      mc1Stats.baseScore += 1;
    }
    
    if (mc2Stats) {
      mc2Stats.battles += 1;
      mc2Stats.baseScore += 1;
    }

    if (battle.winner) {
      if (battle.winner === battle.mc1 && mc1Stats && mc2Stats) {
        mc1Stats.wins += 1;
        mc1Stats.baseScore += 3;
        mc2Stats.losses += 1;
      } else if (battle.winner === battle.mc2 && mc2Stats && mc1Stats) {
        mc2Stats.wins += 1;
        mc2Stats.baseScore += 3;
        mc1Stats.losses += 1;
      }
    }
  }

  const initialRanking = Array.from(statsMap.values()).sort((a, b) => {
    if (b.baseScore !== a.baseScore) return b.baseScore - a.baseScore;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.id.localeCompare(b.id);
  });

  const initialRankMap = new Map<string, number>();
  initialRanking.forEach((stat, index) => {
    initialRankMap.set(stat.id, index + 1);
    stat.initialRank = index + 1;
  });

  for (const battle of battles) {
    if (!battle.winner) continue;

    const winner = battle.winner;
    const loser = battle.winner === battle.mc1 ? battle.mc2 : battle.mc1;

    const winnerRank = initialRankMap.get(winner);
    const loserRank = initialRankMap.get(loser);

    if (winnerRank !== undefined && loserRank !== undefined) {
      if (winnerRank > loserRank) {
        const positionDiff = winnerRank - loserRank;
        let bonus = 0;
        
        if (positionDiff >= 1 && positionDiff <= 3) bonus = 1;
        else if (positionDiff >= 4 && positionDiff <= 7) bonus = 2;
        else if (positionDiff >= 8) bonus = 3;

        const winnerStats = statsMap.get(winner);
        if (winnerStats) {
          winnerStats.bonusScore += bonus;
        }
      }
    }
  }

  for (const stat of statsMap.values()) {
    stat.totalScore = stat.baseScore + stat.bonusScore;
  }

  const finalRanking = Array.from(statsMap.values()).sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.id.localeCompare(b.id);
  });

  finalRanking.forEach((stat, index) => {
    stat.rank = index + 1;
  });

  return finalRanking;
}
