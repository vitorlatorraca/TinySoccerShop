import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CartItemWithProduct, Product } from "@shared/schema";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { CartPreview } from "@/components/CartPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/productUtils";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/shop/HeroCarousel";
import { Ticker } from "@/components/shop/Ticker";
import { FeaturedGrid } from "@/components/shop/FeaturedGrid";
import { CategoriesGrid } from "@/components/shop/CategoriesGrid";
import { ClubCarousel } from "@/components/shop/ClubCarousel";
import { IconicNights } from "@/components/shop/IconicNights";
import { ScrollReveal } from "@/components/shop/ScrollReveal";
import { Shield, Truck, RotateCcw, Instagram } from "lucide-react";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addProduct, setAddProduct] = useState<Product | null>(null);
  const [addSize, setAddSize] = useState<string>("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, size }: { productId: string; size: string }) =>
      await apiRequest("POST", "/api/cart", { productId, size, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) =>
      await apiRequest("PATCH", `/api/cart/${id}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const removeCartMutation = useMutation({
    mutationFn: async (id: string) =>
      await apiRequest("DELETE", `/api/cart/${id}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const handleRemoveCartItem = (itemId: string) => removeCartMutation.mutate(itemId);
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity });
  };

  const confirmAddToCart = () => {
    if (!addProduct || !addSize) return;
    addToCartMutation.mutate(
      { productId: addProduct.id, size: addSize },
      { onSuccess: () => setAddOpen(false) }
    );
  };

  return (
    <PageShell
      header={
        <>
          <TopBar />
          <Header
            cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            favoritesCount={0}
            onCartClick={() => setCartOpen(true)}
          />
        </>
      }
      footer={
        <footer className="bg-foreground text-primary-foreground">
          <div className="border-b border-white/10">
            <Container className="py-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authenticity Guaranteed</p>
                    <p className="text-[12px] text-white/50 mt-0.5">Every item verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Worldwide Shipping</p>
                    <p className="text-[12px] text-white/50 mt-0.5">On orders over $150</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">14-Day Returns</p>
                    <p className="text-[12px] text-white/50 mt-0.5">Hassle-free policy</p>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <Container className="py-14">
            <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
              <div>
                <p className="font-display text-xl font-semibold tracking-[-0.02em]">TinySoccerShop</p>
                <p className="mt-4 text-sm text-white/50 max-w-sm leading-relaxed">
                  Iconic football jerseys. Every shirt carries a story.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 mb-4">Shop</p>
                <ul className="space-y-3">
                  <li><Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors">All Jerseys</Link></li>
                  <li><a href="#featured" className="text-sm text-white/70 hover:text-white transition-colors">Collection</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 mb-4">Support</p>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Size Guide</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Shipping</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Returns</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 mb-4">About</p>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Authenticity</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-white/30">&copy; {new Date().getFullYear()} TinySoccerShop</p>
            </div>
          </Container>
        </footer>
      }
    >
      {/* 1 — Hero Carousel */}
      <HeroCarousel products={products} />

      {/* 2 — Ticker Stripe */}
      <Ticker />

      {/* 3 — Featured Jerseys */}
      <div id="featured">
        <ScrollReveal>
          <FeaturedGrid products={products} />
        </ScrollReveal>
      </div>

      {/* 4 — Categories */}
      <ScrollReveal>
        <CategoriesGrid products={products} />
      </ScrollReveal>

      {/* 5 — Club Carousel */}
      <ScrollReveal>
        <ClubCarousel products={products} />
      </ScrollReveal>

      {/* 6 — Iconic Nights */}
      <ScrollReveal>
        <IconicNights products={products} />
      </ScrollReveal>

      {/* Add to cart dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold tracking-[-0.01em]">Add to cart</DialogTitle>
          </DialogHeader>
          {addProduct ? (
            <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-card rounded-xl p-4 border border-border/30">
                <div className="aspect-[4/5] flex items-center justify-center">
                  <img
                    src={addProduct.imageUrl}
                    alt={addProduct.name}
                    className="jersey-img h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="brand-overline mb-2">{addProduct.league}</p>
                <h3 className="font-medium text-foreground tracking-[-0.01em]">{addProduct.club}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{addProduct.season}</p>
                <p className="mt-4 brand-price text-foreground">{formatPrice(addProduct.price)}</p>
                <div className="mt-5">
                  <p className="text-sm font-medium text-foreground mb-2.5">Select size</p>
                  <div className="grid grid-cols-4 gap-2">
                    {addProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAddSize(s)}
                        className={[
                          "h-11 rounded-lg text-sm font-medium transition-all duration-200",
                          addSize === s
                            ? "bg-foreground text-background ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            : "border border-border/60 text-foreground hover:border-foreground/40",
                        ].join(" ")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-2">
                  <button
                    className="h-12 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
                    disabled={!addSize || addToCartMutation.isPending}
                    onClick={confirmAddToCart}
                  >
                    Add to cart
                  </button>
                  <Link
                    href={`/product/${addProduct.slug}`}
                    className="h-11 rounded-xl border border-border/50 text-sm font-medium text-foreground flex items-center justify-center hover:border-foreground/30 transition-colors"
                    onClick={() => setAddOpen(false)}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <CartPreview
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </PageShell>
  );
}
