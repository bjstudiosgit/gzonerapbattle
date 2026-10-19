import { createClient } from "@supabase/supabase-js";

import { normalizeUsername, validateUsername } from "./backstageUsername";

export const pendingUpdatesKey = "gzone.backstage.pending-updates";
export type BackstageProfile = { user_id: string; username: string };

export type BackstageSession = { user: { id: string; email?: string } };
export type BackstageVideo = { id: string; title: string; description: string; storage_path: string };

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const projectUrl = env.VITE_SUPABASE_URL?.trim();
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
export const backstageConfigured = Boolean(projectUrl && publishableKey);
const supabase = backstageConfigured ? createClient(projectUrl!, publishableKey!, {
  auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

function client() {
  if (!supabase) throw new Error("Backstage sign-in is not connected yet.");
  return supabase;
}

export async function getBackstageSession(): Promise<BackstageSession | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function watchBackstageSession(callback: (session: BackstageSession | null) => void) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export class BackstageSignInError extends Error {}

export async function signInBackstage(): Promise<void> {
  const authClient = client();
  // Keep visitors on the entrance if Google has not been enabled in the project.
  const settingsResponse = await fetch(`${projectUrl}/auth/v1/settings`, {
    headers: { apikey: publishableKey! },
    signal: AbortSignal.timeout(10000),
  });
  if (!settingsResponse.ok) throw new BackstageSignInError("Sign-in is temporarily unavailable. Please try again shortly.");
  const settings = await settingsResponse.json();
  if (settings.external?.google !== true) {
    throw new BackstageSignInError("Google sign-in is opening soon. Please check back shortly.");
  }
  const { error } = await authClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/backstage`, queryParams: { prompt: "select_account" } },
  });
  if (error) throw error;
}

export async function signOutBackstage(): Promise<void> {
  const { error } = await client().auth.signOut({ scope: "local" });
  if (error) throw error;
}

export async function getEmailPreference(): Promise<boolean | null> {
  const session = await getBackstageSession();
  if (!session) throw new Error("Sign in to manage email updates.");
  const { data, error } = await client().from("backstage_email_preferences")
    .select("opted_in").eq("user_id", session.user.id).maybeSingle();
  if (error) throw error;
  return data?.opted_in ?? null;
}

export async function saveEmailPreference(optedIn: boolean): Promise<void> {
  const { error } = await client().rpc("set_backstage_email_updates", { wants_updates: optedIn });
  if (error) throw error;
}

export async function getBackstageVideos(): Promise<BackstageVideo[]> {
  const { data, error } = await client().from("backstage_videos")
    .select("id,title,description,storage_path").eq("published", true).order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBackstageVideoUrl(path: string): Promise<string> {
  const { data, error } = await client().storage.from("backstage-videos").createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function getBackstageProfile(): Promise<BackstageProfile | null> {
  const session = await getBackstageSession();
  if (!session) throw new Error("Sign in to load your profile.");
  const { data, error } = await client().from("backstage_profiles")
    .select("user_id,username").eq("user_id", session.user.id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveBackstageUsername(value: string): Promise<BackstageProfile> {
  const username = normalizeUsername(value);
  const validationError = validateUsername(username);
  if (validationError) throw new Error(validationError);
  const session = await getBackstageSession();
  if (!session) throw new Error("Please sign in again to save your username.");
  const { data, error } = await client().from("backstage_profiles")
    .upsert({ user_id: session.user.id, username }, { onConflict: "user_id" })
    .select("user_id,username").single();
  if (error?.code === "23505") throw new Error("That username is already taken. Try another.");
  if (error) throw new Error("Your username couldn’t be saved. Please try again.");
  return data;
}
