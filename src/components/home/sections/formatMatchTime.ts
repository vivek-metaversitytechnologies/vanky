const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMatchTime(openDate?: string) {
  if (!openDate) {
    return "";
  }

  const match = String(openDate)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/);

  if (!match) {
    return openDate;
  }

  const [, , month, day, time] = match;
  const monthIndex = Number(month) - 1;
  const monthLabel = MONTHS[monthIndex];

  if (!monthLabel) {
    return openDate;
  }

  return `${day} ${monthLabel} ${time}`;
}