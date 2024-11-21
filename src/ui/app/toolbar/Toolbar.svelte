<script lang="ts">
  import ViewToolbar from "src/ui/components/Layout/ViewToolbar.svelte";
  import { createProject } from "src/lib/dataApi";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { dataFrame } from "src/lib/stores/dataframe";
  import { settings } from "src/lib/stores/settings";
  import { AddViewModal } from "src/ui/modals/addViewModal";
  import { ConfirmDialogModal } from "src/ui/modals/confirmDialog";
  import { CreateProjectModal } from "src/ui/modals/createProjectModal";
  import { Flair } from "src/ui/components/Flair";

  import ProjectSelect from "./ProjectSelect.svelte";
  import ViewSelect from "./ViewSelect.svelte";
  import { InspectorModal } from "src/ui/modals/inspector";
  import type {
    ProjectDefinition,
    ProjectId,
    ViewId,
  } from "src/settings/settings";
  import { produce } from "immer";
  import ProjectViewOptions from "./viewOptions/ProjectViewOptions.svelte";

  export let projects: ProjectDefinition[];

  export let projectId: ProjectId | undefined;
  export let onProjectChange: (projectId: ProjectId) => void;

  export let viewId: ViewId | undefined;
  export let onViewChange: (viewId: ViewId) => void;

  $: project = projects.find((project) => project.id === projectId);
  $: views = project?.views ?? [];

  $: errors = $dataFrame.errors ?? [];

  $: view = projects
    .find((project) => project.id === projectId)
    ?.views?.find((view) => view.id === viewId);
</script>

<!--
	@component

	Toolbar lets the user manage projects and views.
-->
<ViewToolbar variant="primary">
  <svelte:fragment slot="info">
    {#if errors.length}
      <Flair
        variant="error"
        on:click={() => {
          new InspectorModal($app, "Project inspector", errors).open();
        }}
        >{`${errors.length} ${errors.length === 1 ? "error" : "errors"}`}</Flair
      >
    {/if}
  </svelte:fragment>

  <ProjectSelect
    slot="left"
    {projectId}
    {projects}
    {onProjectChange}
    onProjectAdd={() =>
      new CreateProjectModal(
        $app,
        $i18n.t("modals.project.create.title"),
        $i18n.t("modals.project.create.cta"),
        (project) => {
          settings.addProject(project);
          projectId = project.id;
          onProjectChange(project.id);
        },
        createProject()
      ).open()}
  />

  <div slot="middle">
    {#if project}
      <ViewSelect
        {viewId}
        {views}
        viewExists={(name) =>
          !!project?.views.find((view) => view.name === name)}
        onViewSort={(viewIds) => {
          if (projectId) {
            settings.sortViews(projectId, viewIds);
          }
        }}
        onViewAdd={() => {
          if (project) {
            new AddViewModal($app, project, (projectId, view) => {
              settings.addView(projectId, view);
              onViewChange(view.id);
            }).open();
          }
        }}
        onViewRename={(viewId, name) => {
          if (projectId) {
            settings.renameView(projectId, viewId, name);
          }
        }}
        {onViewChange}
        onViewDuplicate={(viewId) => {
          if (projectId) {
            const id = settings.duplicateView(projectId, viewId);
            onViewChange(id);
          }
        }}
        onViewDelete={(viewId) => {
          new ConfirmDialogModal(
            $app,
            $i18n.t("modals.view.delete.title"),
            $i18n.t("modals.view.delete.message", {
              view: view?.name ?? "",
            }),
            $i18n.t("modals.view.delete.cta"),
            () => {
              if (projectId) {
                settings.deleteView(projectId, viewId);
              }
            }
          ).open();
        }}
      />
    {/if}
  </div>
  <svelte:fragment slot="right">
    {#if view}
      <ProjectViewOptions
        {view}
        fields={$dataFrame.fields}
        onFilterChange={(filter) => {
          if (projectId && view) {
            settings.updateView(
              projectId,
              produce(view, (draft) => {
                draft.filter = filter;
              })
            );
          }
        }}
        onColorChange={(filter) => {
          if (projectId && view) {
            settings.updateView(
              projectId,
              produce(view, (draft) => {
                draft.colors = filter;
              })
            );
          }
        }}
        onSortChange={(filter) => {
          if (projectId && view) {
            settings.updateView(
              projectId,
              produce(view, (draft) => {
                draft.sort = filter;
              })
            );
          }
        }}
      />
    {/if}
  </svelte:fragment>
</ViewToolbar>
