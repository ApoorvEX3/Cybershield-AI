/**
 * helpers.js — Small utility functions used across components.
 */

/** Format an ISO timestamp to a readable local string. */
export function formatTimestamp(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Return a CSS class name for a severity level. */
export function severityClass(severity) {
  const map = {
    Low: 'low',
    Medium: 'medium',
    High: 'high',
    Critical: 'critical',
  };
  return map[severity] || 'medium';
}

/** Truncate text to a maximum length. */
export function truncate(text, max = 80) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}
