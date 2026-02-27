import { Link } from "wouter";
import type { Product } from "@shared/schema";
import {
  inferCompetition,
  inferEra,
  inferCondition,
  formatPrice,
  SIZES,
} from "@/lib/productUtils";
import { MetadataTag } from "./MetadataTag";
import { ArrowRight } from "lucide-react";

interface JerseyObjectProps {
  product: Product;
}

export function JerseyObject({ product }: JerseyObjectProps) {
  const competition = inferCompetition(product);
  const era = inferEra(product);
  const condition = inferCondition(product);

  return (
    <article
      className="artifact-stage"
      data-testid={`artifact-${product.slug}`}
    >
      <div className="artifact-stage__inner">
        <div className="artifact-stage__layout">
          <div className="artifact-stage__object">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="artifact-jersey-img"
              loading="lazy"
              data-testid={`img-artifact-${product.slug}`}
            />
          </div>

          <div className="artifact-meta animate-fade-in-up">
            <div>
              <p className="brand-overline mb-3">{product.league}</p>
              <h3 className="artifact-meta__title">{product.name}</h3>
              <p className="artifact-meta__club mt-1">{product.club} &middot; {product.season}</p>
            </div>

            <div className="artifact-meta__tags">
              <MetadataTag emphasis>{competition}</MetadataTag>
              <MetadataTag>{era}</MetadataTag>
              <MetadataTag>{condition}</MetadataTag>
            </div>

            <div>
              <p className="brand-meta mb-2">Available sizes</p>
              <div className="artifact-meta__sizes-list">
                {SIZES.map((s) => {
                  const available = product.sizes.includes(s);
                  return (
                    <span
                      key={s}
                      className={[
                        "inline-flex items-center justify-center w-10 h-10 rounded-lg text-[13px] font-medium transition-all duration-200",
                        available
                          ? "border-2 border-foreground text-foreground"
                          : "border border-border/50 text-muted-foreground/50",
                      ].join(" ")}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="artifact-meta__footer">
              <p className="brand-price-lg text-foreground">
                {formatPrice(product.price)}
              </p>
              <Link href={`/product/${product.slug}`}>
                <a
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity duration-200"
                  data-testid={`link-artifact-view-${product.slug}`}
                >
                  View details
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
