import type { CalendarInterval, CalendarWeekStart } from "./calendar";

export interface CalendarConfig {
  readonly interval?: CalendarInterval;
  readonly dateField?: string;
  readonly checkField?: string;
  readonly weekStart?: CalendarWeekStart;
}
