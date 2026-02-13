export const PUBLIC_WEBSITE_TEMPLATES = [
  {
    id: "midnight-glass",
    name: "Midnight Glass",
    description: "Premium dark glass with clean gradients and conversion-focused contrast.",
    bestFor: "General premium creator pages",
    palette: ["#050b16", "#0ea5e9", "#6366f1"],
    source: "Webflow dark SaaS templates + Framer marketplace patterns",
    sourceUrl: "https://webflow.com/templates/html/darkflow-saas-website-template"
  },
  {
    id: "nord-minimal",
    name: "Nord Minimal",
    description: "Calm editorial minimalism with quiet cards and low-noise accents.",
    bestFor: "Photographers and clean personal brands",
    palette: ["#252c3a", "#88c0d0", "#81a1c1"],
    source: "Nord palette system + minimal portfolio directions",
    sourceUrl: "https://www.nordtheme.com/docs/colors-and-palettes"
  },
  {
    id: "tokyo-neon",
    name: "Tokyo Neon",
    description: "High-energy neon contrast with stronger call-to-action hierarchy.",
    bestFor: "Nightlife, cosplay, music, and bold creator brands",
    palette: ["#1a1b26", "#7aa2f7", "#f7768e"],
    source: "Tokyo Night palette + high-contrast portfolio trends",
    sourceUrl: "https://github.com/folke/tokyonight.nvim"
  },
  {
    id: "noir-luxe",
    name: "Noir Luxe",
    description: "Dark editorial luxury with serif-forward voice and warm metal accents.",
    bestFor: "Luxury creators, fashion, and premium memberships",
    palette: ["#151312", "#d4af37", "#a67c52"],
    source: "Luxury editorial portfolio trends from award sites",
    sourceUrl: "https://www.awwwards.com/websites/sites_of_the_day/"
  },
  {
    id: "electric-creator",
    name: "Electric Creator",
    description: "Vibrant gradient-forward style inspired by creator link-in-bio ecosystems.",
    bestFor: "Social-first creators optimizing for taps and subscriptions",
    palette: ["#1b1140", "#22d3ee", "#a855f7"],
    source: "Creator-link ecosystems and modern template marketplaces",
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
