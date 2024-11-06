<script lang="ts">
  import dayjs from "dayjs";
  import { Notice } from "obsidian";
  import { Select, Typography } from "obsidian-svelte";
  import { createDataRecord } from "src/lib/dataApi";
  import {
    DataFieldType,
    type DataFrame,
    type DataRecord,
  } from "src/lib/dataframe/dataframe";
  import { updateRecordValues } from "src/lib/datasources/helpers";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import type { ViewApi } from "src/lib/viewApi";
  import type { ProjectDefinition } from "src/settings/settings";
  import { Field } from "src/ui/components/Field";
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/ui/components/Layout";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  import { EditNoteModal } from "src/ui/modals/editNoteModal";
  import {
    fieldToSelectableValue,
    getRecordColorContext,
  } from "src/ui/views/helpers";
  import { get } from "svelte/store";
  import {
    addInterval,
    chunkDates,
    computeDateInterval,
    generateDates,
    generateTitle,
    getFirstDayOfWeek,
    groupRecordsByField,
    isCalendarInterval,
    subtractInterval,
  } from "./calendar";
  import Calendar from "./components/Calendar/Calendar.svelte";
  import Day from "./components/Calendar/Day.svelte";
  import Week from "./components/Calendar/Week.svelte";
  import WeekHeader from "./components/Calendar/WeekHeader.svelte";
  import Weekday from "./components/Calendar/Weekday.svelte";
  import Navigation from "./components/Navigation/Navigation.svelte";
  import type { CalendarConfig } from "./types";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;
  export let config: CalendarConfig | undefined;
  export let onConfigChange: (cfg: CalendarConfig) => void;

  function saveConfig(cfg: CalendarConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  $: ({ fields, records } = frame);

  let anchorDate: dayjs.Dayjs = dayjs();

  $: dateFields = fields
    .filter((field) => !field.repeated)
    .filter((field) => field.type === DataFieldType.Date);
  $: dateField =
    dateFields.find((field) => config?.dateField === field.name) ??
    dateFields[0];

  $: booleanFields = fields
    .filter((field) => !field.repeated)
    .filter((field) => field.type === DataFieldType.Boolean);
  $: booleanField = fields.find((field) => config?.checkField === field.name);

  $: interval = config?.interval ?? "week";

  $: firstDayOfWeek = getFirstDayOfWeek(
    $settings.preferences.locale.firstDayOfWeek
  );

  $: dateInterval = computeDateInterval(anchorDate, interval, firstDayOfWeek);

  $: groupedRecords = dateField
    ? groupRecordsByField(records, dateField.name)
    : {};
  $: title = dateInterval ? generateTitle(dateInterval) : "";
  $: dates = dateInterval ? generateDates(dateInterval) : [];

  $: numColumns = Math.min(dates.length, 7);
  $: weeks = chunkDates(dates, numColumns);
  $: weekDays = dates.slice(0, numColumns);

  function handleIntervalChange(interval: string) {
    if (isCalendarInterval(interval)) {
      saveConfig({ ...config, interval });
    }
  }
  function handleDateFieldChange(dateField: string) {
    saveConfig({ ...config, dateField });
  }
  function handleCheckFieldChange(checkField: string) {
    saveConfig({ ...config, checkField });
  }

  function handleRecordChange(date: dayjs.Dayjs, record: DataRecord) {
    if (dateField) {
      if (dateField.type === DataFieldType.Date) {
        const newDatetime = dayjs(record.values[dateField.name] as string)
          .set("year", date.year())
          .set("month", date.month())
          .set("date", date.date());
        api.updateRecord(
          updateRecordValues(record, {
            [dateField.name]: newDatetime.format(
              dateField.typeConfig?.time ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"
            ),
          }),
          fields
        );
      }
    }
  }

  function handleRecordCheck(record: DataRecord, checked: boolean) {
    if (booleanField) {
      api.updateRecord(
        updateRecordValues(record, {
          [booleanField.name]: checked,
        }),
        fields
      );
    }
  }

  function handleRecordClick(entry: DataRecord) {
    if (entry) {
      new EditNoteModal(
        get(app),
        fields,
        (record) => {
          api.updateRecord(record, fields);
        },
        entry
      ).open();
    }
  }

  function handleRecordAdd(date: dayjs.Dayjs) {
    if (!dateField) {
      new Notice("Select a Date field to create calendar events.");
      return;
    }

    if (readonly) {
      new Notice("Can't create calendar events in read-only projects.");
      return;
    }

    new CreateNoteModal($app, project, (name, templatePath) => {
      if (dateField) {
        api.addRecord(
          createDataRecord(name, project, {
            [dateField.name]: date.toDate(),
          }),
          fields,
          templatePath
        );
      }
    }).open();
  }

  getRecordColorContext.set(getRecordColor);
</script>

<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <Navigation
        slot="left"
        onNext={() => (anchorDate = addInterval(anchorDate, interval))}
        onPrevious={() => (anchorDate = subtractInterval(anchorDate, interval))}
        onToday={() => (anchorDate = dayjs())}
      />
      <Typography slot="middle" variant="h2" nomargin>{title}</Typography>
      <svelte:fragment slot="right">
        <Field name={$i18n.t("views.calendar.fields.date")}>
          <Select
            value={dateField?.name ?? ""}
            options={dateFields.map(fieldToSelectableValue)}
            placeholder={$i18n.t("views.calendar.fields.none") ?? ""}
            on:change={({ detail }) => handleDateFieldChange(detail)}
          />
        </Field>
        <Field name={$i18n.t("views.calendar.fields.check")}>
          <Select
            allowEmpty
            value={booleanField?.name ?? ""}
            options={booleanFields.map(fieldToSelectableValue)}
            placeholder={$i18n.t("views.calendar.fields.none") ?? ""}
            on:change={({ detail }) => handleCheckFieldChange(detail)}
          />
        </Field>
        <Select
          value={config?.interval ?? "week"}
          options={[
            {
              label: $i18n.t("views.calendar.intervals.month", {
                count: 1,
              }),
              value: "month",
            },
            {
              label: $i18n.t("views.calendar.intervals.weekWithCount", {
                count: 2,
              }),
              value: "2weeks",
            },
            {
              label: $i18n.t("views.calendar.intervals.week", {
                count: 1,
              }),
              value: "week",
            },
            {
              label: $i18n.t("views.calendar.intervals.dayWithCount", {
                count: 3,
              }),
              value: "3days",
            },
            {
              label: $i18n.t("views.calendar.intervals.day", {
                count: 1,
              }),
              value: "day",
            },
          ]}
          on:change={({ detail }) => handleIntervalChange(detail)}
        />
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    <Calendar>
      <WeekHeader>
        {#each weekDays as weekDay}
          <Weekday
            width={100 / weekDays.length}
            weekend={weekDay.day() === 0 || weekDay.day() === 6}
          >
            {$i18n.t("views.calendar.weekday", {
              value: weekDay.toDate(),
              formatParams: {
                value: { weekday: "short" },
              },
            })}
          </Weekday>
        {/each}
      </WeekHeader>
      {#each weeks as week}
        <Week height={100 / weeks.length}>
          {#each week as date}
            <Day
              width={100 / week.length}
              {date}
              checkField={booleanField?.name}
              records={groupedRecords[date.format("YYYY-MM-DD")] || []}
              onRecordClick={handleRecordClick}
              onRecordChange={(record) => {
                handleRecordChange(date, record);
              }}
              onRecordCheck={(record, checked) => {
                handleRecordCheck(record, checked);
              }}
              onRecordAdd={() => {
                handleRecordAdd(date);
              }}
            />
          {/each}
        </Week>
      {/each}
    </Calendar>
  </ViewContent>
</ViewLayout>
