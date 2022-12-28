<script lang="ts">
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
    TextInput,
  } from "obsidian-svelte";
  import MultiTextInput from "src/components/MultiTextInput/MultiTextInput.svelte";
  import { DataFieldType, type DataField } from "src/lib/data";

  export let title: string;
  export let field: DataField;
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

  function handleTypeConfigChange(options: string[]) {
    field = {
      ...field,
      typeConfig: {
        options,
      },
    };
  }

  $: options = [
    { label: "Text", value: DataFieldType.String },
    { label: "Number", value: DataFieldType.Number },
    { label: "Checkbox", value: DataFieldType.Boolean },
    { label: "Date", value: DataFieldType.Date },
    { label: "Link", value: DataFieldType.Link },
    { label: "Unknown", value: DataFieldType.Unknown },
  ];
</script>

<ModalLayout {title}>
  <ModalContent>
    <SettingItem name="Name">
      <TextInput value={field.name} on:input={handleNameChange} />
    </SettingItem>
    <SettingItem name="Type">
      <Select
        disabled
        value={field.type}
        {options}
        on:change={handleTypeChange}
      />
    </SettingItem>
    {#if field.type === DataFieldType.String}
      <SettingItem
        name="Options"
        description="Predefined values for the field."
        vertical
      >
        <MultiTextInput
          options={field.typeConfig?.["options"] ?? []}
          onChange={handleTypeConfigChange}
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
