<script lang="ts">
	import produce from "immer";

	import {
		DataFieldType,
		isString,
		type DataField,
		type DataRecord,
	} from "../../lib/types";

	import { FieldControl } from "../core/FieldControl";
	import { Typography, SettingItem } from "obsidian-svelte";
	import { i18n } from "../../lib/stores/i18n";
	import Button from "obsidian-svelte/src/components/Button/Button.svelte";

	export let fields: DataField[];
	export let record: DataRecord;

	export let onSave: (record: DataRecord) => void;
</script>

<Typography variant="h1">{$i18n.t("modals.record.edit.title")}</Typography>

<SettingItem name="name">
	<FieldControl
		value={record.name}
		onChange={(value) => {
			if (isString(value)) {
				record = produce(record, (draft) => {
					draft.name = value;
					return draft;
				});
			}
		}}
		type={DataFieldType.String}
		readonly
	/>
</SettingItem>

{#each fields as field}
	<SettingItem name={field.name}>
		<FieldControl
			value={record.values[field.name]}
			onChange={(value) => {
				record = produce(record, (draft) => {
					draft.values[field.name] = value;
				});
			}}
			type={field.type}
		/>
	</SettingItem>
{/each}

<SettingItem>
	<Button
		variant="primary"
		on:click={() => {
			onSave(record);
		}}>{$i18n.t("modals.record.edit.save")}</Button
	>
</SettingItem>
