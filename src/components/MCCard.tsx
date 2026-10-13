import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Star } from "lucide-react";
import { MC } from "../data/mcs";
import { soundManager } from "../lib/sounds";
import { portraitImage } from "../lib/images";
import { getRankStars } from "../lib/ranking";

interface MCCardProps {
  mc: MC;
  index?: number;
  rank?: number;
  points?: number;
  isRapper?: boolean;
}

export default function MCCard({ mc, index = 0, rank = 0, points = 0, isRapper = false }: MCCardProps) {
  const isWasted = mc.isActive === false;

  const starCount = getRankStars(rank);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleClick = () => {
    soundManager.playImpact();
  };

  const handleHover = () => {
    soundManager.playHover();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleHover}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-zinc-950 cursor-pointer ${isWasted ? 'grayscale' : ''}`}
    >
      <Link to={`/${mc.slug}`} onClick={handleClick} className="block w-full h-full" aria-label={`View ${mc.name} profile`}>
        
        {/* Texture */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none z-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }} />
        
        {/* Portrait */}
        <motion.img 
          src={portraitImage(mc.image, "card")} 
          alt={mc.name} 
          width={400}
          height={533}
          loading="lazy"
          className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ${mc.debutTier === 'bodybag' ? 'contrast-125 brightness-90' : ''}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('awaiting-photo.png')) return;
            target.src = `https://picsum.photos/seed/${mc.id}/400/533`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 z-10" />

        {/* MOST WANTED badge for the top-ranked MCs */}
        {rank > 0 && rank <= 3 && !isWasted && (
          <div className="absolute top-1/2 left-1/2 z-30 w-max -translate-x-1/2 -translate-y-1/2 scale-[0.58] pointer-events-none md:scale-75">
            <div className="transform -rotate-12 border-4 border-red-600 bg-black/40 px-5 py-2 backdrop-blur-sm">
              <span className="whitespace-nowrap font-display text-4xl uppercase tracking-[-0.06em] text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] md:text-6xl">
                MOST WANTED
              </span>
            </div>
          </div>
        )}

        {/* GTA-style WASTED badge for inactive MCs */}
        {isWasted && (
          <div className="absolute top-1/2 left-1/2 z-30 w-max -translate-x-1/2 -translate-y-1/2 scale-[0.58] pointer-events-none md:scale-75">
            <div className="transform -rotate-12 border-y-4 border-white/80 px-8 py-2">
              <span className="whitespace-nowrap font-display text-4xl uppercase tracking-[-0.06em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] md:text-6xl">WASTED</span>
            </div>
          </div>
        )}

        {/* Content Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col justify-end">
          <div className="mb-1">
            {starCount > 0 && !isWasted && (
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} size={10} className="text-yellow-500 fill-yellow-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            )}
            <h4 className="text-2xl font-display uppercase leading-none group-hover:text-brand transition-colors truncate">
              {rank > 0 && <span className="text-zinc-600 mr-2">#{rank}</span>}
              {mc.name}
            </h4>
            {isRapper ? (
              <p className="mt-1 text-brand font-bold text-[10px] uppercase tracking-[0.2em]">Rapper</p>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-brand font-bold text-[10px] tracking-[0.2em]">{mc.wins}W - {mc.losses}L</p>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <p className="text-zinc-400 font-bold text-[10px] tracking-[0.2em]">{mc.battles} Battles</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
