import { useCallback, useEffect, useState } from "react";

import {
  LOCATION_REFRESH_MS,
  evaluateArenaPosition,
  type VoteLocationStatus,
} from "../lib/voteLocation";
import { votingCopy } from "../lib/votingCopy";

export interface VoteLocationState {
  status: VoteLocationStatus;
  error: string | null;
  result: ReturnType<typeof evaluateArenaPosition> | null;
  lastCheckedAt: number | null;
}

const initialState: VoteLocationState = {
  status: "idle",
  error: null,
  result: null,
  lastCheckedAt: null,
};

export function useArenaLocation(enabled: boolean) {
  const [locationState, setLocationState] = useState<VoteLocationState>(initialState);

  const requestArenaCheck = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState({
        status: "unsupported",
        error: votingCopy.location.required,
        result: null,
        lastCheckedAt: Date.now(),
      });
      return;
    }

    setLocationState((current) => ({
      ...current,
      status: "checking",
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = evaluateArenaPosition(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );

        setLocationState({
          status: result.withinArena ? "granted" : "blocked",
          error: result.withinArena ? null : votingCopy.location.shortMessage,
          result,
          lastCheckedAt: Date.now(),
        });
      },
      (error) => {
        let message = votingCopy.location.required;
        if (error.code === error.PERMISSION_DENIED) {
          message = votingCopy.location.denied;
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = votingCopy.location.unavailable;
        } else if (error.code === error.TIMEOUT) {
          message = votingCopy.location.timeout;
        }

        setLocationState({
          status: "blocked",
          error: message,
          result: null,
          lastCheckedAt: Date.now(),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;

    requestArenaCheck();
    const intervalId = window.setInterval(requestArenaCheck, LOCATION_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, [enabled, requestArenaCheck]);

  return { locationState, requestArenaCheck };
}
