export interface FilterGroup<T extends string> {
  label: string;
  groupKey: string;
  multi?: boolean;
  options: Array<{ value: T; label: string; disabled?: boolean }>;
}

interface FilterIndexProps<T extends string> {
  groups: FilterGroup<T>[];
  selected: Partial<Record<string, T | T[]>>;
  onSelect: (groupKey: string, value: T | null) => void;
  onClear?: () => void;
  resultCount?: number;
  resultLabel?: string;
  activeCount?: number;
}

export function FilterIndex<T extends string>({
  groups,
  selected,
  onSelect,
  onClear,
  resultCount,
  resultLabel = "shirts",
  activeCount = 0,
}: FilterIndexProps<T>) {
  return (
    <section id="discover" className="section-spacing-lg" aria-label="Discovery and filtering">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="brand-overline mb-3">Discover</p>
            <h2 className="brand-section-title text-foreground">Browse the archive</h2>
          </div>
          {activeCount > 0 && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-clear-filters"
            >
              Clear filters ({activeCount})
            </button>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-14 md:items-start">
          {groups.map((group) => (
            <div key={group.groupKey} className="flex flex-col gap-3">
              <span className="brand-meta">{group.label}</span>
              <ul className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5" role="list">
                {group.options.map((opt) => {
                  const isMulti = group.multi === true;
                  const isSelected = isMulti
                    ? (selected[group.groupKey] as T[] | undefined)?.includes(opt.value)
                    : selected[group.groupKey] === opt.value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        disabled={opt.disabled}
                        onClick={() =>
                          onSelect(
                            group.groupKey,
                            isMulti ? opt.value : isSelected ? null : opt.value
                          )
                        }
                        className={[
                          "text-left text-[13px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full px-3 py-1.5 md:px-2.5",
                          isSelected
                            ? "bg-foreground text-background font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]",
                          opt.disabled ? "opacity-40 cursor-not-allowed" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {resultCount !== undefined && (
          <p className="mt-8 text-sm text-muted-foreground">
            {resultCount} {resultLabel} in scope
          </p>
        )}
      </div>
    </section>
  );
}
