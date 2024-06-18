<script lang="ts">
  // import { Icon, IconButton, InternalLink, Typography } from "obsidian-svelte";
  import { Icon, IconButton, Typography } from "obsidian-svelte";
  import InternalLink from "src/ui/components/InternalLink.svelte";
  import CardMetadata from "src/ui/components/CardMetadata/CardMetadata.svelte";
  import ColorItem from "src/ui/components/ColorItem/ColorItem.svelte";

  import type { DataFrame, DataRecord } from "src/lib/dataframe/dataframe";
  import { createDataRecord } from "src/lib/dataApi";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  import CenterBox from "src/ui/modals/components/CenterBox.svelte";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  import { EditNoteModal } from "src/ui/modals/editNoteModal";
  import { getDisplayName } from "../Board/components/Board/boardHelpers";

  import { Card, CardContent, CardMedia } from "./components/Card";
  import Grid from "./components/Grid/Grid.svelte";
  import Image from "./components/Image/Image.svelte";
  import { GallerySettingsModal } from "./settings/settingsModal";
  import type { GalleryConfig } from "./types";
  import type { ProjectDefinition } from "src/settings/settings";
  import GalleryOptionsProvider from "./GalleryOptionsProvider.svelte";
  import { getCoverRealPath } from "./gallery";
  import { settings } from "src/lib/stores/settings";
  import { handleHoverLink } from "../helpers";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let config: GalleryConfig | undefined;
  export let onConfigChange: (config: GalleryConfig) => void;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  $: ({ fields, records } = frame);

  function handleRecordClick(record: DataRecord) {
    new EditNoteModal(
      $app,
      fields,
      (record) => api.updateRecord(record, fields),
      record
    ).open();
  }

  function handleSettings() {
    new GallerySettingsModal($app, config ?? {}, (value) => {
      saveConfig(value);
    }).open();
  }

  function saveConfig(cfg: GalleryConfig) {
    config = cfg;
    onConfigChange(cfg);
  }
</script>

<GalleryOptionsProvider
  {fields}
  {config}
  onConfigChange={saveConfig}
  onSettings={handleSettings}
  let:fitStyle
  let:coverField
  let:cardWidth
>
  {#if records.length}
    <Grid {cardWidth}>
      {#each records as record (record.id)}
        {@const color = getRecordColor(record)}
        <Card>
          <CardMedia
            on:click={(event) => {
              let openEditor =
                $settings.preferences.linkBehavior == "open-editor";

              if (event.metaKey || event.ctrlKey) {
                openEditor = !openEditor;
              }

              if (openEditor) {
                handleRecordClick(record);
              } else {
                $app.workspace.openLinkText(record.id, "", true);
              }
            }}
          >
            {@const coverPath = getCoverRealPath($app, record, coverField)}

            {#if coverPath}
              <Image alt="Title" src={coverPath} fit={fitStyle} />
            {:else}
              <Icon name="image" size="lg" />
            {/if}
          </CardMedia>
          <CardContent>
            <ColorItem {color}>
              <InternalLink
                slot="header"
                linkText={record.id}
                sourcePath={record.id}
                resolved
                on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                  let openEditor =
                    $settings.preferences.linkBehavior == "open-editor";

                  if (newLeaf) {
                    openEditor = !openEditor;
                  }

                  if (openEditor) {
                    handleRecordClick(record);
                  } else {
                    $app.workspace.openLinkText(linkText, sourcePath, true);
                  }
                }}
                on:hover={({ detail: { event, sourcePath } }) => {
                  handleHoverLink(event, sourcePath);
                }}
              >
                {getDisplayName(record.id)}
              </InternalLink>
              <CardMetadata
                fields={fields.filter(
                  (field) => !!config?.includeFields?.includes(field.name)
                )}
                {record}
              />
            </ColorItem>
          </CardContent>
        </Card>
      {/each}
      <IconButton
        icon="plus"
        size="lg"
        onClick={() => {
          new CreateNoteModal($app, project, (name, templatePath, project) => {
            api.addRecord(
              createDataRecord(name, project),
              fields,
              templatePath
            );
          }).open();
        }}
      />
    </Grid>
  {:else}
    <CenterBox>
      <Typography variant="h5">{$i18n.t("views.gallery.empty")}</Typography>
    </CenterBox>
  {/if}
</GalleryOptionsProvider>
