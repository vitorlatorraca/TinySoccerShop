# TinySoccerShop - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium e-commerce platforms (StockX for authentication/scarcity, Nike/Adidas for sports apparel, Etsy for collectibles) combined with modern minimalist principles to create a sophisticated shopping experience that reflects the collectible value of autographed jerseys.

**Design Principles**:
- **Premium Minimalism**: Clean, spacious layouts that let products breathe and command attention
- **Collectible Showcase**: Product-first design with generous imagery and clear authentication indicators
- **Seamless Filtering**: Advanced filtering that feels effortless, not overwhelming
- **Trust & Authenticity**: Visual design that communicates legitimacy and value

---

## Core Design Elements

### A. Typography System

**Font Families**: 
- Primary: Inter or Manrope (modern sans-serif)
- System fallback: -apple-system, BlinkMacSystemFont, "Segoe UI"

**Hierarchy**:
- Hero Headlines: 4xl-6xl, font-bold (56-72px equivalent)
- Section Headers: 3xl-4xl, font-bold (36-48px)
- Product Titles: lg-xl, font-semibold (18-24px)
- Body Text: base, font-normal (16px)
- Price Display: xl-2xl, font-bold with tabular numbers
- Metadata/Labels: sm-base, font-medium (14-16px)
- Micro-copy: xs-sm, font-normal (12-14px)

### B. Layout & Spacing System

**Tailwind Spacing Units**: Consistently use 2, 4, 6, 8, 12, 16, 20, 24 units
- Micro spacing (between related elements): p-2, gap-2
- Component internal padding: p-4, p-6
- Section spacing: py-12, py-16, py-20
- Container gaps: gap-6, gap-8
- Card margins: m-4, mb-8

**Grid System**:
- Desktop: `grid-cols-4` for product grid, `grid-cols-3` for features
- Tablet: `md:grid-cols-3` products, `md:grid-cols-2` features  
- Mobile: `grid-cols-2` products, `grid-cols-1` content
- Gap: `gap-6` desktop, `gap-4` mobile

**Container Widths**:
- Main container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Filter sidebar: `w-80` desktop (320px)
- Product cards: Full grid cell width
- Detail pages: `max-w-6xl`

---

## Component Library

### Header (Sticky Navigation)
**Structure**:
- Height: `h-20` (80px), sticky with `backdrop-blur-md` effect
- Logo: Left-aligned, `h-8` to `h-10`
- Navigation: Center or left, horizontal menu with dropdowns
- Action Icons: Right-aligned - Search, Account, Favorites (with badge counter), Cart (with badge + hover preview)
- Mobile: Hamburger menu, full-screen overlay drawer

**Search**: Expandable search bar with autocomplete dropdown, `w-64` to `w-96` when active

### Product Grid Cards
**Card Structure** (vertical card):
```
- Image Container: aspect-square, hover zoom effect (scale-105)
- Badge Overlay: Top-right badges ("AUTOGRAFADO", "EDIÇÃO LIMITADA")
- Image Swap: Show alternate image on hover
- Content Padding: p-4
- Club/Player Name: text-sm font-medium, text-gray-600
- Product Title: text-base font-semibold, line-clamp-2
- Price: text-xl font-bold, tabular-nums
- CTA Row: flex justify-between - "Ver Detalhes" button + Heart icon
- Quick View: Modal trigger on card click
```

**Hover States**: Subtle shadow lift (`shadow-lg`), border highlight, smooth transitions (duration-300)

### Filter Sidebar (Desktop)
**Layout**:
- Fixed width: `w-80`
- Independent scroll: `overflow-y-auto h-screen`
- Collapsible sections with chevron indicators
- Sticky positioning relative to viewport

**Filter Sections**:
- Section spacing: `space-y-6`
- Section headers: text-sm font-semibold uppercase tracking-wide
- Checkboxes: Custom styled with accent color
- Sliders: Range inputs for price (CAD $0-$10,000+) and year (1990-2024)
- Search inputs: For clubs, players with autocomplete
- Result counters: text-xs text-gray-500 next to each filter option
- Active filters bar: Top of content area with removable chips

**Mobile Filter Drawer**:
- Full-screen overlay with slide-in animation
- Bottom fixed bar: "Apply Filters" + "Clear All" buttons
- Floating action button: Fixed bottom-right with filter count badge

### Product Detail Page
**Layout**: Two-column `lg:grid-cols-2` with gap-12
- Left: Image gallery with thumbnails, zoom capability, 3-5 images
- Right: Product info, size selector, add to cart, authentication details
- Below: Tabs for Description, Authentication Certificate, Sizing Guide

**Image Gallery**:
- Main image: aspect-[4/5] or square
- Thumbnail strip: `grid-cols-4` or `grid-cols-5`, gap-2
- Zoom modal: Click to expand full-screen lightbox

### Cart Preview (Header Hover)
**Structure**:
- Dropdown panel: `w-96`, absolute positioning
- Max items shown: 3-4 with scroll
- Each item: Thumbnail (64px) + Name + Price + Remove icon
- Subtotal display
- "View Cart" and "Checkout" CTAs

### Results & Controls Bar
**Layout**: Flex row with justify-between
- Left: Active filter chips with X remove
- Center: "Showing X of Y results"
- Right: Sort dropdown + View toggle (grid/list) + Items per page

---

## Images

### Hero Section
**Implementation**: Full-width hero with dynamic imagery
- Desktop: min-h-[600px], featuring lifestyle shot of jerseys or stadium atmosphere
- Overlay: Dark gradient overlay (from-black/60 to-transparent)
- Content: Centered, max-w-3xl with large headline + subheadline + CTA
- CTA Buttons: Backdrop blur background (`backdrop-blur-sm bg-white/10`) with white text

**Image Description**: High-quality sports photography - either:
- Iconic jerseys displayed on mannequins in premium setting
- Stadium atmosphere with jersey showcase
- Action shots with jersey focus
- Multiple jerseys arranged artistically

### Product Images
**Requirements**:
- Aspect ratio: Square (1:1) or portrait (4:5)
- Resolution: Min 800x800px, optimized for web
- Backgrounds: Pure white (#FFFFFF) or subtle gray for consistency
- Multiple angles: Front, back, detail shots of signatures/patches
- Hover images: Alternate view (back or detail)

### Category/Banner Images
- Section headers: Full-width, h-48 to h-64, with text overlay
- League badges: Small icons, 32px to 48px
- Trust badges: Certification logos, authentication seals

---

## Animation Guidelines

**Minimal & Purposeful**:
- Card hover: `transition-transform duration-300 ease-out`
- Filter updates: Fade in/out of results (duration-200)
- Image zoom: Scale transform on hover (scale-105)
- Dropdown menus: Slide down with fade (duration-200)
- Modal overlays: Backdrop fade + content slide up
- **No** elaborate scroll animations or parallax effects

---

## Accessibility & Polish

- Form inputs: Consistent `h-12` with `px-4`, rounded-lg borders
- Buttons: Primary (solid), Secondary (outline), all with focus rings
- Interactive states: Clear hover, active, focus, and disabled states
- Loading states: Skeleton screens for product grids
- Empty states: Friendly messaging when no results found
- Touch targets: Minimum 44px for mobile interactions
- Contrast ratios: WCAG AA compliant text contrast

---

## Responsive Breakpoints

- Mobile: < 640px (sm) - Single column, drawer filters, stacked layouts
- Tablet: 640px-1024px (md/lg) - 2-3 column grids, condensed navigation
- Desktop: > 1024px (xl) - Full sidebar, 3-4 column grids, hover previews