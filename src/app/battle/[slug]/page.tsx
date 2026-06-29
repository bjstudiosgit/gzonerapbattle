import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  findBattleByRouteSlug,
  getBattleHref,
  getBattlePageSlug,
  getBattleLegacyPageStem,
  getBattlePageStem,
  pengameBattles,
} from "../../../data/pengameBattles";
import { gzoneBattles } from "../../../data/gzone";
import { allMcs } from "../../../data/mcs";
import BattleDetailClient from "./BattleDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const routeSlugs = new Set<string>();

  [...pengameBattles, ...gzoneBattles].forEach((battle) => {
    routeSlugs.add(getBattlePageStem(battle));
    routeSlugs.add(getBattleLegacyPageStem(battle));
    routeSlugs.add(battle.slug);

    if (process.env.NODE_ENV !== "production") {
      routeSlugs.add(getBattlePageSlug(battle));
      routeSlugs.add(`${getBattleLegacyPageStem(battle)}.html`);
    }
  });

  return [...routeSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const battle = findBattleByRouteSlug(resolvedParams.slug, [...pengameBattles, ...gzoneBattles]);
  
  if (!battle) {
    return { title: 'Battle Not Found' };
  }
  
  const mc1 = allMcs.find(m => m.id === battle.mc1);
  const mc2 = allMcs.find(m => m.id === battle.mc2);
  const mc3 = battle.mc3 ? allMcs.find(m => m.id === battle.mc3) : undefined;
  const mc4 = battle.mc4 ? allMcs.find(m => m.id === battle.mc4) : undefined;
  
  const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return "";
    const embedMatch = url.match(/embed\/([^?]+)/);
    if (embedMatch) return embedMatch[1];
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    return shortMatch ? shortMatch[1] : "";
  };
  
  const videoId = getYouTubeId(battle.videoUrl);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : `https://picsum.photos/seed/${battle.id}/1280/720`;
  
  const team1Name = [mc1?.name ?? battle.mc1, mc3?.name].filter(Boolean).join(" & ");
  const team2Name = [mc2?.name ?? battle.mc2, mc4?.name].filter(Boolean).join(" & ");
  const leagueName = battle.theme === "gzone" ? "Gzone" : "PenGame";
  const title = `${team1Name} vs ${team2Name} | ${leagueName}`;
  const description = `${team1Name} faces ${team2Name} in this ${leagueName} battle.`;
  const battleUrl = `https://www.lordofthearchives.co.uk${getBattleHref(battle)}`;

  return {
    title,
    description,
    alternates: {
      canonical: battleUrl,
    },
    openGraph: {
      title,
      description,
      url: battleUrl,
      type: 'video.other',
      images: [
        {
          url: thumbnailUrl,
          width: 1280,
          height: 720,
          alt: `${title} Thumbnail`,
        },
      ],
    },
  };
}

export default async function BattlePage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const battle = findBattleByRouteSlug(resolvedParams.slug, [...pengameBattles, ...gzoneBattles]);
  
  if (!battle) {
    notFound();
  }

  return <BattleDetailClient slug={battle.slug} />;
}
