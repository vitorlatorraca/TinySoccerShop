import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, CartItemWithProduct } from "@shared/schema";
import { Header } from "@/components/Header";
import { CartPreview } from "@/components/CartPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, CheckCircle, Shield, Award, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ProductDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/product/:slug");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

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
        title: "Selecione um tamanho",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    addToCartMutation.mutate({ productId: product.id, size: selectedSize }, {
      onSuccess: () => {
        toast({
          title: "Produto adicionado ao carrinho",
          description: `${product.name} - Tamanho ${selectedSize}`,
          duration: 2000,
        });
      },
    });
  };

  const handleFavoriteToggle = () => {
    if (!product) return;
    
    const existingFavorite = favorites.find((f) => f.productId === product.id);
    const action = existingFavorite ? "removido dos" : "adicionado aos";
    
    toggleFavoriteMutation.mutate(product.id, {
      onSuccess: () => {
        toast({
          title: `Produto ${action} favoritos`,
          duration: 2000,
        });
      },
    });
  };

  const handleRemoveCartItem = (itemId: string) => {
    removeCartMutation.mutate(itemId, {
      onSuccess: () => {
        toast({
          title: "Produto removido do carrinho",
          duration: 2000,
        });
      },
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity });
  };

  const favoriteProductIds = favorites.map((f) => f.productId);
  const isFavorite = product ? favoriteProductIds.includes(product.id) : false;
  const allImages = product ? [product.imageUrl, ...(product.images || [])] : [];

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoritesCount={favorites.length}
          onCartClick={() => setCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-10 w-32" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoritesCount={favorites.length}
          onCartClick={() => setCartOpen(true)}
        />
        <div className="container mx-auto flex h-96 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Produto não encontrado</h1>
            <Button asChild>
              <Link href="/">
                <a>Voltar para loja</a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-6" data-testid="button-back">
          <Link href="/">
            <a>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para loja
            </a>
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={allImages[selectedImage]}
                alt={mockProduct.name}
                className="h-full w-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${mockProduct.name} - Imagem ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" data-testid="badge-club">
                {product.club}
              </Badge>
              <Badge variant="outline" data-testid="badge-league">
                {product.league}
              </Badge>
              {product.season && (
                <Badge variant="outline" data-testid="badge-season">
                  {product.season}
                </Badge>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-bold lg:text-4xl" data-testid="text-product-name">
              {product.name}
            </h1>

            {product.player && (
              <p className="mb-4 text-xl text-muted-foreground" data-testid="text-player">
                {product.player}
              </p>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
              {product.isAutographed && (
                <Badge variant="default" data-testid="badge-autographed">
                  ⭐ AUTOGRAFADO
                </Badge>
              )}
              {product.isLimitedEdition && (
                <Badge variant="secondary" data-testid="badge-limited">
                  EDIÇÃO LIMITADA
                </Badge>
              )}
              {product.hasCertificate && (
                <Badge variant="outline" data-testid="badge-certificate">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  CERTIFICADO
                </Badge>
              )}
            </div>

            <div className="mb-8">
              <p className="text-4xl font-bold tabular-nums" data-testid="text-price">
                CAD ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <Card className="mb-6 p-6">
              <h3 className="mb-4 text-lg font-semibold">Selecione o Tamanho</h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedSize(size)}
                    disabled={!product.inStock}
                    data-testid={`button-size-${size.toLowerCase()}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </Card>

            <div className="mb-6 grid gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? "Adicionar ao Carrinho" : "Esgotado"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleFavoriteToggle}
                data-testid="button-favorite"
              >
                <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold">Autenticidade Garantida</p>
                  <p className="text-muted-foreground">
                    Todos os produtos são verificados e vêm com certificado
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold">Peça de Colecionador</p>
                  <p className="text-muted-foreground">
                    Item premium para sua coleção de memorabilia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="description" data-testid="tab-description">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="details" data-testid="tab-details">
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="authentication" data-testid="tab-authentication">
                Autenticidade
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <p className="leading-relaxed" data-testid="text-description">
                  {product.description}
                </p>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold">Clube:</dt>
                    <dd className="text-muted-foreground">{product.club}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Liga:</dt>
                    <dd className="text-muted-foreground">{product.league}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Temporada:</dt>
                    <dd className="text-muted-foreground">{product.season}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Tipo:</dt>
                    <dd className="text-muted-foreground">{product.type}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Condição:</dt>
                    <dd className="text-muted-foreground">{product.condition}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Marca:</dt>
                    <dd className="text-muted-foreground">{product.brand}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Gênero:</dt>
                    <dd className="text-muted-foreground">{product.gender}</dd>
                  </div>
                </dl>
              </Card>
            </TabsContent>
            <TabsContent value="authentication" className="mt-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-accent" />
                    <div>
                      <h4 className="mb-1 font-semibold">Certificado de Autenticidade</h4>
                      <p className="text-muted-foreground">
                        Este produto inclui certificado oficial de autenticidade que garante a
                        procedência e legitimidade do item.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-6 w-6 shrink-0 text-accent" />
                    <div>
                      <h4 className="mb-1 font-semibold">Verificação de Procedência</h4>
                      <p className="text-muted-foreground">
                        Todos os nossos produtos passam por rigorosa verificação de autenticidade
                        antes de serem listados para venda.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
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
