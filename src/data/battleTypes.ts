type NullableString = string | null;

export interface Battle {
  id: string;
  slug: string;
  mc1: string;
  mc2: string;
  mc3?: string;
  mc4?: string;
  title: string;
  displayTitle?: NullableString;
  date?: string;
  videoUrl?: NullableString;
  views?: string | number | null;
  winner?: string;
  winner2?: string;
  isUnreleased?: boolean;
  theme: string;
  season: number | string;
  competition?: NullableString;
  subGroup?: NullableString;
  stage?: NullableString;
  group?: NullableString;
  tag?: NullableString;
  customEp?: string;
  seasonOrder?: number;
  statusNote?: string;
  host?: string;
  judges?: string[];
  clashSummary?: string;
  performanceAnalysis?: {
    performer: string;
    overview: string;
    lyricalThemes: string;
    keyTechnicalHighlights: {
      title: string;
      description: string;
    }[];
  }[];
  notableBars?: {
    performer?: string;
    theme?: string;
    bar: string;
    explanation?: string;
  }[];
  oddMoments?: string[];
  coolMoments?: string[];
  postBattleContext?: string;
  judgementSummary?: {
    verdict: string;
    summary: string;
  };
}
