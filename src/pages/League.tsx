import { motion } from "motion/react";
import LeagueTable from "../components/LeagueTable";

export default function League() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Official Rankings</h1>
          <h2 className="text-6xl font-display italic uppercase">The G Zone <span className="text-brand">League</span></h2>
          <p className="text-zinc-400 mt-4 max-w-2xl">
            The definitive leaderboard for the G Zone Rap Battle League. Rankings are calculated based on performance, battle activity, and crowd impact.
          </p>
        </div>
        
        <LeagueTable showTitle={false} />
      </div>
    </motion.div>
  );
}
