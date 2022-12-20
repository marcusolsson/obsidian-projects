<script lang="ts">
  import { Menu } from "obsidian";
  import { Button, Icon } from "obsidian-svelte";

  import ViewToolbar from "src/components/Layout/ViewToolbar.svelte";
  import { createDataRecord, createProject } from "src/lib/data-api";
  import { api } from "src/lib/stores/api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { dataFrame } from "src/lib/stores/dataframe";
  import { settings } from "src/lib/stores/settings";
  import { AddViewModal } from "src/modals/add-view-modal";
  import { ConfirmDialogModal } from "src/modals/confirm-dialog";
  import { CreateNoteModal } from "src/modals/create-note-modal";
  import { CreateProjectModal } from "src/modals/create-project-modal";
  import type { ProjectDefinition } from "src/types";
  import Flair from "./Flair.svelte";

  import ProjectSelect from "./ProjectSelect.svelte";
  import ViewSelect from "./ViewSelect.svelte";
  import { InspectorModal } from "src/modals/inspector";

  export let projects: ProjectDefinition[];

  export let projectId: string | undefined;
  export let onProjectChange: (projectId: string) => void;

  export let viewId: string | undefined;
  export let onViewChange: (viewId: string) => void;

  $: project = projects.find((project) => project.id === projectId);
  $: views = project?.views ?? [];

  $: errors = $dataFrame.errors ?? [];
</script>

<!--
	@component

	Toolbar lets the user manage projects and views.
-->
<ViewToolbar variant="primary">
  <svelte:fragment slot="info">
    {#if errors.length}
      <Flair
        on:click={() => {
          new InspectorModal($app, "Project inspector", errors).open();
        }}
        >{`${errors.length} ${errors.length === 1 ? "error" : "errors"}`}</Flair
      >
    {/if}
  </svelte:fragment>

  <ProjectSelect slot="left" {projectId} {projects} {onProjectChange} />

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
            $i18n.t("modals.view.delete.message"),
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
  <Button
    slot="right"
    variant="primary"
    on:click={(event) => {
      const menu = new Menu();

      menu.addItem((item) => {
        item
          .setTitle($i18n.t("modals.project.create.short-title"))
          .setIcon("folder")
          .onClick(() => {
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
            ).open();
          });
      });

      if (project) {
        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.view.create.short-title"))
            .setIcon("table")
            .onClick(() => {
              if (project) {
                new AddViewModal($app, project, (projectId, view) => {
                  settings.addView(projectId, view);
                  onViewChange(view.id);
                }).open();
              }
            });
        });
        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.note.create.short-title"))
            .setIcon("file")
            .onClick(() => {
              if (project) {
                new CreateNoteModal(
                  $app,
                  project,
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
    {$i18n.t("toolbar.new")}
    <Icon accent name="chevron-down" />
  </Button>
</ViewToolbar>
