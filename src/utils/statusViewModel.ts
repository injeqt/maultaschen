import type { LoadState, StatusPayload, StatusViewModel, UpcomingDay } from "../types/status";
import { formatCalendarDate, formatTimestamp } from "./format";

const LOADING_VIEW_MODEL: StatusViewModel = {
  tone: "neutral",
  answer: "…",
  headline: "Speiseplan wird geladen",
  copy: "Einen Moment bitte.",
  matches: [],
  nextDate: null,
  upcoming: [],
  updatedAt: "wird geladen ...",
};

function buildReadyViewModel(data: StatusPayload): StatusViewModel {
  const futureDays = data.upcomingMaultaschenDays.filter(
    (entry) => entry.date > data.today,
  );

  const common = {
    updatedAt: formatTimestamp(data.generatedAt),
  };

  if (!data.todayHasMenu) {
    return {
      ...common,
      tone: "neutral",
      answer: "?",
      headline: `Für ${formatCalendarDate(data.today)} gibt es keinen Speiseplan.`,
      copy: "Die Kantine hat heute vermutlich nicht geöffnet",
      matches: [],
      nextDate: data.upcomingMaultaschenDays[0]?.date ?? null,
      upcoming: data.upcomingMaultaschenDays,
    };
  }

  if (data.hasMaultaschenToday) {
    return {
      ...common,
      tone: "positive",
      answer: "JA",
      headline: "Heute gibt es Maultaschen.",
      copy: `Für ${formatCalendarDate(data.today)} wurden passende Gerichte in ${data.canteen} gefunden.`,
      matches: data.matchingMealsToday,
      nextDate: futureDays[0]?.date ?? null,
      upcoming: futureDays,
    };
  }

  return {
    ...common,
    tone: "negative",
    answer: "NEIN",
    headline: "Heute gibt es keine Maultaschen.",
    copy: data.nextMaultaschenDate
      ? `Der nächste bekannte Maultaschen-Tag ist ${formatCalendarDate(data.nextMaultaschenDate)}.`
      : "In den geladenen Tagen wurde kein weiterer Treffer gefunden.",
    matches: [],
    nextDate: data.nextMaultaschenDate,
    upcoming: futureDays,
  };
}

function buildErrorViewModel(message: string): StatusViewModel {
  return {
    tone: "neutral",
    answer: "!",
    headline: "Die Seite konnte die Daten nicht laden.",
    copy: message,
    matches: [],
    nextDate: null,
    upcoming: [],
    updatedAt: "unbekannt",
  };
}

export function getUpcomingPreview(upcoming: UpcomingDay[]): UpcomingDay[] {
  return upcoming.slice(0, 3);
}

export function buildStatusViewModel(state: LoadState): StatusViewModel {
  switch (state.kind) {
    case "loading":
      return LOADING_VIEW_MODEL;
    case "error":
      return buildErrorViewModel(state.message);
    case "ready":
      return buildReadyViewModel(state.data);
  }
}
