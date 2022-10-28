import type { CalendarInterval } from "./calendar";

export interface CalendarConfig {
  readonly interval?: CalendarInterval;
  readonly dateField?: string;
  readonly checkField?: string;
}
