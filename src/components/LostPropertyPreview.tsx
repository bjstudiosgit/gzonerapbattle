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
              Gzone <span className="text-brand">Museum</span>
            </h3>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-medium max-w-xl mb-8">
              A number of lost property items remain at the gym, including props, paperwork, and screenshots, and are ready for collection. Any uncollected items (where legal) will be raffled off at the end of Season 1.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mb-8">
              <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="text-3xl font-display text-white">{allProps.length}</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-black">Items left behind</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="text-3xl font-display text-brand">Season 1</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-black">Most Wanted</div>
              </div>
            </div>
            <Link
              to="/lost-property"
              className="hidden lg:inline-flex max-w-sm items-center justify-between gap-3 bg-brand text-black px-6 py-4 rounded-xl font-black text-left text-xs sm:text-sm leading-snug hover:bg-white transition-colors"
            >
              Visit the museum
              <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
              {featuredProps.map((prop, index) => (
                <Link
                  key={`${prop.battleTitle}-${prop.name}-${prop.user}`}
                  to="/lost-property"
                  className={`${index >= 6 ? "hidden sm:flex" : "flex"} group items-center justify-center sm:justify-start gap-3 sm:gap-4 rounded-lg sm:rounded-xl border border-white/10 bg-zinc-950/70 p-2 sm:p-4 min-h-[60px] sm:min-h-[92px] transition-colors hover:border-brand/40 hover:bg-zinc-900/80`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 text-xl sm:text-2xl shrink-0">
                    {prop.icon}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-sm sm:text-base leading-tight text-white font-black truncate group-hover:text-brand transition-colors">{prop.name}</p>
                    <p className="hidden sm:block text-zinc-400 text-sm leading-tight mt-1 truncate">Used by {prop.user}</p>
                    <p className="hidden sm:block text-zinc-600 text-xs leading-tight truncate">in {prop.battleTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/lost-property"
              className="mt-6 inline-flex lg:hidden w-full items-center justify-between gap-3 bg-brand text-black px-6 py-4 rounded-xl font-black text-left text-sm leading-snug hover:bg-white transition-colors"
            >
              Visit the museum
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
