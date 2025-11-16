import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  currentCategory?: string;
}

const mainCategories = [
  { name: "All Items", path: "/shop/all", value: "all" },
  { name: "Football Tops", path: "/shop/football-tops", value: "football-tops" },
  { name: "Football Bottoms", path: "/shop/football-bottoms", value: "football-bottoms" },
  { name: "Football Accessories", path: "/shop/football-accessories", value: "football-accessories" },
  { name: "Rugby", path: "/shop/rugby", value: "rugby" },
  { name: "Basketball", path: "/shop/basketball", value: "basketball" },
  { name: "Other Sports", path: "/shop/other-sports", value: "other-sports" },
];

const subCategories = [
  { name: "Canadian Premier League", path: "/shop/football-tops?league=canadian-premier-league" },
  { name: "Major League Soccer", path: "/shop/football-tops?league=major-league-soccer" },
  { name: "English Premier League", path: "/shop/football-tops?league=premier-league" },
  { name: "La Liga", path: "/shop/football-tops?league=la-liga" },
  { name: "Italian Serie A", path: "/shop/football-tops?league=serie-a" },
  { name: "Bundesliga", path: "/shop/football-tops?league=bundesliga" },
  { name: "Ligue 1", path: "/shop/football-tops?league=ligue-1" },
  { name: "UEFA National Teams", path: "/shop/football-tops?category=national-teams&region=uefa" },
  { name: "CONMEBOL National Teams", path: "/shop/football-tops?category=national-teams&region=conmebol" },
  { name: "CONCACAF National Teams", path: "/shop/football-tops?category=national-teams&region=concacaf" },
  { name: "Other National Teams", path: "/shop/football-tops?category=national-teams" },
  { name: "Other International Clubs", path: "/shop/football-tops?category=international-clubs" },
  { name: "Canada Soccer", path: "/shop/football-tops?club=canada-soccer" },
  { name: "Toronto FC", path: "/shop/football-tops?club=toronto-fc" },
  { name: "York United", path: "/shop/football-tops?club=york-united" },
  { name: "Lionel Messi", path: "/shop/football-tops?player=lionel-messi" },
];

export function CategorySidebar({ currentCategory }: CategorySidebarProps) {
  const [location] = useLocation();

  return (
    <div className="w-full space-y-8" data-testid="category-sidebar">
      <div>
        <h2 className="mb-5 text-xl font-bold text-gray-900">Browse by category</h2>
        <nav className="space-y-1">
          {mainCategories.map((category) => {
            const isActive = location === category.path || 
              (category.value === "all" && location === "/") ||
              (currentCategory === category.value);
            
            return (
              <Link key={category.path} href={category.path}>
                <a
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:translate-x-1"
                  )}
                >
                  {category.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          More Categories
        </h3>
        <nav className="space-y-1">
          {subCategories.map((category) => (
            <Link key={category.path} href={category.path}>
              <a className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium">
                {category.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Price range (CAD$)
        </h3>
        <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>All prices</option>
          <option>Under $50</option>
          <option>$50 - $100</option>
          <option>$100 - $200</option>
          <option>$200 - $500</option>
          <option>Over $500</option>
        </select>
      </div>
    </div>
  );
}

