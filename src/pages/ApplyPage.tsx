import { ArrowUpRight, Instagram, Mic2 } from "lucide-react";

export default function ApplyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 pb-16 pt-32 text-white md:pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-carbon opacity-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-[clamp(2rem,10vw,3rem)] uppercase leading-[0.95] tracking-tighter md:text-7xl">
            GZone <span className="text-brand">Auditions</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
            Got bars? Apply for GZone Street Edition, Season 2, or both.
          </p>
        </header>

        <section aria-labelledby="apply-heading" className="mt-10 max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8 md:mt-14 md:p-10">
          <div className="flex items-center gap-3 text-brand">
            <Mic2 size={20} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.25em]">MC Applications</p>
          </div>
          <h2 id="apply-heading" className="mt-5 font-display text-3xl uppercase leading-tight sm:text-4xl">Ready to step up?</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            Send us a message on Instagram and tell us whether you want to audition for Street Edition, Season 2, or both.
          </p>
          <a
            href="https://www.instagram.com/thegzonerbl/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-brand px-6 py-4 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <Instagram size={18} aria-hidden="true" /> Message @thegzonerbl <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <p className="mt-4 text-xs text-zinc-500">Opens Instagram in a new tab.</p>
        </section>
      </div>
    </main>
  );
}
