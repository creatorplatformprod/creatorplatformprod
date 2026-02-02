/**
 * API Client for Creator Platform
 * Centralized API calls for frontend
 */

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://creator-platform-api-production.creatorplatformprod.workers.dev';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

// Helper to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper for API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || 'API request failed');
  }

  return response.json();
};

// Helper for file uploads
const apiUpload = async (endpoint: string, file: File): Promise<any> => {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || error.message || 'Upload failed');
  }

  return response.json();
};

export const api = {
  // ==================== Authentication ====================
  
  /**
   * Register new user
   */
  register: async (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    return apiRequest('/api/auth/me');
  },

  /**
   * Initiate Google OAuth
   */
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  // ==================== User Profile ====================

  /**
   * Get user by username (public profile)
   */
  getUser: async (username: string) => {
    return apiRequest(`/api/users/${username}`);
  },

  /**
   * Get user by ID (public profile)
   */
  getUserById: async (userId: string) => {
    return apiRequest(`/api/users/id/${userId}`);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    displayName?: string;
    bio?: string;
    walletAddress?: string;
    telegramUsername?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
    domainEmail?: string;
    avatar?: string;
    unlockAllPrice?: number | null;
    unlockAllCurrency?: string | null;
  }) => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ==================== Status Cards ====================

  /**
   * Get status cards for a creator
   */
  getStatusCards: async (username: string) => {
    return apiRequest(`/api/status-cards/creator/${username}`);
  },

  /**
   * Create status card
   */
  createStatusCard: async (data: {
    text: string;
    imageUrl?: string;
    isLocked?: boolean;
    order?: number;
  }) => {
    return apiRequest('/api/status-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update status card
   */
  updateStatusCard: async (id: string, data: any) => {
    return apiRequest(`/api/status-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete status card
   */
  deleteStatusCard: async (id: string) => {
    return apiRequest(`/api/status-cards/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== Collections ====================

  /**
   * Get collections for a creator
   */
  getCollections: async (username: string) => {
    return apiRequest(`/api/collections/creator/${username}`);
  },

  /**
   * Get collections for current creator (dashboard)
   */
  getMyCollections: async () => {
    return apiRequest('/api/collections/mine');
  },

  /**
   * Get single collection by ID
   */
  getCollection: async (id: string) => {
    return apiRequest(`/api/collections/${id}`);
  },

  /**
   * Create collection
   */
  createCollection: async (data: {
    title: string;
    description?: string;
    media?: Array<{ url: string; thumbnailUrl: string; mediaType: string }>;
    price: number;
    currency?: string;
    tags?: string[];
  }) => {
    return apiRequest('/api/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Add media to a collection
   */
  addCollectionMedia: async (collectionId: string, data: {
    url: string;
    thumbnailUrl?: string;
    mediaType?: string;
    size?: number;
  }) => {
    return apiRequest(`/api/collections/${collectionId}/media`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update collection
   */
  updateCollection: async (id: string, data: any) => {
    return apiRequest(`/api/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete collection
   */
  deleteCollection: async (id: string) => {
    return apiRequest(`/api/collections/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== File Upload ====================

  /**
   * Upload file (image or video)
   */
  uploadFile: async (file: File) => {
    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 25MB limit');
    }

    return apiUpload('/api/upload', file);
  },

  // ==================== Public Profile ====================

  /**
   * Get creator's public profile with all content
   */
  getCreatorProfile: async (username: string) => {
    // Use the public profile endpoint (maindomain/username)
    return apiRequest(`/${username}`);
  },

  // ==================== Payments ====================

  /**
   * Get available payment providers
   */
  getPaymentProviders: async (amount: number, currency: string = 'USD') => {
    return apiRequest(`/api/payment/providers?amount=${amount}&currency=${currency}`);
  },

  /**
   * Create payment session
   */
  createPaymentSession: async (data: {
    amount: number;
    collectionId: string;
    currency?: string;
    provider: string;
    email: string;
    creatorId?: string;
  }) => {
    return apiRequest('/api/payment/create-session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify access token
   */
  verifyAccessToken: async (token: string) => {
    return apiRequest(`/api/payment/verify?token=${token}`);
  },

  // ==================== Analytics ====================

  /**
   * Get sales summary for analytics graph
   */
  getSalesSummary: async (params: {
    range?: string;
    start?: string;
    end?: string;
    groupBy?: 'day' | 'week' | 'month';
    metric?: 'revenue' | 'orders' | 'net' | 'platformFee';
    status?: string;
    collectionId?: string;
    currency?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.range) query.set('range', params.range);
    if (params.start) query.set('start', params.start);
    if (params.end) query.set('end', params.end);
    if (params.groupBy) query.set('groupBy', params.groupBy);
    if (params.metric) query.set('metric', params.metric);
    if (params.status) query.set('status', params.status);
    if (params.collectionId) query.set('collectionId', params.collectionId);
    if (params.currency) query.set('currency', params.currency);
    return apiRequest(`/api/analytics/sales/summary?${query.toString()}`);
  },

  /**
   * Get sales list for analytics table
   */
  getSalesList: async (params: {
    range?: string;
    start?: string;
    end?: string;
    status?: string;
    collectionId?: string;
    currency?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.range) query.set('range', params.range);
    if (params.start) query.set('start', params.start);
    if (params.end) query.set('end', params.end);
    if (params.status) query.set('status', params.status);
    if (params.collectionId) query.set('collectionId', params.collectionId);
    if (params.currency) query.set('currency', params.currency);
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.offset !== undefined) query.set('offset', String(params.offset));
    if (params.sort) query.set('sort', params.sort);
    if (params.search) query.set('search', params.search);
    return apiRequest(`/api/analytics/sales/list?${query.toString()}`);
  },

  // ==================== Health Check ====================

  /**
   * Check API health
   */
  healthCheck: async () => {
    return apiRequest('/api/health');
  },
};

export default api;
