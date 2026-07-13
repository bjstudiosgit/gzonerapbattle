export const ARENA_LOCATION = {
  address: "8-9 Caxton Street North, London E16 1JL",
  latitude: 51.51049041748047,
  longitude: 0.012462200596928596,
};

export const ARENA_VOTING_RADIUS_METERS = 180;
export const MAX_LOCATION_ACCURACY_METERS = 250;
export const LOCATION_REFRESH_MS = 30000;

export type VoteLocationStatus =
  | "idle"
  | "checking"
  | "granted"
  | "blocked"
  | "unsupported";

export interface ArenaCheckResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  distanceMeters: number;
  withinArena: boolean;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
) {
  const earthRadius = 6371000;
  const latDelta = toRadians(toLatitude - fromLatitude);
  const lonDelta = toRadians(toLongitude - fromLongitude);
  const fromLat = toRadians(fromLatitude);
  const toLat = toRadians(toLatitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function evaluateArenaPosition(latitude: number, longitude: number, accuracy: number): ArenaCheckResult {
  const distanceMeters = calculateDistanceMeters(
    latitude,
    longitude,
    ARENA_LOCATION.latitude,
    ARENA_LOCATION.longitude
  );
  const accuracyAllowance = Math.min(Math.max(accuracy, 0), 75);
  const withinArena =
    accuracy <= MAX_LOCATION_ACCURACY_METERS &&
    distanceMeters <= ARENA_VOTING_RADIUS_METERS + accuracyAllowance;

  return {
    latitude,
    longitude,
    accuracy,
    distanceMeters,
    withinArena,
  };
}

export function formatMeters(value: number) {
  return `${Math.round(value)}m`;
}
