import { format, formatDistanceStrict, isThisYear } from "date-fns";

export function formatPostDate(date) {
  const formatShort = format(new Date(date), "MMMM d").toUpperCase();

  const formatLong = format(new Date(date), "MMMM d, yyyy").toUpperCase();

  return isThisYear(new Date(date)) ? formatShort : formatLong;
}

export function formatDateToNowShort(date) {
  return formatDistanceStrict(new Date(date), new Date(Date.now()))
    .split(" ")
    .map((s, i) => (i === 1 ? s[0] : s))
    .join("");
}
