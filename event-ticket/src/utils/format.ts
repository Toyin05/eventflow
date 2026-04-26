export function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatTime(iso: string, time?: string) {
  if (time) return time;
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}
