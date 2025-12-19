// src/collections/collectionsData.ts - PROFESSIONAL MEDIA MANAGEMENT SOLUTION

export interface Collection {
  id: string;
  title: string;
  description: string;
  images: Array<{ full: string; thumb: string }>;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  likes: number;
  comments: number;
  type: "single-media" | "collage" | "video" | "double-media" | "collection";
  price?: number; // Price in USD, undefined = free
  cardLayout: {
    gridType: "single" | "double" | "triple" | "quad" | "masonry" | "asymmetric";
    maxImages: number;
    gridClasses?: string;
    imageSpans?: { [key: number]: string };
  };
}

const portrait1 = "/images485573257456374938/1img.jpg";

type MediaType = 'image' | 'video';
type MediaExtension = 'jpg' | 'jpeg' | 'png' | 'webp' | 'mp4' | 'webm' | 'mov';

interface MediaItem {
  index: number;
  type: MediaType;
  extension?: MediaExtension;
}

const generatePostCollectionImages = (
  postId: string,
  mediaCount: number = 20,
  mediaItems?: MediaItem[]
): Array<{ full: string; thumb: string }> => {
  const basePath = `/images485573257456374938/collection${postId}`;
  const thumbPath = `/images485573257456374938/thumbs/collection${postId}`;
  
  if (!mediaItems) {
    return Array.from({ length: mediaCount }, (_, i) => ({
      full: `${basePath}/${i + 1}.jpg`,
      thumb: `${thumbPath}/${i + 1}.jpg`
    }));
  }
  
  return mediaItems.map(item => {
    const defaultExtension = item.type === 'video' ? 'mp4' : 'jpg';
    const extension = item.extension || defaultExtension;
    
    return {
      full: `${basePath}/${item.index}.${extension}`,
      thumb: `${thumbPath}/${item.index}.jpg`
    };
  });
};

export const collections: Record<string, Collection> = {
  "1": {
    id: "1",
    title: "Golden Sun",
    description: "Bathing in natural light, where every ray kisses the skin and transforms ordinary moments into golden memories — warm, radiant, and effortlessly sensual.",
    images: generatePostCollectionImages("1", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'image' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 234000,
    comments: 1245,
    type: "collection",
    cardLayout: {
      gridType: "masonry",
      maxImages: 7,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "2": {
    id: "2",
    title: "Nature's Bloom",
    description: "Surrounded by flowers and greenery, she becomes part of the landscape — feminine energy flourishing in its most natural, untamed, and seductive form.",
    images: generatePostCollectionImages("2", 7),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 456000,
    comments: 2341,
    type: "collage",
    cardLayout: { gridType: "triple", maxImages: 3, gridClasses: "grid grid-cols-3 gap-1 h-full" }
  },

  "3": {
    id: "3",
    title: "Crimson Mystery",
    description: "Wrapped in red and black, she's a contradiction — soft yet bold, romantic yet dangerous, the kind of mystery you can't help but want to unravel.",
    images: generatePostCollectionImages("3", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'video', extension: 'mp4' },
      { index: 12, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 789000,
    comments: 3567,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 3,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "4": {
    id: "4",
    title: "Beige Bliss",
    description: "In warm beige tones, she's serene and sensual — the kind of calm that draws you in, where simplicity meets quiet desire and every detail feels intimate.",
    images: generatePostCollectionImages("4", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'video', extension: 'mp4' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'image' },
      { index: 17, type: 'image' },
      { index: 18, type: 'image' },
      { index: 19, type: 'image' },
      { index: 20, type: 'image' },
      { index: 21, type: 'image' },
      { index: 22, type: 'image' },
      { index: 23, type: 'video', extension: 'mp4' },
      { index: 24, type: 'image' },
      { index: 25, type: 'image' },
      { index: 26, type: 'image' },
      { index: 27, type: 'image' },
      { index: 28, type: 'image' },
      { index: 29, type: 'image' },
      { index: 30, type: 'image' },
      { index: 31, type: 'image' },
      { index: 32, type: 'image' },
      { index: 33, type: 'image' },
      { index: 34, type: 'video', extension: 'mp4' },
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 678000,
    comments: 3456,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2", 5: "col-span-2" }
    }
  },

  "5": {
    id: "5",
    title: "Cowgirl Dreams",
    description: "In white with a country twist, she's playful, daring, and unapologetically sexy — the kind of look that's both nostalgic and irresistibly modern.",
    images: generatePostCollectionImages("5", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'video', extension: 'mp4' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 892000,
    comments: 4523,
    type: "double-media",
    price: 9.99,
    cardLayout: { gridType: "quad", maxImages: 8, gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full" }
  },

  "6": {
    id: "6",
    title: "Ocean Waves",
    description: "Wet, dripping, and captivating — where water meets skin and every drop becomes part of the art. Sultry, raw, and impossible to look away from.",
    images: generatePostCollectionImages("6", 21),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 345000,
    comments: 1234,
    type: "collection",
    cardLayout: {
      gridType: "masonry",
      maxImages: 5,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "7": {
    id: "7",
    title: "Velvet Desire",
    description: "Wearing lingerie with confidence and poise — bold, alluring, and impossible to ignore.",
    images: generatePostCollectionImages("7", 15),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "6 hours ago",
    likes: 678000,
    comments: 2987,
    type: "collection",
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "8": {
    id: "8",
    title: "Inner Peace",
    description: "In cozy comfort, she's at ease with herself — modeling isn't always about the spectacle, sometimes it's about owning your space, feeling good in your skin, and letting that confidence speak for itself.",
    images: generatePostCollectionImages("8", 9),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 1200000,
    comments: 8764,
    type: "collage",
    cardLayout: {
      gridType: "masonry",
      maxImages: 5,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "9": {
    id: "9",
    title: "Shadow Play",
    description: "Black lingerie meets dramatic shadows and leather accents — she's powerful, sensual, and dangerously seductive. This isn't just a look; it's a statement of raw sexual confidence.",
    images: generatePostCollectionImages("9", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'video', extension: 'mp4' },
      { index: 17, type: 'video', extension: 'mp4' },
      { index: 18, type: 'video', extension: 'mp4' },
      { index: 19, type: 'video', extension: 'mp4' },
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 934000,
    comments: 5432,
    type: "collection",
    price: 9.99,
    cardLayout: { gridType: "triple", maxImages: 3, gridClasses: "grid grid-cols-3 gap-1 h-full" }
  },

  "10": {
    id: "10",
    title: "Scarlet Seduction",
    description: "Red is the color of love, passion, and desire — and she wears it like a declaration. Bold, sensual, and utterly captivating in every frame.",
    images: generatePostCollectionImages("10", 24),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 567000,
    comments: 3214,
    type: "collection",
    cardLayout: { gridType: "double", maxImages: 2, gridClasses: "grid grid-cols-2 gap-1 h-full" }
  },

  "11": {
    id: "11",
    title: "Cozy Pink",
    description: "Soft pink underwear with no top — intimate, comfortable, and effortlessly seductive. It's about being cozy in your own skin and letting that confidence shine through.",
    images: generatePostCollectionImages("11", 7),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "12 hours ago",
    likes: 723000,
    comments: 4156,
    type: "collection",
    cardLayout: {
      gridType: "masonry",
      maxImages: 5,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "12": {
    id: "12",
    title: "Body Appreciation",
    description: "A celebration of feminine form in soft cotton candy tones — playful, flirty, and unapologetically sexy. Every curve, every line, every movement captured in its most beautiful light.",
    images: generatePostCollectionImages("12", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'image' },
      { index: 17, type: 'image' },
      { index: 18, type: 'image' },
      { index: 19, type: 'image' },
      { index: 20, type: 'image' },
      { index: 21, type: 'image' },
      { index: 22, type: 'image' },
      { index: 23, type: 'video', extension: 'mp4' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 456000,
    comments: 2789,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 3,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 1: "row-span-2" }
    }
  },

  "13": {
    id: "13",
    title: "Gallery Muse",
    description: "Surrounded by art under blue skies, she becomes the masterpiece — nature's canvas meets human beauty in pink lingerie that's both elegant and daringly sensual.",
    images: generatePostCollectionImages("13", 19),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 834000,
    comments: 3891,
    type: "collection",
    cardLayout: { gridType: "quad", maxImages: 4, gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full" }
  },

  "14": {
    id: "14",
    title: "Pure White",
    description: "Draped in white, she embodies purity with an edge — clean lines, soft fabric, and a presence that's both innocent and irresistibly seductive.",
    images: generatePostCollectionImages("14", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'video', extension: 'mp4' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 612000,
    comments: 2456,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "15": {
    id: "15",
    title: "Midnight Black",
    description: "In black sheer lingerie, she's the definition of timeless seduction — elegant, bold, and effortlessly captivating with every pose.",
    images: generatePostCollectionImages("15", 19),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "5 days ago",
    likes: 789000,
    comments: 4321,
    type: "collage",
    cardLayout: { gridType: "triple", maxImages: 3, gridClasses: "grid grid-cols-3 gap-1 h-full" }
  },

  "16": {
    id: "16",
    title: "Cozy Life",
    description: "Behind the glam and the shoots, there's the simple joy of daily life — coffee in hand, relaxed fits, genuine smiles. This is modeling when the camera isn't watching.",
    images: generatePostCollectionImages("16", 8),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 567000,
    comments: 2134,
    type: "collection",
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 7,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "17": {
    id: "17",
    title: "Daily Moments & Exclusive Posts",
    description: "A curated collection of everyday magic and exclusive content you won't find anywhere else — candid shots, behind-the-scenes glimpses, and those special moments that make modeling more than just a profession.",
    images: generatePostCollectionImages("17", 55),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 445000,
    comments: 1876,
    type: "collection",
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "18": {
    id: "18",
    title: "Crystal Dreams",
    description: "Shimmering crystals meet soft feminine beauty — where luxury and sensuality intertwine in a dance of light and shadow, creating moments that sparkle with quiet elegance and undeniable allure.",
    images: generatePostCollectionImages("18", 34),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "5 days ago",
    likes: 892000,
    comments: 5678,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 2: "row-span-2", 5: "col-span-2" }
    }
  },

  "19": {
    id: "19",
    title: "Moonlight Whispers",
    description: "Under the soft glow of moonlight, she embodies ethereal beauty — mysterious, captivating, and impossibly graceful. Every pose tells a story of quiet confidence and timeless allure.",
    images: generatePostCollectionImages("19", 12),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 654000,
    comments: 3890,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2", 3: "col-span-2" }
    }
  },

  "20": {
    id: "20",
    title: "Golden Hour Glow",
    description: "Bathing in the warm embrace of golden hour light — where natural beauty meets artistic vision, creating intimate moments that radiate warmth, confidence, and effortless sensuality.",
    images: generatePostCollectionImages("20", 7),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 723000,
    comments: 4123,
    type: "collection",
    cardLayout: {
      gridType: "triple",
      maxImages: 3,
      gridClasses: "grid grid-cols-3 gap-1 h-full"
    }
  },

  "21": {
    id: "21",
    title: "Velvet Nights",
    description: "Wrapped in luxurious velvet textures, she becomes the embodiment of midnight allure — soft, mysterious, and dangerously seductive in ways that linger long after the moment passes.",
    images: generatePostCollectionImages("21", 0, [
      { index: 1, type: 'video', extension: 'mp4' },
      { index: 2, type: 'video', extension: 'mp4' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 945000,
    comments: 6789,
    type: "double-media",
    price: 9.99,
    cardLayout: { gridType: "quad", maxImages: 4, gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full" }
  },

  "22": {
    id: "22",
    title: "Rose Garden Romance",
    description: "Surrounded by delicate roses, she blooms with natural elegance — where floral beauty meets feminine grace in intimate, romantic settings that celebrate both vulnerability and strength.",
    images: generatePostCollectionImages("22", 12),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "6 days ago",
    likes: 567000,
    comments: 3456,
    type: "collection",
    cardLayout: {
      gridType: "masonry",
      maxImages: 5,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "23": {
    id: "23",
    title: "Urban Elegance",
    description: "City lights and architectural beauty create the perfect backdrop for timeless sophistication — where modern elegance meets classic beauty in unexpected, captivating combinations.",
    images: generatePostCollectionImages("23", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'video', extension: 'mp4' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'image' },
      { index: 17, type: 'image' },
      { index: 18, type: 'image' },
      { index: 19, type: 'image' },
      { index: 20, type: 'image' },
      { index: 21, type: 'image' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 834000,
    comments: 5234,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "24": {
    id: "24",
    title: "Morning Light",
    description: "Fresh morning light illuminates natural beauty in its purest form — soft, genuine, and refreshingly real moments that capture the essence of peaceful confidence and quiet strength.",
    images: generatePostCollectionImages("24", 0, [
      { index: 1, type: 'video', extension: 'mp4' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' }
    ]),
    user: { name: "Lannah", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 678000,
    comments: 2987,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 4,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  }
};

export const getCollection = (id: string): Collection | undefined => {
  return collections[id];
};

export const getAllCollectionIds = (): string[] => {
  return Object.keys(collections);
};

export const getCollectionsByType = (type: string): Collection[] => {
  return Object.values(collections).filter(collection => collection.type === type);
};

export const getRandomCollections = (count: number = 5): Collection[] => {
  const allCollections = Object.values(collections);
  const shuffled = allCollections.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchCollections = (query: string): Collection[] => {
  const searchTerm = query.toLowerCase();
  return Object.values(collections).filter(collection =>
    collection.title.toLowerCase().includes(searchTerm) ||
    collection.description.toLowerCase().includes(searchTerm)
  );
};

export const getPostCollectionImages = (postId: string): Array<{ full: string; thumb: string }> => {
  const collection = getCollection(postId);
  return collection ? collection.images : [];
};