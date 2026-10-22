import { Star } from "lucide-react";
import { guestMcs, mcs } from "../data/mcs";
import MCCard from "../components/MCCard";
import StaffPage from "./StaffPage";
import { StaffCard } from "../components/HostsAndJudges";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";

import { calculateRankings } from "../lib/ranking";
import { seasonOneBattles } from "../data/battles";

export default function MCsPage() {
  const rankings = calculateRankings(seasonOneBattles, mcs);
  
  // Sort active MCs based on their calculated rank
  const activeMcs = mcs
    .filter(mc => mc.isActive !== false)
    .sort((a, b) => {
      const rankA = rankings.find(r => r.id === a.id)?.rank || 999;
      const rankB = rankings.find(r => r.id === b.id)?.rank || 999;
      return rankA - rankB;
    });

  const inactiveMcs = mcs.filter(mc => mc.isActive === false);
  const featuredBattleIds = new Set(["kime", "tricky", "afrodon", "mello"]);
  const battleMcs = activeMcs.filter(mc => mc.battles > 0 || featuredBattleIds.has(mc.id));
  const rosterMcs = [...battleMcs, ...inactiveMcs];
  const otherMcs = activeMcs.filter(mc => mc.battles === 0 && !featuredBattleIds.has(mc.id)).sort((a, b) => (a.id === "mello" ? -1 : b.id === "mello" ? 1 : 0));
  const guestRappers = guestMcs;
  const gingaJay = hosts.find(host => host.id === "ginga-jay");
  const darrenStewart = hosts.find(host => host.id === "darren-stewart");
  const passive = hosts.find(host => host.id === "passive");
  const adrianDash = hosts.find(host => host.id === "adrian-dash");
  const celebrityGuests = judges.filter(person => person.role === "Celebrity Guest");

  const getPoints = (mcId: string) => {
    return rankings.find(r => r.id === mcId)?.totalScore || 0;
  };

  const getRank = (mcId: string) => {
    return rankings.find(r => r.id === mcId)?.rank || 0;
  };

  const getRecord = (mcId: string) => rankings.find(r => r.id === mcId);

  return (
    <div className="pt-32 lg:pt-44 pb-16 lg:pb-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 lg:mb-24 text-center lg:text-left">
          <div className="w-full">
            <div className="flex flex-col items-center lg:items-start gap-3 md:gap-4 lg:gap-6 mb-5 lg:mb-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase text-white tracking-tighter leading-[0.9]">
                Season 1 <span className="text-brand">"Most Wanted"</span>
                <span className="ml-4 inline-flex items-center gap-2 align-middle">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
                  ))}
                </span>
              </h2>
            </div>
            <p className="text-zinc-400 text-sm md:text-lg w-full leading-relaxed tracking-tight font-medium opacity-80">
              From Deeno’s raw power and Roman’s stage presence to Btizz’s humour, Tymeless’s dark bars and AJNA’s fierce delivery,
              Season 1 brings contrasting styles into the same arena. Established names and fresh challengers meet at Peacock Gym,
              where every clash shapes the standings. Meet the MCs, explore their battles, and get to know the hosts, team and guests behind the Gzone.
            </p>
          </div>

        </div>

        {/* Battle rappers, with wasted MCs continuing the same roster */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
            {rosterMcs.map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={index} rank={getRank(mc.id)} points={getPoints(mc.id)} wins={getRecord(mc.id)?.wins ?? mc.wins} losses={getRecord(mc.id)?.losses ?? mc.losses} />
            ))}
            {[...otherMcs, ...guestRappers].map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={rosterMcs.length + index} isRapper />
            ))}
          </div>
        </div>

        <section className="my-20 md:my-28" aria-labelledby="hosted-by-heading">
          <h2 id="hosted-by-heading" className="mb-8 font-display text-4xl uppercase text-white md:text-6xl">Hosted By</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
            {gingaJay && <StaffCard person={{ ...gingaJay, type: "hosts", role: "Hosted By" }} index={0} plainRole />}
            {darrenStewart && <StaffCard person={{ ...darrenStewart, type: "hosts", role: "Co-hosted By" }} index={1} plainRole />}
            {passive && <StaffCard person={{ ...passive, type: "hosts", role: "Co-hosted By" }} index={2} plainRole />}
            {adrianDash && <StaffCard person={{ ...adrianDash, type: "hosts", role: "Co-hosted By" }} index={3} plainRole />}
          </div>
        </section>

        {celebrityGuests.length > 0 && (
          <section className="mb-20 md:mb-28" aria-labelledby="celebrity-guests-heading">
            <h2 id="celebrity-guests-heading" className="mb-8 font-display text-4xl uppercase text-white md:text-6xl">Celebrity Guests</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
              {celebrityGuests.map((person, index) => (
                <StaffCard key={person.id} person={{ ...person, type: "judges" }} index={index} hideRole />
              ))}
            </div>
          </section>
        )}

      </div>
      <StaffPage embedded excludeIds={["ginga-jay", "darren-stewart", "passive", "adrian-dash", ...celebrityGuests.map(person => person.id)]} />
    </div>
  );
}
