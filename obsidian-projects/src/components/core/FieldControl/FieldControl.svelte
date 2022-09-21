<script lang="ts">
	import {
		DataFieldType,
		isBoolean,
		isDate,
		isLink,
		isNumber,
		isOptionalList,
		isString,
		type DataValue,
	} from "../../../lib/types";

	import { Input, Checkbox } from "obsidian-svelte";
	import TagList from "../DataGrid/GridCell/GridListCell/TagList.svelte";
	import { DatePicker } from "../DatePicker";

	export let type: DataFieldType;
	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let readonly: boolean = false;
</script>

{#if type === DataFieldType.Boolean}
	<Checkbox
		checked={isBoolean(value) ? value : false}
		on:check={({ detail }) => onChange(detail)}
	/>
{:else if type === DataFieldType.String}
	<Input
		value={isString(value) ? value : ""}
		on:input={({ detail: value }) => onChange(value)}
		{readonly}
	/>
{:else if type === DataFieldType.Number}
	<Input
		type="number"
		value={isNumber(value) ? value.toString() : ""}
		on:input={({ detail: value }) => onChange(parseFloat(value))}
	/>
{:else if type === DataFieldType.Date}
	<DatePicker value={isDate(value) ? value : null} onCommit={onChange} />
{:else if type === DataFieldType.List && isOptionalList(value)}
	<TagList edit={true} values={value ?? []} {onChange} />
{:else if type === DataFieldType.Link}
	<Input
		value={isLink(value) ? value.linkText : ""}
		on:input={({ detail: val }) => {
			if (isLink(value)) {
				onChange({ ...value, linkText: val });
			}
		}}
	/>
{/if}
