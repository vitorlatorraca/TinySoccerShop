import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}

export function Container({ children, narrow, className = "" }: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto px-5 sm:px-8 lg:px-10",
        narrow ? "max-w-[60ch]" : "max-w-7xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
