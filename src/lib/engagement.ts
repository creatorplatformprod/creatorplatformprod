type EngagementState = {
  likes: number;
  shares: number;
  views: number;
  viewerLiked: boolean;
  viewerShared: boolean;
};

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://creator-platform-api-production.creatorplatformprod.workers.dev';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const DEFAULT_STATE: EngagementState = {
  likes: 0,
  shares: 0,
  views: 0,
  viewerLiked: false,
  viewerShared: false
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
};

export const fetchEngagement = async (type: string, id: string): Promise<EngagementState> => {
  try {
    const result = await apiRequest(`/api/engagement?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`);
    if (!result?.success) {
      return { ...DEFAULT_STATE };
    }
    return {
      likes: result.likes || 0,
      shares: result.shares || 0,
      views: result.views || 0,
      viewerLiked: !!result.viewerLiked,
      viewerShared: !!result.viewerShared
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
};

export const setEngagementLike = async (type: string, id: string, liked: boolean): Promise<EngagementState> => {
  const result = await apiRequest('/api/engagement/like', {
    method: 'POST',
    body: JSON.stringify({ type, id, liked })
  });

  return {
    likes: result.likes || 0,
    shares: result.shares || 0,
    views: result.views || 0,
    viewerLiked: !!result.viewerLiked,
    viewerShared: !!result.viewerShared
  };
};

export const registerEngagementShare = async (type: string, id: string): Promise<EngagementState> => {
  const result = await apiRequest('/api/engagement/share', {
    method: 'POST',
    body: JSON.stringify({ type, id })
  });

  return {
    likes: result.likes || 0,
    shares: result.shares || 0,
    views: result.views || 0,
    viewerLiked: !!result.viewerLiked,
    viewerShared: !!result.viewerShared
  };
};

export const registerEngagementView = async (type: string, id: string): Promise<EngagementState> => {
  const result = await apiRequest('/api/engagement/view', {
    method: 'POST',
    body: JSON.stringify({ type, id })
  });

  return {
    likes: result.likes || 0,
    shares: result.shares || 0,
    views: result.views || 0,
    viewerLiked: !!result.viewerLiked,
    viewerShared: !!result.viewerShared
  };
};

export type { EngagementState };
