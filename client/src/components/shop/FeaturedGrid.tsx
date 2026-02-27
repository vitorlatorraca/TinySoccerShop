import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/productUtils";

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-spacing-lg" aria-label="Featured Shirts">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="brand-overline mb-3">Featured</p>
            <h2 className="brand-section-title text-foreground">The Collection</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group flex flex-col"
            >
              <div className="relative bg-card rounded-xl overflow-hidden border border-border/30 transition-all duration-300 ease-premium group-hover:border-foreground/10 group-hover:shadow-lg">
                <div className="aspect-[3/4] flex items-center justify-center p-4 sm:p-8">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="jersey-img max-h-full w-full object-contain transition-transform duration-[400ms] ease-premium group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>
                {product.isLimitedEdition && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-foreground text-background rounded-full">
                    Limited
                  </span>
                )}
              </div>
              <div className="pt-3 pb-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm text-foreground tracking-tight leading-tight truncate">
                    {product.club}
                  </h3>
                  <span className="text-sm font-semibold text-foreground shrink-0 tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {product.season}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
