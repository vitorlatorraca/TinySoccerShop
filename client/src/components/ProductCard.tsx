import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string) => void;
  isFavorite: boolean;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onFavoriteToggle, isFavorite, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBadges = () => {
    const badges = [];
    if (product.isAutographed) badges.push({ text: "AUTOGRAPHED", variant: "default" as const });
    if (product.isLimitedEdition) badges.push({ text: "LIMITED EDITION", variant: "secondary" as const });
    if (product.featured) badges.push({ text: "FEATURED", variant: "destructive" as const });
    return badges;
  };

  const badges = getBadges();
  const displayImage = isHovered && product.imageHoverUrl ? product.imageHoverUrl : product.imageUrl;

  const conditionLabel = product.condition === "New with tags" ? "Brand New" :
                        product.condition === "Excellent condition" ? "Brand New" :
                        product.condition === "New without tags" ? "Brand New" :
                        product.condition === "Good condition" ? "Good" :
                        product.condition || "Brand New";

  return (
    <Card
      className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-white">
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-product-${product.id}`}
            />
            {/* Multiple Sizes badge - CFS style */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="absolute left-0 top-0">
                <div className="bg-[#1a5d2e] text-white text-[10px] font-bold px-2 py-1 transform -rotate-12 origin-top-left">
                  MULTIPLE SIZES
                </div>
              </div>
            )}
            {badges.length > 0 && (!product.sizes || product.sizes.length <= 1) && (
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant}
                    className="text-xs bg-[#1a5d2e] text-white"
                    data-testid={`badge-${badge.text.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="secondary" className="text-sm">
                  OUT OF STOCK
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="mb-1 text-base font-bold text-black leading-tight line-clamp-2" data-testid={`text-name-${product.id}`}>
              {product.name}
            </h3>
            <p className="mb-2 text-sm text-black font-normal" data-testid={`text-condition-${product.id}`}>
              Condition: {conditionLabel}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tabular-nums text-black" data-testid={`text-price-${product.id}`}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>
          </div>
        </Link>
      </Card>
    );
}
