import { Product } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { SortOptions } from "@shared/schema";

export type ShopSortBy = NonNullable<SortOptions["sortBy"]>;

export interface ShopFilterState {
  sortBy: ShopSortBy;
  sizes: string[];
  leagues: string[];
  clubs: string[];
  minPrice: string;
  maxPrice: string;
  hasPlayerName: boolean | null;
}

const SORT_OPTIONS: { value: ShopSortBy; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

const SIZES = ["S", "M", "L", "XL"];

function extractLeaguesAndClubs(products: Product[]) {
  const leagues = Array.from(new Set(products.map((p) => p.league))).sort();
  const clubs = Array.from(new Set(products.map((p) => p.club))).sort();
  return { leagues, clubs };
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/30 pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 text-sm font-medium text-foreground"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

interface ShopFiltersProps {
  products: Product[];
  filter: ShopFilterState;
  onFilterChange: (filter: ShopFilterState) => void;
  resultCount: number;
}

export function ShopFilters({
  products,
  filter,
  onFilterChange,
  resultCount,
}: ShopFiltersProps) {
  const { leagues, clubs } = extractLeaguesAndClubs(products);

  const update = (patch: Partial<ShopFilterState>) => {
    onFilterChange({ ...filter, ...patch });
  };

  const handleSizeToggle = (size: string, checked: boolean) => {
    const next = checked
      ? [...filter.sizes, size]
      : filter.sizes.filter((s) => s !== size);
    update({ sizes: next });
  };

  const handleLeagueToggle = (league: string, checked: boolean) => {
    const next = checked
      ? [...filter.leagues, league]
      : filter.leagues.filter((l) => l !== league);
    update({ leagues: next });
  };

  const handleClubToggle = (club: string, checked: boolean) => {
    const next = checked
      ? [...filter.clubs, club]
      : filter.clubs.filter((c) => c !== club);
    update({ clubs: next });
  };

  const clearAll = () => {
    onFilterChange({
      sortBy: "relevance",
      sizes: [],
      leagues: [],
      clubs: [],
      minPrice: "",
      maxPrice: "",
      hasPlayerName: null,
    });
  };

  const hasActiveFilters =
    filter.sizes.length > 0 ||
    filter.leagues.length > 0 ||
    filter.clubs.length > 0 ||
    filter.minPrice !== "" ||
    filter.maxPrice !== "" ||
    filter.hasPlayerName !== null;

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground tracking-[-0.01em]">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort by">
        <div className="space-y-1">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update({ sortBy: o.value })}
              className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                filter.sortBy === o.value
                  ? "bg-foreground/[0.06] font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size, !filter.sizes.includes(size))}
              className={[
                "h-9 rounded-lg text-[13px] font-medium transition-all duration-200",
                filter.sizes.includes(size)
                  ? "bg-foreground text-background"
                  : "border border-border/50 text-foreground hover:border-foreground/30",
              ].join(" ")}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filter.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="h-9 w-full rounded-lg border border-border/40 bg-transparent px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            min={0}
          />
          <span className="text-muted-foreground text-xs shrink-0">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filter.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="h-9 w-full rounded-lg border border-border/40 bg-transparent px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            min={0}
          />
        </div>
      </FilterSection>

      {/* Player name */}
      <FilterSection title="Player Name" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={filter.hasPlayerName === true}
              onCheckedChange={(c) => update({ hasPlayerName: c ? true : null })}
              className="h-4 w-4 rounded"
            />
            <span className="text-[13px] text-foreground">With player name</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={filter.hasPlayerName === false}
              onCheckedChange={(c) => update({ hasPlayerName: c ? false : null })}
              className="h-4 w-4 rounded"
            />
            <span className="text-[13px] text-foreground">Without name</span>
          </label>
        </div>
      </FilterSection>

      {/* League */}
      {leagues.length > 0 && (
        <FilterSection title="League" defaultOpen={false}>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {leagues.map((league) => (
              <label
                key={league}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <Checkbox
                  checked={filter.leagues.includes(league)}
                  onCheckedChange={(c) => handleLeagueToggle(league, !!c)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-[13px] text-foreground">{league}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Team */}
      {clubs.length > 0 && (
        <FilterSection title="Team" defaultOpen={false}>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {clubs.map((club) => (
              <label
                key={club}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <Checkbox
                  checked={filter.clubs.includes(club)}
                  onCheckedChange={(c) => handleClubToggle(club, !!c)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-[13px] text-foreground">{club}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <p className="text-[12px] text-muted-foreground pt-2">
        {resultCount} item{resultCount !== 1 ? "s" : ""} found
      </p>
    </aside>
  );
}
