<script lang="ts">
	import dayjs from "dayjs";
	import { get } from "svelte/store";

	import { app, api } from "../../../lib/stores";
	import {
		DataFieldType,
		isDate,
		type DataField,
		type DataRecord,
	} from "../../../lib/datasource";
	import { ConfigureRecord } from "../../../modals/record-modal";

	import { Select } from "../../core/Select";
	import { Typography } from "../../core/Typography";
	import { ToolBar } from "../../core/ToolBar";

	import {
		Table,
		TableBody,
		TableColumnHeaderCell,
		TableHead,
		TableRow,
	} from "../../core/Table";

	import CalendarDay from "./CalendarDay.svelte";
	import Navigation from "./Navigation.svelte";
	import HorizontalGroup from "src/components/core/HorizontalGroup/HorizontalGroup.svelte";
	import Field from "src/components/core/Field/Field.svelte";

	interface CalendarConfig {
		interval?: string;
		dateField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: CalendarConfig;
	export let onConfigChange: (config: CalendarConfig) => void;

	$: dateFields = fields.filter((field) => field.type === DataFieldType.Date);
	$: dateField =
		dateFields.find((field) => config?.dateField === field.name) ??
		dateFields[0];

	$: groupedRecords = dateField ? groupRecords(records, dateField.name) : {};

	let anchorDate: dayjs.Dayjs = dayjs();

	$: interval = config?.interval ?? "week";

	$: dateInterval = computeDateInterval(anchorDate, interval);

	$: numDays = dateInterval
		? dateInterval[1].diff(dateInterval[0], "days")
		: 0;
	$: title = dateInterval ? generateTitle(dateInterval) : "";

	$: dates = dateInterval ? generateDates(dateInterval[0]) : [];
	$: numColumns = Math.min(dates.length, 7);
	$: weeks = splitDates(dates, numColumns);
	$: columnHeaders = dates
		.slice(0, numColumns)
		.map((date) => date.format("ddd"));

	function groupRecords(
		records: DataRecord[],
		field: string
	): Record<string, Array<[number, DataRecord]>> {
		const res: Record<string, Array<[number, DataRecord]>> = {};

		records.forEach((record, i) => {
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

				res[dateStr]?.push([i, record]);
			}
		});

		return res;
	}

	function computeDateInterval(
		anchor: dayjs.Dayjs,
		interval: string
	): [dayjs.Dayjs, dayjs.Dayjs] | undefined {
		switch (interval) {
			case "month":
				return [anchor.startOf("month"), anchor.endOf("month")];
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

		return undefined;
	}

	function generateTitle(dateInterval: [dayjs.Dayjs, dayjs.Dayjs]) {
		if (
			dateInterval[0]
				.startOf("day")
				.isSame(dateInterval[1].startOf("day"))
		) {
			return dateInterval[0].format("LL");
		}

		return `${dateInterval[0].format("MMM D")} – ${dateInterval[1].format(
			"MMM D"
		)}`;
	}

	function generateDates(start: dayjs.Dayjs): dayjs.Dayjs[] {
		const dates: dayjs.Dayjs[] = [];

		for (let i = 0; i <= numDays; i++) {
			dates.push(start.add(i, "day"));
		}

		return dates;
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

	function splitDates(dates: dayjs.Dayjs[], chunks: number) {
		const chunkedDates: dayjs.Dayjs[][] = [];

		let rest = dates;
		while (rest.length) {
			const chunked = take(rest, chunks);

			chunkedDates.push(chunked);

			rest = rest.slice(chunked.length);
		}

		return chunkedDates;
	}
</script>

<div>
	<ToolBar>
		<Navigation
			onNext={() => {
				switch (interval) {
					case "month":
						anchorDate = anchorDate.add(1, "month");
						break;
					case "2weeks":
						anchorDate = anchorDate.add(2, "week");
						break;
					case "week":
						anchorDate = anchorDate.add(1, "week");
						break;
					case "3days":
						anchorDate = anchorDate.add(1, "day");
						break;
					case "day":
						anchorDate = anchorDate.add(1, "day");
						break;
				}
			}}
			onPrevious={() => {
				switch (interval) {
					case "month":
						anchorDate = anchorDate.subtract(1, "month");
						break;
					case "2weeks":
						anchorDate = anchorDate.subtract(2, "week");
						break;
					case "week":
						anchorDate = anchorDate.subtract(1, "week");
						break;
					case "3days":
						anchorDate = anchorDate.subtract(1, "day");
						break;
					case "day":
						anchorDate = anchorDate.subtract(1, "day");
						break;
				}
			}}
			onToday={() => {
				anchorDate = dayjs();
			}}
		/>
		<Typography variant="h2" nomargin>{title}</Typography>
		<HorizontalGroup>
			<Field name="Date field">
				<Select
					value={dateField?.name ?? ""}
					options={dateFields.map(({ name }) => ({
						label: name,
						value: name,
					}))}
					onChange={(value) =>
						onConfigChange({
							...config,
							dateField: value,
						})}
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
				onChange={(value) =>
					onConfigChange({
						...config,
						interval: value,
					})}
			/>
		</HorizontalGroup>
	</ToolBar>
	<Table grow>
		<TableHead>
			<TableRow>
				{#each columnHeaders as header}
					<TableColumnHeaderCell>{header}</TableColumnHeaderCell>
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
