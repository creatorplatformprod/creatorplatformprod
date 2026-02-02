type EngagementData = {
  likes: number;
  shares: number;
  liked: boolean;
};

const DEFAULT_ENGAGEMENT: EngagementData = {
  likes: 0,
  shares: 0,
  liked: false
};

const getStorageKey = (id: string) => `engagement:${id}`;

export const readEngagement = (id: string): EngagementData => {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_ENGAGEMENT };
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(id));
    if (!raw) {
      return { ...DEFAULT_ENGAGEMENT };
    }

    const parsed = JSON.parse(raw) as Partial<EngagementData>;
    return {
      likes: Number(parsed.likes) || 0,
      shares: Number(parsed.shares) || 0,
      liked: Boolean(parsed.liked)
    };
  } catch {
    return { ...DEFAULT_ENGAGEMENT };
  }
};

export const writeEngagement = (id: string, data: EngagementData) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(getStorageKey(id), JSON.stringify(data));
  } catch {
    // Ignore storage write failures (private mode, quota, etc.)
  }
};
