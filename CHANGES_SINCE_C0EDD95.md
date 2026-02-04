# Changes After Commit c0edd95 (Summary)

This file documents the changes that were made after commit `c0edd95` before the repository was reset back to that commit.
The changes are grouped in the order they were performed and include the affected areas/files.

## 1) Image/Thumb Function Access (CORS + host allowlist)
- Added host allowlist handling to permit requests from the current host, sixsevencreator.com, www.sixsevencreator.com, localhost, and env-configured hosts.
- Added optional allow-no-referrer support via env flag.
- Files:
  - `functions/images485573257456374938/[[path]].js`
  - `functions/thumbs/[[path]].js`

## 2) Platform Rebranding (SixSeven Creator)
- Updated default platform branding and metadata.
- Replaced favicon with a “67” logo mark.
- Files:
  - `index.html`
  - `public/favicon.svg`

## 3) Remove Lanna References (Global rebrand sweep)
- Replaced Lanna/Lannadelulu references, URLs, and emails with SixSeven Creator equivalents.
- Fixed malformed URLs created during replacement.
- Files touched (examples):
  - `src/pages/Index.tsx`
  - `src/pages/Collections.tsx`
  - `src/pages/Collections1849929295832448.tsx`
  - `src/pages/CheckoutPage.tsx`
  - `src/pages/TipCheckoutPage.tsx`
  - `src/pages/PostDetail.tsx`
  - `src/pages/PostDetailBlurred.tsx`
  - `src/collections/collectionsData.ts`

## 4) Creator-Specific Branding on Collection Pages
- Collection detail pages now use creator profile data for name, socials, website, and contact email.
- Fallbacks are platform defaults when creator data is missing.
- Replaced Lanna avatar fallback with `/placeholder.svg`.
- Fixed footer separators from mojibake to ASCII.
- Files:
  - `src/pages/PostDetail.tsx`
  - `src/pages/PostDetailBlurred.tsx`

## 5) Mock Media (Free stock links)
- Replaced local `/images...` mock paths with free stock image/video links (Pexels).
- Built variant sizes for thumbs/full images.
- Ensured all mock collections use the generator.
- Replaced status-feed images with stock links.
- Files:
  - `src/collections/collectionsData.ts`
  - `src/pages/Index.tsx`
  - `src/pages/CreatorProfile.tsx`

## 6) Relative “Time Ago” Updates
- Added a shared relative time formatter.
- Status cards and text posts now show live “time ago” and update every minute.
- Collection detail pages show relative time instead of fixed strings.
- Mock timestamps switched to real time values (hoursAgo/daysAgo).
- Files:
  - `src/utils/relativeTime.ts`
  - `src/components/StatusCard.tsx`
  - `src/components/StatusCardWithMedia.tsx`
  - `src/pages/Index.tsx`
  - `src/pages/PostDetail.tsx`
  - `src/pages/PostDetailBlurred.tsx`
  - `src/pages/CreatorProfile.tsx`
  - `src/collections/collectionsData.ts`

## 7) Public Website Update Button
- Added “Update Website” next to “Published” when there are unpublished changes.
- Updated Public Website Preview to show explicit Update + Published buttons when dirty.
- Files:
  - `src/pages/CreatorDashboard.tsx`
  - `src/pages/PublicWebsitePreview.tsx`

## 8) Landing Page Left-Side Redesign
- Built a new left column with brand block, preview cards, and workflow tiles.
- Added expressive typography (Fraunces + Space Grotesk) for left panel only.
- Files:
  - `src/pages/Landing.tsx`
  - `src/index.css`

---

Note: After documenting these changes, the repository was reset back to `c0edd95` as requested.
