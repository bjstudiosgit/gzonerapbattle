import { motion } from "motion/react";
import Merch from "../components/Merch";

export default function MerchPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <Merch />
    </motion.div>
  );
}
