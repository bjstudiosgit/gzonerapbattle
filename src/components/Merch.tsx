import { motion } from "motion/react";
import { ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Ginja Entertainment Unisex Tshirt (orange)",
    price: "£45",
    image: "/shop1-ginjaltd.png",
    tag: "Limited Drop",
    soldOut: true
  },
  {
    id: 2,
    name: "Ginja Entertainment Unisex Tshirt (white)",
    price: "£45",
    image: "/shop2-ginjaltdwhite.png",
    tag: "Limited Drop",
    soldOut: true
  },
  {
    id: 3,
    name: "Ginja Entertainment Unisex Tshirt",
    price: "£45",
    image: "/shop3-topgtshirt.png",
    tag: "Limited Drop",
    soldOut: true
  },
  {
    id: 4,
    name: "Ginja Entertainment Unisex Hoody",
    price: "£45",
    image: "/shop4-topghoody.png",
    tag: "Limited Drop",
    soldOut: true
  }
];

export default function Merch() {
  return (
    <section id="merch" className="py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Official Gear</h2>
          <h3 className="text-5xl md:text-6xl font-display italic uppercase leading-tight">
            You missed it. <br />
            <span className="text-brand">Sold out. Try our next drop!!</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-zinc-900">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-brand/20">
                    {product.tag}
                  </span>
                </div>
                {product.soldOut && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-red-500/20">
                      Sold Out
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    disabled={product.soldOut}
                    aria-label={product.soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
                    className={`${product.soldOut ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed px-6 py-3 font-bold uppercase tracking-widest text-xs' : 'bg-brand text-black p-4'} rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform`}
                  >
                    {product.soldOut ? 'Sold Out' : <ShoppingBag size={24} />}
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-zinc-100 mb-1">{product.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-brand font-display italic">{product.price}</span>
                <div className="flex text-brand">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 p-12 bg-zinc-900 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h4 className="text-3xl font-display italic uppercase mb-2">Sign up to the Gzone mailing list</h4>
            <p className="text-zinc-200">Get early access to limited drops and exclusive event merch.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-zinc-950 border border-white/10 rounded-xl px-6 py-3 flex-1 md:w-64 focus:outline-none focus:border-brand transition-colors"
            />
            <button 
              aria-label="Join the G Zone mailing list"
              className="bg-brand text-black px-6 py-3 rounded-xl font-bold"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
