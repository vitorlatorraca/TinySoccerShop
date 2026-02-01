import { CartItemWithProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { X, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

interface CartPreviewProps {
  open: boolean;
  onClose: () => void;
  items: CartItemWithProduct[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function CartPreview({ open, onClose, items, onRemoveItem, onUpdateQuantity }: CartPreviewProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg" data-testid="sheet-cart-preview">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="mb-2 text-lg font-semibold" data-testid="text-cart-empty">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Add products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border p-4"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-none object-contain bg-card border border-border/60 p-2"
                    data-testid={`img-cart-item-${item.id}`}
                  />
                  <div className="flex flex-1 flex-col">
                    <h4 className="mb-1 line-clamp-1 font-semibold" data-testid={`text-cart-item-name-${item.id}`}>
                      {item.product.name}
                    </h4>
                    <p className="mb-2 text-sm text-muted-foreground" data-testid={`text-cart-item-details-${item.id}`}>
                      {item.product.club} • Tamanho: {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="font-bold tabular-nums" data-testid={`text-cart-item-price-${item.id}`}>
                        CAD ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-cart-decrease-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center" data-testid={`text-cart-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-cart-increase-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveItem(item.id)}
                    data-testid={`button-cart-remove-${item.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-8 border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-bold tabular-nums" data-testid="text-cart-subtotal">
                  CAD ${subtotal.toFixed(2)}
                </span>
              </div>
              <Button size="lg" className="w-full" asChild data-testid="button-checkout">
                <Link href="/checkout">
                  <a onClick={onClose}>Finalizar Compra</a>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onClose}
                data-testid="button-continue-shopping"
              >
                Continuar Comprando
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
