# Design Guidelines: Single-Seller Marketplace Platform

## Design Approach
**Reference-Based:** Drawing from Etsy's artisan marketplace aesthetic combined with Shopify's clean product presentation and modern admin panels like Linear. This creates a trustworthy, product-focused experience that balances visual appeal with functional efficiency.

## Core Design Principles
1. **Product-First:** Images and products are the hero, not decorative elements
2. **Trust Through Clarity:** Clean, professional presentation builds buyer confidence
3. **Effortless Navigation:** Category-driven browsing with minimal friction
4. **Admin Efficiency:** Dashboard prioritizes speed and clarity over decoration

---

## Typography System

**Font Families:**
- Primary: Inter (Google Fonts) - clean, modern sans-serif for UI and body text
- Accent: DM Sans (Google Fonts) - slightly geometric for headings and CTAs

**Hierarchy:**
- Hero/Page Titles: 48px (mobile: 32px), DM Sans, weight 700
- Section Headers: 32px (mobile: 24px), DM Sans, weight 600
- Product Names: 20px, DM Sans, weight 500
- Category Labels: 18px, DM Sans, weight 600
- Body Text: 16px, Inter, weight 400
- Metadata (price, specs): 14px, Inter, weight 500
- Captions/Labels: 12px, Inter, weight 400

---

## Layout & Spacing System

**Tailwind Spacing Units:** Use 4, 6, 8, 12, 16, 24 consistently
- Component padding: p-6 or p-8
- Section vertical spacing: py-16 (desktop), py-12 (mobile)
- Card gaps: gap-6
- Element spacing: space-y-4 or space-y-6

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Product grids: max-w-6xl
- Form content: max-w-2xl
- Full-bleed for hero sections with inner max-w-7xl

**Grid Systems:**
- Categories: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Products: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Product Detail: Two-column split (60/40) - images left, details right

---

## Page-Specific Layouts

### Public Storefront (Homepage)
**Hero Section (80vh):**
- Full-width background image (customizable storefront background)
- Centered overlay with shop name/tagline
- Primary CTA button with blur backdrop (backdrop-blur-md, semi-transparent bg)
- No hover states on hero buttons - rely on Button component's built-in states

**Category Section:**
- Horizontal-scrolling category cards (mobile) or 3-column grid (desktop)
- Each card: category image, name overlay at bottom with gradient backdrop

**Featured/All Products Grid:**
- 4-column responsive grid (2 on tablet, 2 on mobile)
- Compact product cards with image, name, price

### Category Page
- Breadcrumb navigation (Home > Category Name)
- Category header with image banner (400px height) and description overlay
- Product grid matching homepage style
- Filter sidebar (desktop) or drawer (mobile) - coming soon placeholder

### Product Detail Page
**Image Gallery (Left 60%):**
- Large primary image with thumbnail strip below
- Click to open fullscreen lightbox
- 4-5 thumbnails visible, horizontal scroll if more

**Product Info (Right 40%):**
- Product name (32px)
- Price (28px, prominent)
- Description with proper line-height (1.6)
- Specs grid (2 columns: label + value)
- WhatsApp contact button (primary, full-width)

### Admin Dashboard

**Sidebar Navigation (Fixed, 240px wide):**
- Logo/shop name at top
- Navigation items with icons (Heroicons)
- Active state: subtle background, bold text
- Bottom: Settings, Logout

**Main Content Area:**
- Page header with title + primary action button (right-aligned)
- Data tables: alternating row backgrounds, hover states
- Action buttons: icon + text for clarity
- Forms: single column, max-w-2xl, generous spacing

**Product/Category Forms:**
- Image upload areas with dotted borders and upload icons
- Multiple image preview grid for products (4 columns)
- Drag-to-reorder functionality indicated with handle icon
- Form fields: full-width with floating labels
- Submit buttons: fixed bottom bar (mobile) or inline (desktop)

---

## Component Library

### Cards
**Category Card:**
- Aspect ratio 4:3
- Image fills card with overlay gradient (bottom 40%)
- Category name overlaid in white, bottom-left, p-6
- Subtle scale transform on hover (scale-105)

**Product Card:**
- Aspect ratio 3:4 for image
- Thin border
- Image with overflow-hidden, rounded corners
- Padding below image: p-4
- Product name (truncate 2 lines)
- Price below in larger, bold text
- No decorative elements, just clean presentation

### Buttons
**Primary CTA:** Full rounded (rounded-full), medium padding (px-8 py-3)
**Secondary:** Rounded borders (rounded-lg), outlined style
**Icon Buttons:** Square (40px), rounded, icon-only for actions
**Hero Buttons:** Include backdrop-blur-md and semi-transparent background when over images

### WhatsApp Floating Button
- Fixed bottom-right (bottom-6 right-6)
- Circular (w-16 h-16), prominent shadow (shadow-2xl)
- WhatsApp icon (use Font Awesome fa-whatsapp)
- Subtle pulse animation (ping effect)
- Z-index ensures always visible (z-50)

### Image Upload Components
- Dashed border upload zone with cloud upload icon
- Image preview grid with delete button overlay (top-right)
- Progress indicators during upload
- Validation error messages inline, red text

### Navigation
**Public Nav:** 
- Sticky header with logo left, category links center, admin login right
- Transparent over hero, solid on scroll
- Mobile: hamburger menu

**Admin Nav:**
- Fixed sidebar as described above
- Breadcrumbs for sub-pages

---

## Images Required

### Storefront Background (Hero)
- Landscape image representing the shop's products/brand
- Minimum 1920x1080px
- Should work with text overlay (avoid busy centers)
- Suggest: product lifestyle shot, workshop/studio, or abstract texture

### Category Images
- Square or 4:3 ratio
- Clearly represent the category
- Minimum 800x600px
- Should look good with text overlay

### Product Images
- Vertical orientation preferred (3:4 ratio ideal)
- White or neutral backgrounds for consistency
- Multiple angles: front, detail shots, context/lifestyle
- Minimum 1200x1600px for quality zoom

---

## Animation Guidelines
**Minimal, Purposeful Animations:**
- Card hover: subtle scale (duration-200)
- Page transitions: simple fade (no slides)
- Image loading: skeleton pulse
- WhatsApp button: gentle continuous pulse
- Form validation: shake on error

**No animations for:**
- Text appearance
- Scroll-triggered effects
- Complex page transitions
- Background movements

---

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2 columns for products)
- Desktop: > 1024px (full multi-column layouts)

### Mobile-Specific:
- Bottom navigation bar for admin
- Drawer for filters
- Full-width forms
- Stacked product detail (image gallery top, info below)
- Hamburger menu for categories

---

## Admin Dashboard Visual Treatment
- Clean, data-focused aesthetic (not decorative)
- High contrast for readability
- Table-heavy layouts with clear row separation
- Action buttons always visible, never buried
- Form fields with helper text below
- Success/error states with toast notifications (top-right)

---

## Accessibility Notes
- All images include alt text
- Form labels always present (not just placeholders)
- Sufficient contrast ratios maintained
- Focus states visible on all interactive elements
- Icon buttons include aria-labels