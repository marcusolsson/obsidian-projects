import { get } from "svelte/store";
import { Temporal } from "temporal-polyfill";

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
  // scroll interaction
  date: Temporal.PlainDate,
  interval: CalendarInterval
): Temporal.PlainDate {
  switch (interval) {
    case "month":
      return date.add({ months: 1 });
    case "2weeks":
      return date.add({ weeks: 2 });
    case "week":
      return date.add({ weeks: 1 });
    case "3days":
      return date.add({ days: 1 });
    case "day":
      return date.add({ days: 1 });
  }
}

export function subtractInterval(
  // scroll interaction
  date: Temporal.PlainDate,
  interval: CalendarInterval
): Temporal.PlainDate {
  switch (interval) {
    case "month":
      return date.subtract({ months: 1 });
    case "2weeks":
      return date.subtract({ weeks: 2 });
    case "week":
      return date.subtract({ weeks: 1 });
    case "3days":
      return date.subtract({ days: 1 });
    case "day":
      return date.subtract({ days: 1 });
  }
}

export function groupRecordsByField(
  records: DataRecord[],
  field: string
): Record<string, DataRecord[]> {
  const res: Record<string, DataRecord[]> = {};

  records.forEach((record) => {
    const dateValue = record.values[field];

    const start = dateValue ? (isDate(dateValue) ? dateValue : null) : null;

    if (start) {
      const dateStr = start
        .withTimeZone(Temporal.Now.timeZoneId())
        .toPlainDate()
        .toString();
      if (!(dateStr in res)) {
        res[dateStr] = [];
      }

      res[dateStr]?.push(record);
    }
  });

  return res;
}

export function computeDateInterval(
  anchor: Temporal.PlainDate,
  interval: CalendarInterval,
  firstDayOfWeek: number
): [Temporal.PlainDate, Temporal.PlainDate] {
  const sow = startOfWeek(anchor, firstDayOfWeek);
  const eow = endOfWeek(anchor, firstDayOfWeek);
  switch (interval) {
    case "month":
      return [
        startOfWeek(anchor.with({ day: 1 }), firstDayOfWeek),
        endOfWeek(anchor.with({ day: anchor.daysInMonth }), firstDayOfWeek),
      ];
    case "2weeks":
      return [sow, eow.add({ weeks: 1 })];
    case "week":
      return [sow, eow];
    case "3days":
      return [anchor, anchor.add({ days: 2 })];
    case "day":
      return [anchor, anchor];
  }
}

export function generateTitle(
  dateInterval: [Temporal.PlainDate, Temporal.PlainDate]
) {
  if (dateInterval[0].equals(dateInterval[1])) {
    return get(i18n).t("views.calendar.date", {
      value: new Date(
        dateInterval[0].toZonedDateTime(
          Temporal.Now.timeZoneId()
        ).epochMilliseconds
      ),
      formatParams: {
        value: { year: "numeric", month: "long", day: "numeric" },
      },
    });
  }

  if (dateInterval[0].year === dateInterval[1].year) {
    return get(i18n).t("views.calendar.interval", {
      from: new Date(
        dateInterval[0].toZonedDateTime(
          Temporal.Now.timeZoneId()
        ).epochMilliseconds
      ),
      to: new Date(
        dateInterval[1].toZonedDateTime(
          Temporal.Now.timeZoneId()
        ).epochMilliseconds
      ),
      en_separator: ", ",
      custom_year: new Date(
        dateInterval[0].toZonedDateTime(
          Temporal.Now.timeZoneId()
        ).epochMilliseconds
      ),
      formatParams: {
        from: { month: "short", day: "numeric" },
        to: { month: "short", day: "numeric" },
        custom_year: { year: "numeric" },
      },
    });
  }

  return get(i18n).t("views.calendar.interval", {
    from: new Date(
      dateInterval[0].toZonedDateTime(
        Temporal.Now.timeZoneId()
      ).epochMilliseconds
    ),
    to: new Date(
      dateInterval[1].toZonedDateTime(
        Temporal.Now.timeZoneId()
      ).epochMilliseconds
    ),
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
  dateInterval: [Temporal.PlainDate, Temporal.PlainDate]
): Temporal.PlainDate[] {
  const dates: Temporal.PlainDate[] = [];

  const numDays = dateInterval[0].until(dateInterval[1]).days;

  for (let i = 0; i <= numDays; i++) {
    dates.push(dateInterval[0].add({ days: i }));
  }

  return dates;
}

export function chunkDates(
  dates: Temporal.PlainDate[],
  chunks: number
): Temporal.PlainDate[][] {
  const chunkedDates: Temporal.PlainDate[][] = [];

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

export function startOfWeek(
  date: Temporal.PlainDate,
  firstDayOfWeek: number
): Temporal.PlainDate {
  const offset = (7 + date.dayOfWeek - firstDayOfWeek) % 7;
  return date.subtract({ days: offset });
}

export function endOfWeek(
  date: Temporal.PlainDate,
  firstDayOfWeek: number
): Temporal.PlainDate {
  const offset = (firstDayOfWeek + 6 - date.dayOfWeek) % 7;
  return date.add({ days: offset });
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
    case "default": {
      const obLocale = getLocale("obsidian");
      if (obLocale.weekInfo) {
        return obLocale.weekInfo.firstDay ?? 0;
      }
      if (typeof obLocale.getWeekInfo === "function") {
        return obLocale.getWeekInfo().firstDay ?? 0;
      }
      return 0;
    }
  }
}
