import { motion } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Journey() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[150px] -z-10" />

      {/* Hero Section of Journey Page */}
      <section className="pt-32 pb-24 px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-orange font-bold uppercase tracking-[0.4em] text-xs mb-6"
          >
            Since 1986
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter mb-8 leading-none"
          >
            THE <span className="text-brand-orange">JOURNEY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            From the first 8-bit copy-paste to high-leverage AI systems. 30+ years of technical evolution, Manchester grit, and continuous iteration.
          </motion.p>
        </div>
      </section>

      {/* The Journey Timeline Section (from Home.tsx) */}
      <section className="pb-60 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative px-4">
          {/* Vertical Path Container */}
          <div className="relative pt-12 pb-32">
            {/* The Wiggly Line (Desktop) */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-full max-w-lg hidden md:block">
              <svg 
                className="w-full h-full text-brand-orange select-none pointer-events-none" 
                viewBox="0 0 400 1200" 
                fill="none" 
                preserveAspectRatio="none"
              >
                <motion.path 
                  d="M200 0 C250 150 150 300 200 450 C250 600 150 750 200 900 C250 1050 150 1200 200 1350" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="opacity-10"
                />
                <motion.path 
                  d="M200 0 C250 150 150 300 200 450 C250 600 150 750 200 900 C250 1050 150 1200 200 1350" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="10 20"
                  className="opacity-30"
                  animate={{ strokeDashoffset: [0, -100] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Path (Mobile) */}
            <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-brand-orange/20 md:hidden" />

            {/* Milestones */}
            <div className="space-y-40 relative z-10">
              {/* 1986 Milestone */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl group hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange font-display font-bold text-4xl">1986</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">CPC 464</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">Pandora’s Box</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 italic">
                      "Opened an Amstrad CPC for Christmas Day. Curiosity strong enough to 'open one'. Hooked as a 6 year old with a manual. See you in 6 months."
                    </p>
                    <div className="text-xs text-brand-orange/60 font-bold uppercase tracking-widest space-y-1">
                      <p>• Locomotive BASIC 1.0</p>
                      <p>• 64K RAM • Z80 CPU</p>
                      <p>• Cassette Datacorder</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(255,99,33,0.8)] z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 1987 BBC Micro */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 hidden md:block" />
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 text-right md:text-left">
                    <div className="flex justify-between md:flex-row-reverse items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1987</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">Model B</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">THE BBC LITERACY ERA</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      Exploration of structured BASIC and hardware expansion. Moving from "writing a program" to "working with a system."
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• 6502 Assembly exposure</p>
                      <p>• BBC BASIC IV</p>
                      <p>• Hardware Expansion / Tube</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 1990 Windows/DOS */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1990</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">Win 3.0 / DOS</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">THE COMMAND LINE</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      Learning the substrate: Config.sys, Autoexec.bat, and driver troubleshooting. Distrust of "it just works" begins.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• Batch scripting</p>
                      <p>• QBasic / Turbo Pascal</p>
                      <p>• 8.3 Filename limits</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 1992 Amiga / Nimbus */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row items-stretch gap-12"
              >
                {/* Amiga */}
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1992</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">Amiga 500+ / 1200</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">MULTIMEDIA INSTRUMENT</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      The 16/32-bit leap. Amiga blurred "coding" and "making" (graphics, sound, demos). Multimedia pipeline thinking.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• AMOS / Blitz Basic</p>
                      <p>• AGA Chipset / 68k Assembly</p>
                      <p>• Workbench 2.0 / 3.0</p>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12">
                  <div className="w-1 h-32 bg-gradient-to-b from-brand-orange to-brand-orange/0 opacity-20" />
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                  <div className="w-1 h-32 bg-gradient-to-t from-brand-orange to-brand-orange/0 opacity-20" />
                </div>

                {/* Nimbus */}
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1992</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">RM Nimbus PC-186</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">MANAGED NETWORKS</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      Exposure to the school network lab environment. "WELCOME" menus and early exposure to multi-user permissions.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• Intel 80186 @ 8MHz</p>
                      <p>• Networked Apps / Logo</p>
                      <p>• Managed Labs Heritage</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 1993 MacOS */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1993</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">System 7.1</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">GUI MATURITY</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      Exposure to the Macintosh document-centric workflow. Typography, UX, and human-scale system design.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• HyperCard / AppleScript</p>
                      <p>• Desktop Publishing literacy</p>
                      <p>• Human Interface Guidelines</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 1991-98 Academic Foundations */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 hidden md:block" />
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 text-right md:text-left">
                    <div className="flex justify-between md:flex-row-reverse items-start mb-4">
                      <span className="text-brand-orange/40 font-display font-bold text-3xl">1991-98</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">BTEC ADV GNVQ</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">SYSTEMS THEORY</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      9 GCSEs including Information Systems, followed by a BTEC Advanced GNVQ in Information Systems & Technology. 23 ICT modules covering the breadth of the era.
                    </p>
                    <div className="text-xs text-brand-orange/30 font-bold uppercase tracking-widest space-y-1">
                      <p>• Systems Design & Analysis</p>
                      <p>• Biotechnology & Mathematics enrichment</p>
                      <p>• 23 ICT Core Modules</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 1998 GUS PLC Milestone */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">1998</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">GUS PLC</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">THE BARCODE HACK</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      First taste of professional automation. Created a custom bar-code subset for returns processing, radically increasing team throughput.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• Process Optimization</p>
                      <p>• Fraud Prevention systems</p>
                      <p>• Efficiency Engineering roots</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 2001 Servicecare Milestone */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 hidden md:block" />
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 text-right md:text-left">
                    <div className="flex justify-between md:flex-row-reverse items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">2001-02</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">Oldham College</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">HARDWARE & NETWORKING</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      Validating the "Service Engineer" years with formal C&G Level 2 Networking and Microcomputer Installation titles. Understanding the CAT5 substrate.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• C&G Level 2 Microcomputer Install</p>
                      <p>• C&G Level 2 Networking (7261-222)</p>
                      <p>• CAT5 Physical Layer Cabling</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2003-07 British Gas Milestone */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">2003-07</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">British Gas</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">THE ANALYST AWAKENS</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      From SME to Business Analyst. Re-engineering End-to-End processes in preparation for SAP, unpicking complex billing and meter imbalances.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• BPR / Process Mapping</p>
                      <p>• Billing System Interrogation</p>
                      <p>• SAP Implementation prep</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 2007-08 NHS Milestone */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 hidden md:block" />
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500 text-right md:text-left">
                    <div className="flex justify-between md:flex-row-reverse items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">2007-08</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">NHS CfH</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">DIGITAL HEALTH</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      Information Analyst within Oldham PCT. Migrating 15,000+ paper records to Lorenzo iPatient Manager to embrace digital clinical workflows.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• 15k Paper-to-Digital migrations</p>
                      <p>• Lorenzo iPatient Specialist</p>
                      <p>• SOP Development for Nursing staff</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2010-12 SQL & Technical Upskilling */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">2010-12</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">LUMIA & BURY</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">RE-TOOLING FOR SQL</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      Mastering the data layer. Introduction to SQL and MS Management Studio, alongside ECDL Extra and Adult Numeracy refreshers.
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• T-SQL & MS Management Studio</p>
                      <p>• BCS Level 2 IT User Skills (ECDL)</p>
                      <p>• C&G Level 2 Adult Numeracy</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 2008-16 Council Transformation Era */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl hover:border-brand-orange/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-brand-orange/60 font-display font-bold text-3xl">2008-16</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 px-3 py-1 border border-white/5 rounded-full">Bury & Rochdale</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">THE TRANSFORMATION ERA</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      Senior Business Analyst managing Bury's EDRM migration of 1.25M documents. Formalizing leadership via ILM Level 2 and Lean methodologies (Kaizen).
                    </p>
                    <div className="text-xs text-brand-orange/40 font-bold uppercase tracking-widest space-y-1">
                      <p>• 1.25M Doc Records Management</p>
                      <p>• Lean / Kaizen Continuous Improvement</p>
                      <p>• ILM Level 2 Leadership Award</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10" />
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>

              {/* 2016-Present Oldham Council */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 hidden md:block" />
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16">
                  <div className="w-1 h-32 bg-gradient-to-b from-brand-orange to-brand-orange/0 opacity-20" />
                  <div className="w-4 h-4 border-2 border-brand-orange bg-black rounded-full z-10 shadow-[0_0_15px_rgba(255,99,33,0.3)]" />
                  <div className="w-1 h-32 bg-gradient-to-t from-brand-orange to-brand-orange/0 opacity-20" />
                </div>
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-8 border border-white/5 bg-zinc-900/40 backdrop-blur-md rounded-3xl border-brand-orange/20 shadow-[0_0_30px_rgba(255,99,33,0.05)] transition-all duration-500 text-right md:text-left">
                    <div className="flex justify-between md:flex-row-reverse items-start mb-4">
                      <span className="text-brand-orange font-display font-bold text-3xl">2016-NOW</span>
                      <span className="text-[10px] uppercase tracking-widest text-white px-3 py-1 bg-brand-orange/20 border border-brand-orange/30 rounded-full">Oldham Council</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-white">DIGITAL BY DESIGN</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 text-pretty">
                      Leading the Highways overhaul and Covid-19 response. Developed "Report Fly Tipping" portal used for 18,300+ reports and a suite of 16 integrated Highways forms.
                    </p>
                    <div className="text-xs text-brand-orange/60 font-bold uppercase tracking-widest space-y-1">
                      <p>• 18,300+ Fly Tipping Digital Reports</p>
                      <p>• MS Dynamics 365 UX/Data Dashboards</p>
                      <p>• GIS Migration & Highways UX overhaul</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2024 Milestone */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="md:w-5/12 ml-12 md:ml-0">
                  <div className="p-10 border border-brand-orange/40 bg-brand-orange/5 rounded-[2rem] shadow-[0_0_50px_rgba(255,99,33,0.15)] hover:border-brand-orange transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Sparkles className="w-20 h-20 text-brand-orange" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-white font-display font-bold text-5xl">2024+</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest text-white px-3 py-1 bg-brand-orange rounded-full mb-2">BJS STUDIO</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-display font-bold mb-6 uppercase tracking-tight text-brand-orange">The AI Era</h3>
                    <p className="text-gray-100 text-xl leading-relaxed mb-8">
                      "This is the era of maximum leverage. 30 years of technical growth and public-sector scale has prepared me to build AI systems that aren't just toys, but transformation engines."
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] text-brand-orange font-bold uppercase tracking-[0.2em]">
                       <div className="p-3 border border-brand-orange/20 rounded-xl bg-brand-orange/5">
                         Agentic Systems
                       </div>
                       <div className="p-3 border border-brand-orange/20 rounded-xl bg-brand-orange/5">
                         LLM Orchestration
                       </div>
                       <div className="p-3 border border-brand-orange/20 rounded-xl bg-brand-orange/5">
                         Vector RAG Prep
                       </div>
                       <div className="p-3 border border-brand-orange/20 rounded-xl bg-brand-orange/5">
                         Studio Direction
                       </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative w-2/12 h-16 pt-32">
                   <motion.div 
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 border-2 border-brand-orange rounded-full flex items-center justify-center bg-brand-orange/20 z-10 shadow-[0_0_40px_rgba(255,102,0,0.5)]"
                   >
                     <Sparkles className="w-8 h-8 text-brand-orange" />
                   </motion.div>
                </div>
                <div className="md:w-5/12 hidden md:block" />
              </motion.div>
            </div>
          </div>

          <div className="mt-32 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-4 text-gray-500 hover:text-brand-orange transition-colors uppercase tracking-[0.4em] text-xs font-bold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
