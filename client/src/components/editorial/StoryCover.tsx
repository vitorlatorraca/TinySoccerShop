import type { StoryCover as StoryCoverType } from "@/content/stories";

interface StoryCoverProps {
  cover: StoryCoverType;
}

/**
 * REFERENCE A: Editorial / story only. Large magazine opening spread.
 * Image carries the emotion; neutral UI. No overlay, no decoration.
 */
export function StoryCover({ cover }: StoryCoverProps) {
  if (cover.kind === "image") {
    return (
      <figure className="editorial-cover w-full">
        <div className="editorial-cover__image-wrap">
          <img
            src={cover.url}
            alt={cover.alt}
            className="editorial-cover__image"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        {cover.caption ? (
          <figcaption className="editorial-cover__caption">{cover.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="w-full">
      <div className="aspect-[16/9] w-full bg-muted" aria-hidden="true" />
      <span className="sr-only">{cover.alt}</span>
      {cover.caption ? (
        <figcaption className="mt-3 blueprint-micro">{cover.caption}</figcaption>
      ) : null}
    </figure>
  );
}
