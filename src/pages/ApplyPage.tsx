export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-brand">MC Applications</p>
        <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter md:text-8xl">
          Gzone Street Edition <span className="text-brand">Application</span>
        </h1>
        <p className="mb-10 mt-6 text-sm leading-7 text-zinc-400">
          To apply for Gzone Street Edition in Manchester, email your details to:
        </p>
        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 shadow-2xl md:p-10">
          <a
            href="mailto:gzoneauditions@gmail.com"
            className="break-all font-display text-3xl uppercase text-brand underline decoration-brand/30 underline-offset-8 md:text-5xl"
          >
            gzoneauditions@gmail.com
          </a>

          <div className="mt-10 space-y-4 text-sm leading-7 text-zinc-300">
            <p>Include your name, email address, and telephone number.</p>
            <p>Add a short summary, your city, any useful links, and attach files if needed.</p>
            <p>We are looking for battle rappers ready to prove themselves in the street edition, with the best going into Gzone Season 2.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
