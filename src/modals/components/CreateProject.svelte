<script lang="ts">
  import moment from "moment";
  import {
    Button,
    Callout,
    FileAutocomplete,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    SettingItem,
    Switch,
    Select,
    TextArea,
    TextInput,
  } from "obsidian-svelte";

  import { FileListInput } from "src/components/FileListInput";
  import { notEmpty } from "src/lib/helpers";
  import { getFoldersInFolder, isValidPath } from "src/lib/obsidian";
  import { capabilities } from "src/lib/stores/capabilities";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { interpolateTemplate } from "src/lib/templates";
  import { WorkspaceDataviewEnum, type ProjectDefinition } from "src/types";

  export let title: string;
  export let cta: string;
  export let onSave: (project: ProjectDefinition) => void;
  export let project: ProjectDefinition;

  let originalName = project.name;

  $: projects = $settings.projects;

  $: defaultName = interpolateTemplate(project.defaultName ?? "", {
    date: (format) => moment().format(format || "YYYY-MM-DD"),
    time: (format) => moment().format(format || "HH:mm"),
  });

  $: ({ name } = project);
  $: nameError = validateName(name);

  function validateName(name: string) {
    if (name === originalName) {
      return "";
    }

    if (name === "") {
      return $i18n.t("modals.project.create.empty-name-error");
    }

    if (projects.find((project) => project.name === name)) {
      return $i18n.t("modals.project.create.existing-name-error");
    }

    return "";
  }
</script>

<ModalLayout {title}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("modals.project.name.name")}
      description={$i18n.t("modals.project.name.description") ?? ""}
    >
      <TextInput
        value={project.name}
        on:input={({ detail: name }) => (project = { ...project, name })}
        autoFocus
        error={!!nameError}
        helperText={nameError}
      />
    </SettingItem>
    <SettingItem
      name={$i18n.t("modals.project.default.name")}
      description={$i18n.t("modals.project.default.description") ?? ""}
    >
      <Switch
        checked={project.isDefault ?? false}
        on:check={({ detail: isDefault }) =>
          (project = { ...project, isDefault })}
      />
    </SettingItem>

    {#if project.dataview || $capabilities.dataview}
      <SettingItem
        name={$i18n.t("modals.project.dataview.name")}
        description={$i18n.t("modals.project.dataview.description") ?? ""}
      >
        <Switch
          checked={!!project.dataview}
          on:check={({ detail: dataview }) => {
            project = {
              ...project,
              dataview,
              dataviewType: project.dataviewType ?? WorkspaceDataviewEnum.Query,
            };
          }}
        />
      </SettingItem>
    {/if}

    {#if project.dataview}
      <SettingItem
        name={$i18n.t("modals.project.dataviewType.name")}
        description={$i18n.t("modals.project.dataviewType.description")}
      >
        <Select
          value={project.dataviewType ?? ""}
          options={[
            { label: "Query", value: WorkspaceDataviewEnum.Query },
            { label: "JS", value: WorkspaceDataviewEnum.JS },
          ]}
          on:change={({ detail: dataviewType }) =>
            (project = { ...project, dataviewType })}
        />
      </SettingItem>
    {/if}

    {#if project.dataview && !$capabilities.dataview}
      <Callout
        title={$i18n.t("modals.project.dataview.error.title")}
        icon="zap"
        variant="danger"
      >
        {$i18n.t("modals.project.dataview.error.message")}
      </Callout>
    {/if}

    {#if project.dataview}
      <!-- Dataview Query -->
      {#if project.dataviewType === WorkspaceDataviewEnum.Query}
        <SettingItem
          name={$i18n.t("modals.project.query.name")}
          description={$i18n.t("modals.project.query.description") ?? ""}
          vertical
        >
          <TextArea
            placeholder={`TABLE status AS "Status" FROM "Work"`}
            value={project.query ?? ""}
            on:input={({ detail: query }) => (project = { ...project, query })}
            rows={6}
            width="100%"
          />
        </SettingItem>
      {:else}
      <!-- Dataview JS Query -->
        <SettingItem
          name={$i18n.t("modals.project.jsQuery.name")}
          description={$i18n.t("modals.project.jsQuery.description") ?? ""}
          vertical
        >
          <TextArea
            placeholder={$i18n.t("modals.project.jsQuery.example")}
            value={project.jsQuery ?? ""}
            on:input={({ detail: jsQuery }) => (project = { ...project, jsQuery })}
            rows={6}
            width="100%"
          />
        </SettingItem>
      {/if}
      <!-- Dataview Query -->
    {:else}
      <SettingItem
        name={$i18n.t("modals.project.path.name")}
        description={$i18n.t("modals.project.path.description") ?? ""}
        vertical
      >
        <FileAutocomplete
          files={getFoldersInFolder($app.vault.getRoot())}
          value={project.path}
          on:change={({ detail: path }) => (project = { ...project, path })}
          getLabel={(file) => file.path}
          width="100%"
        />
      </SettingItem>

      <SettingItem
        name={$i18n.t("modals.project.recursive.name")}
        description={$i18n.t("modals.project.recursive.description") ?? ""}
      >
        <Switch
          checked={project.recursive}
          on:check={({ detail: recursive }) =>
            (project = { ...project, recursive })}
        />
      </SettingItem>
    {/if}

    <SettingItem
      name={$i18n.t("modals.project.defaultName.name")}
      description={$i18n.t("modals.project.defaultName.description") ?? ""}
      vertical
    >
      <TextInput
        value={project.defaultName ?? ""}
        on:input={({ detail: defaultName }) =>
          (project = { ...project, defaultName })}
        width="100%"
      />
      <small>
        {defaultName}
      </small>
      {#if !isValidPath(defaultName)}
        <small class="error"
          >{$i18n.t("modals.project.defaultName.invalid")}</small
        >
      {/if}
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.project.templates.name")}
      description={$i18n.t("modals.project.templates.description") ?? ""}
      vertical
    >
      <FileListInput
        buttonText="Add template"
        paths={project.templates ?? []}
        onPathsChange={(templates) => (project = { ...project, templates })}
      />
    </SettingItem>

    <SettingItem
      name={$i18n.t("modals.project.exclude.name")}
      description={$i18n.t("modals.project.exclude.description") ?? ""}
      vertical
    >
      <FileListInput
        buttonText="Add note"
        paths={project.excludedNotes ?? []}
        onPathsChange={(excludedNotes) =>
          (project = { ...project, excludedNotes })}
      />
    </SettingItem>
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant="primary"
      disabled={!!nameError}
      on:click={() => {
        onSave({
          ...project,
          templates: project.templates?.filter(notEmpty) ?? [],
        });
      }}>{cta}</Button
    >
  </ModalButtonGroup>
</ModalLayout>

<style>
  small {
    font-size: var(--font-ui-smaller);
    color: var(--text-accent);
    font-weight: var(--font-semibold);
  }
  .error {
    color: var(--text-error);
  }
</style>
