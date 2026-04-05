import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { mcs } from '../data/mcs';
import { motion, AnimatePresence } from 'motion/react';
import { User, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GZoneMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const navigate = useNavigate();

  // Group MCs by location
  const mcsByLocation = mcs.reduce((acc, mc) => {
    if (mc.coordinates && mc.location) {
      if (!acc[mc.location]) {
        acc[mc.location] = {
          coordinates: mc.coordinates,
          mcs: []
        };
      }
      acc[mc.location].mcs.push(mc);
    }
    return acc;
  }, {} as Record<string, { coordinates: [number, number], mcs: typeof mcs }>);

  const selectedMCs = selectedLocation ? mcsByLocation[selectedLocation]?.mcs || [] : [];

  const getMarkerPosition = (coords: [number, number]) => {
    const [lat, lon] = coords;
    const minLon = -10.2;
    const maxLon = 2.8;
    const minLat = 49.0;
    const maxLat = 61.2;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { 
      left: `${Math.max(1, Math.min(99, x))}%`, 
      top: `${Math.max(1, Math.min(99, y))}%` 
    };
  };

  const handleMarkerClick = (location: string) => {
    const locationMcs = mcsByLocation[location].mcs;
    if (locationMcs.length === 1) {
      navigate(`/mc/${locationMcs[0].slug}`);
    } else {
      setSelectedLocation(location);
    }
  };

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-display italic uppercase leading-[0.8] mb-6"
          >
            The <span className="text-brand">G-Zone</span> Network
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 max-w-2xl mx-auto uppercase tracking-widest text-[10px] md:text-sm font-black opacity-60"
          >
            Showcasing and supporting UK talent nationwide. Target a sector to access roster intelligence.
          </motion.p>
        </div>

        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] md:aspect-video flex items-center justify-center group/map shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 bg-black/40 backdrop-blur-md">
           {/* Tactical Grid Background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
                   backgroundSize: '40px 40px' 
                 }} 
            />

            <TransformWrapper
              initialScale={1.0}
              minScale={0.5}
              maxScale={8}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                    <button onClick={() => zoomIn()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <ZoomIn className="w-5 h-5 group-hover/zoom:scale-110 transition-transform" />
                    </button>
                    <button onClick={() => zoomOut()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <ZoomOut className="w-5 h-5 group-hover/zoom:scale-110 transition-transform" />
                    </button>
                    <button onClick={() => resetTransform()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <RotateCcw className="w-5 h-5 group-hover/zoom:rotate-[-45deg] transition-transform" />
                    </button>
                  </div>

                  <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <div className="relative inline-block">
                        <img 
                          src="/gzonemap.png" 
                          alt="GZone UK Map" 
                          className="h-[600px] md:h-[800px] w-auto select-none pointer-events-none opacity-90 grayscale contrast-[1.1] brightness-[0.7] drop-shadow-[0_0_50px_rgba(242,125,38,0.15)]"
                          referrerPolicy="no-referrer"
                        />
                        
                        {Object.entries(mcsByLocation).map(([location, data]) => {
                          const pos = getMarkerPosition(data.coordinates);
                          const isSelected = selectedLocation === location;
                          
                          return (
                            <div 
                              key={location}
                              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                              style={pos}
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.3 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkerClick(location);
                                }}
                                className="cursor-pointer relative group/pin"
                              >
                                <div className={`
                                  w-7 h-7 rounded-full border-2 border-white/90 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-500 flex items-center justify-center
                                  ${isSelected ? 'bg-brand scale-125 ring-8 ring-brand/30' : 'bg-zinc-900'}
                                `}>
                                  <div className={`w-1.5 h-1.5 rounded-full bg-white ${isSelected ? 'scale-150' : 'animate-pulse bg-brand'}`} />
                                </div>
                                
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none z-20 shadow-2xl">
                                  <div className="font-black uppercase tracking-widest text-brand mb-0.5">{location}</div>
                                  <div className="text-[9px] text-zinc-400 font-black flex items-center gap-2">
                                    <User size={12} className="text-brand/40" />
                                    {data.mcs.length} MC{data.mcs.length > 1 ? 's' : ''} 
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>

            {/* Selection Overlay */}
            <AnimatePresence>
              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="absolute bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-96 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 z-30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-display italic uppercase text-white tracking-tight leading-none mb-1">{selectedLocation}</h3>
                      <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest opacity-60">Regional Representatives</p>
                    </div>
                    <button 
                      onClick={() => setSelectedLocation(null)} 
                      className="p-3 bg-white/5 hover:bg-brand hover:text-black rounded-full transition-all duration-300"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-3">
                    {selectedMCs.map(mc => (
                      <Link 
                        key={mc.id}
                        to={`/mc/${mc.slug}`}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-brand/40 transition-all duration-500 group"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                          <img 
                            src={mc.image} 
                            alt={mc.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${mc.id}/200/200`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-display italic text-white uppercase tracking-tight group-hover:text-brand transition-colors">{mc.name}</div>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black opacity-60">{mc.style}</div>
                        </div>
                        <div className="text-right shrink-0">
                           <div className="text-xs font-mono text-brand font-black">{mc.wins}W - {mc.losses}L</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(242, 125, 38, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(242, 125, 38, 0.4);
        }
      `}} />
    </section>
  );
};

export default GZoneMap;
