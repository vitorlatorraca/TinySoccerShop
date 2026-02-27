import { Truck, Shield } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-8 items-center justify-center gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium">
          <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
            <Truck className="h-3 w-3" />
            Free worldwide shipping over $150
          </span>
          <span className="hidden sm:inline opacity-40" aria-hidden="true">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
            <Shield className="h-3 w-3" />
            Authenticity guaranteed
          </span>
          <span className="sm:hidden opacity-80">Free shipping over $150 &middot; Authenticity guaranteed</span>
        </div>
      </div>
    </div>
  );
}
