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
    title: "Dripping in Midnight",
    description: "Getting completely soaked in this dark outfit. The red details really stand out against all the black. Just feeling wild and free.",
    images: generatePostCollectionImages("1", 34),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 23400,
    comments: 1245,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 7,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "2": {
    id: "2",
    title: "Creature of the Night",
    description: "Halloween is basically my whole vibe. Dark clothes with cool bat-like shapes, shadows everywhere. Gothic but sexy at the same time.",
    images: generatePostCollectionImages("2", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'video', extension: 'mp4' },
      { index: 8, type: 'video', extension: 'mp4' },
      { index: 9, type: 'video', extension: 'mp4' },
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
      { index: 22, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 45600,
    comments: 2341,
    type: "collection",
    price: 9.99,
    cardLayout: { gridType: "triple", maxImages: 3, gridClasses: "grid grid-cols-3 gap-1 h-full" }
  },

  "4": {
    id: "4",
    title: "Netflix & Thrill",
    description: "Wearing this big blue sweater that doesn't cover much. The screen light makes cool shadows on my skin. Movie night just got a lot more interesting.",
    images: generatePostCollectionImages("4", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'video', extension: 'mp4' },
      { index: 8, type: 'video', extension: 'mp4' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'image' },
      { index: 13, type: 'image' },
      { index: 14, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 67800,
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
    title: "Body as Canvas",
    description: "My body in this beautiful rose gold lighting. Every curve and angle looks amazing. Pink can be really sexy and powerful too.",
    images: generatePostCollectionImages("5", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'video', extension: 'mp4' },
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
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 89200,
    comments: 4523,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 7,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "6": {
    id: "6",
    title: "Dark Elegance",
    description: "Wearing this smooth black silk that fits like a second skin. It's elegant but also a bit playful. That smile after a serious look is what really gets people.",
    images: generatePostCollectionImages("6", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'video', extension: 'mp4' },
      { index: 3, type: 'video', extension: 'mp4' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' },
      { index: 11, type: 'image' },
      { index: 12, type: 'video', extension: 'mp4' },
      { index: 13, type: 'video', extension: 'mp4' },
      { index: 14, type: 'image' },
      { index: 15, type: 'image' },
      { index: 16, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 34500,
    comments: 1234,
    type: "collection",
    price: 9.99,
    cardLayout: { gridType: "double", maxImages: 8, gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full" }
  },

  "7": {
    id: "7",
    title: "Midnight Muse",
    description: "Black outfit that feels mysterious and alive. Darkness that sticks with you like a great perfume. Every part of this black fabric has its own appeal.",
    images: generatePostCollectionImages("7", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'video', extension: 'mp4' },
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
      { index: 23, type: 'image' },
      { index: 24, type: 'image' },
      { index: 25, type: 'image' },
      { index: 26, type: 'image' },
      { index: 27, type: 'image' },
      { index: 28, type: 'image' },
      { index: 29, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "6 hours ago",
    likes: 67800,
    comments: 2987,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "8": {
    id: "8",
    title: "Crimson Sophistication",
    description: "Red dress clinging in all the right places. Designer shades reflecting a world she's about to conquer. This isn't confidence—it's a declaration. Unforgettable. 🕶️❤️",
    images: generatePostCollectionImages("8", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'video', extension: 'mp4' },
      { index: 3, type: 'video', extension: 'mp4' },
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
      { index: 14, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 12000,
    comments: 8764,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 10,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "9": {
    id: "9",
    title: "Whisper White",
    description: "Where fabric becomes suggestion and skin becomes poetry. Pure white against warm curves. Minimal threads, maximum tension. Impossible to look away. 🤍",
    images: generatePostCollectionImages("9", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'video', extension: 'mp4' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 93400,
    comments: 5432,
    type: "collection",
    price: 9.99,
    cardLayout: { gridType: "triple", maxImages: 3, gridClasses: "grid grid-cols-3 gap-1 h-full" }
  },

  "10": {
    id: "10",
    title: "Caramel Dreams",
    description: "Wrapped in autumn's warmest embrace. Caramel knits and cocoa tones that feel like the first chapter of a love story. Comfort never looked this tempting. 🤎☕",
    images: generatePostCollectionImages("10", 9),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 56700,
    comments: 3214,
    type: "collection",
    price: 4.99,
    cardLayout: { gridType: "double", maxImages: 2, gridClasses: "grid grid-cols-2 gap-1 h-full" }
  },

  "11": {
    id: "11",
    title: "Siren Song",
    description: "She rose from depths unknown. Cerulean and crimson cascading like ocean fire. Part warning, part invitation. Mythical energy in mortal beauty. 🧜‍♀️🔵🔴",
    images: generatePostCollectionImages("11", 0, [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'video', extension: 'mp4' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' },
      { index: 8, type: 'image' },
      { index: 9, type: 'image' },
      { index: 10, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "12 hours ago",
    likes: 72300,
    comments: 4156,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 10,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "12": {
    id: "12",
    title: "Dark Christmas",
    description: "Santa outfit but way more sophisticated. Deep red velvet that hugs all the curves. Holiday season with a sexy twist.",
    images: generatePostCollectionImages("12", 13),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 45600,
    comments: 2789,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 5,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "13": {
    id: "13",
    title: "Shower Dreams",
    description: "Getting wet with water everywhere and steam creating this mysterious atmosphere. Droplets making patterns on the skin. Feeling both vulnerable and strong.",
    images: generatePostCollectionImages("13", 14),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 83400,
    comments: 3891,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 10,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "14": {
    id: "14",
    title: "Pink Fury",
    description: "Pink outfit with a wild, fun energy. Soft and cute on the outside but there's definitely some fire underneath. The kind of look that's sweet but can surprise you.",
    images: generatePostCollectionImages("14", 20),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 61200,
    comments: 2456,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "15": {
    id: "15",
    title: "X Marks the Heart",
    description: "Black outfit with silver details and an X motif. Dramatic look that really makes an impression. The kind of style you won't forget.",
    images: generatePostCollectionImages("15", 10),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "5 days ago",
    likes: 78900,
    comments: 4321,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 7,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "16": {
    id: "16",
    title: "Off Duty Heat",
    description: "Jeans that hug in all the right places. Casual top that screams 'look at me.' Grocery runs become runways. Confidence in the mundane. 👖✨",
    images: generatePostCollectionImages("16", 14),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 56700,
    comments: 2134,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "17": {
    id: "17",
    title: "Kyoto Dreams",
    description: "Smooth silk outfit with Japanese-inspired details. The fabric drapes beautifully. Mixing traditional elegance with modern style.",
    images: generatePostCollectionImages("17", 27),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 44500,
    comments: 1876,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "18": {
    id: "18",
    title: "Symbiote Chic",
    description: "Dark outfit that feels like a second skin. Edgy, powerful energy running through everything. Anti-hero kind of vibe.",
    images: generatePostCollectionImages("18", 34),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "2 days ago",
    likes: 52300,
    comments: 2567,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 5,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "19": {
    id: "19",
    title: "Ultraviolet Dreams",
    description: "Black lace outfit with purple lighting creating cool shadows. Nighttime vibe with that ultraviolet glow. Really magical atmosphere.",
    images: generatePostCollectionImages("19", 12),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "5 days ago",
    likes: 39800,
    comments: 1890,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 7,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "20": {
    id: "20",
    title: "Tangerine Dreams",
    description: "Orange cozy knit that makes comfort irresistible. Warm tones against warmer skin. Sunset vibes in fabric form. 🧡🍊",
    images: generatePostCollectionImages("20", 7),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "4 days ago",
    likes: 28700,
    comments: 1456,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 7,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "21": {
    id: "21",
    title: "Sailor Moon Energy",
    description: "White and blue stripes hugging curves like ocean waves. Nautical fantasy meets pin-up perfection. Freedom in the sailor aesthetic. ⚓🌊⛵",
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
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 week ago",
    likes: 41200,
    comments: 2234,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 9,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "22": {
    id: "22",
    title: "Violet Hour",
    description: "Purple glow wrapping around curves like a lover's touch. Cozy meets carnal in ultraviolet perfection. Soft yet smoldering. 💜🌙",
    images: generatePostCollectionImages("22", 12),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "3 days ago",
    likes: 53400,
    comments: 2678,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 10,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "23": {
    id: "23",
    title: "Wanderlust Chronicles",
    description: "Travel fit locked and loaded. Comfortable for long flights, cute for unexpected moments. Passport ready, spirit free. ✈️🌍✨",
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
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "6 days ago",
    likes: 82300,
    comments: 3123,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 8,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "24": {
    id: "24",
    title: "Crimson Fire",
    description: "Red hair flowing over bare shoulders. Confidence that's really strong. Just full of energy and power.",
    images: generatePostCollectionImages("24", 0, [
      { index: 1, type: 'video', extension: 'mp4' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' },
      { index: 7, type: 'image' }
    ]),
    user: { name: "Lanna", avatar: portrait1, verified: true },
    timestamp: "1 day ago",
    likes: 35600,
    comments: 1789,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 7,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
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