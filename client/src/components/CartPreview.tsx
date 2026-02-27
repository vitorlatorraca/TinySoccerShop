import { CartItemWithProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { X, ShoppingBag, Minus, Plus, Truck } from "lucide-react";
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
  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col" data-testid="sheet-cart-preview">
        <SheetHeader className="border-b border-border/30 pb-4">
          <SheetTitle className="text-base font-semibold tracking-[-0.01em]">
            Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {/* Free shipping bar */}
        {items.length > 0 && remainingForFreeShipping > 0 && (
          <div className="py-3 border-b border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[12px] text-muted-foreground">
                Add <span className="font-semibold text-foreground">${remainingForFreeShipping.toFixed(2)}</span> for free shipping
              </p>
            </div>
            <div className="h-1 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500 ease-premium"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {items.length > 0 && remainingForFreeShipping <= 0 && (
          <div className="py-3 border-b border-border/30 flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-foreground" />
            <p className="text-[12px] font-medium text-foreground">Free shipping unlocked</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-foreground/[0.04] flex items-center justify-center mb-5">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground mb-1" data-testid="text-cart-empty">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Discover our curated collection of iconic jerseys.
              </p>
              <Button
                onClick={onClose}
                className="rounded-xl h-11 px-6"
              >
                Continue browsing
              </Button>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border/30">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 animate-fade-in"
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="w-20 h-24 rounded-lg bg-card border border-border/30 flex items-center justify-center p-2 shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="max-h-full w-full object-contain"
                      data-testid={`img-cart-item-${item.id}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-medium text-foreground line-clamp-1 tracking-[-0.01em]" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-[12px] text-muted-foreground mt-0.5" data-testid={`text-cart-item-details-${item.id}`}>
                          Size: {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 rounded-full hover:bg-foreground/5 transition-colors shrink-0"
                        data-testid={`button-cart-remove-${item.id}`}
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-0 border border-border/40 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 flex items-center justify-center hover:bg-foreground/5 disabled:opacity-30 transition-colors"
                        data-testid={`button-cart-decrease-${item.id}`}
                        aria-label="Decrease quantity"
                      >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-8 w-8 flex items-center justify-center text-[13px] font-medium border-x border-border/40" data-testid={`text-cart-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                          data-testid={`button-cart-increase-${item.id}`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[14px] font-semibold tabular-nums text-foreground" data-testid={`text-cart-item-price-${item.id}`}>
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-border/30 pt-4 pb-2 mt-auto">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums text-foreground" data-testid="text-cart-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                className="w-full h-13 rounded-xl text-[15px] font-semibold tracking-[-0.01em]"
                asChild
                data-testid="button-checkout"
              >
                <Link href="/checkout">
                  <a onClick={onClose}>Checkout</a>
                </Link>
              </Button>
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                data-testid="button-continue-shopping"
              >
                Continue shopping
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
