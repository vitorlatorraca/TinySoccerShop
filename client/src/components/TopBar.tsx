export function TopBar() {
  return (
    <div className="bg-background text-foreground border-b border-border/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Curated Drop</span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Edition 01 — Archive Rooms
            </span>
          </div>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Worldwide shipping • Authenticity-backed
          </div>
        </div>
      </div>
    </div>
  );
}

