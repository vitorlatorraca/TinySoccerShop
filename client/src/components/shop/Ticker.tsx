interface TickerProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "Football Tops",
  "Vault Collection",
  "Rugby Heritage",
  "Basketball Classics",
  "Football Bottoms",
  "Limited Drops",
  "On-Pitch Icons",
  "Sale Edit",
  "Football Accessories",
  "Other Sports",
];

export function Ticker({ items = DEFAULT_ITEMS }: TickerProps) {
  // Duplicate the list so the CSS keyframe (translateX -50%) loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="tss-ticker" aria-hidden="true">
      <div className="tss-ticker__track">
        {loop.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center gap-12">
            <span>{label}</span>
            <span className="tss-ticker__sep">&#9733;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
