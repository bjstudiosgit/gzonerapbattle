export type VoteChoice = "A" | "B";

export type VoteMap = Record<string, VoteChoice>;

export interface VotingBattle {
  id: string;
  title: string;
  artistA: string;
  artistB: string;
  status: "pending" | "active" | "finished";
  votesA: number;
  votesB: number;
  createdAt: unknown;
  updatedAt: unknown;
}
