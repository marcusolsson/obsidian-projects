import type dayjs from "dayjs";

export function computeHours(anchor: dayjs.Dayjs): [dayjs.Dayjs, dayjs.Dayjs] {
	return [anchor.startOf("day"), anchor.endOf("day")]
}

export function generateHours(
  dateInterval: [dayjs.Dayjs, dayjs.Dayjs]
): dayjs.Dayjs[] {
  const dates: dayjs.Dayjs[] = [];

  const numHours = dateInterval[1].diff(dateInterval[0], "hour");

  for (let i = 0; i <= numHours; i++) {
    dates.push(dateInterval[0].add(i, "hour"));
  }
	console.log("datesyssss", dates)
  return dates;
}