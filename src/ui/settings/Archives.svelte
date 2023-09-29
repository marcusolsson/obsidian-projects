<script lang="ts">
  import {
    Callout,
    IconButton,
    SettingItem,
    Typography,
  } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ConfirmDialogModal } from "src/ui/modals/confirmDialog";
  import type { ProjectDefinition } from "src/settings/settings";

  $: ({ archives } = $settings);

  const dataSourceDetail = (archive: ProjectDefinition) => {
    switch (archive.dataSource.kind) {
      case "folder":
        return `${$i18n.t("datasources.folder")} path: "${
          archive.dataSource.config.path
        }"`;
      case "tag":
        return `${$i18n.t("datasources.tag")}: ${
          archive.dataSource.config.tag
        }`;
      case "dataview":
        return `${$i18n.t("datasources.dataview")} query: ${
          archive.dataSource.config.query
        }`;
    }
  };

  const getDescription = (archive: ProjectDefinition) => {
    const viewCount = `${archive.views.length} views.`;
    const detail = dataSourceDetail(archive);
    return [viewCount, detail].join(" ");
  };
</script>

{#if !archives.length}
  <Callout title={"Info"} icon="info" variant="info">
    <Typography variant="body">No archived project.</Typography>
  </Callout>
{:else}
  {#each archives as archive}
    <SettingItem name={`${archive.name}`} description={getDescription(archive)}>
      <IconButton
        icon="archive-restore"
        tooltip="Restore this archive"
        onClick={() => settings.restoreArchive(archive.id)}
      />
      <IconButton
        icon="trash-2"
        tooltip="Delete this archive"
        onClick={() => {
          new ConfirmDialogModal(
            $app,
            $i18n.t("modals.archive.delete.title"),
            $i18n.t("modals.archive.delete.message", {
              archive: archive?.name ?? "",
            }),
            $i18n.t("modals.project.delete.cta"),
            () => {
              settings.deleteArchive(archive.id);
            }
          ).open();
        }}
      />
    </SettingItem>
  {/each}
{/if}
