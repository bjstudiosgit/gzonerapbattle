import { Battle } from "../data/battles";

export const sortBattlesById = (battles: Battle[]): Battle[] => {
  return [...battles].sort((a, b) => Number(a.id) - Number(b.id));
};

type ParsedEpisode = {
  season: number;
  episode: number;
  suffix: string;
};

const parseEpisode = (value: string | undefined): ParsedEpisode | null => {
  if (!value) return null;
  const match = value.trim().match(/^(\d+)\s*x\s*(\d+)([a-z])?$/i);
  if (!match) return null;

  return {
    season: Number(match[1]),
    episode: Number(match[2]),
    suffix: (match[3] || "").toLowerCase(),
  };
};

export const sortBattlesByEpisodeDesc = (battles: Battle[]): Battle[] => {
  return [...battles].sort((a, b) => {
    const ea = parseEpisode(a.episode);
    const eb = parseEpisode(b.episode);

    if (ea && eb) {
      if (ea.season !== eb.season) return eb.season - ea.season;
      if (ea.episode !== eb.episode) return eb.episode - ea.episode;
      if (ea.suffix !== eb.suffix) return eb.suffix.localeCompare(ea.suffix);
      return Number(a.id) - Number(b.id);
    }

    if (ea && !eb) return -1;
    if (!ea && eb) return 1;
    return Number(a.id) - Number(b.id);
  });
};

export const parseViews = (viewStr: string | undefined): number => {
  if (!viewStr) return 0;
  const clean = viewStr.replace(/,/g, "").toUpperCase();
  if (clean.endsWith("K")) {
    return parseFloat(clean.replace("K", "")) * 1000;
  }
  if (clean.endsWith("M")) {
    return parseFloat(clean.replace("M", "")) * 1000000;
  }
  return parseInt(clean) || 0;
};

export const calculateTotalViews = (battles: Battle[]): string => {
  const totalViewsNum = battles.reduce((acc, b) => acc + parseViews(b.views), 0);
  return totalViewsNum >= 1000 
    ? (totalViewsNum / 1000).toFixed(1) + "K" 
    : totalViewsNum.toString();
};
