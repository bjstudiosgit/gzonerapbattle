import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale } from "lucide-react";
import { creditPeople } from "../../../data/credits";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return creditPeople.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const person = creditPeople.find((candidate) => candidate.slug === resolvedParams.slug);

  return {
    title: person ? `${person.name} | Hosts & Judges` : "Host or Judge | Lord of the Archives",
    description: person?.bio,
  };
}

export default async function HostJudgeDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const person = creditPeople.find((candidate) => candidate.slug === resolvedParams.slug);

  if (!person) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/hosts-judges"
          className="mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-brand"
        >
          <ArrowLeft size={16} /> Back to Hosts & Judges
        </Link>

        <section className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8 md:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-black">
              <Scale size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">{person.role}</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-display italic uppercase leading-none">
            {person.name}
          </h1>

          <div className="mt-10 border-l-2 border-brand/70 pl-6">
            <h2 className="mb-3 text-xl font-display italic uppercase">Bio</h2>
            <p className="text-lg leading-relaxed text-zinc-300">{person.bio}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
