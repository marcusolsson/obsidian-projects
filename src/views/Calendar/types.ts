import type { CalendarInterval } from "./calendar";

export interface CalendarConfig {
	interval?: CalendarInterval;
	dateField?: string;
	checkField?: string;
}
