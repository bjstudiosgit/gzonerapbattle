import { Battle } from "../data/battles";

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
