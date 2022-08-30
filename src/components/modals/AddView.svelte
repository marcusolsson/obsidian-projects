<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { ViewDefinition } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Select } from "../core/Select";

	export let onSave: (view: ViewDefinition) => void;

	let name: string = "";
	let type: string = "table";
</script>

<Typography variant="h1">Add view</Typography>

<SettingItem name={"View type"}>
	<Select
		value={type}
		options={[
			{ label: "Table", value: "table" },
			{ label: "Board", value: "board" },
			{ label: "Calendar", value: "calendar" },
		]}
		onChange={(value) => {
			type = value;
		}}
	/>
</SettingItem>

<SettingItem name={"View name"}>
	<input placeholder="Optional" type="text" bind:value={name} />
</SettingItem>

<ButtonSetting
	name="Add workspace"
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name: name || type[0].toUpperCase() + type.slice(1),
			type,
		})}
/>
