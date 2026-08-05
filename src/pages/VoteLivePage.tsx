/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { motion } from 'motion/react';
import { Check, LogIn, Radio, ShieldAlert, ShieldCheck, Signal, Vote, MapPin, RefreshCw } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/voteFirebase';
import {
  LOCATION_REFRESH_MS,
  VoteLocationStatus,
  evaluateArenaPosition,
  formatMeters,
} from '../lib/voteLocation';
import { votingCopy, withArtistName } from '../lib/votingCopy';

interface Battle {
  id: string;
  title: string;
  artistA: string;
  artistB: string;
  status: 'pending' | 'active' | 'finished';
  votesA: number;
  votesB: number;
  createdAt: any;
  updatedAt: any;
}

interface VoteLocationState {
  status: VoteLocationStatus;
  error: string | null;
  result: ReturnType<typeof evaluateArenaPosition> | null;
  lastCheckedAt: number | null;
}

const googleProvider = new GoogleAuthProvider();

function getBattleStatusLabel(battle?: Battle) {
  if (!battle) return votingCopy.status.noBattle.title;
  if (battle.status === 'active') return votingCopy.status.open.title;
  if (battle.status === 'finished') return votingCopy.status.closed.title;
  return votingCopy.status.standby.title;
}

function useNativeViewportLock() {
  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overscrollBehavior;
    const bodyOverflow = document.body.style.overscrollBehavior;
    const bodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'manipulation';

    return () => {
      document.documentElement.style.overscrollBehavior = htmlOverflow;
      document.body.style.overscrollBehavior = bodyOverflow;
      document.body.style.touchAction = bodyTouchAction;
    };
  }, []);
}

export default function VoteLivePage() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [votedBattles, setVotedBattles] = useState<Record<string, 'A' | 'B'>>({});
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<VoteLocationState>({
    status: 'idle',
    error: null,
    result: null,
    lastCheckedAt: null,
  });

  useNativeViewportLock();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsAuthReady(true);
      setAuthError(votingCopy.auth.timeout);
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, (activeUser) => {
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

  useEffect(() => {
    const battlesQuery = query(collection(db, 'battles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      battlesQuery,
      (snapshot) => {
        setBattles(snapshot.docs.map((battleDoc) => ({ id: battleDoc.id, ...battleDoc.data() } as Battle)));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'battles');
        } catch {
          setAuthError(votingCopy.status.noBattle.message);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setVotedBattles({});
      return;
    }

    const votesQuery = query(collection(db, 'votes'), where('voterId', '==', user.uid));
    const unsubscribe = onSnapshot(
      votesQuery,
      (snapshot) => {
        const votes: Record<string, 'A' | 'B'> = {};
        snapshot.docs.forEach((voteDoc) => {
          const data = voteDoc.data();
          votes[data.battleId] = data.choice;
        });
        setVotedBattles(votes);
      },
      (error) => {
        console.warn('Votes snapshot error:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        setAuthError(votingCopy.auth.popupBlocked);
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError(votingCopy.auth.popupClosed);
      } else {
        setAuthError(error.message || votingCopy.auth.timeout);
      }
    }
  };

  const requestArenaCheck = () => {
    if (!navigator.geolocation) {
      setLocationState({
        status: 'unsupported',
        error: votingCopy.location.required,
        result: null,
        lastCheckedAt: Date.now(),
      });
      return;
    }

    setLocationState((current) => ({
      ...current,
      status: 'checking',
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
          status: result.withinArena ? 'granted' : 'blocked',
          error: result.withinArena
            ? null
            : votingCopy.location.shortMessage,
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
          status: 'blocked',
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
  };

  useEffect(() => {
    if (!user) return;
    requestArenaCheck();

    const intervalId = window.setInterval(() => {
      requestArenaCheck();
    }, LOCATION_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [user]);

  const castVote = async (battleId: string, choice: 'A' | 'B') => {
    if (!user || votedBattles[battleId]) return;
    if (locationState.status !== 'granted' || !locationState.result?.withinArena) {
      setVoteError(votingCopy.location.required);
      return;
    }

    const voteId = `${user.uid}_${battleId}`;
    try {
      setVoteError(null);
      await setDoc(doc(db, 'votes', voteId), {
        battleId,
        voterId: user.uid,
        choice,
        timestamp: serverTimestamp()
      });
      await updateDoc(doc(db, 'battles', battleId), {
        [choice === 'A' ? 'votesA' : 'votesB']: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, `votes/${voteId}`);
      } catch {
        setVoteError('Your vote could not be confirmed. Please try again.');
      }
    }
  };

  const activeBattle = battles.find((battle) => battle.status === 'active');
  const currentBattle =
    activeBattle ||
    battles.find((battle) => battle.status === 'pending') ||
    battles.find((battle) => battle.status === 'finished') ||
    battles[0];
  return (
    <div
      className="vote-system fixed inset-0 flex h-[100dvh] w-screen flex-col overflow-hidden overscroll-none bg-black text-white selection:bg-orange-500 selection:text-black [touch-action:manipulation]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }}
    >
      <Helmet>
        <title>G-Zone Live Voting</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>

      <div className="scanline" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.20),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-carbon opacity-[0.08]" />

      <LiveHeader battle={currentBattle} />

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-none px-4 py-4 sm:px-6">
        {isAuthReady ? (
          <LiveVotingPanel
            activeBattle={activeBattle}
            user={user}
            votedBattles={votedBattles}
            authError={authError}
            voteError={voteError}
            locationState={locationState}
            onLogin={handleGoogleLogin}
            onVote={castVote}
            onRefreshLocation={requestArenaCheck}
          />
        ) : (
          <LiveLoadingPanel />
        )}
      </main>
    </div>
  );
}

function LiveHeader({ battle }: { battle?: Battle }) {
  const status = getBattleStatusLabel(battle);
  const isOpen = battle?.status === 'active';

  return (
    <header className="relative z-20 shrink-0 border-b border-white/10 bg-black/80 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.55)]">
              <Radio size={15} />
            </span>
            <h1 className="truncate text-[13px] font-black uppercase italic tracking-widest text-white">
              <span className="text-orange-500">Gzone</span> Live Event Voting
            </h1>
          </div>
          <p className="mt-1 truncate text-sm font-black uppercase italic leading-tight text-zinc-300 sm:text-base">
            {battle?.title || votingCopy.status.noBattle.title}
          </p>
        </div>

        <div className="flex shrink-0 items-end text-right">
          <div
            className={`flex items-center gap-2 border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
              isOpen
                ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                : 'border-white/10 bg-white/5 text-zinc-400'
            }`}
          >
            {isOpen && <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316] animate-pulse" />}
            {status}
          </div>
        </div>
      </div>
    </header>
  );
}

function LiveLoadingPanel() {
  return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
      <div className="mono text-[10px] font-black uppercase tracking-widest text-zinc-300">{votingCopy.status.loading.title}</div>
      <p className="text-sm text-zinc-500">{votingCopy.status.loading.message}</p>
    </div>
  );
}

function LiveVotingPanel({
  activeBattle,
  user,
  votedBattles,
  authError,
  voteError,
  locationState,
  onLogin,
  onVote,
  onRefreshLocation,
}: {
  activeBattle?: Battle;
  user: User | null;
  votedBattles: Record<string, 'A' | 'B'>;
  authError: string | null;
  voteError: string | null;
  locationState: VoteLocationState;
  onLogin: () => void;
  onVote: (battleId: string, choice: 'A' | 'B') => void;
  onRefreshLocation: () => void;
}) {
  if (!user) {
    return <LiveLoginPanel authError={authError} onLogin={onLogin} />;
  }

  if (!activeBattle) {
    return <LiveStandbyPanel />;
  }

  const userVote = votedBattles[activeBattle.id];
  const total = activeBattle.votesA + activeBattle.votesB;
  const percentA = total > 0 ? Math.round((activeBattle.votesA / total) * 100) : 0;
  const percentB = total > 0 ? Math.round((activeBattle.votesB / total) * 100) : 0;
  const isLocationGranted = locationState.status === 'granted' && !!locationState.result?.withinArena;
  const locationLocked = !isLocationGranted || !!userVote;

  return (
    <section className="w-full max-w-5xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-orange-400">
            <Signal size={16} />
            <span className="mono text-[10px] font-black uppercase tracking-widest">{votingCopy.status.open.title}</span>
          </div>
          <h2 className="mt-1 text-3xl font-black uppercase italic leading-none tracking-tight sm:text-5xl">
            {activeBattle.artistA} <span className="text-orange-500">vs</span> {activeBattle.artistB}
          </h2>
          <p className="mt-2 max-w-xl text-sm font-bold text-zinc-400">
            {votingCopy.voting.instruction}
          </p>
        </div>
        <div className="hidden shrink-0 border border-white/10 bg-white/5 px-4 py-2 text-right sm:block">
          <div className="text-2xl font-black italic">{total}</div>
          <div className="mono text-[9px] font-black uppercase tracking-widest text-zinc-500">{votingCopy.voting.total}</div>
        </div>
      </div>

      {voteError && (
        <div className="mb-3 border border-red-500/40 bg-red-500/15 px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-red-300">
          {voteError}
        </div>
      )}

      <div className={`mb-3 border px-4 py-3 ${
        isLocationGranted ? 'border-green-500/35 bg-green-500/10' : 'border-red-500/35 bg-red-500/10'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {isLocationGranted ? <MapPin size={16} className="text-green-400" /> : <ShieldAlert size={16} className="text-red-400" />}
              <span className="mono text-[10px] font-black uppercase tracking-widest text-zinc-200">
                {isLocationGranted ? votingCopy.location.activeTitle : votingCopy.location.requiredTitle}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              {isLocationGranted ? votingCopy.location.activeMessage : votingCopy.location.shortMessage}
            </p>
            {locationState.result && (
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Distance {formatMeters(locationState.result.distanceMeters)} • Accuracy {formatMeters(locationState.result.accuracy)}
              </p>
            )}
            {locationState.error && (
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-300">
                {locationState.error}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRefreshLocation}
            disabled={locationState.status === 'checking'}
            className="shrink-0 border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={12} className={locationState.status === 'checking' ? 'animate-spin' : ''} />
              {votingCopy.location.refreshButton}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <LiveVoteCard
          slot="A"
          artist={activeBattle.artistA}
          votes={activeBattle.votesA}
          percent={percentA}
          tone="orange"
          isSelected={userVote === 'A'}
          isLocked={locationLocked}
          onClick={() => onVote(activeBattle.id, 'A')}
        />
        <LiveVoteCard
          slot="B"
          artist={activeBattle.artistB}
          votes={activeBattle.votesB}
          percent={percentB}
          tone="white"
          isSelected={userVote === 'B'}
          isLocked={locationLocked}
          onClick={() => onVote(activeBattle.id, 'B')}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        {userVote ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border border-green-400/30 bg-green-400/10 px-4 py-3 text-green-300"
          >
            <span className="flex h-9 w-9 items-center justify-center bg-green-400 text-black">
              <Check size={20} />
            </span>
            <div>
              <div className="text-sm font-black uppercase italic">{votingCopy.voting.confirmed}</div>
              <div className="mono text-[9px] font-black uppercase tracking-widest opacity-70">
                {withArtistName(
                  votingCopy.voting.lockedFor,
                  userVote === 'A' ? activeBattle.artistA : activeBattle.artistB
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3 border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-200">
            <ShieldCheck size={26} className="shrink-0 text-orange-400" />
            <div className="text-xs font-bold leading-snug text-orange-100/80">
              {votingCopy.voting.instruction}
              <br />
              {votingCopy.voting.helper}
            </div>
          </div>
        )}

        <div className="flex justify-center border border-white/10 bg-white/5 px-5 py-3 sm:min-w-40">
          <div className="text-center">
            <div className="text-3xl font-black italic">{total}</div>
            <div className="mono text-[9px] font-black uppercase tracking-widest text-zinc-500">{votingCopy.voting.total}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveLoginPanel({ authError, onLogin }: { authError: string | null; onLogin: () => void }) {
  return (
    <section className="w-full max-w-md text-center">
      <div className="border border-white/10 bg-zinc-950/80 px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:px-8">
        <LogIn size={42} className="mx-auto mb-5 text-orange-500" />
        <h2 className="text-3xl font-black italic leading-none tracking-tight text-white">{votingCopy.auth.requiredTitle}</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
          {votingCopy.auth.requiredMessage}
        </p>

        {authError && (
          <div className="mt-5 border border-red-500/40 bg-red-500/15 px-4 py-3 text-[11px] font-black uppercase leading-relaxed tracking-wider text-red-300">
            {authError}
          </div>
        )}

        <button
          onClick={onLogin}
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-orange-500 px-6 py-4 text-base font-black uppercase italic text-white shadow-[0_10px_30px_rgba(249,115,22,0.35)] transition-all active:scale-[0.98] [touch-action:manipulation]"
        >
          <LogIn size={22} /> Sign in with Google
        </button>
      </div>
    </section>
  );
}

function LiveStandbyPanel() {
  return (
    <section className="w-full max-w-md text-center">
      <div className="border border-white/10 bg-zinc-950/75 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <Radio size={30} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-black uppercase italic leading-none">{votingCopy.status.standby.title}</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
          {votingCopy.status.standby.message}
        </p>
      </div>
    </section>
  );
}

function LiveVoteCard({
  slot,
  artist,
  votes,
  percent,
  tone,
  isSelected,
  isLocked,
  onClick,
}: {
  slot: 'A' | 'B';
  artist: string;
  votes: number;
  percent: number;
  tone: 'orange' | 'white';
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  const isOrange = tone === 'orange';

  return (
    <button
      disabled={isLocked}
      onClick={onClick}
      className={`group relative min-h-40 overflow-hidden border p-5 text-left transition-all active:scale-[0.985] sm:min-h-72 sm:p-6 [touch-action:manipulation] ${
        isSelected
          ? isOrange
            ? 'border-orange-400 bg-orange-500/20 shadow-[0_0_35px_rgba(249,115,22,0.25)]'
            : 'border-white bg-white/15 shadow-[0_0_35px_rgba(255,255,255,0.18)]'
          : isLocked
            ? 'border-white/10 bg-white/[0.03] opacity-45'
            : isOrange
              ? 'border-orange-500/35 bg-orange-500/10 hover:border-orange-400'
              : 'border-white/20 bg-white/[0.06] hover:border-white/60'
      }`}
    >
      <div className="pointer-events-none absolute -right-3 -top-8 text-[130px] font-black italic leading-none text-white/[0.035] sm:text-[220px]">
        {slot}
      </div>
      <div className="relative z-10 flex h-full min-h-32 flex-col justify-between gap-8 sm:min-h-60">
        <div>
          <div className={`mono text-[10px] font-black uppercase tracking-widest ${isOrange ? 'text-orange-300' : 'text-zinc-300'}`}>
            Contender {slot}
          </div>
          <h3 className="mt-2 text-4xl font-black uppercase italic leading-none tracking-tight text-white sm:text-6xl">
            {artist}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div className={`text-5xl font-black italic leading-none tracking-tight ${isOrange ? 'text-orange-500' : 'text-white'}`}>
              {percent}<span className="text-2xl">%</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-black italic text-white">{votes}</div>
              <div className="mono text-[9px] font-black uppercase tracking-widest text-zinc-500">Votes</div>
            </div>
          </div>
          <div className="h-2 overflow-hidden bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className={`h-full ${isOrange ? 'bg-orange-500 shadow-[0_0_16px_#f97316]' : 'bg-white shadow-[0_0_16px_#ffffff]'}`}
            />
          </div>
          <div
            className={`flex min-h-12 items-center justify-center px-4 text-sm font-black uppercase italic tracking-wide ${
              isSelected
                ? isOrange
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-black'
                : isLocked
                  ? 'bg-zinc-800 text-zinc-500'
                  : isOrange
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-black'
            }`}
          >
            {isSelected ? withArtistName(votingCopy.voting.lockedFor, artist) : isLocked ? votingCopy.voting.locked : withArtistName(votingCopy.voting.voteButton, artist)}
          </div>
        </div>
      </div>
    </button>
  );
}
