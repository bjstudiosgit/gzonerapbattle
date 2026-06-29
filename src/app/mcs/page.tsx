"use client";
import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { allMcs } from "../../data/mcs";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trophy, 
  XCircle, 
  User,
  ChevronRight
} from "lucide-react";

type SortField = "name" | "wins" | "losses" | "battles";
type SortOrder = "asc" | "desc";

export default function MCIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredAndSortedMCs = useMemo(() => {
    return allMcs
      .filter((mc) =>
        mc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mc.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name);
        } else {
          comparison = (a[sortField] || 0) - (b[sortField] || 0);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to desc for stats
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 min-h-screen bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-display italic uppercase leading-tight">
            Lord of the Archives <br /><span className="text-brand">Artists</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl text-sm md:text-lg leading-relaxed">
            Every MC logged in The Archive. Tap any name to pull up their full profile — battle record, form, stats, and complete history.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search MCs by name or nickname..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <SortButton 
              active={sortField === "name"} 
              onClick={() => toggleSort("name")}
              label="Name"
              icon={<User size={14} />}
            />
            <SortButton 
              active={sortField === "wins"} 
              onClick={() => toggleSort("wins")}
              label="Wins"
              icon={<Trophy size={14} />}
            />
            <SortButton 
              active={sortField === "losses"} 
              onClick={() => toggleSort("losses")}
              label="Losses"
              icon={<XCircle size={14} />}
            />
          </div>
        </div>

        {/* MC Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMCs.map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link 
                href={`/mc/${mc.slug}`}
                className="group block bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-brand/30 transition-all hover:shadow-[0_0_30px_rgba(242,125,38,0.05)]"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={mc.image} 
                    alt={mc.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display italic uppercase text-2xl group-hover:text-brand transition-colors leading-none">
                        {mc.name}
                      </h3>
                      {mc.nickname && (
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                          {mc.nickname}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-brand font-display italic text-xl leading-none">
                        {mc.wins}-{mc.losses}
                      </div>
                      <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Record</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-zinc-300 font-mono text-xs font-bold">{mc.battles}</div>
                        <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Battles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-zinc-300 font-mono text-xs font-bold">{mc.battles + (mc.wins * 3)}</div>
                        <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Points</div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-brand group-hover:text-black transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedMCs.length === 0 && (
          <div className="text-center py-24">
            <p className="text-zinc-500 uppercase tracking-[0.2em] font-bold">No MCs found matching your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SortButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
        active 
          ? 'bg-brand border-brand text-black' 
          : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/20'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
