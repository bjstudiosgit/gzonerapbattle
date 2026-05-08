import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Lock, LogIn, LogOut, Sparkles, User as UserIcon } from "lucide-react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../lib/voteFirebase";

const provider = new GoogleAuthProvider();

export default function MembersSection({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const displayName = useMemo(() => {
    if (!user) return null;
    return user.displayName || user.email || "Member";
  }, [user]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      setIsLoading(true);
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-in failed.";
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthError(null);
      setIsLoading(true);
      await signOut(auth);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-out failed.";
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="members" className={`relative overflow-hidden ${className || ""}`}>
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-white/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative rounded-[3rem] border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.75)]"
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-brand/10 via-transparent to-white/5 opacity-80" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h4 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight leading-none">
              Join the <span className="text-brand">Members</span> section
            </h4>
            <p className="mt-5 text-zinc-400 text-sm md:text-lg leading-relaxed tracking-tight font-medium opacity-85 max-w-xl">
              Sign in to unlock early announcements, member-only drops, and the extra behind-the-scenes energy.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Early ticket notifications", icon: Check },
                { label: "Live voting", icon: Sparkles },
                { label: "Quick access to the vote portal", icon: Check },
                { label: "Exclusive community access", icon: Check },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-brand" />
                  </div>
                  <div className="text-zinc-200 font-black uppercase tracking-widest text-[11px] leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-7 md:p-9 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <UserIcon size={18} className="text-brand" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-zinc-500">
                    Status
                  </div>
                  <div className="text-white font-display uppercase text-xl md:text-2xl leading-none truncate">
                    {user ? "Signed In" : "Not Signed In"}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-black border ${
                user
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                  : "bg-zinc-900/60 text-zinc-400 border-white/10"
              }`}>
                {user ? "MEMBER" : "GUEST"}
              </div>
            </div>

            {user && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-[10px] uppercase tracking-[0.35em] font-black text-zinc-500 mb-2">Account</div>
                <div className="text-zinc-100 font-black tracking-tight truncate">{displayName}</div>
              </div>
            )}

            {authError && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200 text-xs font-bold tracking-tight">
                {authError}
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!user ? (
                <>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleLogin}
                    className="w-full bg-brand hover:bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.22)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.28em] text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    SIGN IN <LogIn size={16} />
                  </button>
                  <Link
                    to="/vote"
                    className="w-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 py-4 rounded-2xl font-black flex items-center justify-center gap-3 border border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.28em] text-[11px]"
                  >
                    VOTE PORTAL <Lock size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/vote"
                    className="w-full bg-brand hover:bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.22)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.28em] text-[11px]"
                  >
                    GO TO VOTE <Sparkles size={16} />
                  </Link>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleLogout}
                    className="w-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 py-4 rounded-2xl font-black flex items-center justify-center gap-3 border border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.28em] text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    SIGN OUT <LogOut size={16} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-zinc-500 text-[10px] font-bold tracking-widest leading-relaxed">
              Secure sign in required for verified voting and member access.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
