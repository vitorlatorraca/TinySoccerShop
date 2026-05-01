import { Product } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/productUtils";

interface ProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string) => void;
  isFavorite: boolean;
  onQuickView: (product: Product) => void;
}

function getBadge(
  product: Product,
): { label: string; variant: "sale" | "new" | "vault" } | null {
  if (!product.inStock) return { label: "Sale", variant: "sale" };
  if (product.isLimitedEdition) return { label: "Vault", variant: "vault" };
  if (product.featured) return { label: "New In", variant: "new" };
  return null;
}

export function ProductCard({
  product,
  onFavoriteToggle: _onFavoriteToggle,
  isFavorite: _isFavorite,
  onQuickView: _onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImage =
    isHovered && product.imageHoverUrl ? product.imageHoverUrl : product.imageUrl;
  const badge = getBadge(product);
  const isSale = badge?.variant === "sale";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
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
            src={displayImage}
            alt={product.name}
            loading="lazy"
            data-testid={`img-product-${product.id}`}
          />
        </div>

        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-sub">
            {product.club} &middot; {product.league}
          </p>
          <p
            className={`product-card-price${isSale ? " sale" : ""}`}
            data-testid={`text-price-${product.id}`}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </article>
    </Link>
  );
}
