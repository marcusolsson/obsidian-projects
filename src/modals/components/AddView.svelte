<script lang="ts">
  import { v4 as uuidv4 } from "uuid";

  import type { ViewDefinition, ViewType, ProjectDefinition } from "src/types";

  import {
    Button,
    TextInput,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
  } from "obsidian-svelte";

  import { customViews } from "src/lib/stores/custom-views";
  import { i18n } from "src/lib/stores/i18n";
  import { settings } from "src/lib/stores/settings";

  import { nextUniqueViewName } from "src/lib/helpers";

  export let onSave: (projectId: string, view: ViewDefinition) => void;
  export let project: ProjectDefinition;

  let name: string = "";
  let type: ViewType = "table";

  const selectableCustomViews = Object.entries($customViews).map(
    ([id, create]) => {
      const view = create();

      return {
        label: view.getDisplayName(),
        value: id,
      };
    }
  );

  const options = [
    { label: $i18n.t("views.table.name"), value: "table" },
    ...selectableCustomViews,
  ];

  $: selectedOption = options.find((option) => option.value === type);

  $: nameError = validateName(name);

  function validateName(name: string) {
    if (project.views.find((view) => view.name === name)) {
      return $i18n.t("modals.view.create.existing-name-error");
    }
    return "";
  }
</script>

<ModalLayout title={$i18n.t("modals.view.create.title")}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("modals.view.create.type.name")}
      description={$i18n.t("modals.view.create.type.description") ?? ""}
    >
      <Select
        value={type}
        {options}
        on:change={({ detail: value }) => {
          type = value;
        }}
      />
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.view.create.name.name")}
      description={$i18n.t("modals.view.create.name.description") ?? ""}
    >
      <TextInput
        value={name}
        on:input={({ detail: value }) => (name = value)}
        placeholder={$i18n.t("modals.view.create.optional") ?? ""}
        error={!!nameError}
        helperText={nameError}
      />
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.note.create.project.name")}
      description={$i18n.t("modals.note.create.project.description") ?? ""}
    >
      <Select
        value={project.id}
        on:change={({ detail: id }) => {
          const res = $settings.projects.find((w) => w.id === id);
          if (res) {
            project = res;
          }
        }}
        options={$settings.projects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
      />
    </SettingItem>
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant="primary"
      on:click={() => {
        onSave(project.id, {
          id: uuidv4(),
          name:
            name ||
            nextUniqueViewName(project.views, selectedOption?.label ?? type),
          type,
          config: {},
        });
      }}>{$i18n.t("modals.view.create.cta")}</Button
    >
  </ModalButtonGroup>
</ModalLayout>
