<script lang="ts">
  import { normalizePath, TFile } from "obsidian";
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    Select,
    SettingItem,
    TextInput,
  } from "obsidian-svelte";

  import { isValidPath } from "src/lib/obsidian";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import type { ProjectDefinition } from "src/settings/settings";
  import { onMount } from "svelte";

  let inputRef: HTMLInputElement;

  export let name: string;
  export let project: ProjectDefinition;
  export let onSave: (
    name: string,
    templatePath: string,
    project: ProjectDefinition
  ) => void;

  let templatePath = project.templates.at(0) ?? "";

  $: nameError = validateName(name);

  function getNewNotesFolder(project: ProjectDefinition) {
    if (project.newNotesFolder) {
      return project.newNotesFolder;
    }

    if (project.dataSource.kind === "folder") {
      return project.dataSource.config.path;
    }

    return "";
  }

  function validateName(name: string) {
    if (name.trim() === "") {
      return $i18n.t("modals.note.create.empty-name-error");
    }

    const existingFile = $app.vault.getAbstractFileByPath(
      normalizePath(getNewNotesFolder(project) + "/" + name + ".md")
    );

    if (existingFile instanceof TFile) {
      return $i18n.t("modals.note.create.name-taken-error");
    }

    if (!isValidPath(name)) {
      return $i18n.t("modals.project.defaultName.invalid");
    }

    if (name.startsWith(".")) {
      return $i18n.t("modals.note.create.dot-start-error");
    }

    return "";
  }

  onMount(() => {
    if (inputRef) inputRef.select();
  });
</script>

<ModalLayout title={$i18n.t("modals.note.create.title")}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("modals.note.create.name.name")}
      description={$i18n.t("modals.note.create.name.description") ?? ""}
    >
      <TextInput
        bind:ref={inputRef}
        value={name}
        on:input={({ detail: value }) => (name = value)}
        autoFocus
        error={!!nameError}
        helperText={nameError}
        on:keydown={(ev) => {
          if (ev.key === "Enter" && !nameError) {
            ev.preventDefault();
            onSave(name, templatePath, project);
          }
        }}
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

    {#if project.templates.length}
      <SettingItem
        name={$i18n.t("modals.note.create.templatePath.name")}
        description={$i18n.t("modals.note.create.templatePath.description") ??
          ""}
      >
        <Select
          value={templatePath}
          on:change={({ detail: value }) => (templatePath = value)}
          options={project.templates.map((path) => ({
            label: path,
            value: path,
          }))}
          placeholder={$i18n.t("modals.note.create.templatePath.none") ?? ""}
          allowEmpty
        />
      </SettingItem>
    {/if}
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant={"primary"}
      disabled={!!nameError}
      on:click={() => {
        onSave(name, templatePath, project);
      }}
    >
      {$i18n.t("modals.note.create.create")}
    </Button>
  </ModalButtonGroup>
</ModalLayout>
