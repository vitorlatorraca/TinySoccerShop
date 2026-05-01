import { Product } from "@shared/schema";
import { Link } from "wouter";
import { formatPrice } from "@/lib/productUtils";

interface ShopProductCardProps {
  product: Product;
}

function getBadge(
  product: Product,
): { label: string; variant: "sale" | "new" | "vault" } | null {
  if (!product.inStock) return { label: "Sale", variant: "sale" };
  if (product.isLimitedEdition) return { label: "Vault", variant: "vault" };
  if (product.featured) return { label: "New In", variant: "new" };
  return null;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const badge = getBadge(product);
  const isSale = badge?.variant === "sale";

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <article className="product-card" data-testid={`card-shop-${product.id}`}>
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
            data-testid={`img-shop-${product.id}`}
          />
        </div>

        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-sub">
            {product.club} &middot; {product.season}
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
