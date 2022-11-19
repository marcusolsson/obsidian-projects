import type { CalendarInterval } from "../Calendar/calendar";
export interface TimelineConfig {
  readonly startDateField: string;
	readonly endDateField: string;
	readonly interval: CalendarInterval;
}