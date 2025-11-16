import { FilterOptions } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (category: keyof FilterOptions, value?: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
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

  return (
    <div className="mb-4" data-testid="active-filters">
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Active filters</span>
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={`${filter.category}-${filter.value || 'bool'}-${index}`}
              className="inline-flex items-center gap-1.5 bg-[#1a5d2e] text-white px-3 py-1.5 rounded-full text-sm font-medium"
              data-testid={`badge-active-filter-${index}`}
            >
              <span>{filter.label}</span>
              <button
                onClick={() => onRemoveFilter(filter.category, filter.value)}
                className="hover:opacity-70 transition-opacity"
                data-testid={`button-remove-filter-${index}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
