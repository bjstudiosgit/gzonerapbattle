export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-brand">MC Applications</p>
        <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter md:text-8xl">
          Gzone <span className="text-brand">Auditions</span>
        </h1>
        <p className="mb-10 mt-6 text-sm leading-7 text-zinc-400">
          To audition for Gzone Street Edition or Gzone Season 2, reach out to us on Instagram:
        </p>
        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 shadow-2xl md:p-10">
          <a
            href="https://www.instagram.com/thegzonerbl/"
            target="_blank"
            rel="noreferrer"
            className="break-all font-display text-3xl uppercase text-brand underline decoration-brand/30 underline-offset-8 md:text-5xl"
          >
            @thegzonerbl
          </a>

          <div className="mt-10 space-y-4 text-sm leading-7 text-zinc-300">
            <p>Send us a direct message and tell us whether you are applying for Street Edition, Season 2, or both.</p>
            <p>We are looking for battle rappers ready to step up and prove themselves.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
