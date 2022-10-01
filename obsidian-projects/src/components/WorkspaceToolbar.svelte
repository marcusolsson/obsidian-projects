<script lang="ts">
	import { Menu as ObsidianMenu } from "obsidian";

	import { CreateWorkspaceModal } from "../modals/create-workspace-modal";
	import { AddViewModal } from "../modals/add-view-modal";
	import { ConfirmDialogModal } from "../modals/confirm-dialog";
	import { CreateRecordModal } from "../modals/create-record-modal";

	import { app } from "../lib/stores/obsidian";
	import { api } from "../lib/stores/api";
	import { i18n } from "../lib/stores/i18n";
	import { settings } from "../lib/stores/settings";

	import { Select, Button, Icon, IconButton } from "obsidian-svelte";

	import ViewContainer from "./ViewContainer.svelte";
	import ViewItem from "./ViewItem.svelte";

	import { createDataRecord, createWorkspace } from "../lib/api";
	import type { WorkspaceDefinition } from "../types";
	import { customViews, customViewsV2 } from "../lib/stores/custom-views";
	import { Builder } from "../builder";

	export let workspaces: WorkspaceDefinition[];
	export let workspace: string | undefined;
	export let onWorkspaceChange: (workspace: string) => void;

	export let view: string | undefined;
	export let onViewChange: (view: string) => void;

	$: workspaceDef = workspaces.find((w) => w.id === workspace);

	function iconFromViewType(type: string) {
		switch (type) {
			case "table":
				return "table";
			case "board":
				return "columns";
			case "calendar":
				return "calendar";
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

<div>
	<span>
		<Select
			value={workspace ?? ""}
			options={workspaces.map((workspace) => ({
				label: workspace.name,
				value: workspace.id,
			}))}
			on:change={({ detail: value }) => onWorkspaceChange(value)}
			placeholder={$i18n.t("toolbar.workspaces.none") ?? ""}
		/>
		{#if workspaces.length}
			<IconButton
				icon="more-vertical"
				on:click={(event) => {
					const menu = new ObsidianMenu();

					menu.addItem((item) => {
						item.setTitle(
							$i18n.t("modals.workspace.edit.short-title")
						)
							.setIcon("edit")
							.onClick(() => {
								if (workspaceDef) {
									new CreateWorkspaceModal(
										$app,
										$i18n.t("modals.workspace.edit.title"),
										$i18n.t("modals.workspace.edit.cta"),
										settings.updateWorkspace,
										workspaceDef
									).open();
								}
							});
					});
					menu.addItem((item) => {
						item.setTitle(
							$i18n.t("modals.workspace.delete.short-title")
						)
							.setIcon("trash")
							.onClick(() => {
								new ConfirmDialogModal(
									$app,
									$i18n.t("modals.workspace.delete.title"),
									$i18n.t("modals.workspace.delete.message"),
									$i18n.t("modals.workspace.delete.cta"),
									() => {
										if (workspace) {
											settings.deleteWorkspace(workspace);
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
	<ViewContainer>
		{#if workspaceDef}
			{#each workspaceDef.views as v}
				<ViewItem
					selected={view === v.id}
					name={v.name}
					icon={iconFromViewType(v.type)}
					variant="secondary"
					on:click={() => onViewChange(v.id)}
					onRename={(name) => {
						if (workspace) {
							settings.renameView(workspace, v.id, name);
						}
					}}
					onDelete={() => {
						new ConfirmDialogModal(
							$app,
							$i18n.t("modals.view.delete.title"),
							$i18n.t("modals.view.delete.message"),
							$i18n.t("modals.view.delete.cta"),
							() => {
								if (workspace) {
									settings.deleteView(workspace, v.id);
								}
							}
						).open();
					}}
				/>
			{/each}
		{/if}
	</ViewContainer>
	<Button
		variant="primary"
		on:click={(event) => {
			const menu = new ObsidianMenu();

			menu.addItem((item) => {
				item.setTitle($i18n.t("modals.workspace.create.short-title"))
					.setIcon("folder")
					.onClick(() => {
						new CreateWorkspaceModal(
							$app,
							$i18n.t("modals.workspace.create.title"),
							$i18n.t("modals.workspace.create.cta"),
							settings.addWorkspace,
							createWorkspace()
						).open();
					});
			});

			if (workspaceDef) {
				menu.addItem((item) => {
					item.setTitle($i18n.t("modals.view.create.short-title"))
						.setIcon("table")
						.onClick(() => {
							if (workspaceDef) {
								new AddViewModal(
									$app,
									workspaceDef,
									(workspaceId, view) => {
										settings.addView(workspaceId, view);
									}
								).open();
							}
						});
				});
				menu.addItem((item) => {
					item.setTitle($i18n.t("modals.record.create.short-title"))
						.setIcon("file")
						.onClick(() => {
							if (workspaceDef) {
								new CreateRecordModal(
									$app,
									workspaceDef,
									(name, templatePath, workspace) => {
										$api.createRecord(
											createDataRecord(name, workspace),
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
		New<Icon accent name="chevron-down" />
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
