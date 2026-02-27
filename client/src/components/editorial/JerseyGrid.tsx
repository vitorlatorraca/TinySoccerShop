import type { ReactNode } from "react";

interface JerseyGridProps {
  children: ReactNode;
  className?: string;
}

export function JerseyGrid({ children, className = "" }: JerseyGridProps) {
  return (
    <div
      className={[
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10",
        className,
      ].join(" ")}
      role="list"
    >
      {children}
    </div>
  );
}
