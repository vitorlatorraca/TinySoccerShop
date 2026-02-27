import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ImageStageMode = "artifact" | "context";

interface ImageStageProps {
  artifactImageUrl: string;
  artifactAlt: string;
  contextImageUrl: string;
  contextAlt: string;
  stage: ImageStageMode;
  onStageChange: (stage: ImageStageMode) => void;
}

const SWIPE_THRESHOLD_PX = 60;

export function ImageStage({
  artifactImageUrl,
  artifactAlt,
  contextImageUrl,
  contextAlt,
  stage,
  onStageChange,
}: ImageStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const goTo = useCallback(
    (next: ImageStageMode) => {
      onStageChange(next);
    },
    [onStageChange]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStart.current === null) return;
      const delta = e.clientX - dragStart.current;
      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
        if (delta > 0) goTo("artifact");
        else goTo("context");
      }
      dragStart.current = null;
    },
    [goTo]
  );

  const handlePointerCancel = useCallback(() => {
    dragStart.current = null;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo("artifact"); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo("context"); }
    },
    [goTo]
  );

  const index = stage === "artifact" ? 0 : 1;
  const translateX = index * -100;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/30 bg-card"
      role="region"
      aria-label="Product view: artifact or in game"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="image-stage__track flex h-full w-full"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        <div
          className="flex h-full w-full shrink-0 items-center justify-center p-8 sm:p-12"
          aria-hidden={stage !== "artifact" ? "true" : "false"}
        >
          <img
            src={artifactImageUrl}
            alt={artifactAlt}
            className="h-full w-full object-contain jersey-img"
            draggable={false}
            loading="eager"
          />
        </div>
        <div
          className="relative flex h-full w-full shrink-0 flex-col overflow-hidden"
          aria-hidden={stage !== "context" ? "true" : "false"}
        >
          <img
            src={contextImageUrl}
            alt={contextAlt}
            className="h-full w-full object-cover object-center"
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo("artifact")}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground/60 transition-all duration-200 hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
        aria-label="View artifact"
        disabled={stage === "artifact"}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo("context")}
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground/60 transition-all duration-200 hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
        aria-label="View in game"
        disabled={stage === "context"}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-background/80 backdrop-blur-sm px-4 py-2"
        aria-hidden
      >
        <button
          type="button"
          onClick={() => goTo("artifact")}
          className={`text-[11px] uppercase tracking-[0.1em] font-medium transition-colors ${
            stage === "artifact" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Artifact
        </button>
        <span className="text-border">|</span>
        <button
          type="button"
          onClick={() => goTo("context")}
          className={`text-[11px] uppercase tracking-[0.1em] font-medium transition-colors ${
            stage === "context" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          In game
        </button>
      </div>
    </div>
  );
}
