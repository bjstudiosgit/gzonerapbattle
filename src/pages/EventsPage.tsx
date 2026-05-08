import { motion } from "motion/react";
import Events from "../components/Events";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EventsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === "#members") {
      navigate("/members", { replace: true });
    }
  }, [location.hash, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 min-h-screen"
    >
      <Events />
    </motion.div>
  );
}
