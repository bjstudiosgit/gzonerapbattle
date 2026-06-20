export const votingCopy = {
  status: {
    loading: {
      title: "Loading Voting",
      message: "Checking the latest battle status.",
    },
    standby: {
      title: "Next Battle Loading",
      message: "Voting will open when the next battle goes live.",
    },
    open: {
      title: "Vote Live",
      message: "Choose your winner. Once submitted, your vote is locked.",
    },
    closed: {
      title: "Voting Closed",
      message: "This battle is no longer accepting votes.",
    },
    confirmed: {
      title: "Vote Confirmed",
      message: "Your vote has been counted and locked.",
    },
    locked: {
      title: "Vote Locked",
      message: "You have already voted in this battle.",
    },
    noBattle: {
      title: "No Battle Live",
      message: "There is no active battle accepting votes right now.",
    },
  },

  auth: {
    requiredTitle: "Sign In To Vote",
    requiredMessage:
      "Sign in with Google before casting your vote. This helps keep the live count clean.",
    popupBlocked:
      "Sign-in blocked. Enable popups for this site and try again.",
    popupClosed:
      "Sign-in cancelled. Open the sign-in window again to continue.",
    timeout:
      "Still checking sign-in. Check your connection and try again.",
  },

  location: {
    requiredTitle: "Venue Check Required",
    activeTitle: "Venue Check Active",
    activeMessage:
      "Votes are only accepted inside Peacock Gymnasium, 8-9 Caxton Street North, London E16 1JL.",
    shortMessage:
      "Voting is restricted to the arena floor.",
    denied:
      "Location access blocked. Enable GPS permission and try again.",
    unavailable:
      "Location not found. Move to a clearer signal area and try again.",
    timeout:
      "GPS check timed out. Try again.",
    required:
      "Confirm your venue location before voting.",
    refreshButton:
      "Recheck Location",
  },

  voting: {
    instruction:
      "Choose once. Your vote cannot be changed.",
    helper:
      "Sign-in and venue check help protect the live count.",
    voteButton:
      "Vote {artistName}",
    confirmed:
      "Vote Confirmed",
    lockedFor:
      "Locked for {artistName}",
    locked:
      "Vote Locked",
    total:
      "Total Votes Cast",
  },
};

export function withArtistName(template: string, artistName: string) {
  return template.replace("{artistName}", artistName);
}
