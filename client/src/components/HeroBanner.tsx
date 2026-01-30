import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  product: Product | null;
}

export function HeroBanner({ product }: HeroBannerProps) {
  if (!product) return null;

  const originalPrice = parseFloat(product.price) * 1.5;
  const discountPrice = parseFloat(product.price) * 0.7;
  const finalPrice = parseFloat(product.price);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-red-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[500px] grid-cols-1 items-center gap-8 py-12 lg:grid-cols-2 lg:py-16">
          {/* Left side - Pricing */}
          <div className="z-10 flex flex-col items-start gap-6 text-white">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-sm line-through opacity-70">RRP ${originalPrice.toFixed(2)}</span>
                <span className="text-sm line-through opacity-70">${discountPrice.toFixed(2)}</span>
                <span className="text-5xl font-bold">${finalPrice.toFixed(2)}</span>
              </div>
              <div className="rounded-md bg-white/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide">WEEKLY DEALS</p>
                <p className="text-sm">SAVE UP TO 70% OFF THE RRP</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold uppercase leading-tight lg:text-5xl">
                {product.club}
              </h2>
              {product.player && (
                <p className="text-lg text-white/90">
                  Authentic {product.type} Shirt {product.season} - {product.player}
                </p>
              )}
            </div>

            <Link href={`/product/${product.slug}`}>
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-muted font-semibold"
              >
                SHOP NOW
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right side - Product Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-auto w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

