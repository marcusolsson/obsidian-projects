<script lang="ts">
	import produce from "immer";

	import { filesToDataFrame } from "src/lib/helpers";
	import { app } from "../lib/stores/obsidian";
	import { fileIndex } from "../lib/stores/file-index";
	import { settings } from "../lib/stores/settings";

	import { BoardView } from "./views/Board";
	import { CalendarView } from "./views/Calendar";
	import { TableView } from "./views/Table";

	import WorkspaceContainer from "./WorkspaceContainer.svelte";
	import { emptyDataFrame } from "src/lib/datasource";

	const viewComponents: { [key: string]: any } = {
		table: TableView,
		board: BoardView,
		calendar: CalendarView,
	};

	$: workspaces = $settings.workspaces;

	$: selectedWorkspace = workspaces?.length
		? workspaces.find((w) => w.id === $settings.lastWorkspaceId) ||
		  workspaces[0]
		: null;

	$: selectedView = selectedWorkspace?.views?.length
		? selectedWorkspace?.views?.find(
				(v) => v.id === $settings.lastViewId
		  ) || selectedWorkspace.views[0]
		: null;

	$: {
		if (selectedWorkspace) {
			fileIndex.reindex(selectedWorkspace);
		}
	}

	$: frame = selectedWorkspace
		? filesToDataFrame(
				$app,
				$fileIndex.files,
				selectedWorkspace.path,
				selectedWorkspace.recursive
		  )
		: emptyDataFrame;

	function handleWorkspaceChange(workspaceId: string) {
		if (!workspaces.length) {
			selectedWorkspace = null;
			selectedView = null;
			return;
		}

		const workspace = workspaces.find((ws) => ws.id === workspaceId);

		selectedWorkspace = workspace ? workspace : workspaces[0];

		if (selectedWorkspace) {
			if (!selectedWorkspace.views.length) {
				selectedView = null;
				return;
			}

			selectedView = selectedWorkspace.views[0];
		}
	}

	function handleViewChange(viewId: string) {
		if (!selectedWorkspace || !selectedWorkspace.views.length) {
			selectedView = null;
			return;
		}

		selectedView =
			selectedWorkspace.views.find((v) => v.id === viewId) ??
			selectedWorkspace.views[0];
	}

	$: {
		settings.update((state) => {
			return produce(state, (draft) => {
				draft.lastWorkspaceId = selectedWorkspace?.id;
				draft.lastViewId = selectedView?.id;
				return draft;
			});
		});
	}

	function handleConfigChange(config: Record<string, any>) {
		settings.update((state) =>
			produce(state, (draft) => {
				draft.workspaces = draft.workspaces.map((workspace) => {
					if (workspace.id === selectedWorkspace?.id) {
						return {
							...workspace,
							views: workspace.views.map((view) => {
								if (view.id === selectedView?.id) {
									return {
										...view,
										config,
									};
								}
								return view;
							}),
						};
					}
					return workspace;
				});
				return draft;
			})
		);
	}

	$: viewComponent = selectedView ? viewComponents[selectedView.type] : null;
</script>

<div class="projects-container">
	<WorkspaceContainer
		{workspaces}
		workspace={selectedWorkspace?.id}
		onWorkspaceChange={(workspaceId) => handleWorkspaceChange(workspaceId)}
		view={selectedView?.id}
		onViewChange={(viewId) => handleViewChange(viewId)}
	/>

	<div class="projects-main">
		{#if selectedView && viewComponent}
			<svelte:component
				this={viewComponent}
				records={frame.records}
				fields={frame.fields}
				config={selectedView.config}
				onConfigChange={handleConfigChange}
			/>
		{/if}
	</div>
</div>

<style>
	.projects-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.projects-main {
		flex: 1;
		overflow: auto;
	}
</style>
