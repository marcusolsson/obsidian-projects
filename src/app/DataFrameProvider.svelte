<script lang="ts">
  import type { App } from "obsidian";
  import { Callout, Loading, Typography } from "obsidian-svelte";

  import type { DataSource } from "src/lib/data";
  import { DataviewDataSource } from "src/lib/datasources/dataview/dataview";
  import { FolderDataSource } from "src/lib/datasources/folder/folder";
  import { TagDataSource } from "src/lib/datasources/tag/tag";
  import { dataFrame, dataSource } from "src/lib/stores/dataframe";
  import { settings } from "src/lib/stores/settings";
  import { app } from "src/lib/stores/obsidian";
  import type { ProjectDefinition } from "src/settings/settings";

  export let project: ProjectDefinition;

  $: projectAsText = JSON.stringify(disassemble(project));
  $: reassembledProject = reassemble(projectAsText);

  // Different projects can have different data sources.
  $: dataSource.set(resolveDataSource(reassembledProject, $app));

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

  // resolveDataSource selects the data source to use based on the project
  // settings.
  function resolveDataSource(project: ProjectDefinition, app: App): DataSource {
    switch (project.dataSource.kind) {
      case "dataview":
        return new DataviewDataSource(app, project, $settings.preferences);
      case "tag":
        return new TagDataSource(app, project, $settings.preferences);
      default:
        return new FolderDataSource(app, project, $settings.preferences);
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
