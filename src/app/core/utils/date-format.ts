// utils/date-utils.ts
/**
 * Utility functions for date formatting with Firestore Timestamp support
 */

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
}

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export function firestoreTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;

  try {
    // If it has a toDate method (actual Firestore Timestamp)
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }

    // If it's a plain object with seconds and nanoseconds
    if (timestamp.seconds !== undefined) {
      return new Date(timestamp.seconds * 1000);
    }

    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp;
    }

    // If it's a string, try to parse it
    if (typeof timestamp === 'string') {
      // Handle Firestore string format: "June 28, 2025 at 1:43:33 AM UTC+1"
      if (timestamp.includes(' at ')) {
        const cleanedDate = timestamp
          .replace(' at ', ' ')
          .replace(/UTC[+-]\d+/, '')
          .trim();
        return new Date(cleanedDate);
      }
      return new Date(timestamp);
    }

    return null;
  } catch (error) {
    console.error('Error converting timestamp:', timestamp, error);
    return null;
  }
}

/**
 * Format any date input (Firestore Timestamp, Date, or string) to common formats
 */
export function formatDate(
  dateInput: any,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  if (!dateInput) return '-';

  const date = firestoreTimestampToDate(dateInput);

  if (!date || isNaN(date.getTime())) {
    return '-';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const dayOfWeek = date.getDay();

  switch (format) {
    case 'short':
      // 1/15/25
      return `${month + 1}/${day}/${year.toString().slice(-2)}`;
    
    case 'medium':
      // Jan 15, 2025
      return `${months[month]} ${day}, ${year}`;
    
    case 'long':
      // January 15, 2025 3:30 PM
      return `${fullMonths[month]} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    
    case 'full':
      // Monday, January 15, 2025 at 3:30 PM
      return `${fullDays[dayOfWeek]}, ${fullMonths[month]} ${day}, ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
    
    default:
      return `${months[month]} ${day}, ${year}`;
  }
}

/**
 * Custom date formatter with specific pattern
 * Supported patterns:
 * - yyyy: 4-digit year (2025)
 * - yy: 2-digit year (25)
 * - MMMM: Full month name (January)
 * - MMM: Short month name (Jan)
 * - MM: 2-digit month (01)
 * - M: Month (1)
 * - dd: 2-digit day (05)
 * - d: Day (5)
 * - EEEE: Full day name (Monday)
 * - EEE: Short day name (Mon)
 * - HH: 24-hour format (13)
 * - H: 24-hour format (1)
 * - hh: 12-hour format (01)
 * - h: 12-hour format (1)
 * - mm: Minutes (05)
 * - m: Minutes (5)
 * - ss: Seconds (09)
 * - s: Seconds (9)
 * - a: AM/PM
 */
export function formatDateCustom(
  dateInput: any,
  pattern: string = 'MMM dd, yyyy'
): string {
  if (!dateInput) return '-';

  const date = firestoreTimestampToDate(dateInput);

  if (!date || isNaN(date.getTime())) {
    return '-';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const replacements: { [key: string]: string } = {
    'yyyy': date.getFullYear().toString(),
    'yy': date.getFullYear().toString().slice(-2),
    'MMMM': fullMonths[date.getMonth()],
    'MMM': months[date.getMonth()],
    'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
    'M': (date.getMonth() + 1).toString(),
    'dd': date.getDate().toString().padStart(2, '0'),
    'd': date.getDate().toString(),
    'EEEE': fullDays[date.getDay()],
    'EEE': days[date.getDay()],
    'HH': date.getHours().toString().padStart(2, '0'),
    'H': date.getHours().toString(),
    'hh': (date.getHours() % 12 || 12).toString().padStart(2, '0'),
    'h': (date.getHours() % 12 || 12).toString(),
    'mm': date.getMinutes().toString().padStart(2, '0'),
    'm': date.getMinutes().toString(),
    'ss': date.getSeconds().toString().padStart(2, '0'),
    's': date.getSeconds().toString(),
    'a': date.getHours() >= 12 ? 'PM' : 'AM'
  };

  let result = pattern;
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    result = result.replace(new RegExp(key, 'g'), replacements[key]);
  }

  return result;
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(dateInput: any): string {
  if (!dateInput) return '-';

  const date = firestoreTimestampToDate(dateInput);
  if (!date || isNaN(date.getTime())) return '-';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

