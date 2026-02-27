import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <p className="brand-overline mb-4">404</p>
        <h1 className="brand-display text-foreground mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 items-center px-8 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
