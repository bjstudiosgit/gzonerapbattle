import { useState, FormEvent } from "react";
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
  const [role, setRole] = useState<"mc" | "ring-girl">("mc");
  const [formData, setFormData] = useState({
    mcName: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    battleExperience: "",
    performanceStyle: "",
    auditionLink: "",
    instagram: "",
    youtube: "",
    otherLink: "",
    message: "",
    height: "",
    age: "",
    availability: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const data = Object.fromEntries(formDataObj.entries());
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/4a857a6e0e1936a70f12a8d6ffe2dc0a", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success === "true") {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-12 bg-zinc-900 rounded-3xl border border-brand/20 shadow-2xl shadow-brand/5">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-brand" size={40} />
          </div>
          <h1 className="text-3xl font-display italic uppercase text-white mb-4">Application Successful</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Your application has been received. If your bars are serious, we'll be in touch.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-brand hover:bg-brand-dark text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all"
          >
            Back to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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
            Join the ranks. Choose your path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input type="hidden" name="_subject" value="New G Zone Application" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="Role" value={role === "mc" ? "MC / Battle Rapper" : "Ring Girl / Event Model"} />

          {/* Role Selection */}
          <section className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">I am applying as:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("mc")}
                className={`py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${role === "mc" ? "bg-brand text-black" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
              >
                MC / Battle Rapper
              </button>
              <button
                type="button"
                onClick={() => setRole("ring-girl")}
                className={`py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${role === "ring-girl" ? "bg-brand text-black" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
              >
                Ring Girl / Event Model
              </button>
            </div>
          </section>

          {/* Dynamic Fields */}
          <section className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {role === "mc" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Name *</label>
                    <input required name="MC Name" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.mcName} onChange={e => setFormData({...formData, mcName: e.target.value})} />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Full Name *</label>
                  <input required name="Full Name" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Email Address *</label>
                <input required name="email" type="email" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Phone Number *</label>
                <input required name="Phone Number" type="tel" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">City *</label>
                <input required name="City" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            {role === "mc" ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Battle Experience *</label>
                  <select required name="Battle Experience" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.battleExperience} onChange={e => setFormData({...formData, battleExperience: e.target.value})}>
                    <option value="">Select experience</option>
                    <option value="First battle">First battle</option>
                    <option value="1-5 battles">1-5 battles</option>
                    <option value="5+ battles">5+ battles</option>
                    <option value="League veteran">League veteran</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Performance Style</label>
                  <input name="Performance Style" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.performanceStyle} onChange={e => setFormData({...formData, performanceStyle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Audition Video Link *</label>
                  <input required name="Audition Video Link" type="url" placeholder="YouTube/TikTok/Drive link" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.auditionLink} onChange={e => setFormData({...formData, auditionLink: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Short message / context about yourself</label>
                  <textarea name="Message" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Instagram *</label>
                  <input required name="Instagram" type="url" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Portfolio or modelling link</label>
                  <input name="Portfolio Link" type="url" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.otherLink} onChange={e => setFormData({...formData, otherLink: e.target.value})} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Height</label>
                    <input name="Height" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Age (Optional)</label>
                    <input name="Age" type="number" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Availability</label>
                  <input name="Availability" type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Short introduction message</label>
                  <textarea name="Message" className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
              </>
            )}

            {/* Common Socials for MCs */}
            {role === "mc" && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative">
                  <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                  <input name="Instagram URL" type="url" placeholder="Instagram" className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="relative">
                  <Music className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                  <input name="SoundCloud URL" type="url" placeholder="SoundCloud" className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.soundcloud} onChange={e => setFormData({...formData, soundcloud: e.target.value})} />
                </div>
                <div className="relative">
                  <Youtube className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                  <input name="YouTube URL" type="url" placeholder="YouTube" className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand/50 transition-colors text-white" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} />
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-8">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 rounded-full font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 bg-brand hover:bg-brand-dark text-black shadow-xl shadow-brand/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
            </button>
            
            <p className="text-center mt-4 text-zinc-600 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <AlertCircle size={14} /> Warning: Submitting your audition makes it public. Prepare for humiliation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
