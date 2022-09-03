<script lang="ts">
	import produce from "immer";

	import {
		DataFieldType,
		isString,
		type DataField,
		type DataRecord,
	} from "../../lib/data";

	import { FieldControl } from "../core/FieldControl";
	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";

	export let fields: DataField[];
	export let record: DataRecord;

	export let onSave: (record: DataRecord) => void;
</script>

<Typography variant="h1">Edit record</Typography>

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
		modal={false}
	/>
</SettingItem>

{#each fields as field}
	<SettingItem name={field.name}>
		<FieldControl
			value={record.values[field.name] ?? null}
			onChange={(value) => {
				record = produce(record, (draft) => {
					draft.values[field.name] = value;
				});
			}}
			type={field.type}
			modal={false}
		/>
	</SettingItem>
{/each}

<ButtonSetting name="Save" cta onClick={() => onSave(record)} />
