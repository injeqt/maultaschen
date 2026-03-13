export type Meal = {
  category: string;
  meal: string;
  description: string;
};

export type UpcomingDay = {
  date: string;
  matches: Meal[];
};

export type StatusPayload = {
  generatedAt: string;
  canteen: string;
  today: string;
  todayHasMenu: boolean;
  hasMaultaschenToday: boolean;
  matchingMealsToday: Meal[];
  nextMaultaschenDate: string | null;
  upcomingMaultaschenDays: UpcomingDay[];
};

export type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: StatusPayload };

export type StatusTone = "positive" | "negative" | "neutral";

export type StatusViewModel = {
  tone: StatusTone;
  answer: string;
  headline: string;
  copy: string;
  matches: Meal[];
  nextDate: string | null;
  upcoming: UpcomingDay[];
  updatedAt: string;
};
