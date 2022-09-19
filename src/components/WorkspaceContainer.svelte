<script lang="ts">
	import { CreateWorkspaceModal } from "../modals/create-workspace-modal";

	import type { WorkspaceDefinition } from "src/main";

	import produce from "immer";
	import { settings } from "src/lib/stores/settings";
	import { AddViewModal } from "src/modals/add-view-modal";
	import { ConfirmDialogModal } from "src/modals/confirm-dialog";
	import { app } from "../lib/stores/obsidian";
	import { IconButton } from "./core/IconButton";
	import { Select } from "./core/Select";
	import ViewContainer from "./ViewContainer.svelte";
	import ViewItem from "./ViewItem.svelte";
	import { i18n } from "src/lib/stores/i18n";

	export let workspaces: WorkspaceDefinition[];
	export let workspace: string | undefined;
	export let onWorkspaceChange: (workspace: string) => void;

	export let view: string | undefined;
	export let onViewChange: (view: string) => void;

	$: workspaceDef = workspaces.find((w) => w.id === workspace);
</script>

<div>
	<Select
		value={workspace ?? ""}
		options={workspaces.map((workspace) => ({
			label: workspace.name,
			value: workspace.id,
		}))}
		onChange={onWorkspaceChange}
		placeholder={$i18n.t("toolbar.workspaces.none") ?? ""}
	/>
	<IconButton
		icon="plus"
		on:click={() => {
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
		}}
	/>
	{#if workspaceDef}
		<IconButton
			icon="edit"
			on:click={() => {
				new CreateWorkspaceModal(
					$app,
					$i18n.t("modals.workspace.edit.title"),
					$i18n.t("modals.workspace.edit.cta"),
					(value) => {
						settings.update((state) => {
							return produce(state, (draft) => {
								draft.workspaces = draft.workspaces.map((w) =>
									w.id === workspace ? value : w
								);
								return draft;
							});
						});
					},
					workspaceDef
				).open();
			}}
		/>
		<IconButton
			icon="trash"
			on:click={() => {
				new ConfirmDialogModal(
					$app,
					$i18n.t("modals.workspace.delete.title"),
					$i18n.t("modals.workspace.delete.message"),
					$i18n.t("modals.workspace.delete.cta"),
					() => {
						settings.update((state) => {
							return produce(state, (draft) => {
								draft.workspaces = draft.workspaces.filter(
									(w) => w.id !== workspace
								);
								return draft;
							});
						});
					}
				).open();
			}}
		/>
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
											const idx =
												draft.workspaces.findIndex(
													(ws) => ws.id === workspace
												);

											if (idx >= 0) {
												const ws =
													draft.workspaces[idx];

												if (ws) {
													draft.workspaces.splice(
														idx,
														1,
														{
															...ws,
															views: ws.views.filter(
																(view) =>
																	view.id !==
																	v.id
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
			<ViewItem
				variant="link"
				icon="plus"
				name={$i18n.t("toolbar.view.add")}
				on:click={() => {
					new AddViewModal($app, (view) => {
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
											views: [...ws.views, view],
										});
									}
								}

								return draft;
							});
						});
					}).open();
				}}
			/>
		</ViewContainer>
	{/if}
</div>

<style>
	div {
		background-color: var(--tab-background-active);
		display: flex;
		align-items: center;
		padding: var(--size-4-2);
		gap: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
	}
</style>
