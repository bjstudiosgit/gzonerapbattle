import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Star } from "lucide-react";
import { MC } from "../data/mcs";
import { soundManager } from "../lib/sounds";
import { portraitImage } from "../lib/images";

interface MCCardProps {
  mc: MC;
  index?: number;
  rank?: number;
  points?: number;
}

export default function MCCard({ mc, index = 0, rank = 0, points = 0 }: MCCardProps) {
  const isDebutWinner = mc.tags?.includes("Debut Winner");
  const isGoldStar = mc.tags?.includes("Gold Star");
  const hasSpecialBadge = isDebutWinner || isGoldStar;
  const isLockedUp = mc.isActive === false;

  const getStars = (winsValue: number) => {
    if (winsValue >= 3) return 5;
    if (winsValue === 2) return 4;
    if (winsValue === 1) return 1;
    return 0;
  };

  const starCount = mc.starCount ?? getStars(mc.wins);

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
  
  // Determine rarity tier styles
  let borderClass = "border border-white/5";
  let glowClass = "";
  let badgeClass = "bg-zinc-800 text-zinc-300";
  let badgeText = "MC";
  let subText = "Season 1";

  if (isGoldStar) {
    badgeText = "GOLD STAR";
    if (isDebutWinner) subText = "DEBUT WINNER S1";
    borderClass = "border-yellow-500/80 border";
    glowClass = "shadow-[inset_0_0_15px_rgba(234,179,8,0.4)]";
    badgeClass = "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black border border-yellow-200/50";
  } else if (isDebutWinner) {
    badgeText = "DEBUT WINNER";
    if (mc.debutTier === 'bodybag') {
      borderClass = "border-orange-700/80 border";
      glowClass = "shadow-[inset_0_0_15px_rgba(194,65,12,0.4)]";
      badgeClass = "bg-gradient-to-r from-orange-800 to-red-900 text-white border border-orange-500/30";
    } else if (mc.debutTier === 'explosive') {
      borderClass = "border-brand/80 border";
      glowClass = "shadow-[inset_0_0_10px_rgba(242,125,38,0.3)]";
      badgeClass = "bg-gradient-to-r from-brand to-orange-500 text-black border border-white/20";
    } else if (mc.debutTier === 'silver') {
      borderClass = "border-zinc-300/80 border";
      glowClass = "shadow-[inset_0_0_12px_rgba(212,212,216,0.3)]";
      badgeClass = "bg-gradient-to-r from-zinc-200 to-zinc-400 text-black border border-white/50";
    } else {
      borderClass = "border-brand/60 border";
      glowClass = "shadow-[inset_0_0_8px_rgba(242,125,38,0.2)]";
      badgeClass = "bg-brand/90 text-black border border-brand/50";
    }
  }

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
      className={`group relative aspect-[3/4] rounded-xl overflow-hidden ${borderClass} bg-zinc-950 cursor-pointer ${isLockedUp ? 'opacity-60 grayscale' : ''}`}
    >
      <Link to={`/mc/${mc.slug}`} onClick={handleClick} className="block w-full h-full" aria-label={`View ${mc.name} profile`}>
        
        {/* Inner Glow & Texture */}
        <div className={`absolute inset-0 pointer-events-none z-10 ${glowClass}`} />
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

        {/* Special Badge - Moved to top-left to avoid faces */}
        {hasSpecialBadge && (
          <div className="absolute top-0 left-0 z-20">
            <div className={`px-3 py-1 shadow-lg ${badgeClass}`}>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{badgeText}</span>
                <span className="text-[6px] font-bold uppercase tracking-[0.2em] opacity-80 mt-0.5">{subText}</span>
              </div>
            </div>
          </div>
        )}

        {/* WANTED Badge for the top-ranked MCs */}
        {rank > 0 && rank <= 2 && !isLockedUp && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="border-4 border-red-600 px-6 py-2 transform -rotate-12 bg-black/40 backdrop-blur-sm">
              <span className="text-red-600 font-display text-4xl md:text-6xl tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">WANTED</span>
            </div>
          </div>
        )}

        {/* GTA-style WASTED badge for inactive MCs */}
        {isLockedUp && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="border-4 border-red-600/50 px-6 py-2 transform rotate-12 bg-black/60 backdrop-blur-md">
              <span className="text-red-600 font-display text-4xl md:text-6xl tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] [text-shadow:2px_2px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]">WASTED</span>
            </div>
          </div>
        )}

        {/* Content Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col justify-end">
          <div className="mb-1">
            {starCount > 0 && !isLockedUp && (
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-brand font-bold text-[10px] tracking-[0.2em]">{mc.wins}W - {mc.losses}L</p>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <p className="text-zinc-400 font-bold text-[10px] tracking-[0.2em]">{mc.battles} Battles</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
