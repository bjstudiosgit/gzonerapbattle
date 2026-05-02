import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { battles } from "../data/battles";

export default function LostPropertyPreview() {
  const allProps = battles
    .flatMap((battle) =>
      (battle.props || []).map((prop) => ({
        ...prop,
        battleTitle: battle.title,
        battleDate: battle.date,
      }))
    );
  const featuredProps = allProps.slice(-8).reverse();

  if (featuredProps.length === 0) return null;

  return (
    <section className="relative z-10 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <h3 className="text-4xl md:text-6xl font-display uppercase leading-none text-white mb-6">
              Lost <span className="text-brand">Property</span>
            </h3>
            <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-xl mb-8">
              A number of lost property items remain at the gym, including props, paperwork, and screenshots, and are ready for collection. Please note: Due to overwhelming demand, Badee's panties have already been returned to their rightful owner.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mb-8">
              <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="text-3xl font-display text-white">{allProps.length}</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-black">Items left behind</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="text-3xl font-display text-brand">S1</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-black">Most Wanted</div>
              </div>
            </div>
            <Link
              to="/lost-property"
              className="inline-flex items-center gap-3 bg-brand text-black px-6 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors"
            >
              View Lost Property
              <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            <div className="grid sm:grid-cols-2 gap-3">
              {featuredProps.map((prop) => (
                <Link
                  key={`${prop.battleTitle}-${prop.name}-${prop.user}`}
                  to="/lost-property"
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-950/70 p-4 min-h-[92px] transition-colors hover:border-brand/40 hover:bg-zinc-900/80"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 text-2xl shrink-0">
                    {prop.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-black truncate group-hover:text-brand transition-colors">{prop.name}</p>
                    <p className="text-zinc-400 text-sm truncate">Used by {prop.user}</p>
                    <p className="text-zinc-600 text-xs truncate">in {prop.battleTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
