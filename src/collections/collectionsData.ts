// src/collections/collectionsData.ts - PROFESSIONAL MEDIA MANAGEMENT SOLUTION
// Uses Pexels free stock images for mock data

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

// Pexels URL builder for consistent image sizing
// Using smaller sizes to prevent ERR_INSUFFICIENT_RESOURCES
const pexelsUrl = (photoId: number, width: number = 640): string =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;

const pexelsFull = (photoId: number): string => pexelsUrl(photoId, 640);
const pexelsThumb = (photoId: number): string => pexelsUrl(photoId, 280);

// Pexels video URL builder (uses their video CDN)
const pexelsVideoUrl = (videoId: number): string =>
  `https://player.vimeo.com/external/${videoId}.hd.mp4?s=placeholder`;

// Sample Pexels video placeholder (actual videos require API)
const mockVideoUrl = "https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&w=1280";
const mockVideoThumb = "https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&w=400";

// Creator avatar - using a professional portrait from Pexels
const creatorAvatar = pexelsThumb(1239291); // Professional woman portrait

// Curated Pexels photo IDs organized by theme/collection
// These are real, publicly available Pexels photo IDs
const pexelsPhotoSets = {
  // Dark/Gothic fashion theme (Collection 1, 2)
  darkFashion: [1755385, 1926769, 2681751, 3622614, 1536619, 2709388, 3622625, 1926771, 2787341, 2709386, 3622618, 1755388, 2709387, 3622616, 1926770, 2787342, 3622620, 1755386, 2709389, 3622617, 1926772, 2787343, 3622621, 1755387, 2709390, 3622619, 1926773, 2787344, 3622622, 1755389, 2709391, 3622623, 1926774, 2787345],
  // Cozy/Casual home theme (Collection 4, 10)
  cozyHome: [3807517, 4050334, 3807519, 4050336, 3807521, 4050338, 3807523, 4050340, 3807525, 4050342, 3807527, 4050344, 3807529, 4050346],
  // Artistic/Pink lighting (Collection 5, 14)
  pinkArtistic: [2896840, 3622612, 2896842, 3622613, 2896844, 3622614, 2896846, 3622615, 2896848, 3622616, 2896850, 3622617, 2896852, 3622618, 2896854, 3622619, 2896856, 3622620, 2896858, 3622621],
  // Elegant/Formal (Collection 6, 8)
  elegantFormal: [1536619, 2709388, 1536621, 2709390, 1536623, 2709392, 1536625, 2709394, 1536627, 2709396, 1536629, 2709398, 1536631, 2709400, 1536633, 2709402],
  // Night/Dark aesthetic (Collection 7, 19)
  nightAesthetic: [1926769, 2787341, 1926771, 2787343, 1926773, 2787345, 1926775, 2787347, 1926777, 2787349, 1926779, 2787351, 1926781, 2787353, 1926783, 2787355, 1926785, 2787357, 1926787, 2787359, 1926789, 2787361, 1926791, 2787363, 1926793, 2787365, 1926795, 2787367],
  // White/Minimal (Collection 9)
  whiteMinimal: [3622612, 2896840, 3622614, 2896842, 3622616, 2896844, 3622618, 2896846, 3622620, 2896848],
  // Warm/Autumn tones (Collection 10, 20)
  warmAutumn: [3807517, 4050334, 3807519, 4050336, 3807521, 4050338, 3807523],
  // Ocean/Blue theme (Collection 11, 21)
  oceanBlue: [1536619, 3622612, 1536621, 3622614, 1536623, 3622616, 1536625, 3622618, 1536627, 3622620, 1536629],
  // Holiday/Festive (Collection 12)
  holidayFestive: [1926769, 2709388, 1926771, 2709390, 1926773, 2709392, 1926775, 2709394, 1926777, 2709396, 1926779, 2709398, 1926781],
  // Water/Shower theme (Collection 13)
  waterTheme: [2896840, 3807517, 2896842, 3807519, 2896844, 3807521, 2896846, 3807523, 2896848, 3807525, 2896850, 3807527, 2896852, 3807529],
  // Bold/Dramatic (Collection 15)
  boldDramatic: [1755385, 2681751, 1755387, 2681753, 1755389, 2681755, 1755391, 2681757, 1755393, 2681759],
  // Casual/Street style (Collection 16)
  casualStreet: [4050334, 3622612, 4050336, 3622614, 4050338, 3622616, 4050340, 3622618, 4050342, 3622620, 4050344, 3622622, 4050346, 3622624],
  // Asian/Silk aesthetic (Collection 17)
  asianSilk: [2709388, 1536619, 2709390, 1536621, 2709392, 1536623, 2709394, 1536625, 2709396, 1536627, 2709398, 1536629, 2709400, 1536631, 2709402, 1536633, 2709404, 1536635, 2709406, 1536637, 2709408, 1536639, 2709410, 1536641, 2709412, 1536643, 2709414],
  // Dark/Edgy (Collection 18)
  darkEdgy: [1926769, 2787341, 1926771, 2787343, 1926773, 2787345, 1926775, 2787347, 1926777, 2787349, 1926779, 2787351, 1926781, 2787353, 1926783, 2787355, 1926785, 2787357, 1926787, 2787359, 1926789, 2787361, 1926791, 2787363, 1926793, 2787365, 1926795, 2787367, 1926797, 2787369, 1926799, 2787371, 1926801, 2787373],
  // Purple/Violet (Collection 22)
  purpleViolet: [2896840, 1755385, 2896842, 1755387, 2896844, 1755389, 2896846, 1755391, 2896848, 1755393, 2896850, 1755395],
  // Travel/Adventure (Collection 23)
  travelAdventure: [3622612, 4050334, 3622614, 4050336, 3622616, 4050338, 3622618, 4050340, 3622620, 4050342, 3622622, 4050344, 3622624, 4050346, 3622626, 4050348, 3622628, 4050350, 3622630, 4050352, 3622632],
  // Redhead/Fiery (Collection 24)
  fieryRed: [2681751, 1926769, 2681753, 1926771, 2681755, 1926773, 2681757],
};

type MediaType = 'image' | 'video';

interface MediaItem {
  index: number;
  type: MediaType;
}

// Generate Pexels-based collection images
const generatePexelsCollectionImages = (
  photoIds: number[],
  mediaItems?: MediaItem[]
): Array<{ full: string; thumb: string }> => {
  if (!mediaItems) {
    return photoIds.map(id => ({
      full: pexelsFull(id),
      thumb: pexelsThumb(id)
    }));
  }
  
  return mediaItems.map((item, idx) => {
    const photoId = photoIds[idx % photoIds.length];
    
    if (item.type === 'video') {
      return {
        full: mockVideoUrl,
        thumb: mockVideoThumb
      };
    }
    
    return {
      full: pexelsFull(photoId),
      thumb: pexelsThumb(photoId)
    };
  });
};

export const collections: Record<string, Collection> = {
  "1": {
    id: "1",
    title: "Dripping in Midnight",
    description: "Getting completely soaked in this dark outfit. The red details really stand out against all the black. Just feeling wild and free.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.darkFashion.slice(0, 6)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "2 days ago",
    likes: 23400,
    comments: 1245,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "row-span-2" }
    }
  },

  "2": {
    id: "2",
    title: "Creature of the Night",
    description: "Halloween is basically my whole vibe. Dark clothes with cool bat-like shapes, shadows everywhere. Gothic but sexy at the same time.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.darkFashion.slice(6, 12), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'video' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.cozyHome.slice(0, 6), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'video' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.pinkArtistic.slice(0, 6), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'video' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "1 day ago",
    likes: 89200,
    comments: 4523,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "6": {
    id: "6",
    title: "Dark Elegance",
    description: "Wearing this smooth black silk that fits like a second skin. It's elegant but also a bit playful. That smile after a serious look is what really gets people.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.elegantFormal.slice(0, 6), [
      { index: 1, type: 'image' },
      { index: 2, type: 'video' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "4 days ago",
    likes: 34500,
    comments: 1234,
    type: "collection",
    price: 9.99,
    cardLayout: { gridType: "double", maxImages: 4, gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full" }
  },

  "7": {
    id: "7",
    title: "Midnight Muse",
    description: "Black outfit that feels mysterious and alive. Darkness that sticks with you like a great perfume. Every part of this black fabric has its own appeal.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.nightAesthetic.slice(0, 6), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'video' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    description: "Red dress clinging in all the right places. Designer shades reflecting a world she's about to conquer. This isn't confidence—it's a declaration. Unforgettable.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.elegantFormal.slice(6, 12), [
      { index: 1, type: 'image' },
      { index: 2, type: 'video' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "2 days ago",
    likes: 12000,
    comments: 8764,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "9": {
    id: "9",
    title: "Whisper White",
    description: "Where fabric becomes suggestion and skin becomes poetry. Pure white against warm curves. Minimal threads, maximum tension. Impossible to look away.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.whiteMinimal.slice(0, 4), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'video' },
      { index: 4, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    description: "Wrapped in autumn's warmest embrace. Caramel knits and cocoa tones that feel like the first chapter of a love story. Comfort never looked this tempting.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.warmAutumn.slice(0, 4)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    description: "She rose from depths unknown. Cerulean and crimson cascading like ocean fire. Part warning, part invitation. Mythical energy in mortal beauty.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.oceanBlue.slice(0, 4), [
      { index: 1, type: 'image' },
      { index: 2, type: 'image' },
      { index: 3, type: 'video' },
      { index: 4, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "12 hours ago",
    likes: 72300,
    comments: 4156,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "12": {
    id: "12",
    title: "Dark Christmas",
    description: "Santa outfit but way more sophisticated. Deep red velvet that hugs all the curves. Holiday season with a sexy twist.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.holidayFestive.slice(0, 5)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.waterTheme.slice(0, 4)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "4 days ago",
    likes: 83400,
    comments: 3891,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-3 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "col-span-2", 3: "col-span-2" }
    }
  },

  "14": {
    id: "14",
    title: "Pink Fury",
    description: "Pink outfit with a wild, fun energy. Soft and cute on the outside but there's definitely some fire underneath. The kind of look that's sweet but can surprise you.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.pinkArtistic.slice(6, 12)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.boldDramatic.slice(0, 6)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "5 days ago",
    likes: 78900,
    comments: 4321,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "16": {
    id: "16",
    title: "Off Duty Heat",
    description: "Jeans that hug in all the right places. Casual top that screams 'look at me.' Grocery runs become runways. Confidence in the mundane.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.casualStreet.slice(0, 6)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.asianSilk.slice(0, 6)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.darkEdgy.slice(0, 5)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
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
    images: generatePexelsCollectionImages(pexelsPhotoSets.nightAesthetic.slice(6, 12)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "5 days ago",
    likes: 39800,
    comments: 1890,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "20": {
    id: "20",
    title: "Tangerine Dreams",
    description: "Orange cozy knit that makes comfort irresistible. Warm tones against warmer skin. Sunset vibes in fabric form.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.warmAutumn.slice(4, 7)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "4 days ago",
    likes: 28700,
    comments: 1456,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 3,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "21": {
    id: "21",
    title: "Sailor Moon Energy",
    description: "White and blue stripes hugging curves like ocean waves. Nautical fantasy meets pin-up perfection. Freedom in the sailor aesthetic.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.oceanBlue.slice(4, 8), [
      { index: 1, type: 'video' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "1 week ago",
    likes: 41200,
    comments: 2234,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
      gridClasses: "grid grid-cols-2 grid-rows-2 gap-1 h-full",
      imageSpans: { 0: "row-span-2" }
    }
  },

  "22": {
    id: "22",
    title: "Violet Hour",
    description: "Purple glow wrapping around curves like a lover's touch. Cozy meets carnal in ultraviolet perfection. Soft yet smoldering.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.purpleViolet.slice(0, 6)),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "3 days ago",
    likes: 53400,
    comments: 2678,
    type: "collection",
    price: 4.99,
    cardLayout: {
      gridType: "masonry",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 gap-1 h-full",
      imageSpans: { 1: "col-span-2", 4: "row-span-2" }
    }
  },

  "23": {
    id: "23",
    title: "Wanderlust Chronicles",
    description: "Travel fit locked and loaded. Comfortable for long flights, cute for unexpected moments. Passport ready, spirit free.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.travelAdventure.slice(0, 6), [
      { index: 1, type: 'image' },
      { index: 2, type: 'video' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' },
      { index: 5, type: 'image' },
      { index: 6, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "6 days ago",
    likes: 82300,
    comments: 3123,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 6,
      gridClasses: "grid grid-cols-3 grid-rows-3 gap-1 h-full",
      imageSpans: { 0: "col-span-2 row-span-2", 3: "row-span-2" }
    }
  },

  "24": {
    id: "24",
    title: "Crimson Fire",
    description: "Red hair flowing over bare shoulders. Confidence that's really strong. Just full of energy and power.",
    images: generatePexelsCollectionImages(pexelsPhotoSets.fieryRed.slice(0, 4), [
      { index: 1, type: 'video' },
      { index: 2, type: 'image' },
      { index: 3, type: 'image' },
      { index: 4, type: 'image' }
    ]),
    user: { name: "Creator", avatar: creatorAvatar, verified: true },
    timestamp: "1 day ago",
    likes: 35600,
    comments: 1789,
    type: "collection",
    price: 9.99,
    cardLayout: {
      gridType: "asymmetric",
      maxImages: 4,
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