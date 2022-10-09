<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type {
		ViewDefinition,
		ViewType,
		ProjectDefinition,
	} from "obsidian-projects/src/types";

	import {
		Button,
		TextInput,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		Select,
		SettingItem,
	} from "obsidian-svelte";

	import {
		customViews,
		customViewsV2,
	} from "obsidian-projects/src/lib/stores/custom-views";
	import { i18n } from "obsidian-projects/src/lib/stores/i18n";
	import { settings } from "obsidian-projects/src/lib/stores/settings";

	import { Builder } from "obsidian-projects/src/builder";
	import { nextUniqueViewName } from "obsidian-projects/src/lib/helpers";

	export let onSave: (projectId: string, view: ViewDefinition) => void;
	export let project: ProjectDefinition;

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
		// { label: $i18n.t("views.developer.name"), value: "developer" },
		...selectableCustomViews,
	];

	$: selectedOption = options.find((option) => option.value === type);

	$: nameError = validateName(name);

	function validateName(name: string) {
		if (project.views.find((view) => view.name === name)) {
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
			<TextInput
				value={name}
				on:input={({ detail: value }) => (name = value)}
				placeholder={$i18n.t("modals.view.create.optional") ?? ""}
				error={!!nameError}
				helperText={nameError}
			/>
		</SettingItem>

		<SettingItem
			name={$i18n.t("modals.note.create.project.name")}
			description={$i18n.t("modals.note.create.project.description") ??
				""}
		>
			<Select
				value={project.id}
				on:change={({ detail: id }) => {
					const res = $settings.projects.find((w) => w.id === id);
					if (res) {
						project = res;
					}
				}}
				options={$settings.projects.map((project) => ({
					label: project.name,
					value: project.id,
				}))}
			/>
		</SettingItem>
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			on:click={() => {
				onSave(project.id, {
					id: uuidv4(),
					name:
						name ||
						nextUniqueViewName(
							project.views,
							selectedOption?.label ?? type
						),
					type,
					config: {},
				});
			}}>{$i18n.t("modals.view.create.cta")}</Button
		>
	</ModalButtonGroup>
</ModalLayout>
