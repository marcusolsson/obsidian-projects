<script lang="ts">
	import { CreateWorkspaceModal } from "../modals/create-workspace-modal";

	import type { WorkspaceDefinition } from "src/main";
	import { Menu as ObsidianMenu } from "obsidian";

	import produce from "immer";
	import { settings } from "src/lib/stores/settings";
	import { AddViewModal } from "src/modals/add-view-modal";
	import { ConfirmDialogModal } from "src/modals/confirm-dialog";
	import { app } from "../lib/stores/obsidian";
	import { api } from "../lib/stores/api";
	import { IconButton } from "./core/IconButton";
	import { Select } from "./core/Select";
	import ViewContainer from "./ViewContainer.svelte";
	import ViewItem from "./ViewItem.svelte";
	import { i18n } from "src/lib/stores/i18n";
	import Button from "./core/Button/Button.svelte";
	import { Icon } from "./core/Icon";
	import { CreateRecordModal } from "src/modals/create-record-modal";
	import { createDataRecord } from "src/lib/api";

	export let workspaces: WorkspaceDefinition[];
	export let workspace: string | undefined;
	export let onWorkspaceChange: (workspace: string) => void;

	export let view: string | undefined;
	export let onViewChange: (view: string) => void;

	$: workspaceDef = workspaces.find((w) => w.id === workspace);
</script>

<div>
	<span>
		<Select
			value={workspace ?? ""}
			options={workspaces.map((workspace) => ({
				label: workspace.name,
				value: workspace.id,
			}))}
			onChange={onWorkspaceChange}
			placeholder={$i18n.t("toolbar.workspaces.none") ?? ""}
		/>
		{#if workspaces.length}
			<IconButton
				icon="more-vertical"
				on:click={(event) => {
					const menu = new ObsidianMenu();

					menu.addItem((item) => {
						item.setTitle("Edit workspace")
							.setIcon("edit")
							.onClick(() => {
								new CreateWorkspaceModal(
									$app,
									$i18n.t("modals.workspace.edit.title"),
									$i18n.t("modals.workspace.edit.cta"),
									(value) => {
										settings.update((state) => {
											return produce(state, (draft) => {
												draft.workspaces =
													draft.workspaces.map((w) =>
														w.id === workspace
															? value
															: w
													);

												return draft;
											});
										});
									},
									workspaceDef
								).open();
							});
					});
					menu.addItem((item) => {
						item.setTitle("Delete workspace")
							.setIcon("trash")
							.onClick(() => {
								new ConfirmDialogModal(
									$app,
									$i18n.t("modals.workspace.delete.title"),
									$i18n.t("modals.workspace.delete.message"),
									$i18n.t("modals.workspace.delete.cta"),
									() => {
										settings.update((state) => {
											return produce(state, (draft) => {
												draft.workspaces =
													draft.workspaces.filter(
														(w) =>
															w.id !== workspace
													);
												return draft;
											});
										});
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
					variant="secondary"
					on:click={() => onViewChange(v.id)}
					onRename={(name) => {
						settings.update((state) => {
							return produce(state, (draft) => {
								const idx = draft.workspaces.findIndex(
									(ws) => ws.id === workspace
								);

								if (idx >= 0) {
									const ws = draft.workspaces[idx];

									if (ws) {
										draft.workspaces.splice(idx, 1, {
											...ws,
											views: ws.views.map((view) =>
												view.id === v.id
													? { ...view, name }
													: view
											),
										});
									}
								}

								return draft;
							});
						});
					}}
					onDelete={() => {
						new ConfirmDialogModal(
							$app,
							$i18n.t("modals.view.delete.title"),
							$i18n.t("modals.view.delete.message"),
							$i18n.t("modals.view.delete.cta"),
							() => {
								settings.update((state) => {
									return produce(state, (draft) => {
										const idx = draft.workspaces.findIndex(
											(ws) => ws.id === workspace
										);

										if (idx >= 0) {
											const ws = draft.workspaces[idx];

											if (ws) {
												draft.workspaces.splice(
													idx,
													1,
													{
														...ws,
														views: ws.views.filter(
															(view) =>
																view.id !== v.id
														),
													}
												);
											}
										}

										return draft;
									});
								});
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
				item.setTitle("New workspace")
					.setIcon("folder")
					.onClick(() => {
						new CreateWorkspaceModal(
							$app,
							$i18n.t("modals.workspace.create.title"),
							$i18n.t("modals.workspace.create.cta"),
							(value) => {
								settings.update((state) => {
									return produce(state, (draft) => {
										draft.workspaces.push(value);
										return draft;
									});
								});
							}
						).open();
					});
			});

			if (workspaceDef) {
				menu.addItem((item) => {
					item.setTitle("New view")
						.setIcon("table")
						.onClick(() => {
							new AddViewModal($app, (view) => {
								settings.update((state) => {
									return produce(state, (draft) => {
										const idx = draft.workspaces.findIndex(
											(ws) => ws.id === workspace
										);

										if (idx >= 0) {
											const ws = draft.workspaces[idx];
											if (ws) {
												draft.workspaces.splice(
													idx,
													1,
													{
														...ws,
														views: [
															...ws.views,
															view,
														],
													}
												);
											}
										}

										return draft;
									});
								});
							}).open();
						});
				});
				menu.addItem((item) => {
					item.setTitle("New record")
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
