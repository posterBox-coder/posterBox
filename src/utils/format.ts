import type { Location } from '@/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

const nairaFormatter = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

const pad = (value: number) => value.toString().padStart(2, '0');

export const toKobo = (naira: number) => Math.round(naira * 100);

export const formatNaira = (kobo: number) => `₦${nairaFormatter.format(Math.round(kobo / 100))}`;

/** Parses ISO strings; date-only values (YYYY-MM-DD) are read as local dates so they never shift a day. */
export function parseDate(iso: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }
  return new Date(iso);
}

export const toISODate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function formatDate(iso: string) {
  const date = parseDate(iso);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** "10.Aug.2026" */
export function formatTimelineDate(iso: string) {
  const date = parseDate(iso);
  return `${pad(date.getDate())}.${MONTHS[date.getMonth()]}.${date.getFullYear()}`;
}

/** "01:20pm" */
export function formatTime(iso: string) {
  const date = parseDate(iso);
  const hours = date.getHours() % 12 || 12;
  return `${pad(hours)}:${pad(date.getMinutes())}${date.getHours() < 12 ? 'am' : 'pm'}`;
}

export function formatDayBadge(iso: string) {
  const date = parseDate(iso);
  return { day: pad(date.getDate()), month: MONTHS[date.getMonth()] };
}

export function daysBetween(fromIso: string, toIso: string) {
  return Math.max(1, Math.round((parseDate(toIso).getTime() - parseDate(fromIso).getTime()) / DAY_MS) + 1);
}

export const formatDays = (days: number) => `${days} ${days === 1 ? 'day' : 'days'}`;

export const formatDateRange = (fromIso: string, toIso: string) => `${formatDate(fromIso)} – ${formatDate(toIso)}`;

export const formatLocation = (location: Pick<Location, 'city' | 'state'>) => `${location.city}, ${location.state}`;

export const formatPersonLocation = (name: string, location: Pick<Location, 'city' | 'state'>) =>
  `${name} · ${formatLocation(location)}`;

export const formatWeightRange = ([min, max]: readonly [number, number]) => `${min.toFixed(1)} – ${max.toFixed(1)}kg`;

export function toE164(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) {
    return `+${digits}`;
  }
  return `+234${digits.replace(/^0/, '')}`;
}

/** "+2348031234567" → "0803 123 4567" */
export function formatPhone(e164: string) {
  const local = e164.replace(/^\+234/, '0');
  return local.replace(/^(\d{4})(\d{3})(\d+)$/, '$1 $2 $3');
}

export const maskAccountNumber = (accountNumber: string) => `•••• ${accountNumber.slice(-4)}`;

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
