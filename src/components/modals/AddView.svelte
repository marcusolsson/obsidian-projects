<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { ViewDefinition, ViewType } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Select } from "../core/Select";
	import Input from "../core/Input/Input.svelte";
	import { customViews } from "../../lib/stores/custom-views";
	import { i18n } from "../../lib/stores/i18n";

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
		{ label: $i18n.t("table"), value: "table" },
		{ label: $i18n.t("board"), value: "board" },
		{ label: $i18n.t("calendar"), value: "calendar" },
		...selectableCustomViews,
	];

	$: selectedOption = options.find((option) => option.value === type);
</script>

<Typography variant="h1">{$i18n.t("add-view")}</Typography>

<SettingItem name={$i18n.t("view-type")}>
	<Select
		value={type}
		{options}
		onChange={(value) => {
			type = value;
		}}
	/>
</SettingItem>

<SettingItem name={$i18n.t("view-name")}>
	<Input
		value={name}
		onChange={(value) => (name = value)}
		placeholder={$i18n.t("optional") ?? ""}
	/>
</SettingItem>

<ButtonSetting
	name={$i18n.t("add-view")}
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name: name || (selectedOption?.label ?? type),
			type,
			config: {},
		})}
/>
