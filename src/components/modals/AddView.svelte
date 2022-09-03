<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import { isViewType, type ViewDefinition, type ViewType } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Select } from "../core/Select";
	import Input from "../core/Input/Input.svelte";

	export let onSave: (view: ViewDefinition) => void;

	let name: string = "";
	let type: ViewType = "table";
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
			if (isViewType(value)) {
				type = value;
			}
		}}
	/>
</SettingItem>

<SettingItem name={"View name"}>
	<Input
		value={name}
		onChange={(value) => (name = value)}
		placeholder="Optional"
	/>
</SettingItem>

<ButtonSetting
	name="Add workspace"
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name: name || type[0]?.toUpperCase() + type.slice(1),
			type,
			config: {},
		})}
/>
