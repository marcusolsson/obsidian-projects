<script lang="ts">
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
    Switch,
    TextInput,
  } from "obsidian-svelte";
  import MultiTextInput from "src/ui/components/MultiTextInput/MultiTextInput.svelte";
  import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";

  export let title: string;
  export let field: DataField;
  export let editable: boolean;
  export let onSave: (field: DataField) => void;

  function handleNameChange(value: CustomEvent<string>) {
    field = {
      ...field,
      name: value.detail,
    };
  }

  function handleTypeChange(value: CustomEvent<string>) {
    field = {
      ...field,
      type: value.detail as DataFieldType,
    };
  }

  function handleOptionsChange(options: string[]) {
    field = {
      ...field,
      typeConfig: {
        ...field.typeConfig,
        options,
      },
    };
  }

  function handleRichTextChange({ detail: richText }: CustomEvent<boolean>) {
    field = {
      ...field,
      typeConfig: {
        ...field.typeConfig,
        richText,
      },
    };
  }

  $: options = [
    { label: "Text", value: DataFieldType.String },
    { label: "Number", value: DataFieldType.Number },
    { label: "Checkbox", value: DataFieldType.Boolean },
    { label: "Date", value: DataFieldType.Date },
    { label: "Unknown", value: DataFieldType.Unknown },
  ];
</script>

<ModalLayout {title}>
  <ModalContent>
    <SettingItem name="Name">
      <TextInput
        readonly={!editable}
        value={field.name}
        on:input={handleNameChange}
      />
    </SettingItem>
    <SettingItem name="Type" description="Changing type isn't supported yet.">
      <Select
        disabled
        value={field.type}
        {options}
        on:change={handleTypeChange}
      />
    </SettingItem>
    {#if field.type === DataFieldType.String && !field.repeated && !field.identifier}
      <SettingItem
        name="Options"
        description="Allows you to auto-complete using predefined values for the field."
        vertical
      >
        <MultiTextInput
          options={field.typeConfig?.options ?? []}
          onChange={handleOptionsChange}
        />
      </SettingItem>
      <SettingItem
        name="Enable rich text formatting"
        description="For fields with Markdown content."
      >
        <Switch
          checked={field.typeConfig?.richText ?? false}
          on:check={handleRichTextChange}
        />
      </SettingItem>
    {/if}
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant="primary"
      on:click={() => {
        onSave(field);
      }}>Save</Button
    >
  </ModalButtonGroup>
</ModalLayout>
