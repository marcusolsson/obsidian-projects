<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { ViewDefinition, ViewType } from "../../main";

	import {
		Button,
		Input,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		Select,
		SettingItem,
	} from "obsidian-svelte";

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

<ModalLayout title={$i18n.t("modals.view.create.title")}>
	<ModalContent>
		<SettingItem
			name={$i18n.t("modals.view.create.type.name")}
			description={$i18n.t("modals.view.create.type.description") ?? ""}
		>
			<Select
				value={type}
				{options}
				on:change={({ detail: value }) => {
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
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			on:click={() => {
				onSave({
					id: uuidv4(),
					name: name || (selectedOption?.label ?? type),
					type,
					config: {},
				});
			}}>{$i18n.t("modals.view.create.cta")}</Button
		>
	</ModalButtonGroup>
</ModalLayout>
