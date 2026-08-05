import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX, Cpu, Globe, Rocket, Shield, ArrowRight, Zap, Code, Layout, Sparkles } from "lucide-react";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const featuredProjects = [
    {
      name: "G-Zone Rap Battle",
      tag: "PWA & Real-time",
      desc: "The rawest UK battle rap league platform.",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      link: "/clients"
    },
    {
      name: "Bradley Solutions",
      tag: "Legacy Archive (2007)",
      desc: "The foundation of BJS Studio's technical offering.",
      image: "https://images.unsplash.com/photo-1588702547919-26089e690eca?w=800&q=80",
      link: "/clients"
    }
  ];

  return (
    <main className="bg-black text-white selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255, 99, 33, 0.15) 0%, #000000 70%)",
              "radial-gradient(circle at 55% 45%, rgba(255, 99, 33, 0.25) 0%, #000000 70%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 99, 33, 0.15) 0%, #000000 70%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="absolute inset-0 w-full h-full z-10">
          <video 
            ref={videoRef}
            autoPlay 
            muted
            loop
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5]"
          >
            <source src="/bjstudiohero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
        </div>

        <button 
          onClick={toggleMute}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-brand-orange transition-all duration-300 group"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>

        <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-7xl md:text-[10rem] font-display font-bold tracking-tighter leading-none mb-4">
              <span className="text-white">BJS</span>
              <span className="text-brand-orange">tudio</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-400 uppercase tracking-[0.4em] font-sans">A Technology Company</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-8"
          >
            <Link to="/contact" className="group px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              Start a Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/clients" className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              View Work
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-orange/0 via-brand-orange to-brand-orange/0" />
        </motion.div>
      </section>

      {/* Philosophy Brief */}
      <section className="py-24 md:py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
               <span className="absolute -top-12 -left-4 text-[12rem] font-serif opacity-[0.03] text-brand-orange select-none italic">“</span>
               <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-8">
                We build for the <span className="text-brand-orange italic">next wave</span> of the web.
               </h2>
               <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
                Most agencies move at the speed of meetings. We move at the speed of code. BJStudio is a high-performance output shop built on 30 years of Manchester grit and technical evolution.
               </p>
               <Link to="/values" className="inline-flex items-center gap-3 text-brand-orange font-bold uppercase tracking-widest text-sm hover:underline">
                Our Values <ArrowRight className="w-4 h-4" />
               </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <Zap className="w-6 h-6" />, title: "Rapid Ship", desc: "Weeks, not months." },
                { icon: <Cpu className="w-6 h-6" />, title: "AI Native", desc: "Integrated intelligence." },
                { icon: <Layout className="w-6 h-6" />, title: "UX Focused", desc: "Zero friction design." },
                { icon: <Code className="w-6 h-6" />, title: "Lean Teams", desc: "Direct dev access." }
              ].map((item, i) => (
                <div key={i} className="p-8 border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-2xl">
                  <div className="text-brand-orange mb-4">{item.icon}</div>
                  <h4 className="font-bold mb-2 uppercase tracking-widest text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Teaser */}
      <section className="py-32 md:py-48 px-6 relative overflow-hidden bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-brand-orange font-bold uppercase tracking-[0.3em] text-xs mb-8">Established 1986</p>
          <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-12">30+ Years of <span className="text-brand-orange italic">Technical Evolution</span></h2>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-2xl mx-auto">
            From 8-bit copy-pasting to building high-leverage AI systems. Explore the journey that built BJS Studio.
          </p>
          <Link to="/journey" className="inline-flex items-center gap-6 px-10 py-5 border border-white/10 rounded-full hover:bg-brand-orange hover:border-brand-orange hover:text-black transition-all group">
            <span className="font-bold uppercase tracking-widest">See Full Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Featured Work Grid */}
      <section className="py-24 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-[0.3em] text-xs mb-4">Portfolio</p>
              <h2 className="text-5xl md:text-7xl font-display font-bold">Featured Work</h2>
            </div>
            <Link to="/clients" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={project.link}>
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl mb-6 relative">
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-x-6 bottom-6 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-brand-orange font-bold uppercase tracking-widest text-[10px] mb-1">{project.tag}</p>
                      <h3 className="text-2xl font-display font-bold text-white">{project.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-40 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter">Capabilities</h2>
            <p className="text-xl text-gray-400">Everything you need to dominate your niche, from high-performance web systems to cutting-edge AI integration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="w-10 h-10" />, title: "Web Apps", items: ["React / Next.js", "PWA Development", "3D Experiences", "E-commerce"] },
              { icon: <Sparkles className="w-10 h-10" />, title: "AI Systems", items: ["Custom LLMs", "Automation", "Data Processing", "Voice AI"] },
              { icon: <Rocket className="w-10 h-10" />, title: "Strategy", items: ["Tech Audits", "Brand Identity", "UX Strategy", "Scaling Ops"] },
              { icon: <Shield className="w-10 h-10" />, title: "Performance", items: ["SEO Mastery", "Speed Optimization", "Security Audits", "Hosting"] }
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 border border-white/5 bg-zinc-900/50 rounded-3xl hover:border-brand-orange/50 transition-all"
              >
                <div className="text-brand-orange mb-8">{service.icon}</div>
                <h3 className="text-2xl font-display font-bold mb-6">{service.title}</h3>
                <ul className="space-y-4">
                  {service.items.map((item, j) => (
                    <li key={j} className="text-gray-500 text-sm flex items-center gap-2">
                      <div className="w-1 h-1 bg-brand-orange rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-brand-orange">
        <div className="absolute inset-0 z-0 opacity-20 grain" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-[8rem] font-display font-bold text-black tracking-tighter leading-none mb-12 uppercase">
            Ready to <span className="text-white">Build</span>?
          </h2>
          <Link to="/contact" className="inline-flex px-12 py-6 bg-black text-white font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all text-xl">
            Secure Your Slot
          </Link>
          <p className="mt-8 text-black/60 font-bold uppercase tracking-widest text-sm">Strictly limited client capacity.</p>
        </div>
      </section>
      
      {/* Reusing grain for consistency */}
      <div className="fixed inset-0 pointer-events-none z-[100] grain opacity-[0.03]" />
    </main>
  );
}

