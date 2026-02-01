import { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string) => void;
  isFavorite: boolean;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  onFavoriteToggle: _onFavoriteToggle,
  isFavorite: _isFavorite,
  onQuickView: _onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImage = isHovered && product.imageHoverUrl ? product.imageHoverUrl : product.imageUrl;

  return (
    <Card
      className={[
        "group relative overflow-hidden rounded-none",
        "border border-border/70 bg-card",
        "transition-transform duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(0,0,0,0.08)]",
      ].join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="px-6 pt-7 sm:px-7 sm:pt-8">
          <p className="archive-kicker">JERSEY • EDITION</p>
          <h3 className="mt-2 font-medium tracking-[-0.01em]">{product.club}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{product.name}</p>
        </div>

        <div className="px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
          {/* STRICT: product area = PNG jersey only, isolated, object-contain */}
          <div className="relative aspect-[4/5] overflow-visible">
            <img
              src={displayImage}
              alt={product.name}
              className={[
                "archive-jersey absolute inset-0 m-auto h-full w-full object-contain",
                "transition-transform duration-200 ease-out",
                "group-hover:scale-[1.04]",
              ].join(" ")}
              loading="lazy"
              data-testid={`img-product-${product.id}`}
            />
          </div>
        </div>

        <div className="px-6 pb-7 sm:px-7 sm:pb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold tabular-nums tracking-[0.02em]" data-testid={`text-price-${product.id}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">{product.league}</p>
          </div>
        </div>
      </Link>
      </Card>
    );
}
