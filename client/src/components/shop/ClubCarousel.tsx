import { useCallback, useMemo } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClubCarouselProps {
  products: Product[];
}

interface ClubEntry {
  name: string;
  product: Product;
}

export function ClubCarousel({ products }: ClubCarouselProps) {
  const clubs = useMemo<ClubEntry[]>(() => {
    const seen = new Map<string, Product>();
    for (const p of products) {
      if (!seen.has(p.club)) seen.set(p.club, p);
    }
    return Array.from(seen.entries()).map(([name, product]) => ({ name, product }));
  }, [products]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (clubs.length === 0) return null;

  return (
    <section className="section-spacing border-t border-border/30" aria-label="Shop by Club">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="brand-overline mb-3">Browse</p>
            <h2 className="brand-section-title text-foreground">By Club</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4 sm:gap-5">
            {clubs.map(({ name, product }) => (
              <Link
                key={name}
                href={`/shop?club=${encodeURIComponent(name)}`}
                className="group flex-[0_0_70%] sm:flex-[0_0_38%] lg:flex-[0_0_22%] min-w-0"
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border/30 transition-all duration-300 ease-premium group-hover:border-foreground/10 group-hover:shadow-md">
                  <div className="aspect-square flex items-center justify-center p-6 sm:p-8">
                    <img
                      src={product.imageUrl}
                      alt={name}
                      className="jersey-img max-h-full w-full object-contain transition-transform duration-[400ms] ease-premium group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-foreground text-center">
                  {name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
