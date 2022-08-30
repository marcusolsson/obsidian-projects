<script lang="ts">
	import dayjs from "dayjs";
	import isoWeek from "dayjs/plugin/isoWeek";
	import localizedFormat from "dayjs/plugin/localizedFormat";
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

	dayjs.extend(isoWeek);
	dayjs.extend(localizedFormat);

	interface CalendarConfig {
		interval?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: CalendarConfig;
	export let onConfigChange: (config: CalendarConfig) => void;

	$: dateField = fields.find((field) => field.type === DataFieldType.Date);

	function groupRecords(
		records: DataRecord[],
		field: string
	): Record<string, Array<[number, DataRecord]>> {
		const res: Record<string, Array<[number, DataRecord]>> = {};

		records.forEach((record, i) => {
			const dateValue = record.values[field];

			const start = isDate(dateValue) ? dayjs(dateValue) : null;

			if (start) {
				const dateStr = start.format("YYYY-MM-DD");
				if (!(dateStr in res)) {
					res[dateStr] = [];
				}
				res[dateStr].push([i, record]);
			}
		});

		return res;
	}

	$: groupedRecords = dateField ? groupRecords(records, dateField.name) : {};

	let anchorDate: dayjs.Dayjs = dayjs();

	$: dateInterval = computeDateInterval(
		anchorDate,
		config?.interval ?? "week"
	);

	function computeDateInterval(
		anchor: dayjs.Dayjs,
		interval: string
	): [dayjs.Dayjs, dayjs.Dayjs] {
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

	$: numDays = dateInterval[1].diff(dateInterval[0], "days");
	$: title = generateTitle(dateInterval);

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
			buffer.push(arr[i]);
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

	$: dates = generateDates(dateInterval[0]);
	$: numColumns = Math.min(dates.length, 7);
	$: weeks = splitDates(dates, numColumns);
	$: columnHeaders = dates
		.slice(0, numColumns)
		.map((date) => date.format("ddd"));
</script>

<div>
	<ToolBar>
		<Typography variant="h2" nomargin>{title}</Typography>
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
										$api.updateRecord(record, fields);
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
