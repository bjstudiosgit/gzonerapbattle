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
    <section className="py-24 bg-black overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display italic uppercase leading-none mb-6"
          >
            The <span className="text-brand">G-Zone</span> Network
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest text-sm font-bold"
          >
            Showcasing and supporting UK talent nationwide. Click a city to discover the MCs.
          </motion.p>
        </div>

        <div className="relative bg-zinc-950 rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-video flex items-center justify-center group/map shadow-2xl">
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
              maxScale={8}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                    <button onClick={() => zoomIn()} className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors text-white">
                      <ZoomIn size={20} />
                    </button>
                    <button onClick={() => zoomOut()} className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors text-white">
                      <ZoomOut size={20} />
                    </button>
                    <button onClick={() => resetTransform()} className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors text-white">
                      <RotateCcw size={20} />
                    </button>
                  </div>

                  <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <div className="relative inline-block">
                        <img 
                          src="/gzonemap.png" 
                          alt="GZone UK Map" 
                          className="h-[600px] md:h-[800px] w-auto select-none pointer-events-none opacity-80"
                          referrerPolicy="no-referrer"
                        />
                        
                        {Object.entries(mcsByLocation).map(([location, data]) => {
                          const pos = getMarkerPosition(data.coordinates);
                          
                          return (
                            <div 
                              key={location}
                              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                              style={pos}
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.2 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkerClick(location);
                                }}
                                className="cursor-pointer relative group/pin"
                              >
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-brand shadow-[0_0_15px_rgba(242,125,38,0.5)] flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                </div>
                                
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none z-20">
                                  <div className="font-black uppercase tracking-widest text-brand">{location}</div>
                                  <div className="text-[8px] text-zinc-400 font-bold flex items-center gap-1">
                                    <User size={10} />
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-30 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display italic uppercase text-white">{selectedLocation}</h3>
                    <button onClick={() => setSelectedLocation(null)} className="text-zinc-500 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {selectedMCs.map(mc => (
                      <Link 
                        key={mc.id}
                        to={`/mc/${mc.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                      >
                        <img 
                          src={mc.image} 
                          alt={mc.name} 
                          className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${mc.id}/200/200`;
                          }}
                        />
                        <div>
                          <div className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-brand transition-colors">{mc.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{mc.style}</div>
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
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}} />
    </section>
  );
};

export default GZoneMap;
