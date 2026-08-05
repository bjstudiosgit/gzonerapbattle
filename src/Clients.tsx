import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { History, ExternalLink, Archive } from "lucide-react";

export default function Clients() {
  const currentWork = [
    {
      name: "G-Zone Rap Battle",
      tagline: "Where we don't play!",
      url: "https://www.gzonerapbattle.co.uk",
      description: "Scaling the UK's most unfiltered battle rap league with a high-performance digital infrastructure. From 'The Pit' to the world, the G-Zone PWA delivers real-time scores, official standings, and professional event ticketing to thousands of fans.",
      stats: [
        { label: "Views", value: "182.1K+" },
        { label: "Subs", value: "11.5K+" },
        { label: "Pro MCs", value: "18+" }
      ],
      tech: ["React 19", "Supabase", "PWA", "Real-time Data", "Official Standings Architecture"],
      thumbnail: "/gzone_pwa_mockup_1775508666537.png"
    }
  ];

  const legacyWork = [
    {
      name: "Bradley Solutions",
      year: "2007",
      url: "https://www.bradleysolutions.co.uk",
      description: "PC Repairs, Website Design, Hosting, and SEO. The foundation of BJS Studio's technical offering.",
      tech: ["PHP", "MySQL", "cPanel", "Hardware Repairs"],
      thumbnail: "https://images.unsplash.com/photo-1588702547919-26089e690eca?w=800&q=80"
    },
    {
      name: "T&T Skin Art",
      year: "2007",
      url: "https://www.tntskinart.co.uk",
      description: "Tattoo shop in Ashton-under-Lyne. A classic HTML/CSS frames-based website reflecting the aesthetic of the time.",
      tech: ["HTML Frames", "CSS", "Photoshop 7.0"],
      thumbnail: "https://images.unsplash.com/photo-1598136490941-30d885318abd?w=800&q=80"
    },
    {
      name: "Waxys Wash and Wax",
      year: "2009",
      url: "https://www.waxys.co.uk",
      description: "Mobile valet company in Oldham. Clean, functional, and fast—built for local business traction.",
      tech: ["HTML", "CSS Frames", "FTP Hosting"],
      thumbnail: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[150px] -z-10" />

      <div className="p-6 md:p-12 pt-24 md:pt-32 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-16">
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-none">Work Portfolio</h2>
          <div className="h-[1px] flex-grow bg-brand-orange/20 hidden md:block" />
        </div>

        {/* Current Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {currentWork.map((client, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="group relative border border-white/5 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md overflow-hidden hover:border-brand-orange/40 hover:shadow-[0_0_50px_rgba(255,99,33,0.15)] transition-all duration-500 cursor-pointer flex flex-col h-full"
              onClick={() => client.url !== "#" && window.open(client.url, '_blank')}
            >
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <img 
                  src={client.thumbnail} 
                  alt={client.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-brand-orange text-black font-bold uppercase tracking-widest text-[10px] rounded-full">Active Launch</div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <div className="flex flex-col mb-4">
                  <span className="text-brand-orange font-bold uppercase tracking-[0.3em] text-[10px] mb-2">{client.tagline}</span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight group-hover:text-brand-orange transition-colors">
                      {client.name}
                    </h3>
                    <div className="w-12 h-12 rounded-full border border-brand-orange/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all">
                      <ExternalLink className="w-5 h-5 text-brand-orange group-hover:text-black" />
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-xl leading-relaxed mb-8">
                  {client.description}
                </p>

                {client.stats && (
                  <div className="flex gap-8 mb-10 border-y border-white/5 py-6">
                    {client.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-2xl font-display font-bold text-white tracking-tight">{stat.value}</span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {client.tech.map((t, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-lg bg-zinc-800 text-gray-400 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legacy Archive Section */}
        <div className="mt-40 mb-16">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-12">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase leading-none opacity-40">The Archives</h2>
            <div className="h-[1px] flex-grow bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-xs font-bold px-4 py-2 border border-white/10 rounded-full">
              <Archive className="w-3 h-3" /> Legacy Work
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legacyWork.map((client, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 border border-white/5 rounded-3xl bg-zinc-950 hover:bg-zinc-900/50 hover:border-brand-orange/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-brand-orange opacity-40" />
                    <span className="text-brand-orange font-display font-bold text-lg">{client.year}</span>
                  </div>
                  <div className="px-3 py-1 border border-white/5 bg-zinc-900 rounded text-[9px] uppercase tracking-widest text-gray-500">Historical</div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-4 tracking-tight group-hover:text-brand-orange transition-colors">
                  {client.name}
                </h3>
                
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  {client.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {client.tech.map((t, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-widest text-gray-600">
                      {t} {i !== client.tech.length - 1 && "•"}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-32 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-8 text-gray-500 hover:text-brand-orange transition-colors uppercase tracking-[0.4em] text-xs font-bold group"
          >
            <div className="w-16 h-[1px] bg-gray-500 group-hover:bg-brand-orange transition-all group-hover:w-24" />
            Back to Home
            <div className="w-16 h-[1px] bg-gray-500 group-hover:bg-brand-orange transition-all group-hover:w-24" />
          </Link>
        </div>
      </div>
    </div>
  );
}


