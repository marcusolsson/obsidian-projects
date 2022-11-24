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
  import { v4 as uuidv4 } from "uuid";

  import { nextUniqueViewName } from "src/lib/helpers";
  import { customViews } from "src/lib/stores/custom-views";
  import { i18n } from "src/lib/stores/i18n";
  import { settings } from "src/lib/stores/settings";
  import type { ProjectDefinition, ViewDefinition, ViewType } from "src/types";

  export let onSave: (projectId: string, view: ViewDefinition) => void;
  export let project: ProjectDefinition;

  let name: string = "";
  let type: ViewType = "table";

  const options = Object.values($customViews).map((view) => {
    return {
      label: view.getDisplayName(),
      value: view.getViewType(),
    };
  });

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
