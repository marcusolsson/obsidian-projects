<script lang="ts">
  import { Menu } from "obsidian";
  import { IconButton, Select } from "obsidian-svelte";

  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ConfirmDialogModal } from "src/modals/confirm-dialog";
  import { CreateProjectModal } from "src/modals/create-project-modal";
  import type { ProjectDefinition } from "src/types";

  export let projectId: string | undefined;
  export let projects: ProjectDefinition[];

  $: project = projects.find((project) => project.id === projectId);

  export let onProjectChange: (projectId: string) => void;
</script>

<span>
  <Select
    value={projectId ?? ""}
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
          item
            .setTitle($i18n.t("modals.project.edit.short-title"))
            .setIcon("edit")
            .onClick(() => {
              if (project) {
                new CreateProjectModal(
                  $app,
                  $i18n.t("modals.project.edit.title"),
                  $i18n.t("modals.project.edit.cta"),
                  settings.updateProject,
                  project
                ).open();
              }
            });
        });

        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.project.duplicate.title"))
            .setIcon("copy")
            .onClick(() => {
              if (projectId) {
                const id = settings.duplicateProject(projectId);
                onProjectChange(id);
              }
            });
        });

        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.project.delete.short-title"))
            .setIcon("trash")
            .onClick(() => {
              new ConfirmDialogModal(
                $app,
                $i18n.t("modals.project.delete.title"),
                $i18n.t("modals.project.delete.message"),
                $i18n.t("modals.project.delete.cta"),
                () => {
                  if (projectId) {
                    settings.deleteProject(projectId);
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

<style>
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
