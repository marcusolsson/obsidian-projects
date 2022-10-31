<script lang="ts">
  import { Icon, InternalLink, Select, Typography } from "obsidian-svelte";
  import path from "path";
  import { Field } from "src/components/Field";
  import { HorizontalGroup } from "src/components/HorizontalGroup";
  import { ToolBar } from "src/components/ToolBar";
  import {
    DataFieldType,
    isString,
    type DataFrame,
    type DataRecord,
  } from "src/lib/data";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/view-api";
  import CenterBox from "src/modals/components/CenterBox.svelte";
  import { EditNoteModal } from "src/modals/edit-note-modal";
  import { fieldToSelectableValue } from "src/views/helpers";
  import Card from "./components/Card/Card.svelte";
  import CardContent from "./components/Card/CardContent.svelte";
  import CardMedia from "./components/Card/CardMedia.svelte";
  import Grid from "./components/Grid/Grid.svelte";
  import Image from "./components/Image/Image.svelte";
  import type { GalleryConfig } from "./types";

  export let frame: DataFrame;
  export let config: GalleryConfig | undefined;
  export let onConfigChange: (config: GalleryConfig) => void;
  export let api: ViewApi;

  $: ({ fields, records } = frame);

  $: textFields = fields.filter((field) => field.type === DataFieldType.String);
  $: coverField = textFields.find((field) => config?.coverField === field.name);

  function getCoverRealPath(record: DataRecord) {
    if (!coverField) {
      return null;
    }

    const coverPath = record.values[coverField.name];

    if (!coverPath || !isString(coverPath)) {
      return null;
    }

    if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
      return coverPath;
    }

    const file = $app.metadataCache.getFirstLinkpathDest(coverPath, "");

    if (file) {
      if (
        ["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(file.extension)
      ) {
        return $app.vault.getResourcePath(file);
      }
    }

    return null;
  }

  function getDisplayName(record: DataRecord): string {
    const basename = path.basename(record.id);
    return basename.slice(0, basename.lastIndexOf("."));
  }

  function handleCoverFieldChange(coverField: string) {
    onConfigChange({ ...config, coverField });
  }

  function handleRecordClick(record: DataRecord) {
    new EditNoteModal(
      $app,
      fields,
      (record) => api.updateRecord(record, fields),
      record
    ).open();
  }
</script>

<ToolBar>
  <p />
  <HorizontalGroup>
    <Field name={$i18n.t("views.gallery.fields.cover")}>
      <Select
        allowEmpty
        value={coverField?.name ?? ""}
        options={textFields.map(fieldToSelectableValue)}
        placeholder={$i18n.t("views.gallery.fields.none") ?? ""}
        on:change={({ detail }) => handleCoverFieldChange(detail)}
      />
    </Field>
  </HorizontalGroup>
</ToolBar>
{#if records.length}
  <div>
    <Grid>
      {#each records as record}
        <Card>
          <CardMedia
            on:click={(event) => {
              if (event.metaKey || event.ctrlKey) {
                $app.workspace.openLinkText(record.id, "", true);
              } else {
                handleRecordClick(record);
              }
            }}
          >
            {@const coverPath = getCoverRealPath(record)}
            {#if coverPath}
              <Image alt="Title" src={coverPath} fit="cover" />
            {:else}
              <Icon name="image" size="lg" />
            {/if}
          </CardMedia>
          <CardContent>
            <InternalLink
              linkText={record.id}
              sourcePath=""
              resolved
              on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                if (newLeaf) {
                  $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
                } else {
                  handleRecordClick(record);
                }
              }}
            >
              {getDisplayName(record)}
            </InternalLink>
          </CardContent>
        </Card>
      {/each}
    </Grid>
  </div>
{:else}
  <CenterBox>
    <Typography variant="h5">{$i18n.t("views.gallery.empty")}</Typography>
  </CenterBox>
{/if}

<style>
  div {
    padding: 24px;
    overflow: auto;
  }
</style>
