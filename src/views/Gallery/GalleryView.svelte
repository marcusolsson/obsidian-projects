<script lang="ts">
  import {
    Icon,
    IconButton,
    InternalLink,
    Select,
    Typography,
  } from "obsidian-svelte";
  import CardMetadata from "src/components/CardMetadata/CardMetadata.svelte";
  import ColorItem from "src/components/ColorItem/ColorItem.svelte";

  import { Field } from "src/components/Field";
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/components/Layout";
  import {
    DataFieldType,
    isString,
    type DataFrame,
    type DataRecord,
  } from "src/lib/data";
  import { createDataRecord } from "src/lib/data-api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/view-api";
  import CenterBox from "src/modals/components/CenterBox.svelte";
  import { CreateNoteModal } from "src/modals/create-note-modal";
  import { EditNoteModal } from "src/modals/edit-note-modal";
  import { fieldToSelectableValue } from "src/views/helpers";
  import { getDisplayName } from "../Board/components/Board/board-helpers";
  import { SwitchSelect } from "../Table/components/SwitchSelect";

  import { Card, CardContent, CardMedia } from "./components/Card";
  import Grid from "./components/Grid/Grid.svelte";
  import Image from "./components/Image/Image.svelte";
  import { parseObsidianLink } from "./helpers";
  import { GallerySettingsModal } from "./settings/settings-modal";
  import type { GalleryConfig } from "./types";
  import type { ProjectDefinition } from "src/settings/settings";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let config: GalleryConfig | undefined;
  export let onConfigChange: (config: GalleryConfig) => void;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  function saveConfig(cfg: GalleryConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  $: ({ fields, records } = frame);

  $: textFields = fields
    .filter((field) => !field.repeated)
    .filter((field) => field.type === DataFieldType.String);
  $: coverField = textFields.find((field) => config?.coverField === field.name);
  $: fitStyle = config?.fitStyle ?? "cover";

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

    return null;
  }

  function getResourcePathFromLinkText(text: string) {
    const linkText = parseObsidianLink(text)?.linkText || text;

    const file = $app.metadataCache.getFirstLinkpathDest(linkText, "");

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
    saveConfig({ ...config, coverField });
  }

  function handleFitStyleChange(fitStyle: string) {
    saveConfig({ ...config, fitStyle });
  }

  function handleIncludeFieldChange(field: string, enabled: boolean) {
    const includedFields = new Set(config?.includeFields);

    if (enabled) {
      includedFields.add(field);
    } else {
      includedFields.delete(field);
    }

    saveConfig({ ...config, includeFields: [...includedFields] });
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
        <Select
          value={config?.fitStyle ?? "cover"}
          options={[
            {
              label: "Fill image",
              value: "cover",
            },
            {
              label: "Fit image",
              value: "contain",
            },
          ]}
          on:change={({ detail }) => handleFitStyleChange(detail)}
        />
        <SwitchSelect
          label={"Include fields"}
          items={fields.map((field) => ({
            label: field.name,
            value: field.name,
            enabled: !!config?.includeFields?.includes(field.name),
          }))}
          onChange={handleIncludeFieldChange}
        />
        <IconButton
          icon="settings"
          onClick={() => {
            new GallerySettingsModal($app, config ?? {}, (value) => {
              saveConfig(value);
            }).open();
          }}
        />
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    {#if records.length}
      <div class="padding">
        <Grid cardWidth={config?.cardWidth ?? 300}>
          {#each records as record (record.id)}
            {@const color = getRecordColor(record)}
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
                    sourcePath=""
                    resolved
                    on:open={({
                      detail: { linkText, sourcePath, newLeaf },
                    }) => {
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
              new CreateNoteModal(
                $app,
                project,
                (name, templatePath, project) => {
                  api.addRecord(createDataRecord(name, project), templatePath);
                }
              ).open();
            }}
          />
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
  .padding {
    padding: 24px;
  }
</style>
