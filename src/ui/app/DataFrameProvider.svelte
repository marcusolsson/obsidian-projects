<script lang="ts">
  import { getAPI, isPluginEnabled, type DataviewApi } from "obsidian-dataview";
  import { Callout, Loading, Typography } from "obsidian-svelte";
  import type { DataSource } from "../../lib/datasources";
  import { FolderDataSource } from "src/lib/datasources/folder/datasource";
  import { TagDataSource } from "src/lib/datasources/tag/datasource";
  import { dataFrame, dataSource } from "src/lib/stores/dataframe";
  import { fileSystem } from "src/lib/stores/fileSystem";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import type { ProjectDefinition } from "src/settings/settings";
  import { get } from "svelte/store";
  import {
    DataviewDataSource,
    UnsupportedCapability,
  } from "src/lib/datasources/dataview/datasource";

  export let project: ProjectDefinition;

  // These shenanigans prevent queries to run when any of the views change.
  // Even if an object didn't change, reassigning it still causes an update.
  $: disassembedProject = disassemble(project);

  // Strings are different though. Even if you reassign a string value, it won't
  // trigger an update if it's the same string.
  $: projectAsText = JSON.stringify(disassembedProject);

  // This only runs if the JSON representation of a project (without views) has
  // changed.
  $: reassembledProject = reassemble(projectAsText);

  // Setting a new data source causes the query to run.
  $: dataSource.set(resolveDataSource(reassembledProject));

  function disassemble(
    project: ProjectDefinition
  ): Omit<ProjectDefinition, "views"> {
    const { views: _, ...foo } = project;
    return foo;
  }

  function reassemble(text: string): ProjectDefinition {
    const res: Omit<ProjectDefinition, "views"> = JSON.parse(text);
    return { ...res, views: [] };
  }

  let querying: Promise<void>;

  $: {
    // Perform a full refresh of the data frame whenever the data source
    // changes.
    querying = (async () => {
      if ($dataSource) {
        dataFrame.set(await $dataSource.queryAll());
      }
    })();
  }

  function getDataviewAPI(): DataviewApi | undefined {
    if (isPluginEnabled($app)) {
      return getAPI($app);
    } else {
      throw new UnsupportedCapability(
        get(i18n).t("errors.missingDataview.message")
      );
    }
  }

  // resolveDataSource selects the data source to use based on the project
  // settings.
  function resolveDataSource(project: ProjectDefinition): DataSource {
    switch (project.dataSource.kind) {
      case "dataview":
        const dataviewApi = getDataviewAPI();

        if (!dataviewApi) {
          throw new Error(
            "Couldn't connect to Dataview. Is the Dataview plugin enabled?"
          );
        }

        return new DataviewDataSource(
          $fileSystem,
          project,
          $settings.preferences,
          dataviewApi
        );
      case "tag":
        return new TagDataSource($fileSystem, project, $settings.preferences);
      default:
        return new FolderDataSource(
          $fileSystem,
          project,
          $settings.preferences
        );
    }
  }

  const wait = () => new Promise((res) => setTimeout(res, 500));
</script>

{#await querying}
  {#await wait() then}
    <Loading />
  {/await}
{:then}
  <slot frame={$dataFrame} source={$dataSource} />
{:catch error}
  <div style="padding: var(--size-4-3)">
    <Callout title={error.name} icon="zap" variant="danger">
      <Typography variant="body">{error.message}</Typography>
    </Callout>
  </div>
{/await}
