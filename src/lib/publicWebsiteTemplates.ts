export const PUBLIC_WEBSITE_TEMPLATES = [
  {
    id: "midnight-glass",
    name: "Midnight Glass",
    description: "Dashboard-like dark experience with immersive hero and premium glass cards.",
    bestFor: "General premium creator pages",
    palette: ["#050b16", "#0ea5e9", "#6366f1"],
    source: "Dashboard + dark immersive references",
    sourceUrl: "https://webflow.com/templates/html/dark-website-templates"
  },
  {
    id: "nord-minimal",
    name: "Nord Minimal",
    description: "Minimal portfolio-forward layout with softer, editorial spacing.",
    bestFor: "Personal brand and photography-first pages",
    palette: ["#f5f7fa", "#d6dde7", "#9aa9bf"],
    source: "Portfolio grids from Webflow and Framer clean personal sites",
    sourceUrl: "https://webflow.com/templates/html/portfolio-website-templates"
  },
  {
    id: "tokyo-neon",
    name: "Tokyo Neon",
    description: "Modular panel-driven gallery with neon accents and app-style rhythm.",
    bestFor: "Nightlife, music, cosplay, and high-contrast brands",
    palette: ["#0a1120", "#4f46e5", "#f43f5e"],
    source: "Panel-based app/gallery references",
    sourceUrl: "https://www.framer.com/marketplace/templates/"
  },
  {
    id: "noir-luxe",
    name: "Noir Luxe",
    description: "Magazine/editorial luxury style with storytelling hero and serif tone.",
    bestFor: "Luxury creators, fashion, and premium memberships",
    palette: ["#151312", "#d4af37", "#a67c52"],
    source: "Editorial + luxury portfolio references",
    sourceUrl: "https://www.awwwards.com/websites/sites_of_the_day/"
  },
  {
    id: "electric-creator",
    name: "Electric Creator",
    description: "Interactive homepage feel with energetic masonry/bento composition.",
    bestFor: "Conversion-focused creator pages and launch drops",
    palette: ["#1b1140", "#22d3ee", "#a855f7"],
    source: "Interactive landing + creator ecosystem references",
    sourceUrl: "https://www.framer.com/marketplace/templates/"
  }
] as const;

export type PublicWebsiteTemplateId = (typeof PUBLIC_WEBSITE_TEMPLATES)[number]["id"];

export const DEFAULT_PUBLIC_WEBSITE_TEMPLATE: PublicWebsiteTemplateId = "midnight-glass";

const templateIdSet = new Set<string>(PUBLIC_WEBSITE_TEMPLATES.map((template) => template.id));

export const resolvePublicWebsiteTemplateId = (value?: string | null): PublicWebsiteTemplateId => {
  if (value && templateIdSet.has(value)) {
    return value as PublicWebsiteTemplateId;
  }
  return DEFAULT_PUBLIC_WEBSITE_TEMPLATE;
};
