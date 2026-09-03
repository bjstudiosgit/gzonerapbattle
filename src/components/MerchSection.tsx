import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const SHOP_URL = "https://zikb8m-pd.myshopify.com";
const PRODUCTS_URL = `${SHOP_URL}/products.json?limit=250`;

type ShopifyVariant = {
  price: string;
  available: boolean;
};

type ShopifyImage = {
  src: string;
  alt?: string | null;
};

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  published_at: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
};

const priceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

function getPriceLabel(product: ShopifyProduct) {
  const prices = product.variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) return null;

  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);
  const formattedPrice = priceFormatter.format(minimumPrice);

  return minimumPrice === maximumPrice ? formattedPrice : `From ${formattedPrice}`;
}

type MerchSectionProps = {
  showShopAll?: boolean;
};

export default function MerchSection({ showShopAll = true }: MerchSectionProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Shopify returned ${response.status}`);

        const data = (await response.json()) as { products?: ShopifyProduct[] };
        const sortedProducts = [...(data.products ?? [])].sort(
          (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
        );

        setProducts(sortedProducts);
        setHasError(sortedProducts.length === 0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="merch" className="relative overflow-hidden py-16 md:py-24 scroll-mt-28">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8 md:mb-12"
        >
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display uppercase leading-none tracking-tight text-white mb-4">
              Merch Has <span className="text-brand">Dropped!</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
              Fresh Gzone gear is live now. Scroll through the collection below or visit our Shopify store.
            </p>
          </div>

          {/* Carousel Arrows & Shop All CTA */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <a
              href={`${SHOP_URL}/collections/all`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-white"
            >
              Shop All
              <ArrowUpRight size={15} />
            </a>

            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => handleScroll("left")}
                className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                aria-label="Previous products"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                aria-label="Next products"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="flex gap-4 sm:gap-6 overflow-hidden py-2" aria-label="Loading merchandise">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-[240px] sm:w-[280px] md:w-[310px] shrink-0 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-zinc-950/70 animate-pulse"
              >
                <div className="aspect-square bg-zinc-800/70" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 rounded bg-zinc-800" />
                  <div className="h-4 w-2/3 rounded bg-zinc-800" />
                  <div className="h-5 w-1/2 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="rounded-3xl border border-brand/30 bg-brand/5 px-6 py-10 text-center">
            <p className="text-zinc-300 mb-6">The merch preview is taking a minute, but the full drop is ready in our store.</p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-brand px-6 py-4 text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-white"
            >
              Visit the Shopify store
              <ArrowUpRight size={18} />
            </a>
          </div>
        )}

        {/* Horizontal Scrolling Carousel */}
        {!isLoading && !hasError && (
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
          >
            {products.map((product) => {
              const priceLabel = getPriceLabel(product);
              const isSoldOut = product.variants.length > 0 && product.variants.every((variant) => !variant.available);
              const productUrl = `${SHOP_URL}/products/${encodeURIComponent(product.handle)}`;
              const image = product.images[0];

              return (
                <a
                  key={product.id}
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-[240px] sm:w-[280px] md:w-[310px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-zinc-950/85 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-brand/10"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <img
                      src={image?.src ?? "/gzonetransparent.png"}
                      alt={image?.alt || product.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (target.getAttribute("src") !== "/gzonetransparent.png") {
                          target.src = "/gzonetransparent.png";
                          target.classList.remove("object-cover");
                          target.classList.add("object-contain", "p-8");
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    {isSoldOut && (
                      <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/85 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                        Sold out
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-sm sm:text-base font-black leading-snug text-white transition-colors group-hover:text-brand">
                      {product.title}
                    </h3>
                    <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/10 pt-4">
                      <span className="text-base sm:text-lg font-display text-brand">
                        {priceLabel ?? "View price"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                        View <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Final "Shop All Collection" Card */}
            <a
              href={`${SHOP_URL}/collections/all`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-[240px] sm:w-[280px] md:w-[310px] shrink-0 snap-start flex-col justify-center items-center rounded-2xl md:rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-8 text-center transition-all duration-300 hover:bg-brand/10 hover:border-brand hover:-translate-y-1.5"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4 text-brand group-hover:scale-110 group-hover:bg-brand group-hover:text-black transition-all duration-300">
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-display text-2xl uppercase text-white mb-2 group-hover:text-brand transition-colors">
                View Entire Drop
              </h4>
              <p className="text-zinc-400 text-xs font-medium mb-6 max-w-[200px] leading-relaxed">
                Browse all official Gzone apparel, accessories, cases, and drops on Shopify.
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/30 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand group-hover:bg-brand group-hover:text-black transition-all">
                Shopify Store <ArrowUpRight size={13} />
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
