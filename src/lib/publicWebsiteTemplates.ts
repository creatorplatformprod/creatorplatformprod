export const PUBLIC_WEBSITE_TEMPLATES = [
  {
    id: "minimal-portfolio",
    name: "Minimal Portfolio",
    description: "Clean, light, portfolio-first layout with restrained UI chrome.",
    bestFor: "Personal brand and photography-first pages",
    palette: ["#f5f7fa", "#d6dde7", "#9aa9bf"],
    source: "Portfolio grid references",
    sourceUrl: "https://webflow.com/templates/html/portfolio-website-templates"
  },
  {
    id: "magazine-editorial",
    name: "Magazine Editorial",
    description: "Story-led hero, editorial hierarchy, and premium typography.",
    bestFor: "Narrative drops and premium storytelling",
    palette: ["#151312", "#d4af37", "#a67c52"],
    source: "Editorial dark portfolio references",
    sourceUrl: "https://www.awwwards.com/websites/sites_of_the_day/"
  },
  {
    id: "dashboard-app-style",
    name: "Dashboard / App Style",
    description: "Productized creator layout with utility rails and dense content controls.",
    bestFor: "Frequent posters and conversion-focused creators",
    palette: ["#050b16", "#0ea5e9", "#6366f1"],
    source: "SaaS dashboard references",
    sourceUrl: "https://webflow.com/templates/html/dark-website-templates"
  },
  {
    id: "masonry-gallery",
    name: "Masonry Gallery",
    description: "Gallery-first staggered flow with visual-first content rhythm.",
    bestFor: "Image-heavy creators and lookbook drops",
    palette: ["#0b1324", "#2e4fb8", "#6b7bc5"],
    source: "Masonry portfolio references",
    sourceUrl: "https://www.awwwards.com/inspiration/dark-menu-with-portfolio-slider-artversion-we-design-experiences"
  },
  {
    id: "masonry-gallery-panels",
    name: "Masonry Gallery Panels",
    description: "Modular panel-style feed with masonry and strong CTA surfaces.",
    bestFor: "Creators mixing gallery and promo blocks",
    palette: ["#0a1120", "#4f46e5", "#f43f5e"],
    source: "Panel-based gallery app references",
    sourceUrl: "https://www.framer.com/marketplace/templates/"
  },
  {
    id: "dark-immersive",
    name: "Dark Immersive",
    description: "Cinema-grade dark mode with atmospheric overlays and depth.",
    bestFor: "Moody cinematic and premium aesthetic brands",
    palette: ["#060a13", "#111827", "#334155"],
    source: "Immersive dark references",
    sourceUrl: "https://www.awwwards.com/inspiration/dark-theme-romain-vincens-portfolio"
  },
  {
    id: "interactive-homepage",
    name: "Interactive Homepage",
    description: "Hero-led conversion surface with interactive and bento sections.",
    bestFor: "Launch pages and subscription conversion",
    palette: ["#1b1140", "#22d3ee", "#a855f7"],
    source: "Interactive creator landing references",
    sourceUrl: "https://www.framer.com/marketplace/templates/"
  }
] as const;

export type PublicWebsiteTemplateId = (typeof PUBLIC_WEBSITE_TEMPLATES)[number]["id"];

export const DEFAULT_PUBLIC_WEBSITE_TEMPLATE: PublicWebsiteTemplateId = "dashboard-app-style";

const templateIdSet = new Set<string>(PUBLIC_WEBSITE_TEMPLATES.map((template) => template.id));
const LEGACY_TEMPLATE_ALIASES: Record<string, PublicWebsiteTemplateId> = {
  "midnight-glass": "dashboard-app-style",
  "nord-minimal": "minimal-portfolio",
  "tokyo-neon": "masonry-gallery-panels",
  "noir-luxe": "magazine-editorial",
  "electric-creator": "interactive-homepage"
};

export const resolvePublicWebsiteTemplateId = (value?: string | null): PublicWebsiteTemplateId => {
  if (value && templateIdSet.has(value)) {
    return value as PublicWebsiteTemplateId;
  }
  if (value && LEGACY_TEMPLATE_ALIASES[value]) {
    return LEGACY_TEMPLATE_ALIASES[value];
  }
  return DEFAULT_PUBLIC_WEBSITE_TEMPLATE;
};
