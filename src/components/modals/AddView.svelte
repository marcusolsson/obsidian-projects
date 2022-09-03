<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { ViewDefinition, ViewType } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Select } from "../core/Select";
	import Input from "../core/Input/Input.svelte";
	import { customViews } from "../../lib/stores/custom-views";

	export let onSave: (view: ViewDefinition) => void;

	let name: string = "";
	let type: ViewType = "table";

	let selectableCustomViews = Object.entries($customViews).map(
		([id, builder]) => {
			const view = builder();
			return {
				label: view.title ?? id,
				value: id,
			};
		}
	);
	const options = [
		{ label: "Table", value: "table" },
		{ label: "Board", value: "board" },
		{ label: "Calendar", value: "calendar" },
		...selectableCustomViews,
	];

	$: selectedOption = options.find((option) => option.value === type);
</script>

<Typography variant="h1">Add view</Typography>

<SettingItem name={"View type"}>
	<Select
		value={type}
		{options}
		onChange={(value) => {
			type = value;
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
			name: name || (selectedOption?.label ?? type),
			type,
			config: {},
		})}
/>
