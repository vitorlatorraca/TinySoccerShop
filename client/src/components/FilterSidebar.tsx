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
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            data-testid="button-clear-filters"
          >
            Clear ({activeFilterCount})
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["price", "leagues", "sizes"]} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-price">
            FAIXA DE PREÇO
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
                  placeholder="Mín"
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
                  placeholder="Máx"
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

        <AccordionItem value="leagues">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-leagues">
            LIGA / COMPETIÇÃO
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {LEAGUES.map((league) => (
                <div key={league} className="flex items-center space-x-2">
                  <Checkbox
                    id={`league-${league}`}
                    checked={filters.leagues?.includes(league)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("leagues", league, checked as boolean)
                    }
                    data-testid={`checkbox-league-${league.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`league-${league}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {league}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clubs">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-clubs">
            CLUBES
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {CLUBS.map((club) => (
                <div key={club} className="flex items-center space-x-2">
                  <Checkbox
                    id={`club-${club}`}
                    checked={filters.clubs?.includes(club)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("clubs", club, checked as boolean)
                    }
                    data-testid={`checkbox-club-${club.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`club-${club}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {club}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nationalTeams">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-national-teams">
            SELEÇÕES NACIONAIS
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {NATIONAL_TEAMS.map((team) => (
                <div key={team} className="flex items-center space-x-2">
                  <Checkbox
                    id={`national-team-${team}`}
                    checked={filters.nationalTeams?.includes(team)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("nationalTeams", team, checked as boolean)
                    }
                    data-testid={`checkbox-national-team-${team.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`national-team-${team}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {team}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seasons">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-seasons">
            TEMPORADAS
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {SEASONS.map((season) => (
                <div key={season} className="flex items-center space-x-2">
                  <Checkbox
                    id={`season-${season}`}
                    checked={filters.seasons?.includes(season)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("seasons", season, checked as boolean)
                    }
                    data-testid={`checkbox-season-${season.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`season-${season}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {season}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="players">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-players">
            JOGADORES
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {PLAYERS.map((player) => (
                <div key={player} className="flex items-center space-x-2">
                  <Checkbox
                    id={`player-${player}`}
                    checked={filters.players?.includes(player)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("players", player, checked as boolean)
                    }
                    data-testid={`checkbox-player-${player.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`player-${player}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {player}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-sizes">
            TAMANHO
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

        <AccordionItem value="types">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-types">
            TIPO
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

        <AccordionItem value="conditions">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-conditions">
            CONDIÇÃO
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={filters.conditions?.includes(condition)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("conditions", condition, checked as boolean)
                    }
                    data-testid={`checkbox-condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`condition-${condition}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-features">
            CARACTERÍSTICAS
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autographed"
                  checked={filters.isAutographed || false}
                  onCheckedChange={(checked) =>
                    handleBooleanChange("isAutographed", checked as boolean)
                  }
                  data-testid="checkbox-autographed"
                />
                <Label htmlFor="autographed" className="cursor-pointer text-sm font-normal">
                  Autografada
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="match-worn"
                  checked={filters.isMatchWorn || false}
                  onCheckedChange={(checked) =>
                    handleBooleanChange("isMatchWorn", checked as boolean)
                  }
                  data-testid="checkbox-match-worn"
                />
                <Label htmlFor="match-worn" className="cursor-pointer text-sm font-normal">
                  Match Worn
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="limited-edition"
                  checked={filters.isLimitedEdition || false}
                  onCheckedChange={(checked) =>
                    handleBooleanChange("isLimitedEdition", checked as boolean)
                  }
                  data-testid="checkbox-limited-edition"
                />
                <Label htmlFor="limited-edition" className="cursor-pointer text-sm font-normal">
                  Edição Limitada
                </Label>
              </div>
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
                  Com Certificado
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-brands">
            MARCA
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {BRANDS.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands?.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("brands", brand, checked as boolean)
                    }
                    data-testid={`checkbox-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm font-normal">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="genders">
          <AccordionTrigger className="text-sm font-semibold" data-testid="accordion-genders">
            GÊNERO
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {GENDERS.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={filters.genders?.includes(gender)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("genders", gender, checked as boolean)
                    }
                    data-testid={`checkbox-gender-${gender.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={`gender-${gender}`} className="cursor-pointer text-sm font-normal">
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
