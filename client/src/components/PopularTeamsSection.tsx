import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopularTeamsSectionProps {
  products: Product[];
}

const popularTeams = ["AC Milan", "Arsenal", "Barcelona", "Bayern Munich", "Real Madrid", "Liverpool"];

export function PopularTeamsSection({ products }: PopularTeamsSectionProps) {
  // Get one product per popular team
  const teamProducts = popularTeams
    .map(team => products.find(p => p.club === team))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 6);

  if (teamProducts.length === 0) return null;

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Popular Teams</h2>
          <Link href="/?category=teams">
            <Button variant="ghost" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {teamProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="group overflow-hidden border transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold">{product.club}</p>
                  <p className="text-xs text-muted-foreground">{product.league}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

