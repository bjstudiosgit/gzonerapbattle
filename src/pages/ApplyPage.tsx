import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  Link as LinkIcon, 
  Instagram, 
  Youtube, 
  Music, 
  AlertCircle,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    mcName: "",
    email: "",
    phone: "",
    city: "",
    battleExperience: "",
    performanceStyle: "",
    auditionLink: "",
    instagram: "",
    youtube: "",
    soundcloud: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/4a857a6e0e1936a70f12a8d6ffe2dc0a", {
        method: 'POST',
        body: formDataObj,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        form.submit();
      }
    } catch (error) {
      console.error("Submission error:", error);
      form.submit();
    } finally {
      if (isSuccess) setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-12 relative overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center p-10 md:p-16 bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] border border-brand/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10"
        >
          <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/20 shadow-[0_0_30px_rgba(242,125,38,0.2)]">
            <CheckCircle2 className="text-brand" size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display uppercase text-white mb-6 leading-none tracking-tight">Entry <br/><span className="text-brand">Logged</span></h1>
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm md:text-lg uppercase tracking-widest font-black opacity-80">
            Your application is in the ring. <br/>If your bars are serious, <span className="text-brand">we will be in touch.</span>
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-4 bg-brand hover:bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-brand/20 hover:scale-105"
          >
            Return Home <ChevronLeft size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-24 pt-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8" id="application-form">
        <div className="mb-16 md:mb-24 text-center lg:text-left">
          <h1 className="text-5xl md:text-8xl font-display uppercase mb-8 leading-[0.85] tracking-tighter shadow-2xl">
            THINK YOU’RE <span className="text-brand">COLD?</span> <br/>PROVE IT.
          </h1>
          <div className="h-px w-32 bg-brand/40 mb-8 mx-auto lg:mx-0" />
          <p className="text-zinc-500 text-sm md:text-lg uppercase font-black tracking-widest leading-relaxed opacity-80 max-w-2xl mx-auto lg:mx-0">
            The Gzone is built for MCs who can <span className="text-white">write, perform, and hold their own</span> under pressure. 
            <span className="text-brand block mt-4 font-black">No gas. No hand-holding. No second chances.</span>
          </p>
        </div>

        <form 
          action="https://formsubmit.co/4a857a6e0e1936a70f12a8d6ffe2dc0a" 
          method="POST" 
          className="space-y-12 bg-black/40 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_subject" value="New Gzone Application" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="Role" value="MC" />

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Identity Name *
              </label>
              <input required name="Name" type="text" placeholder="MC Name" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-display text-2xl uppercase tracking-wider" value={formData.mcName} onChange={e => setFormData({...formData, mcName: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Communication Node *
              </label>
              <input required name="email" type="email" placeholder="Email Address" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Direct Line *
              </label>
              <input required name="Phone Number" type="tel" placeholder="Mobile / Phone" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Operational Base *
              </label>
              <input required name="City" type="text" placeholder="City / Area" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base uppercase tracking-widest" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Conflict History *
              </label>
              <select required name="Battle Experience" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base appearance-none cursor-pointer" value={formData.battleExperience} onChange={e => setFormData({...formData, battleExperience: e.target.value})}>
                <option value="" className="bg-zinc-950">SELECT EXPERIENCE LEVEL</option>
                <option value="First battle" className="bg-zinc-950">FIRST CONFLICT (NEWCOMER)</option>
                <option value="1-5 battles" className="bg-zinc-950">SKIRMISH VETERAN (1-5)</option>
                <option value="5+ battles" className="bg-zinc-950">BATTLE HARDENED (5+)</option>
                <option value="League veteran" className="bg-zinc-950">ELITE OPERATIVE (LEAGUE PRO)</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Performance Signature
              </label>
              <input name="Performance Style" type="text" placeholder="e.g. Grime, Road Rap, Wordplay Expert" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base" value={formData.performanceStyle} onChange={e => setFormData({...formData, performanceStyle: e.target.value})} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Intelligence Upload (Audition) *
              </label>
              <div className="relative">
                <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-brand opacity-40" size={20} />
                <input required name="Audition Link" type="url" placeholder="YouTube / Dropbox / Drive Link" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand transition-all text-white font-black text-sm md:text-base pr-16" value={formData.auditionLink} onChange={e => setFormData({...formData, auditionLink: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Strategic Intent
              </label>
              <textarea name="Message" placeholder="Why the Gzone? What's your mission?" className="w-full bg-zinc-900/60 border border-white/5 rounded-3xl px-8 py-6 focus:outline-none focus:border-brand transition-all text-white font-bold text-sm md:text-base leading-relaxed h-40 resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group/social">
                <Instagram className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover/social:text-brand transition-colors" size={20} />
                <input name="Instagram" type="text" placeholder="INSTAGRAM" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-4 focus:outline-none focus:border-brand transition-all text-[11px] font-black uppercase tracking-widest text-white pr-16" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
              </div>
              <div className="relative group/social">
                <Music className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover/social:text-brand transition-colors" size={20} />
                <input name="SoundCloud" type="text" placeholder="SOUNDCLOUD" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-4 focus:outline-none focus:border-brand transition-all text-[11px] font-black uppercase tracking-widest text-white pr-16" value={formData.soundcloud} onChange={e => setFormData({...formData, soundcloud: e.target.value})} />
              </div>
              <div className="relative group/social">
                <Youtube className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover/social:text-brand transition-colors" size={20} />
                <input name="YouTube" type="text" placeholder="YOUTUBE" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-8 py-4 focus:outline-none focus:border-brand transition-all text-[11px] font-black uppercase tracking-widest text-white pr-16" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-8 rounded-full font-black uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 bg-brand hover:bg-white text-black shadow-[0_20px_50px_rgba(242,125,38,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-base relative overflow-hidden group/submit"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{isSubmitting ? "TRANSMITTING DATA..." : "SUBMIT APPLICATION →"}</span>
            </button>
            
            <div className="flex flex-col items-center gap-2 mt-8 opacity-50">
              <div className="flex items-center gap-3 text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                <AlertCircle size={14} className="text-brand" /> Intelligence Warning
              </div>
              <p className="text-center text-[8px] md:text-[9px] text-zinc-600 uppercase font-black tracking-widest max-w-sm leading-relaxed px-4">
                All submissions are vetted by the Gzone panel. Low-effort recruitment is immediately terminated.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
