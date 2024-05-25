import dayjs from "dayjs";
import { get } from "svelte/store";

import { isDate, type DataRecord } from "src/lib/dataframe/dataframe";
import { i18n } from "src/lib/stores/i18n";
import type { FirstDayOfWeek } from "src/settings/settings";
import moment from "moment";

export type CalendarInterval = "month" | "2weeks" | "week" | "3days" | "day";

export function isCalendarInterval(value: string): value is CalendarInterval {
  switch (value) {
    case "month":
    case "2weeks":
    case "week":
    case "3days":
    case "day":
      return true;
    default:
      return false;
  }
}

export function addInterval(
  date: dayjs.Dayjs,
  interval: CalendarInterval
): dayjs.Dayjs {
  switch (interval) {
    case "month":
      return date.add(1, "month");
    case "2weeks":
      return date.add(2, "week");
    case "week":
      return date.add(1, "week");
    case "3days":
      return date.add(1, "day");
    case "day":
      return date.add(1, "day");
  }
}

export function subtractInterval(
  date: dayjs.Dayjs,
  interval: CalendarInterval
): dayjs.Dayjs {
  switch (interval) {
    case "month":
      return date.subtract(1, "month");
    case "2weeks":
      return date.subtract(2, "week");
    case "week":
      return date.subtract(1, "week");
    case "3days":
      return date.subtract(1, "day");
    case "day":
      return date.subtract(1, "day");
  }
}

export function groupRecordsByField(
  records: DataRecord[],
  field: string
): Record<string, DataRecord[]> {
  const res: Record<string, DataRecord[]> = {};

  records.forEach((record) => {
    const dateValue = record.values[field];

    const start = dateValue
      ? isDate(dateValue)
        ? dayjs(dateValue)
        : null
      : null;

    if (start) {
      const dateStr = start.format("YYYY-MM-DD");
      if (!(dateStr in res)) {
        res[dateStr] = [];
      }

      res[dateStr]?.push(record);
    }
  });

  return res;
}

export function computeDateInterval(
  anchor: dayjs.Dayjs,
  interval: CalendarInterval,
  firstDayOfWeek: number
): [dayjs.Dayjs, dayjs.Dayjs] {
  let sow = anchor.startOf("isoWeek");
  let eow = anchor.endOf("isoWeek");

  const offset = weekdayOffset(sow, firstDayOfWeek);

  sow = sow.subtract(offset, "days");
  eow = eow.subtract(offset, "days");

  switch (interval) {
    case "month":
      return [
        anchor.startOf("month").startOf("week"),
        anchor.endOf("month").endOf("week"),
      ];
    case "2weeks":
      return [sow, eow.add(1, "week")];
    case "week":
      return [sow, eow];
    case "3days":
      return [anchor, anchor.add(2, "days")];
    case "day":
      return [anchor, anchor];
  }
}

export function generateTitle(dateInterval: [dayjs.Dayjs, dayjs.Dayjs]) {
  if (dateInterval[0].startOf("day").isSame(dateInterval[1].startOf("day"))) {
    return get(i18n).t("views.calendar.date", {
      value: dateInterval[0],
      formatParams: {
        value: { year: "numeric", month: "long", day: "numeric" },
      },
    });
  }

  if (dateInterval[0].startOf("year").isSame(dateInterval[1].startOf("year"))) {
    return get(i18n).t("views.calendar.interval", {
      from: dateInterval[0],
      to: dateInterval[1],
      en_separator: ", ",
      custom_year: dateInterval[0],
      formatParams: {
        from: { month: "short", day: "numeric" },
        to: { month: "short", day: "numeric" },
        custom_year: { year: "numeric" },
      },
    });
  }

  return get(i18n).t("views.calendar.interval", {
    from: dateInterval[0],
    to: dateInterval[1],
    en_separator: "",
    custom_year: "",
    formatParams: {
      from: { year: "numeric", month: "short", day: "numeric" },
      to: { year: "numeric", month: "short", day: "numeric" },
      custom_year: { year: false },
    },
  });
}

export function generateDates(
  dateInterval: [dayjs.Dayjs, dayjs.Dayjs]
): dayjs.Dayjs[] {
  const dates: dayjs.Dayjs[] = [];

  const numDays = dateInterval[1].diff(dateInterval[0], "days");

  for (let i = 0; i <= numDays; i++) {
    dates.push(dateInterval[0].add(i, "day"));
  }

  return dates;
}

export function chunkDates(
  dates: dayjs.Dayjs[],
  chunks: number
): dayjs.Dayjs[][] {
  const chunkedDates: dayjs.Dayjs[][] = [];

  let rest = dates;
  while (rest.length) {
    const chunked = take(rest, chunks);

    chunkedDates.push(chunked);

    rest = rest.slice(chunked.length);
  }

  return chunkedDates;
}

function take<T>(arr: Array<T>, num: number): Array<T> {
  const buffer: Array<T> = [];
  for (let i = 0; i < num && i < arr.length; i++) {
    const el = arr[i];

    if (el) {
      buffer.push(el);
    }
  }
  return buffer;
}

export function weekdayOffset(
  date: dayjs.Dayjs,
  firstDayOfWeek: number
): number {
  let offset = date.day() - firstDayOfWeek;

  if (offset < 0) {
    offset += 7;
  }

  return offset;
}

export type LocaleOption = "system" | "obsidian";

export function getLocale(locale: LocaleOption): Intl.Locale {
  if (locale === "system") {
    return new Intl.Locale(navigator?.language || "en");
  }

  const obsidianLanguage =
    localStorage.getItem("language") || moment().locale();

  return new Intl.Locale(obsidianLanguage);
}

export function getFirstDayOfWeek(day: FirstDayOfWeek): number {
  switch (day) {
    case "sunday":
      return 0;
    case "monday":
      return 1;
    case "default":
      return getLocale("obsidian").weekInfo.firstDay;
  }
}
