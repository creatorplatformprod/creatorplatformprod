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
    description: "water cascading down like liquid diamonds against obsidian fabric — crimson accents bleeding through the darkness like forbidden poetry. there's something about being drenched in the right kind of darkness that makes you feel invincible. minimal black, maximum heat. every droplet tracing paths you wish you could follow. wet, wild, and completely unapologetic about it. 💧🔥",
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
    title: "Creature of the Night",
    description: "halloween isn't a holiday, it's a lifestyle. bat-wing silhouettes dancing across midnight fabric while shadows weave their own seduction. there's something dangerously alluring about embracing the darkness — the way black clings to curves, the way shadow details play hide and seek with imagination. gothic elegance meets pure temptation. the night didn't just call... she answered. 🦇🖤",
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
    title: "Real Talk",
    description: "I spent years trying to fit into boxes that weren't made for me. Now I'm building my own. It's scary, it's liberating, and it's the most authentic thing I've ever done. Here's to everyone else doing the same.",
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
    title: "Netflix & Thrill",
    description: "oversized blue knit barely covering what matters, screen glow painting shadows across bare skin. movie night but make it irresistible. there's an art to looking this good while doing absolutely nothing — cozy has never been this tempting. come for the chill, stay for the view. 💙🎬",
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
    title: "Body as Canvas",
    description: "the female form reimagined in rose gold light and blush-toned shadows — every curve a brushstroke, every angle a masterpiece museums could never hold. pink isn't soft here; it's powerful, provocative, primal. celebrating the art that doesn't hang on walls but walks through rooms and stops hearts. we are the gallery. we are the exhibition. we are unforgettable. 🌸💗",
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
    title: "Dark Elegance",
    description: "black silk wrapped around confidence like a second skin — elegant enough to command respect, playful enough to keep them guessing. she carries herself like royalty but laughs like she knows all your secrets. there's something intoxicating about a woman who can be sophisticated and seductive in the same breath. the smile that follows the smolder? that's where the real danger lives. 🖤✨",
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
    title: "Midnight Muse",
    description: "noir never looked this alive. she wears darkness like others wear perfume — intoxicating, unforgettable, lingering long after she's gone. every fold of black fabric holds midnight's promise, every glance an invitation you're afraid to accept but can't refuse. this is the kind of beauty that haunts your thoughts at 3am. the kind you can't explain but can't forget. all black everything, and everything you've been dreaming about. 🖤🌑",
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
    title: "Crimson Sophistication",
    description: "red dress clinging in all the right places, designer shades reflecting a world she's about to set on fire. this isn't just confidence — it's a declaration. sophisticated, sultry, and completely aware of the effect she has. the kind of presence that turns heads and holds gazes hostage. sunday mood: unbothered, untouchable, unforgettable. 🕶️❤️",
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
    title: "Whisper White",
    description: "where fabric becomes suggestion and skin becomes poetry — pure white against warm curves, minimal threads creating maximum tension. there's an art to revealing everything by showing almost nothing. sensual doesn't have to scream; sometimes it whispers, and those whispers echo louder than any shout. intimate. intentional. impossible to look away. 🤍",
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
    title: "Caramel Dreams",
    description: "wrapped in autumn's warmest embrace — caramel knits and cocoa tones that feel like the first chapter of a love story. cozy never looked this tempting. there's something about soft brown against bare skin that just hits different. earthy, grounded, effortlessly seductive. comfort has never been this captivating. 🤎☕",
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
    title: "Siren Song",
    description: "she rose from depths unknown — cerulean and crimson cascading like ocean fire. part warning, part invitation, entirely irresistible. they say sirens sing ships to shore; she sings souls to surrender. blue and red hair framing features that could launch wars or end them. mythical energy wrapped in mortal beauty. the kind of creature you'd follow anywhere, even knowing the danger. especially knowing the danger. 🧜‍♀️🔵🔴",
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
    title: "Dark Christmas",
    description: "santa but make it sinfully sophisticated — deep burgundy velvet clinging to curves that could make the naughty list worth it. holiday vibes with a shadow of seduction. 'tis the season to be tempting, and she's rewriting the rules of festive. dark red against warm skin, christmas magic with a dangerous twist. who said the holidays couldn't be this hot? 🎅🖤🎄",
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
    title: "Shower Dreams",
    description: "where water becomes worship and steam holds secrets — crystalline droplets painting paths of purity down bare skin. she emerges renewed, baptized in her own beauty. there's something sacred about these moments: vulnerable yet powerful, exposed yet protected. clean slate. clear mind. captivating in ways that feel almost too intimate to share. almost. 💧🤍",
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
    title: "Pink Fury",
    description: "cotton candy chaos meets feline energy — soft pink fur and playful claws wrapped in pastel rebellion. she's adorable until she pounces, sweet until she scratches. cat-like grace with a hint of danger lurking behind innocent eyes. the kind of cute that bites back when you least expect it. don't let the soft exterior fool you; there's fire underneath all that pink. 🐱💗",
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
    title: "X Marks the Heart",
    description: "she leaves her signature on souls — an X that marks the spot where you'll never forget her. dramatic blacks cut with silver intention, style that brands itself into memory permanently. some people pass through your life like whispers. others leave marks. she's the mark you'll trace with your thoughts at midnight, wondering what could have been, grateful for what was. ✖️🖤🌙",
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
    title: "Off Duty Heat",
    description: "jeans that hug in all the right places, casual top that somehow still screams 'look at me' — the everyday uniform of someone who doesn't need to try. grocery runs become runways, morning errands become moments. real life never looked this tempting. because the sexiest thing? confidence in the mundane. effortless energy that turns ordinary into unforgettable. 👖✨",
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
    title: "Kyoto Dreams",
    description: "silk whispers of ancient elegance — where tradition meets transcendence in every fold. cherry blossom precision in fabric that drapes like poetry, geisha grace in glances that speak volumes. Japanese artistry reimagined through a modern lens of sensuality. east meets ethereal in frames that feel like floating between worlds. timeless. refined. devastatingly beautiful. 🌸🇯🇵",
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
    title: "Symbiote Chic",
    description: "darkness becomes a second skin — venom energy coursing through every curve, anti-hero aesthetics that blur the line between villain and vixen. she doesn't wear the suit; she IS the suit. black liquid confidence that clings and commands. they say symbiotes choose their hosts carefully. she knows exactly why she was chosen. dangerous. powerful. intoxicating. we are... irresistible. 🕷️🖤",
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
    title: "Ultraviolet Dreams",
    description: "purple light painting shadows across black lace — the city sleeps while she awakens in ultraviolet glory. lingerie that leaves just enough to imagination, lighting that turns skin into art. nocturnal content for nocturnal souls who understand that the best things happen after dark. there's different magic in the violet hour... softer, stranger, infinitely more seductive. this is her world. you're just visiting. 💜🖤",
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
    title: "Tangerine Dreams",
    description: "orange cozy knit that somehow makes comfort look this tempting — warm tones against warmer skin, sunset vibes in fabric form. she's a whole mood wrapped in citrus softness. the kind of cozy that makes you want to get closer, stay longer, forget the world exists. comfort and seduction aren't opposites; she's living proof. 🧡🍊",
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
    title: "Sailor Moon Energy",
    description: "white and blue stripes that hug curves like ocean waves — nautical fantasy meets pin-up perfection. there's freedom in the sailor aesthetic, something about answering the call of the sea that translates to pure confidence. anchors up, inhibitions down. ready to set sail into whatever adventure finds her first. captain of her own ship and destination? wherever the mood takes her. ⚓🌊⛵",
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
    title: "Violet Hour",
    description: "purple glow wrapping around curves like a lover's touch — cozy meets carnal in ultraviolet perfection. late night energy captured in fabric and light, the kind of sensual that doesn't need to try. she's lounging like tomorrow doesn't exist, looking like a dream you never want to wake from. soft yet smoldering. comfortable yet captivating. the perfect contradiction. 💜🌙",
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
    title: "Wanderlust Chronicles",
    description: "travel fit locked and loaded — comfortable enough for long flights, cute enough for unexpected moments in foreign cities. passport ready, spirit free, aesthetic on point. there's something undeniably attractive about a woman who travels light but carries heavy confidence. adventure is calling and she already packed her best angles. every destination just a backdrop for moments worth capturing. ✈️🌍✨",
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
    title: "Crimson Fire",
    description: "red hair cascading like flames against bare shoulders — confidence burning brighter than any color could contain. she doesn't just have presence; she has dominion. every frame captures what words can't describe: that raw, untamed energy of a woman who knows exactly who she is and dares you to look away. spoiler: you can't. the fire in her eyes matches the fire in her hair. uncontainable. unforgettable. 🔥💪",
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