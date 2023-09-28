<script lang="ts">
  import moment from "moment";
  import {
    Button,
    Callout,
    FileAutocomplete,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
    Switch,
    TextArea,
    TextInput,
    Typography,
  } from "obsidian-svelte";

  import { FileListInput } from "src/ui/components/FileListInput";
  import { Accordion, AccordionItem } from "src/ui/components/Accordion";
  import { notEmpty } from "src/lib/helpers";
  import { getFoldersInFolder, isValidPath } from "src/lib/obsidian";
  import { capabilities } from "src/lib/stores/capabilities";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { interpolateTemplate } from "src/lib/templates/interpolate";
  import type { ProjectDefinition } from "src/settings/settings";

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

  const dataSourceOptions = [
    { label: $i18n.t("datasources.folder"), value: "folder" },
    { label: $i18n.t("datasources.tag"), value: "tag" },
  ];

  if ($capabilities.dataview) {
    dataSourceOptions.push({
      label: $i18n.t("datasources.dataview"),
      value: "dataview",
    });
  }

  function handleDataSourceChange({ detail: value }: CustomEvent<string>) {
    switch (value) {
      case "folder":
        project = {
          ...project,
          dataSource: {
            kind: "folder",
            config: { path: "", recursive: false },
          },
        };
        break;
      case "tag":
        project = {
          ...project,
          dataSource: { kind: "tag", config: { tag: "", hierarchy: false } },
        };
        break;
      case "dataview":
        project = {
          ...project,
          dataSource: { kind: "dataview", config: { query: "" } },
        };
        break;
    }
  }

  function validateName(name: string) {
    if (name === originalName) {
      return "";
    }

    if (name.trim() === "") {
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

    <SettingItem
      name={$i18n.t("modals.project.datasource.name")}
      description={$i18n.t("modals.project.datasource.description")}
    >
      <Select
        value={project.dataSource.kind}
        options={dataSourceOptions}
        on:change={handleDataSourceChange}
      />
    </SettingItem>

    {#if project.dataSource.kind === "folder"}
      <SettingItem
        name={$i18n.t("modals.project.path.name")}
        description={$i18n.t("modals.project.path.description") ?? ""}
        vertical
      >
        <FileAutocomplete
          files={getFoldersInFolder($app.vault.getRoot())}
          value={project.dataSource.config.path}
          on:change={({ detail: path }) => {
            if (project.dataSource.kind === "folder") {
              project = {
                ...project,
                dataSource: {
                  kind: project.dataSource.kind,
                  config: { ...project.dataSource.config, path },
                },
              };
            }
          }}
          getLabel={(file) => file.path}
          placeholder={"/"}
          width="100%"
        />
      </SettingItem>

      <SettingItem
        name={$i18n.t("modals.project.recursive.name")}
        description={$i18n.t("modals.project.recursive.description") ?? ""}
      >
        <Switch
          checked={project.dataSource.config.recursive}
          on:check={({ detail: recursive }) => {
            if (project.dataSource.kind === "folder") {
              project = {
                ...project,
                dataSource: {
                  kind: project.dataSource.kind,
                  config: { ...project.dataSource.config, recursive },
                },
              };
            }
          }}
        />
      </SettingItem>
    {/if}

    {#if project.dataSource.kind === "tag"}
      <SettingItem
        name={$i18n.t("modals.project.tag.name")}
        description={$i18n.t("modals.project.tag.description") ?? ""}
        vertical
      >
        <TextInput
          placeholder="#tag"
          value={project.dataSource.config.tag ?? ""}
          on:input={({ detail: tag }) => {
            if (project.dataSource.kind === "tag") {
              project = {
                ...project,
                dataSource: {
                  kind: project.dataSource.kind,
                  config: { ...project.dataSource.config, tag },
                },
              };
            }
          }}
          width="100%"
        />
      </SettingItem>

      <SettingItem
        name={$i18n.t("modals.project.hierarchy.name")}
        description={$i18n.t("modals.project.hierarchy.description")}
      >
        <Switch
          checked={project.dataSource.config.hierarchy}
          on:check={({ detail: hierarchy }) => {
            if (project.dataSource.kind === "tag") {
              project = {
                ...project,
                dataSource: {
                  kind: project.dataSource.kind,
                  config: { ...project.dataSource.config, hierarchy },
                },
              };
            }
          }}
        />
      </SettingItem>
    {/if}

    {#if project.dataSource.kind === "dataview"}
      {#if $capabilities.dataview}
        <SettingItem
          name={$i18n.t("modals.project.query.name")}
          description={$i18n.t("modals.project.query.description") ?? ""}
          vertical
        >
          <TextArea
            placeholder={`TABLE status AS "Status" FROM "Work"`}
            value={project.dataSource.config.query ?? ""}
            on:input={({ detail: query }) => {
              if (project.dataSource.kind === "dataview") {
                project = {
                  ...project,
                  dataSource: {
                    kind: project.dataSource.kind,
                    config: { ...project.dataSource.config, query },
                  },
                };
              }
            }}
            rows={6}
            width="100%"
          />
        </SettingItem>
      {:else}
        <Callout
          title={$i18n.t("modals.project.dataview.error.title")}
          icon="zap"
          variant="danger"
        >
          <Typography variant="body">
            {$i18n.t("modals.project.dataview.error.message")}
          </Typography>
        </Callout>
      {/if}
    {/if}

    <Accordion>
      <AccordionItem>
        <div slot="header" class="setting-item-info" style:margin-top="8px">
          <div class="setting-item-name">
            {$i18n.t("modals.project.more-settings.name")}
          </div>
        </div>
        <SettingItem
          name={$i18n.t("modals.project.newNotesFolder.name")}
          description={$i18n.t("modals.project.newNotesFolder.description") ??
            ""}
        >
          <FileAutocomplete
            files={getFoldersInFolder($app.vault.getRoot())}
            value={project.newNotesFolder}
            placeholder={project.dataSource.kind === "folder"
              ? project.dataSource.config.path
              : "/"}
            on:change={({ detail: newNotesFolder }) => {
              project = {
                ...project,
                newNotesFolder,
              };
            }}
            getLabel={(file) => file.path}
          />
        </SettingItem>

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
            buttonText={$i18n.t("modals.project.templates.add")}
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
            buttonText={$i18n.t("modals.project.exclude.add")}
            paths={project.excludedNotes ?? []}
            onPathsChange={(excludedNotes) =>
              (project = { ...project, excludedNotes })}
          />
        </SettingItem>
      </AccordionItem>
    </Accordion>
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
