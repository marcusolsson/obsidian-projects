<script lang="ts">
	import {
		DataFieldType,
		isBoolean,
		isDate,
		isLink,
		isNumber,
		isString,
		type DataValue,
	} from "src/lib/data";

	import { Checkbox } from "../Checkbox";
	import { DatePicker } from "../DatePicker";
	import { Input } from "../Input";
	import { InternalLink } from "../InternalLink";

	export let type: DataFieldType;
	export let value: DataValue;
	export let onChange: (value: DataValue) => void;

	function aliasify(linkText: string) {
		const splt = linkText.indexOf("|");

		if (splt < 0) {
			return linkText;
		}

		return linkText.substring(splt + 1);
	}
</script>

{#if type === DataFieldType.Boolean}
	<Checkbox value={isBoolean(value) ? value : false} {onChange} />
{:else if type === DataFieldType.String}
	<Input value={isString(value) ? value : ""} {onChange} />
{:else if type === DataFieldType.Number}
	<Input
		type="number"
		value={isNumber(value) ? value.toString() : ""}
		onChange={(value) => onChange(parseFloat(value))}
	/>
{:else if type === DataFieldType.Date}
	<DatePicker value={isDate(value) ? value : null} onCommit={onChange} />
{:else if type === DataFieldType.Link}
	{#if isLink(value)}
		<InternalLink linkText={value.linkText} sourcePath={value.sourcePath}>
			{aliasify(value.linkText)}
		</InternalLink>
	{/if}
{/if}
