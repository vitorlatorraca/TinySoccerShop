import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  homeHref: string;
  awayHref: string;
}

const SLIDES: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600",
    eyebrow: "CHAMPIONS LEAGUE 1998/99",
    title: "Red Devils. Theatre of Dreams.",
    subtitle: "A place in history awaits.",
    homeHref: "/shop?club=Manchester+United&kit=home",
    awayHref: "/shop?club=Manchester+United&kit=away",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551958219-acbc595b8bbd?w=1600",
    eyebrow: "LA LIGA 2008/09",
    title: "Born in Barcelona. Forever in Blue.",
    subtitle: "Camp Nou nights, written into the cloth.",
    homeHref: "/shop?club=Barcelona&kit=home",
    awayHref: "/shop?club=Barcelona&kit=away",
  },
  {
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6dae1434d5?w=1600",
    eyebrow: "SERIE A 1989/90",
    title: "Rossoneri. The Cathedral of Football.",
    subtitle: "San Siro under floodlights.",
    homeHref: "/shop?club=AC+Milan&kit=home",
    awayHref: "/shop?club=AC+Milan&kit=away",
  },
];

interface HeroCarouselProps {
  // Kept for API compatibility with Home.tsx — products are no longer used
  // by this hero, which now ships editorial photography instead of jersey PNGs.
  products?: Product[];
}

export function HeroCarousel(_: HeroCarouselProps = {}) {
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
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black"
      aria-label="Featured collection"
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className="flex-[0_0_100%] min-w-0 h-full relative"
            >
              {/* Background photo — fills entire viewport */}
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: selectedIndex === i ? "scale(1)" : "scale(1.05)",
                  transition: "transform 8s ease-out",
                }}
              />

              {/* Subtle bottom gradient — only the lower half darkens for legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)",
                }}
              />

              {/* Bottom-left editorial copy */}
              <div className="absolute inset-x-0 bottom-0">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pb-20 sm:pb-24 lg:pb-28">
                  <div
                    className="max-w-2xl"
                    style={{
                      opacity: selectedIndex === i ? 1 : 0,
                      transform:
                        selectedIndex === i ? "translateY(0)" : "translateY(24px)",
                      transition:
                        "opacity 600ms ease 200ms, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms",
                    }}
                  >
                    <p className="text-white/90 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.32em]">
                      {slide.eyebrow}
                    </p>
                    <h1 className="mt-5 sm:mt-6 font-display text-white text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.95] tracking-[0.01em] uppercase font-bold">
                      {slide.title}
                    </h1>
                    <p className="mt-4 sm:mt-5 text-white/85 text-base sm:text-lg italic font-light max-w-md">
                      {slide.subtitle}
                    </p>
                    <div className="mt-7 sm:mt-8 flex items-center gap-3 sm:gap-4 flex-wrap">
                      <Link
                        href={slide.homeHref}
                        className="tss-btn-primary"
                      >
                        Shop Home
                      </Link>
                      <Link
                        href={slide.awayHref}
                        className="tss-btn-ghost-light"
                      >
                        Shop Away
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thin discreet side arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 h-12 w-12 inline-flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-7 w-7" strokeWidth={1.25} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 h-12 w-12 inline-flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <ChevronRight className="h-7 w-7" strokeWidth={1.25} />
      </button>

      {/* Centered dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group p-1.5"
          >
            <span
              className={[
                "block h-[6px] rounded-full transition-all duration-300",
                selectedIndex === i
                  ? "w-8 bg-white"
                  : "w-[6px] bg-white/40 group-hover:bg-white/70",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
