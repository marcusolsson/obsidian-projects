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

	export let fields: DataField[];
	export let record: DataRecord;

	export let onSave: (record: DataRecord) => void;
</script>

<ModalLayout title={$i18n.t("modals.record.edit.title")}>
	<ModalContent>
		{#each fields as field}
			{#if !field.derived}
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
			{/if}
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
