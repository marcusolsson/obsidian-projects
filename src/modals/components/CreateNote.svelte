<script lang="ts">
	import { normalizePath, TFile } from "obsidian";
	import { isValidPath } from "src/lib/obsidian";
	import {
		Button,
		TextInput,
		Select,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
	} from "obsidian-svelte";
	import Callout from "obsidian-svelte/src/components/Callout/Callout.svelte";

	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";
	import { settings } from "../../lib/stores/settings";
	import type { ProjectDefinition } from "../../types";

	export let name: string;
	export let project: ProjectDefinition;
	export let onSave: (
		name: string,
		templatePath: string,
		project: ProjectDefinition
	) => void;

	let templatePath = "";

	$: nameError = validateName(name);

	function validateName(name: string) {
		if (name === "") {
			return $i18n.t("modals.note.create.empty-name-error");
		}

		const existingFile = $app.vault.getAbstractFileByPath(
			normalizePath(project.path + "/" + name + ".md")
		);

		if (existingFile instanceof TFile) {
			return $i18n.t("modals.note.create.name-taken-error");
		}

		if (!isValidPath(name)) {
			return $i18n.t("modals.project.defaultName.invalid");
		}

		return "";
	}
</script>

<ModalLayout title={$i18n.t("modals.note.create.title")}>
	<ModalContent>
		<SettingItem
			name={$i18n.t("modals.note.create.name.name")}
			description={$i18n.t("modals.note.create.name.description") ?? ""}
		>
			<TextInput
				value={name}
				on:input={({ detail: value }) => (name = value)}
				autoFocus
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

		{#if project.templates?.length}
			<SettingItem
				name={$i18n.t("modals.note.create.templatePath.name")}
				description={$i18n.t(
					"modals.note.create.templatePath.description"
				) ?? ""}
			>
				<Select
					value={templatePath}
					on:change={({ detail: value }) => (templatePath = value)}
					options={project.templates.map((path) => ({
						label: path,
						value: path,
					}))}
					placeholder={$i18n.t(
						"modals.note.create.templatePath.none"
					) ?? ""}
					allowEmpty
				/>
			</SettingItem>
		{/if}
		{#if project.dataview}
			<Callout
				title={$i18n.t("modals.note.create.readonly.title")}
				icon="alert-triangle"
				variant="danger"
			>
				{$i18n.t("modals.note.create.readonly.message", {
					project: project.name,
				})}
			</Callout>
		{/if}
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant={"primary"}
			disabled={!!nameError || !!project.dataview}
			on:click={() => {
				onSave(name, templatePath, project);
			}}
		>
			{$i18n.t("modals.note.create.create")}
		</Button>
	</ModalButtonGroup>
</ModalLayout>
