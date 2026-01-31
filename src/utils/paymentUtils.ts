// ============================================================
// /utils/paymentUtils.ts
// Payment verification utilities supporting both payment methods:
// 1. Card2Crypto: Token-based verification (URL param ?access=token)
// 2. Content.Money: Direct access (clean URLs, access controlled by Content.Money)
// ============================================================

export interface AccessTokenData {
  valid: boolean;
  collectionId?: string;
  created?: number;
  orderId?: string;
  reason?: string;
}

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  'https://creator-platform-api-production.creatorplatformprod.workers.dev';
const API_URL = RAW_API_URL.replace(/\/+$/, '');

/**
 * Verify access token with Cloudflare Worker (Card2Crypto payments)
 * @param token - Access token from URL parameter
 * @returns Promise with validation result
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenData> {
  try {
    const response = await fetch(
      `${API_URL}/api/payment/verify?token=${encodeURIComponent(token)}`
    );

    if (!response.ok) {
      return { valid: false, reason: 'Verification failed' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false, reason: 'Network error' };
  }
}

/**
 * Get access token from URL parameters
 * @returns Access token string or null
 */
export function getAccessTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('access');
}

/**
 * Check if URL indicates Content.Money payment (no token needed)
 * Content.Money handles payment processing on their backend and redirects
 * users to clean unlock URLs (e.g., /post/18283838383) after successful payment.
 * The unlock URL itself serves as proof of payment since Content.Money only
 * shares it with paying customers.
 * @returns boolean
 */
export function isContentMoneyAccess(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Content.Money: Clean URLs like /post/18283838383 (no access parameter)
  // Card2Crypto: URLs with token like /post/18283838383?access=abc123xyz
  const urlParams = new URLSearchParams(window.location.search);
  const hasAccessParam = urlParams.has('access');
  
  // If no access parameter present, assume Content.Money payment
  // (they redirect to clean URLs after successful payment)
  return !hasAccessParam;
}

/**
 * Check if user has access to specific collection
 * Supports both Card2Crypto (token-based) and Content.Money (direct access)
 * @param collectionId - ID of the collection to check
 * @returns Promise<boolean>
 */
export async function hasAccessToCollection(collectionId: string): Promise<boolean> {
  // Content.Money: Direct access via URL (no token needed)
  // Content.Money handles access control by only sharing unlock URLs with paying customers
  if (isContentMoneyAccess()) {
    // Grant access - they reached this page via Content.Money payment
    return true;
  }

  // Card2Crypto: Token-based verification required
  const token = getAccessTokenFromUrl();
  
  if (!token) {
    // No token and not Content.Money access - deny
    return false;
  }

  const verification = await verifyAccessToken(token);
  
  if (!verification.valid) {
    return false;
  }

  // Check if token grants access to this collection
  // 'all' means access to all collections
  if (verification.collectionId === 'all') {
    return true;
  }

  return verification.collectionId === collectionId;
}

/**
 * Check if user has access to all collections
 * @returns Promise<boolean>
 */
export async function hasAccessToAllCollections(): Promise<boolean> {
  // Content.Money: Direct access via URL (no token needed)
  // Content.Money shares the unlock URL only with paying customers
  if (isContentMoneyAccess()) {
    // Grant access - they reached this page via Content.Money payment
    // The specific URL path serves as proof of payment
    const path = window.location.pathname;
    return path.includes('/collections/7841129295832448');
  }

  // Card2Crypto: Token-based verification required
  const token = getAccessTokenFromUrl();
  
  if (!token) {
    // No token and not Content.Money - deny access
    return false;
  }

  const verification = await verifyAccessToken(token);
  
  return verification.valid && verification.collectionId === 'all';
}

/**
 * Store access token in session storage for persistence
 * @param token - Access token to store
 */
export function storeAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Failed to store access token:', error);
  }
}

/**
 * Retrieve stored access token from session storage
 * @returns Stored token or null
 */
export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return sessionStorage.getItem('access_token');
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return null;
  }
}

/**
 * Clear stored access token
 */
export function clearAccessToken(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem('access_token');
  } catch (error) {
    console.error('Failed to clear access token:', error);
  }
}

/**
 * Get access token from URL or session storage
 * @returns Access token or null
 */
export function getAccessToken(): string | null {
  const urlToken = getAccessTokenFromUrl();
  
  if (urlToken) {
    // Store token from URL for future use
    storeAccessToken(urlToken);
    return urlToken;
  }
  
  // Fallback to stored token
  return getStoredAccessToken();
}

/**
 * Check if user has any form of access (token or Content.Money)
 * @returns boolean
 */
export function hasAnyAccess(): boolean {
  return isContentMoneyAccess() || !!getAccessToken();
}
