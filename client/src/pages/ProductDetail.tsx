import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, CartItemWithProduct } from "@shared/schema";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { CartPreview } from "@/components/CartPreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, CheckCircle, Shield, Award, ChevronLeft, Truck, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { STORIES } from "@/content/stories";
import { ImageStage, type ImageStageMode } from "@/components/editorial/ImageStage";
import { formatPrice } from "@/lib/productUtils";

export default function ProductDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/product/:slug");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [stage, setStage] = useState<ImageStageMode>("artifact");

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ['/api/products', params?.slug],
    enabled: !!params?.slug,
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  const { data: favorites = [] } = useQuery<{id: string, productId: string}[]>({
    queryKey: ['/api/favorites'],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, size }: { productId: string; size: string }) => {
      return await apiRequest('POST', '/api/cart', { productId, size, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return await apiRequest('PATCH', `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/cart/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const existingFavorite = favorites.find((f) => f.productId === productId);
      if (existingFavorite) {
        return await apiRequest('DELETE', `/api/favorites/${existingFavorite.id}`, {});
      } else {
        return await apiRequest('POST', '/api/favorites', { productId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
  });

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    addToCartMutation.mutate({ productId: product.id, size: selectedSize }, {
      onSuccess: () => {
        toast({
          title: "Added to cart",
          description: `${product.name} — Size ${selectedSize}`,
          duration: 2000,
        });
      },
    });
  };

  const handleFavoriteToggle = () => {
    if (!product) return;

    const existingFavorite = favorites.find((f) => f.productId === product.id);
    const action = existingFavorite ? "removed from" : "added to";

    toggleFavoriteMutation.mutate(product.id, {
      onSuccess: () => {
        toast({
          title: `Product ${action} favorites`,
          duration: 2000,
        });
      },
    });
  };

  const handleRemoveCartItem = (itemId: string) => {
    removeCartMutation.mutate(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity });
  };

  const favoriteProductIds = favorites.map((f) => f.productId);
  const isFavorite = product ? favoriteProductIds.includes(product.id) : false;
  const allImages = product ? [product.imageUrl, ...(product.images || [])] : [];
  const linkedStory = product ? STORIES.find((s) => s.linkedProductSlug === product.slug) : null;
  const hasNarrative = linkedStory && linkedStory.cover.kind === "image";

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoritesCount={favorites.length}
          onCartClick={() => setCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <div className="h-4 w-32 skeleton-premium" />
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="aspect-square skeleton-premium rounded-xl" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 skeleton-premium rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6 py-4">
              <div className="h-3 w-20 skeleton-premium" />
              <div className="h-8 w-3/4 skeleton-premium" />
              <div className="h-10 w-32 skeleton-premium" />
              <div className="h-12 w-full skeleton-premium rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoritesCount={favorites.length}
          onCartClick={() => setCartOpen(true)}
        />
        <div className="container mx-auto flex h-96 items-center justify-center px-4">
          <div className="text-center animate-fade-in">
            <h1 className="mb-4 brand-headline text-foreground">Product not found</h1>
            <p className="mb-8 text-muted-foreground">This item may have been removed or doesn't exist.</p>
            <Button asChild className="rounded-xl h-12 px-8">
              <Link href="/">
                <a>Back to shop</a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stockCount = product.inStock ? Math.floor(Math.random() * 4) + 1 : 0;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8" data-testid="button-back">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in">
          {/* LEFT: Image area */}
          <div className="space-y-4">
            {hasNarrative && linkedStory && linkedStory.cover.kind === "image" ? (
              <ImageStage
                artifactImageUrl={product.imageUrl}
                artifactAlt={product.name}
                contextImageUrl={linkedStory.cover.url}
                contextAlt={linkedStory.cover.alt}
                stage={stage}
                onStageChange={setStage}
              />
            ) : (
              <>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-card border border-border/30">
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-contain p-8 sm:p-12 transition-transform duration-500 ease-premium hover:scale-[1.03]"
                    data-testid="img-product-main"
                  />
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-3">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index
                            ? "border-foreground"
                            : "border-border/30 hover:border-foreground/30"
                        }`}
                        data-testid={`button-thumbnail-${index}`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: Product info */}
          <div className="flex flex-col lg:py-4">
            {hasNarrative && stage === "context" ? (
              <div className="animate-fade-in">
                <h1
                  className="brand-headline text-foreground"
                  data-testid="text-product-name"
                >
                  {product.name}
                </h1>
                <p className="mt-4 brand-body-lead">
                  {linkedStory!.cover.kind === "image" && linkedStory!.cover.caption
                    ? linkedStory!.cover.caption
                    : `${linkedStory!.club}. European night. ${product.season ?? ""}.`}
                </p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                {/* Brand overline */}
                <p className="brand-overline mb-3" data-testid="badge-league">
                  {product.league} &middot; {product.season}
                </p>

                {/* Product name */}
                <h1
                  className="brand-headline text-foreground mb-2"
                  data-testid="text-product-name"
                >
                  {product.name}
                </h1>

                {/* Player */}
                {product.player && (
                  <p className="text-lg text-muted-foreground mb-4" data-testid="text-player">
                    {product.player}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.isLimitedEdition && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.08em]">
                      Limited Edition
                    </span>
                  )}
                  {product.isAutographed && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
                      Signed
                    </span>
                  )}
                  {product.hasCertificate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border/60 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground" data-testid="badge-certificate">
                      <CheckCircle className="h-3 w-3" />
                      Certified
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-8">
                  <p className="brand-price-lg text-foreground" data-testid="text-price">
                    {formatPrice(product.price)}
                  </p>
                  {stockCount > 0 && stockCount <= 3 && (
                    <p className="mt-1.5 text-[13px] text-accent font-medium">
                      Only {stockCount} left in stock
                    </p>
                  )}
                </div>

                {/* Size selector */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Select Size</p>
                    <button className="text-[13px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                      Size guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!product.inStock}
                        className={[
                          "h-12 rounded-lg text-sm font-medium transition-all duration-200 press-scale",
                          selectedSize === size
                            ? "bg-foreground text-background ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            : product.inStock
                              ? "border border-border/60 text-foreground hover:border-foreground/40"
                              : "border border-border/30 text-muted-foreground/40 cursor-not-allowed",
                        ].join(" ")}
                        data-testid={`button-size-${size.toLowerCase()}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addToCartMutation.isPending}
                    className="w-full h-14 rounded-xl bg-foreground text-background text-[15px] font-semibold tracking-[-0.01em] flex items-center justify-center gap-2.5 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="h-[18px] w-[18px]" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={handleFavoriteToggle}
                    className="w-full h-12 rounded-xl border border-border/60 text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:border-foreground/40 hover:bg-foreground/[0.02] active:scale-[0.98] transition-all duration-200"
                    data-testid="button-favorite"
                  >
                    <Heart className={`h-[18px] w-[18px] ${isFavorite ? "fill-current text-accent" : ""}`} />
                    {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                  </button>
                </div>

                {/* Trust signals */}
                <div className="space-y-3 pt-6 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/[0.04]">
                      <Shield className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Authenticity Guaranteed</p>
                      <p className="text-[12px] text-muted-foreground">Verified with certificate of authenticity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/[0.04]">
                      <Truck className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Free Worldwide Shipping</p>
                      <p className="text-[12px] text-muted-foreground">On orders over $150</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/[0.04]">
                      <RotateCcw className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">14-Day Returns</p>
                      <p className="text-[12px] text-muted-foreground">Hassle-free return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(!hasNarrative || stage === "artifact") && (
          <div className="mt-16 max-w-4xl animate-fade-in-up">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="h-12 bg-transparent border-b border-border/40 rounded-none w-full justify-start gap-0 p-0">
                <TabsTrigger
                  value="description"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-medium px-6 transition-colors"
                  data-testid="tab-description"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-medium px-6 transition-colors"
                  data-testid="tab-details"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="authentication"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-medium px-6 transition-colors"
                  data-testid="tab-authentication"
                >
                  Authentication
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-8">
                <p className="brand-body text-foreground/90 leading-relaxed" data-testid="text-description">
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-8">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Club", value: product.club },
                    { label: "League", value: product.league },
                    { label: "Season", value: product.season },
                    { label: "Type", value: product.type },
                    { label: "Condition", value: product.condition },
                    { label: "Brand", value: product.brand },
                    { label: "Gender", value: product.gender },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-border/30">
                      <dt className="text-sm text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
              <TabsContent value="authentication" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.04] shrink-0">
                      <CheckCircle className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Authenticity Certificate</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This product includes an official authenticity certificate that guarantees
                        the origin and legitimacy of the item.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.04] shrink-0">
                      <Shield className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Origin Verification</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All products undergo rigorous authenticity verification
                        before being listed for sale.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Mobile fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/40 px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{formatPrice(product.price)}</p>
            {selectedSize && <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCartMutation.isPending}
            className="h-12 px-8 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>

      <CartPreview
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
