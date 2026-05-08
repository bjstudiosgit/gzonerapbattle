import { motion } from "motion/react";
import MembersSection from "../components/MembersSection";

export default function MembersPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-white/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <MembersSection />
      </motion.div>
    </div>
  );
}

