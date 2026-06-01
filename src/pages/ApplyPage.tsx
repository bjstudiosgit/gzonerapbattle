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
      const response = await fetch("https://formsubmit.io/send/gzoneauditions@gmail.com", {
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
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm md:text-lg tracking-widest font-black opacity-80">
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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase mb-8 leading-[0.9] tracking-tighter shadow-2xl">
            THINK YOU'RE{" "}
            <span className="relative inline-block isolate">
              <span className="relative z-10 inline-block text-transparent bg-clip-text bg-gradient-to-b from-cyan-50 via-sky-200 to-blue-400 drop-shadow-[0_0_14px_rgba(125,211,252,0.75)] [text-shadow:0_0_10px_rgba(186,230,253,0.8)]">
                COLD?
              </span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-[0.06em] h-[0.1em] rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent blur-[1px] opacity-80" />
              <span aria-hidden="true" className="absolute -inset-x-2 top-1/2 -z-10 h-5 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-xl" />
            </span>
            <br />PROVE IT.
          </h1>
          <div className="h-px w-32 bg-brand/40 mb-8 mx-auto lg:mx-0" />
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl leading-relaxed tracking-tight font-medium opacity-80 border-l-0 lg:border-l-2 border-brand/20 lg:pl-6 py-2 mx-auto lg:mx-0">
            We're looking for MCs who can write, perform, and deliver under pressure. That means strong material, clear delivery, and the ability to stay composed in a live battle environment. Apply below to be considered. All applications are reviewed, selected MCs will be contacted.
          </p>
        </div>

        <form 
          action="https://formsubmit.io/send/gzoneauditions@gmail.com" 
          method="POST" 
          className="space-y-12 bg-black/40 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_subject" value="New Gzone Application" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_cc" value="gingajay.ent@gmail.com" />
          <input type="hidden" name="Role" value="MC" />
          <input type="text" name="_formsubmit_id" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Full Name *
              </label>
              <input required name="Name" type="text" placeholder="Enter your full name" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base" value={formData.mcName} onChange={e => setFormData({...formData, mcName: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Email Address *
              </label>
              <input required name="email" type="email" placeholder="Enter your email" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Phone Number *
              </label>
              <input required name="Phone Number" type="tel" placeholder="Enter your phone number" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                City / Area *
              </label>
              <input required name="City" type="text" placeholder="Enter your city or area" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Battle Experience *
              </label>
              <select required name="Battle Experience" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base appearance-none cursor-pointer" value={formData.battleExperience} onChange={e => setFormData({...formData, battleExperience: e.target.value})}>
                <option value="" className="bg-zinc-950">Select experience level</option>
                <option value="First battle" className="bg-zinc-950">First battle (Newcomer)</option>
                <option value="1-5 battles" className="bg-zinc-950">1-5 battles</option>
                <option value="5+ battles" className="bg-zinc-950">5+ battles</option>
                <option value="League veteran" className="bg-zinc-950">League veteran</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Performance Style
              </label>
              <input name="Performance Style" type="text" placeholder="e.g. Grime, Road Rap, Wordplay" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base" value={formData.performanceStyle} onChange={e => setFormData({...formData, performanceStyle: e.target.value})} />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Audition/Youtube etc link
              </label>
              <div className="relative">
                <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input name="Audition Link" type="text" placeholder="Paste your link here" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base pr-16" value={formData.auditionLink} onChange={e => setFormData({...formData, auditionLink: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">
                Message
              </label>
              <textarea name="Message" placeholder="Tell us about yourself and why you want to join" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-white text-base leading-relaxed h-32 resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group/social">
                <Instagram className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input name="Instagram" type="text" placeholder="Instagram handle" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-sm text-white pr-16" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
              </div>
              <div className="relative group/social">
                <Music className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input name="SoundCloud" type="text" placeholder="SoundCloud link" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-sm text-white pr-16" value={formData.soundcloud} onChange={e => setFormData({...formData, soundcloud: e.target.value})} />
              </div>
              <div className="relative group/social">
                <Youtube className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input name="YouTube" type="text" placeholder="YouTube channel" className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand transition-all text-sm text-white pr-16" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} />
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
              <span className="relative z-10">{isSubmitting ? "TRANSMITTING DATA..." : "SUBMIT APPLICATION ->"}</span>
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}
