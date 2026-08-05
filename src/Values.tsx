import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Code, Cpu, Target } from "lucide-react";

export default function Values() {
  const scrollingText = "WEBSITES. AI SYSTEMS. CONTENT. BUILT FAST. BUILT PROPER.";

  const values = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "UX Driven Philosophy",
      desc: "No Thinking Required. If your users have to figure it out, it's already broken. We build interfaces that feel like intuition."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Built by a Developer",
      desc: "You're working directly with the logic. No handoffs. No delays. No 'lost in translation' between design and code."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Early Adopter DNA",
      desc: "We don't wait for 'best practices' to become old news. We integrate AI and emerging tech into everything we ship."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Lean by Design",
      desc: "Agencies charge for layers of people and fancy offices. We charge for results and world-class digital leverage."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[150px] -z-10" />

      <div className="p-6 md:p-12 pt-24 md:pt-32 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-20 md:mb-24">
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-none">Studio <br /><span className="text-brand-orange">Values</span></h2>
          <div className="h-[1px] flex-grow bg-brand-orange/20 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 10 }}
              className="p-8 md:p-12 border border-white/5 rounded-3xl bg-zinc-900/30 backdrop-blur-sm hover:border-brand-orange/30 transition-all duration-300 group cursor-default"
            >
              <div className="text-brand-orange mb-8 group-hover:scale-110 transition-transform origin-left">{v.icon}</div>
              <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 group-hover:text-brand-orange transition-colors">{v.title}</h3>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Section */}
        <div className="mt-32 p-12 md:p-20 border border-brand-orange/20 rounded-[3rem] bg-brand-orange/5 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 relative z-10">Think we're a <span className="text-brand-orange italic">fit</span>?</h3>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-4 px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-widest hover:scale-105 transition-all relative z-10"
          >
            Start the conversation <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Scrolling Text Section */}
        <div className="mt-32 relative py-12 border-y border-brand-orange/10 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-12"
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter opacity-10 text-brand-orange">
                {scrollingText}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

