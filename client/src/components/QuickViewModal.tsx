import { Product } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, size: string) => void;
  onFavoriteToggle: (productId: string) => void;
  isFavorite: boolean;
}

export function QuickViewModal({
  product,
  open,
  onClose,
  onAddToCart,
  onFavoriteToggle,
  isFavorite,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!product) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product.id, selectedSize);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" data-testid="dialog-quick-view">
        <DialogHeader>
          <DialogTitle className="sr-only">Visualização Rápida</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-none bg-card border border-border/60">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain p-6 sm:p-8"
              data-testid="img-quick-view-product"
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="secondary">ESGOTADO</Badge>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" data-testid="badge-quick-view-club">
                {product.club}
              </Badge>
              {product.league && (
                <Badge variant="outline" data-testid="badge-quick-view-league">
                  {product.league}
                </Badge>
              )}
            </div>

            <h2 className="mb-2 text-2xl font-bold" data-testid="text-quick-view-name">
              {product.name}
            </h2>

            {product.player && (
              <p className="mb-4 text-lg text-muted-foreground" data-testid="text-quick-view-player">
                {product.player}
              </p>
            )}

            <div className="mb-4 flex flex-wrap gap-2">
              {product.isAutographed && (
                <Badge variant="default" data-testid="badge-quick-view-autographed">
                  AUTOGRAFADO
                </Badge>
              )}
              {product.isLimitedEdition && (
                <Badge variant="secondary" data-testid="badge-quick-view-limited">
                  EDIÇÃO LIMITADA
                </Badge>
              )}
              {product.hasCertificate && (
                <Badge variant="outline" data-testid="badge-quick-view-certificate">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  CERTIFICADO
                </Badge>
              )}
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold tabular-nums" data-testid="text-quick-view-price">
                CAD ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold">TAMANHO</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    disabled={!product.inStock}
                    data-testid={`button-quick-view-size-${size.toLowerCase()}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4 grid gap-2">
              <p className="text-sm">
                <span className="font-semibold">Temporada:</span> {product.season}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Tipo:</span> {product.type}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Condição:</span> {product.condition}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Marca:</span> {product.brand}
              </p>
            </div>

            <div className="mt-auto grid gap-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize || !product.inStock}
                data-testid="button-quick-view-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onFavoriteToggle(product.id)}
                  data-testid="button-quick-view-favorite"
                >
                  <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-quick-view-details">
                  <Link href={`/product/${product.slug}`}>
                    <a onClick={onClose}>Ver Todos Detalhes</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
