import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateString: string, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, formatStr);
  } catch (error) {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  try {
    // Handle time in format HH:mm or HH:mm:ss
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    if (isNaN(hours)) return timeString;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${minutes} ${period}`;
  } catch (error) {
    return timeString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  try {
    const date = parseISO(dateTimeString);
    if (!isValid(date)) return dateTimeString;
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return dateTimeString;
  }
}

export function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
