import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { MC } from "../data/mcs";

interface MCCardProps {
  mc: MC;
  index?: number;
  key?: string | number;
}

export default function MCCard({ mc, index = 0 }: MCCardProps) {
  const isDebutWinner = mc.tags?.includes("Debut Winner");
  const isGoldStar = mc.tags?.includes("Gold Star");
  const hasSpecialBadge = isDebutWinner || isGoldStar;
  const isLockedUp = mc.isActive === false;
  
  // Determine rarity tier styles
  let borderClass = "border border-white/5";
  let glowClass = "";
  let badgeClass = "bg-zinc-800 text-zinc-300";
  let badgeText = "MC";
  let subText = "Season 1";
  let effectClass = "";

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
      effectClass = "mix-blend-hard-light opacity-80"; // Glitch-like overlay base
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
      className={`group relative aspect-[3/4] rounded-xl overflow-hidden ${borderClass} bg-zinc-950 cursor-pointer ${isLockedUp ? 'opacity-60 grayscale' : ''}`}
    >
      <Link to={`/mc/${mc.slug}`} className="block w-full h-full" aria-label={`View ${mc.name} profile`}>
        
        {/* Inner Glow & Texture */}
        <div className={`absolute inset-0 pointer-events-none z-10 ${glowClass}`} />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none z-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }} />
        
        {/* Edge Sparks (Very Light) */}
        {hasSpecialBadge && (
           <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
             <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           </div>
        )}

        {/* Bodybag Glitch Effect (CSS only approximation) */}
        {mc.debutTier === 'bodybag' && (
          <div className="absolute inset-0 bg-red-900/10 mix-blend-color-burn z-10 pointer-events-none animate-pulse" />
        )}
        {/* Explosive Flame Effect */}
        {mc.debutTier === 'explosive' && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-500/10 to-transparent z-10 pointer-events-none animate-pulse" />
        )}
        {/* Silver Sheen Effect */}
        {mc.debutTier === 'silver' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-300/5 to-transparent z-10 pointer-events-none" />
        )}
        {/* Gold Sheen Effect */}
        {isGoldStar && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/10 to-transparent z-10 pointer-events-none" />
        )}

        {/* Portrait */}
        <img 
          src={mc.image} 
          alt={mc.name} 
          width={400}
          height={533}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ${mc.debutTier === 'bodybag' ? 'contrast-125 brightness-90' : ''}`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('awaiting-photo.png')) return;
            target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 z-10" />

        {/* Corner Icon */}
        <div className="absolute top-3 left-3 z-20 opacity-50 group-hover:opacity-100 transition-opacity">
          <Trophy size={14} className={isGoldStar ? "text-yellow-500" : isDebutWinner ? "text-brand" : "text-zinc-500"} />
        </div>

        {/* Debut Badge (Angled Tag) */}
        {hasSpecialBadge && (
          <div className="absolute top-3 right-3 z-20">
            <div className={`px-3 py-1 transform rotate-3 shadow-lg ${badgeClass}`}>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{badgeText}</span>
                <span className="text-[6px] font-bold uppercase tracking-[0.2em] opacity-80 mt-0.5">{subText}</span>
              </div>
              {/* Metallic shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}

        {/* Locked Up Overlay */}
        {isLockedUp && (
          <>
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-full opacity-50" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18%, #52525b 18%, #52525b 20%)',
              }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <span className="bg-black/80 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10">LOCKED UP</span>
            </div>
          </>
        )}

        {/* Content Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col justify-end">
          <div className="mb-1">
            <h4 className="text-2xl font-display italic uppercase leading-none group-hover:text-brand transition-colors truncate">{mc.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-brand font-bold text-[10px] uppercase tracking-[0.2em]">{mc.wins}W - {mc.losses}L</p>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">{mc.battles} Battles</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
