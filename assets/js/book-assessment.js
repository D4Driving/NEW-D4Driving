// Pure helpers for book-assessment.html. Kept separate so Vitest can test them.

export function groupByDate(slots) {
  const days = new Map();
  for (const slot of slots) {
    if (!days.has(slot.date)) days.set(slot.date, []);
    days.get(slot.date).push(slot);
  }
  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, list]) => ({ date, slots: list }));
}

// Up to `max` times spread evenly across the day, so nobody faces a wall of buttons.
export function pickSpread(times, max = 6) {
  if (times.length <= max) return times;
  const step = (times.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => times[Math.round(i * step)]);
}

export function formatTime(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function formatDay(date) {
  const d = new Date(`${date}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long' }).format(d);
  const rest = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(d);
  return `${weekday} ${rest}`;
}

const MESSAGES = {
  slot_taken: 'That time has just gone. Please choose another.',
  rate_limited: 'Too many attempts from this connection. Please try again in an hour, or message Robert on WhatsApp.',
  diary_unavailable: "We can't check the diary just now. Please try again shortly, or message Robert on WhatsApp.",
  checkout_unavailable: "We couldn't start the payment page, and you haven't been charged. Please try again shortly.",
};

export function messageFor(code) {
  return MESSAGES[code] ?? 'Something went wrong. Please try again, or message Robert on WhatsApp.';
}

const FIELD_MESSAGES = {
  name: 'Please enter your name.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a UK mobile number, starting 07.',
  pickup: 'Please enter your pickup address.',
  terms: 'Please tick this box to continue.',
};

export function fieldMessage(field) {
  return FIELD_MESSAGES[field] ?? 'Please check this.';
}
