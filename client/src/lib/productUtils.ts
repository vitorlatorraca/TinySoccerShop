import type { Product } from "@shared/schema";

export type CompetitionKey = "League" | "Champions League" | "Domestic Cups" | "International";
export type EraKey = "80s" | "90s" | "00s" | "Modern";

const SIZES = ["S", "M", "L", "XL"] as const;

function pickSeasonYear(season: string): number | null {
  const match = season.match(/\d{4}/);
  if (!match) return null;
  const year = Number(match[0]);
  return Number.isFinite(year) ? year : null;
}

export function inferEra(product: Product): EraKey {
  const year = pickSeasonYear(product.season);
  if (!year) return "Modern";
  if (year >= 1980 && year <= 1989) return "80s";
  if (year >= 1990 && year <= 1999) return "90s";
  if (year >= 2000 && year <= 2009) return "00s";
  return "Modern";
}

export function inferCompetition(product: Product): CompetitionKey {
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

export function inferCondition(product: Product): string {
  const c = (product.condition || "").toLowerCase();
  const year = pickSeasonYear(product.season);
  if (c.includes("new")) return "New";
  if (c.includes("excellent")) return "Excellent";
  if (c.includes("good")) return "Good";
  if (c.includes("used")) return "Used";
  if (year && year <= 2004) return "Archive";
  return product.condition || "Archive";
}

export function formatPrice(value: string): string {
  return `$${parseFloat(value).toFixed(2)}`;
}

export { SIZES };
