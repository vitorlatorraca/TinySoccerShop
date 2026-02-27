import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { CartItemWithProduct, Product } from "@shared/schema";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopFilters, type ShopFilterState } from "@/components/shop/ShopFilters";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { CartPreview } from "@/components/CartPreview";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

const DEFAULT_FILTER: ShopFilterState = {
  sortBy: "relevance",
  sizes: [],
  leagues: [],
  clubs: [],
  minPrice: "",
  maxPrice: "",
  hasPlayerName: null,
};

function applyShopFilters(products: Product[], filter: ShopFilterState, search: string): Product[] {
  let list = products.slice();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.club.toLowerCase().includes(q) ||
        (p.player && p.player.toLowerCase().includes(q)) ||
        p.league.toLowerCase().includes(q)
    );
  }

  if (filter.sizes.length > 0) {
    list = list.filter((p) => p.sizes.some((s) => filter.sizes.includes(s)));
  }
  if (filter.leagues.length > 0) {
    list = list.filter((p) => filter.leagues.includes(p.league));
  }
  if (filter.clubs.length > 0) {
    list = list.filter((p) => filter.clubs.includes(p.club));
  }
  if (filter.minPrice !== "") {
    const min = Number(filter.minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => parseFloat(p.price) >= min);
  }
  if (filter.maxPrice !== "") {
    const max = Number(filter.maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => parseFloat(p.price) <= max);
  }
  if (filter.hasPlayerName === true) {
    list = list.filter((p) => !!p.player);
  }
  if (filter.hasPlayerName === false) {
    list = list.filter((p) => !p.player);
  }

  switch (filter.sortBy) {
    case "price-asc":
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-desc":
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "newest":
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "popular":
    case "relevance":
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return list;
}

export default function ShopPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ShopFilterState>(DEFAULT_FILTER);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const removeCartMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/cart/${id}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) =>
      apiRequest("PATCH", `/api/cart/${id}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
  });

  const filteredProducts = useMemo(
    () => applyShopFilters(products, filter, search),
    [products, filter, search]
  );

  const hasActiveFilters =
    filter.sizes.length > 0 ||
    filter.leagues.length > 0 ||
    filter.clubs.length > 0 ||
    filter.minPrice !== "" ||
    filter.maxPrice !== "" ||
    filter.hasPlayerName !== null;

  const activeChips = useMemo(() => {
    const c: { key: string; label: string }[] = [];
    filter.sizes.forEach((s) => c.push({ key: `size-${s}`, label: `Size: ${s}` }));
    filter.leagues.forEach((l) => c.push({ key: `league-${l}`, label: l }));
    filter.clubs.forEach((cbl) => c.push({ key: `club-${cbl}`, label: cbl }));
    if (filter.minPrice) c.push({ key: "minPrice", label: `From $${filter.minPrice}` });
    if (filter.maxPrice) c.push({ key: "maxPrice", label: `To $${filter.maxPrice}` });
    if (filter.hasPlayerName === true) c.push({ key: "printed-yes", label: "With name" });
    if (filter.hasPlayerName === false) c.push({ key: "printed-no", label: "No name" });
    return c;
  }, [filter]);

  const clearAllFilters = () => {
    setFilter(DEFAULT_FILTER);
    setSearch("");
  };

  const removeChip = (key: string) => {
    if (key.startsWith("size-")) {
      setFilter((f) => ({ ...f, sizes: f.sizes.filter((s) => `size-${s}` !== key) }));
    } else if (key.startsWith("league-")) {
      setFilter((f) => ({ ...f, leagues: f.leagues.filter((l) => `league-${l}` !== key) }));
    } else if (key.startsWith("club-")) {
      setFilter((f) => ({ ...f, clubs: f.clubs.filter((c) => `club-${c}` !== key) }));
    } else if (key === "minPrice") setFilter((f) => ({ ...f, minPrice: "" }));
    else if (key === "maxPrice") setFilter((f) => ({ ...f, maxPrice: "" }));
    else if (key === "printed-yes" || key === "printed-no") setFilter((f) => ({ ...f, hasPlayerName: null }));
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        searchQuery={search}
        onSearchChange={setSearch}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]">
        {/* Mobile filter trigger */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground h-10 px-4 rounded-full border border-border/50 hover:border-foreground/20 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-foreground text-background text-[10px] font-semibold px-1">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left text-base font-semibold">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ShopFilters
                  products={products}
                  filter={filter}
                  onFilterChange={setFilter}
                  resultCount={filteredProducts.length}
                />
              </div>
            </SheetContent>
          </Sheet>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-10 lg:gap-12">
          {/* Desktop filters sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <ShopFilters
                products={products}
                filter={filter}
                onFilterChange={setFilter}
                resultCount={filteredProducts.length}
              />
            </div>
          </div>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            {!isLoading && (
              <div className="mb-6 animate-fade-in">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="brand-section-title text-foreground">
                    {search.trim() ? `"${search.trim()}"` : "All Jerseys"}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({filteredProducts.length})
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="ml-auto text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {activeChips.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {activeChips.map(({ key, label }) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[12px] font-medium text-foreground"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => removeChip(key)}
                          className="hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] skeleton-premium rounded-xl" />
                    <div className="pt-3 space-y-2">
                      <div className="h-4 skeleton-premium w-3/4 rounded" />
                      <div className="h-3 skeleton-premium w-1/2 rounded" />
                      <div className="h-4 skeleton-premium w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                <p className="brand-section-title text-foreground mb-2">No results</p>
                <p className="text-muted-foreground text-sm mb-6">
                  Try adjusting your filters or search term.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="h-10 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                data-testid="shop-product-grid"
              >
                {filteredProducts.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CartPreview
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={(id) => removeCartMutation.mutate(id)}
        onUpdateQuantity={(id, qty) => updateCartMutation.mutate({ id, quantity: qty })}
      />
    </div>
  );
}
