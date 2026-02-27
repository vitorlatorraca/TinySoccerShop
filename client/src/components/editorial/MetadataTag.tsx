import type { ReactNode } from "react";

interface MetadataTagProps {
  children: ReactNode;
  emphasis?: boolean;
}

export function MetadataTag({ children, emphasis }: MetadataTagProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[0.6875rem] leading-none tracking-[0.08em] uppercase font-medium",
        emphasis
          ? "bg-foreground/[0.06] text-foreground"
          : "bg-transparent text-muted-foreground border border-border/50",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
