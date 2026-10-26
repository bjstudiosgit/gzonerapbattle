import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "./voteFirebase";
import { votingCopy } from "./votingCopy";

const googleProvider = new GoogleAuthProvider();

export async function signInForVoting(): Promise<string | null> {
  try {
    googleProvider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, googleProvider);
    return null;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/popup-blocked") return votingCopy.auth.popupBlocked;
    if (code === "auth/popup-closed-by-user") return votingCopy.auth.popupClosed;
    return error instanceof Error ? error.message : votingCopy.auth.timeout;
  }
}
