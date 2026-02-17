export type CollectionCardTemplate =
  | "single"
  | "double"
  | "triple"
  | "quad"
  | "masonry"
  | "asymmetric";

export type CollectionLayoutConfig = {
  template: CollectionCardTemplate;
  previewCount: number;
};

export type CollectionCardLayout = {
  gridType: CollectionCardTemplate;
  maxImages: number;
  gridClasses: string;
  imageSpans?: Record<number, string>;
};

type TemplateDefinition = {
  label: string;
  maxCount: number;
  gridClasses: string;
  imageSpans?: Record<number, string>;
};

const LAYOUT_TAG_PREFIX = "__layout:v1:";

export const COLLECTION_CARD_TEMPLATES: Record<CollectionCardTemplate, TemplateDefinition> = {
  single: {
    label: "Single",
    maxCount: 1,
    gridClasses: "grid grid-cols-1 h-full"
  },
  double: {
    label: "Split 2",
    maxCount: 2,
    gridClasses: "grid grid-cols-2 gap-1 h-full"
  },
  triple: {
    label: "Triple",
    maxCount: 3,
    gridClasses: "grid grid-cols-3 gap-1 h-full"
  },
  quad: {
    label: "Quad",
    maxCount: 4,
    gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full"
  },
  masonry: {
    label: "Masonry 6",
    maxCount: 6,
    gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
    imageSpans: {
      0: "col-span-1 row-span-2",
      1: "col-span-2 row-span-1"
    }
  },
  asymmetric: {
    label: "Asymmetric 4",
    maxCount: 4,
    gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
    imageSpans: {
      0: "col-span-2 row-span-2",
      1: "col-span-1 row-span-1",
      2: "col-span-1 row-span-1",
      3: "hidden"
    }
  }
};

export const COLLECTION_CARD_TEMPLATE_OPTIONS = (
  Object.keys(COLLECTION_CARD_TEMPLATES) as CollectionCardTemplate[]
).map((template) => ({
  value: template,
  label: COLLECTION_CARD_TEMPLATES[template].label,
  maxCount: COLLECTION_CARD_TEMPLATES[template].maxCount
}));

const getDefaultTemplateForCount = (mediaCount: number): CollectionCardTemplate => {
  if (mediaCount <= 1) return "single";
  if (mediaCount <= 2) return "double";
  if (mediaCount <= 3) return "triple";
  return "quad";
};

const clampPreviewCount = (template: CollectionCardTemplate, previewCount: number, mediaCount: number) => {
  const templateMax = COLLECTION_CARD_TEMPLATES[template]?.maxCount || 4;
  const safeMedia = Math.max(1, mediaCount || 1);
  const safeCount = Number.isFinite(previewCount) ? Math.trunc(previewCount) : safeMedia;
  return Math.max(1, Math.min(safeCount, templateMax, safeMedia));
};

export const buildLayoutTag = (config: CollectionLayoutConfig) => {
  const template = COLLECTION_CARD_TEMPLATES[config.template] ? config.template : "quad";
  const previewCount = Math.max(1, Math.trunc(config.previewCount || 1));
  return `${LAYOUT_TAG_PREFIX}${template}:${previewCount}`;
};

export const parseLayoutTag = (tags: string[] | undefined | null): CollectionLayoutConfig | null => {
  if (!Array.isArray(tags)) return null;
  const raw = tags.find((tag) => typeof tag === "string" && tag.startsWith(LAYOUT_TAG_PREFIX));
  if (!raw) return null;
  const payload = raw.slice(LAYOUT_TAG_PREFIX.length);
  const [templateRaw, countRaw] = payload.split(":");
  const template = (templateRaw || "").trim() as CollectionCardTemplate;
  if (!COLLECTION_CARD_TEMPLATES[template]) return null;
  const parsedCount = Number.parseInt(countRaw || "", 10);
  return {
    template,
    previewCount: Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1
  };
};

export const stripLayoutTags = (tags: string[] | undefined | null): string[] => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => String(tag || "").trim())
    .filter((tag) => tag && !tag.startsWith(LAYOUT_TAG_PREFIX));
};

export const mergeTagsWithLayout = (
  tags: string[] | undefined | null,
  config: CollectionLayoutConfig
): string[] => {
  const cleanTags = stripLayoutTags(tags);
  return [...cleanTags, buildLayoutTag(config)];
};

export const resolveCollectionLayout = (
  mediaCount: number,
  persistedConfig?: CollectionLayoutConfig | null
): CollectionLayoutConfig => {
  const template = persistedConfig?.template || getDefaultTemplateForCount(mediaCount);
  const fallbackCount = Math.min(mediaCount || 1, COLLECTION_CARD_TEMPLATES[template].maxCount);
  const previewCount = clampPreviewCount(template, persistedConfig?.previewCount || fallbackCount, mediaCount);
  return { template, previewCount };
};

export const buildCardLayout = (
  mediaCount: number,
  persistedConfig?: CollectionLayoutConfig | null
): CollectionCardLayout => {
  const resolved = resolveCollectionLayout(mediaCount, persistedConfig);
  const definition = COLLECTION_CARD_TEMPLATES[resolved.template];
  return {
    gridType: resolved.template,
    maxImages: resolved.previewCount,
    gridClasses: definition.gridClasses,
    imageSpans: definition.imageSpans
  };
};

