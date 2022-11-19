<script lang="ts">
	import dayjs from "dayjs"
  import { Select, Typography } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { DataFieldType, type DataFrame, type ProjectDefinition, type ViewApi } from "obsidian-projects-types";
  import { ToolBar } from "src/components/ToolBar";
  import type { TimelineConfig } from "./types";
  import { addInterval, computeDateInterval, generateDates, generateTitle, isCalendarInterval, subtractInterval } from "../Calendar/calendar";
  import Timeline from "./components/Timeline.svelte";
  import { computeHours, generateHours } from "./timeline";
  import { Navigation } from "../Calendar/components/Navigation";
  
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
    dateFields[1] ?? dateFields[0];

  let anchorDate: dayjs.Dayjs = dayjs();

	$: interval = config?.interval ?? "week";

	$: dateInterval = interval != "day" ? computeDateInterval(anchorDate, interval) : computeHours(anchorDate)
	$: title = dateInterval ? generateTitle(dateInterval) : "";
  $: dates = dateInterval ? (interval == "day" ? generateHours(dateInterval) : generateDates(dateInterval)) : [];
	$: console.log(dates)

	function handleIntervalChange(interval: string) {
    if (isCalendarInterval(interval)) {
      onConfigChange({ ...config, interval });
    }
  }
	function handleDateFieldChange(dateField: string, startOrEnd: "start" | "end") {
		let name = startOrEnd == "start" ? "startDateField" : "endDateField"
    onConfigChange({ ...config, [name]: dateField });
  }
</script>
<div>
	<ToolBar>
		<Navigation
      onNext={() => (anchorDate = addInterval(anchorDate, interval))}
      onPrevious={() => (anchorDate = subtractInterval(anchorDate, interval))}
      onToday={() => (anchorDate = dayjs())}
    />
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
			]} on:change={({ detail }) => handleIntervalChange(detail)}
		/>
		<Typography variant="h2" nomargin>{title}</Typography>
	</ToolBar>
	<Timeline isOneDay={interval == "day"} dates={dates}/>
</div>
<style>
	div {
		height: 100%
	}
</style>