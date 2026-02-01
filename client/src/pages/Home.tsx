import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CartItemWithProduct, Product } from "@shared/schema";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { CartPreview } from "@/components/CartPreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { STORIES, type Story } from "@/content/stories";

type LeagueGroupKey = "premier" | "laliga" | "seriea" | "bundesliga" | "ligue1" | "rest";
type CompetitionKey = "League" | "Champions League" | "Domestic Cups" | "International";
type EraKey = "80s" | "90s" | "00s" | "Modern";

const TOP_5_LEAGUES = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"] as const;

const LEAGUE_GROUPS: Array<{
  key: LeagueGroupKey;
  name: string;
  identity: string;
  leagues: string[];
}> = [
  { key: "premier", name: "Premier League", identity: "English intensity.", leagues: ["Premier League"] },
  { key: "laliga", name: "La Liga", identity: "Spanish flair.", leagues: ["La Liga"] },
  { key: "seriea", name: "Serie A", identity: "Italian craft.", leagues: ["Serie A"] },
  { key: "bundesliga", name: "Bundesliga", identity: "German tempo.", leagues: ["Bundesliga"] },
  { key: "ligue1", name: "Ligue 1", identity: "Paris lights, raw talent.", leagues: ["Ligue 1"] },
  { key: "rest", name: "Rest of World", identity: "South America, Asia, Africa.", leagues: [] }, // computed at runtime
];

const COMPETITIONS: Array<{ key: CompetitionKey; label: string }> = [
  { key: "League", label: "League" },
  { key: "Champions League", label: "Champions League" },
  { key: "Domestic Cups", label: "Domestic Cups" },
  { key: "International", label: "International" },
];

const SIZES = ["S", "M", "L", "XL"] as const;
const ERAS: Array<{ key: EraKey; label: string }> = [
  { key: "80s", label: "80s" },
  { key: "90s", label: "90s" },
  { key: "00s", label: "00s" },
  { key: "Modern", label: "Modern" },
];

function pickSeasonYear(season: string): number | null {
  const match = season.match(/\d{4}/);
  if (!match) return null;
  const year = Number(match[0]);
  return Number.isFinite(year) ? year : null;
}

function inferEra(product: Product): EraKey {
  const year = pickSeasonYear(product.season);
  if (!year) return "Modern";
  if (year >= 1980 && year <= 1989) return "80s";
  if (year >= 1990 && year <= 1999) return "90s";
  if (year >= 2000 && year <= 2009) return "00s";
  return "Modern";
}

function inferCompetition(product: Product): CompetitionKey {
  const hay = `${product.name} ${product.description}`.toLowerCase();
  if (product.nationalTeam) return "International";
  if (hay.includes("libertadores")) return "International";
  if (
    hay.includes("champions league") ||
    hay.includes("european cup") ||
    hay.includes("ucl") ||
    hay.includes("athens") ||
    hay.includes("munich") ||
    hay.includes("wembley")
  ) {
    return "Champions League";
  }
  if (
    hay.includes("domestic cup") ||
    hay.includes("fa cup") ||
    hay.includes("coppa") ||
    hay.includes("copa") ||
    hay.includes("cup")
  ) {
    return "Domestic Cups";
  }
  return "League";
}

function inferCondition(product: Product): string {
  const c = (product.condition || "").toLowerCase();
  const year = pickSeasonYear(product.season);
  if (c.includes("new")) return "New";
  if (c.includes("excellent")) return "Excellent";
  if (c.includes("good")) return "Good";
  if (c.includes("used")) return "Used";
  if (year && year <= 2004) return "Archive";
  return product.condition || "Archive";
}

function formatMoney(value: string) {
  return `$${parseFloat(value).toFixed(2)}`;
}

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center whitespace-nowrap",
        "rounded-full px-3 py-1.5 text-[12px] leading-none",
        "border",
        selected ? "border-foreground bg-foreground text-background" : "border-border/70 bg-transparent text-foreground",
        disabled ? "opacity-35 cursor-not-allowed" : "hover:bg-foreground/5",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <span className="tracking-[0.14em] uppercase">{label}</span>
    </button>
  );
}

function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ink" | "gold";
}) {
  const toneClass =
    tone === "ink"
      ? "border-foreground/20 text-foreground bg-foreground/5"
      : tone === "gold"
        ? "border-[hsl(var(--gold))]/25 text-foreground bg-[hsl(var(--gold))]/12"
        : "border-border/70 text-muted-foreground bg-transparent";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-1",
        "text-[11px] leading-none",
        "tracking-[0.14em] uppercase",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function StoryBlock({ story }: { story: Story }) {
  return (
    <article className="border border-border/70 bg-card" data-testid={`story-${story.id}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative overflow-hidden border border-border/70 bg-muted">
          <div className="relative aspect-[16/9]">
            {story.cover.kind === "image" ? (
              <img
                src={story.cover.url}
                alt={story.cover.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <>
                <div
                  className={[
                    "absolute inset-0",
                    story.cover.tone === "night"
                      ? "bg-[radial-gradient(900px_520px_at_70%_10%,rgba(255,255,255,0.10)_0%,transparent_55%),radial-gradient(800px_520px_at_10%_25%,rgba(247,197,32,0.10)_0%,transparent_60%),linear-gradient(to_bottom,rgba(10,12,18,1)_0%,rgba(10,12,18,1)_100%)]"
                      : "bg-[radial-gradient(900px_520px_at_70%_10%,rgba(0,0,0,0.05)_0%,transparent_55%),radial-gradient(800px_520px_at_10%_25%,rgba(247,197,32,0.07)_0%,transparent_60%),linear-gradient(to_bottom,rgba(250,248,242,1)_0%,rgba(250,248,242,1)_100%)]",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span className="sr-only">{story.cover.alt}</span>
              </>
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>

        {story.cover.caption ? (
          <p className="mt-3 text-xs tracking-[0.18em] uppercase text-muted-foreground">{story.cover.caption}</p>
        ) : null}

        <div className="mx-auto mt-10 max-w-[72ch]">
          <p className="archive-kicker">FEATURE</p>
          <h3
            className={[
              "mt-3 leading-[1.05] tracking-[-0.01em]",
              "text-3xl sm:text-4xl lg:text-5xl",
              "font-[var(--font-display)]",
            ].join(" ")}
          >
            {story.title}
          </h3>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">{story.subtitle}</p>

          <div className="mt-8 space-y-5 text-[15px] sm:text-base leading-relaxed">
            {story.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "lg:first-letter:float-left lg:first-letter:mr-3 lg:first-letter:mt-2 lg:first-letter:font-[var(--font-display)] lg:first-letter:text-6xl lg:first-letter:leading-none"
                    : undefined
                }
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12">
            <div className="archive-rule" />
            <p className="mt-6 text-center text-xs tracking-[0.22em] uppercase text-muted-foreground">
              The shirt worn that night
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function JerseyArtifactCard({
  product,
  onRequestAddToCart,
}: {
  product: Product;
  onRequestAddToCart: (product: Product) => void;
}) {
  const competition = inferCompetition(product);
  const era = inferEra(product);
  const condition = inferCondition(product);

  return (
    <article className="border border-border/70 bg-card p-6 sm:p-8" data-testid={`artifact-${product.slug}`}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative min-h-[320px] overflow-visible">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="archive-jersey mx-auto h-[360px] w-full object-contain sm:h-[440px] lg:h-[520px]"
            loading="lazy"
            data-testid={`img-artifact-${product.slug}`}
          />
        </div>

        <div className="flex flex-col">
          <p className="archive-kicker">THE ARTIFACT</p>
          <h3 className="mt-3 font-[var(--font-display)] text-2xl sm:text-3xl leading-tight tracking-[-0.01em]">
            {product.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Tag tone="ink">{product.league}</Tag>
            <Tag>{competition}</Tag>
            <Tag>{era}</Tag>
            <Tag>{condition}</Tag>
          </div>

          <div className="mt-8">
            <p className="archive-kicker">SIZES AVAILABLE</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Tag key={s} tone={product.sizes.includes(s) ? "ink" : "neutral"}>
                  {product.sizes.includes(s) ? `Size ${s}` : `${s}`}
                </Tag>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="archive-kicker">PRICE</p>
              <p className="mt-2 font-semibold tabular-nums tracking-[0.02em]">{formatMoney(product.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-none border-border/70 bg-transparent hover:bg-foreground/5"
                asChild
              >
                <Link href={`/product/${product.slug}`}>
                  <a>View</a>
                </Link>
              </Button>
              <Button className="rounded-none" onClick={() => onRequestAddToCart(product)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductExhibitCard({
  product,
  onRequestAddToCart,
}: {
  product: Product;
  onRequestAddToCart: (product: Product) => void;
}) {
  const competition = inferCompetition(product);
  const era = inferEra(product);
  const condition = inferCondition(product);
  const isHeritage = era === "80s" || era === "90s" || era === "00s";

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-none",
        "border border-border/70 bg-card",
        "transition-transform duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(0,0,0,0.08)]",
        "focus-within:ring-2 focus-within:ring-[hsl(var(--ring))] focus-within:ring-offset-2 focus-within:ring-offset-background",
      ].join(" ")}
      data-testid={`card-shop-${product.slug}`}
    >
      {/* STRICT: product area = PNG jersey only, no background block */}
      <Link href={`/product/${product.slug}`} className="block focus:outline-none" data-testid={`link-shop-${product.slug}`}>
        <div className="px-6 pt-7 sm:px-7 sm:pt-8">
          <div className="flex items-start justify-between gap-4">
            <p className="archive-kicker">JERSEY • EDITION</p>
            <p className="font-semibold tabular-nums tracking-[0.02em]" data-testid={`text-price-${product.slug}`}>
              {formatMoney(product.price)}
            </p>
          </div>
          <h3 className="mt-2 font-medium tracking-[-0.01em]" data-testid={`text-club-${product.slug}`}>
            {product.club}
          </h3>
        </div>

        <div className="px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
          <div className="relative aspect-[4/5] overflow-visible">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={[
                "archive-jersey absolute inset-0 m-auto h-full w-full object-contain",
                "transition-transform duration-200 ease-out",
                "group-hover:scale-[1.04]",
              ].join(" ")}
              loading="lazy"
              data-testid={`img-jersey-${product.slug}`}
            />
          </div>
        </div>
      </Link>

      <div className="px-6 pb-7 sm:px-7 sm:pb-8">
        <div className="mt-2 flex flex-wrap gap-2">
          <Tag tone="ink">{product.league}</Tag>
          <Tag>{competition}</Tag>
          <Tag>{era}</Tag>
          <Tag>{condition}</Tag>
          {isHeritage ? <Tag tone="gold">Heritage</Tag> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <Tag key={s} tone={product.sizes.includes(s) ? "ink" : "neutral"}>
                {product.sizes.includes(s) ? `Size ${s}` : `${s}`}
              </Tag>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-none border-border/70 bg-transparent hover:bg-foreground/5"
              asChild
              data-testid={`button-view-${product.slug}`}
            >
              <Link href={`/product/${product.slug}`}>
                <a>View</a>
              </Link>
            </Button>
            <Button
              className="rounded-none"
              onClick={() => onRequestAddToCart(product)}
              data-testid={`button-add-${product.slug}`}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addProduct, setAddProduct] = useState<Product | null>(null);
  const [addSize, setAddSize] = useState<string>("");
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const [leagueGroup, setLeagueGroup] = useState<LeagueGroupKey | null>(null);
  const [competition, setCompetition] = useState<CompetitionKey | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [era, setEra] = useState<EraKey | null>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, size }: { productId: string; size: string }) => {
      return await apiRequest("POST", "/api/cart", { productId, size, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cart/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const handleRemoveCartItem = (itemId: string) => removeCartMutation.mutate(itemId);
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity });
  };

  const computedLeagueGroups = useMemo(() => {
    const allLeagues = Array.from(new Set(products.map((p) => p.league)));
    const rest = allLeagues.filter((l) => !TOP_5_LEAGUES.includes(l as any));
    return LEAGUE_GROUPS.map((g) => (g.key === "rest" ? { ...g, leagues: rest } : g));
  }, [products]);

  const leaguesForSelectedGroup = useMemo(() => {
    if (!leagueGroup) return null;
    return computedLeagueGroups.find((g) => g.key === leagueGroup)?.leagues ?? null;
  }, [computedLeagueGroups, leagueGroup]);

  const baseFiltered = useMemo(() => {
    let list = products.slice();

    if (leaguesForSelectedGroup !== null) {
      list = list.filter((p) => leaguesForSelectedGroup.includes(p.league));
    }

    if (competition) list = list.filter((p) => inferCompetition(p) === competition);
    if (era) list = list.filter((p) => inferEra(p) === era);

    return list;
  }, [products, leaguesForSelectedGroup, competition, era]);

  const sizeAvailability = useMemo(() => {
    const available = new Set<string>();
    baseFiltered.forEach((p) => p.sizes.forEach((s) => available.add(s)));
    return {
      S: available.has("S"),
      M: available.has("M"),
      L: available.has("L"),
      XL: available.has("XL"),
    } as Record<(typeof SIZES)[number], boolean>;
  }, [baseFiltered]);

  const filteredProducts = useMemo(() => {
    if (sizes.length === 0) return baseFiltered;
    return baseFiltered.filter((p) => p.sizes.some((s) => sizes.includes(s)));
  }, [baseFiltered, sizes]);

  const activeFiltersCount = useMemo(() => {
    return (
      (leagueGroup ? 1 : 0) +
      (competition ? 1 : 0) +
      (era ? 1 : 0) +
      (sizes.length > 0 ? 1 : 0)
    );
  }, [leagueGroup, competition, era, sizes.length]);

  const clearFilters = () => {
    setLeagueGroup(null);
    setCompetition(null);
    setSizes([]);
    setEra(null);
  };

  const storiesInRoom = useMemo(() => {
    const slugs = new Set(filteredProducts.map((p) => p.slug));
    return STORIES.filter((s) => slugs.has(s.linkedProductSlug));
  }, [filteredProducts]);

  useEffect(() => {
    if (storiesInRoom.length === 0) {
      if (activeStoryId) setActiveStoryId(null);
      return;
    }
    if (!activeStoryId || !storiesInRoom.some((s) => s.id === activeStoryId)) {
      setActiveStoryId(storiesInRoom[0]!.id);
    }
  }, [activeStoryId, storiesInRoom]);

  const activeStory = useMemo(() => {
    if (storiesInRoom.length === 0) return null;
    if (!activeStoryId) return storiesInRoom[0] ?? null;
    return storiesInRoom.find((s) => s.id === activeStoryId) ?? storiesInRoom[0] ?? null;
  }, [activeStoryId, storiesInRoom]);

  const activeStoryProduct = useMemo(() => {
    if (!activeStory) return null;
    return filteredProducts.find((p) => p.slug === activeStory.linkedProductSlug) ?? null;
  }, [activeStory, filteredProducts]);

  const requestAddToCart = (product: Product) => {
    setAddProduct(product);
    setAddSize("");
    setAddOpen(true);
  };

  const confirmAddToCart = () => {
    if (!addProduct || !addSize) return;
    addToCartMutation.mutate({ productId: addProduct.id, size: addSize }, { onSuccess: () => setAddOpen(false) });
  };

  const storiesInProgress = Math.max(0, products.length - STORIES.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={0}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        {/* SECTION 1 — INTRO / MANIFESTO */}
        <section className="archive-hero-texture">
          <div className="container mx-auto px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="archive-kicker">FOOTBALL STORIES • CURATED ARTIFACTS</p>
                <h1 className="archive-title" data-testid="text-hero-title">
                  Shirts remember.
                  <br />
                  History lives in fabric.
                </h1>
                <p className="archive-subtitle">
                  Football is built from nights you can’t replay: pressure, noise, silence, belief. The shirt is the object
                  left behind — a symbol you can hold, read, and wear.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button className="rounded-none" asChild data-testid="button-explore-stories">
                    <a href="#stories">Explore the Stories</a>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-border/70 bg-transparent hover:bg-foreground/5"
                    asChild
                    data-testid="button-explore-by-league"
                  >
                    <a href="#discover">Explore by League</a>
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="tracking-[0.22em] uppercase">Editorial first</span>
                  <span aria-hidden="true">—</span>
                  <span className="tracking-[0.22em] uppercase">Curated restraint</span>
                  <span aria-hidden="true">—</span>
                  <span className="tracking-[0.22em] uppercase">PNG kits only in the shop</span>
                </div>
              </div>

              <aside className="border border-border/70 bg-card p-6 sm:p-7">
                <p className="archive-kicker">EDITOR’S NOTE</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This isn’t a catalog. It’s a tiny drop of artifacts — each tied to a moment, an era, a feeling you can
                  name.
                </p>
                <div className="mt-6 grid gap-2">
                  <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    <span>Artifacts in this drop</span>
                    <span className="text-foreground tabular-nums">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    <span>Stories published</span>
                    <span className="text-foreground tabular-nums">{STORIES.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    <span>Stories in progress</span>
                    <span className="text-foreground tabular-nums">{storiesInProgress}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SECTION 2 — DISCOVERY & FILTERING */}
        <section id="discover" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="archive-kicker">DISCOVERY</p>
              <h2 className="archive-section-title">Browse the archive.</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Use league, competition, size, and era to choose the room you’re standing in. No noise, no shouting —
                just labels.
              </p>
            </div>
            {activeFiltersCount > 0 ? (
              <button
                type="button"
                className="hidden sm:inline-flex text-xs tracking-[0.22em] uppercase text-muted-foreground underline"
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Clear ({activeFiltersCount})
              </button>
            ) : (
              <div className="hidden md:block w-56">
                <div className="archive-rule" />
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border border-border/70 bg-card p-6 sm:p-7">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="archive-kicker">LEAGUE</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {computedLeagueGroups.map((g) => (
                      <Chip
                        key={g.key}
                        label={g.name === "Rest of World" ? "Rest of the World" : g.name}
                        selected={leagueGroup === g.key}
                        disabled={g.key === "rest" ? g.leagues.length === 0 : false}
                        onClick={() => setLeagueGroup((prev) => (prev === g.key ? null : g.key))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="archive-kicker">COMPETITION</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {COMPETITIONS.map((c) => (
                      <Chip
                        key={c.key}
                        label={c.label}
                        selected={competition === c.key}
                        onClick={() => setCompetition((prev) => (prev === c.key ? null : c.key))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="archive-kicker">SIZE</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        selected={sizes.includes(s)}
                        disabled={!sizeAvailability[s] && !sizes.includes(s)}
                        onClick={() => setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="archive-kicker">ERA</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ERAS.map((e) => (
                      <Chip
                        key={e.key}
                        label={e.label}
                        selected={era === e.key}
                        onClick={() => setEra((prev) => (prev === e.key ? null : e.key))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 ? (
                <div className="mt-8 sm:hidden">
                  <button
                    type="button"
                    className="text-xs tracking-[0.22em] uppercase text-muted-foreground underline"
                    onClick={clearFilters}
                  >
                    Clear ({activeFiltersCount})
                  </button>
                </div>
              ) : null}
            </div>

            <aside className="border border-border/70 bg-card p-6 sm:p-7">
              <p className="archive-kicker">ARCHIVE RESPONSE</p>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  <span>Artifacts in this room</span>
                  <span className="text-foreground tabular-nums">{filteredProducts.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  <span>Stories in this room</span>
                  <span className="text-foreground tabular-nums">{storiesInRoom.length}</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="archive-rule" />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Filters are for discovery: a way to read identity through leagues, nights, and eras — before you enter
                the gallery.
              </p>

              {filteredProducts.length > 0 ? (
                <div className="mt-6">
                  <p className="archive-kicker">PREVIEW</p>
                  <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {filteredProducts.slice(0, 5).map((p) => (
                      <Link key={p.id} href={`/product/${p.slug}`}>
                        <a
                          className="block h-16 w-16 shrink-0 border border-border/70 bg-transparent p-2 hover:bg-foreground/5"
                          aria-label={`Preview ${p.name}`}
                        >
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {/* SECTION 3 — STORYTELLING */}
        <section id="stories" className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="archive-kicker">EDITORIAL</p>
              <h2 className="archive-section-title">The stories.</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                A jersey isn’t merchandise first — it’s evidence. Each story ends at the artifact.
              </p>
            </div>
            <div className="hidden md:block w-56">
              <div className="archive-rule" />
            </div>
          </div>

          {storiesInRoom.length > 1 ? (
            <div className="mt-8 border border-border/70 bg-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-6">
                <p className="archive-kicker">CHOOSE A STORY</p>
                <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                  {storiesInRoom.length} published
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {storiesInRoom.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.club}
                    selected={activeStoryId === s.id}
                    onClick={() => setActiveStoryId(s.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            {activeStory ? (
              <StoryBlock story={activeStory} />
            ) : (
              <div className="border border-border/70 bg-card p-10 text-center">
                <p className="archive-kicker">NO STORIES IN THIS ROOM</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  This page will grow story by story. Clear filters to return to the Milan feature.
                </p>
                {activeFiltersCount > 0 ? (
                  <div className="mt-6 flex justify-center">
                    <Button className="rounded-none" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4 — STORY → JERSEY (ARTIFACT) */}
        {activeStoryProduct ? (
          <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <JerseyArtifactCard product={activeStoryProduct} onRequestAddToCart={requestAddToCart} />
          </section>
        ) : null}

        {/* SECTION 5 — CURATED SHOP (ALL JERSEYS) */}
        <section id="shop" className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="archive-rule" />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="archive-kicker">THE COLLECTION</p>
              <h2 className="archive-section-title">A curated five.</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Transparent PNG kits only — tagged like exhibit labels: league, competition, era, condition, sizes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tag tone="ink">{filteredProducts.length} in scope</Tag>
            </div>
          </div>

          {productsLoading ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-border/70 bg-card p-6">
                  <Skeleton className="mb-4 h-4 w-24" />
                  <Skeleton className="mb-3 h-5 w-40" />
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="mt-5 h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-10 border border-border/70 bg-card p-10 text-center">
              <p className="archive-kicker">NO MATCHES</p>
              <p className="mt-3 text-sm text-muted-foreground">Adjust filters to reveal a different room of the archive.</p>
              <div className="mt-6 flex justify-center">
                <Button className="rounded-none" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => (
                <ProductExhibitCard key={p.id} product={p} onRequestAddToCart={requestAddToCart} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 6 — FUTURE STORIES (TEASER) */}
        <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="border border-border/70 bg-card p-8 sm:p-10">
            <p className="archive-kicker">NEXT ISSUE</p>
            <h2 className="mt-3 font-[var(--font-display)] text-2xl sm:text-3xl leading-tight tracking-[-0.01em]">
              More stories coming.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Barcelona. Corinthians. Manchester United. Chelsea. The archive grows slowly — one night at a time.
            </p>

            <div className="mt-8">
              <div className="archive-rule" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>Barcelona</Tag>
              <Tag>Corinthians</Tag>
              <Tag>Manchester United</Tag>
              <Tag>Chelsea</Tag>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border/70 bg-card">
          <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
                <p className="archive-kicker">TINY SOCCER SHOP</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  A football storytelling platform and curated jersey archive. We publish the story first, then present
                  the artifact — tagged like a label, sold like an edition.
                </p>
              </div>
              <div>
                <p className="archive-kicker">TRUST</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Worldwide shipping</li>
                  <li>Returns policy</li>
                  <li>Authenticity-backed</li>
                </ul>
              </div>
              <div>
                <p className="archive-kicker">CONTACT</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Email</li>
                  <li>Instagram</li>
                  <li>Newsletter (later)</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Add to cart dialog (size required) */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-base tracking-[0.14em] uppercase">Add to cart</DialogTitle>
          </DialogHeader>
          {addProduct ? (
            <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="border border-border/70 bg-card p-4">
                <div className="relative aspect-[4/5]">
                  <img
                    src={addProduct.imageUrl}
                    alt={addProduct.name}
                    className="archive-jersey absolute inset-0 m-auto h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="archive-kicker">SELECT SIZE</p>
                <h3 className="mt-2 font-medium">{addProduct.club}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{addProduct.season}</p>
                <p className="mt-4 font-semibold tabular-nums">{formatMoney(addProduct.price)}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {addProduct.sizes.map((s) => (
                    <Chip key={s} label={s} selected={addSize === s} onClick={() => setAddSize(s)} />
                  ))}
                </div>

                <div className="mt-6 grid gap-2">
                  <Button className="rounded-none" disabled={!addSize || addToCartMutation.isPending} onClick={confirmAddToCart}>
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-border/70 bg-transparent hover:bg-foreground/5"
                    asChild
                  >
                    <Link href={`/product/${addProduct.slug}`}>
                      <a onClick={() => setAddOpen(false)}>View details</a>
                    </Link>
                  </Button>
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
    </div>
  );
}
