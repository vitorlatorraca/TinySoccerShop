import { Link } from "wouter";
import { STORIES } from "@/content/stories";
import type { Product } from "@shared/schema";

interface IconicNightsProps {
  products: Product[];
}

export function IconicNights({ products }: IconicNightsProps) {
  const storiesWithProducts = STORIES.map((story) => {
    const product = products.find((p) => p.slug === story.linkedProductSlug);
    return { story, product };
  })
    .filter((s) => s.product != null)
    .slice(0, 3);

  if (storiesWithProducts.length === 0) return null;

  return (
    <section className="section-spacing-lg border-t border-border/30" aria-label="Iconic Nights">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="brand-overline mb-3">Heritage</p>
          <h2 className="brand-section-title text-foreground">Iconic Nights</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {storiesWithProducts.map(({ story, product }) => (
            <Link
              key={story.id}
              href={`/product/${product!.slug}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border/30 transition-all duration-300 ease-premium hover:border-foreground/10 hover:shadow-lg"
            >
              <div className="aspect-[4/5] flex items-center justify-center p-8 sm:p-10">
                <img
                  src={product!.imageUrl}
                  alt={product!.name}
                  className="jersey-img max-h-full w-full object-contain transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 sm:p-6">
                <p className="text-white/50 text-[10px] font-medium uppercase tracking-[0.15em]">
                  {story.era}
                </p>
                <p className="text-white text-sm font-medium mt-1 leading-tight">
                  {story.club}
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  {story.title.split(".")[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
