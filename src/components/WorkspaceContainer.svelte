<script lang="ts">
	import { AddWorkspaceModal } from "../modals/add-workspace-modal";

	import type { WorkspaceDefinition } from "src/main";

	import ViewContainer from "./ViewContainer.svelte";
	import ViewItem from "./ViewItem.svelte";
	import { app } from "../lib/stores";
	import { settings } from "src/lib/stores/settings";
	import produce from "immer";
	import { AddViewModal } from "src/modals/add-view-modal";
	import { ToolBarSelect } from "./core/ToolBar";
	import { ConfirmDialogModal } from "src/modals/confirm-dialog";
	import { Select } from "./core/Select";
	import { IconButton } from "./core/IconButton";

	export let workspaces: WorkspaceDefinition[];
	export let workspace: string;
	export let onWorkspaceChange: (workspace: string) => void;

	export let view: string | undefined;
	export let onViewChange: (view: string) => void;

	$: workspaceDef = workspaces.find((w) => w.id === workspace);
</script>

<div>
	<Select
		value={workspace}
		options={workspaces.map((workspace) => ({
			label: workspace.name,
			value: workspace.id,
		}))}
		onChange={onWorkspaceChange}
	/>
	<IconButton
		icon="plus"
		on:click={() => {
			new AddWorkspaceModal($app, (value) => {
				settings.update((state) => {
					return produce(state, (draft) => {
						draft.workspaces.push(value);
						return draft;
					});
				});
			}).open();
		}}
	/>
	{#if workspaceDef}
		<IconButton
			icon="trash"
			on:click={() => {
				new ConfirmDialogModal(
					$app,
					"Are you sure you want to delete this workspace?",
					"Delete",
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
						onDelete={() => {
							new ConfirmDialogModal(
								$app,
								"Are you sure you want to delete this view?",
								"Delete",
								() => {
									settings.update((state) => {
										return produce(state, (draft) => {
											const idx =
												draft.workspaces.findIndex(
													(ws) => ws.id === workspace
												);

											if (idx >= 0) {
												draft.workspaces.splice(
													idx,
													1,
													{
														...draft.workspaces[
															idx
														],
														views: draft.workspaces[
															idx
														].views.filter(
															(view) =>
																view.id !== v.id
														),
													}
												);
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
				name="Add view"
				on:click={() => {
					new AddViewModal($app, (view) => {
						settings.update((state) => {
							return produce(state, (draft) => {
								const idx = draft.workspaces.findIndex(
									(ws) => ws.id === workspace
								);

								if (idx >= 0) {
									draft.workspaces.splice(idx, 1, {
										...draft.workspaces[idx],
										views: [
											...draft.workspaces[idx].views,
											view,
										],
									});
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
