<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { ViewDefinition, ViewType } from "../../main";

	import { Input, Select, Typography } from "obsidian-svelte";
	import { SettingItem, ButtonSetting } from "../core/Setting";
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
		{ label: $i18n.t("views.table.name"), value: "table" },
		{ label: $i18n.t("views.board.name"), value: "board" },
		{ label: $i18n.t("views.calendar.name"), value: "calendar" },
		...selectableCustomViews,
	];

	$: selectedOption = options.find((option) => option.value === type);
</script>

<Typography variant="h1">{$i18n.t("modals.view.create.title")}</Typography>

<SettingItem
	name={$i18n.t("modals.view.create.type.name")}
	description={$i18n.t("modals.view.create.type.description") ?? ""}
>
	<Select
		value={type}
		{options}
		onChange={(value) => {
			type = value;
		}}
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.view.create.name.name")}
	description={$i18n.t("modals.view.create.name.description") ?? ""}
>
	<Input
		value={name}
		on:input={({ detail: value }) => (name = value)}
		placeholder={$i18n.t("modals.view.create.optional") ?? ""}
	/>
</SettingItem>

<ButtonSetting
	name={$i18n.t("modals.view.create.cta")}
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name: name || (selectedOption?.label ?? type),
			type,
			config: {},
		})}
/>
