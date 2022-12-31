<script lang="ts">
  import dayjs from "dayjs";
  import { Select, Typography } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";

  import { DataFieldType, type DataFrame, type DataValue } from "src/lib/data";
  import type { ProjectDefinition } from "src/types";
  import type { ViewApi } from "src/lib/view-api";

  import Navigation from "../Calendar/components/Navigation/Navigation.svelte";
  import { ViewToolbar } from "src/components/Layout";

  import {
    addInterval,
    generateDates,
    generateTitle,
    isCalendarInterval,
    subtractInterval,
  } from "../Calendar/calendar";

  import { computeDateInterval, computeHours, generateHours } from "./timeline";
  import type { TimelineConfig } from "./types";
  import TimelineBackground from "./components/TimelineBackground.svelte";

  import HorizontalGroup from "src/components/HorizontalGroup/HorizontalGroup.svelte";
  import { Field } from "src/components/Field";
  import { fieldToSelectableValue } from "../helpers";
  import TimelineEntry from "./components/TimelineEntry.svelte";

  import type { Optional } from "src/lib/data";
  import { EditNoteModal } from "src/modals/edit-note-modal";
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;

  export let config: TimelineConfig;

  export let onConfigChange: (cfg: TimelineConfig) => void;

  $: ({ fields, records } = frame);

  $: dateFields = fields.filter((field) => field.type === DataFieldType.Date);
  $: startDateField =
    dateFields.find((field) => config?.startDateField === field.name) ??
    dateFields[0];
  $: endDateField =
    dateFields.find((field) => config?.endDateField === field.name) ??
    dateFields[1] ??
    dateFields[0];

  $: booleanFields = fields.filter(
    (field) => field.type === DataFieldType.Boolean
  );
  $: booleanField = fields.find((field) => config?.checkField === field.name);

  let anchorDate: dayjs.Dayjs = dayjs();
  $: interval = config?.interval ?? "week";
  $: dateInterval =
    interval != "day"
      ? computeDateInterval(anchorDate, interval)
      : computeHours(anchorDate);
  $: title = dateInterval ? generateTitle(dateInterval) : "";
  $: dates = dateInterval
    ? interval == "day"
      ? generateHours(dateInterval)
      : generateDates(dateInterval)
    : [];

  $: _records = records.filter((a) => {
    let startday = dayjs(a.values[startDateField!.name] as Date);
    let endday = dayjs(a.values[endDateField!.name] as Date);
    return (
      startday.isAfter(dateInterval[0]) ||
      startday.isBefore(dateInterval[1]) ||
      endday.isAfter(dateInterval[0]) ||
      endday.isBefore(dateInterval[1])
    );
  });

  function handleIntervalChange(interval: string) {
    if (isCalendarInterval(interval)) {
      onConfigChange({ ...config, interval });
    }
  }
  function handleCheckFieldChange(checkField: string) {
    onConfigChange({ ...config, checkField });
  }
  function handleDateFieldChange(
    dateField: string,
    startOrEnd: "start" | "end"
  ) {
    let name = startOrEnd == "start" ? "startDateField" : "endDateField";
    onConfigChange({ ...config, [name]: dateField });
  }
  function asOptionalBoolean(value: Optional<DataValue>): boolean | null | undefined {
    if (typeof value === "boolean") {
      return value;
    }
    return null;
  }

  let parentwidth: number;
	let thisTarget: HTMLElement;
  let changed = 0;
	onMount(() => {
		const robserver = new ResizeObserver((entries) => {
			changed--
		})
		robserver.observe(thisTarget)
		return () => robserver.unobserve(thisTarget)
	})
</script>

<div>
  <div class="toolbar">
    <ViewToolbar variant="primary">
      <Navigation slot="left"
        onNext={() => {
          changed += 1;
          anchorDate = addInterval(anchorDate, interval);
        }}
        onPrevious={() => {
          changed -= 1;
          anchorDate = subtractInterval(anchorDate, interval);
        }}
        onToday={() => (anchorDate = dayjs())}
      />
      <Typography variant="h2" nomargin>{title}</Typography>
      <svelte:fragment slot="right">
        <Field name={$i18n.t("views.timeline.fields.startDate")}>
          <Select
            value={startDateField?.name ?? ""}
            options={dateFields.map(fieldToSelectableValue)}
            placeholder={$i18n.t("views.calendar.fields.none") ?? ""}
            on:change={({ detail }) => handleDateFieldChange(detail, "start")}
          />
        </Field>
        <Field name={$i18n.t("views.timeline.fields.endDate")}>
          <Select
            value={endDateField?.name ?? ""}
            options={dateFields.map(fieldToSelectableValue)}
            placeholder={$i18n.t("views.calendar.fields.none") ?? ""}
            on:change={({ detail }) => handleDateFieldChange(detail, "end")}
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
  </div>
  <TimelineBackground {interval} {dates} isOneDay={interval == "day"} />
  <div id="interacter" bind:this={thisTarget} bind:clientWidth={parentwidth}>
    {#each _records as record}
      <TimelineEntry
        bind:changed
        {parentwidth}
        bind:dateInterval
        bind:dates
        {interval}
        {startDateField}
        {endDateField}
        bind:record
        onRecordUpdate={(record) => {
          api.updateRecord(record, fields);
        }}
        onEntryClick={(id) => {
          const rec = records.find((a) => a.id == id);
          if (rec) {
            new EditNoteModal(
              get(app),
              fields,
              (record) => {
                changed += 1;
                api.updateRecord(record, fields);
              },
              rec
            ).open();
          }
        }}
        checked={!!booleanField
          ? asOptionalBoolean(record.values[booleanField.name])
          : null}
      >
        {record?.values["name"]}
      </TimelineEntry>
    {/each}
  </div>
</div>

<style>
  .toolbar {
    z-index: 100;
  }
  #interacter {
    position: absolute;
    top: 12.1em;
    overflow: hidden;

    width: 100%;
    height: 100%;
    z-index: 0;
  }
  div:not(.toolbar) {
    height: 100%;
  }
</style>
