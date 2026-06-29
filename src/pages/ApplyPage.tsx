import ApplyForm from "../components/ApplyForm";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-brand">MC Applications</p>
        <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter md:text-8xl">
          Apply To <span className="text-brand">Battle</span>
        </h1>
        <p className="mb-10 mt-6 text-sm leading-7 text-zinc-400">
          Enter your details and submit your application to the Gzone team.
        </p>
        <ApplyForm />
      </div>
    </main>
  );
}
