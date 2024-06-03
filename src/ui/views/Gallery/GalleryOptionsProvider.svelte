<script lang="ts">
  import { IconButton, Select } from "obsidian-svelte";
  import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { Field } from "src/ui/components/Field";
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/ui/components/Layout";
  import { SwitchSelect } from "../Table/components/SwitchSelect";
  import { fieldIcon, fieldToSelectableValue } from "../helpers";
  import type { GalleryConfig } from "./types";

  export let fields: DataField[];
  export let config: GalleryConfig | undefined;
  export let onConfigChange: (config: GalleryConfig) => void;
  export let onSettings: () => void;

  $: textFields = fields
    .filter((field) => !field.repeated)
    .filter((field) => field.type === DataFieldType.String);

  $: coverField = textFields.find((field) => config?.coverField === field.name);

  $: fitStyle = config?.fitStyle ?? "cover";

  $: cardWidth = config?.cardWidth ?? 300;

  function handleCoverFieldChange(coverField: string) {
    onConfigChange({ ...config, coverField });
  }

  function handleFitStyleChange(fitStyle: string) {
    onConfigChange({ ...config, fitStyle });
  }

  function handleIncludeFieldChange(field: string, enabled: boolean) {
    const includedFields = new Set(config?.includeFields ?? []);

    if (enabled) {
      includedFields.add(field);
    } else {
      includedFields.delete(field);
    }

    onConfigChange({ ...config, includeFields: [...includedFields] });
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
              label: $i18n.t("views.gallery.fit-style.fill"),
              value: "cover",
            },
            {
              label: $i18n.t("views.gallery.fit-style.fit"),
              value: "contain",
            },
          ]}
          on:change={({ detail }) => handleFitStyleChange(detail)}
        />
        <SwitchSelect
          label={$i18n.t("views.gallery.include-fields")}
          items={fields.map((field) => ({
            label: field.name,
            icon: fieldIcon(field),
            value: field.name,
            enabled: !!config?.includeFields?.includes(field.name),
          }))}
          onChange={handleIncludeFieldChange}
        />
        <IconButton icon="settings" onClick={onSettings} />
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent padding>
    <slot {fitStyle} {coverField} {cardWidth} />
  </ViewContent>
</ViewLayout>
