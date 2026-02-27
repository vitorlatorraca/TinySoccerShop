import type { ReactNode } from "react";

interface PageShellProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Blueprint: top-level layout — optional minimal header, main content, optional footer.
 */
export function PageShell({ header, children, footer, className = "" }: PageShellProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      {header ?? null}
      <main>{children}</main>
      {footer ?? null}
    </div>
  );
}
