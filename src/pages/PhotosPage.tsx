import { useMemo, useState } from "react";
import { X, Download, Images } from "lucide-react";

type PhotoGroup = {
  label: string;
  folder: string;
  files: string[];
};

const photoGroups: PhotoGroup[] = [
  {
    label: "April 2026",
    folder: "/eventphotos/april2026",
    files: Array.from({ length: 86 }, (_, i) => `${String(i + 1).padStart(3, "0")}.jpg`),
  },
];

function buildSrc(folder: string, file: string) {
  return `${folder}/20260426-G-Zone-${file}`;
}

export default function PhotosPage() {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);
  const grouped = useMemo(() => photoGroups, []);

  const handleDownload = async (src: string, filename: string) => {
    const response = await fetch(src);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 md:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 md:mb-20">
          <p className="text-brand uppercase text-[10px] md:text-xs font-black tracking-[0.45em] mb-4">Photos</p>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-[0.8] tracking-tighter text-white">
            Event <span className="text-brand">Archive</span>
          </h1>
          <p className="mt-5 max-w-3xl text-zinc-400 text-sm md:text-lg leading-relaxed">
            Highlights of past events.
          </p>
        </div>

        <div className="space-y-16">
          {grouped.map((group) => (
            <section key={group.label}>
              <div className="flex items-end justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl md:text-4xl font-display uppercase text-white tracking-tight">{group.label}</h2>
                  <p className="mt-2 text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.35em]">
                    {group.files.length} photos
                  </p>
                </div>
                <div className="hidden md:block text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em]">
                  Gallery grid
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {group.files.map((file, index) => {
                  const src = buildSrc(group.folder, file);
                  return (
                    <button
                      key={file}
                      type="button"
                      onClick={() => setActive({ src, alt: `${group.label} photo ${index + 1}` })}
                      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-white/5 text-left"
                    >
                      <img
                        src={src}
                        alt={`${group.label} photo ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute -top-14 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <img
                src={active.src}
                alt={active.alt}
                className="max-h-[85vh] w-full object-contain bg-black"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
              <span>{active.alt}</span>
              <a
                href={active.src}
                onClick={(e) => {
                  e.preventDefault();
                  void handleDownload(active.src, `${active.alt}.jpg`);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors"
              >
                <Download size={14} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
