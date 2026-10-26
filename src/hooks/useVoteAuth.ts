import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../lib/voteFirebase";
import { votingCopy } from "../lib/votingCopy";

export function useVoteAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (readyRef.current) return;
      readyRef.current = true;
      setIsAuthReady(true);
      setAuthError(votingCopy.auth.timeout);
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, (activeUser) => {
      readyRef.current = true;
      setUser(activeUser);
      setIsAuthReady(true);
      window.clearTimeout(timeoutId);
      if (activeUser) setAuthError(null);
    });

    return () => {
      unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return { user, isAuthReady, authError, setAuthError };
}
