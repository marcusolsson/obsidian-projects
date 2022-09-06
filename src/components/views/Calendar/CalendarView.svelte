<script lang="ts">
	import dayjs from "dayjs";
	import { get } from "svelte/store";

	import { app } from "../../../lib/stores/obsidian";
	import { api } from "../../../lib/stores/api";
	import { fieldToSelectableValue } from "src/components/views/helpers";
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "../../../lib/data";
	import { ConfigureRecord } from "../../../modals/record-modal";

	import { Select } from "../../core/Select";
	import { Typography } from "../../core/Typography";
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
	import Field from "src/components/core/Field/Field.svelte";

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
	import { InputDialogModal } from "src/modals/input-dialog";
	import { normalizePath } from "obsidian";

	interface CalendarConfig {
		interval?: CalendarInterval;
		dateField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: CalendarConfig;
	export let onConfigChange: (config: CalendarConfig) => void;

	export let rootPath: string = "";

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
	$: weekDays = dates.slice(0, numColumns).map((date) => date.format("ddd"));

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
			<Field name="Date field">
				<Select
					value={dateField?.name ?? ""}
					options={dateFields.map(fieldToSelectableValue)}
					onChange={handleDateFieldChange}
					placeholder="No date fields"
				/>
			</Field>
			<Select
				value={config?.interval ?? "week"}
				options={[
					{ label: "Month", value: "month" },
					{ label: "2 weeks", value: "2weeks" },
					{ label: "Week", value: "week" },
					{ label: "3 days", value: "3days" },
					{ label: "Day", value: "day" },
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
									new InputDialogModal(
										$app,
										"Add record",
										"Add",
										(value) => {
											if (dateField) {
												$api.createRecord({
													name: value,
													path: normalizePath(
														rootPath +
															"/" +
															value +
															".md"
													),
													values: {
														[dateField.name]:
															date.toDate(),
													},
												});
											}
										},
										"Untitled"
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
