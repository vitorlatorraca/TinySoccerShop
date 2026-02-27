# TinySoccerShop — Design Blueprint  
## Minimal Football Culture Experience (Step 1 — Design Only)

**Principle:** *"Say less visually, but mean more culturally."*

This document defines the visual, structural, and interaction design for a single-homepage experience. No code is generated until approval.

---

## 1. Design philosophy (summary)

| Pillar | Meaning |
|--------|--------|
| **Minimal** | Fewer elements, strong spacing, confident type, clear hierarchy. No decorative clutter. |
| **Football culture** | References come from stories, moments, competitions, atmosphere — not from icons or generic graphics. |
| **Editorial-first** | The page reads like a magazine: statement → index → stories → objects → collection. |
| **Premium & timeless** | Neutral palettes, no trend-heavy effects. Club color lives in jerseys and match photos only. |

**Absolute rules:**  
- UI stays minimal at all times.  
- Football references are contextual (in copy and editorial imagery), not decorative.  
- No cheap football graphics or filler icons.  
- Backgrounds: off-white, near-black, warm gray only.  
- Club colors appear only in jerseys and match photos.

---

## 2. Section-by-section blueprint

### Section 1 — Introduction / Statement

**Purpose:** Set tone. One strong headline, one short paragraph. Feels like the opening spread of a football magazine.

**Content:**
- One headline (e.g. “Shirts that carried the night.” or similar — editorial, not sales).
- One short paragraph (2–4 lines) framing football as culture and memory.
- No imagery, or at most a very subtle texture (e.g. paper grain, faint gradient) so type carries the weight.

**Layout:**
- Full viewport or near-full height.
- Centered block of text with a strict max-width (e.g. ~50–65 ch for body).
- Large top/bottom padding so the block floats in space.
- No buttons, no CTAs — just statement.

**Design rules:**
- Headline: single font, one weight, one size; no underline, no icon.
- Paragraph: same family, smaller size, comfortable line-height.
- No borders, no cards, no boxes around the statement.

---

### Section 2 — Discovery & filtering (minimal)

**Purpose:** Let users explore the collection by League, Competition, Era, Size. Feels like an archive index, not a store filter panel.

**Content:**
- **League:** Top 5 European + Rest of World (text labels, not flags).
- **Competition:** League, Champions League, Domestic Cups, International.
- **Era:** 80s / 90s / 00s / Modern.
- **Size:** S / M / L / XL.

**Layout:**
- No classic sidebar. Filters live inline or in a single horizontal/stacked “index” block.
- Use text, spacing, and subtle separators (e.g. vertical rule, or simple line break).
- Each filter group: label + list of options as text links or minimal toggles.
- Selected state: clear but quiet (e.g. weight change, subtle underline, or soft background), not loud chips.

**Design rules:**
- Typography does the work: same family as the rest of the page, clear hierarchy (group label vs options).
- No dropdowns unless necessary on small screens; prefer visible options.
- Optional: small “Showing X shirts” or result count in the same typographic style.
- No icons for filter categories unless strictly needed for accessibility.

---

### Section 3 — Editorial story (per jersey)

**Purpose:** One real football story per jersey, tied to a real match, with one real in-game photograph. Calm, emotional, respectful — for fans, not “customers.”

**Content (per story):**
1. **Large match image** — Full-width or strong editorial crop. Real in-game photo only.
2. **Title** — Match name or moment (e.g. “Barcelona, 1989. Milan 4, Steaua 0.”).
3. **Subtitle** — Competition + year (e.g. “European Cup Final • 24 May 1989”).
4. **Short narrative** — 2–4 paragraphs.
5. **Transition line** — “The shirt worn that night.” (or equivalent).
6. Then the section flows into **Section 4** (jersey as object).

**Layout:**
- Comfortable reading width for text (e.g. 60–72 ch max).
- Image: full bleed or with fixed horizontal margins; height can be viewport or fixed ratio (e.g. 16:9 or 3:2).
- Lots of negative space above/below image and between title, subtitle, body, transition line.
- No sidebars, no cards around the story block — just sequence: image → title → subtitle → body → transition.

**Design rules:**
- One typeface for title, one for subtitle, one for body; sizes and weights create hierarchy.
- No boxes or borders around the narrative.
- Match images only here (and in any future “editorial” areas); never in the product grid.

---

### Section 4 — Jersey as object (right after each story)

**Purpose:** Present the shirt like a historical artifact: centered, calm, museum-like. No aggressive CTA.

**Content:**
- One isolated PNG jersey (transparent background), centered.
- **Jersey name** (e.g. “AC Milan Home Shirt 1989”).
- **Club.**
- **Competition tags** (e.g. Champions League, 80s).
- **Condition.**
- **Sizes available.**
- **Price.**

**Layout:**
- Same horizontal rhythm as the site (e.g. same max-width container).
- Jersey PNG centered; optional soft shadow or none; no product-style “card” frame.
- Text below or beside (depending on breakpoint): name, then metadata in a simple list or short lines.
- One minimal CTA (e.g. “View” or “Details”) — secondary in weight, not a big button.

**Design rules:**
- No background behind the jersey (transparent PNG on page background).
- No “Add to cart” prominence here; this block is about the object, not conversion.
- Typography: same system as the rest of the page; tags can be small caps or subtle labels.

---

### Section 5 — Curated shop (minimal grid)

**Purpose:** After all stories, show all five jerseys together in a clean grid. PNG only, strong spacing, minimal text, no pressure.

**Content (per card):**
- PNG jersey (transparent).
- Name.
- Tags (competition, era, etc.).
- Price.
- Subtle CTA (e.g. “View” or “Details”).

**Layout:**
- Grid: 2–3 columns on desktop, 1–2 on tablet, 1 on mobile. Consistent gap (e.g. 2–3rem).
- Cards: no heavy borders; optional very subtle border or shadow. Lots of padding.
- Image area dominant; text and price compact below.

**Design rules:**
- Only PNG jerseys; no match photos in this section.
- No “Buy now” or flashy CTAs — one clear, low-emphasis link per card.
- Same typography and spacing system as Sections 1–4.

---

## 3. Typography scale

Single primary typeface (or a tight pairing: one for display, one for body). No more than two families.

| Role | Use | Relative size | Weight | Notes |
|------|-----|---------------|--------|--------|
| **Display / Hero** | Section 1 headline | ~clamp(2.5rem, 5vw, 4rem) | Normal or Medium | One line if possible; no all-caps unless editorial choice. |
| **Statement body** | Section 1 paragraph | 1rem–1.125rem | Normal | Line-height ~1.6. |
| **Section title** | Section 2 label, story titles | 1.25rem–1.5rem | Medium/Semibold | Clear hierarchy. |
| **Story title** | Editorial story headline | 1.75rem–2.25rem | Medium/Semibold | Comfortable reading. |
| **Story subtitle** | Competition + year | 0.9rem–1rem | Normal | Slightly muted. |
| **Body** | Story narrative, descriptions | 1rem–1.0625rem | Normal | Line-height 1.6–1.7; max-width ~65ch. |
| **Transition line** | “The shirt worn that night.” | 1rem or slightly larger | Normal or Medium | Can be italic or same as body. |
| **Metadata / tags** | Competition, era, condition, sizes | 0.8rem–0.9rem | Normal or Medium | Uppercase or small caps optional. |
| **Price** | All price display | 1.125rem–1.25rem | Semibold | Tabular figures. |
| **Micro** | Filters, “Showing X” | 0.75rem–0.875rem | Normal | Low visual weight. |

**Recommendation:** One serif for headlines + body (editorial feel) or one sans for everything (clean minimal). Avoid mixing more than two families.

---

## 4. Spacing system

Use a consistent scale (e.g. 4px or 8px base). Prefer fewer, larger steps for a calm layout.

| Token | Value (example) | Use |
|-------|------------------|-----|
| **xs** | 0.25rem (4px) | Tight in-line gaps. |
| **sm** | 0.5rem (8px) | Between label and options, small gaps. |
| **md** | 1rem (16px) | Between title and body, card padding. |
| **lg** | 1.5rem–2rem | Between sections within a block. |
| **xl** | 3rem | Between major blocks (e.g. story and next story). |
| **2xl** | 4rem–5rem | Section-to-section vertical spacing. |
| **3xl** | 6rem–8rem | Intro to filters, or story to shop. |

**Principles:**  
- Prefer one dominant vertical rhythm (e.g. multiples of 1rem or 1.5rem).  
- Horizontal: same scale for margins and grid gaps.  
- Avoid borders and heavy dividers; use space to separate.

---

## 5. Color (high level)

- **Backgrounds:** Off-white (#fafaf9, #f5f5f4), near-black (#0a0a0a, #171717), or warm gray (#e7e5e4, #1c1917). One dominant background for the page; optional alternate for a single section (e.g. statement on warm gray, rest on off-white).
- **Text:** High-contrast on background (e.g. near-black on off-white, off-white on near-black). One muted level for subtitles and metadata.
- **Accents:** Avoid UI accent color for buttons; use text color or underline. Club colors only in jerseys and match photos, not in UI.

---

## 6. Component list (for implementation)

| Component | Purpose | Reusable |
|-----------|---------|----------|
| **StatementBlock** | Section 1: headline + paragraph. | Yes (content-driven). |
| **FilterIndex** | Section 2: groups (League, Competition, Era, Size) + options. | Yes. |
| **StoryArticle** | Section 3: image + title + subtitle + body + transition line. | Yes (one per story). |
| **StoryCover** | Large match image with optional caption. | Yes. |
| **JerseyObject** | Section 4: centered PNG + name, club, tags, condition, sizes, price + subtle CTA. | Yes (one per product linked to story). |
| **JerseyCard** | Section 5: small card with PNG, name, tags, price, CTA. | Yes. |
| **JerseyGrid** | Section 5: grid of JerseyCards. | Yes. |
| **PageShell** | Top-level layout: optional minimal header, main content, optional footer. | Yes. |
| **Container** | Max-width + horizontal padding for text and grids. | Yes. |

**Data:**  
- Stories: existing `Story` type (id, club, linkedProductSlug, competitions, era, cover, title, subtitle, paragraphs).  
- Products: existing product schema; ensure each of the 5 jerseys has `imageUrl` = isolated PNG and story has `cover` = real match image (when assets exist).  
- Filters: League, Competition, Era, Size — options derived from products + stories (e.g. era from story or product season).

---

## 7. Interaction principles

- **Filtering:** Selecting a filter updates the set of visible stories + jerseys (and possibly scrolls to first match). No full reload; minimal transition (e.g. opacity or slight fade). No modal filters; keep filters in flow.
- **Links:** “View” / “Details” on JerseyObject and JerseyCard go to a product/detail view if it exists; else anchor or scroll to that jersey’s object block on the same page.
- **Hover:** Subtle only (e.g. underline on links, slight opacity change on cards). No big scale or flashy effects.
- **Focus:** Visible focus ring for keyboard users; style consistent with minimal aesthetic.
- **No carousels or auto-play** in the editorial area; one story per “block,” scroll-based.
- **Match images:** No zoom or lightbox unless explicitly required; prefer one strong crop per story.

---

## 8. Responsive behavior

- **Breakpoints:** Define 3–4 (e.g. mobile &lt; 640px, tablet 640–1024px, desktop &gt; 1024px). Use same typography scale with fluid sizes (clamp) where useful.
- **Section 1:** Headline and body stay centered; font size can step down on small screens. Padding reduces but remains generous.
- **Section 2:** Filters stack vertically on mobile; on desktop, can be one horizontal strip or a compact grid. Touch targets at least 44px for filter options.
- **Section 3:** Image full-width on all sizes; text container stays narrow (e.g. 90% max 65ch). Title and body may shrink slightly on mobile.
- **Section 4:** PNG can scale down on mobile; metadata can stack below image. Same container max-width as story text.
- **Section 5:** Grid: 1 column (mobile), 2 (tablet), 2–3 (desktop). Gaps scale with spacing system. Cards stay minimal; no hover-dependent critical info.

---

## 9. Scalability

- **Adding a jersey:** Add one `Story` (with one match image and one cover reference), one product (with one PNG), and ensure `linkedProductSlug` matches. No layout or component changes required.
- **Stories and products:** Component-based (StoryArticle + JerseyObject + JerseyCard). New entries flow into the same sections; filter options can be derived from data (leagues, competitions, eras, sizes).
- **More than 5 jerseys:** Same pattern: one story block + one jersey object per item; then the grid shows all. Pagination or “Load more” only if the list grows large; for 5 items, single page is enough.

---

## 10. Summary

- **Section 1:** One statement (headline + paragraph), no imagery.  
- **Section 2:** Minimal filter index (League, Competition, Era, Size); text and spacing, no sidebar.  
- **Section 3:** One editorial story per jersey (match image, title, subtitle, narrative, transition line).  
- **Section 4:** Right after each story, one “jersey as object” block (PNG + metadata + subtle CTA).  
- **Section 5:** One minimal grid of all jerseys (PNG only) with name, tags, price, subtle CTA.  

Typography and spacing carry the design; color stays neutral; football culture lives in copy and match photos. The system is component-based and data-driven so new jerseys can be added without redesign.

---

**Do you approve this minimal + football-culture direction before implementation?**

If yes, the next step is implementation (components, layout, and styling) aligned with this blueprint. If you want changes (e.g. different section order, stronger/softer typography, or filter behavior), specify them and we can adjust the blueprint first.
