import Link from "next/link";
import { Scale, ChevronRight } from "lucide-react";
import { creditPeople } from "../../data/credits";

export const metadata = {
  title: "Hosts & Judges | Lord of the Archives",
  description: "Hosts and judges credited across Lord of the Archives battle pages.",
};

export default function HostsJudgesPage() {
  const hosts = creditPeople.filter((person) => person.role.includes("Host"));
  const judges = creditPeople.filter((person) => person.role.includes("Judge"));

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Credits</p>
          <h1 className="text-4xl md:text-6xl font-display italic uppercase leading-tight">
            Hosts & <span className="text-brand">Judges</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-2xl text-sm md:text-lg leading-relaxed">
            The voices keeping the battles moving, judging the rounds, and giving context to the archive.
          </p>
        </div>

        <CreditSection title="Hosts" people={hosts} />
        <CreditSection title="Judges" people={judges} />
      </div>
    </main>
  );
}

function CreditSection({ title, people }: { title: string; people: typeof creditPeople }) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <Scale className="text-brand" size={20} />
        <h2 className="text-2xl font-display italic uppercase">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {people.map((person) => (
          <Link
            key={person.id}
            href={`/hosts-judges/${person.slug}`}
            className="group block rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-colors hover:border-brand/40"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">{person.role}</p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-display italic uppercase leading-tight group-hover:text-brand">
                {person.name}
              </h3>
              <ChevronRight className="mt-1 shrink-0 text-zinc-600 group-hover:text-brand" size={20} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{person.bio}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
