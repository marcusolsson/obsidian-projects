<script lang="ts">
  import type { App } from "obsidian";
  import { Callout, Loading, Typography } from "obsidian-svelte";

  import type { DataSource } from "src/lib/data";
  import { DataviewDataSource } from "src/lib/datasources/dataview/dataview";
  import { FrontMatterDataSource } from "src/lib/datasources/frontmatter/frontmatter";
  import { dataFrame, dataSource } from "src/lib/stores/dataframe";
  import { settings } from "src/lib/stores/settings";
  import { app } from "src/lib/stores/obsidian";
  import type { ProjectDefinition } from "src/types";

  import Toolbar from "./toolbar/Toolbar.svelte";

  export let projects: ProjectDefinition[];
  export let projectId: string | undefined;
  export let viewId: string | undefined;

  $: defaultProject = projects.find((project) => project.isDefault);

  $: selectedProject =
    projects.find((project) => projectId === project.id) ||
    defaultProject ||
    projects[0];

  $: views = selectedProject?.views || [];

  $: selectedView = views.find((view) => viewId === view.id) || views[0];

  $: {
    if (selectedProject) {
      // Different projects can have different data sources.
      dataSource.set(resolveDataSource(selectedProject, $app));
    }
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
    return project.dataview
      ? new DataviewDataSource(app, project, $settings.preferences)
      : new FrontMatterDataSource(app, project, $settings.preferences);
  }

  const wait = () => new Promise((res) => setTimeout(res, 500));
</script>

<!--
	@component

	AppContainer manages switching between projects and views.
 -->
<div class="projects-container">
  <Toolbar
    {projects}
    projectId={selectedProject?.id}
    onProjectChange={(id) => (projectId = id)}
    viewId={selectedView?.id}
    onViewChange={(id) => (viewId = id)}
  />

  <div class="projects-main">
    {#await querying}
      {#await wait() then}
        <Loading />
      {/await}
    {:then}
      <slot
        project={selectedProject}
        view={selectedView}
        source={$dataSource}
        frame={$dataFrame}
      />
    {:catch error}
      <div style="padding: var(--size-4-3)">
        <Callout title={error.name} icon="zap" variant="danger">
          <Typography variant="body">{error.message}</Typography>
        </Callout>
      </div>
    {/await}
  </div>
</div>

<style>
  .projects-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .projects-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
</style>
