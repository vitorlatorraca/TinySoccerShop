import { FilterOptions } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  productCounts?: {
    leagues: Record<string, number>;
    clubs: Record<string, number>;
    sizes: Record<string, number>;
  };
}

const LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "MLS",
  "Champions League",
  "Copa do Mundo",
];

const CLUBS = [
  "Barcelona",
  "Real Madrid",
  "Manchester United",
  "Liverpool",
  "Bayern Munich",
  "Paris Saint-Germain",
  "Juventus",
  "AC Milan",
  "Inter Milan",
  "Arsenal",
  "Chelsea",
];

const NATIONAL_TEAMS = [
  "Brasil",
  "Argentina",
  "Alemanha",
  "França",
  "Inglaterra",
  "Espanha",
  "Itália",
  "Portugal",
];

const PLAYERS = [
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Ronaldo Fenômeno",
  "David Beckham",
  "Thierry Henry",
  "Mohamed Salah",
  "Bastian Schweinsteiger",
  "Alessandro Del Piero",
  "Wesley Sneijder",
  "Frank Lampard",
  "Kaká",
];

const SEASONS = [
  "2023/24",
  "2022/23",
  "2021/22",
  "2020/21",
  "2019/20",
  "2018/19",
  "2016/17",
  "2012/13",
  "2010/11",
  "2009/10",
  "2003/04",
  "1998/99",
  "1996/97",
  "2002",
  "Vintage",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const TYPES = ["Home", "Away", "Third", "Goleiro", "Edição Especial", "Treino"];

const CONDITIONS = [
  "Nova com etiquetas",
  "Nova sem etiquetas",
  "Excelente estado",
  "Bom estado",
  "Vintage",
];

const BRANDS = ["Nike", "Adidas", "Puma", "Umbro", "New Balance", "Outras"];

const GENDERS = ["Masculino", "Feminino", "Infantil", "Unissex"];

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const handleCheckboxChange = (category: keyof FilterOptions, value: string, checked: boolean) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange({ ...filters, [category]: newValues });
  };

  const handleBooleanChange = (key: keyof FilterOptions, checked: boolean) => {
    onFilterChange({ ...filters, [key]: checked });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value === true;
    if (key === 'minPrice' || key === 'maxPrice') return value !== undefined;
    return false;
  }).length;

  return (
    <div className="w-full space-y-6 overflow-y-auto pr-2" data-testid="filter-sidebar">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary hover:text-primary hover:bg-muted"
            data-testid="button-clear-filters"
          >
            Clear ({activeFilterCount})
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort By (minimal placeholder, to mirror reference) */}
      <div className="border-t">
        <div className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b">
          Sort By
        </div>
        <div className="py-3">
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Name: A to Z</option>
          </select>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["sizes", "price"]} className="w-full border-t">
        <AccordionItem value="sizes">
          <AccordionTrigger className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b" data-testid="accordion-sizes">
            Product Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 py-2">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant={filters.sizes?.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    handleCheckboxChange(
                      "sizes",
                      size,
                      !filters.sizes?.includes(size)
                    )
                  }
                  data-testid={`button-size-${size.toLowerCase()}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b" data-testid="accordion-price">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={[filters.minPrice || 0, filters.maxPrice || 10000]}
                onValueChange={handlePriceChange}
                data-testid="slider-price"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || 0}
                  onChange={(e) =>
                    onFilterChange({ ...filters, minPrice: Number(e.target.value) })
                  }
                  className="h-9"
                  data-testid="input-min-price"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || 10000}
                  onChange={(e) =>
                    onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
                  }
                  className="h-9"
                  data-testid="input-max-price"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b" data-testid="accordion-types">
            Product Style
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types?.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("types", type, checked as boolean)
                    }
                    data-testid={`checkbox-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={`type-${type}`} className="cursor-pointer text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b" data-testid="accordion-brands">
            Color
          </AccordionTrigger>
          <AccordionContent>
            {/* Placeholder list – adjust to real colors when available */}
            <div className="space-y-3 py-2 text-sm text-muted-foreground">No color filters available</div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="flex w-full items-center justify-between py-4 text-[18px] font-semibold border-b" data-testid="accordion-features">
            Printed?
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificate"
                  checked={filters.hasCertificate || false}
                  onCheckedChange={(checked) =>
                    handleBooleanChange("hasCertificate", checked as boolean)
                  }
                  data-testid="checkbox-certificate"
                />
                <Label htmlFor="certificate" className="cursor-pointer text-sm font-normal">
                  With Certificate
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
