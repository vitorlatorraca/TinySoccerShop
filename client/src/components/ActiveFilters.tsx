import { FilterOptions } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (category: keyof FilterOptions, value?: string) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const activeFilters: { category: keyof FilterOptions; label: string; value?: string }[] = [];

  if (filters.leagues && filters.leagues.length > 0) {
    filters.leagues.forEach((league) => {
      activeFilters.push({ category: "leagues", label: league, value: league });
    });
  }

  if (filters.clubs && filters.clubs.length > 0) {
    filters.clubs.forEach((club) => {
      activeFilters.push({ category: "clubs", label: club, value: club });
    });
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filters.sizes.forEach((size) => {
      activeFilters.push({ category: "sizes", label: `Size: ${size}`, value: size });
    });
  }

  if (filters.types && filters.types.length > 0) {
    filters.types.forEach((type) => {
      activeFilters.push({ category: "types", label: type, value: type });
    });
  }

  if (filters.conditions && filters.conditions.length > 0) {
    filters.conditions.forEach((condition) => {
      activeFilters.push({ category: "conditions", label: condition, value: condition });
    });
  }

  if (filters.brands && filters.brands.length > 0) {
    filters.brands.forEach((brand) => {
      activeFilters.push({ category: "brands", label: brand, value: brand });
    });
  }

  if (filters.genders && filters.genders.length > 0) {
    filters.genders.forEach((gender) => {
      activeFilters.push({ category: "genders", label: gender, value: gender });
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice || 0;
    const max = filters.maxPrice || 10000;
    activeFilters.push({
      category: "minPrice",
      label: `$${min} - $${max}`,
    });
  }

  if (filters.isAutographed) {
    activeFilters.push({ category: "isAutographed", label: "Autographed" });
  }

  if (filters.isMatchWorn) {
    activeFilters.push({ category: "isMatchWorn", label: "Match Worn" });
  }

  if (filters.isLimitedEdition) {
    activeFilters.push({ category: "isLimitedEdition", label: "Limited Edition" });
  }

  if (filters.hasCertificate) {
    activeFilters.push({ category: "hasCertificate", label: "With Certificate" });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 p-4" data-testid="active-filters">
      <span className="text-sm font-semibold">Active filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.category}-${filter.value || 'bool'}-${index}`}
          variant="secondary"
          className="gap-1 pr-1"
          data-testid={`badge-active-filter-${index}`}
        >
          {filter.label}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => onRemoveFilter(filter.category, filter.value)}
            data-testid={`button-remove-filter-${index}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
