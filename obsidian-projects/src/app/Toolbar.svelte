<script lang="ts">
	import { Menu } from "obsidian";
	import { Select, Button, Icon, IconButton } from "obsidian-svelte";

	import { CreateProjectModal } from "../modals/create-project-modal";
	import { AddViewModal } from "../modals/add-view-modal";
	import { ConfirmDialogModal } from "../modals/confirm-dialog";
	import { CreateNoteModal } from "../modals/create-note-modal";

	import { app } from "../lib/stores/obsidian";
	import { api } from "../lib/stores/api";
	import { i18n } from "../lib/stores/i18n";
	import { settings } from "../lib/stores/settings";
	import { customViews, customViewsV2 } from "../lib/stores/custom-views";

	import ViewItemList from "./ViewItemList.svelte";
	import ViewItem from "./ViewItem.svelte";

	import { createDataRecord, createProject } from "../lib/api";

	import type { ProjectDefinition } from "../types";
	import { Builder } from "../builder";

	export let projects: ProjectDefinition[];

	export let project: string | undefined;
	export let onProjectChange: (project: string) => void;

	export let view: string | undefined;
	export let onViewChange: (view: string) => void;

	$: projectDefinition = projects.find((w) => w.id === project);
	$: views = projectDefinition?.views ?? [];

	function iconFromViewType(type: string) {
		switch (type) {
			case "table":
				return "table";
			case "board":
				return "columns";
			case "calendar":
				return "calendar";
			case "developer":
				return "wrench";
			default:
				const createView = $customViewsV2[type];

				if (createView) {
					const view = createView();
					return view.getIcon();
				}

				const builder = $customViews[type];

				if (builder) {
					const view = new Builder();
					builder(view);
					return view.icon ?? "";
				}
				return "";
		}
	}
</script>

<!--
	@component

	Toolbar lets the user manage projects and views.
-->
<div>
	<span>
		<Select
			value={project ?? ""}
			options={projects.map((project) => ({
				label: project.name,
				value: project.id,
			}))}
			on:change={({ detail: value }) => onProjectChange(value)}
			placeholder={$i18n.t("toolbar.projects.none") ?? ""}
		/>

		{#if projects.length}
			<IconButton
				icon="more-vertical"
				size="sm"
				on:click={(event) => {
					const menu = new Menu();

					menu.addItem((item) => {
						item.setTitle(
							$i18n.t("modals.project.edit.short-title")
						)
							.setIcon("edit")
							.onClick(() => {
								if (projectDefinition) {
									new CreateProjectModal(
										$app,
										$i18n.t("modals.project.edit.title"),
										$i18n.t("modals.project.edit.cta"),
										settings.updateProject,
										projectDefinition
									).open();
								}
							});
					});

					menu.addItem((item) => {
						item.setTitle(
							$i18n.t("modals.project.delete.short-title")
						)
							.setIcon("trash")
							.onClick(() => {
								new ConfirmDialogModal(
									$app,
									$i18n.t("modals.project.delete.title"),
									$i18n.t("modals.project.delete.message"),
									$i18n.t("modals.project.delete.cta"),
									() => {
										if (project) {
											settings.deleteProject(project);
										}
									}
								).open();
							});
					});

					menu.showAtMouseEvent(event);
				}}
			/>
		{/if}
	</span>

	{#if projectDefinition}
		<ViewItemList>
			{#key views}
				{#each views as v}
					<ViewItem
						active={view === v.id}
						label={v.name}
						icon={iconFromViewType(v.type)}
						on:click={() => onViewChange(v.id)}
						on:rename={({ detail: name }) => {
							if (project) {
								settings.renameView(project, v.id, name);
							}
						}}
						on:delete={() => {
							new ConfirmDialogModal(
								$app,
								$i18n.t("modals.view.delete.title"),
								$i18n.t("modals.view.delete.message"),
								$i18n.t("modals.view.delete.cta"),
								() => {
									if (project) {
										settings.deleteView(project, v.id);
									}
								}
							).open();
						}}
						onValidate={(name) => {
							if (name === v.name) {
								return true;
							}

							return (
								name !== "" &&
								!projectDefinition?.views.find(
									(view) => view.name === name
								)
							);
						}}
					/>
				{/each}
			{/key}
		</ViewItemList>
	{/if}

	<Button
		variant="primary"
		on:click={(event) => {
			const menu = new Menu();

			menu.addItem((item) => {
				item.setTitle($i18n.t("modals.project.create.short-title"))
					.setIcon("folder")
					.onClick(() => {
						new CreateProjectModal(
							$app,
							$i18n.t("modals.project.create.title"),
							$i18n.t("modals.project.create.cta"),
							settings.addProject,
							createProject()
						).open();
					});
			});

			if (projectDefinition) {
				menu.addItem((item) => {
					item.setTitle($i18n.t("modals.view.create.short-title"))
						.setIcon("table")
						.onClick(() => {
							if (projectDefinition) {
								new AddViewModal(
									$app,
									projectDefinition,
									(projectId, view) => {
										settings.addView(projectId, view);
									}
								).open();
							}
						});
				});
				menu.addItem((item) => {
					item.setTitle($i18n.t("modals.note.create.short-title"))
						.setIcon("file")
						.onClick(() => {
							if (projectDefinition) {
								new CreateNoteModal(
									$app,
									projectDefinition,
									(name, templatePath, project) => {
										$api.createNote(
											createDataRecord(name, project),
											templatePath
										);
									}
								).open();
							}
						});
				});
			}
			menu.showAtMouseEvent(event);
		}}
	>
		{$i18n.t("toolbar.new")}<Icon accent name="chevron-down" />
	</Button>
</div>

<style>
	div {
		background-color: var(--tab-background-active);
		display: flex;
		align-items: center;
		padding: var(--size-4-2);
		gap: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
		justify-content: space-between;
	}

	span {
		display: flex;
		align-items: center;
		gap: 4px;
	}
</style>
