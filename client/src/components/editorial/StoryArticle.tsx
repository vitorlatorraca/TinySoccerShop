import type { Story } from "@/content/stories";
import { StoryCover } from "./StoryCover";

interface StoryArticleProps {
  story: Story;
}

const TRANSITION_LINE = "The shirt worn that night.";

export function StoryArticle({ story }: StoryArticleProps) {
  return (
    <article
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 animate-fade-in"
      data-testid={`story-${story.id}`}
      aria-labelledby={`story-title-${story.id}`}
    >
      <StoryCover cover={story.cover} />

      <header className="mx-auto max-w-[60ch] editorial-story__header">
        <h2
          id={`story-title-${story.id}`}
          className="blueprint-story-title text-foreground"
        >
          {story.title}
        </h2>
        <p className="mt-3 blueprint-story-subtitle">{story.subtitle}</p>
      </header>

      <div className="mx-auto max-w-[60ch] space-y-6 editorial-story__body">
        {story.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className={`blueprint-body text-foreground${idx === 0 ? " blueprint-body-lead" : ""}`}
          >
            {p}
          </p>
        ))}
      </div>

      <div className="editorial-transition" aria-hidden="true">
        <p className="blueprint-transition-line italic">{TRANSITION_LINE}</p>
      </div>
    </article>
  );
}
