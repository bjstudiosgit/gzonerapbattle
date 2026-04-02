import { battles } from "../data/battles";

export default function LostProperty() {
  const allProps = battles.flatMap(battle => 
    (battle.props || []).map(prop => ({
      ...prop,
      battleTitle: battle.title,
      battleDate: battle.date
    }))
  );

  if (allProps.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-900/30 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display italic uppercase text-white mb-12 flex items-center gap-4">
          <span className="w-8 h-1 bg-brand" />
          Lost Property
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProps.map((prop, index) => (
            <div key={index} className="bg-zinc-950 p-6 rounded-xl border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 text-2xl">
                {prop.icon}
              </div>
              <div>
                <p className="text-white font-bold">{prop.name}</p>
                <p className="text-zinc-400 text-sm">Used by {prop.user} in {prop.battleTitle}</p>
                <p className="text-zinc-500 text-xs mt-1">Date lost: {prop.battleDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
