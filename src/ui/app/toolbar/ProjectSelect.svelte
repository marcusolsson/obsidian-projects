<script lang="ts">
  import { produce } from "immer";
  import { Menu, Notice } from "obsidian";
  import { IconButton, Select } from "obsidian-svelte";

  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ConfirmDialogModal } from "src/ui/modals/confirmDialog";
  import { CreateProjectModal } from "src/ui/modals/createProjectModal";
  import type { ProjectDefinition, ProjectId } from "src/settings/settings";
  import { Flair } from "src/ui/components/Flair";

  export let projectId: ProjectId | undefined;
  export let projects: ProjectDefinition[];

  $: project = projects.find((project) => project.id === projectId);

  export let onProjectChange: (projectId: ProjectId) => void;
  export let onProjectAdd: () => void;
</script>

<span>
  <Select
    value={projectId ?? ""}
    options={produce(
      projects.map((project) => ({
        label: project.name,
        value: project.id,
      })),
      (draft) => {
        draft.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        );
      }
    )}
    on:change={({ detail: value }) => onProjectChange(value)}
    placeholder={$i18n.t("toolbar.projects.none") ?? ""}
  />

  <IconButton
    icon="more-vertical"
    size="sm"
    disabled={!projects.length}
    tooltip={$i18n.t("toolbar.projects.options")}
    onClick={(event) => {
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
          .setTitle($i18n.t("modals.project.archive.short-title"))
          .setIcon("archive")
          .onClick(() => {
            new ConfirmDialogModal(
              $app,
              $i18n.t("modals.project.archive.title"),
              $i18n.t("modals.project.archive.message", {
                project: project?.name ?? "",
              }),
              $i18n.t("modals.project.archive.cta"),
              () => {
                if (projectId) {
                  if ($settings.archives.length === 0) {
                    new Notice($i18n.t("modals.project.archive.notice"), 15000);
                  }
                  settings.archiveProject(projectId);
                }
              }
            ).open();
          });
      });

      menu.addItem((item) => {
        item
          .setTitle($i18n.t("modals.project.delete.short-title"))
          .setIcon("trash")
          .setWarning(true)
          .onClick(() => {
            new ConfirmDialogModal(
              $app,
              $i18n.t("modals.project.delete.title"),
              $i18n.t("modals.project.delete.message", {
                project: project?.name ?? "",
              }),
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
  <IconButton
    icon="folder-plus"
    size="md"
    tooltip={$i18n.t("modals.project.create.title")}
    onClick={() => onProjectAdd()}
  />
  {#if project?.dataSource.kind === "dataview"}
    <Flair variant="primary" tooltip={$i18n.t("toolbar.read-only-desc") ?? ""}
      >{$i18n.t("toolbar.read-only")}</Flair
    >
  {/if}
</span>

<style>
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
