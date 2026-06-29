import { notFound } from "next/navigation";
import { allMcs } from "../../../data/mcs";
import McDetailClient from "./McDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return allMcs.map((mc) => ({ slug: mc.slug }));
}

export default async function McPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const mc = allMcs.find((candidate) => candidate.slug === resolvedParams.slug);

  if (!mc) {
    notFound();
  }

  return <McDetailClient slug={resolvedParams.slug} />;
}

