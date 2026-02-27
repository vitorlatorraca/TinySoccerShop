import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/productUtils";
import { ArrowRight } from "lucide-react";

interface HeroSlide {
  product: Product;
  tagline: string;
  subtitle: string;
}

interface HeroCarouselProps {
  products: Product[];
}

const SLIDE_META: Record<string, { tagline: string; subtitle: string }> = {
  "Barcelona": { tagline: "Born in Barcelona.", subtitle: "Camp Nou Nights." },
  "AC Milan": { tagline: "Rossoneri Glory.", subtitle: "San Siro Legends." },
  "Chelsea": { tagline: "London Blue.", subtitle: "Stamford Bridge." },
  "Manchester United": { tagline: "Red Devils.", subtitle: "Theatre of Dreams." },
  "Corinthians": { tagline: "Fiel Torcida.", subtitle: "São Paulo Nights." },
  "Arsenal": { tagline: "North London.", subtitle: "Highbury Spirit." },
  "Real Madrid": { tagline: "Hala Madrid.", subtitle: "Bernabéu Nights." },
};

function getSlideData(product: Product): HeroSlide {
  const meta = SLIDE_META[product.club] ?? {
    tagline: product.club + ".",
    subtitle: product.season + ".",
  };
  return { product, ...meta };
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const featured = products.filter((p) => p.featured).slice(0, 5);
  const slides = (featured.length > 0 ? featured : products.slice(0, 5)).map(getSlideData);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[85vh] lg:h-[92vh] overflow-hidden bg-[#0c0c0c]">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map(({ product, tagline, subtitle }, i) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] min-w-0 h-full relative"
            >
              {/* Subtle radial spotlight */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-[60%] sm:h-[68%] lg:h-[72%] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-premium"
                  style={{
                    opacity: selectedIndex === i ? 1 : 0.3,
                    transform: selectedIndex === i ? "scale(1)" : "scale(0.9)",
                    transition: "opacity 600ms ease, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
                  <div
                    className="max-w-md"
                    style={{
                      opacity: selectedIndex === i ? 1 : 0,
                      transform: selectedIndex === i ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 500ms ease 200ms, transform 500ms ease 200ms",
                    }}
                  >
                    <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em] mb-2">
                      {product.season}
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[0.95] tracking-tight">
                      {tagline}
                    </h2>
                    <p className="text-white/50 text-sm sm:text-base mt-2">{subtitle}</p>
                    <div className="flex items-center gap-5 mt-5">
                      <span className="text-white text-xl font-semibold tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-200"
                      >
                        Shop Now
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal dot indicators */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group p-1.5"
          >
            <span
              className={[
                "block rounded-full transition-all duration-300",
                selectedIndex === i
                  ? "w-7 h-[3px] bg-white"
                  : "w-[3px] h-[3px] bg-white/30 group-hover:bg-white/60",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
