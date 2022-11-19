import type dayjs from "dayjs";
import type { CalendarInterval } from "../Calendar/calendar";

export function computeHours(anchor: dayjs.Dayjs): [dayjs.Dayjs, dayjs.Dayjs] {
	return [anchor.startOf("day"), anchor.endOf("day")]
}

export function computeDateInterval(
  anchor: dayjs.Dayjs,
  interval: CalendarInterval
): [dayjs.Dayjs, dayjs.Dayjs] {
  switch (interval) {
    case "month":
      return [
        anchor.startOf("month").startOf("month"),
        anchor.endOf("month").endOf("month"),
      ];
    case "2weeks":
      return [
        anchor.startOf("isoWeek"),
        anchor.add(1, "week").endOf("isoWeek"),
      ];
    case "week":
      return [anchor.startOf("isoWeek"), anchor.endOf("isoWeek")];
    case "3days":
      return [anchor, anchor.add(2, "days")];
    case "day":
      return [anchor, anchor];
  }
}

export function generateHours(
  dateInterval: [dayjs.Dayjs, dayjs.Dayjs]
): dayjs.Dayjs[] {
  const dates: dayjs.Dayjs[] = [];

  const numHours = dateInterval[1].diff(dateInterval[0], "hour");

  for (let i = 0; i <= numHours; i++) {
    dates.push(dateInterval[0].add(i, "hour"));
  }
	// console.log("datesyssss", dates)
  return dates;
}