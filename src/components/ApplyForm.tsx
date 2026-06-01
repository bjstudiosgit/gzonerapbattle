import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FileText, Instagram, Link as LinkIcon, Youtube } from "lucide-react";
import { db } from "../lib/voteFirebase";

const initialFormData = {
  fullName: "",
  mcName: "",
  email: "",
  phone: "",
  city: "",
  battleExperience: "",
  auditionLink: "",
  instagram: "",
  youtube: "",
  about: "",
};

export default function ApplyForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof initialFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = { ...formData };
    console.log("Apply form payload:", payload);

    setIsLoading(true);
    setIsSuccess(false);
    setError("");

    try {
      const application = await addDoc(collection(db, "applications"), {
        ...payload,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      setFormData(initialFormData);

      void fetch("/api/apply", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: payload.fullName,
          email: payload.email,
          applicationId: application.id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.warn("Application saved, but notification delivery failed.");
          }
        })
        .catch((notificationError) => {
          console.error("Application notification failed:", notificationError);
        });
    } catch (submitError) {
      console.error("Application save failed:", submitError);
      const errorCode = submitError instanceof Error && "code" in submitError
        ? String(submitError.code)
        : "unknown";
      setError(`Unable to save your application. Please try again. (${errorCode})`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-zinc-950 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-brand";
  const labelClass = "mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-9 rounded-3xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur md:p-10">
      <div>
        <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-brand">
          <FileText size={16} />
          Your Details
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Full Name *</span>
            <input required name="fullName" type="text" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={inputClass} placeholder="Your full name" />
          </label>

          <label className="block">
            <span className={labelClass}>MC Name *</span>
            <input required name="mcName" type="text" value={formData.mcName} onChange={(event) => updateField("mcName", event.target.value)} className={inputClass} placeholder="Your stage name" />
          </label>

          <label className="block">
            <span className={labelClass}>Email *</span>
            <input required name="email" type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} placeholder="you@example.com" />
          </label>

          <label className="block">
            <span className={labelClass}>Phone Number *</span>
            <input required name="phone" type="tel" value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} className={inputClass} placeholder="Your contact number" />
          </label>

          <label className="block">
            <span className={labelClass}>City / Area *</span>
            <input required name="city" type="text" value={formData.city} onChange={(event) => updateField("city", event.target.value)} className={inputClass} placeholder="Where are you based?" />
          </label>

          <label className="block">
            <span className={labelClass}>Battle Experience *</span>
            <select required name="battleExperience" value={formData.battleExperience} onChange={(event) => updateField("battleExperience", event.target.value)} className={inputClass}>
              <option value="">Select your experience</option>
              <option value="First battle">First battle</option>
              <option value="1-5 battles">1-5 battles</option>
              <option value="5+ battles">5+ battles</option>
              <option value="League veteran">League veteran</option>
            </select>
          </label>
        </div>
      </div>

      <div className="border-t border-white/10 pt-9">
        <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-brand">
          <LinkIcon size={16} />
          Show Us Your Work
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className={labelClass}>Audition Or Performance Link <span className="text-zinc-600">(Optional)</span></span>
            <input name="auditionLink" type="url" value={formData.auditionLink} onChange={(event) => updateField("auditionLink", event.target.value)} className={inputClass} placeholder="https://youtube.com/..." />
          </label>

          <label className="block">
            <span className={labelClass}>Instagram <span className="text-zinc-600">(Optional)</span></span>
            <div className="relative">
              <Instagram className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input name="instagram" type="text" value={formData.instagram} onChange={(event) => updateField("instagram", event.target.value)} className={`${inputClass} pr-14`} placeholder="@yourhandle" />
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>YouTube Channel <span className="text-zinc-600">(Optional)</span></span>
            <div className="relative">
              <Youtube className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input name="youtube" type="url" value={formData.youtube} onChange={(event) => updateField("youtube", event.target.value)} className={`${inputClass} pr-14`} placeholder="https://youtube.com/@..." />
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>Tell Us Why You Should Be Considered For The Gzone</span>
            <textarea name="about" value={formData.about} onChange={(event) => updateField("about", event.target.value)} className={`${inputClass} min-h-32 resize-y`} placeholder="Tell us why you should be considered for the Gzone." />
          </label>
        </div>
      </div>

      <button disabled={isLoading} type="submit" className="w-full rounded-full bg-brand px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-white disabled:cursor-wait disabled:opacity-60">
        {isLoading ? "Saving..." : "Submit Application"}
      </button>

      {isSuccess && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">Application saved successfully.</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
    </form>
  );
}
