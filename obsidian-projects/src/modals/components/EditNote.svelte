<script lang="ts">
	import produce from "immer";

	import {
		Button,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		Callout,
	} from "obsidian-svelte";

	import { FieldControl } from "obsidian-projects/src/components/FieldControl";

	import type { DataField, DataRecord } from "../../lib/types";
	import { i18n } from "../../lib/stores/i18n";

	export let fields: DataField[];
	export let record: DataRecord;

	$: editableFields = fields.filter((field) => !field.derived);

	export let onSave: (record: DataRecord) => void;
</script>

<ModalLayout title={$i18n.t("modals.note.edit.title")}>
	<ModalContent>
		{#if !editableFields.length}
			<Callout
				title={$i18n.t("modals.record.edit.no-editable-fields.title")}
				icon="info"
				variant="info"
			>
				{$i18n.t("modals.note.edit.no-editable-fields.message")}
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
			}}>{$i18n.t("modals.note.edit.save")}</Button
		>
	</ModalButtonGroup>
</ModalLayout>
