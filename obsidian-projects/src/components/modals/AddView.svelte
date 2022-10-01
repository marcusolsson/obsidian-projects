<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type {
		ViewDefinition,
		ViewType,
		WorkspaceDefinition,
	} from "../../types";

	import {
		Button,
		Input,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		Select,
		SettingItem,
	} from "obsidian-svelte";

	import { customViews, customViewsV2 } from "../../lib/stores/custom-views";
	import { i18n } from "../../lib/stores/i18n";
	import { settings } from "../../lib/stores/settings";
	import { Builder } from "obsidian-projects/src/builder";
	import { nextUniqueViewName } from "obsidian-projects/src/lib/path";

	export let onSave: (workspaceId: string, view: ViewDefinition) => void;
	export let workspace: WorkspaceDefinition;

	let name: string = "";
	let type: ViewType = "table";

	let v1 = Object.entries($customViews).map(([id, builder]) => {
		const view = new Builder();

		builder(view);

		return {
			label: view.title ?? id,
			value: id,
		};
	});

	let v2 = Object.entries($customViewsV2).map(([id, builder]) => {
		const view = builder();

		return {
			label: view.getDisplayName(),
			value: id,
		};
	});

	let selectableCustomViews = [...v1, ...v2];

	const options = [
		{ label: $i18n.t("views.table.name"), value: "table" },
		{ label: $i18n.t("views.board.name"), value: "board" },
		{ label: $i18n.t("views.calendar.name"), value: "calendar" },
		...selectableCustomViews,
	];

	$: selectedOption = options.find((option) => option.value === type);

	$: nameError = validateName(name);

	function validateName(name: string) {
		if (workspace.views.find((view) => view.name === name)) {
			return $i18n.t("modals.view.create.existing-name-error");
		}
		return "";
	}
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
				error={!!nameError}
				helperText={nameError}
			/>
		</SettingItem>

		<SettingItem
			name={$i18n.t("modals.record.create.workspace.name")}
			description={$i18n.t(
				"modals.record.create.workspace.description"
			) ?? ""}
		>
			<Select
				value={workspace.id}
				on:change={({ detail: id }) => {
					const res = $settings.workspaces.find((w) => w.id === id);
					if (res) {
						workspace = res;
					}
				}}
				options={$settings.workspaces.map((workspace) => ({
					label: workspace.name,
					value: workspace.id,
				}))}
			/>
		</SettingItem>
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			on:click={() => {
				onSave(workspace.id, {
					id: uuidv4(),
					name:
						name ||
						nextUniqueViewName(
							workspace.views,
							selectedOption?.label ?? type
						),
					type,
					config: {},
				});
			}}>{$i18n.t("modals.view.create.cta")}</Button
		>
	</ModalButtonGroup>
</ModalLayout>
