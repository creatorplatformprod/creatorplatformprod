/**
 * Shared relative time formatter
 * Converts timestamps to human-readable "time ago" strings
 */

export interface RelativeTimeOptions {
  /** Whether to show "ago" suffix */
  showSuffix?: boolean;
  /** Whether to use short format (1h vs 1 hour) */
  short?: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a timestamp to a relative time string
 * @param timestamp - Date, number (ms since epoch), or ISO string
 * @param options - Formatting options
 * @returns Relative time string like "5 minutes ago" or "2 days ago"
 */
export function formatRelativeTime(
  timestamp: Date | number | string,
  options: RelativeTimeOptions = {}
): string {
  const { showSuffix = true, short = false } = options;
  
  let date: Date;
  
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return 'Recently';
  }
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Recently';
  }
  
  const now = Date.now();
  const diff = now - date.getTime();
  
  // Handle future dates
  if (diff < 0) {
    return short ? 'now' : 'just now';
  }
  
  const suffix = showSuffix ? ' ago' : '';
  
  if (diff < MINUTE) {
    return short ? 'now' : 'just now';
  }
  
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    if (short) return `${minutes}m${suffix}`;
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}${suffix}`;
  }
  
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    if (short) return `${hours}h${suffix}`;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}${suffix}`;
  }
  
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    if (short) return `${days}d${suffix}`;
    return `${days} ${days === 1 ? 'day' : 'days'}${suffix}`;
  }
  
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    if (short) return `${weeks}w${suffix}`;
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}${suffix}`;
  }
  
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    if (short) return `${months}mo${suffix}`;
    return `${months} ${months === 1 ? 'month' : 'months'}${suffix}`;
  }
  
  const years = Math.floor(diff / YEAR);
  if (short) return `${years}y${suffix}`;
  return `${years} ${years === 1 ? 'year' : 'years'}${suffix}`;
}

/**
 * Generate a timestamp from hoursAgo/daysAgo helper
 * @param hoursAgo - Number of hours ago (optional)
 * @param daysAgo - Number of days ago (optional) 
 * @returns Timestamp in milliseconds
 */
export function getTimestampFromAgo(hoursAgo?: number, daysAgo?: number): number {
  const now = Date.now();
  
  if (typeof hoursAgo === 'number') {
    return now - (hoursAgo * HOUR);
  }
  
  if (typeof daysAgo === 'number') {
    return now - (daysAgo * DAY);
  }
  
  return now;
}

/**
 * Hook helper to trigger re-render every minute for live updates
 * Use with React's useEffect and useState
 */
export function createLiveTimeInterval(callback: () => void): number {
  return window.setInterval(callback, MINUTE);
}

export default formatRelativeTime;
