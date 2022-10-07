<script lang="ts">
	import dayjs from "dayjs";
	import { get } from "svelte/store";

	import { app } from "../../../lib/stores/obsidian";
	import {
		DataFieldType,
		type DataFrame,
		type DataRecord,
	} from "../../../lib/types";

	import { fieldToSelectableValue } from "../../views/helpers";
	import { EditNoteModal } from "../../../modals/edit-note-modal";

	import { Select, Typography } from "obsidian-svelte";
	import { ToolBar } from "../../core/ToolBar";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import {
		Table,
		TableBody,
		TableColumnHeaderCell,
		TableHead,
		TableRow,
	} from "./components/Table";
	import CalendarDay from "./CalendarDay.svelte";
	import Navigation from "./Navigation.svelte";
	import { Field } from "../../core/Field";

	import {
		addInterval,
		computeDateInterval,
		generateDates,
		generateTitle,
		groupRecordsByField,
		isCalendarInterval,
		chunkDates,
		subtractInterval,
		type CalendarInterval,
	} from "./calendar";

	import type { ProjectDefinition } from "../../../types";

	import { CreateNoteModal } from "../../../modals/create-note-modal";
	import { createDataRecord } from "../../../lib/api";
	import { i18n } from "../../../lib/stores/i18n";

	interface CalendarConfig {
		interval?: CalendarInterval;
		dateField?: string;
		checkField?: string;
	}

	export let frame: DataFrame;
	export let config: CalendarConfig;
	export let onConfigChange: (config: CalendarConfig) => void;
	export let project: ProjectDefinition;
	export let readonly: boolean;

	export let onRecordAdd: (record: DataRecord, templatePath: string) => void;
	export let onRecordUpdate: (record: DataRecord) => void;
	// export let onRecordDelete: (id: string) => void;

	$: ({ fields, records } = frame);

	let anchorDate: dayjs.Dayjs = dayjs();

	$: dateFields = fields.filter((field) => field.type === DataFieldType.Date);
	$: dateField =
		dateFields.find((field) => config?.dateField === field.name) ??
		dateFields[0];

	$: booleanFields = fields.filter(
		(field) => field.type === DataFieldType.Boolean
	);
	$: booleanField = fields.find((field) => config?.checkField === field.name);

	$: interval = config?.interval ?? "week";

	$: dateInterval = computeDateInterval(anchorDate, interval);

	$: groupedRecords = dateField
		? groupRecordsByField(records, dateField.name)
		: {};
	$: title = dateInterval ? generateTitle(dateInterval) : "";
	$: dates = dateInterval ? generateDates(dateInterval) : [];

	$: numColumns = Math.min(dates.length, 7);
	$: weeks = chunkDates(dates, numColumns);
	$: weekDays = dates.slice(0, numColumns).map((date) =>
		$i18n.t("views.calendar.weekday", {
			value: date.toDate(),
			formatParams: {
				value: { weekday: "short" },
			},
		})
	);

	function handleIntervalChange(interval: string) {
		if (isCalendarInterval(interval)) {
			onConfigChange({ ...config, interval });
		}
	}
	function handleDateFieldChange(dateField: string) {
		onConfigChange({ ...config, dateField });
	}
	function handleCheckFieldChange(checkField: string) {
		onConfigChange({ ...config, checkField });
	}
</script>

<div>
	<ToolBar>
		<Navigation
			onNext={() => (anchorDate = addInterval(anchorDate, interval))}
			onPrevious={() =>
				(anchorDate = subtractInterval(anchorDate, interval))}
			onToday={() => (anchorDate = dayjs())}
		/>
		<Typography variant="h2" nomargin>{title}</Typography>
		<HorizontalGroup>
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
						label: $i18n.t(
							"views.calendar.intervals.weekWithCount",
							{ count: 2 }
						),
						value: "2weeks",
					},
					{
						label: $i18n.t("views.calendar.intervals.week", {
							count: 1,
						}),
						value: "week",
					},
					{
						label: $i18n.t(
							"views.calendar.intervals.dayWithCount",
							{ count: 3 }
						),
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
		</HorizontalGroup>
	</ToolBar>
	<Table grow>
		<TableHead>
			<TableRow>
				{#each weekDays as weekDay}
					<TableColumnHeaderCell>{weekDay}</TableColumnHeaderCell>
				{/each}
			</TableRow>
		</TableHead>
		<TableBody>
			{#each weeks as week}
				<TableRow>
					{#each week as date}
						<CalendarDay
							{date}
							checkField={booleanField?.name}
							{onRecordUpdate}
							records={groupedRecords[
								date.format("YYYY-MM-DD")
							] || []}
							onEntryClick={(id) => {
								new EditNoteModal(
									get(app),
									fields,
									onRecordUpdate,
									records[id]
								).open();
							}}
							onEntryAdd={() => {
								if (dateField && !readonly) {
									new CreateNoteModal(
										$app,
										project,
										(name, templatePath) => {
											if (dateField) {
												onRecordAdd(
													createDataRecord(
														name,
														project,
														{
															[dateField.name]:
																date.toDate(),
														}
													),
													templatePath
												);
											}
										}
									).open();
								}
							}}
						/>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	div:last-child {
		flex: 2;
	}
</style>
