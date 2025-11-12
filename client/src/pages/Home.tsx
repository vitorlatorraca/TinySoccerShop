import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FilterOptions, SortOptions, Product, CartItemWithProduct } from "@shared/schema";
import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { SortControls } from "@/components/SortControls";
import { ActiveFilters } from "@/components/ActiveFilters";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CartPreview } from "@/components/CartPreview";
import { HeroBanner } from "@/components/HeroBanner";
import { LegendsSection } from "@/components/LegendsSection";
import { PopularTeamsSection } from "@/components/PopularTeamsSection";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({ sortBy: "relevance", itemsPerPage: 24 });
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.leagues && filters.leagues.length > 0) params.set('leagues', JSON.stringify(filters.leagues));
    if (filters.clubs && filters.clubs.length > 0) params.set('clubs', JSON.stringify(filters.clubs));
    if (filters.nationalTeams && filters.nationalTeams.length > 0) params.set('nationalTeams', JSON.stringify(filters.nationalTeams));
    if (filters.seasons && filters.seasons.length > 0) params.set('seasons', JSON.stringify(filters.seasons));
    if (filters.players && filters.players.length > 0) params.set('players', JSON.stringify(filters.players));
    if (filters.sizes && filters.sizes.length > 0) params.set('sizes', JSON.stringify(filters.sizes));
    if (filters.types && filters.types.length > 0) params.set('types', JSON.stringify(filters.types));
    if (filters.conditions && filters.conditions.length > 0) params.set('conditions', JSON.stringify(filters.conditions));
    if (filters.brands && filters.brands.length > 0) params.set('brands', JSON.stringify(filters.brands));
    if (filters.genders && filters.genders.length > 0) params.set('genders', JSON.stringify(filters.genders));
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.isAutographed) params.set('isAutographed', 'true');
    if (filters.isMatchWorn) params.set('isMatchWorn', 'true');
    if (filters.isLimitedEdition) params.set('isLimitedEdition', 'true');
    if (filters.hasCertificate) params.set('hasCertificate', 'true');
    if (sortOptions.sortBy) params.set('sortBy', sortOptions.sortBy);
    return params.toString();
  };

  const queryString = buildQueryString();
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?${queryString}`],
  });

  // Get all products for hero banner and sections (no filters)
  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Get featured product for hero banner
  const featuredProduct = allProducts.find(p => p.featured) || allProducts[0] || null;

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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleRemoveFilter = (category: keyof FilterOptions, value?: string) => {
    if (Array.isArray(filters[category])) {
      const currentValues = filters[category] as string[];
      setFilters({
        ...filters,
        [category]: value ? currentValues.filter((v) => v !== value) : [],
      });
    } else if (category === 'minPrice' || category === 'maxPrice') {
      const newFilters = { ...filters };
      delete newFilters[category];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [category]: false,
      });
    }
  };

  const handleFavoriteToggle = (productId: string) => {
    const existingFavorite = favorites.find((f) => f.productId === productId);
    const action = existingFavorite ? "removed from" : "added to";
    
    toggleFavoriteMutation.mutate(productId, {
      onSuccess: () => {
        toast({
          title: `Product ${action} favorites`,
          duration: 2000,
        });
      },
    });
  };

  const handleAddToCart = (productId: string, size: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    addToCartMutation.mutate({ productId, size }, {
      onSuccess: () => {
        toast({
          title: "Product added to cart",
          description: `${product.name} - Size ${size}`,
          duration: 2000,
        });
      },
    });
  };

  const handleRemoveCartItem = (itemId: string) => {
    removeCartMutation.mutate(itemId, {
      onSuccess: () => {
        toast({
          title: "Product removed from cart",
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

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Hero Banner */}
      <HeroBanner product={featuredProduct} />

      {/* Legends Section */}
      <LegendsSection products={allProducts} />

      {/* Popular Teams Section */}
      <PopularTeamsSection products={allProducts} />

      {/* Products Section with Filters */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Football Shirts</h1>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" data-testid="button-mobile-filters">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <div className="mb-6">
              <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
            </div>

            <div className="mb-6">
              <SortControls
                sortOptions={sortOptions}
                onSortChange={setSortOptions}
                totalResults={products.length}
                gridColumns={gridColumns}
                onGridColumnsChange={setGridColumns}
              />
            </div>

            <ProductGrid
              products={products}
              isLoading={productsLoading}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favoriteProductIds}
              onQuickView={setQuickViewProduct}
              gridColumns={gridColumns}
            />
          </main>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={quickViewProduct ? favoriteProductIds.includes(quickViewProduct.id) : false}
      />

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
