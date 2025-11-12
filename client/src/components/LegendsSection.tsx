import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegendsSectionProps {
  products: Product[];
}

const legendPlayers = ["Lionel Messi", "Cristiano Ronaldo", "Wayne Rooney", "Steven Gerrard"];

export function LegendsSection({ products }: LegendsSectionProps) {
  const legendProducts = products
    .filter(p => p.player && legendPlayers.includes(p.player))
    .slice(0, 5);

  if (legendProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Legends</h2>
          <Link href="/?category=legends">
            <Button variant="ghost" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <Link href="/?category=legends" className="shrink-0">
            <Card className="flex h-64 w-48 flex-col items-center justify-center border-2 border-dashed hover:border-primary transition-colors cursor-pointer">
              <span className="text-sm font-medium text-muted-foreground">View All</span>
            </Card>
          </Link>
          
          {legendProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="shrink-0">
              <Card className="group h-64 w-48 overflow-hidden border transition-all hover:shadow-lg">
                <div className="relative h-3/4 overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex h-1/4 flex-col justify-center p-3">
                  <p className="text-xs font-semibold uppercase">{product.player}</p>
                  <p className="text-xs text-muted-foreground">{product.club}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

