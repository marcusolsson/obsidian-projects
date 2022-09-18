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
	} from "src/lib/types";

	import { Checkbox } from "../Checkbox";
	import TagList from "../DataGrid/GridCell/GridListCell/TagList.svelte";
	import { DatePicker } from "../DatePicker";
	import { Input } from "../Input";

	export let type: DataFieldType;
	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let readonly: boolean = false;
</script>

{#if type === DataFieldType.Boolean}
	<Checkbox value={isBoolean(value) ? value : false} {onChange} />
{:else if type === DataFieldType.String}
	<Input value={isString(value) ? value : ""} {onChange} {readonly} />
{:else if type === DataFieldType.Number}
	<Input
		type="number"
		value={isNumber(value) ? value.toString() : ""}
		onChange={(value) => onChange(parseFloat(value))}
	/>
{:else if type === DataFieldType.Date}
	<DatePicker value={isDate(value) ? value : null} onCommit={onChange} />
{:else if type === DataFieldType.List && isOptionalList(value)}
	<TagList edit={true} values={value ?? []} {onChange} />
{:else if type === DataFieldType.Link}
	<Input
		value={isLink(value) ? value.linkText : ""}
		onChange={(val) => {
			if (isLink(value)) {
				onChange({ ...value, linkText: val });
			}
		}}
	/>
{/if}
