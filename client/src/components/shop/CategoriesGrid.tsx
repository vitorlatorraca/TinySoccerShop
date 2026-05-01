import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface CategoriesGridProps {
  products: Product[];
}

interface Category {
  label: string;
  href: string;
  count: string;
  /** match against product.league/club/name to pick a representative image */
  match?: (p: Product) => boolean;
  fallback?: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Football Tops",
    href: "/shop?category=football-tops",
    count: "Home / Away / Third",
    match: (p) =>
      ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"].includes(
        p.league,
      ),
  },
  {
    label: "Football Bottoms",
    href: "/shop?category=football-bottoms",
    count: "Shorts & Pants",
    match: (p) => /short|pant|bottom/i.test(p.name),
  },
  {
    label: "Football Accessories",
    href: "/shop?category=football-accessories",
    count: "Scarves / Caps / Socks",
    match: (p) => /scarf|cap|sock|glove|accessor/i.test(p.name),
  },
  {
    label: "Rugby",
    href: "/shop?category=rugby",
    count: "International & Club",
    match: (p) => /rugby/i.test(`${p.league} ${p.name}`),
  },
  {
    label: "Basketball",
    href: "/shop?category=basketball",
    count: "NBA Classics",
    match: (p) => /basket|nba/i.test(`${p.league} ${p.name}`),
  },
  {
    label: "Other Sports",
    href: "/shop?category=other",
    count: "Cricket / F1 / More",
  },
];

function pickImage(category: Category, products: Product[]): string {
  if (category.match) {
    const found = products.find(category.match);
    if (found) return found.imageUrl;
  }
  // Fallback — featured first, else first product overall
  const featured = products.find((p) => p.featured);
  return featured?.imageUrl ?? products[0]?.imageUrl ?? "";
}

export function CategoriesGrid({ products }: CategoriesGridProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="tss-onblack py-16 sm:py-20 lg:py-24"
      aria-label="Shop by category"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="tss-eyebrow text-[color:var(--color-green-light)] mb-3">
              Shop by Category
            </p>
            <h2 className="tss-display text-white text-[clamp(2rem,4.5vw,3.5rem)]">
              Pick Your Game
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-[color:var(--color-green-light)] transition-colors whitespace-nowrap"
          >
            All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const img = pickImage(cat, products);
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="tss-cat-card block"
              >
                {img && (
                  <img
                    src={img}
                    alt={cat.label}
                    loading="lazy"
                    className="tss-cat-card__img"
                  />
                )}
                <div className="tss-cat-card__overlay" />
                <div className="tss-cat-card__label">
                  {cat.label}
                  <span className="tss-cat-card__count">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
