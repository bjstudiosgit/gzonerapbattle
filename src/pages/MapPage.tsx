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
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            The <span className="text-orange-600">G-Zone</span> Network
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Showcasing and supporting UK talent nationwide. Navigate the map to discover who’s representing each area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Map Section */}
          <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800/50 rounded-3xl relative overflow-hidden aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[850px] flex items-center justify-center group/map">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(#52525b 1px, transparent 1px), linear-gradient(90deg, #52525b 1px, transparent 1px)`, 
                   backgroundSize: '32px 32px' 
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
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover/map:opacity-100 transition-opacity duration-300">
                    <button onClick={() => zoomIn()} className="p-3 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-white shadow-2xl">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button onClick={() => zoomOut()} className="p-3 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-white shadow-2xl">
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={() => resetTransform()} className="p-3 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-white shadow-2xl">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                      <div className={`relative inline-block transition-all duration-500 ${selectedLocation ? 'opacity-40 scale-[1.05]' : 'opacity-95'}`}>
                        <img 
                          src="/gzonemap.png" 
                          alt="GZone UK MC Map" 
                          className="h-[800px] w-auto select-none pointer-events-none drop-shadow-[0_0_50px_rgba(234,88,12,0.15)]"
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
                                  w-7 h-7 rounded-full border-2 border-white/90 shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-500 flex items-center justify-center
                                  ${isSelected 
                                    ? 'bg-orange-600 scale-150 ring-[12px] ring-orange-600/40 shadow-[0_0_30px_rgba(234,88,12,0.8)]' 
                                    : 'bg-orange-900'}
                                `}>
                                  <div className={`w-1.5 h-1.5 rounded-full bg-white ${isSelected ? 'scale-150' : 'animate-pulse'}`} />
                                </div>
                                
                                {/* Pulse effect */}
                                <div className={`
                                  absolute inset-0 rounded-full animate-ping
                                  ${isSelected ? 'bg-orange-600 opacity-75' : 'bg-orange-900/50'}
                                `} style={{ animationDuration: isSelected ? '1.5s' : '3s' }} />

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[12px] text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 pointer-events-none z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                  <div className="font-black uppercase tracking-tighter text-orange-500">{location}</div>
                                  <div className="text-[10px] text-zinc-400 font-bold flex items-center gap-2">
                                    <User className="w-3 h-3" />
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

            {/* Legend - Only visible on mobile as per request */}
            <div className="absolute bottom-4 left-4 right-4 md:hidden bg-black/80 backdrop-blur-xl border border-zinc-800/50 p-4 rounded-2xl z-20 shadow-2xl pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.6)]" />
                  <span className="text-[10px] text-white uppercase font-black tracking-widest">GZONE MCS</span>
                </div>
                <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Pinch to Zoom • Drag to Pan</p>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:h-[850px] flex flex-col">
            <AnimatePresence mode="wait">
              {selectedLocation ? (
                <motion.div
                  key={selectedLocation}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedLocation}</h2>
                      <p className="text-zinc-500 text-sm">{selectedMCs.length} MC{selectedMCs.length > 1 ? 's' : ''} representing</p>
                    </div>
                    <button 
                      onClick={() => setSelectedLocation(null)}
                      className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {selectedMCs.map((mc) => (
                      <Link 
                        key={mc.id}
                        to={`/mc/${mc.slug}`}
                        className="group block bg-black border border-zinc-800 rounded-2xl p-4 hover:border-orange-600/50 transition-all relative overflow-hidden"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                            <img 
                              src={mc.image} 
                              alt={mc.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${mc.id}/200/200`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold truncate group-hover:text-orange-500 transition-colors">{mc.name}</h3>
                            <p className="text-zinc-500 text-xs truncate">{mc.style}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-orange-600">{mc.wins}-{mc.losses}</div>
                            <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Record</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                    <MapPin className="w-8 h-8 text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-400 mb-2">Select a Location</h3>
                  <p className="text-zinc-600 text-sm max-w-[200px]">
                    Click on the map pins to see which MCs are from each city.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
};

export default MapPage;
