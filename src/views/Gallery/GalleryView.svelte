<script lang="ts">
  import { Icon, InternalLink, Select, Typography } from "obsidian-svelte";

  import { Field } from "src/components/Field";
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/components/Layout";
  import {
    DataFieldType,
    isLink,
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
  import { getDisplayName } from "../Board/components/Board/board-helpers";

  import { Card, CardContent, CardMedia } from "./components/Card";
  import Grid from "./components/Grid/Grid.svelte";
  import Image from "./components/Image/Image.svelte";
  import SwitchButton from "./components/SwitchButton/SwitchButton.svelte";
  import type { GalleryConfig, FitProp } from "./types";
  import { Crop, Fit } from "./types";

  export let frame: DataFrame;
  export let config: GalleryConfig | undefined;
  export let onConfigChange: (config: GalleryConfig) => void;
  export let api: ViewApi;

  $: ({ fields, records } = frame);

  $: textFields = fields
    .filter((field) => !field.repeated)
    .filter(
      (field) =>
        field.type === DataFieldType.String || field.type === DataFieldType.Link
    );
  $: coverField = textFields.find((field) => config?.coverField === field.name);
  $: objectFit = config?.objectFit ?? Crop;

  function getCoverRealPath(record: DataRecord) {
    if (!coverField) {
      return null;
    }

    const coverPath = record.values[coverField.name];

    if (!coverPath) {
      return null;
    }

    if (isString(coverPath)) {
      if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
        return coverPath;
      }
      return getResourcePathFromLinkText(coverPath);
    }

    if (isLink(coverPath)) {
      return getResourcePathFromLinkText(coverPath.linkText);
    }

    return null;
  }

  function getResourcePathFromLinkText(text: string) {
    const file = $app.metadataCache.getFirstLinkpathDest(text, "");

    if (file) {
      if (
        ["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(file.extension)
      ) {
        return $app.vault.getResourcePath(file);
      }
    }

    return null;
  }

  function handleCoverFieldChange(coverField: string) {
    onConfigChange({ ...config, coverField });
  }

  function handleSwitchButtonClick(fitStyle: FitProp | undefined) {
    if (fitStyle?.label == "Crop")
      onConfigChange({ ...config, objectFit: Fit });
    else if (fitStyle?.label == "Fit")
      onConfigChange({ ...config, objectFit: Crop });
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

<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <svelte:fragment slot="right">
        <Field name={$i18n.t("views.gallery.fields.cover")}>
          <Select
            allowEmpty
            value={coverField?.name ?? ""}
            options={textFields.map(fieldToSelectableValue)}
            placeholder={$i18n.t("views.gallery.fields.none") ?? ""}
            on:change={({ detail }) => handleCoverFieldChange(detail)}
          />
        </Field>
        {#if config?.coverField}
          <SwitchButton
            on:click={() => handleSwitchButtonClick(objectFit)}
            icon={objectFit?.icon ?? "slash"}
            label={objectFit?.label ?? "Unset"}
          />
        {:else}
          <SwitchButton
            on:click={() => handleSwitchButtonClick(objectFit)}
            icon={objectFit?.icon ?? "slash"}
            label={objectFit?.label ?? "Unset"}
            disabled={true}
          />
        {/if}
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
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
                  <Image
                    alt="Title"
                    src={coverPath}
                    fit={objectFit?.style ?? "fill"}
                  />
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
                      $app.workspace.openLinkText(
                        linkText,
                        sourcePath,
                        newLeaf
                      );
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
  </ViewContent>
</ViewLayout>

<style>
  div {
    padding: 24px;
  }
</style>
