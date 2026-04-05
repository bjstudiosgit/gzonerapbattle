import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { mcs } from '../data/mcs';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, X, Lock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group MCs by location to handle overlaps
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

  // Helper to convert lat/lon to percentage for the UK map image
  const getMarkerPosition = (coords: [number, number]) => {
    const [lat, lon] = coords;
    // Optimized UK Bounds for the gzonemap.png silhouette to match the visual reference
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

  const hasLockdownMC = (location: string) => {
    return mcsByLocation[location].mcs.some(mc => mc.tags?.includes('Lockdown'));
  };

  return (
    <div className="min-h-screen pt-32 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.5em] mb-4">Tactical Intelligence</h1>
          <h2 className="text-5xl md:text-9xl font-display italic uppercase leading-[0.8] mb-6">
            The <span className="text-brand">G-Zone</span> Network
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest text-[10px] md:text-xs font-black opacity-60">
            Showcasing and supporting UK talent nationwide. Navigate the map to discover who’s representing each area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Map Section */}
          <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] relative overflow-hidden aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[850px] flex items-center justify-center group/map shadow-2xl">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
                   backgroundSize: '40px 40px' 
                 }} 
            />
            
            <TransformWrapper
              initialScale={1.0}
              minScale={0.5}
              maxScale={10}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
            >
              {({ zoomIn, zoomOut, resetTransform, setTransform, ...rest }) => (
                <>
                  <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                    <button onClick={() => zoomIn()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <ZoomIn className="w-6 h-6 group-hover/zoom:scale-110 transition-transform" />
                    </button>
                    <button onClick={() => zoomOut()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <ZoomOut className="w-6 h-6 group-hover/zoom:scale-110 transition-transform" />
                    </button>
                    <button onClick={() => resetTransform()} className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-brand hover:text-black transition-all text-white shadow-2xl group/zoom">
                      <RotateCcw className="w-6 h-6 group-hover/zoom:rotate-[-45deg] transition-transform" />
                    </button>
                  </div>

                  <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <div className={`relative inline-block transition-all duration-700 ${selectedLocation ? 'opacity-30 scale-[1.02]' : 'opacity-100'}`}>
                        <img 
                          src="/gzonemap.png" 
                          alt="GZone UK MC Map" 
                          className="h-[800px] w-auto select-none pointer-events-none drop-shadow-[0_0_80px_rgba(242,125,38,0.2)] grayscale contrast-[1.1] brightness-[0.8]"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Interactive Markers */}
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
                                whileHover={{ scale: 1.4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocation(location);
                                }}
                                className="cursor-pointer relative group/pin"
                              >
                                <div className={`
                                  w-8 h-8 rounded-full border-2 border-white/90 shadow-[0_0_25px_rgba(0,0,0,0.8)] transition-all duration-500 flex items-center justify-center
                                  ${isSelected 
                                    ? 'bg-brand scale-150 ring-[15px] ring-brand/30 shadow-[0_0_40px_rgba(242,125,38,0.8)]' 
                                    : 'bg-zinc-900'}
                                `}>
                                  <div className={`w-2 h-2 rounded-full bg-white ${isSelected ? 'scale-150' : 'animate-pulse bg-brand'}`} />
                                </div>
                                
                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 px-5 py-2.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl text-[13px] text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 pointer-events-none z-20 shadow-2xl">
                                  <div className="font-black uppercase tracking-widest text-brand mb-0.5">{location}</div>
                                  <div className="text-[10px] text-zinc-400 font-black flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    {data.mcs.length} REPRESENTATIVE{data.mcs.length > 1 ? 'S' : ''} 
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

            {/* Legend - Detailed mobile layout */}
            <div className="absolute bottom-8 left-8 right-8 md:hidden bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl z-20 shadow-2xl pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_15px_rgba(242,125,38,0.8)] animate-pulse" />
                  <span className="text-[11px] text-white uppercase font-black tracking-[0.2em]">Active Locations</span>
                </div>
                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <span>Pinch</span> <span className="w-1 h-px bg-zinc-800" /> <span>Explore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel - Upgraded UI */}
          <div className="lg:h-[850px] flex flex-col">
            <AnimatePresence mode="wait">
              {selectedLocation ? (
                <motion.div
                  key={selectedLocation}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-display italic uppercase text-white tracking-tight leading-none mb-2">{selectedLocation}</h2>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">{selectedMCs.length} Roster Membership</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedLocation(null)}
                      className="p-3 bg-white/5 hover:bg-brand hover:text-black rounded-full transition-all duration-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                    {selectedMCs.map((mc, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={mc.id}
                      >
                        <Link 
                          to={`/mc/${mc.slug}`}
                          className="group block bg-zinc-900/40 border border-white/5 rounded-3xl p-5 hover:border-brand/40 transition-all duration-500 relative overflow-hidden"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                              <img 
                                src={mc.image} 
                                alt={mc.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${mc.id}/200/200`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-display italic text-2xl uppercase truncate group-hover:text-brand transition-colors">{mc.name}</h3>
                              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest truncate mt-0.5 opacity-60">{mc.style}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm font-mono text-brand font-black">{mc.wins}W - {mc.losses}L</div>
                              <div className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter mt-0.5">Rating</div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/20 backdrop-blur-sm border-2 border-dashed border-white/5 rounded-[2.5rem] p-12 h-full flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-24 h-24 bg-zinc-900/60 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 group-hover:border-brand/30 transition-colors duration-500 shadow-2xl">
                    <MapPin className="w-10 h-10 text-zinc-700 group-hover:text-brand transition-colors duration-500 group-hover:animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-display italic uppercase text-zinc-400 mb-3 tracking-widest">Select Node</h3>
                  <p className="text-zinc-600 text-xs uppercase font-black tracking-[0.2em] max-w-[240px] leading-relaxed opacity-60">
                    Target a tactical coordinate on the map to access member profiles and regional intelligence.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    </div>
  );
};

export default MapPage;
