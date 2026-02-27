import { Link } from "wouter";
import type { Product } from "@shared/schema";
import {
  inferCompetition,
  inferEra,
  inferCondition,
  formatPrice,
} from "@/lib/productUtils";
import { MetadataTag } from "./MetadataTag";

interface JerseyCardProps {
  product: Product;
}

export function JerseyCard({ product }: JerseyCardProps) {
  const competition = inferCompetition(product);
  const era = inferEra(product);
  const condition = inferCondition(product);

  return (
    <article
      className="group flex flex-col animate-fade-in-up"
      data-testid={`card-shop-${product.slug}`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        data-testid={`link-shop-${product.slug}`}
      >
        <div className="flex flex-col flex-1">
          <div className="relative bg-card rounded-lg overflow-hidden border border-border/30 transition-all duration-[350ms] ease-premium group-hover:border-foreground/10 group-hover:shadow-lg">
            <div className="aspect-[4/5] flex items-center justify-center p-6 sm:p-10">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="jersey-img max-h-full w-full object-contain transition-transform duration-[400ms] ease-premium group-hover:scale-[1.03]"
                loading="lazy"
                data-testid={`img-jersey-${product.slug}`}
              />
            </div>

            {product.isLimitedEdition && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-foreground text-background rounded-full">
                Limited
              </span>
            )}
            {!product.inStock && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] bg-muted text-muted-foreground rounded-full">
                Sold out
              </span>
            )}
          </div>

          <div className="pt-4 pb-2 space-y-1.5">
            <div className="flex justify-between items-start gap-3">
              <h3
                className="font-medium text-[15px] text-foreground tracking-[-0.01em] leading-tight"
                data-testid={`text-club-${product.slug}`}
              >
                {product.club}
              </h3>
              <span
                className="brand-price text-foreground shrink-0"
                data-testid={`text-price-${product.slug}`}
              >
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">{product.name}</p>
          </div>
        </div>
      </Link>

      <div className="pt-2 pb-3 flex flex-wrap gap-1.5">
        <MetadataTag emphasis>{product.league}</MetadataTag>
        <MetadataTag>{competition}</MetadataTag>
        <MetadataTag>{era}</MetadataTag>
        <MetadataTag>{condition}</MetadataTag>
      </div>
    </article>
  );
}
