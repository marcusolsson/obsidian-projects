<script lang="ts">
	import {
		DataFieldType,
		isDate,
		isNumber,
		isString,
		isBoolean,
		type DataValue,
		isLink,
	} from "src/lib/datasource";

	import { Checkbox } from "../Checkbox";
	import { DatePicker } from "../DatePicker";
	import { InternalLink } from "../InternalLink";

	import ModalTextField from "./ModalTextField.svelte";

	export let type: DataFieldType;
	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let modal: boolean;

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
{:else if type === DataFieldType.Link}
	{#if isLink(value)}
		<InternalLink linkText={value.linkText} sourcePath={value.sourcePath}>
			{aliasify(value.linkText)}
		</InternalLink>
	{/if}
{:else if type === DataFieldType.String}
	{#if modal}
		<ModalTextField
			value={isString(value) ? value : ""}
			onCommit={onChange}
		/>
	{:else}
		<input
			type="text"
			value={isString(value) ? value : ""}
			on:change={(value) => {
				onChange(value.currentTarget.value);
			}}
		/>
	{/if}
{:else if type === DataFieldType.Date}
	<DatePicker value={isDate(value) ? value : null} onCommit={onChange} />
{:else if type === DataFieldType.Number}
	{#if modal}
		<ModalTextField
			value={isNumber(value) ? value.toString() : ""}
			onCommit={(value) => {
				onChange(parseFloat(value));
			}}
		/>
	{:else}
		<input
			type="number"
			value={isNumber(value) ? value.toString() : ""}
			on:change={(value) => {
				onChange(parseFloat(value.currentTarget.value));
			}}
		/>
	{/if}
{/if}
