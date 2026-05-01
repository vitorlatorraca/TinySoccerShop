import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/productUtils";

interface FeaturedGridProps {
  products: Product[];
}

function getBadge(
  product: Product,
  index: number,
): { label: string; variant: "sale" | "new" | "vault" } | null {
  if (!product.inStock) return { label: "Sale", variant: "sale" };
  if (product.isLimitedEdition) return { label: "Vault", variant: "vault" };
  if (product.featured && index < 4) return { label: "New In", variant: "new" };
  return null;
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  if (products.length === 0) return null;

  const list = products.slice(0, 10);

  return (
    <section
      className="tss-cream py-16 sm:py-20 lg:py-24"
      aria-label="Featured Jerseys"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="tss-eyebrow text-[color:var(--color-green-dark)] mb-3">
              Featured
            </p>
            <h2 className="tss-display text-[color:var(--color-black)] text-[clamp(2rem,4.5vw,3.5rem)]">
              Featured Jerseys
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-green-dark)] hover:text-[color:var(--color-green-light)] transition-colors whitespace-nowrap"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="product-grid">
          {list.map((product, i) => {
            const badge = getBadge(product, i);
            const isSale = badge?.variant === "sale";
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block tss-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 70, 420)}ms` }}
              >
                <article className="product-card">
                  <div className="product-card-image-wrapper">
                    {badge && (
                      <span
                        className={`product-badge ${
                          badge.variant === "sale"
                            ? "sale"
                            : badge.variant === "new"
                              ? "new"
                              : ""
                        }`}
                      >
                        {badge.label}
                      </span>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="product-card-info">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-sub">
                      {product.club} &middot; {product.season}
                    </p>
                    <p className={`product-card-price${isSale ? " sale" : ""}`}>
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
