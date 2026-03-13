import type { Meal } from "../types/status";

const longDateFormatter = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timestampFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCalendarDate(dateText: string): string {
  return longDateFormatter.format(new Date(`${dateText}T12:00:00`));
}

export function formatShortDate(dateText: string): string {
  return shortDateFormatter.format(new Date(`${dateText}T12:00:00`));
}

export function formatTimestamp(timestampText: string): string {
  return timestampFormatter.format(new Date(timestampText));
}

export function mealLabel(meal: Meal): string {
  return meal.description ? `${meal.meal} - ${meal.description}` : meal.meal;
}
