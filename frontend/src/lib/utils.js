import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or object to IST (Indian Standard Time)
 * @param {string|Date|object} enquiry - The enquiry object or date string
 * @returns {string} Formatted date string
 */
export function formatEnquiryDate(enquiry) {
  if (!enquiry) return 'Time not available';

  const createdAt = typeof enquiry === 'object' ? enquiry.createdAt : enquiry;
  const id = typeof enquiry === 'object' ? enquiry._id : null;

  let date;
  if (createdAt) {
    date = new Date(createdAt);
  } else if (id && id.length >= 8) {
    // Fallback to ObjectId timestamp
    date = new Date(parseInt(id.substring(0, 8), 16) * 1000);
  }

  if (!date || isNaN(date.getTime())) {
    return 'Time not available';
  }

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', ' •').toUpperCase();
}
