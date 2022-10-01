<script lang="ts">
	import produce from "immer";

	import {
		Button,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
	} from "obsidian-svelte";

	import type { DataField, DataRecord } from "../../lib/types";

	import { FieldControl } from "../core/FieldControl";
	import { i18n } from "../../lib/stores/i18n";
	import Callout from "obsidian-svelte/src/components/Callout/Callout.svelte";

	export let fields: DataField[];
	export let record: DataRecord;

	$: editableFields = fields.filter((field) => !field.derived);

	export let onSave: (record: DataRecord) => void;
</script>

<ModalLayout title={$i18n.t("modals.record.edit.title")}>
	<ModalContent>
		{#if !editableFields.length}
			<Callout
				title={$i18n.t("modals.record.edit.no-editable-fields.title")}
				icon="info"
				variant="info"
			>
				{$i18n.t("modals.record.edit.no-editable-fields.message")}
			</Callout>
		{/if}
		{#each editableFields as field}
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
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			on:click={() => {
				onSave(record);
			}}>{$i18n.t("modals.record.edit.save")}</Button
		>
	</ModalButtonGroup>
</ModalLayout>
