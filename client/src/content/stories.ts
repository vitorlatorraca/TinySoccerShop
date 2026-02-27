export type StoryCompetition = "League" | "Champions League" | "Domestic Cups" | "International";
export type StoryEra = "80s" | "90s" | "00s" | "Modern";

export type StoryCover =
  | {
      kind: "placeholder";
      /** Used for screen readers even when we render a CSS-only placeholder. */
      alt: string;
      /** Visible caption under the cover. */
      caption?: string;
      tone?: "night" | "paper";
    }
  | {
      kind: "image";
      url: string;
      alt: string;
      caption?: string;
    };

export interface Story {
  id: string;
  club: string;
  linkedProductSlug: string;
  competitions: StoryCompetition[];
  era: StoryEra;
  cover: StoryCover;
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export const STORIES: Story[] = [
  {
    id: "milan-1989-steaua",
    club: "AC Milan",
    linkedProductSlug: "ac-milan-home-shirt-1989",
    competitions: ["Champions League"],
    era: "80s",
    cover: {
      kind: "image",
      url: "/editorial/ac-milan-1989-match.png",
      alt: "AC Milan in training. Red and black stripes, collective run. The discipline behind the nights that changed European football.",
      caption: "AC Milan, late 1980s. One line, one rhythm.",
    },
    title: "The line that moved as one.",
    subtitle: "European Cup, 1989. Before the trophy, the standard.",
    paragraphs: [
      "Identity in football is rarely about a single night. It is built in repetition: the same run, the same shape, the same refusal to break. Sacchi’s Milan became an era not because they won once, but because they made dominance look like discipline.",
      "The red and black stripes came to mean something precise — a high line, a collective press, a unit that moved before the ball did. When they finally lifted the European Cup in Barcelona, the result felt less like an upset than like an archive being written in real time.",
      "Certain shirts outlast the score. They carry the weight of a way of playing: the training ground, the belief, the nights when a team decided what it would be.",
    ],
  },
  {
    id: "barcelona-2011-wembley",
    club: "Barcelona",
    linkedProductSlug: "barcelona-home-shirt-2010-11",
    competitions: ["Champions League"],
    era: "Modern",
    cover: {
      kind: "placeholder",
      tone: "night",
      alt: "Wembley under floodlights — placeholder match photograph.",
      caption: "Placeholder match photograph — replace with a licensed/owned image.",
    },
    title: "Wembley, 2011. Barcelona’s peak on the biggest stage.",
    subtitle: "Champions League Final • 28 May 2011 • A team that made possession feel inevitable.",
    paragraphs: [
      "There are finals decided by moments. And then there are finals that feel like a thesis — a club’s idea of football laid out under the cleanest lights in Europe.",
      "Barcelona arrived at Wembley with a rhythm you couldn’t break by tackling harder. The ball moved faster than pressure. The pitch became a map, and every pass felt like a sentence completing itself.",
      "When a shirt holds that kind of identity, it stops being a kit. It becomes an emblem of how a generation remembered the game: control, courage, and the calm of knowing exactly who you are.",
    ],
  },
  {
    id: "chelsea-2012-munich",
    club: "Chelsea",
    linkedProductSlug: "chelsea-home-shirt-2011-12",
    competitions: ["Champions League"],
    era: "Modern",
    cover: {
      kind: "placeholder",
      tone: "night",
      alt: "Munich night final — placeholder match photograph.",
      caption: "Placeholder match photograph — replace with a licensed/owned image.",
    },
    title: "Munich, 2012. Survival football made immortal.",
    subtitle: "Champions League Final • 19 May 2012 • When belief outlasted the odds.",
    paragraphs: [
      "Some European Cups are won with dominance. Chelsea’s was won with endurance — the kind that keeps showing up after the narrative says you’re finished.",
      "Bayern pressed, the stadium leaned, and time felt like it belonged to the home side. But Chelsea’s night was built on refusal: set‑pieces, clearances, and a calm in the chaos that only comes from years of chasing the same door.",
      "That’s why the 2012 blue carries a particular weight. Not prettiness — proof. A reminder that history sometimes belongs to the team that simply wouldn’t go away.",
    ],
  },
  {
    id: "united-1999-camp-nou",
    club: "Manchester United",
    linkedProductSlug: "manchester-united-home-shirt-1998-99",
    competitions: ["Champions League"],
    era: "90s",
    cover: {
      kind: "placeholder",
      tone: "night",
      alt: "Camp Nou, stoppage time — placeholder match photograph.",
      caption: "Placeholder match photograph — replace with a licensed/owned image.",
    },
    title: "Camp Nou, 1999. The last minutes that became mythology.",
    subtitle: "Champions League Final • 26 May 1999 • When football reminded everyone it’s never over.",
    paragraphs: [
      "The treble year is remembered like a movie, but the ending was pure football: messy, frantic, impossible to script — and somehow, still inevitable once it started to turn.",
      "United were behind, chasing air, chasing seconds. Then corners arrived like lifelines, the crowd noise changed pitch, and history flipped in the space of a heartbeat.",
      "Some shirts don’t represent a season. They represent a feeling: that you keep running, you keep believing, and the game can still surprise you at the exact moment you’ve given up on surprise.",
    ],
  },
  {
    id: "corinthians-2012-libertadores",
    club: "Corinthians",
    linkedProductSlug: "corinthians-home-shirt-2012",
    competitions: ["International"],
    era: "Modern",
    cover: {
      kind: "placeholder",
      tone: "paper",
      alt: "South American night, flags and smoke — placeholder match photograph.",
      caption: "Placeholder match photograph — replace with a licensed/owned image.",
    },
    title: "São Paulo, 2012. Libertadores pressure, city devotion.",
    subtitle: "Copa Libertadores Final • 2012 • A club carried by noise that never stops.",
    paragraphs: [
      "Corinthians isn’t a badge you wear quietly. It’s a crowd you carry — a city’s voice pressed into ninety minutes, and sometimes beyond.",
      "Libertadores nights aren’t polite. They’re tense, loud, and personal. Every tackle is a statement, every pause feels like a dare, and the stadium becomes an argument you can’t leave.",
      "That’s why this shirt matters. It’s not just a season marker — it’s a symbol of what South American football does best: making pressure feel like culture, and culture feel like home.",
    ],
  },
];

