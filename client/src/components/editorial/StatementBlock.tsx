interface StatementBlockProps {
  headline: string;
  body: string;
}

export function StatementBlock({ headline, body }: StatementBlockProps) {
  return (
    <section
      className="hero-texture min-h-[70vh] flex flex-col justify-center py-20 lg:py-28"
      aria-label="Introduction"
    >
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
        <h1 className="brand-display text-foreground animate-fade-in-up">{headline}</h1>
        <p className="brand-body-lead mt-8 text-muted-foreground mx-auto animate-fade-in-up animate-fade-in-delay-2">
          {body}
        </p>
      </div>
    </section>
  );
}
