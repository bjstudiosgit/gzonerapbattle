import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db, handleFirestoreError, OperationType } from "../lib/voteFirebase";
import type { VoteMap, VotingBattle } from "../lib/voteTypes";

export function useVotingBattles(): VotingBattle[] {
  const [battles, setBattles] = useState<VotingBattle[]>([]);

  useEffect(() => {
    const battlesQuery = query(collection(db, "battles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      battlesQuery,
      (snapshot) => {
        setBattles(
          snapshot.docs.map((battleDoc) => ({
            id: battleDoc.id,
            ...battleDoc.data(),
          } as VotingBattle))
        );
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, "battles");
        } catch {
          // The page surfaces connection guidance through its own status copy.
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return battles;
}

export function useUserVotes(user: User | null): VoteMap {
  const [votedBattles, setVotedBattles] = useState<VoteMap>({});

  useEffect(() => {
    if (!user) {
      setVotedBattles({});
      return;
    }

    const votesQuery = query(
      collection(db, "votes"),
      where("voterId", "==", user.uid),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      votesQuery,
      (snapshot) => {
        const votes: VoteMap = {};
        snapshot.docs.forEach((voteDoc) => {
          const data = voteDoc.data();
          votes[String(data.battleId)] = data.choice;
        });
        setVotedBattles(votes);
      },
      (error) => {
        console.warn("Votes snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return votedBattles;
}
