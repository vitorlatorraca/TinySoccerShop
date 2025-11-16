import { Product } from "@shared/schema";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onFavoriteToggle: (productId: string) => void;
  favorites: string[];
  onQuickView: (product: Product) => void;
  gridColumns?: 3 | 4;
}

export function ProductGrid({
  products,
  isLoading,
  onFavoriteToggle,
  favorites,
  onQuickView,
  gridColumns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${
          gridColumns === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
        data-testid="product-grid-loading"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl font-bold text-muted-foreground">0</span>
        </div>
        <h3 className="mb-2 text-2xl font-bold" data-testid="text-no-products">
          No products found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search for something different
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        gridColumns === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={favorites.includes(product.id)}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
