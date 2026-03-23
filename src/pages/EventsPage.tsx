import { motion } from "motion/react";
import Events from "../components/Events";

export default function EventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <Events />
    </motion.div>
  );
}
