// ============================================================
// FILE 1: src/utils/secureIdMapper.ts
// ============================================================
// Maps simple collection IDs to secure 11-digit numbers

export const secureIdMap: Record<string, string> = {
  // Collection ID -> Secure 11-digit ID
  "1": "42857194638",   // Dripping in Midnight
  "2": "91673248507",   // Creature of the Night
  "4": "78451392684",   // Netflix & Thrill
  "5": "26849173560",   // Body as Canvas
  "6": "64937582104",   // Dark Elegance
  "7": "15782639408",   // Midnight Muse
  "8": "89264537219",   // Crimson Sophistication
  "9": "37196845273",   // Whisper White
  "10": "52814769380",  // Caramel Dreams
  "11": "94167238501",  // Siren Song
  "12": "61395748026",  // Dark Christmas
  "13": "48726193405",  // Shower Dreams
  "14": "73048261957",  // Pink Fury
  "15": "25913784650",  // X Marks the Heart
  "16": "86257403921",  // Off Duty Heat
  "17": "14539872640",  // Kyoto Dreams
  "18": "29485716302",  // Symbiote Chic
  "19": "58371926480",  // Ultraviolet Dreams
  "20": "71629384057",  // Tangerine Dreams
  "21": "46928175304",  // Sailor Moon Energy
  "22": "83517492608",  // Violet Hour
  "23": "19847362509",  // Wanderlust Chronicles
  "24": "67293841057",  // Crimson Fire
};

// Special secure IDs for special pages
export const specialSecureIds = {
  COLLECTIONS: "83946217508425", // Collections page secure ID
};

// Reverse mapping for lookups
export const reverseSecureIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(secureIdMap).map(([key, value]) => [value, key])
);

// Add special IDs to reverse mapping (these don't have collection IDs)
Object.entries(specialSecureIds).forEach(([key, value]) => {
  reverseSecureIdMap[value] = `SPECIAL_${key}`;
});

// Helper functions
export const getSecureId = (collectionId: string): string => {
  return secureIdMap[collectionId] || "";
};

export const getCollectionId = (secureId: string): string => {
  return reverseSecureIdMap[secureId] || "";
};

// Validate if a secure ID exists
export const isValidSecureId = (secureId: string): boolean => {
  return secureId in reverseSecureIdMap;
};

// Check if secure ID is for collections page
export const isCollectionsSecureId = (secureId: string): boolean => {
  return secureId === specialSecureIds.COLLECTIONS;
};

// Generate a new secure ID (for future collections)
export const generateSecureId = (): string => {
  let newId;
  do {
    newId = Math.floor(10000000000 + Math.random() * 90000000000).toString();
  } while (newId in reverseSecureIdMap);
  return newId;
};
