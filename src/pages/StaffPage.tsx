import HostsAndJudges from "../components/HostsAndJudges";
import { motion } from "motion/react";

export default function StaffPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 min-h-screen bg-black"
    >
      <HostsAndJudges />
    </motion.div>
  );
}
