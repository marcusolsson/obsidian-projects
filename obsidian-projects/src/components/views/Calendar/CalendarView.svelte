<script lang="ts">
	import dayjs from "dayjs";
	import { get } from "svelte/store";

	import { app } from "../../../lib/stores/obsidian";
	import { api } from "../../../lib/stores/api";
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "../../../lib/types";

	import { fieldToSelectableValue } from "../../views/helpers";
	import { ConfigureRecord } from "../../../modals/record-modal";

	import { Select, Typography } from "obsidian-ui";
	import { ToolBar } from "../../core/ToolBar";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import {
		Table,
		TableBody,
		TableColumnHeaderCell,
		TableHead,
		TableRow,
	} from "../../core/Table";
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
	import type { WorkspaceDefinition } from "obsidian-projects/src/main";
	import { CreateRecordModal } from "obsidian-projects/src/modals/create-record-modal";
	import { i18n } from "obsidian-projects/src/lib/stores/i18n";
	import { createDataRecord } from "obsidian-projects/src/lib/api";

	interface CalendarConfig {
		interval?: CalendarInterval;
		dateField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: CalendarConfig;
	export let onConfigChange: (config: CalendarConfig) => void;

	export let workspace: WorkspaceDefinition;

	let anchorDate: dayjs.Dayjs = dayjs();

	$: dateFields = fields.filter((field) => field.type === DataFieldType.Date);

	$: dateField =
		dateFields.find((field) => config?.dateField === field.name) ??
		dateFields[0];

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
					onChange={handleDateFieldChange}
					placeholder={$i18n.t("views.calendar.fields.none") ?? ""}
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
				onChange={handleIntervalChange}
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
							records={groupedRecords[
								date.format("YYYY-MM-DD")
							] || []}
							onEntryClick={(id) => {
								new ConfigureRecord(
									get(app),
									fields,
									(record) => {
										$api.updateRecord(record);
									},
									records[id]
								).open();
							}}
							onEntryAdd={() => {
								if (dateField) {
									new CreateRecordModal(
										$app,
										workspace,
										(name, templatePath) => {
											if (dateField) {
												$api.createRecord(
													createDataRecord(
														name,
														workspace,
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
