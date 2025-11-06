import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Eye } from "lucide-react";
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
    if (product.isAutographed) badges.push({ text: "AUTOGRAFADO", variant: "default" as const });
    if (product.isLimitedEdition) badges.push({ text: "EDIÇÃO LIMITADA", variant: "secondary" as const });
    if (product.featured) badges.push({ text: "DESTAQUE", variant: "destructive" as const });
    return badges;
  };

  const badges = getBadges();
  const displayImage = isHovered && product.imageHoverUrl ? product.imageHoverUrl : product.imageUrl;

  return (
    <Card
      className="group relative overflow-hidden border transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.slug}`}>
        <a className="block">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-product-${product.id}`}
            />
            {badges.length > 0 && (
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant}
                    className="text-xs"
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
                  ESGOTADO
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground" data-testid={`text-club-${product.id}`}>
                {product.club}
              </p>
              {product.season && (
                <p className="text-xs text-muted-foreground" data-testid={`text-season-${product.id}`}>
                  {product.season}
                </p>
              )}
            </div>

            <h3 className="mb-2 line-clamp-2 text-base font-semibold" data-testid={`text-name-${product.id}`}>
              {product.name}
            </h3>

            {product.player && (
              <p className="mb-2 text-sm text-muted-foreground" data-testid={`text-player-${product.id}`}>
                {product.player}
              </p>
            )}

            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums" data-testid={`text-price-${product.id}`}>
                CAD ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                data-testid={`button-quick-view-${product.id}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
              <Button
                size="icon"
                variant={isFavorite ? "default" : "outline"}
                className="shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle(product.id);
                }}
                data-testid={`button-favorite-${product.id}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </a>
      </Link>
    </Card>
  );
}
