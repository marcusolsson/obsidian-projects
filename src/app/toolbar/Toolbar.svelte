<script lang="ts">
  import { Menu } from "obsidian";
  import { Button, Icon } from "obsidian-svelte";

  import { CreateProjectModal } from "src/modals/create-project-modal";
  import { AddViewModal } from "src/modals/add-view-modal";
  import { CreateNoteModal } from "src/modals/create-note-modal";

  import { app } from "src/lib/stores/obsidian";
  import { api } from "src/lib/stores/api";
  import { i18n } from "src/lib/stores/i18n";
  import { settings } from "src/lib/stores/settings";

  import { createDataRecord, createProject } from "src/lib/data-api";

  import type { ProjectDefinition } from "src/types";
  import { ConfirmDialogModal } from "src/modals/confirm-dialog";

  import ProjectSelect from "./ProjectSelect.svelte";
  import ViewSelect from "./ViewSelect.svelte";
  import ViewToolbar from "../../components/Layout/ViewToolbar.svelte";

  export let projects: ProjectDefinition[];

  export let projectId: string | undefined;
  export let onProjectChange: (projectId: string) => void;

  export let viewId: string | undefined;
  export let onViewChange: (viewId: string) => void;

  $: project = projects.find((project) => project.id === projectId);
  $: views = project?.views ?? [];
</script>

<!--
	@component

	Toolbar lets the user manage projects and views.
-->
<ViewToolbar variant="primary">
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
