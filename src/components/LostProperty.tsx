import { battles } from "../data/battles";

export default function LostProperty() {
  // Collect all props
  const allProps: any[] = [];

  battles.forEach(battle => {
    if (battle.props && battle.props.length > 0) {
      battle.props.forEach(prop => {
        allProps.push({
          ...prop,
          battleTitle: battle.title,
          battleDate: battle.date
        });
      });
    }
  });

  if (allProps.length === 0) return null;

  return (
    <section className="py-16 pt-32 bg-zinc-900/30 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display italic uppercase text-white mb-12">
          Lost Property
        </h2>
        
        <div className="mb-12">
          <h3 className="text-2xl font-display italic uppercase text-brand mb-6">Season 1 "Most Wanted"</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {allProps.map((prop, index) => (
              <div key={index} className="bg-zinc-950 p-6 rounded-xl border border-white/10 flex items-start gap-4 h-full">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 text-2xl shrink-0">
                  {prop.icon}
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-white font-bold truncate">{prop.name}</p>
                  <p className="text-zinc-400 text-sm truncate">Used by {prop.user} in {prop.battleTitle}</p>
                  <p className="text-zinc-500 text-xs mt-1">Date: {prop.battleDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
