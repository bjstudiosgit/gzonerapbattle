import { Star } from "lucide-react";
import { seasonOneBattles } from "../data/battles";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { guestMcs, mcs } from "../data/mcs";
import { calculateRankings } from "../lib/ranking";
import MCCarousel, { type CarouselItem } from "./MCCarousel";

export default function MCBios() {
  const rankings = calculateRankings(seasonOneBattles, mcs);
  const rankedIds = new Set(rankings.map((ranking) => ranking.id));

  const rankedMcs: CarouselItem[] = rankings.flatMap((ranking) => {
    const mc = mcs.find((item) => item.id === ranking.id) ?? guestMcs.find((item) => item.id === ranking.id);
    return mc ? [{
      type: "mc" as const,
      mc,
      rank: ranking.rank,
      points: ranking.totalScore,
    }] : [];
  });

  const otherRappers: CarouselItem[] = [...mcs, ...guestMcs]
    .filter((mc) => mc.isActive !== false && !rankedIds.has(mc.id))
    .map((mc) => ({
      type: "mc" as const,
      mc,
      rank: 0,
      points: 0,
    }));

  const items: CarouselItem[] = [
    ...rankedMcs,
    ...otherRappers,
    ...judges.map((judge) => ({
      type: "staff" as const,
      id: judge.id,
      name: judge.name,
      role: judge.role,
      nickname: judge.nickname,
      image: judge.image,
      listImage: undefined,
      bio: judge.bio,
      profileType: "judge" as const,
      isMystery: judge.isMystery,
    })),
    ...hosts.map((host) => ({
      type: "staff" as const,
      id: host.id,
      name: host.name,
      role: host.role,
      nickname: host.nickname,
      image: host.image,
      listImage: host.listImage,
      bio: host.bio,
      profileType: "host" as const,
      isMystery: undefined,
    })),
  ];

  return (
    <section id="mcs" className="py-24 md:py-32 relative scroll-mt-24 overflow-hidden">
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display uppercase leading-none">
            Gzone <span className="text-brand">&quot;Most Wanted&quot;</span> Season One
          </h3>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
            ))}
          </div>
        </div>

        <MCCarousel items={items} />
      </div>
    </section>
  );
}
