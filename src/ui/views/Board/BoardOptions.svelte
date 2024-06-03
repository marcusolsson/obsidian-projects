<script lang="ts">
  import { IconButton, Select } from "obsidian-svelte";

  import { Field } from "src/ui/components/Field";
  import { SwitchSelect } from "../Table/components/SwitchSelect";
  import { i18n } from "src/lib/stores/i18n";
  import { fieldIcon, fieldToSelectableValue } from "../helpers";
  import { getFieldsByType } from "./board";
  import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
  import { getFieldByName } from "src/ui/app/toolbar/viewOptions/filter/helpers";

  export let fields: DataField[];

  export let statusField: string | undefined;
  export let checkField: string | undefined;
  export let onStatusFieldChange: (field: DataField | undefined) => void;
  export let onCheckFieldChange: (field: DataField | undefined) => void;

  export let includedFields: string[];
  export let onIncludedFieldsChange: (fields: string[]) => void;

  export let onSettings: () => void;

  $: groupByField = statusField
    ? getFieldByName(fields, statusField)
    : undefined;
  $: booleanField = checkField ? getFieldByName(fields, checkField) : undefined;

  $: validGroupByFields = getFieldsByType(
    fields,
    DataFieldType.String,
    DataFieldType.Number
  );
  $: validBooleanFields = getFieldsByType(fields, DataFieldType.Boolean);

  function handleStatusChange(event: CustomEvent<string>) {
    onStatusFieldChange(getFieldByName(fields, event.detail));
  }

  function handleCheckFieldChange(event: CustomEvent<string>) {
    onCheckFieldChange(getFieldByName(fields, event.detail));
  }

  function handleIncludedFieldsChange(field: string, enabled: boolean) {
    const uniqueFields = new Set(includedFields);

    if (enabled) {
      uniqueFields.add(field);
    } else {
      uniqueFields.delete(field);
    }

    onIncludedFieldsChange([...uniqueFields]);
  }
</script>

<!--
    @component

    BoardOptions handles logic for updating fields used by the board.
-->
<Field name={$i18n.t("views.board.fields.status")}>
  <Select
    value={groupByField?.name ?? ""}
    on:change={handleStatusChange}
    options={validGroupByFields.map(fieldToSelectableValue)}
    placeholder={$i18n.t("views.board.fields.none") ?? ""}
    allowEmpty
  />
</Field>
<Field name={$i18n.t("views.board.fields.check")}>
  <Select
    allowEmpty
    value={booleanField?.name ?? ""}
    options={validBooleanFields.map(fieldToSelectableValue)}
    placeholder={$i18n.t("views.board.fields.none") ?? ""}
    on:change={handleCheckFieldChange}
  />
</Field>
<SwitchSelect
  label={$i18n.t("views.board.include-fields")}
  items={fields.map((field) => ({
    label: field.name,
    icon: fieldIcon(field),
    value: field.name,
    enabled: includedFields.includes(field.name),
  }))}
  onChange={handleIncludedFieldsChange}
/>
<IconButton icon="settings" onClick={onSettings} />
