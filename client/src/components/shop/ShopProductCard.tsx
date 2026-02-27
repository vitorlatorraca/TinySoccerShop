import { Product } from "@shared/schema";
import { Link } from "wouter";

interface ShopProductCardProps {
  product: Product;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const price = parseFloat(product.price);
  const isBestSeller = product.featured;

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <article
        className="animate-fade-in-up"
        data-testid={`card-shop-${product.id}`}
      >
        <div className="relative rounded-xl overflow-hidden bg-card border border-border/30 transition-all duration-[350ms] ease-premium group-hover:border-foreground/10 group-hover:shadow-lg">
          <div className="aspect-[3/4] flex items-center justify-center p-4 sm:p-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full w-full object-contain jersey-img transition-transform duration-[400ms] ease-premium group-hover:scale-[1.03]"
              loading="lazy"
              data-testid={`img-shop-${product.id}`}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isLimitedEdition && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-foreground text-background rounded-full">
                Limited
              </span>
            )}
            {isBestSeller && !product.isLimitedEdition && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-foreground/10 text-foreground backdrop-blur-sm rounded-full">
                Best Seller
              </span>
            )}
            {!product.inStock && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-muted/80 text-muted-foreground backdrop-blur-sm rounded-full">
                Sold Out
              </span>
            )}
          </div>
        </div>

        <div className="pt-3.5 pb-1.5 space-y-1">
          <h3 className="font-medium text-[14px] text-foreground leading-tight line-clamp-2 tracking-[-0.01em]">
            {product.name}
          </h3>
          <p className="text-[12px] text-muted-foreground">
            {product.condition}
          </p>
          <p
            className="text-[15px] font-semibold tabular-nums text-foreground tracking-[-0.01em] pt-0.5"
            data-testid={`text-price-${product.id}`}
          >
            ${price.toFixed(2)}
          </p>
        </div>
      </article>
    </Link>
  );
}
