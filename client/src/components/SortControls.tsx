import { SortOptions } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, LayoutGrid } from "lucide-react";

interface SortControlsProps {
  sortOptions: SortOptions;
  onSortChange: (options: SortOptions) => void;
  totalResults: number;
  gridColumns: 3 | 4;
  onGridColumnsChange: (columns: 3 | 4) => void;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "newest", label: "Mais recentes" },
  { value: "popular", label: "Mais populares" },
  { value: "name-asc", label: "Nome A-Z" },
  { value: "name-desc", label: "Nome Z-A" },
];

const ITEMS_PER_PAGE_OPTIONS = [24, 48, 96];

export function SortControls({
  sortOptions,
  onSortChange,
  totalResults,
  gridColumns,
  onGridColumnsChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground" data-testid="text-results-count">
        Mostrando {totalResults} resultado{totalResults !== 1 ? 's' : ''}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar:</span>
          <Select
            value={sortOptions.sortBy || "relevance"}
            onValueChange={(value) =>
              onSortChange({ ...sortOptions, sortBy: value as SortOptions["sortBy"] })
            }
          >
            <SelectTrigger className="h-9 w-48" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} data-testid={`sort-option-${option.value}`}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant={gridColumns === 3 ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onGridColumnsChange(3)}
            data-testid="button-grid-3"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridColumns === 4 ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onGridColumnsChange(4)}
            data-testid="button-grid-4"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Por página:</span>
          <Select
            value={String(sortOptions.itemsPerPage || 24)}
            onValueChange={(value) =>
              onSortChange({ ...sortOptions, itemsPerPage: Number(value) })
            }
          >
            <SelectTrigger className="h-9 w-20" data-testid="select-items-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)} data-testid={`items-per-page-${option}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
