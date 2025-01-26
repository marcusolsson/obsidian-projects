<script lang="ts">
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
    TextInput,
    NumberInput,
    // DateInput,
    // DatetimeInput,
    Switch,
  } from "obsidian-svelte";
  import { TagsInput } from "src/ui/components/TagsInput";
  import MultiTextInput from "src/ui/components/MultiTextInput/MultiTextInput.svelte";
  import dayjs from "dayjs";
  import {
    DataFieldType,
    type Optional,
    type DataField,
    type DataValue,
  } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { onMount } from "svelte";
  import DateInput from "src/ui/components/DateInput.svelte";
  import DatetimeInput from "src/ui/components/DatetimeInput.svelte";

  export let existingFields: DataField[];
  export let defaultName: string;
  let inputRef: HTMLInputElement;

  export let field: DataField = {
    name: defaultName,
    type: DataFieldType.String,
    repeated: false,
    derived: false,
    identifier: false,
  };

  let value: Optional<DataValue> = ""; // text, number and boolean
  let listValue: string = "[]";
  let dateValue: Optional<Date> = new Date();

  export let onCreate: (field: DataField, value: Optional<DataValue>) => void;

  $: fieldNameError = validateFieldName(field.name);

  function validateFieldName(fieldName: string) {
    if (fieldName.trim() === "") {
      return $i18n.t("modals.field.create.empty-name-error");
    }

    if (existingFields.findIndex((field) => field.name === fieldName) !== -1) {
      return $i18n.t("modals.field.create.existing-name-error");
    }

    return "";
  }

  type Conversions = {
    [K in DataFieldType]: {
      [L in DataFieldType]: (v: any) => any;
    };
  };

  const conversions: Conversions = {
    [DataFieldType.String]: {
      [DataFieldType.String]: (v: string) => v,
      [DataFieldType.Number]: (v: number) => v.toString(),
      [DataFieldType.Boolean]: (v: boolean) => v.toString(),
      [DataFieldType.Date]: (v: string) => v.toString(),
      [DataFieldType.List]: (v: Array<string>) => v.toString(),
      [DataFieldType.Unknown]: () => null,
    },
    [DataFieldType.Number]: {
      [DataFieldType.String]: (v: string) => parseInt(v),
      [DataFieldType.Number]: (v: number) => v,
      [DataFieldType.Boolean]: (v: boolean) => (v ? 1 : 0),
      [DataFieldType.Date]: (v: string) => dayjs(v).toDate().getTime(),
      [DataFieldType.List]: (v: Array<string>) => parseInt(v.toString()),
      [DataFieldType.Unknown]: () => null,
    },
    [DataFieldType.Boolean]: {
      [DataFieldType.String]: (v: string) => !!v,
      [DataFieldType.Number]: (v: number) => !!v,
      [DataFieldType.Boolean]: (v: boolean) => v,
      [DataFieldType.Date]: (v: string) => !!v,
      [DataFieldType.List]: (v: Array<string>) => !!v.toString(),
      [DataFieldType.Unknown]: () => null,
    },
    [DataFieldType.Date]: {
      [DataFieldType.String]: (v: string) => dayjs(v).format("YYYY-MM-DD"),
      [DataFieldType.Number]: (v: number) => dayjs(v).format("YYYY-MM-DD"),
      [DataFieldType.Boolean]: () => dayjs().format("YYYY-MM-DD"),
      [DataFieldType.Date]: (v: string) => v,
      [DataFieldType.List]: (v: Array<string>) =>
        dayjs(v.toString()).format("YYYY-MM-DD"),
      [DataFieldType.Unknown]: () => null,
    },
    [DataFieldType.List]: {
      [DataFieldType.String]: (v: string) => [v],
      [DataFieldType.Number]: (v: number) => [v],
      [DataFieldType.Boolean]: (v: boolean) => [v],
      [DataFieldType.Date]: (v: string) => [v],
      [DataFieldType.List]: (v: Array<string>) => v,
      [DataFieldType.Unknown]: () => null,
    },
    [DataFieldType.Unknown]: {
      [DataFieldType.String]: () => null,
      [DataFieldType.Number]: () => null,
      [DataFieldType.Boolean]: () => null,
      [DataFieldType.Date]: () => null,
      [DataFieldType.List]: () => null,
      [DataFieldType.Unknown]: () => null,
    },
  };

  function convert(
    origValue: Optional<DataValue>,
    from: DataFieldType,
    to: DataFieldType
  ) {
    if (origValue === undefined || origValue === null) {
      return null;
    }

    // list and date uses separated values to avoid conversion runs into chaos
    if (
      to === DataFieldType.List ||
      to === DataFieldType.Date ||
      from === DataFieldType.List ||
      from === DataFieldType.Date
    ) {
      return origValue;
    }

    return conversions[to][from](origValue);
  }

  function handleTypeChange(event: CustomEvent<string>) {
    const from = field.type;
    const to = event.detail as DataFieldType;
    if (to === DataFieldType.List) {
      field = {
        ...field,
        type: to,
        repeated: true,
      };
    } else {
      value = convert(value, from, to);
      field = {
        ...field,
        type: to,
        repeated: false,
      };
    }
  }

  function handleOptionsChange(textOptions: string[]) {
    field = {
      ...field,
      typeConfig: {
        ...field.typeConfig,
        options: textOptions,
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

  function handleTimeChange({ detail: time }: CustomEvent<boolean>) {
    field = {
      ...field,
      typeConfig: {
        ...field.typeConfig,
        time,
      },
    };
  }

  const options = [
    { label: $i18n.t("data-types.string"), value: DataFieldType.String },
    { label: $i18n.t("data-types.number"), value: DataFieldType.Number },
    { label: $i18n.t("data-types.boolean"), value: DataFieldType.Boolean },
    { label: $i18n.t("data-types.date"), value: DataFieldType.Date },
    { label: $i18n.t("data-types.list"), value: DataFieldType.List },
  ];

  onMount(() => {
    if (inputRef) inputRef.select();
  });
</script>

<ModalLayout title={$i18n.t("modals.field.create.title")}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("modals.field.create.name.name")}
      description={$i18n.t("modals.field.create.name.description") ?? ""}
    >
      <TextInput
        bind:ref={inputRef}
        value={field.name}
        on:input={(event) => (field = { ...field, name: event.detail })}
        autoFocus
        error={!!fieldNameError}
        helperText={fieldNameError}
        on:keydown={(ev) => {
          if (ev.key === "Enter" && !fieldNameError) {
            ev.preventDefault();
            onCreate(field, value);
          }
        }}
      />
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.field.create.type.name")}
      description={$i18n.t("modals.field.create.type.description")}
    >
      <Select value={field.type} {options} on:change={handleTypeChange} />
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.field.create.default.name")}
      description={$i18n.t("modals.field.create.default.description")}
    >
      {#if field.type === DataFieldType.List}
        <TagsInput
          value={JSON.parse(listValue)}
          on:change={(event) => {
            listValue = event.detail;
          }}
        />
      {:else if field.type === DataFieldType.String}
        <TextInput
          value={value?.toString() ?? ""}
          on:input={(event) => (value = event.detail)}
          on:keydown={(ev) => {
            if (ev.key === "Enter" && !fieldNameError) {
              ev.preventDefault();
              onCreate(field, value);
            }
          }}
        />
      {:else if field.type === DataFieldType.Number}
        <NumberInput
          bind:ref={inputRef}
          value={parseInt((value ?? "").toString())}
          on:input={(event) => (value = event.detail)}
          on:keydown={(ev) => {
            if (ev.key === "Enter" && !fieldNameError) {
              ev.preventDefault();
              onCreate(field, value);
            }
          }}
        />
      {:else if field.type === DataFieldType.Date}
        {#if field.typeConfig?.time}
          <DatetimeInput
            value={dateValue ?? new Date()}
            on:input={({ detail: value }) => {
              dateValue = value;
            }}
          />
        {:else}
          <DateInput
            value={dateValue ?? new Date()}
            on:input={({ detail: value }) => {
              dateValue = value;
            }}
          />
        {/if}
      {:else if field.type === DataFieldType.Boolean}
        <Switch
          checked={value ? true : false}
          on:check={(ev) => {
            value = ev.detail;
          }}
        />
      {/if}
    </SettingItem>
    {#if !field.repeated && field.type === DataFieldType.String}
      <SettingItem
        name={$i18n.t("modals.field.create.options.name")}
        description={$i18n.t("modals.field.create.options.description")}
        vertical
      >
        <MultiTextInput
          options={field.typeConfig?.options ?? []}
          onChange={handleOptionsChange}
        />
      </SettingItem>
      <SettingItem
        name={$i18n.t("modals.field.configure.rich-text.name")}
        description={$i18n.t("modals.field.configure.rich-text.description")}
      >
        <Switch
          checked={field.typeConfig?.richText ?? false}
          on:check={handleRichTextChange}
        />
      </SettingItem>
    {/if}
    {#if !field.repeated && field.type === DataFieldType.Date}
      <SettingItem
        name={$i18n.t("modals.field.configure.time.name")}
        description={$i18n.t("modals.field.configure.time.description")}
      >
        <Switch
          checked={field.typeConfig?.time ?? false}
          on:check={handleTimeChange}
        />
      </SettingItem>
    {/if}
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant={"primary"}
      disabled={!!fieldNameError}
      on:click={() => {
        if (field.repeated) {
          onCreate(
            { ...field, type: DataFieldType.String }, // remove the temporary `list` type declaration
            JSON.parse(listValue)
          );
        } else if (field.type === DataFieldType.Date) {
          onCreate(
            field,
            // If no date(time) value specified still add today's date / current time
            dayjs(dateValue ?? "").format(
              field.typeConfig?.time ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"
            )
          );
        } else if (field.type === DataFieldType.String) {
          // uniquify options items and omit empty
          if (field?.typeConfig && field.typeConfig?.options) {
            const options = field.typeConfig.options;
            field = {
              ...field,
              typeConfig: {
                ...field.typeConfig,
                options: [...new Set(options)].filter((v) => v !== ""),
              },
            };
          }
          onCreate(field, value);
        } else {
          onCreate(field, value);
        }
      }}
    >
      {$i18n.t("modals.field.create.create")}
    </Button>
  </ModalButtonGroup>
</ModalLayout>
