import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Link as LinkIcon, 
  Instagram, 
  Youtube, 
  Music, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronLeft,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    mcName: "",
    email: "",
    location: "",
    links: {
      soundcloud: "",
      instagram: "",
      youtube: "",
      other: ""
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-12 bg-zinc-900 rounded-3xl border border-brand/20 shadow-2xl shadow-brand/5"
        >
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-brand" size={40} />
          </div>
          <h1 className="text-3xl font-display italic uppercase text-white mb-4">Application Sent</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Your bars are in the system. Our team will review your audition. 
            If you're lethal enough, we'll be in touch.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-brand hover:bg-brand-dark text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all"
          >
            Back to Base
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Accents */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase text-xs tracking-widest font-bold">Back to Home</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display italic uppercase mb-4 leading-tight whitespace-nowrap">
            Apply to the <span className="text-brand">G Zone</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Upload your best 60-second freestyle. No beats, no edits. Just raw bars.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="space-y-6">
            <h2 className="text-xl font-display italic uppercase text-brand flex items-center gap-2">
              <span className="w-8 h-px bg-brand/30" /> 01. Basic Info
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">MC Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. GHOST_FACE"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.mcName}
                  onChange={e => setFormData({...formData, mcName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="contact@bars.com"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Video Upload */}
          <section className="space-y-6">
            <h2 className="text-xl font-display italic uppercase text-brand flex items-center gap-2">
              <span className="w-8 h-px bg-brand/30" /> 02. Audition Video
            </h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
                ${videoFile ? 'border-brand bg-brand/5' : 'border-white/10 hover:border-brand/30 bg-zinc-900/50'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="video/*"
                onChange={handleFileChange}
              />
              
              <AnimatePresence mode="wait">
                {videoFile ? (
                  <motion.div 
                    key="file-selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="text-brand" size={32} />
                    </div>
                    <p className="text-white font-bold mb-1">{videoFile.name}</p>
                    <p className="text-zinc-500 text-sm">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                      }}
                      className="mt-4 text-xs uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <X size={14} /> Remove Video
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="no-file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-500 group-hover:text-brand transition-colors">
                      <Upload size={32} />
                    </div>
                    <p className="text-white font-bold mb-1">Click to upload video</p>
                    <p className="text-zinc-500 text-sm">MP4, MOV or WEBM (Max 100MB)</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Social Links */}
          <section className="space-y-6">
            <h2 className="text-xl font-display italic uppercase text-brand flex items-center gap-2">
              <span className="w-8 h-px bg-brand/30" /> 03. Socials & Links
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input 
                  type="text"
                  placeholder="Instagram URL"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.links.instagram}
                  onChange={e => setFormData({...formData, links: {...formData.links, instagram: e.target.value}})}
                />
              </div>
              <div className="relative">
                <Music className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input 
                  type="text"
                  placeholder="SoundCloud URL"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.links.soundcloud}
                  onChange={e => setFormData({...formData, links: {...formData.links, soundcloud: e.target.value}})}
                />
              </div>
              <div className="relative">
                <Youtube className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input 
                  type="text"
                  placeholder="YouTube URL"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.links.youtube}
                  onChange={e => setFormData({...formData, links: {...formData.links, youtube: e.target.value}})}
                />
              </div>
              <div className="relative">
                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input 
                  type="text"
                  placeholder="Other Portfolio/Link"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white placeholder:text-zinc-700"
                  value={formData.links.other}
                  onChange={e => setFormData({...formData, links: {...formData.links, other: e.target.value}})}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-8">
            <button 
              disabled={isUploading || !videoFile}
              className={`
                w-full py-6 rounded-full font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3
                ${isUploading || !videoFile 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-brand hover:bg-brand-dark text-black shadow-xl shadow-brand/20 hover:scale-[1.02]'}
              `}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Uploading Bars...
                </>
              ) : (
                <>
                  Submit Application <Send size={20} />
                </>
              )}
            </button>
            
            {!videoFile && (
              <p className="text-center mt-4 text-zinc-600 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertCircle size={14} /> Video audition is required to apply
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
