<script lang="ts">
	import produce from "immer";

	import {
		DataFieldType,
		isString,
		type DataField,
		type DataRecord,
	} from "../../lib/types";

	import { FieldControl } from "../core/FieldControl";
	import { Typography } from "obsidian-ui";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { i18n } from "../../lib/stores/i18n";

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

<ButtonSetting
	name={$i18n.t("modals.record.edit.save")}
	cta
	onClick={() => onSave(record)}
/>
